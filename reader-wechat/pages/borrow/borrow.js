// pages/borrow/borrow.js
import { getBorrowList, renewBook } from '../../api/borrow'
import { isExpired } from '../../utils/date'

Page({
  data: {
    borrowRecords: [],
    filterStatus: 'all',
    page: 1,
    pageSize: 10,
    hasMore: true,
    loading: false
  },

  onLoad() {
    this.loadBorrowRecords()
  },

  // 加载借阅记录
  async loadBorrowRecords() {
    if (this.data.loading || !this.data.hasMore) return

    this.setData({ loading: true })

    try {
      const params = {
        status: this.data.filterStatus === 'all' ? '' : this.data.filterStatus,
        page: this.data.page,
        pageSize: this.data.pageSize
      }

      const res = await getBorrowList(params)

      if (res.data) {
        const newRecords = this.data.page === 1 ? res.data.list : [...this.data.borrowRecords, ...res.data.list]
        this.setData({
          borrowRecords: newRecords,
          hasMore: newRecords.length < res.data.total,
          page: this.data.page + 1
        })
      }
    } catch (error) {
      console.error('加载借阅记录失败:', error)
    } finally {
      this.setData({ loading: false })
    }
  },

  // 按状态筛选
  filterByStatus(e) {
    const status = e.currentTarget.dataset.status
    this.setData({
      filterStatus: status,
      page: 1,
      borrowRecords: [],
      hasMore: true
    })
    this.loadBorrowRecords()
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

  // 续借
  async handleRenew(e) {
    const id = e.currentTarget.dataset.id

    wx.showModal({
      title: '续借确认',
      content: '确定要续借此书吗？',
      success: async (res) => {
        if (res.confirm) {
          this.setData({ loading: true })
          try {
            const renewRes = await renewBook(id)
            if (renewRes.code === 200) {
              wx.showToast({ title: '续借成功', icon: 'success' })
              // 刷新列表
              setTimeout(() => {
                this.setData({ page: 1, borrowRecords: [], hasMore: true })
                this.loadBorrowRecords()
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
  },

  // 跳转到借阅详情
  goToBorrowDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({ url: `/pages/borrowDetail/borrowDetail?id=${id}` })
  },

  // 加载更多
  loadMore() {
    this.loadBorrowRecords()
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.setData({ page: 1, borrowRecords: [], hasMore: true })
    this.loadBorrowRecords().finally(() => {
      wx.stopPullDownRefresh()
    })
  },

  // 上拉加载更多
  onReachBottom() {
    this.loadBorrowRecords()
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
  }
})