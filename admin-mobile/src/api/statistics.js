import request from '@/utils/request'

export function getDashboardStats(params) {
  return request({
    url: '/statistics/dashboard',
    method: 'get',
    params
  })
}
