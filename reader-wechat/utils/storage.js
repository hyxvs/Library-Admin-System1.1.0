// utils/storage.js

// 安全获取存储值
export const getStorage = (key, defaultValue = null) => {
  try {
    const value = wx.getStorageSync(key)
    return value !== '' ? value : defaultValue
  } catch (error) {
    console.warn('获取存储失败:', error)
    return defaultValue
  }
}

// 安全设置存储值
export const setStorage = (key, value) => {
  try {
    wx.setStorageSync(key, value)
    return true
  } catch (error) {
    console.warn('设置存储失败:', error)
    return false
  }
}

// 安全删除存储值
export const removeStorage = (key) => {
  try {
    wx.removeStorageSync(key)
    return true
  } catch (error) {
    console.warn('删除存储失败:', error)
    return false
  }
}

// 清空所有存储
export const clearStorage = () => {
  try {
    wx.clearStorageSync()
    return true
  } catch (error) {
    console.warn('清空存储失败:', error)
    return false
  }
}

// 批量获取存储值
export const getStorageSync = (keys) => {
  try {
    const result = {}
    keys.forEach(key => {
      result[key] = wx.getStorageSync(key)
    })
    return result
  } catch (error) {
    console.warn('批量获取存储失败:', error)
    return {}
  }
}

// 批量设置存储值
export const setStorageSync = (data) => {
  try {
    Object.keys(data).forEach(key => {
      wx.setStorageSync(key, data[key])
    })
    return true
  } catch (error) {
    console.warn('批量设置存储失败:', error)
    return false
  }
}