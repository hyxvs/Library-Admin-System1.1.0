/**
 * 读者前端用户状态管理
 * 包含用户登录、注册、重置密码、登出、获取用户信息等功能
 */

/**
 * 导入必要的模块
 */
import { defineStore } from 'pinia' // 导入 defineStore 函数，用于定义状态管理
import { ref } from 'vue' // 导入 ref 函数，用于创建响应式数据
import { login, register, logout, resetPassword, getUserInfo } from '@/api/auth' // 导入认证相关的 API 函数

/**
 * 用户状态管理 Store
 * 使用 Pinia 的组合式 API 定义
 */
export const useUserStore = defineStore('user', () => {
  /**
   * 响应式状态
   */
  const token = ref(localStorage.getItem('reader_token') || '') // 从本地存储获取 token
  const user = ref(JSON.parse(localStorage.getItem('reader_user') || 'null')) // 从本地存储获取用户信息
  const isLoggedIn = ref(!!localStorage.getItem('reader_token')) // 登录状态

  /**
   * 设置 token
   * @param {string} newToken - 新的 token
   */
  const setToken = (newToken) => {
    token.value = newToken
    localStorage.setItem('reader_token', newToken) // 存储到本地存储，实现持久化
    isLoggedIn.value = true // 更新登录状态
  }

  /**
   * 设置用户信息
   * @param {object} newUser - 新的用户信息
   */
  const setUser = (newUser) => {
    user.value = newUser
    localStorage.setItem('reader_user', JSON.stringify(newUser)) // 存储到本地存储，实现持久化
  }

  /**
   * 用户登录
   * @param {object} credentials - 登录凭证，包含 username 和 password
   * @returns {Promise} - 返回登录结果
   */
  const loginUser = async (credentials) => {
    try {
      // 调用登录 API
      const res = await login(credentials)
      // 如果登录成功，存储 token 和用户信息
      if (res.code === 200) {
        setToken(res.data.token)
        setUser(res.data.user)
        return res
      }
      return res
    } catch (error) {
      throw error
    }
  }

  /**
   * 用户注册
   * @param {object} userData - 注册数据
   * @returns {Promise} - 返回注册结果
   */
  const registerUser = async (userData) => {
    try {
      // 调用注册 API
      const res = await register(userData)
      return res
    } catch (error) {
      throw error
    }
  }

  /**
   * 重置用户密码
   * @param {object} resetData - 重置密码数据
   * @returns {Promise} - 返回重置结果
   */
  const resetUserPassword = async (resetData) => {
    try {
      // 调用重置密码 API
      const res = await resetPassword(resetData)
      return res
    } catch (error) {
      throw error
    }
  }

  /**
   * 用户登出
   * 清除 token 和用户信息
   */
  const logoutUser = async () => {
    try {
      // 直接清除本地存储，不需要调用后端 API
      token.value = ''
      user.value = null
      isLoggedIn.value = false
      localStorage.removeItem('reader_token') // 从本地存储删除 token
      localStorage.removeItem('reader_user') // 从本地存储删除用户信息
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  /**
   * 获取用户信息
   * 从服务器获取最新的用户信息
   */
  const fetchUserInfo = async () => {
    try {
      // 调用获取用户信息 API
      const res = await getUserInfo()
      // 如果获取成功，更新用户信息
      if (res.code === 200) {
        setUser(res.data)
      }
    } catch (error) {
      console.error('Fetch user info error:', error)
    }
  }

  /**
   * 导出状态和方法
   */
  return {
    token,
    user,
    isLoggedIn,
    setToken,
    setUser,
    loginUser,
    registerUser,
    resetUserPassword,
    logoutUser,
    fetchUserInfo
  }
})
