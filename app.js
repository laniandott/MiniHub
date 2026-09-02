const COLS = 12
const STORAGE_KEY = 'project-hub-layouts-v1'
const WEBDAV_STORAGE_KEY = 'project-hub-webdav-v1'

const projects = [
  {
    id: 'tagtime', name: 'TagTime', icon: 'T', iconClass: 'tagtime',
    description: '标签时间、日记、笔记与日历', summary: '正在计时 · 工作', status: '运行正常', statusClass: 'green',
    url: 'https://tag.812264226.xyz/', meta: '6 个模块',
    modules: [
      { id: 'timer', title: '当前活动', eyebrow: 'TAGTIME', type: 'timer', x: 0, y: 0, w: 4, h: 15, minW: 3, minH: 11, ratio: '' },
      { id: 'today', title: '今日时间', eyebrow: '统计', type: 'metric', x: 4, y: 0, w: 4, h: 15, minW: 3, minH: 11, ratio: '1:1' },
      { id: 'todo', title: '今日待办', eyebrow: '任务', type: 'todo', x: 8, y: 0, w: 4, h: 15, minW: 3, minH: 11, ratio: '' },
      { id: 'notes', title: '最近笔记', eyebrow: '笔记', type: 'notes', x: 0, y: 15, w: 7, h: 15, minW: 4, minH: 12, ratio: '16:9' },
      { id: 'calendar', title: '日历摘要', eyebrow: '日程', type: 'calendar', x: 7, y: 15, w: 5, h: 15, minW: 4, minH: 12, ratio: '' },
      { id: 'diary', title: '最近日记', eyebrow: '日记', type: 'diary', x: 0, y: 30, w: 7, h: 15, minW: 4, minH: 12, ratio: '' }
    ]
  },
  {
    id: 'alist', name: 'Alist', icon: 'A', iconClass: 'alist',
    description: '网盘聚合与文件管理', summary: '3 个存储 · 可访问', status: '运行正常', statusClass: 'green',
    url: 'https://alist.812264226.xyz/', meta: '4 个模块',
    modules: [
      { id: 'drives', title: '我的网盘', eyebrow: 'ALIST', type: 'drives', x: 0, y: 0, w: 7, h: 17, minW: 4, minH: 13, ratio: '' },
      { id: 'storage', title: '存储概览', eyebrow: '容量', type: 'storage', x: 7, y: 0, w: 5, h: 17, minW: 4, minH: 13, ratio: '4:3' },
      { id: 'recent-files', title: '最近访问', eyebrow: '文件', type: 'files', x: 0, y: 17, w: 6, h: 15, minW: 4, minH: 12, ratio: '' },
      { id: 'alist-health', title: '服务状态', eyebrow: '系统', type: 'health', x: 6, y: 17, w: 6, h: 15, minW: 4, minH: 12, ratio: '' }
    ]
  },
  {
    id: 'poco', name: 'POCO', icon: 'P', iconClass: 'poco',
    description: '个人认知、任务与复盘', summary: '今日任务 · 2 个待处理', status: '运行正常', statusClass: 'green',
    url: 'https://poco.812264226.xyz/', meta: '4 个模块',
    modules: [
      { id: 'poco-summary', title: '今日概览', eyebrow: 'POCO', type: 'poco-summary', x: 0, y: 0, w: 5, h: 16, minW: 4, minH: 12, ratio: '' },
      { id: 'poco-tasks', title: '待处理任务', eyebrow: '任务队列', type: 'poco-tasks', x: 5, y: 0, w: 7, h: 16, minW: 4, minH: 12, ratio: '16:9' },
      { id: 'poco-insight', title: '最近洞察', eyebrow: '分析', type: 'insight', x: 0, y: 16, w: 7, h: 15, minW: 4, minH: 12, ratio: '' },
      { id: 'poco-health', title: '系统状态', eyebrow: '运行监控', type: 'poco-health', x: 7, y: 16, w: 5, h: 15, minW: 4, minH: 12, ratio: '4:3' }
    ]
  },
  {
    id: 'entropy', name: 'Self-Entropy', icon: 'E', iconClass: 'entropy',
    description: '个人状态、自省与熵值趋势', summary: '今日熵值 37 · 无预警', status: '运行正常', statusClass: 'green',
    url: 'https://ent.812264226.xyz/', meta: '4 个模块',
    modules: [
      { id: 'entropy-score', title: '今日熵值', eyebrow: 'SELF-ENTROPY', type: 'entropy-score', x: 0, y: 0, w: 5, h: 16, minW: 4, minH: 12, ratio: '1:1' },
      { id: 'entropy-trend', title: '近 7 日趋势', eyebrow: '趋势', type: 'chart', x: 5, y: 0, w: 7, h: 16, minW: 5, minH: 12, ratio: '16:9' },
      { id: 'reflection', title: '今日自省', eyebrow: '记录', type: 'reflection', x: 0, y: 16, w: 6, h: 15, minW: 4, minH: 12, ratio: '' },
      { id: 'entropy-alert', title: '状态提醒', eyebrow: '提醒', type: 'entropy-alert', x: 6, y: 16, w: 6, h: 15, minW: 4, minH: 12, ratio: '' }
    ]
  },
  {
    id: 'monly', name: 'Monly', icon: 'M', iconClass: 'monly',
    description: '个人账本、凭证、报表与资金余额', summary: '账簿服务在线', status: '运行正常', statusClass: 'green',
    url: 'https://812264226.xyz/', meta: '3 个模块',
    modules: [
      { id: 'monly-summary', title: '最近三天凭证', eyebrow: 'MONLY', type: 'monly-vouchers', x: 0, y: 0, w: 7, h: 16, minW: 4, minH: 12, ratio: '' },
      { id: 'monly-sync', title: '最近三日报表', eyebrow: '报表', type: 'monly-report', x: 7, y: 0, w: 5, h: 16, minW: 4, minH: 12, ratio: '4:3' },
      { id: 'monly-closing', title: '当前资金余额', eyebrow: '资金', type: 'monly-balance', x: 0, y: 16, w: 12, h: 15, minW: 4, minH: 12, ratio: '' }
    ]
  },
  {
    id: 'pigallery2', name: 'PiGallery2', icon: 'P', iconClass: 'pigallery2',
    description: '照片图库与相册浏览', summary: '图库服务在线', status: '运行正常', statusClass: 'green',
    url: 'https://photo.812264226.xyz/', meta: '3 个模块',
    modules: [
      { id: 'pigallery-overview', title: '图库概览', eyebrow: 'PIGALLERY2', type: 'pigallery-overview', x: 0, y: 0, w: 7, h: 16, minW: 4, minH: 12, ratio: '' },
      { id: 'pigallery-library', title: '媒体库摘要', eyebrow: '媒体库', type: 'pigallery-library', x: 7, y: 0, w: 5, h: 16, minW: 4, minH: 12, ratio: '4:3' },
      { id: 'pigallery-health', title: '服务状态', eyebrow: '运行监控', type: 'pigallery-health', x: 0, y: 16, w: 12, h: 15, minW: 4, minH: 12, ratio: '' }
    ]
  },
  {
    id: 'vaultwarden', name: 'Vaultwarden', icon: 'V', iconClass: 'vaultwarden',
    description: '密码库服务与安全凭据管理', summary: '密码库服务在线', status: '运行正常', statusClass: 'green',
    url: 'https://vault.812264226.xyz/', meta: '3 个模块',
    modules: [
      { id: 'vaultwarden-overview', title: '服务概览', eyebrow: 'VAULTWARDEN', type: 'vaultwarden-overview', x: 0, y: 0, w: 7, h: 16, minW: 4, minH: 12, ratio: '' },
      { id: 'vaultwarden-version', title: '运行版本', eyebrow: '服务信息', type: 'vaultwarden-version', x: 7, y: 0, w: 5, h: 16, minW: 4, minH: 12, ratio: '4:3' },
      { id: 'vaultwarden-safety', title: '数据边界', eyebrow: '安全', type: 'vaultwarden-safety', x: 0, y: 16, w: 12, h: 15, minW: 4, minH: 12, ratio: '' }
    ]
  }
]

