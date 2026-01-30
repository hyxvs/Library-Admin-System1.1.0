// 导入请求工具
import request from '@/utils/request' // 导入封装的 axios 实例

/**
 * 获取图书列表
 * @param {object} params - 查询参数
 * @returns {Promise} - 返回图书列表
 */
export const getBooks = (params) => {
  return request({
    url: '/books', // 图书列表 API 路径
    method: 'get', // 请求方法
    params // 查询参数
  })
}

/**
 * 根据 ID 获取图书详情
 * @param {string} id - 图书 ID
 * @returns {Promise} - 返回图书详情
 */
export const getBookById = (id) => {
  return request({
    url: `/books/${id}`, // 图书详情 API 路径
    method: 'get' // 请求方法
  })
}

/**
 * 创建图书
 * @param {object} data - 图书数据
 * @returns {Promise} - 返回创建结果
 */
export const createBook = (data) => {
  return request({
    url: '/books', // 创建图书 API 路径
    method: 'post', // 请求方法
    data // 请求数据
  })
}

/**
 * 更新图书
 * @param {string} id - 图书 ID
 * @param {object} data - 图书数据
 * @returns {Promise} - 返回更新结果
 */
export const updateBook = (id, data) => {
  return request({
    url: `/books/${id}`, // 更新图书 API 路径
    method: 'put', // 请求方法
    data // 请求数据
  })
}

/**
 * 删除图书
 * @param {string} id - 图书 ID
 * @returns {Promise} - 返回删除结果
 */
export const deleteBook = (id) => {
  return request({
    url: `/books/${id}`, // 删除图书 API 路径
    method: 'delete' // 请求方法
  })
}

/**
 * 获取图书分类列表
 * @returns {Promise} - 返回分类列表
 */
export const getCategories = () => {
  return request({
    url: '/books/categories/list', // 分类列表 API 路径
    method: 'get' // 请求方法
  })
}

/**
 * 根据 ISBN 获取图书信息
 * @param {string} isbn - 图书 ISBN
 * @returns {Promise} - 返回图书信息
 */
export const getBookByIsbn = (isbn) => {
  return request({
    url: '/books/isbn', // ISBN 查询 API 路径
    method: 'get', // 请求方法
    params: { isbn } // 查询参数
  })
}

/**
 * 获取图书借阅记录
 * @param {string} bookId - 图书 ID
 * @param {object} params - 查询参数
 * @returns {Promise} - 返回借阅记录
 */
export const getBookBorrowRecords = (bookId, params) => {
  return request({
    url: `/borrow`, // 借阅记录 API 路径
    method: 'get', // 请求方法
    params: {
      book_title: '',
      ...params,
      book_id: bookId
    } // 查询参数
  })
}
