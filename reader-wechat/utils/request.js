// utils/request.js
const app = getApp()

const request = (options) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: app.globalData.apiBaseUrl + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': options.header && options.header['Content-Type'] ? options.header['Content-Type'] : 'application/json',
        'Authorization': app.globalData.token ? `Bearer ${app.globalData.token}` : ''
      },
      timeout: options.timeout || 10000,
      success: (res) => {
        if (res.statusCode === 200) {
          const data = res.data
          if (data.code === 200) {
            resolve(data)
          } else {
            wx.showToast({
              title: data.msg || '请求失败',
              icon: 'none',
              duration: 2000
            })
            if (data.code === 401) {
              // 登录过期
              app.logout()
            }
            reject(data)
          }
        } else {
          let errorMessage = '网络错误'
          switch (res.statusCode) {
            case 400:
              errorMessage = '请求参数错误'
              break
            case 401:
              errorMessage = '登录已过期，请重新登录'
              app.logout()
              break
            case 403:
              errorMessage = '没有权限访问'
              break
            case 404:
              errorMessage = '请求的资源不存在'
              break
            case 500:
              errorMessage = '服务器错误'
              break
            default:
              errorMessage = res.data && res.data.msg ? res.data.msg : '网络错误'
          }
          wx.showToast({
            title: errorMessage,
            icon: 'none',
            duration: 2000
          })
          reject({ code: res.statusCode, msg: errorMessage })
        }
      },
      fail: (err) => {
        wx.showToast({
          title: '网络连接失败',
          icon: 'none',
          duration: 2000
        })
        reject(err)
      }
    })
  })
}

// 导出常用方法
export const get = (url, data, options) => {
  return request({ ...options, url, method: 'GET', data })
}

export const post = (url, data, options) => {
  return request({ ...options, url, method: 'POST', data })
}

export const put = (url, data, options) => {
  return request({ ...options, url, method: 'PUT', data })
}

export const del = (url, data, options) => {
  return request({ ...options, url, method: 'DELETE', data })
}

export default request