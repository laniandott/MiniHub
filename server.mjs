import { createServer } from 'node:http'
import { readFile, readdir } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'
import { Readable } from 'node:stream'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('.', import.meta.url))
const port = Number(process.env.PORT || 4175)
const REQUEST_TIMEOUT_MS = 1800
const MAX_BODY_BYTES = 128 * 1024
const serviceUrls = {
  tagtime: process.env.TAGTIME_URL || 'http://127.0.0.1:3000',
  alist: process.env.ALIST_URL || 'http://127.0.0.1:5244',
  poco: process.env.POCO_URL || 'http://127.0.0.1:3100',
  entropy: process.env.ENTROPY_URL || 'http://localhost:8081',
  monly: process.env.MONLY_URL || 'http://127.0.0.1:4174',
  pigallery2: process.env.PIGALLERY2_URL || 'http://127.0.0.1:8080',
  vaultwarden: process.env.VAULTWARDEN_URL || 'http://127.0.0.1:8000'
}
const pigallery2MediaRoot = process.env.PIGALLERY2_MEDIA_ROOT || 'F:\\WebDAV\\照片'
const types = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg'
}

function serviceUrl(name, path = '/') {
  return new URL(path, `${serviceUrls[name]}/`).toString()
}

async function fetchJson(name, path, options = {}) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  try {
    const result = await fetch(serviceUrl(name, path), { ...options, signal: controller.signal })
    if (!result.ok) throw new Error(`${name} returned ${result.status}`)
    return await result.json()
  } finally {
    clearTimeout(timeout)
  }
}

async function fetchText(name, path) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  try {
    const result = await fetch(serviceUrl(name, path), { signal: controller.signal })
    if (!result.ok) throw new Error(`${name} returned ${result.status}`)
    return await result.text()
  } finally {
    clearTimeout(timeout)
  }
}

async function safeFetch(fetcher) {
  try {
    return await fetcher()
  } catch {
    return null
  }
}

function unwrapData(value) {
  return value && Object.prototype.hasOwnProperty.call(value, 'data') ? value.data : value
}

function headerValue(value) {
  return Array.isArray(value) ? value[0] || '' : typeof value === 'string' ? value : ''
}

async function readJsonBody(request) {
  const chunks = []
  let size = 0
  for await (const chunk of request) {
    size += chunk.length
    if (size > MAX_BODY_BYTES) throw Object.assign(new Error('Request body too large'), { status: 413 })
    chunks.push(chunk)
  }
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}') } catch { throw Object.assign(new Error('Invalid JSON'), { status: 400 }) }
}

function normalizeWebDavConfig(payload) {
  let url
  try {
    url = new URL(String(payload.url || '').trim())
    if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Unsupported protocol')
  } catch { throw Object.assign(new Error('WebDAV 地址无效'), { status: 400 }) }
  if (!url.pathname.endsWith('/')) url.pathname += '/'
  return {
    url,
    username: String(payload.username || ''),
    password: String(payload.password || ''),
    path: String(payload.path || '')
  }
}

function webDavUrl(config, path = '') {
  const target = path ? new URL(path, config.url) : new URL(config.url)
  const basePath = config.url.pathname.endsWith('/') ? config.url.pathname : `${config.url.pathname}/`
  if (target.origin !== config.url.origin || (target.pathname !== config.url.pathname && !target.pathname.startsWith(basePath))) {
    throw Object.assign(new Error('WebDAV 路径无效'), { status: 400 })
  }
  return target
}

function webDavHeaders(config, extra = {}) {
  const headers = { accept: 'application/xml, text/xml;q=0.9, */*;q=0.8', ...extra }
  if (config.username || config.password) headers.authorization = `Basic ${Buffer.from(`${config.username}:${config.password}`).toString('base64')}`
  return headers
}

async function fetchWebDav(config, path, options = {}) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  try {
    const result = await fetch(webDavUrl(config, path), {
      ...options,
      headers: webDavHeaders(config, options.headers),
      signal: controller.signal
    })
    if (!result.ok) throw Object.assign(new Error(`WebDAV returned ${result.status}`), { status: result.status })
    return result
  } finally {
    clearTimeout(timeout)
  }
}

