// pages/bookDetail/bookDetail.js
import { getBookDetail } from '../../api/books'
import { borrowBook } from '../../api/borrow'
import { createReservation } from '../../api/reservation'

Page({
  data: {
    bookId: null,
    book: null,
    loading: false
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ bookId: options.id })
      this.loadBookDetail()
    } else {
      wx.showToast({ title: '参数错误', icon: 'none' })
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    }
  },

  // 加载图书详情
  async loadBookDetail() {
    if (!this.data.bookId) return

    this.setData({ loading: true })

    try {
      const res = await getBookDetail(this.data.bookId)
      if (res.data) {
        this.setData({ book: res.data })
      }
    } catch (error) {
      console.error('加载图书详情失败:', error)
      wx.showToast({ title: '加载失败', icon: 'none' })
    } finally {
      this.setData({ loading: false })
    }
  },

  // 立即借阅
  async handleBorrow() {
    if (!this.data.book || this.data.book.status !== 1) {
      wx.showToast({ title: '图书不可借', icon: 'none' })
      return
    }

    this.setData({ loading: true })

    try {
      const res = await borrowBook({ book_id: this.data.book.id })
      if (res.code === 200) {
        wx.showToast({ title: '借阅成功', icon: 'success' })
        // 刷新图书详情
        setTimeout(() => {
          this.loadBookDetail()
        }, 1500)
      }
    } catch (error) {
      console.error('借阅失败:', error)
    } finally {
      this.setData({ loading: false })
    }
  },

  // 预约
  async handleReserve() {
    if (!this.data.book) return

    this.setData({ loading: true })

    try {
      const res = await createReservation({ book_id: this.data.book.id })
      if (res.code === 200) {
        wx.showToast({ title: '预约成功', icon: 'success' })
        // 刷新图书详情
        setTimeout(() => {
          this.loadBookDetail()
        }, 1500)
      }
    } catch (error) {
      console.error('预约失败:', error)
    } finally {
      this.setData({ loading: false })
    }
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

  // 分享
  onShareAppMessage() {
    return {
      title: this.data.book && this.data.book.title ? this.data.book.title : '图书馆读者系统',
      path: `/pages/bookDetail/bookDetail?id=${this.data.bookId}`
    }
  }
})