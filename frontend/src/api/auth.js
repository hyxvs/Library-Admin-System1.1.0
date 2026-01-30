// 导入请求工具
import request from '@/utils/request' // 导入封装的 axios 实例

/**
 * 用户登录
 * @param {object} data - 登录数据
 * @param {string} data.username - 用户名
 * @param {string} data.password - 密码
 * @returns {Promise} - 返回登录结果
 */
export const login = (data) => {
  return request({
    url: '/auth/login', // 登录 API 路径
    method: 'post', // 请求方法
    data // 请求数据
  })
}

/**
 * 获取用户信息
 * @returns {Promise} - 返回用户信息
 */
export const getUserInfo = () => {
  return request({
    url: '/auth/info', // 获取用户信息 API 路径
    method: 'get' // 请求方法
  })
}