function decodeXml(value) {
  return String(value || '').replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').replace(/&#(x?[\da-f]+);/gi, (_, code) => String.fromCodePoint(Number(code[0].toLowerCase() === 'x' ? parseInt(code.slice(1), 16) : code))).replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').trim()
}

function xmlText(block, tag) {
  const pattern = new RegExp(`<(?:(?:[A-Za-z_][\\w.-]*):)?${tag}\\b[^>]*>([\\s\\S]*?)<\\/(?:(?:[A-Za-z_][\\w.-]*):)?${tag}>`, 'i')
  return decodeXml(block.match(pattern)?.[1])
}

function parseWebDavEntries(xml, currentUrl) {
  const blocks = xml.match(/<(?:(?:[A-Za-z_][\w.-]*):)?response\b[^>]*>[\s\S]*?<\/(?:(?:[A-Za-z_][\w.-]*):)?response>/gi) || []
  return blocks.map((block) => {
    const href = xmlText(block, 'href')
    if (!href) return null
    let url
    try { url = new URL(href, currentUrl) } catch { return null }
    const isDirectory = /<(?:(?:[A-Za-z_][\w.-]*):)?collection\b/i.test(xmlText(block, 'resourcetype'))
    const path = `${url.pathname}${url.search}`
    const fallbackName = decodeURIComponent(url.pathname.split('/').filter(Boolean).pop() || '根目录')
    return {
      name: xmlText(block, 'displayname') || fallbackName,
      path: isDirectory && !path.endsWith('/') ? `${path}/` : path,
      isDirectory,
      size: xmlText(block, 'getcontentlength') ? Number(xmlText(block, 'getcontentlength')) : null,
      modified: xmlText(block, 'getlastmodified') || null
    }
  }).filter((entry) => entry && entry.path !== `${currentUrl.pathname}${currentUrl.search}`).sort((a, b) => Number(b.isDirectory) - Number(a.isDirectory) || a.name.localeCompare(b.name, 'zh-CN'))
}

function parentWebDavPath(pathname, basePath) {
  const current = pathname.endsWith('/') ? pathname : `${pathname}/`
  const base = basePath.endsWith('/') ? basePath : `${basePath}/`
  if (current === base) return null
  return `${current.split('/').slice(0, -2).join('/')}/`
}

async function listWebDav(payload) {
  const config = normalizeWebDavConfig(payload)
  const target = webDavUrl(config, config.path)
  const body = '<?xml version="1.0" encoding="utf-8"?><propfind xmlns="DAV:"><prop><displayname/><getcontentlength/><getlastmodified/><resourcetype/></prop></propfind>'
  const result = await fetchWebDav(config, config.path, { method: 'PROPFIND', headers: { depth: '1', 'content-type': 'application/xml; charset=utf-8' }, body })
  const entries = parseWebDavEntries(await result.text(), target)
  return {
    path: config.path,
    currentPath: target.pathname,
    parentPath: parentWebDavPath(target.pathname, config.url.pathname),
    entries
  }
}

async function actionWebDav(payload) {
  const config = normalizeWebDavConfig(payload)
  const actions = { mkdir: 'MKCOL', delete: 'DELETE', rename: 'MOVE', move: 'MOVE', copy: 'COPY' }
  const method = actions[payload.action]
  if (!method) throw Object.assign(new Error('WebDAV 操作无效'), { status: 400 })
  const headers = {}
  if (['rename', 'move', 'copy'].includes(payload.action)) {
    if (!payload.destination) throw Object.assign(new Error('目标路径不能为空'), { status: 400 })
    headers.destination = webDavUrl(config, String(payload.destination)).toString()
    headers.overwrite = 'F'
  }
  const result = await fetchWebDav(config, config.path, { method, headers })
  await result.arrayBuffer()
  return { ok: true }
}

