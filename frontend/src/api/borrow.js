// 导入请求工具
import request from '@/utils/request' // 导入封装的 axios 实例

/**
 * 获取借阅记录列表
 * @param {object} params - 查询参数
 * @returns {Promise} - 返回借阅记录列表
 */
export const getBorrowRecords = (params) => {
  return request({
    url: '/borrow', // 借阅记录列表 API 路径
    method: 'get', // 请求方法
    params // 查询参数
  })
}

/**
 * 借阅图书
 * @param {object} data - 借阅数据
 * @returns {Promise} - 返回借阅结果
 */
export const borrowBook = (data) => {
  return request({
    url: '/borrow/borrow', // 借阅图书 API 路径
    method: 'post', // 请求方法
    data // 请求数据
  })
}

/**
 * 归还图书
 * @param {object} data - 归还数据
 * @returns {Promise} - 返回归还结果
 */
export const returnBook = (data) => {
  return request({
    url: '/borrow/return', // 归还图书 API 路径
    method: 'post', // 请求方法
    data // 请求数据
  })
}

/**
 * 续借图书
 * @param {object} data - 续借数据
 * @returns {Promise} - 返回续借结果
 */
export const renewBook = (data) => {
  return request({
    url: '/borrow/renew', // 续借图书 API 路径
    method: 'post', // 请求方法
    data // 请求数据
  })
}

/**
 * 获取逾期记录列表
 * @returns {Promise} - 返回逾期记录列表
 */
export const getOverdueRecords = () => {
  return request({
    url: '/borrow/overdue/list', // 逾期记录列表 API 路径
    method: 'get' // 请求方法
  })
}
