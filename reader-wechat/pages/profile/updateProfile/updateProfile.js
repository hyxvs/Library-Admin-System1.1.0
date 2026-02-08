// pages/profile/updateProfile/updateProfile.js
import { getUserInfo, updateUserProfile } from '../../../api/auth'

Page({
  data: {
    userInfo: null,
    formData: {
      name: '',
      gender: 'male',
      email: ''
    },
    loading: false
  },

  onLoad() {
    this.initData()
  },

  // 初始化数据
  async initData() {
    try {
      const res = await getUserInfo()
      if (res.data) {
        this.setData({ userInfo: res.data })
        this.setData({
          formData: {
            name: res.data.name || '',
            gender: res.data.gender || 'male',
            email: res.data.email || ''
          }
        })
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
      wx.showToast({ title: '加载失败', icon: 'none' })
    }
  },

  // 输入事件
  onInput(e) {
    const field = e.currentTarget.dataset.field
    this.setData({
      [`formData.${field}`]: e.detail.value
    })
  },

  // 选择性别
  selectGender(e) {
    this.setData({
      'formData.gender': e.currentTarget.dataset.gender
    })
  },

  // 取消
  cancel() {
    wx.navigateBack()
  },

  // 保存
  async save() {
    const { name, gender, email } = this.data.formData

    if (!name || name.trim() === '') {
      wx.showToast({ title: '请输入真实姓名', icon: 'none' })
      return
    }

    if (!email || email.trim() === '') {
      wx.showToast({ title: '请输入邮箱', icon: 'none' })
      return
    }

    this.setData({ loading: true })

    try {
      const res = await updateUserProfile(this.data.formData)
      if (res.code === 200) {
        wx.showToast({ title: '保存成功', icon: 'success' })
        setTimeout(() => {
          wx.navigateBack()
        }, 1500)
      }
    } catch (error) {
      console.error('更新失败:', error)
      wx.showToast({ title: '保存失败', icon: 'none' })
    } finally {
      this.setData({ loading: false })
    }
  }
})