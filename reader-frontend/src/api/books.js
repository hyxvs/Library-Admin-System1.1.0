// 导入请求工具
import request from '@/utils/request' // 导入封装的 axios 实例

/**
 * 搜索图书
 * @param {object} params - 搜索参数
 * @returns {Promise} - 返回搜索结果
 */
export const searchBooks = (params) => {
  return request({
    url: '/books/search', // 搜索图书 API 路径
    method: 'get', // 请求方法
    params // 查询参数
  })
}

/**
 * 获取图书详情
 * @param {string} id - 图书 ID
 * @returns {Promise} - 返回图书详情
 */
export const getBookDetail = (id) => {
  return request({
    url: `/books/detail/${id}`, // 获取图书详情 API 路径
    method: 'get' // 请求方法
  })
}

/**
 * 获取图书分类
 * @returns {Promise} - 返回图书分类列表
 */
export const getBookCategories = () => {
  return request({
    url: '/books/categories', // 获取图书分类 API 路径
    method: 'get' // 请求方法
  })
}

/**
 * 获取热门图书
 * @param {number} limit - 限制数量，默认为 10
 * @returns {Promise} - 返回热门图书列表
 */
export const getHotBooks = (limit = 10) => {
  return request({
    url: '/books/hot', // 获取热门图书 API 路径
    method: 'get', // 请求方法
    params: { limit } // 查询参数
  })
}
