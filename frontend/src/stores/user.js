/**
 * 用户状态管理
 * 包含用户登录、登出、获取用户信息等功能
 */

/**
 * 导入必要的模块
 */
import { defineStore } from 'pinia' // 导入 defineStore 函数，用于定义状态管理
import { ref } from 'vue' // 导入 ref 函数，用于创建响应式数据
import { login as loginApi, getUserInfo } from '@/api/auth' // 导入认证相关的 API 函数

/**
 * 用户状态管理 Store
 * 使用 Pinia 的组合式 API 定义
 */
export const useUserStore = defineStore('user', () => {
  /**
   * 响应式状态
   */
  const token = ref(localStorage.getItem('token') || '') // 从本地存储获取 token
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null')) // 从本地存储获取用户信息

  /**
   * 设置 token
   * @param {string} newToken - 新的 token
   */
  const setToken = (newToken) => {
    token.value = newToken
    localStorage.setItem('token', newToken) // 存储到本地存储，实现持久化
  }

  /**
   * 设置用户信息
   * @param {object} newUser - 新的用户信息
   */
  const setUser = (newUser) => {
    user.value = newUser
    localStorage.setItem('user', JSON.stringify(newUser)) // 存储到本地存储，实现持久化
  }

  /**
   * 用户登录
   * @param {object} credentials - 登录凭证，包含 username 和 password
   * @returns {Promise} - 返回登录结果
   */
  const login = async (credentials) => {
    try {
      // 调用登录 API
      const res = await loginApi(credentials)
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
   * 用户登出
   * 清除 token 和用户信息
   */
  const logout = () => {
    token.value = ''
    user.value = null
    localStorage.removeItem('token') // 从本地存储删除 token
    localStorage.removeItem('user') // 从本地存储删除用户信息
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
      console.error('获取用户信息失败:', error)
    }
  }

  /**
   * 导出状态和方法
   */
  return {
    token,
    user,
    setToken,
    setUser,
    login,
    logout,
    fetchUserInfo
  }
})
