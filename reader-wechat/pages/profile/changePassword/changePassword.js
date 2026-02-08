// pages/profile/changePassword/changePassword.js
import { changePassword } from '../../../api/auth'

Page({
  data: {
    formData: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
    loading: false
  },

  // 输入事件
  onInput(e) {
    const field = e.currentTarget.dataset.field
    this.setData({
      [`formData.${field}`]: e.detail.value
    })
  },

  // 取消
  cancel() {
    wx.navigateBack()
  },

  // 验证表单
  validateForm() {
    const { oldPassword, newPassword, confirmPassword } = this.data.formData

    if (!oldPassword) {
      wx.showToast({ title: '请输入旧密码', icon: 'none' })
      return false
    }

    if (!newPassword || newPassword.length < 6) {
      wx.showToast({ title: '新密码长度至少6位', icon: 'none' })
      return false
    }

    if (newPassword !== confirmPassword) {
      wx.showToast({ title: '两次输入的新密码不一致', icon: 'none' })
      return false
    }

    return true
  },

  // 保存
  async save() {
    if (!this.validateForm()) {
      return
    }

    this.setData({ loading: true })

    try {
      const { oldPassword, newPassword } = this.data.formData
      const res = await changePassword({ oldPassword, newPassword })
      if (res.code === 200) {
        wx.showToast({ title: '密码修改成功', icon: 'success' })
        setTimeout(() => {
          wx.navigateBack()
        }, 1500)
      }
    } catch (error) {
      console.error('修改密码失败:', error)
      wx.showToast({ title: '修改失败', icon: 'none' })
    } finally {
      this.setData({ loading: false })
    }
  }
})