function webDavError(error) {
  if (error.status === 401 || error.status === 403) return 'WebDAV 登录失败，请检查用户名和密码。'
  if (error.status === 404) return 'WebDAV 地址或目录不存在。'
  return error.status === 400 ? error.message : 'WebDAV 服务暂时不可用。'
}

function finiteNumber(value, fallback = 0) {
  if (value === null || value === undefined || value === '') return fallback
  const number = Number(value)
  return Number.isFinite(number) ? number : fallback
}

function latestMetric(metrics, key) {
  return metrics
    .filter((metric) => metric.metric_key === key)
    .sort((a, b) => Date.parse(b.metric_date || '') - Date.parse(a.metric_date || ''))[0] || null
}

function normalizeStatus(healthy, partial = false) {
  if (!healthy) return { statusLabel: '暂不可用', statusClass: 'orange', source: 'offline' }
  if (partial) return { statusLabel: '部分在线', statusClass: 'orange', source: 'live' }
  return { statusLabel: '运行正常', statusClass: 'green', source: 'live' }
}

async function loadTagTime() {
  const from = encodeURIComponent(new Date().toISOString())
  const to = encodeURIComponent(new Date(Date.now() + 7 * 86400000).toISOString())
  const [timer, summary, memos, notes, todos, events] = await Promise.all([
    safeFetch(() => fetchJson('tagtime', '/api/timer/current')),
    safeFetch(() => fetchJson('tagtime', '/api/stats/summary')),
    safeFetch(() => fetchJson('tagtime', '/api/memos?days=3')),
    safeFetch(() => fetchJson('tagtime', '/api/notes')),
    safeFetch(() => fetchJson('tagtime', '/api/todos')),
    safeFetch(() => fetchJson('tagtime', `/api/calendars/external-events?from=${from}&to=${to}`))
  ])
  const running = Array.isArray(timer?.running) ? timer.running : []
  const current = running[0] || null
  const hasData = Boolean(timer || summary || memos || notes)
  const partial = !timer || !summary
  const status = normalizeStatus(hasData, partial)
  const label = current?.tag?.name || current?.note || '暂无活动'
  return {
    ...status,
    summary: !hasData ? '服务暂不可用' : current ? `正在计时 · ${label}` : `今日累计 · ${Math.round(finiteNumber(summary?.today) / 3600000 * 10) / 10} 小时`,
    timer: {
      active: Boolean(current),
      count: running.length,
      label,
      icon: current?.tag?.icon || '',
      startedAt: current?.startTime || null,
      elapsedMs: current?.startTime ? Math.max(0, Date.now() - Date.parse(current.startTime)) : 0
    },
    todayMs: finiteNumber(summary?.today),
    todayByCategory: Array.isArray(summary?.todayByCategory) ? summary.todayByCategory : [],
    memos: Array.isArray(memos) ? memos.slice(0, 4).map((memo) => ({
      content: memo.content || '',
      createdAt: memo.createdAt || null,
      tag: memo.tag?.name || ''
    })) : [],
    notes: Array.isArray(notes) ? notes.slice(0, 4).map((note) => ({
      id: note.id || '',
      title: note.title || note.path || '未命名笔记',
      updatedAt: note.updatedAt || note.createdAt || null
    })) : [],
    todos: Array.isArray(todos) ? todos.filter((todo) => todo.status !== 'done').slice(0, 5).map((todo) => ({
      id: todo.id || '',
      title: todo.title || '未命名待办',
      dueDate: todo.dueDate || null,
      priority: finiteNumber(todo.priority),
      category: todo.category?.name || ''
    })) : [],
    events: Array.isArray(events) ? events.slice(0, 5).map((event) => ({
      title: event.summary || '未命名日程',
      start: event.dtstart || null,
      end: event.dtend || null,
      allday: Boolean(event.allday),
      calendar: event.subscription?.name || ''
    })) : []
  }
}