const state = {
  selectedId: 'tagtime',
  editMode: false,
  layouts: loadLayouts(),
  liveProjects: {},
  alistWebdav: {
    ...loadWebdavConfig(),
    path: '',
    currentPath: '',
    parentPath: null,
    entries: [],
    connected: false
  },
  draft: null,
  interaction: null
}

const projectList = document.querySelector('#projectList')
const gridCanvas = document.querySelector('#gridCanvas')
const toast = document.querySelector('#toast')
const settingsDialog = document.querySelector('#settingsDialog')
const settingsForm = document.querySelector('#settingsForm')
const webdavUrlInput = document.querySelector('#webdavUrl')
const webdavUsernameInput = document.querySelector('#webdavUsername')
const webdavPasswordInput = document.querySelector('#webdavPassword')
const webdavRememberInput = document.querySelector('#webdavRemember')
const alistSettingsStatus = document.querySelector('#alistSettingsStatus')
const webdavNameDialog = document.querySelector('#webdavNameDialog')
const webdavNameForm = document.querySelector('#webdavNameForm')
const webdavNameTitle = document.querySelector('#webdavNameTitle')
const webdavNameLabel = document.querySelector('#webdavNameLabel')
const webdavNameInput = document.querySelector('#webdavNameInput')
const webdavNameStatus = document.querySelector('#webdavNameStatus')
const webdavNameSubmit = document.querySelector('#webdavNameSubmit')
const webdavUploadInput = document.querySelector('#webdavUploadInput')
let webdavNameAction = null

function loadLayouts() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') } catch { return {} }
}

function loadWebdavConfig() {
  try {
    const saved = JSON.parse(localStorage.getItem(WEBDAV_STORAGE_KEY) || '{}')
    return { url: saved.url || '', username: saved.username || '', password: saved.password || '', remember: Boolean(saved.remember) }
  } catch { return { url: '', username: '', password: '', remember: false } }
}

function saveWebdavConfig() {
  if (!state.alistWebdav.remember) {
    localStorage.removeItem(WEBDAV_STORAGE_KEY)
    return
  }
  const { url, username, password, remember } = state.alistWebdav
  localStorage.setItem(WEBDAV_STORAGE_KEY, JSON.stringify({ url, username, password, remember }))
}

