// 全局快捷键管理
import { ElMessage } from 'element-plus'

class KeyboardShortcuts {
  constructor() {
    this.shortcuts = {
      // 通用快捷键
      'Ctrl+F': { description: '页面搜索', handler: this.handleSearch.bind(this) },
      'Enter': { description: '提交表单', handler: this.handleSubmit.bind(this) },
      'Escape': { description: '关闭弹窗', handler: this.handleClose.bind(this) },
      // 导航快捷键
      'Ctrl+1': { description: '首页', handler: this.handleNavigate.bind(this, '/dashboard') },
      'Ctrl+2': { description: '图书管理', handler: this.handleNavigate.bind(this, '/books') },
      'Ctrl+3': { description: '借阅管理', handler: this.handleNavigate.bind(this, '/borrow') },
      'Ctrl+4': { description: '读者管理', handler: this.handleNavigate.bind(this, '/readers') },
      'Ctrl+5': { description: '预约管理', handler: this.handleNavigate.bind(this, '/appointment') },
      'Ctrl+6': { description: '统计报表', handler: this.handleNavigate.bind(this, '/dashboard') },
      'Ctrl+7': { description: '用户管理', handler: this.handleNavigate.bind(this, '/users') },
      // 操作快捷键
      'Ctrl+N': { description: '新增', handler: this.handleCreate.bind(this) },
      'Ctrl+E': { description: '编辑', handler: this.handleEdit.bind(this) },
      'Ctrl+D': { description: '删除', handler: this.handleDelete.bind(this) },
      'Ctrl+R': { description: '刷新', handler: this.handleRefresh.bind(this) }
    }
    this.isActive = true
    this.bindEvents()
  }

  // 绑定事件
  bindEvents() {
    document.addEventListener('keydown', this.handleKeydown.bind(this))
  }

  // 解绑事件
  unbindEvents() {
    document.removeEventListener('keydown', this.handleKeydown.bind(this))
  }

  // 键盘事件处理
  handleKeydown(event) {
    if (!this.isActive) return

    let key = ''
    if (event.ctrlKey) key += 'Ctrl+'
    if (event.shiftKey) key += 'Shift+'
    if (event.altKey) key += 'Alt+'
    key += event.key

    const shortcut = this.shortcuts[key]
    if (shortcut) {
      event.preventDefault()
      shortcut.handler()
    }
  }

  // 页面搜索
  handleSearch() {
    const searchInput = document.querySelector('input[placeholder*="搜索"], input[placeholder*="查找"]')
    if (searchInput) {
      searchInput.focus()
      ElMessage.info('已聚焦搜索框')
    } else {
      ElMessage.info('当前页面无搜索框')
    }
  }

  // 提交表单
  handleSubmit() {
    const submitBtn = document.querySelector('.el-button--primary[type="button"], .el-button--primary')
    if (submitBtn && !submitBtn.disabled) {
      submitBtn.click()
    }
  }

  // 关闭弹窗
  handleClose() {
    const closeBtn = document.querySelector('.el-dialog__headerbtn, .el-button:not(.el-button--primary):last-child')
    if (closeBtn) {
      closeBtn.click()
    }
  }

  // 导航
  handleNavigate(path) {
    if (window.location.pathname !== path) {
      window.location.href = path
    }
  }

  // 新增
  handleCreate() {
    const createBtn = document.querySelector('.el-button--primary .el-icon-plus, .el-button--primary:contains("新增")')
    if (createBtn) {
      createBtn.click()
    } else {
      ElMessage.info('当前页面无新增按钮')
    }
  }

  // 编辑
  handleEdit() {
    ElMessage.info('请选择要编辑的项目')
  }

  // 删除
  handleDelete() {
    ElMessage.info('请选择要删除的项目')
  }

  // 刷新
  handleRefresh() {
    window.location.reload()
  }

  // 启用/禁用快捷键
  setActive(active) {
    this.isActive = active
  }

  // 获取快捷键列表
  getShortcuts() {
    return this.shortcuts
  }

  // 注册自定义快捷键
  registerShortcut(key, description, handler) {
    this.shortcuts[key] = { description, handler }
  }

  // 移除快捷键
  removeShortcut(key) {
    delete this.shortcuts[key]
  }
}

// 导出类和单例
export { KeyboardShortcuts }
export default new KeyboardShortcuts()
