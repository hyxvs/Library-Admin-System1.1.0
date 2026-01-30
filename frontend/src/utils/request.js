/**
 * API 请求封装
 * 基于 axios 库封装的请求工具
 */

/**
 * 导入必要的模块
 */
import axios from 'axios' // 导入 axios 库
import { ElMessage } from 'element-plus' // 导入 ElementPlus 消息提示
import router from '@/router' // 导入路由实例

/**
 * 创建 axios 实例
 * 配置基础路径和超时时间
 */
const request = axios.create({
  baseURL: '/api', // API 基础路径
  timeout: 10000 // 请求超时时间，单位毫秒
})

/**
 * 请求拦截器
 * 在发送请求前处理配置，如添加 token
 */
request.interceptors.request.use(
  (config) => {
    // 从本地存储获取 token
    const token = localStorage.getItem('token')
    console.log('请求配置:', config)
    console.log('Token:', token)
    // 如果有 token，添加到请求头
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    // 返回配置
    return config
  },
  (error) => {
    // 记录错误日志
    console.error('请求错误:', error)
    // 拒绝承诺
    return Promise.reject(error)
  }
)

/**
 * 响应拦截器
 * 处理响应数据和错误
 */
request.interceptors.response.use(
  (response) => {
    // 直接返回响应数据
    return response.data
  },
  (error) => {
    // 处理错误响应
    if (error.response) {
      const { status, data } = error.response

      // 根据状态码处理错误
      switch (status) {
        case 401:
          // 登录已过期，跳转到登录页面
          console.error('登录已过期，请重新登录')
          ElMessage.error('登录已过期，请重新登录')
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          router.push('/login')
          break
        case 403:
          // 没有权限访问
          console.error('没有权限访问')
          ElMessage.error('没有权限访问')
          break
        case 404:
          // 请求的资源不存在
          console.error('请求的资源不存在')
          ElMessage.error('请求的资源不存在')
          break
        case 500:
          // 服务器错误
          console.error('服务器错误:', data.msg)
          ElMessage.error(data.msg || '服务器错误')
          break
        default:
          // 其他错误
          console.error('请求失败:', data.msg)
          ElMessage.error(data.msg || '请求失败')
      }
    } else {
      // 网络错误
      console.error('网络错误，请检查网络连接')
      ElMessage.error('网络错误，请检查网络连接')
    }

    // 拒绝承诺
    return Promise.reject(error)
  }
)

/**
 * 导出请求实例
 * 供其他模块使用
 */
export default request
