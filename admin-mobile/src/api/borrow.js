import request from '@/utils/request'

export function getBorrowList(params) {
  return request({
    url: '/borrow',
    method: 'get',
    params
  })
}

export function borrowBook(data) {
  return request({
    url: '/borrow/borrow',
    method: 'post',
    data
  })
}

export function returnBook(data) {
  return request({
    url: '/borrow/return',
    method: 'post',
    data
  })
}

export function renewBook(data) {
  return request({
    url: '/borrow/renew',
    method: 'post',
    data
  })
}
