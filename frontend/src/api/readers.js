// 导入请求工具
import request from '@/utils/request' // 导入封装的 axios 实例

/**
 * 获取读者列表
 * @param {object} params - 查询参数
 * @returns {Promise} - 返回读者列表
 */
export const getReaders = (params) => {
  return request({
    url: '/readers', // 读者列表 API 路径
    method: 'get', // 请求方法
    params // 查询参数
  })
}

/**
 * 根据 ID 获取读者详情
 * @param {string} id - 读者 ID
 * @returns {Promise} - 返回读者详情
 */
export const getReaderById = (id) => {
  return request({
    url: `/readers/${id}`, // 读者详情 API 路径
    method: 'get' // 请求方法
  })
}

/**
 * 创建读者
 * @param {object} data - 读者数据
 * @returns {Promise} - 返回创建结果
 */
export const createReader = (data) => {
  return request({
    url: '/readers', // 创建读者 API 路径
    method: 'post', // 请求方法
    data // 请求数据
  })
}

/**
 * 更新读者
 * @param {string} id - 读者 ID
 * @param {object} data - 读者数据
 * @returns {Promise} - 返回更新结果
 */
export const updateReader = (id, data) => {
  return request({
    url: `/readers/${id}`, // 更新读者 API 路径
    method: 'put', // 请求方法
    data // 请求数据
  })
}

/**
 * 删除读者
 * @param {string} id - 读者 ID
 * @returns {Promise} - 返回删除结果
 */
export const deleteReader = (id) => {
  return request({
    url: `/readers/${id}`, // 删除读者 API 路径
    method: 'delete' // 请求方法
  })
}

/**
 * 更新读者信用分
 * @param {string} id - 读者 ID
 * @param {object} data - 信用分数据
 * @returns {Promise} - 返回更新结果
 */
export const updateReaderCredit = (id, data) => {
  return request({
    url: `/readers/${id}/credit`, // 更新信用分 API 路径
    method: 'put', // 请求方法
    data // 请求数据
  })
}
