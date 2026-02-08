// pages/profile/profile.js
import { getUserInfo, getUserStatistics, uploadAvatar } from '../../api/auth'

Page({
  data: {
    userInfo: null,
    userStats: null
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

      // 并行请求数据
      const [userInfoRes, userStatsRes] = await Promise.all([
        getUserInfo(),
        getUserStatistics()
      ])

      if (userInfoRes.data) {
        this.setData({ userInfo: userInfoRes.data })
      }

      if (userStatsRes.data) {
        this.setData({ userStats: userStatsRes.data })
      }
    } catch (error) {
      console.error('初始化数据失败:', error)
    }
  },

  // 选择头像
  chooseAvatar() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: async (res) => {
        const tempFilePaths = res.tempFilePaths
        if (tempFilePaths.length > 0) {
          this.uploadAvatar(tempFilePaths[0])
        }
      }
    })
  },

  // 上传头像
  async uploadAvatar(filePath) {
    try {
      wx.showLoading({ title: '上传中...' })
      const res = await uploadAvatar(filePath)
      if (res.code === 200) {
        wx.showToast({ title: '头像上传成功', icon: 'success' })
        // 刷新用户信息
        setTimeout(() => {
          this.initData()
        }, 1500)
      }
    } catch (error) {
      console.error('上传头像失败:', error)
      wx.showToast({ title: '上传失败', icon: 'none' })
    } finally {
      wx.hideLoading()
    }
  },

  // 跳转到更新个人信息页面
  goToUpdateProfile() {
    wx.navigateTo({ url: '/pages/profile/updateProfile/updateProfile' })
  },

  // 跳转到修改密码页面
  goToChangePassword() {
    wx.navigateTo({ url: '/pages/profile/changePassword/changePassword' })
  },

  // 跳转到我的借阅
  goToBorrow() {
    wx.navigateTo({ url: '/pages/borrow/borrow' })
  },

  // 跳转到我的预约
  goToReservation() {
    wx.navigateTo({ url: '/pages/reservation/reservation' })
  },

  // 跳转到关于页面
  goToAbout() {
    wx.showModal({
      title: '关于',
      content: '图书馆读者系统 v1.0.0\n\n提供图书查询、借阅管理、预约管理等功能。',
      showCancel: false
    })
  },

  // 跳转到设置页面
  goToSettings() {
    wx.showModal({
      title: '设置',
      content: '设置功能开发中...',
      showCancel: false
    })
  },

  // 退出登录
  handleLogout() {
    wx.showModal({
      title: '退出登录',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          const app = getApp()
          app.logout()
        }
      }
    })
  }
})