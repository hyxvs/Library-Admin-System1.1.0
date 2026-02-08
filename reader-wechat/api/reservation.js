// api/reservation.js
import { get, post } from '../utils/request'

// 创建预约
export const createReservation = (data) => {
  return post('/reader/reservation/create', data)
}

// 取消预约
export const cancelReservation = (id) => {
  return post(`/reader/reservation/cancel/${id}`)
}

// 获取预约列表
export const getReservationList = (params) => {
  return get('/reader/reservation/list', params)
}

// 获取预约详情
export const getReservationDetail = (id) => {
  return get(`/reader/reservation/detail/${id}`)
}