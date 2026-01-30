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
    url: '/login', // 登录 API 路径
    method: 'post', // 请求方法
    data // 请求数据
  })
}

/**
 * 用户注册
 * @param {object} data - 注册数据
 * @returns {Promise} - 返回注册结果
 */
export const register = (data) => {
  return request({
    url: '/register', // 注册 API 路径
    method: 'post', // 请求方法
    data // 请求数据
  })
}

/**
 * 用户登出
 * @returns {Promise} - 返回登出结果
 */
export const logout = () => {
  return request({
    url: '/logout', // 登出 API 路径
    method: 'post' // 请求方法
  })
}

/**
 * 重置密码
 * @param {object} data - 重置密码数据
 * @returns {Promise} - 返回重置结果
 */
export const resetPassword = (data) => {
  return request({
    url: '/reset-password', // 重置密码 API 路径
    method: 'post', // 请求方法
    data // 请求数据
  })
}

/**
 * 发送短信验证码
 * @param {object} data - 发送验证码数据
 * @returns {Promise} - 返回发送结果
 */
export const sendSmsCode = (data) => {
  return request({
    url: '/send-sms-code', // 发送短信验证码 API 路径
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
    url: '/user/info', // 获取用户信息 API 路径
    method: 'get' // 请求方法
  })
}
