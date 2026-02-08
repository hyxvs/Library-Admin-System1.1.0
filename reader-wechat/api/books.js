// api/books.js
import { get } from '../utils/request'

// 搜索图书
export const searchBooks = (params) => {
  return get('/reader/books/search', params)
}

// 获取图书详情
export const getBookDetail = (id) => {
  return get(`/reader/books/detail/${id}`)
}

// 获取热门图书
export const getHotBooks = () => {
  return get('/reader/books/hot')
}

// 获取图书分类
export const getBookCategories = () => {
  return get('/reader/books/categories')
}