function getProject() { return projects.find((project) => project.id === state.selectedId) }
function getLive(project = getProject()) { return state.liveProjects[project.id] || null }
function getLayout(project = getProject()) {
  if (!state.layouts[project.id]) state.layouts[project.id] = project.modules.map((item) => ({ ...item }))
  const layout = state.layouts[project.id]
  for (const item of layout) {
    const definition = project.modules.find((candidate) => candidate.id === item.id)
    if (definition) Object.assign(item, { title: definition.title, eyebrow: definition.eyebrow, type: definition.type, minW: definition.minW, minH: definition.minH })
  }
  const known = new Set(layout.map((item) => item.id))
  const missing = project.modules.filter((item) => !known.has(item.id)).map((item) => ({ ...item }))
  if (missing.length) layout.push(...missing)
  return layout
}
function setLayout(layout) { state.layouts[state.selectedId] = layout }
function clamp(value, min, max) { return Math.max(min, Math.min(max, value)) }
function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[char])) }
function projectIcon(project, large = false) { return `<div class="project-icon project-icon--${project.iconClass}${large ? ' project-icon--large' : ''}">${project.icon}</div>` }
function formatRatio(value) { return value || '自由' }
function formatDuration(ms) {
  const totalMinutes = Math.max(0, Math.floor(finiteNumber(ms) / 60000))
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return hours ? `${hours}h ${String(minutes).padStart(2, '0')}m` : `${minutes}m`
}
function formatMoney(value) {
  const amount = finiteNumber(value)
  return `${amount < 0 ? '-' : ''}¥${Math.abs(amount).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}
function finiteNumber(value, fallback = 0) {
  if (value === null || value === undefined || value === '') return fallback
  const number = Number(value)
  return Number.isFinite(number) ? number : fallback
}
function formatDate(value) {
  if (!value) return '暂无时间'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '暂无时间'
  return new Intl.DateTimeFormat('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date)
}
function projectView(project) {
  const live = getLive(project)
  return {
    summary: live?.summary || project.summary,
    status: live?.statusLabel || project.status,
    statusClass: live?.statusClass || project.statusClass,
    live
  }
}

function renderSidebar() {
  document.querySelector('#projectCount').textContent = projects.length
  projectList.innerHTML = projects.map((project) => {
    const view = projectView(project)
    return `
    <div class="project-item ${project.id === state.selectedId ? 'is-selected' : ''}" data-project="${project.id}" role="button" tabindex="0" aria-pressed="${project.id === state.selectedId}">
      ${projectIcon(project)}
      <div class="project-copy">
        <div class="project-name">${escapeHtml(project.name)}</div>
        <div class="project-summary">${escapeHtml(view.summary)}</div>
        <div class="project-meta"><span class="status-dot status-dot--${view.statusClass}"></span>${escapeHtml(project.meta)}</div>
      </div>
      <a class="direct-link" href="${project.url}" target="_blank" rel="noreferrer" data-direct title="打开 ${escapeHtml(project.name)} 原页面" aria-label="打开 ${escapeHtml(project.name)} 原页面">↗</a>
    </div>
  `
  }).join('')
}

function renderHeader() {
  const project = getProject()
  const view = projectView(project)
  document.querySelector('#currentProjectName').textContent = project.name
  document.querySelector('#currentProjectTitle').textContent = project.name
  const currentIcon = document.querySelector('#currentProjectIcon')
  currentIcon.className = `project-icon project-icon--large project-icon--${project.iconClass}`
  currentIcon.textContent = project.icon
  document.querySelector('#currentProjectDescription').textContent = project.description
  const status = document.querySelector('#currentProjectStatus')
  status.className = `status-pill status-pill--${view.statusClass}`
  status.textContent = view.status
  const direct = document.querySelector('#projectDirectLink')
  direct.href = project.url
  direct.innerHTML = `<span>↗</span><span>打开原项目</span>`
}

function renderWidget(item) {
  const editing = state.editMode
  const ratioOptions = ['', '1:1', '4:3', '16:9'].map((ratio) => `<option value="${ratio}" ${item.ratio === ratio ? 'selected' : ''}>${formatRatio(ratio)}</option>`).join('')
  return `
    <article class="widget ${editing ? 'widget--editing' : ''}" data-widget="${item.id}" style="grid-column: ${item.x + 1} / span ${item.w}; grid-row: ${item.y + 1} / span ${item.h};">
      <header class="widget__header">
        <div class="widget__grab" data-grab title="拖动模块" aria-label="拖动模块">⠿</div>
        <div>
          <p class="widget__eyebrow">${escapeHtml(item.eyebrow)}</p>
          <h3 class="widget__title">${escapeHtml(item.title)}</h3>
        </div>
        <div class="widget__actions">
          ${editing ? `<select class="ratio-select" data-ratio="${item.id}" title="宽高比" aria-label="${escapeHtml(item.title)}宽高比">${ratioOptions}</select>` : ''}
          <button class="widget__mini-button" type="button" data-widget-open="${getProject().url}" title="打开原项目" aria-label="打开原项目">↗</button>
        </div>
      </header>
      <div class="widget__body">${widgetBody(item.type, getLive())}</div>
      <span class="resize-handle" data-resize title="调整大小" aria-label="调整大小"></span>
    </article>
  `
}

function formatFileSize(value) {
  const size = finiteNumber(value, null)
  if (size === null) return '未知大小'
  if (size < 1024) return `${size} B`
  if (size < 1024 ** 2) return `${Math.round(size / 1024)} KB`
  if (size < 1024 ** 3) return `${(size / 1024 ** 2).toFixed(1)} MB`
  return `${(size / 1024 ** 3).toFixed(1)} GB`
}

function webdavPathLabel() {
  const path = state.alistWebdav.path
  if (!path) return '根目录'
  try { return decodeURIComponent(path.split('/').filter(Boolean).pop() || '根目录') } catch { return '当前目录' }
}

function renderWebdavBrowser() {
  const webdav = state.alistWebdav
  return `
    <div class="webdav-toolbar">
      <button class="widget__mini-button" type="button" data-webdav-parent ${webdav.parentPath ? '' : 'disabled'} title="返回上级目录" aria-label="返回上级目录">←</button>
      <span class="webdav-path" title="${escapeHtml(webdav.currentPath || webdav.url)}">${escapeHtml(webdavPathLabel())}</span>
      <span class="webdav-toolbar__tools">
        <button class="widget__mini-button" type="button" data-webdav-new-folder title="新建文件夹" aria-label="新建文件夹">＋</button>
        <button class="widget__mini-button" type="button" data-webdav-upload title="上传文件" aria-label="上传文件">↑</button>
      </span>
      <button class="widget__mini-button" type="button" data-webdav-refresh title="刷新当前目录" aria-label="刷新当前目录">↻</button>
    </div>
    <div class="webdav-list">
      ${webdav.entries.length ? webdav.entries.map((entry) => `
        <div class="webdav-row">
          <button class="webdav-open ${entry.isDirectory ? '' : 'webdav-open--file'}" type="button" data-webdav-open="${escapeHtml(entry.path)}" data-webdav-directory="${entry.isDirectory}" title="${entry.isDirectory ? '打开目录' : '下载文件'}">
            <span class="drive-icon">${entry.isDirectory ? '▰' : '▤'}</span>
            <span class="webdav-copy"><span class="drive-name">${escapeHtml(entry.name)}</span><span class="drive-detail">${escapeHtml(entry.isDirectory ? '文件夹' : `${formatFileSize(entry.size)}${entry.modified ? ` · ${formatDate(entry.modified)}` : ''}`)}</span></span>
          </button>
          ${entry.isDirectory ? '<span></span>' : `<button class="widget__mini-button" type="button" data-webdav-download="${escapeHtml(entry.path)}" data-webdav-name="${escapeHtml(entry.name)}" title="下载文件" aria-label="下载 ${escapeHtml(entry.name)}">↓</button>`}
          <button class="widget__mini-button" type="button" data-webdav-rename="${escapeHtml(entry.path)}" data-webdav-name="${escapeHtml(entry.name)}" title="重命名" aria-label="重命名 ${escapeHtml(entry.name)}">✎</button>
          <details class="webdav-actions">
            <summary class="widget__mini-button" title="更多操作" aria-label="更多操作">⋯</summary>
            <div class="webdav-action-menu">
              <button type="button" data-webdav-move="${escapeHtml(entry.path)}" data-webdav-name="${escapeHtml(entry.name)}">移动到</button>
              <button type="button" data-webdav-copy="${escapeHtml(entry.path)}" data-webdav-name="${escapeHtml(entry.name)}">复制到</button>
              <button type="button" data-webdav-delete="${escapeHtml(entry.path)}" data-webdav-name="${escapeHtml(entry.name)}">删除</button>
            </div>
          </details>
        </div>
      `).join('') : '<div class="empty-state">当前目录为空</div>'}
    </div>
  `
}

function widgetBody(type, live) {
  const isLive = live?.source === 'live'
  const webdav = state.alistWebdav
  const taskStatus = {
    succeeded: '已完成',
    published: '已发布',
    permanently_failed: '失败',
    failed: '失败',
    running: '运行中',
    queued: '排队中',
    pending: '待处理',
    retrying: '重试中'
  }
  const bodies = {
    timer: isLive && live.timer ? `<div class="timer-line"><span class="timer-pulse ${live.timer.active ? '' : 'timer-pulse--idle'}"></span><span class="timer-name">${escapeHtml(live.timer.icon ? `${live.timer.icon} ${live.timer.label}` : live.timer.label)}</span><span class="tag ${live.timer.active ? 'tag--green' : ''}">${live.timer.active ? '进行中' : '暂无活动'}</span></div><div class="timer-clock">${live.timer.active ? formatDuration(live.timer.elapsedMs) : '--:--'}</div><p class="metric-note">${live.timer.startedAt ? `开始于 ${formatDate(live.timer.startedAt)}` : '等待下一次计时记录'}</p>` : `<div class="timer-line"><span class="timer-pulse"></span><span class="timer-name">工作 · 产品设计</span><span class="tag tag--green">进行中</span></div><div class="timer-clock">01:42:18</div><p class="metric-note">开始于今天 09:18 · 最近记录稳定</p>`,
    metric: isLive && live.todayMs !== undefined ? `<div class="metric-row"><div><span class="metric-value">${formatDuration(live.todayMs)}</span><p class="metric-note">今日累计记录</p></div><span class="trend-down">${live.todayByCategory?.length || 0} 类</span></div><div class="progress"><span style="width: ${clamp(live.todayMs / 28800000 * 100, 0, 100)}%"></span></div><p class="metric-note">按 TagTime 今日统计实时更新</p>` : `<div class="metric-row"><div><span class="metric-value">5<span class="metric-unit">h 26m</span></span><p class="metric-note">今日累计专注时间</p></div><span class="trend-down">↑ 18%</span></div><div class="progress"><span style="width: 68%"></span></div><p class="metric-note">目标 8 小时 · 已完成 68%</p>`,
    todo: isLive && live.todos ? (live.todos.length ? `<div class="list">${live.todos.map((todo) => `<div class="list-row todo-row"><button class="todo-toggle" type="button" data-todo-toggle="${escapeHtml(todo.id)}" title="完成待办" aria-label="完成待办：${escapeHtml(todo.title)}">○</button><span class="list-label">${escapeHtml(todo.title)}</span><span class="list-value">${escapeHtml(todo.category || (todo.dueDate ? formatDate(todo.dueDate) : '待处理'))}</span></div>`).join('')}</div>` : '<div class="empty-state">暂无未完成待办</div>') : `<div class="list"><div class="list-row"><span class="list-label">完成聚合看板原型</span><span class="tag">进行中</span></div><div class="list-row"><span class="list-label">整理 TagTime 笔记</span><span class="tag tag--green">已完成</span></div><div class="list-row"><span class="list-label">晚间自省</span><span class="list-value">21:30</span></div></div>`,
    notes: isLive && live.notes ? (live.notes.length ? `<div class="list">${live.notes.map((note) => `<div class="list-row"><a class="list-label content-link" href="${escapeHtml(`${getProject().url}notes/${encodeURIComponent(note.id)}`)}" target="_blank" rel="noreferrer">${escapeHtml(note.title)}</a><span class="list-value">${escapeHtml(formatDate(note.updatedAt))}</span></div>`).join('')}</div><div class="insight" style="margin-top: 15px"><strong>TagTime 笔记</strong>点击标题可打开具体笔记。</div>` : '<div class="empty-state">暂无笔记</div>') : `<div class="list"><div class="list-row"><span class="list-label">自有项目聚合看板-项目计划书</span><span class="list-value">刚刚</span></div><div class="list-row"><span class="list-label">财管错题与避坑考点集</span><span class="list-value">昨天</span></div><div class="list-row"><span class="list-label">本周工作复盘</span><span class="list-value">8 月 31 日</span></div></div><div class="insight" style="margin-top: 15px"><strong>最近编辑</strong>继续完善右侧模块化工作区的交互细节。</div>`,
    diary: isLive && live.memos ? (live.memos.length ? `<div class="diary-list">${live.memos.map((memo) => `<div class="diary-item"><div class="diary-item__meta"><span>${escapeHtml(memo.tag || '日记')}</span><span>${escapeHtml(formatDate(memo.createdAt))}</span></div><div class="diary-item__content">${escapeHtml(memo.content)}</div></div>`).join('')}</div>` : '<div class="empty-state">暂无日记</div>') : `<div class="diary-list"><div class="diary-item"><div class="diary-item__meta"><span>工作记录</span><span>今天</span></div><div class="diary-item__content">继续完善右侧模块化工作区的交互细节。</div></div><div class="diary-item"><div class="diary-item__meta"><span>学习记录</span><span>昨天</span></div><div class="diary-item__content">把重要想法记录下来，方便之后回看。</div></div></div>`,
    calendar: isLive && live.events ? (live.events.length ? `<div class="list">${live.events.map((event) => `<div class="list-row"><span class="list-label">${escapeHtml(event.title)}</span><span class="list-value">${escapeHtml(event.allday ? '全天' : formatDate(event.start))}</span></div>`).join('')}</div><p class="metric-note" style="margin-top: 12px">未来 7 日 · 来自 TagTime 日历</p>` : '<div class="empty-state">未来 7 日暂无日程</div>') : `<div class="calendar-grid"><span class="calendar-day is-head">一</span><span class="calendar-day is-head">二</span><span class="calendar-day is-head">三</span><span class="calendar-day is-head">四</span><span class="calendar-day is-head">五</span><span class="calendar-day is-head">六</span><span class="calendar-day is-head">日</span>${[26,27,28,29,30,31,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16].map((day, index) => `<span class="calendar-day ${day === 2 ? 'is-active' : ''} ${[1,4,11].includes(index) ? 'has-event' : ''}">${day}</span>`).join('')}</div><p class="metric-note" style="margin-top: 12px">今天 14:00 · 聚合看板设计</p>`,
    drives: webdav.connected ? renderWebdavBrowser() : isLive && live.authorized ? (live.entries.length ? `<div class="list">${live.entries.map((entry) => `<a class="drive-row drive-row--link" href="${escapeHtml(getProject().url)}" target="_blank" rel="noreferrer"><span class="drive-icon">▣</span><span><span class="drive-name">${escapeHtml(entry.name)}</span><br><span class="drive-detail">${escapeHtml(entry.driver || entry.path || '打开 Alist 操作')}</span></span><span class="tag tag--green">在线</span></a>`).join('')}</div>` : '<div class="empty-state">已授权，但暂无存储</div>') : isLive ? `<div class="notice">在设置中输入 WebDAV 地址即可浏览文件。 <button class="inline-button" type="button" data-settings-open>配置 WebDAV</button> <a class="inline-link" href="${escapeHtml(getProject().url)}" target="_blank" rel="noreferrer">打开 Alist</a></div>` : `<div class="list"><div class="drive-row"><span class="drive-icon">▣</span><span><span class="drive-name">OneDrive</span><br><span class="drive-detail">最近访问：项目归档</span></span><span class="tag tag--green">在线</span></div><div class="drive-row"><span class="drive-icon">▤</span><span><span class="drive-name">阿里云盘</span><br><span class="drive-detail">最近访问：照片备份</span></span><span class="tag tag--green">在线</span></div><div class="drive-row"><span class="drive-icon">▥</span><span><span class="drive-name">本地存储</span><br><span class="drive-detail">最近访问：下载</span></span><span class="tag tag--green">在线</span></div></div>`,
    storage: webdav.connected ? `<div class="metric-row"><div><span class="metric-value">${webdav.entries.length}<span class="metric-unit">项</span></span><p class="metric-note">当前目录内容</p></div><span class="trend-down">已连接</span></div><div class="progress"><span style="width: ${webdav.entries.length ? 100 : 0}%; background: #2ea877"></span></div><p class="metric-note">WebDAV · ${escapeHtml(webdavPathLabel())}</p>` : isLive && live.authorized ? `<div class="metric-row"><div><span class="metric-value">${live.entries.length}<span class="metric-unit">个</span></span><p class="metric-note">已授权存储</p></div><span class="trend-down">在线</span></div><div class="progress"><span style="width: ${live.entries.length ? 100 : 0}%; background: #2ea877"></span></div><p class="metric-note">容量详情将在 Alist 接口授权后继续接入</p>` : isLive ? `<div class="notice">暂时无法读取容量明细，需要${live.authConfigured ? '有效授权。' : ' Alist 登录授权。'} <a class="inline-link" href="${escapeHtml(getProject().url)}" target="_blank" rel="noreferrer">打开 Alist</a></div>` : `<div class="metric-row"><div><span class="metric-value">1.8<span class="metric-unit">TB</span></span><p class="metric-note">已使用空间</p></div><span class="trend-down">42%</span></div><div class="progress"><span style="width: 42%; background: #2ea877"></span></div><p class="metric-note">总容量 4.2 TB · 3 个存储</p>`,
    files: `<div class="list"><div class="list-row"><span class="list-label">project-hub/设计稿</span><span class="list-value">今天</span></div><div class="list-row"><span class="list-label">TagTime-LivePreview.md</span><span class="list-value">昨天</span></div><div class="list-row"><span class="list-label">照片/2026-08</span><span class="list-value">8 月 30 日</span></div></div>`,
    health: webdav.connected ? `<div class="metric-row"><div><span class="metric-value">在线</span><p class="metric-note">Alist WebDAV 状态</p></div><span class="tag tag--green">已连接</span></div><div class="list" style="margin-top: 16px"><div class="list-row"><span class="list-label">当前目录</span><span class="list-value">${escapeHtml(webdavPathLabel())}</span></div><div class="list-row"><span class="list-label">目录项目</span><span class="list-value">${webdav.entries.length} 项</span></div></div>` : isLive ? `<div class="metric-row"><div><span class="metric-value">${live.authorized === false ? '—' : '在线'}</span><p class="metric-note">Alist 服务状态</p></div><span class="tag ${live.statusClass === 'green' ? 'tag--green' : 'tag--orange'}">${escapeHtml(live.statusLabel)}</span></div><div class="list" style="margin-top: 16px"><div class="list-row"><span class="list-label">数据权限</span><span class="list-value">${live.authorized ? '已授权' : '需要登录'}</span></div><div class="list-row"><span class="list-label">最近检查</span><span class="list-value">刚刚</span></div></div>` : `<div class="metric-row"><div><span class="metric-value">99.9<span class="metric-unit">%</span></span><p class="metric-note">近 30 日可用性</p></div><span class="tag tag--green">稳定</span></div><div class="list" style="margin-top: 16px"><div class="list-row"><span class="list-label">接口响应</span><span class="list-value"><strong>128 ms</strong></span></div><div class="list-row"><span class="list-label">最近检查</span><span class="list-value">刚刚</span></div></div>`,
    'poco-health': isLive ? `<div class="metric-row"><div><span class="metric-value">在线</span><p class="metric-note">POCO 服务状态</p></div><span class="tag ${live.statusClass === 'green' ? 'tag--green' : 'tag--orange'}">${escapeHtml(live.statusLabel)}</span></div><div class="list" style="margin-top: 16px"><div class="list-row"><span class="list-label">最近同步</span><span class="list-value">${escapeHtml(formatDate(live.latestSync))}</span></div><div class="list-row"><span class="list-label">指标更新时间</span><span class="list-value">${escapeHtml(formatDate(live.metrics?.updatedAt))}</span></div></div>` : `<div class="metric-row"><div><span class="metric-value">99.9<span class="metric-unit">%</span></span><p class="metric-note">近 30 日可用性</p></div><span class="tag tag--green">稳定</span></div><div class="list" style="margin-top: 16px"><div class="list-row"><span class="list-label">接口响应</span><span class="list-value"><strong>128 ms</strong></span></div><div class="list-row"><span class="list-label">最近检查</span><span class="list-value">刚刚</span></div></div>`,
    'poco-summary': isLive && live.metrics ? `<div class="metric-row"><div><span class="metric-value">${Math.round(live.metrics.trackedMin)}<span class="metric-unit">m</span></span><p class="metric-note">今日累计追踪</p></div><span class="trend-down">${Math.round(live.metrics.switchCount)} 次切换</span></div><div class="progress"><span style="width: ${clamp(live.metrics.trackedMin / 480 * 100, 0, 100)}%; background: #d8873e"></span></div><p class="metric-note">来自 POCO 最新指标</p>` : `<div class="metric-row"><div><span class="metric-value">12</span><p class="metric-note">今日有效记录</p></div><span class="trend-down">+3</span></div><div class="progress"><span style="width: 75%; background: #d8873e"></span></div><p class="metric-note">日计划完成度 75%</p>`,
    'poco-tasks': isLive && live.tasks ? (live.tasks.length ? `<div class="list">${live.tasks.slice(0, 4).map((task) => `<div class="list-row"><span class="list-label">${escapeHtml(task.name)}</span><span class="tag ${task.status === 'succeeded' ? 'tag--green' : 'tag--orange'}">${escapeHtml(taskStatus[task.status] || task.status)}</span></div>`).join('')}</div>` : '<div class="empty-state">暂无任务</div>') : `<div class="list"><div class="list-row"><span class="list-label">生成每日摘要</span><span class="tag tag--orange">运行中</span></div><div class="list-row"><span class="list-label">同步 TagTime 数据</span><span class="tag tag--green">已完成</span></div><div class="list-row"><span class="list-label">每周复盘任务</span><span class="list-value">明天 08:00</span></div><div class="list-row"><span class="list-label">用户反馈处理</span><span class="tag tag--orange">待处理</span></div></div>`,
    insight: isLive && live.insight ? `<div class="insight"><strong>最新指标洞察</strong>${escapeHtml(live.insight)}</div><div class="list" style="margin-top: 13px"><div class="list-row"><span class="list-label">今日切换次数</span><span class="list-value"><strong>${Math.round(live.metrics?.switchCount || 0)}</strong></span></div><div class="list-row"><span class="list-label">更新时间</span><span class="list-value">${escapeHtml(formatDate(live.metrics?.updatedAt))}</span></div></div>` : `<div class="insight"><strong>今天的注意点</strong>当前记录显示，上午的连续专注时间明显高于近 7 日平均值。</div><div class="list" style="margin-top: 13px"><div class="list-row"><span class="list-label">证据置信度</span><span class="list-value"><strong>0.82</strong></span></div><div class="list-row"><span class="list-label">生成时间</span><span class="list-value">今天 10:12</span></div></div>`,
    'entropy-score': isLive && live.score !== null && live.score !== undefined ? `<div class="entropy-score"><div class="score-ring" data-score="${Math.round(live.score)}" style="background: conic-gradient(#8a62dc 0 ${clamp(live.score, 0, 100)}%, #eeeaf9 ${clamp(live.score, 0, 100)}% 100%)"></div><div class="score-copy"><strong>${live.score < 50 ? '秩序状态良好' : '需要留意波动'}</strong><span>来自 Self-Entropy 今日数据</span></div></div><div class="progress"><span style="width: ${clamp(live.score, 0, 100)}%; background: #8a62dc"></span></div><p class="metric-note">0 为高度有序，100 为高度混乱</p>` : `<div class="entropy-score"><div class="score-ring" data-score="37"></div><div class="score-copy"><strong>秩序状态良好</strong><span>较昨日下降 8 分<br>连续 3 天低于基线</span></div></div><div class="progress"><span style="width: 37%; background: #8a62dc"></span></div><p class="metric-note">0 为高度有序，100 为高度混乱</p>`,
    chart: isLive && live.trend?.length ? `<div class="mini-chart">${live.trend.slice(-7).map((value, index, values) => `<span class="bar ${index === values.length - 1 ? 'is-current' : ''}" style="height: ${clamp(value, 0, 100)}%"></span>`).join('')}</div><div class="chart-labels"><span>近 7 日</span><span>最新</span></div>` : `<div class="mini-chart"><span class="bar" style="height: 65%"></span><span class="bar" style="height: 78%"></span><span class="bar" style="height: 55%"></span><span class="bar" style="height: 72%"></span><span class="bar" style="height: 47%"></span><span class="bar" style="height: 58%"></span><span class="bar is-current" style="height: 37%"></span></div><div class="chart-labels"><span>8/27</span><span>8/30</span><span>9/2</span></div>`,
    reflection: isLive && live.reflection ? `<div class="list"><div class="list-row"><span class="list-label">今日精力</span><span class="list-value">${live.reflection.energy === null ? '待填写' : `${live.reflection.energy} / 5`}</span></div><div class="list-row"><span class="list-label">混乱根源</span><span class="list-value">${live.reflection.journal ? '已记录' : '待填写'}</span></div><div class="list-row"><span class="list-label">明日降熵动作</span><span class="tag ${live.reflection.actionCompleted ? 'tag--green' : 'tag--orange'}">${live.reflection.action ? (live.reflection.actionCompleted ? '已完成' : '待完成') : '待填写'}</span></div></div><div class="notice" style="margin-top: 16px">${live.reflection.action ? escapeHtml(live.reflection.action) : '今天还没有提交自省记录。'} <a class="inline-link" href="${escapeHtml(`${getProject().url}#reflect`)}" target="_blank" rel="noreferrer">打开自省</a></div>` : `<div class="list"><div class="list-row"><span class="list-label">今日自省</span><span class="tag tag--orange">未完成</span></div><div class="list-row"><span class="list-label">昨晚自省</span><span class="tag tag--green">已完成</span></div></div><div class="notice" style="margin-top: 16px">✦ 晚间 21:30 将提醒你完成今日自省。</div>`,
    'entropy-alert': isLive && live.highEntropyMin !== undefined ? `<div class="notice">${live.alert ? '⚠ 今日已触发高熵预警' : '✓ 今日暂未触发高熵预警'}</div><div class="list" style="margin-top: 16px"><div class="list-row"><span class="list-label">高熵行为累计</span><span class="list-value"><strong>${Math.round(live.highEntropyMin)} 分钟</strong></span></div><div class="list-row"><span class="list-label">预警阈值</span><span class="list-value">${Math.round(live.threshold)} 分钟</span></div><div class="list-row"><span class="list-label">最近同步</span><span class="list-value">${escapeHtml(formatDate(live.syncedAt))}</span></div></div>${live.ranking?.length ? `<div class="insight" style="margin-top: 13px"><strong>主要高熵行为</strong>${escapeHtml(live.ranking[0].tag_name || live.ranking[0].tagName || '暂无')}</div>` : ''}` : `<div class="notice">✓ 今日暂未触发高熵预警</div><div class="list" style="margin-top: 16px"><div class="list-row"><span class="list-label">高熵行为累计</span><span class="list-value"><strong>46 分钟</strong></span></div><div class="list-row"><span class="list-label">预警阈值</span><span class="list-value">120 分钟</span></div><div class="list-row"><span class="list-label">最近同步</span><span class="list-value">12 分钟前</span></div></div>`
  }
  Object.assign(bodies, {
    'monly-vouchers': isLive && live.recentVouchers?.length ? `<div class="list">${live.recentVouchers.map((voucher) => `<div class="list-row"><span class="list-label"><strong>${escapeHtml(voucher.summary)}</strong><br><span class="metric-note">${escapeHtml(voucher.debit)} → ${escapeHtml(voucher.credit)}</span></span><span class="list-value"><strong>${formatMoney(voucher.amount)}</strong><br>${escapeHtml(voucher.date.slice(5))}</span></div>`).join('')}</div><p class="metric-note" style="margin-top: 12px">${escapeHtml(live.periodStart)} 至 ${escapeHtml(live.periodEnd)} · 共 ${live.recentVouchers.length} 笔</p>` : `<div class="empty-state">最近三天暂无凭证。 <a class="inline-link" href="${escapeHtml(getProject().url)}" target="_blank" rel="noreferrer">打开 Monly</a></div>`,
    'monly-report': isLive && live.report ? `<div class="metric-row"><div><span class="metric-value">${formatMoney(live.report.expense)}</span><p class="metric-note">三日支出</p></div><span class="trend-down">收入 ${formatMoney(live.report.income)}</span></div><div class="list" style="margin-top: 16px">${live.report.daily.map((day) => `<div class="list-row"><span class="list-label">${escapeHtml(day.date.slice(5))}</span><span class="list-value">${day.voucherCount} 笔 · ${formatMoney(day.surplus)}</span></div>`).join('')}</div><p class="metric-note" style="margin-top: 12px">三日结余 ${formatMoney(live.report.surplus)} · 共 ${live.report.voucherCount} 笔</p>` : '<div class="empty-state">暂无最近三日报表</div>',
    'monly-balance': isLive && live.balances ? `<div class="metric-row"><div><span class="metric-value">${formatMoney(live.balances.totalAssets)}</span><p class="metric-note">资金余额合计</p></div><span class="tag tag--green">资产</span></div><div class="list" style="margin-top: 16px">${live.balances.assets.map((account) => `<div class="list-row"><span class="list-label">${escapeHtml(account.name)}</span><span class="list-value"><strong>${formatMoney(account.balance)}</strong></span></div>`).join('')}</div>${live.balances.totalLiabilities ? `<p class="metric-note" style="margin-top: 12px">负债合计 ${formatMoney(live.balances.totalLiabilities)}</p>` : ''}` : '<div class="empty-state">暂无资金余额</div>',
    'pigallery-overview': isLive ? `<div class="metric-row"><div><span class="metric-value">${live.albums}<span class="metric-unit">个相册</span></span><p class="metric-note">图库顶层相册</p></div><span class="tag tag--green">在线</span></div><div class="list" style="margin-top: 16px"><div class="list-row"><span class="list-label">照片文件</span><span class="list-value"><strong>${live.files}</strong> 个</span></div><div class="list-row"><span class="list-label">图库版本</span><span class="list-value">${escapeHtml(live.version)}</span></div></div>` : `<div class="notice">PiGallery2 服务暂时无法读取。 <a class="inline-link" href="${escapeHtml(getProject().url)}" target="_blank" rel="noreferrer">打开图库</a></div>`,
    'pigallery-library': isLive ? `<div class="metric-row"><div><span class="metric-value">${live.albums}</span><p class="metric-note">顶层相册数量</p></div><span class="trend-down">媒体库已挂载</span></div><div class="progress"><span style="width: ${live.albums ? 100 : 0}%; background: #c55f82"></span></div><p class="metric-note">工作台不加载私有照片，只保留聚合统计。</p>` : '<div class="empty-state">等待图库统计</div>',
    'pigallery-health': isLive ? `<div class="metric-row"><div><span class="metric-value">在线</span><p class="metric-note">PiGallery2 服务状态</p></div><span class="tag ${live.statusClass === 'green' ? 'tag--green' : 'tag--orange'}">${escapeHtml(live.statusLabel)}</span></div><div class="list" style="margin-top: 16px"><div class="list-row"><span class="list-label">媒体库状态</span><span class="list-value">${live.mediaConfigured ? '已读取统计' : '未配置'}</span></div><div class="list-row"><span class="list-label">图库版本</span><span class="list-value">${escapeHtml(live.version)}</span></div></div>` : '<div class="empty-state">图库服务不可用</div>',
    'vaultwarden-overview': isLive ? `<div class="metric-row"><div><span class="metric-value">在线</span><p class="metric-note">Vaultwarden Web 服务</p></div><span class="tag ${live.statusClass === 'green' ? 'tag--green' : 'tag--orange'}">${escapeHtml(live.statusLabel)}</span></div><div class="list" style="margin-top: 16px"><div class="list-row"><span class="list-label">Web Vault</span><span class="list-value">${live.webVaultReady ? '可访问' : '不可用'}</span></div><div class="list-row"><span class="list-label">密码库内容</span><span class="list-value">工作台不读取</span></div></div>` : `<div class="notice">Vaultwarden 服务暂时无法读取。 <a class="inline-link" href="${escapeHtml(getProject().url)}" target="_blank" rel="noreferrer">打开密码库</a></div>`,
    'vaultwarden-version': isLive ? `<div class="metric-row"><div><span class="metric-value">${escapeHtml(live.version || '—')}</span><p class="metric-note">服务端版本</p></div><span class="tag tag--green">已连接</span></div><p class="metric-note" style="margin-top: 16px">版本信息来自 Vaultwarden 公共配置接口。</p>` : '<div class="empty-state">等待 Vaultwarden 服务连接</div>',
    'vaultwarden-safety': `<div class="insight"><strong>密码库内容保持隔离</strong>工作台只显示服务在线状态和版本信息。登录、查看和修改密码条目请通过 Vaultwarden 原页面完成。</div><div class="notice" style="margin-top: 15px"><a class="inline-link" href="${escapeHtml(getProject().url)}" target="_blank" rel="noreferrer">打开 Vaultwarden</a></div>`
  })
  return bodies[type] || '<div class="empty-state">暂无内容</div>'
}

function renderGrid() {
  gridCanvas.innerHTML = getLayout().map(renderWidget).join('')
  document.querySelector('#editBar').hidden = !state.editMode
  const toggle = document.querySelector('[data-toggle-edit]')
  toggle.innerHTML = state.editMode ? '<span>✓</span><span>完成编辑</span>' : '<span>✎</span><span>编辑布局</span>'
  if (state.editMode) toggle.classList.add('is-editing')
  else toggle.classList.remove('is-editing')
}

function render() {
  renderSidebar()
  renderHeader()
  renderGrid()
}

function canPlace(item, next, layout) {
  if (next.x < 0 || next.y < 0 || next.w < item.minW || next.h < item.minH || next.x + next.w > COLS) return false
  return layout.every((other) => other.id === item.id || next.x + next.w <= other.x || other.x + other.w <= next.x || next.y + next.h <= other.y || other.y + other.h <= next.y)
}

function getGridDelta(event, start) {
  const rect = gridCanvas.getBoundingClientRect()
  const gap = parseFloat(getComputedStyle(gridCanvas).gap) || 12
  const colStep = (rect.width - gap * (COLS - 1)) / COLS + gap
  const rowStep = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--grid-row')) + gap
  return {
    cols: Math.round((event.clientX - start.clientX) / colStep),
    rows: Math.round((event.clientY - start.clientY) / rowStep)
  }
}

function applyAspect(item, next) {
  if (!item.ratio) return next
  const [ratioW, ratioH] = item.ratio.split(':').map(Number)
  const rect = gridCanvas.getBoundingClientRect()
  const gap = parseFloat(getComputedStyle(gridCanvas).gap) || 12
  const colWidth = (rect.width - gap * (COLS - 1)) / COLS
  const rowHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--grid-row'))
  const pixelWidth = next.w * colWidth + (next.w - 1) * gap
  const desiredHeight = Math.max(item.minH, Math.round((pixelWidth / (ratioW / ratioH) - gap) / (rowHeight + gap)))
  return { ...next, h: desiredHeight }
}

function previewInteraction(event) {
  const interaction = state.interaction
  if (!interaction) return
  const delta = getGridDelta(event, interaction.start)
  let next = { ...interaction.origin }
  if (interaction.mode === 'drag') {
    next.x = clamp(interaction.origin.x + delta.cols, 0, COLS - next.w)
    next.y = Math.max(0, interaction.origin.y + delta.rows)
  } else {
    next.w = clamp(interaction.origin.w + delta.cols, interaction.origin.minW, COLS - interaction.origin.x)
    next.h = Math.max(interaction.origin.minH, interaction.origin.h + delta.rows)
    next = applyAspect(interaction.origin, next)
  }
  const layout = getLayout()
  const item = layout.find((candidate) => candidate.id === interaction.id)
  if (!item) return
  const valid = canPlace(item, next, layout)
  const element = document.querySelector(`[data-widget="${interaction.id}"]`)
  if (valid) {
    interaction.current = next
    element.classList.remove('widget--blocked')
    element.style.gridColumn = `${next.x + 1} / span ${next.w}`
    element.style.gridRow = `${next.y + 1} / span ${next.h}`
  } else {
    element.classList.add('widget--blocked')
  }
}

function finishInteraction() {
  const interaction = state.interaction
  if (!interaction) return
  const layout = getLayout()
  const item = layout.find((candidate) => candidate.id === interaction.id)
  if (item && interaction.current) Object.assign(item, interaction.current)
  state.interaction = null
  renderGrid()
}

function selectProject(id) {
  if (state.editMode) cancelEdit()
  state.selectedId = id
  render()
}

function enterEditMode() {
  state.draft = getLayout().map((item) => ({ ...item }))
  state.editMode = true
  renderGrid()
}

function cancelEdit() {
  if (state.draft) setLayout(state.draft)
  state.draft = null
  state.editMode = false
  renderGrid()
}

function saveLayout() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.layouts))
  state.draft = null
  state.editMode = false
  renderGrid()
  showToast('布局已保存')
}

function resetLayout() {
  setLayout(getProject().modules.map((item) => ({ ...item })))
  renderGrid()
  showToast('已恢复默认布局')
}

let toastTimer
function showToast(message) {
  toast.textContent = message
  toast.classList.add('is-visible')
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 1800)
}

async function refreshLiveData(showMessage = false) {
  try {
    const response = await fetch('/api/projects', { cache: 'no-store' })
    if (!response.ok) throw new Error('project data unavailable')
    const payload = await response.json()
    state.liveProjects = payload.projects || {}
    render()
    if (showMessage) showToast('项目数据已刷新')
    return true
  } catch {
    if (showMessage) showToast('项目服务暂不可用，已保留演示数据')
    return false
  }
}

function setSettingsStatus(message = '', tone = '') {
  alistSettingsStatus.textContent = message
  alistSettingsStatus.className = `dialog-status ${tone ? `dialog-status--${tone}` : ''}`
}

function webdavPayload(path = state.alistWebdav.path, name = '') {
  const { url, username, password } = state.alistWebdav
  return { url, username, password, path, name }
}

async function requestWebdav(endpoint, path = state.alistWebdav.path, name = '') {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(webdavPayload(path, name))
  })
  let payload = {}
  try { payload = await response.json() } catch {}
  if (!response.ok) throw new Error(payload.error || 'WebDAV 服务暂时不可用。')
  return payload
}

function applyWebdavPayload(payload) {
  const entries = Array.isArray(payload.entries) ? payload.entries : []
  state.alistWebdav = { ...state.alistWebdav, ...payload, entries, connected: true }
  const alist = state.liveProjects.alist || {}
  state.liveProjects.alist = {
    ...alist,
    source: 'live',
    statusLabel: '运行正常',
    statusClass: 'green',
    summary: `WebDAV · ${entries.length} 项`,
    authorized: true,
    authConfigured: true,
    entries: entries.filter((entry) => entry.isDirectory).map((entry) => ({ name: entry.name, path: entry.path, driver: 'WebDAV' }))
  }
  render()
}

function openSettings() {
  const webdav = state.alistWebdav
  webdavUrlInput.value = webdav.url
  webdavUsernameInput.value = webdav.username
  webdavPasswordInput.value = webdav.password
  webdavRememberInput.checked = webdav.remember
  setSettingsStatus(webdav.connected ? `当前已连接：${webdavPathLabel()}` : '未连接 WebDAV。', webdav.connected ? 'success' : '')
  settingsDialog.showModal()
  webdavUrlInput.focus()
}

function closeSettings() {
  settingsDialog.close()
}

async function connectAlist() {
  const url = webdavUrlInput.value.trim()
  if (!url) {
    setSettingsStatus('请输入 WebDAV 地址。', 'error')
    return
  }
  state.alistWebdav = {
    ...state.alistWebdav,
    url,
    username: webdavUsernameInput.value,
    password: webdavPasswordInput.value,
    remember: webdavRememberInput.checked,
    path: '',
    currentPath: '',
    parentPath: null,
    entries: [],
    connected: false
  }
  setSettingsStatus('正在连接 WebDAV…')
  try {
    const payload = await requestWebdav('/api/alist/webdav/list', '')
    applyWebdavPayload(payload)
    saveWebdavConfig()
    closeSettings()
    showToast(`WebDAV 已连接，共 ${payload.entries.length} 项`)
  } catch (error) {
    setSettingsStatus(error.message, 'error')
  }
}

function clearAlistConnection() {
  localStorage.removeItem(WEBDAV_STORAGE_KEY)
  state.alistWebdav = { url: '', username: '', password: '', remember: false, path: '', currentPath: '', parentPath: null, entries: [], connected: false }
  webdavUrlInput.value = ''
  webdavUsernameInput.value = ''
  webdavPasswordInput.value = ''
  setSettingsStatus('已清除本次 WebDAV 连接。')
  refreshLiveData()
  render()
}

async function restoreWebdav() {
  if (!state.alistWebdav.remember || !state.alistWebdav.url) return
  try {
    applyWebdavPayload(await requestWebdav('/api/alist/webdav/list', ''))
  } catch {
    state.alistWebdav.connected = false
  }
}

async function loadWebdavPath(path) {
  try {
    const payload = await requestWebdav('/api/alist/webdav/list', path)
    applyWebdavPayload(payload)
  } catch (error) {
    showToast(error.message)
  }
}

async function downloadWebdav(path, name) {
  try {
    const response = await fetch('/api/alist/webdav/download', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(webdavPayload(path, name))
    })
    if (!response.ok) {
      let payload = {}
      try { payload = await response.json() } catch {}
      throw new Error(payload.error || '文件下载失败。')
    }
    const blobUrl = URL.createObjectURL(await response.blob())
    const link = document.createElement('a')
    link.href = blobUrl
    link.download = name || 'download'
    link.click()
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000)
  } catch (error) {
    showToast(error.message)
  }
}

function webdavChildPath(name, directory = false) {
  const base = (state.alistWebdav.currentPath || state.alistWebdav.path || '').replace(/\/?$/, '/')
  return `${base}${encodeURIComponent(name)}${directory ? '/' : ''}`
}

function webdavSiblingPath(path, name) {
  const directory = path.endsWith('/')
  const cleanPath = directory ? path.slice(0, -1) : path
  return `${cleanPath.slice(0, cleanPath.lastIndexOf('/') + 1)}${encodeURIComponent(name)}${directory ? '/' : ''}`
}

function webdavDestinationPath(directory, sourcePath, sourceName) {
  let target = directory.trim() || state.alistWebdav.currentPath || state.alistWebdav.path || '/'
  if (!target.startsWith('/')) target = `/${target}`
  if (!target.endsWith('/')) target += '/'
  const name = sourceName || decodeURIComponent(sourcePath.split('/').filter(Boolean).pop() || '未命名')
  return `${target}${encodeURIComponent(name)}${sourcePath.endsWith('/') ? '/' : ''}`
}

async function actionWebdav(action, path, destination = '') {
  const response = await fetch('/api/alist/webdav/action', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ ...webdavPayload(path), action, destination })
  })
  let payload = {}
  try { payload = await response.json() } catch {}
  if (!response.ok) throw new Error(payload.error || 'WebDAV 操作失败。')
  return payload
}

function openWebdavNameDialog(type, path = '', oldName = '') {
  webdavNameAction = { type, path, oldName }
  const rename = type === 'rename'
  const transfer = type === 'move' || type === 'copy'
  webdavNameTitle.textContent = rename ? '重命名' : transfer ? (type === 'move' ? '移动到' : '复制到') : '新建文件夹'
  webdavNameLabel.textContent = transfer ? '目标目录' : '名称'
  webdavNameSubmit.textContent = rename ? '重命名' : transfer ? (type === 'move' ? '移动' : '复制') : '创建'
  webdavNameInput.value = transfer ? (state.alistWebdav.currentPath || state.alistWebdav.path || '/') : oldName
  webdavNameInput.placeholder = transfer ? '例如 /dav/归档/' : '输入名称'
  webdavNameStatus.textContent = rename ? '输入新的名称。' : transfer ? `将“${oldName}”${type === 'move' ? '移动' : '复制'}到目标目录。` : '新文件夹会创建在当前目录。'
  webdavNameStatus.className = 'dialog-status'
  webdavNameDialog.showModal()
  webdavNameInput.focus()
  if (rename) webdavNameInput.select()
  if (transfer) webdavNameInput.select()
}

function closeWebdavNameDialog() {
  webdavNameDialog.close()
  webdavNameAction = null
}

async function submitWebdavName() {
  const action = webdavNameAction
  const name = webdavNameInput.value.trim()
  if (!action) return
  const transfer = action.type === 'move' || action.type === 'copy'
  if (!name || (!transfer && /[\\/]/.test(name))) {
    webdavNameStatus.textContent = '请输入不包含斜杠的名称。'
    webdavNameStatus.className = 'dialog-status dialog-status--error'
    return
  }
  if (transfer && !name.startsWith('/')) {
    webdavNameStatus.textContent = '目标目录需要以 / 开头。'
    webdavNameStatus.className = 'dialog-status dialog-status--error'
    return
  }
  const destination = action.type === 'mkdir' ? webdavChildPath(name, true) : transfer ? webdavDestinationPath(name, action.path, action.oldName) : webdavSiblingPath(action.path, name)
  const path = action.type === 'mkdir' ? destination : action.path
  webdavNameSubmit.disabled = true
  try {
    await actionWebdav(action.type, path, destination)
    closeWebdavNameDialog()
    await loadWebdavPath(state.alistWebdav.path)
    showToast(action.type === 'mkdir' ? '文件夹已创建' : action.type === 'rename' ? '文件已重命名' : action.type === 'move' ? '文件已移动' : '文件已复制')
  } catch (error) {
    webdavNameStatus.textContent = error.message
    webdavNameStatus.className = 'dialog-status dialog-status--error'
  } finally {
    webdavNameSubmit.disabled = false
  }
}

async function deleteWebdavEntry(path, name) {
  if (!window.confirm(`确定删除“${name}”吗？`)) return
  try {
    await actionWebdav('delete', path)
    await loadWebdavPath(state.alistWebdav.path)
    showToast('已删除')
  } catch (error) {
    showToast(error.message)
  }
}

async function uploadWebdavFile(file) {
  if (!file || !state.alistWebdav.connected) return
  const path = webdavChildPath(file.name)
  try {
    const response = await fetch('/api/alist/webdav/upload', {
      method: 'POST',
      headers: {
        'content-type': file.type || 'application/octet-stream',
        'x-webdav-url': state.alistWebdav.url,
        'x-webdav-username': state.alistWebdav.username,
        'x-webdav-password': state.alistWebdav.password,
        'x-webdav-path': path
      },
      body: file
    })
    let payload = {}
    try { payload = await response.json() } catch {}
    if (!response.ok) throw new Error(payload.error || '文件上传失败。')
    await loadWebdavPath(state.alistWebdav.path)
    showToast(`已上传 ${file.name}`)
  } catch (error) {
    showToast(error.message)
  } finally {
    webdavUploadInput.value = ''
  }
}

async function handleWebdavOpen(button) {
  if (button.dataset.webdavDirectory === 'true') {
    await loadWebdavPath(button.dataset.webdavOpen)
    return
  }
  await downloadWebdav(button.dataset.webdavOpen, button.dataset.webdavName || 'download')
}

async function handleWebdavParent() {
  if (state.alistWebdav.parentPath) await loadWebdavPath(state.alistWebdav.parentPath)
}

async function handleWebdavRefresh() {
  if (state.alistWebdav.connected) await loadWebdavPath(state.alistWebdav.path)
}

async function handleWebdavDownload(button) {
  await downloadWebdav(button.dataset.webdavDownload, button.dataset.webdavName)
}

async function toggleTodo(id, button) {
  if (!id) return
  button.disabled = true
  try {
    const response = await fetch(`/api/actions/tagtime/todos/${encodeURIComponent(id)}/toggle`, { method: 'POST' })
    if (!response.ok) throw new Error('todo update failed')
    await refreshLiveData(true)
  } catch {
    button.disabled = false
    showToast('待办更新失败')
  }
}

projectList.addEventListener('click', (event) => {
  if (event.target.closest('[data-direct]')) return
  const item = event.target.closest('[data-project]')
  if (item) selectProject(item.dataset.project)
})

projectList.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter' && event.key !== ' ') return
  const item = event.target.closest('[data-project]')
  if (item) selectProject(item.dataset.project)
})

document.addEventListener('click', (event) => {
  const todoToggle = event.target.closest('[data-todo-toggle]')
  if (todoToggle) {
    toggleTodo(todoToggle.dataset.todoToggle, todoToggle)
    return
  }
  const widgetOpen = event.target.closest('[data-widget-open]')
  if (widgetOpen) window.open(widgetOpen.dataset.widgetOpen, '_blank', 'noopener,noreferrer')
  if (event.target.closest('[data-toggle-edit]')) state.editMode ? saveLayout() : enterEditMode()
  if (event.target.closest('[data-cancel]')) cancelEdit()
  if (event.target.closest('[data-save]')) saveLayout()
  if (event.target.closest('[data-reset]')) resetLayout()
  if (event.target.closest('[data-refresh]')) refreshLiveData(true)
  const webdavOpen = event.target.closest('[data-webdav-open]')
  if (webdavOpen) {
    handleWebdavOpen(webdavOpen)
    return
  }
  const webdavDownload = event.target.closest('[data-webdav-download]')
  if (webdavDownload) {
    handleWebdavDownload(webdavDownload)
    return
  }
  const webdavRename = event.target.closest('[data-webdav-rename]')
  if (webdavRename) {
    openWebdavNameDialog('rename', webdavRename.dataset.webdavRename, webdavRename.dataset.webdavName)
    return
  }
  const webdavMove = event.target.closest('[data-webdav-move]')
  if (webdavMove) {
    webdavMove.closest('details')?.removeAttribute('open')
    openWebdavNameDialog('move', webdavMove.dataset.webdavMove, webdavMove.dataset.webdavName)
    return
  }
  const webdavCopy = event.target.closest('[data-webdav-copy]')
  if (webdavCopy) {
    webdavCopy.closest('details')?.removeAttribute('open')
    openWebdavNameDialog('copy', webdavCopy.dataset.webdavCopy, webdavCopy.dataset.webdavName)
    return
  }
  const webdavDelete = event.target.closest('[data-webdav-delete]')
  if (webdavDelete) {
    deleteWebdavEntry(webdavDelete.dataset.webdavDelete, webdavDelete.dataset.webdavName)
    return
  }
  if (event.target.closest('[data-webdav-new-folder]')) {
    openWebdavNameDialog('mkdir')
    return
  }
  if (event.target.closest('[data-webdav-upload]')) {
    webdavUploadInput.click()
    return
  }
  if (event.target.closest('[data-webdav-parent]')) {
    handleWebdavParent()
    return
  }
  if (event.target.closest('[data-webdav-refresh]')) {
    handleWebdavRefresh()
    return
  }
  if (event.target.closest('[data-settings]') || event.target.closest('[data-settings-open]')) openSettings()
  if (event.target.closest('[data-settings-close]')) closeSettings()
  if (event.target.closest('[data-settings-clear]')) clearAlistConnection()
  if (event.target.closest('[data-webdav-name-close]')) closeWebdavNameDialog()
})

settingsForm.addEventListener('submit', (event) => {
  event.preventDefault()
  connectAlist()
})

webdavNameForm.addEventListener('submit', (event) => {
  event.preventDefault()
  submitWebdavName()
})

webdavUploadInput.addEventListener('change', (event) => {
  uploadWebdavFile(event.target.files[0])
})

document.addEventListener('change', (event) => {
  const select = event.target.closest('[data-ratio]')
  if (!select) return
  const item = getLayout().find((candidate) => candidate.id === select.dataset.ratio)
  if (!item) return
  item.ratio = select.value
  const candidate = applyAspect(item, { ...item })
  if (canPlace(item, candidate, getLayout())) Object.assign(item, candidate)
  renderGrid()
})

function startInteraction(event, mode) {
  if (!state.editMode || state.interaction) return
  const grab = event.target.closest('[data-grab]')
  const resize = event.target.closest('[data-resize]')
  if (mode === 'drag' && !grab) return
  if (mode === 'resize' && !resize) return
  if (!grab && !resize) return
  const widget = event.target.closest('[data-widget]')
  if (!widget) return
  const item = getLayout().find((candidate) => candidate.id === widget.dataset.widget)
  if (!item) return
  state.interaction = { id: item.id, mode: resize ? 'resize' : 'drag', start: event, origin: { ...item }, current: { ...item } }
  event.preventDefault()
}

gridCanvas.addEventListener('pointerdown', (event) => startInteraction(event, 'pointer'))
gridCanvas.addEventListener('mousedown', (event) => startInteraction(event, 'mouse'))

window.addEventListener('pointermove', (event) => {
  if (state.interaction) previewInteraction(event)
})

window.addEventListener('mousemove', (event) => {
  if (state.interaction) previewInteraction(event)
})

window.addEventListener('pointerup', finishInteraction)
window.addEventListener('mouseup', finishInteraction)

render()
refreshLiveData()
restoreWebdav()
setInterval(() => {
  if (!state.editMode) refreshLiveData()
}, 60000)
