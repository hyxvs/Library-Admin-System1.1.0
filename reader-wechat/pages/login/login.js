// pages/login/login.js
import { login, register } from '../../api/auth'

Page({
  data: {
    activeTab: 'login',
    loading: false,
    loginForm: {
      username: '',
      password: ''
    },
    registerForm: {
      username: '',
      password: '',
      confirmPassword: '',
      realName: '',
      idCard: '',
      email: ''
    }
  },

  onLoad() {
    // 检查登录状态
    const app = getApp()
    if (app.globalData.isLoggedIn) {
      wx.reLaunch({ url: '/pages/home/home' })
    }
  },

  // 切换标签
  switchTab(e) {
    this.setData({
      activeTab: e.currentTarget.dataset.tab
    })
  },

  // 登录表单输入
  onLoginInput(e) {
    const field = e.currentTarget.dataset.field
    this.setData({
      [`loginForm.${field}`]: e.detail.value
    })
  },

  // 注册表单输入
  onRegisterInput(e) {
    const field = e.currentTarget.dataset.field
    this.setData({
      [`registerForm.${field}`]: e.detail.value
    })
  },

  // 验证密码
  validatePassword() {
    const { password, confirmPassword } = this.data.registerForm
    if (password !== confirmPassword) {
      wx.showToast({
        title: '两次输入的密码不一致',
        icon: 'none'
      })
      return false
    }
    return true
  },

  // 验证注册表单
  validateRegisterForm() {
    const { username, password, realName, idCard, email } = this.data.registerForm
    
    if (!username || username.trim() === '') {
      wx.showToast({ title: '请输入用户名', icon: 'none' })
      return false
    }
    if (!password || password.length < 6) {
      wx.showToast({ title: '密码长度至少6位', icon: 'none' })
      return false
    }
    if (!realName || realName.trim() === '') {
      wx.showToast({ title: '请输入真实姓名', icon: 'none' })
      return false
    }
    if (!idCard || idCard.trim() === '') {
      wx.showToast({ title: '请输入身份证号', icon: 'none' })
      return false
    }
    if (!email || email.trim() === '') {
      wx.showToast({ title: '请输入邮箱', icon: 'none' })
      return false
    }
    if (!this.validatePassword()) {
      return false
    }
    return true
  },

  // 处理登录
  async handleLogin() {
    const { username, password } = this.data.loginForm
    
    if (!username || !password) {
      wx.showToast({ title: '请输入用户名和密码', icon: 'none' })
      return
    }
    
    this.setData({ loading: true })
    
    try {
      const res = await login(this.data.loginForm)
      if (res.data && res.data.token) {
        const app = getApp()
        app.login(res.data.token, res.data.user)
        
        wx.showToast({
          title: '登录成功',
          icon: 'success'
        })
        
        setTimeout(() => {
          wx.reLaunch({ url: '/pages/home/home' })
        }, 1500)
      }
    } catch (error) {
      console.error('登录失败:', error)
    } finally {
      this.setData({ loading: false })
    }
  },

  // 处理注册
  async handleRegister() {
    if (!this.validateRegisterForm()) {
      return
    }
    
    this.setData({ loading: true })
    
    try {
      const { confirmPassword, ...data } = this.data.registerForm
      await register(data)
      
      wx.showToast({
        title: '注册成功，请登录',
        icon: 'success'
      })
      
      setTimeout(() => {
        this.setData({
          activeTab: 'login',
          registerForm: {
            username: '',
            password: '',
            confirmPassword: '',
            realName: '',
            idCard: '',
            email: ''
          }
        })
      }, 1500)
    } catch (error) {
      console.error('注册失败:', error)
    } finally {
      this.setData({ loading: false })
    }
  }
})