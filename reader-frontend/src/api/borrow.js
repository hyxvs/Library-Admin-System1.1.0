// 导入请求工具
import request from '@/utils/request' // 导入封装的 axios 实例

/**
 * 获取借阅记录
 * @param {object} params - 查询参数
 * @returns {Promise} - 返回借阅记录列表
 */
export const getBorrowRecords = (params) => {
  return request({
    url: '/borrow/list', // 借阅记录 API 路径
    method: 'get', // 请求方法
    params // 查询参数
  })
}

/**
 * 续借图书
 * @param {string} id - 借阅记录 ID
 * @returns {Promise} - 返回续借结果
 */
export const renewBook = (id) => {
  return request({
    url: `/borrow/renew/${id}`, // 续借图书 API 路径
    method: 'post' // 请求方法
  })
}

/**
 * 获取借阅详情
 * @param {string} id - 借阅记录 ID
 * @returns {Promise} - 返回借阅详情
 */
export const getBorrowDetail = (id) => {
  return request({
    url: `/borrow/detail/${id}`, // 获取借阅详情 API 路径
    method: 'get' // 请求方法
  })
}

/**
 * 借阅图书
 * @param {string} book_id - 图书 ID
 * @returns {Promise} - 返回借阅结果
 */
export const borrowBook = (book_id) => {
  return request({
    url: '/borrow/create', // 借阅图书 API 路径
    method: 'post', // 请求方法
    data: { book_id } // 请求数据
  })
}
