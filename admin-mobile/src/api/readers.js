import request from '@/utils/request'

export function getReadersList(params) {
  return request({
    url: '/readers',
    method: 'get',
    params
  })
}

export function getReaderDetail(id) {
  return request({
    url: `/readers/${id}`,
    method: 'get'
  })
}

export function createReader(data) {
  return request({
    url: '/readers',
    method: 'post',
    data
  })
}

export function updateReader(id, data) {
  return request({
    url: `/readers/${id}`,
    method: 'put',
    data
  })
}

export function deleteReader(id) {
  return request({
    url: `/readers/${id}`,
    method: 'delete'
  })
}
