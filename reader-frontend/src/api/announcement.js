// 导入请求工具
import request from '@/utils/request' // 导入封装的 axios 实例

/**
 * 获取公告列表
 * @param {object} params - 查询参数
 * @returns {Promise} - 返回公告列表
 */
export const getAnnouncements = (params) => {
  return request({
    url: '/announcements', // 公告列表 API 路径
    method: 'get', // 请求方法
    params // 查询参数
  })
}

/**
 * 获取最新公告
 * @returns {Promise} - 返回最新公告
 */
export const getLatestAnnouncement = () => {
  return request({
    url: '/announcements/latest', // 最新公告 API 路径
    method: 'get' // 请求方法
  })
}

/**
 * 获取系统配置
 * @returns {Promise} - 返回系统配置
 */
export const getSystemConfig = () => {
  return request({
    url: '/system/config', // 系统配置 API 路径
    method: 'get' // 请求方法
  })
}
