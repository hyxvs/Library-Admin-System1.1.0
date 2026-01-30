// 导入请求工具
import request from '@/utils/request' // 导入封装的 axios 实例

/**
 * 更新用户信息
 * @param {object} data - 用户信息数据
 * @returns {Promise} - 返回更新结果
 */
export const updateUserInfo = (data) => {
  return request({
    url: '/user/profile', // 更新用户信息 API 路径
    method: 'put', // 请求方法
    data // 请求数据
  })
}

/**
 * 修改密码
 * @param {object} data - 修改密码数据
 * @returns {Promise} - 返回修改结果
 */
export const changePassword = (data) => {
  return request({
    url: '/user/change-password', // 修改密码 API 路径
    method: 'post', // 请求方法
    data // 请求数据
  })
}

/**
 * 获取用户统计信息
 * @returns {Promise} - 返回用户统计信息
 */
export const getUserStatistics = () => {
  return request({
    url: '/user/statistics', // 获取用户统计信息 API 路径
    method: 'get' // 请求方法
  })
}

/**
 * 获取消息列表
 * @param {object} params - 查询参数
 * @returns {Promise} - 返回消息列表
 */
export const getMessages = (params) => {
  return request({
    url: '/user/messages', // 获取消息列表 API 路径
    method: 'get', // 请求方法
    params // 查询参数
  })
}

/**
 * 标记消息为已读
 * @param {string} id - 消息 ID
 * @returns {Promise} - 返回标记结果
 */
export const markMessageAsRead = (id) => {
  return request({
    url: `/user/messages/${id}/read`, // 标记消息为已读 API 路径
    method: 'post' // 请求方法
  })
}

/**
 * 标记所有消息为已读
 * @returns {Promise} - 返回标记结果
 */
export const markAllMessagesAsRead = () => {
  return request({
    url: '/user/messages/read-all', // 标记所有消息为已读 API 路径
    method: 'post' // 请求方法
  })
}