async function loadAlist(requestToken = '') {
  const token = requestToken.trim() || process.env.ALIST_TOKEN || ''
  const authConfigured = Boolean(token)
  const headers = authConfigured ? { authorization: token } : {}
  const [home, storage] = await Promise.all([
    safeFetch(() => fetchText('alist', '/')),
    safeFetch(() => fetchJson('alist', '/api/admin/storage/list', { headers }))
  ])
  const authorized = Boolean(storage && storage.code === 200)
  const rawEntries = unwrapData(storage)?.content || unwrapData(storage) || []
  const entries = Array.isArray(rawEntries) ? rawEntries.map((entry) => ({
    name: entry.name || entry.mount_path || entry.driver || '未命名存储',
    path: entry.mount_path || entry.path || '',
    driver: entry.driver || ''
  })) : []
  const online = Boolean(home || storage)
  const status = normalizeStatus(online, online && !authorized)
  return {
    ...status,
    statusLabel: authorized ? status.statusLabel : online ? '需要登录' : status.statusLabel,
    summary: authorized ? `${entries.length} 个存储 · 可访问` : online ? (authConfigured ? '服务在线 · 授权无效' : '服务在线 · 等待授权') : '服务暂不可用',
    authorized,
    authConfigured,
    entries
  }
}

async function loadPoco() {
  const [health, ready, taskPayload, metricPayload] = await Promise.all([
    safeFetch(() => fetchJson('poco', '/health')),
    safeFetch(() => fetchJson('poco', '/ready')),
    safeFetch(() => fetchJson('poco', '/api/v1/tasks?limit=5')),
    safeFetch(() => fetchJson('poco', '/api/v1/metrics'))
  ])
  const tasks = Array.isArray(unwrapData(taskPayload)) ? unwrapData(taskPayload).slice(0, 5) : []
  const metrics = Array.isArray(unwrapData(metricPayload)) ? unwrapData(metricPayload) : []
  const totalTracked = latestMetric(metrics, 'total_tracked_min')
  const switchCount = latestMetric(metrics, 'switch_count')
  const entropyScore = latestMetric(metrics, 'time_entropy_score')
  const highEntropy = latestMetric(metrics, 'high_entropy_duration_min')
  const hasData = Boolean(health || ready || taskPayload || metricPayload)
  const partial = !health || !ready || !taskPayload
  const status = normalizeStatus(hasData, partial)
  const active = tasks.filter((task) => ['queued', 'running', 'pending', 'retrying'].includes(task.status)).length
  const failed = tasks.filter((task) => ['failed', 'permanently_failed'].includes(task.status)).length
  const latestSync = tasks.find((task) => task.task_type === 'source_sync')
  return {
    ...status,
    summary: !hasData ? '服务暂不可用' : active ? `当前任务 · ${active} 个处理中` : failed ? `最近任务 · ${failed} 个失败` : `最近任务 · ${tasks.length} 条记录`,
    tasks: tasks.map((task) => ({
      name: task.task_type || '未命名任务',
      status: task.status || 'unknown',
      progress: finiteNumber(task.progress),
      finishedAt: task.finished_at || task.started_at || null
    })),
    metrics: {
      trackedMin: finiteNumber(totalTracked?.metric_value_numeric),
      switchCount: finiteNumber(switchCount?.metric_value_numeric),
      entropyScore: entropyScore ? finiteNumber(entropyScore.metric_value_numeric, null) : null,
      highEntropyMin: finiteNumber(highEntropy?.metric_value_numeric),
      updatedAt: totalTracked?.metric_date || switchCount?.metric_date || null
    },
    insight: highEntropy ? `最近一次指标记录显示，高熵行为累计 ${Math.round(finiteNumber(highEntropy.metric_value_numeric))} 分钟。` : '暂时没有新的洞察。',
    latestSync: latestSync?.finished_at || null
  }
}

function firstNumber(value, keys) {
  for (const key of keys) {
    if (value && value[key] !== undefined && value[key] !== null) return finiteNumber(value[key], null)
  }
  return null
}

