// 导入请求工具
import request from '@/utils/request' // 导入封装的 axios 实例

/**
 * 创建预约
 * @param {object} data - 预约数据
 * @returns {Promise} - 返回创建结果
 */
export const createReservation = (data) => {
  return request({
    url: '/reservation/create', // 创建预约 API 路径
    method: 'post', // 请求方法
    data // 请求数据
  })
}

/**
 * 取消预约
 * @param {string} id - 预约 ID
 * @returns {Promise} - 返回取消结果
 */
export const cancelReservation = (id) => {
  return request({
    url: `/reservation/cancel/${id}`, // 取消预约 API 路径
    method: 'post' // 请求方法
  })
}

/**
 * 获取预约列表
 * @param {object} params - 查询参数
 * @returns {Promise} - 返回预约列表
 */
export const getReservationList = (params) => {
  return request({
    url: '/reservation/list', // 预约列表 API 路径
    method: 'get', // 请求方法
    params // 查询参数
  })
}

/**
 * 获取预约详情
 * @param {string} id - 预约 ID
 * @returns {Promise} - 返回预约详情
 */
export const getReservationDetail = (id) => {
  return request({
    url: `/reservation/detail/${id}`, // 获取预约详情 API 路径
    method: 'get' // 请求方法
  })
}
