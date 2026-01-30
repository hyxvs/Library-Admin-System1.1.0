// 导入请求工具
import request from '@/utils/request' // 导入封装的 axios 实例

/**
 * 获取预约列表
 * @param {object} params - 查询参数
 * @returns {Promise} - 返回预约列表
 */
export const getAppointments = (params) => {
  return request({
    url: '/appointment', // 预约列表 API 路径
    method: 'get', // 请求方法
    params // 查询参数
  })
}

/**
 * 创建预约
 * @param {object} data - 预约数据
 * @returns {Promise} - 返回创建结果
 */
export const createAppointment = (data) => {
  return request({
    url: '/appointment', // 创建预约 API 路径
    method: 'post', // 请求方法
    data // 请求数据
  })
}

/**
 * 更新预约
 * @param {string} id - 预约 ID
 * @param {object} data - 预约数据
 * @returns {Promise} - 返回更新结果
 */
export const updateAppointment = (id, data) => {
  return request({
    url: `/appointment/${id}`, // 更新预约 API 路径
    method: 'put', // 请求方法
    data // 请求数据
  })
}

/**
 * 删除预约
 * @param {string} id - 预约 ID
 * @returns {Promise} - 返回删除结果
 */
export const deleteAppointment = (id) => {
  return request({
    url: `/appointment/${id}`, // 删除预约 API 路径
    method: 'delete' // 请求方法
  })
}

/**
 * 发送预约提醒
 * @param {string} id - 预约 ID
 * @returns {Promise} - 返回发送结果
 */
export const sendReminder = (id) => {
  return request({
    url: `/appointment/reminder/${id}`, // 发送提醒 API 路径
    method: 'post' // 请求方法
  })
}