// api/auth.js
import { post, get, put } from '../utils/request'

// 登录
export const login = (data) => {
  return post('/reader/login', data)
}

// 注册
export const register = (data) => {
  return post('/reader/register', data)
}

// 登出
export const logout = () => {
  return post('/reader/logout')
}

// 获取用户信息
export const getUserInfo = () => {
  return get('/reader/user/info')
}

// 更新用户信息
export const updateUserProfile = (data) => {
  return put('/reader/user/profile', data)
}

// 获取用户统计信息
export const getUserStatistics = () => {
  return get('/reader/user/statistics')
}

// 修改密码
export const changePassword = (data) => {
  return post('/reader/user/change-password', data)
}

// 上传头像
export const uploadAvatar = (filePath) => {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: getApp().globalData.apiBaseUrl + '/reader/user/avatar',
      filePath: filePath,
      name: 'file',
      header: {
        'Authorization': getApp().globalData.token ? `Bearer ${getApp().globalData.token}` : ''
      },
      success: (res) => {
        if (res.statusCode === 200) {
          const data = JSON.parse(res.data)
          if (data.code === 200) {
            resolve(data)
          } else {
            wx.showToast({
              title: data.msg || '上传失败',
              icon: 'none'
            })
            reject(data)
          }
        } else {
          wx.showToast({
            title: '上传失败',
            icon: 'none'
          })
          reject({ code: res.statusCode, msg: '上传失败' })
        }
      },
      fail: (err) => {
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        })
        reject(err)
      }
    })
  })
}