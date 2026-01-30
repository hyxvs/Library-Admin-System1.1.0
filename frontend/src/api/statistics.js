// 导入请求工具
import request from '@/utils/request' // 导入封装的 axios 实例

/**
 * 获取仪表盘数据
 * @param {object} params - 查询参数
 * @returns {Promise} - 返回仪表盘数据
 */
export const getDashboard = (params) => {
  return request({
    url: '/statistics/dashboard', // 仪表盘数据 API 路径
    method: 'get', // 请求方法
    params // 查询参数
  })
}

/**
 * 获取热门图书
 * @param {object} params - 查询参数
 * @returns {Promise} - 返回热门图书列表
 */
export const getHotBooks = (params) => {
  return request({
    url: '/statistics/hot-books', // 热门图书 API 路径
    method: 'get', // 请求方法
    params // 查询参数
  })
}

/**
 * 获取分类借阅统计
 * @returns {Promise} - 返回分类借阅统计数据
 */
export const getCategoryBorrow = () => {
  return request({
    url: '/statistics/category-borrow', // 分类借阅统计 API 路径
    method: 'get' // 请求方法
  })
}

/**
 * 获取读者借阅统计
 * @param {object} params - 查询参数
 * @returns {Promise} - 返回读者借阅统计数据
 */
export const getReaderBorrow = (params) => {
  return request({
    url: '/statistics/reader-borrow', // 读者借阅统计 API 路径
    method: 'get', // 请求方法
    params // 查询参数
  })
}

/**
 * 导出借阅记录
 * @param {object} params - 查询参数
 * @returns {Promise} - 返回导出的文件
 */
export const exportBorrowRecords = (params) => {
  return request({
    url: '/statistics/export/borrow-records', // 导出借阅记录 API 路径
    method: 'get', // 请求方法
    params, // 查询参数
    responseType: 'blob' // 响应类型为二进制数据
  })
}