async function loadEntropy() {
  const day = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai' }).format(new Date())
  const [health, today, trend, alert, sync, reflection] = await Promise.all([
    safeFetch(() => fetchJson('entropy', '/api/health')),
    safeFetch(() => fetchJson('entropy', '/api/dashboard/today')),
    safeFetch(() => fetchJson('entropy', '/api/dashboard/trend?range=week')),
    safeFetch(() => fetchJson('entropy', '/api/dashboard/alert')),
    safeFetch(() => fetchJson('entropy', '/api/sync/status')),
    safeFetch(() => fetchJson('entropy', `/api/reflection/${day}`))
  ])
  const todayData = unwrapData(today) || {}
  const alertData = unwrapData(alert) || {}
  const reflectionData = unwrapData(reflection) || {}
  const trendData = unwrapData(trend)
  const points = Array.isArray(trendData) ? trendData : trendData?.points || trendData?.items || []
  const hasData = Boolean(health || today || trend || alert || sync || reflection)
  const status = normalizeStatus(hasData, !today || !trend)
  const score = firstNumber(todayData, ['score', 'entropy_score', 'time_entropy_score', 'value'])
  const highEntropyMin = firstNumber(todayData, ['high_entropy_duration_min']) ?? firstNumber(alertData, ['high_entropy_min']) ?? 0
  const threshold = firstNumber(alertData, ['threshold']) ?? 120
  return {
    ...status,
    summary: score === null ? (hasData ? '服务在线 · 等待今日数据' : '服务暂不可用') : `今日熵值 ${Math.round(score)} · ${alertData.alert ? '有预警' : '无预警'}`,
    score,
    trend: points.map((point) => firstNumber(point, ['score', 'entropy_score', 'value']) ?? 0),
    alert: Boolean(alertData.alert || alertData.triggered || alertData.has_alert),
    highEntropyMin,
    threshold,
    ranking: Array.isArray(todayData.high_entropy_ranking) ? todayData.high_entropy_ranking : (Array.isArray(alertData.ranking) ? alertData.ranking : []),
    switchCount: firstNumber(todayData, ['switch_count']) ?? 0,
    trackedMin: firstNumber(todayData, ['total_tracked_min']) ?? 0,
    sync: unwrapData(sync)?.status || unwrapData(sync)?.state || null,
    syncedAt: unwrapData(sync)?.last_sync_at || null,
    reflection: {
      energy: reflectionData.energy_level ?? null,
      journal: reflectionData.journal_note || '',
      action: reflectionData.anti_entropy_action || '',
      actionCompleted: Boolean(reflectionData.action_completed),
      date: reflectionData.date || day
    }
  }
}

function collectionValues(value) {
  if (Array.isArray(value)) return value
  return value && typeof value === 'object' ? Object.values(value) : []
}

