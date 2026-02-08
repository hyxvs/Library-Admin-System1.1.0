// pages/reservation/reservation.js
import { getReservationList, cancelReservation } from '../../api/reservation'

Page({
  data: {
    reservations: [],
    filterStatus: 'all',
    page: 1,
    pageSize: 10,
    hasMore: true,
    loading: false
  },

  onLoad() {
    this.loadReservations()
  },

  // 加载预约记录
  async loadReservations() {
    if (this.data.loading || !this.data.hasMore) return

    this.setData({ loading: true })

    try {
      const params = {
        status: this.data.filterStatus === 'all' ? '' : this.data.filterStatus,
        page: this.data.page,
        pageSize: this.data.pageSize
      }

      const res = await getReservationList(params)

      if (res.data) {
        const newReservations = this.data.page === 1 ? res.data.list : [...this.data.reservations, ...res.data.list]
        this.setData({
          reservations: newReservations,
          hasMore: newReservations.length < res.data.total,
          page: this.data.page + 1
        })
      }
    } catch (error) {
      console.error('加载预约记录失败:', error)
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
      reservations: [],
      hasMore: true
    })
    this.loadReservations()
  },

  // 获取状态文本
  getStatusText(status) {
    switch (status) {
      case 'pending':
        return '预约中'
      case 'completed':
        return '已完成'
      case 'cancelled':
        return '已取消'
      default:
        return status
    }
  },

  // 获取状态样式
  getStatusClass(status) {
    return status
  },

  // 取消预约
  async handleCancel(e) {
    const id = e.currentTarget.dataset.id

    wx.showModal({
      title: '取消预约',
      content: '确定要取消此预约吗？',
      success: async (res) => {
        if (res.confirm) {
          this.setData({ loading: true })
          try {
            const cancelRes = await cancelReservation(id)
            if (cancelRes.code === 200) {
              wx.showToast({ title: '取消成功', icon: 'success' })
              // 刷新列表
              setTimeout(() => {
                this.setData({ page: 1, reservations: [], hasMore: true })
                this.loadReservations()
              }, 1500)
            }
          } catch (error) {
            console.error('取消预约失败:', error)
          } finally {
            this.setData({ loading: false })
          }
        }
      }
    })
  },

  // 加载更多
  loadMore() {
    this.loadReservations()
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.setData({ page: 1, reservations: [], hasMore: true })
    this.loadReservations().finally(() => {
      wx.stopPullDownRefresh()
    })
  },

  // 上拉加载更多
  onReachBottom() {
    this.loadReservations()
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