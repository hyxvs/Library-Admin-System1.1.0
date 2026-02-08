// pages/borrowDetail/borrowDetail.js
import { getBorrowDetail, renewBook } from '../../api/borrow'
import { isExpired } from '../../utils/date'

Page({
  data: {
    borrowId: null,
    borrowRecord: null,
    loading: false
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ borrowId: options.id })
      this.loadBorrowDetail()
    } else {
      wx.showToast({ title: '参数错误', icon: 'none' })
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    }
  },

  // 加载借阅详情
  async loadBorrowDetail() {
    if (!this.data.borrowId) return

    this.setData({ loading: true })

    try {
      const res = await getBorrowDetail(this.data.borrowId)
      if (res.data) {
        this.setData({ borrowRecord: res.data })
      }
    } catch (error) {
      console.error('加载借阅详情失败:', error)
      wx.showToast({ title: '加载失败', icon: 'none' })
    } finally {
      this.setData({ loading: false })
    }
  },

  // 获取状态文本
  getStatusText(status, dueDate) {
    if (status === 'borrowed' && this.isOverdue(dueDate)) {
      return '已逾期'
    }
    switch (status) {
      case 'borrowed':
        return '借阅中'
      case 'returned':
        return '已归还'
      default:
        return status
    }
  },

  // 获取状态样式
  getStatusClass(status, dueDate) {
    if (status === 'borrowed' && this.isOverdue(dueDate)) {
      return 'overdue'
    }
    return status
  },

  // 判断是否逾期
  isOverdue(dueDate) {
    return isExpired(dueDate)
  },

  // 获取封面图片URL
  getCoverUrl(cover) {
    if (!cover) {
      return 'https://img.yzcdn.cn/vant/cat.jpeg'
    }
    // 检查是否为完整URL
    if (cover.startsWith('http://') || cover.startsWith('https://')) {
      return cover
    }
    // 相对路径，拼接完整URL
    const app = getApp()
    const baseUrl = app.globalData.apiBaseUrl
    // 移除baseUrl中的/api后缀
    const uploadBaseUrl = baseUrl.replace('/api', '')
    return uploadBaseUrl + cover
  },

  // 续借
  async handleRenew() {
    if (!this.data.borrowRecord || this.data.borrowRecord.status !== 'borrowed') {
      wx.showToast({ title: '该记录不可续借', icon: 'none' })
      return
    }

    wx.showModal({
      title: '续借确认',
      content: '确定要续借此书吗？',
      success: async (res) => {
        if (res.confirm) {
          this.setData({ loading: true })
          try {
            const renewRes = await renewBook(this.data.borrowId)
            if (renewRes.code === 200) {
              wx.showToast({ title: '续借成功', icon: 'success' })
              // 刷新详情
              setTimeout(() => {
                this.loadBorrowDetail()
              }, 1500)
            }
          } catch (error) {
            console.error('续借失败:', error)
          } finally {
            this.setData({ loading: false })
          }
        }
      }
    })
  }
})