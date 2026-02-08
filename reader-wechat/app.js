// app.js
App({
  onLaunch() {
    // 初始化登录状态
    this.checkLoginStatus()
  },
  
  checkLoginStatus() {
    const token = wx.getStorageSync('token')
    if (token) {
      // 验证token是否有效
      const payload = this.parseToken(token)
      if (payload && payload.exp * 1000 > Date.now()) {
        this.globalData.isLoggedIn = true
        this.globalData.token = token
        this.globalData.userInfo = wx.getStorageSync('userInfo')
      } else {
        // token过期
        this.logout()
      }
    }
  },
  
  parseToken(token) {
    try {
      return JSON.parse(wx.base64Decode(token.split('.')[1]))
    } catch (error) {
      return null
    }
  },
  
  login(token, userInfo) {
    this.globalData.isLoggedIn = true
    this.globalData.token = token
    this.globalData.userInfo = userInfo
    wx.setStorageSync('token', token)
    wx.setStorageSync('userInfo', userInfo)
  },
  
  logout() {
    this.globalData.isLoggedIn = false
    this.globalData.token = ''
    this.globalData.userInfo = null
    wx.removeStorageSync('token')
    wx.removeStorageSync('userInfo')
    wx.reLaunch({ url: '/pages/login/login' })
  },
  
  globalData: {
    isLoggedIn: false,
    token: '',
    userInfo: null,
    apiBaseUrl: 'http://localhost:3000/api'
  }
})