function shiftDateKey(key, days) {
  const [year, month, day] = key.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day + days))
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`
}

function monlyEntries(voucher) {
  if (Array.isArray(voucher?.entries) && voucher.entries.length) {
    const entries = voucher.entries
      .filter((entry) => entry && entry.debit && entry.credit && finiteNumber(entry.amount) > 0)
      .map((entry) => ({ debit: String(entry.debit), credit: String(entry.credit), amount: finiteNumber(entry.amount), summary: entry.summary || voucher.summary || '' }))
    if (entries.length) return entries
  }
  return voucher?.debit && voucher?.credit && finiteNumber(voucher.amount) > 0
    ? [{ debit: String(voucher.debit), credit: String(voucher.credit), amount: finiteNumber(voucher.amount), summary: voucher.summary || '' }]
    : []
}

function monlyVoucherTotal(voucher) {
  return monlyEntries(voucher).reduce((sum, entry) => sum + entry.amount, 0)
}

function isMonlyClosingVoucher(voucher) {
  return voucher?.source === '系统结转' || voucher?.kind === '结转' || String(voucher?.id || '').startsWith('closing-')
}

function monlyAccountNames(entries, key, accountMap) {
  const names = [...new Set(entries.map((entry) => accountMap.get(entry[key])?.name || entry[key]))]
  return names.length > 3 ? `${names.slice(0, 2).join('、')} 等${names.length}项` : names.join('、')
}

function monlyBalances(accounts, vouchers) {
  const balances = Object.fromEntries(accounts.map((account) => [account.id, finiteNumber(account.balance)]))
  for (const voucher of vouchers) {
    for (const entry of monlyEntries(voucher)) {
      balances[entry.debit] = (balances[entry.debit] || 0) + entry.amount
      balances[entry.credit] = (balances[entry.credit] || 0) - entry.amount
    }
  }
  const parentOf = new Map(accounts.map((account) => [account.id, account.parent]))
  const depthOf = (id) => {
    let depth = 0
    let parent = parentOf.get(id)
    while (parent && depth < 8) {
      depth += 1
      parent = parentOf.get(parent)
    }
    return depth
  }
  for (const account of [...accounts].sort((a, b) => depthOf(b.id) - depthOf(a.id))) {
    if (account.parent) balances[account.parent] = (balances[account.parent] || 0) + (balances[account.id] || 0)
  }
  return balances
}

async function loadMonly() {
  const [home, sync, closing] = await Promise.all([
    safeFetch(() => fetchText('monly', '/')),
    safeFetch(() => fetchJson('monly', '/api/sync')),
    safeFetch(() => fetchJson('monly', '/api/closing'))
  ])
  const accounts = collectionValues(sync?.accounts).filter((account) => account && account.id)
  const vouchers = collectionValues(sync?.vouchers).filter((voucher) => voucher && !voucher.deleted)
  const accountMap = new Map(accounts.map((account) => [account.id, account]))
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai' }).format(new Date())
  const periodStart = shiftDateKey(today, -2)
  const recentVouchers = vouchers
    .filter((voucher) => String(voucher.date || '').slice(0, 10) >= periodStart && String(voucher.date || '').slice(0, 10) <= today)
    .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')) || String(b.id || '').localeCompare(String(a.id || '')))
  const reportVouchers = recentVouchers.filter((voucher) => !isMonlyClosingVoucher(voucher))
  const daily = [periodStart, shiftDateKey(periodStart, 1), today].map((date) => {
    let income = 0
    let expense = 0
    const dayVouchers = reportVouchers.filter((voucher) => String(voucher.date || '').startsWith(date))
    for (const voucher of dayVouchers) {
      for (const entry of monlyEntries(voucher)) {
        const debitType = accountMap.get(entry.debit)?.type
        const creditType = accountMap.get(entry.credit)?.type
        if (debitType === '费用') expense += entry.amount
        if (creditType === '费用') expense -= entry.amount
        if (creditType === '收入') income += entry.amount
        if (debitType === '收入') income -= entry.amount
      }
    }
    return { date, voucherCount: dayVouchers.length, income, expense, surplus: income - expense }
  })
  const recentReport = daily.reduce((report, day) => ({
    income: report.income + day.income,
    expense: report.expense + day.expense,
    voucherCount: report.voucherCount + day.voucherCount
  }), { income: 0, expense: 0, voucherCount: 0 })
  const balances = monlyBalances(accounts, vouchers)
  const assets = accounts.filter((account) => account.type === '资产' && !account.parent)
    .map((account) => ({ name: account.name || account.id, balance: balances[account.id] || 0 }))
    .filter((account) => Math.abs(account.balance) >= 0.005)
  const totalAssets = assets.reduce((sum, account) => sum + account.balance, 0)
  const liabilities = accounts.filter((account) => account.type === '负债' && !account.parent)
    .map((account) => ({ name: account.name || account.id, balance: Math.max(0, -(balances[account.id] || 0)) }))
    .filter((account) => account.balance >= 0.005)
  const hasData = Boolean(home || sync || closing)
  const status = normalizeStatus(hasData, !sync || !closing)
  const closings = closing?.closings && typeof closing.closings === 'object' ? Object.values(closing.closings) : []
  return {
    ...status,
    summary: !hasData ? '服务暂不可用' : sync ? `${accounts.length} 个账户 · 近三日 ${recentVouchers.length} 笔凭证` : '服务在线 · 等待同步',
    revision: sync?.revision || 0,
    accountsCount: accounts.length,
    vouchersCount: vouchers.length,
    updatedAt: sync?.updatedAt || null,
    currentMonth: closing?.currentMonth || null,
    closingCount: closings.length,
    latestClosing: closings.sort((a, b) => Date.parse(b.closedAt || '') - Date.parse(a.closedAt || ''))[0] || null,
    periodStart,
    periodEnd: today,
    recentVouchers: recentVouchers.slice(0, 12).map((voucher) => {
      const entries = monlyEntries(voucher)
      return {
        date: voucher.date || '',
        summary: voucher.summary || entries[0]?.summary || '未命名凭证',
        amount: monlyVoucherTotal(voucher),
        source: voucher.source || '',
        debit: monlyAccountNames(entries, 'debit', accountMap),
        credit: monlyAccountNames(entries, 'credit', accountMap)
      }
    }),
    report: {
      ...recentReport,
      surplus: recentReport.income - recentReport.expense,
      daily
    },
    balances: {
      totalAssets,
      assets: assets.slice(0, 8),
      liabilities: liabilities.slice(0, 5),
      totalLiabilities: liabilities.reduce((sum, account) => sum + account.balance, 0)
    }
  }
}

async function readPiGallery2Stats() {
  try {
    const entries = await readdir(pigallery2MediaRoot, { withFileTypes: true })
    return {
      albums: entries.filter((entry) => entry.isDirectory()).length,
      files: entries.filter((entry) => entry.isFile()).length
    }
  } catch {
    return null
  }
}

async function loadPiGallery2() {
  const [home, media] = await Promise.all([
    safeFetch(() => fetchText('pigallery2', '/')),
    readPiGallery2Stats()
  ])
  const hasData = Boolean(home || media)
  const status = normalizeStatus(hasData, !media)
  return {
    ...status,
    summary: !hasData ? '服务暂不可用' : media ? `${media.albums} 个相册 · 图库在线` : '服务在线 · 等待图库统计',
    version: process.env.PIGALLERY2_VERSION || '3.6.0-edge',
    albums: media?.albums || 0,
    files: media?.files || 0,
    mediaConfigured: Boolean(media)
  }
}

async function loadVaultwarden() {
  const [home, config] = await Promise.all([
    safeFetch(() => fetchText('vaultwarden', '/')),
    safeFetch(() => fetchJson('vaultwarden', '/api/config'))
  ])
  const hasData = Boolean(home || config)
  const status = normalizeStatus(hasData, !config)
  const version = config?.version || null
  return {
    ...status,
    summary: !hasData ? '服务暂不可用' : version ? `版本 ${version} · 密码库在线` : '服务在线 · 等待配置',
    version,
    webVaultReady: Boolean(home),
    vaultContentsHidden: true
  }
}

async function getProjectsData(alistToken = '') {
  const [tagtime, alist, poco, entropy, monly, pigallery2, vaultwarden] = await Promise.all([
    loadTagTime(),
    loadAlist(alistToken),
    loadPoco(),
    loadEntropy(),
    loadMonly(),
    loadPiGallery2(),
    loadVaultwarden()
  ])
  return {
    generatedAt: new Date().toISOString(),
    projects: { tagtime, alist, poco, entropy, monly, pigallery2, vaultwarden }
  }
}

createServer(async (request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, `http://${request.headers.host}`).pathname)
  const todoToggle = pathname.match(/^\/api\/actions\/tagtime\/todos\/([^/]+)\/toggle$/)
  if (request.method === 'POST' && todoToggle) {
    try {
      const result = await fetchJson('tagtime', `/api/todos/${encodeURIComponent(todoToggle[1])}/toggle`, { method: 'PATCH' })
      response.writeHead(200, { 'content-type': types['.json'], 'cache-control': 'no-store' })
      response.end(JSON.stringify(result))
    } catch {
      response.writeHead(502, { 'content-type': types['.json'] })
      response.end(JSON.stringify({ error: 'Todo service unavailable' }))
    }
    return
  }

  if (request.method === 'POST' && pathname === '/api/alist/webdav/list') {
    try {
      const result = await listWebDav(await readJsonBody(request))
      response.writeHead(200, { 'content-type': types['.json'], 'cache-control': 'no-store' })
      response.end(JSON.stringify(result))
    } catch (error) {
      response.writeHead(error.status || 502, { 'content-type': types['.json'], 'cache-control': 'no-store' })
      response.end(JSON.stringify({ error: webDavError(error) }))
    }
    return
  }

  if (request.method === 'POST' && pathname === '/api/alist/webdav/action') {
    try {
      const result = await actionWebDav(await readJsonBody(request))
      response.writeHead(200, { 'content-type': types['.json'], 'cache-control': 'no-store' })
      response.end(JSON.stringify(result))
    } catch (error) {
      response.writeHead(error.status || 502, { 'content-type': types['.json'], 'cache-control': 'no-store' })
      response.end(JSON.stringify({ error: webDavError(error) }))
    }
    return
  }

  if (request.method === 'POST' && pathname === '/api/alist/webdav/upload') {
    try {
      const config = normalizeWebDavConfig({
        url: headerValue(request.headers['x-webdav-url']),
        username: headerValue(request.headers['x-webdav-username']),
        password: headerValue(request.headers['x-webdav-password']),
        path: headerValue(request.headers['x-webdav-path'])
      })
      const result = await fetchWebDav(config, config.path, {
        method: 'PUT',
        headers: { 'content-type': headerValue(request.headers['content-type']) || 'application/octet-stream' },
        body: request,
        duplex: 'half'
      })
      await result.arrayBuffer()
      response.writeHead(200, { 'content-type': types['.json'], 'cache-control': 'no-store' })
      response.end(JSON.stringify({ ok: true }))
    } catch (error) {
      response.writeHead(error.status || 502, { 'content-type': types['.json'], 'cache-control': 'no-store' })
      response.end(JSON.stringify({ error: webDavError(error) }))
    }
    return
  }

  if (request.method === 'POST' && pathname === '/api/alist/webdav/download') {
    try {
      const payload = await readJsonBody(request)
      const config = normalizeWebDavConfig(payload)
      const result = await fetchWebDav(config, config.path, { method: 'GET' })
      const filename = String(payload.name || 'download').replace(/[\\/:*?"<>|]/g, '_')
      response.writeHead(200, {
        'content-type': result.headers.get('content-type') || 'application/octet-stream',
        'content-disposition': `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
        'cache-control': 'no-store'
      })
      if (result.body) Readable.fromWeb(result.body).pipe(response)
      else response.end()
    } catch (error) {
      response.writeHead(error.status || 502, { 'content-type': types['.json'], 'cache-control': 'no-store' })
      response.end(JSON.stringify({ error: webDavError(error) }))
    }
    return
  }

  if (pathname === '/api/projects') {
    try {
      const payload = await getProjectsData(headerValue(request.headers['x-alist-token']))
      response.writeHead(200, { 'content-type': types['.json'], 'cache-control': 'no-store' })
      response.end(JSON.stringify(payload))
    } catch {
      response.writeHead(502, { 'content-type': types['.json'] })
      response.end(JSON.stringify({ error: 'Project services unavailable' }))
    }
    return
  }

  const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '')
  const file = normalize(join(root, relative))
  if (!file.startsWith(root)) {
    response.writeHead(403)
    response.end('Forbidden')
    return
  }

  try {
    const body = await readFile(file)
    response.writeHead(200, { 'content-type': types[extname(file)] || 'application/octet-stream' })
    response.end(body)
  } catch {
    if (extname(file)) {
      response.writeHead(404)
      response.end('Not found')
      return
    }
    const body = await readFile(join(root, 'index.html'))
    response.writeHead(200, { 'content-type': types['.html'] })
    response.end(body)
  }
}).listen(port, '127.0.0.1', () => {
  console.log(`MiniHub running at http://127.0.0.1:${port}`)
})
