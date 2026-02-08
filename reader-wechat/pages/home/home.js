// pages/home/home.js
import { getUserInfo, getUserStatistics } from '../../api/auth'
import { getHotBooks } from '../../api/books'
import { formatDate } from '../../utils/date'

Page({
  data: {
    userInfo: null,
    userStats: null,
    hotBooks: [],
    announcement: null,
    currentDate: ''
  },

  onLoad() {
    this.initData()
  },

  onShow() {
    // 每次显示页面时更新数据
    this.initData()
  },

  // 初始化数据
  async initData() {
    try {
      // 检查登录状态
      const app = getApp()
      if (!app.globalData.isLoggedIn) {
        wx.redirectTo({ url: '/pages/login/login' })
        return
      }

      // 更新当前日期
      this.setData({
        currentDate: formatDate(new Date(), 'YYYY年MM月DD日')
      })

      // 并行请求数据
      const [userInfoRes, userStatsRes, hotBooksRes] = await Promise.all([
        getUserInfo(),
        getUserStatistics(),
        getHotBooks()
      ])

      if (userInfoRes.data) {
        this.setData({ userInfo: userInfoRes.data })
      }

      if (userStatsRes.data) {
        this.setData({ userStats: userStatsRes.data })
      }

      if (hotBooksRes.data) {
        this.setData({ hotBooks: hotBooksRes.data })
      }

      // 获取公告信息（这里可以根据实际API调整）
      this.getAnnouncement()
    } catch (error) {
      console.error('初始化数据失败:', error)
    }
  },

  // 获取公告信息
  getAnnouncement() {
    // 模拟公告数据
    this.setData({
      announcement: {
        title: '图书馆开放时间调整通知',
        content: '尊敬的读者，因节假日安排，图书馆将于近期调整开放时间，请关注相关通知。',
        created_at: formatDate(new Date(), 'YYYY-MM-DD')
      }
    })
  },

  // 跳转到图书查询
  goToBooks() {
    wx.navigateTo({ url: '/pages/books/books' })
  },

  // 跳转到我的借阅
  goToBorrow() {
    wx.navigateTo({ url: '/pages/borrow/borrow' })
  },

  // 跳转到我的预约
  goToReservation() {
    wx.navigateTo({ url: '/pages/reservation/reservation' })
  },

  // 跳转到个人中心
  goToProfile() {
    wx.navigateTo({ url: '/pages/profile/profile' })
  },

  // 跳转到图书详情
  goToBookDetail(e) {
    const bookId = e.currentTarget.dataset.id
    wx.navigateTo({ url: `/pages/bookDetail/bookDetail?id=${bookId}` })
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