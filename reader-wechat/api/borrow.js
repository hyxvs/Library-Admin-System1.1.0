// api/borrow.js
import { get, post } from '../utils/request'

// 获取借阅列表
export const getBorrowList = (params) => {
  return get('/reader/borrow/list', params)
}

// 获取借阅详情
export const getBorrowDetail = (id) => {
  return get(`/reader/borrow/detail/${id}`)
}

// 续借图书
export const renewBook = (id) => {
  return post(`/reader/borrow/renew/${id}`)
}

// 直接借阅图书
export const borrowBook = (data) => {
  return post('/reader/borrow/create', data)
}