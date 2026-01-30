// 导入必要的模块
import axios from 'axios' // 导入 axios 库
import { ElMessage } from 'element-plus' // 导入 ElementPlus 消息提示
import { useUserStore } from '@/stores/user' // 导入用户状态管理
import router from '@/router' // 导入路由实例

// 创建 axios 实例
const request = axios.create({
  baseURL: '/api/reader', // API 基础路径
  timeout: 10000 // 请求超时时间，单位毫秒
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 直接从localStorage中获取token
    const token = localStorage.getItem('reader_token')
    // 如果有 token，添加到请求头
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    // 返回配置
    return config
  },
  (error) => {
    // 记录错误日志
    console.error('Request error:', error)
    // 拒绝承诺
    return Promise.reject(error)
  }
)

// 响应拦截器
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
          ElMessage.error('登录已过期，请重新登录')
          // 直接从localStorage中清除token和用户信息
          localStorage.removeItem('reader_token')
          localStorage.removeItem('reader_user')
          router.push('/login')
          break
        case 403:
          // 没有权限访问
          ElMessage.error('没有权限访问')
          break
        case 404:
          // 请求的资源不存在
          ElMessage.error('请求的资源不存在')
          break
        case 500:
          // 服务器错误
          ElMessage.error(data.msg || '服务器错误')
          break
        default:
          // 其他错误
          ElMessage.error(data.msg || '请求失败')
      }
    } else {
      // 网络错误
      ElMessage.error('网络错误，请检查网络连接')
    }

    // 拒绝承诺
    return Promise.reject(error)
  }
)

// 导出请求实例
export default request
