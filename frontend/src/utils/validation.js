import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
// 
// 通用表单验证规则
// 包含必填、邮箱、手机号、身份证、ISBN、密码、数字、正整数、价格、年龄、长度、URL等验证规则
/**
 * 通用表单验证规则
 * 包含必填、邮箱、手机号、身份证、ISBN、密码、数字、正整数、价格、年龄、长度、URL等验证规则
 */
export const validationRules = {
  // 必填验证
  required: (message = '此项为必填项') => ({
    required: true,
    message,
    trigger: 'blur'
  }),

  // 邮箱验证
  email: (message = '请输入正确的邮箱地址') => ({
    type: 'email',
    message,
    trigger: 'blur'
  }),

  // 手机号验证（11位）
  phone: (message = '请输入11位手机号') => ({
    pattern: /^1[3-9]\d{9}$/,
    message,
    trigger: 'blur'
  }),

  // 身份证验证（18位）
  idCard: (message = '请输入18位身份证号') => ({
    pattern: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(0[1-9]|1\d|2\d|3[01])\d{3}[0-9Xx]$/,
    message,
    trigger: 'blur'
  }),

  // ISBN验证（13位）
  isbn: (message = '请输入13位ISBN') => ({
    pattern: /^\d{13}$/,
    message,
    trigger: 'blur'
  }),

  // 密码验证（6-20位）
  password: (message = '密码长度为6-20位') => ({
    min: 6,
    max: 20,
    message,
    trigger: 'blur'
  }),

  // 数字验证
  number: (message = '请输入数字') => ({
    type: 'number',
    message,
    trigger: 'blur',
    transform: (value) => Number(value)
  }),

  // 正整数验证
  positiveInteger: (message = '请输入正整数') => ({
    type: 'number',
    min: 1,
    message,
    trigger: 'blur',
    transform: (value) => Number(value)
  }),

  // 价格验证（保留两位小数）
  price: (message = '请输入正确的价格') => ({
    type: 'number',
    min: 0,
    precision: 2,
    message,
    trigger: 'blur'
  }),

  // 年龄验证（18-65岁）
  age: (message = '请输入18-65之间的年龄') => ({
    type: 'number',
    min: 18,
    max: 65,
    message,
    trigger: 'blur'
  }),

  // 长度验证
  minLength: (min, message) => ({
    min,
    message: `最少输入${min}个字符`,
    trigger: 'blur'
  }),

  maxLength: (max, message) => ({
    max,
    message: `最多输入${max}个字符`,
    trigger: 'blur'
  }),

  // URL验证
  url: (message = '请输入正确的URL') => ({
    type: 'url',
    message,
    trigger: 'blur'
  })
}

// 通用消息提示
export const showMessage = {
  success: (message, duration = 3000) => {
    ElMessage.success(message)
  },

  error: (message, duration = 3000) => {
    ElMessage.error(message)
  },

  warning: (message, duration = 3000) => {
    ElMessage.warning(message)
  },

  info: (message, duration = 3000) => {
    ElMessage.info(message)
  }
}

// 通用通知提示
export const showNotification = {
  success: (title, message, duration = 3000) => {
    ElNotification({
      title,
      message,
      type: 'success',
      duration,
      position: 'top-right'
    })
  },

  error: (title, message, duration = 3000) => {
    ElNotification({
      title,
      message,
      type: 'error',
      duration,
      position: 'top-right'
    })
  },

  warning: (title, message, duration = 3000) => {
    ElNotification({
      title,
      message,
      type: 'warning',
      duration,
      position: 'top-right'
    })
  },

  info: (title, message, duration = 3000) => {
    ElNotification({
      title,
      message,
      type: 'info',
      duration,
      position: 'top-right'
    })
  }
}

// 为了兼容性，添加showNotify导出
export const showNotify = showNotification

// 通用确认对话框
export const showConfirm = {
  // 确认删除
  delete: (message = '确定要删除吗？删除后不可恢复', callback) => {
    ElMessageBox.confirm(message, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      callback && callback()
    }).catch(() => {})
  },

  // 确认操作
  confirm: (message = '确定要执行此操作吗？', callback) => {
    ElMessageBox.confirm(message, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info'
    }).then(() => {
      callback && callback()
    }).catch(() => {})
  },

  // 确认保存
  save: (message = '确定要保存吗？', callback) => {
    ElMessageBox.confirm(message, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'success'
    }).then(() => {
      callback && callback()
    }).catch(() => {})
  },

  // 确认退出
  logout: (callback) => {
    ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      callback && callback()
    }).catch(() => {})
  }
}

// 异常处理
export const handleError = (error, defaultMessage = '操作失败，请稍后再试') => {
  console.error('操作失败:', error)
  
  let message = defaultMessage
  
  if (error.response) {
    if (error.response.data && error.response.data.msg) {
      message = error.response.data.msg
    } else if (error.response.data && error.response.data.message) {
      message = error.response.data.message
    }
  } else if (error.message) {
    message = error.message
  }
  
  showMessage.error(message)
  
  // 显示刷新按钮
  ElMessageBox.alert(message, '错误', {
    confirmButtonText: '刷新页面',
    type: 'error'
  }).then(() => {
    window.location.reload()
  }).catch(() => {})
}

// 加载状态管理
export const loadingState = {
  start: (loadingRef) => {
    loadingRef.value = true
  },
  end: (loadingRef) => {
    loadingRef.value = false
  },
  toggle: (loadingRef) => {
    loadingRef.value = !loadingRef.value
  }
}

// 表单重置
export const resetForm = (formRef, defaultData = {}) => {
  if (formRef.value) {
    formRef.value.resetFields()
    Object.keys(defaultData).forEach(key => {
      formRef.value[key] = defaultData[key]
    })
  }
}

// 表单验证
export const validateForm = async (formRef) => {
  try {
    await formRef.value.validate()
    return true
  } catch (error) {
    return false
  }
}

// 密码强度检测
export const checkPasswordStrength = (password) => {
  let strength = 0
  
  if (password.length >= 6) strength += 1
  if (password.length >= 10) strength += 1
  if (password.length >= 14) strength += 1
  
  if (/[a-z]/.test(password)) strength += 1
  if (/[A-Z]/.test(password)) strength += 1
  if (/[0-9]/.test(password)) strength += 1
  if (/[^a-zA-Z0-9]/.test(password)) strength += 1
  
  if (strength <= 2) return { level: 'weak', text: '弱', color: '#f56c6c' }
  if (strength <= 4) return { level: 'medium', text: '中', color: '#e6a23c' }
  return { level: 'strong', text: '强', color: '#67c23a' }
}

// 文件上传验证
export const validateFile = (file, rules = {}) => {
  const maxSize = rules.maxSize || 10 * 1024 * 1024 // 默认10MB
  const allowedTypes = rules.allowedTypes || ['image/jpeg', 'image/png', 'image/jpg']
  
  if (!file) {
    showMessage.error('请选择文件')
    return false
  }
  
  if (file.size > maxSize) {
    showMessage.error(`文件大小不能超过${maxSize / 1024 / 1024}MB`)
    return false
  }
  
  const fileType = file.type
  if (!allowedTypes.includes(fileType)) {
    showMessage.error('不支持的文件类型')
    return false
  }
  
  return true
}

// 日期格式化
export const formatDate = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
  if (!date) return ''
  
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

// 日期范围验证
export const validateDateRange = (startDate, endDate, maxDays = 365) => {
  if (!startDate || !endDate) return true
  
  const start = new Date(startDate)
  const end = new Date(endDate)
  
  if (start > end) {
    showMessage.error('开始日期不能大于结束日期')
    return false
  }
  
  const diffTime = Math.abs(end - start)
  const diffDays = diffTime / (1000 * 60 * 60 * 24)
  
  if (diffDays > maxDays) {
    showMessage.error(`日期范围不能超过${maxDays}天`)
    return false
  }
  
  return true
}

// 数据脱敏
export const maskData = (data, type = 'phone') => {
  if (!data) return ''
  
  switch (type) {
    case 'phone':
      return data.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2****')
    case 'idCard':
      return data.replace(/(.{6})(.*)/, '$1********')
    case 'email':
      const [name, domain] = data.split('@')
      return `${name[0]}***@${domain}`
    default:
      return data
  }
}

// 导出文件名生成
export const generateExportFileName = (prefix = 'export') => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  
  return `${prefix}_${year}${month}${day}_${hours}${minutes}${seconds}.xlsx`
}

// 数字格式化
export const formatNumber = (num, decimals = 2) => {
  if (num === null || num === undefined) return '0'
  return Number(num).toFixed(decimals)
}

// 金额格式化
export const formatMoney = (amount, symbol = '¥') => {
  if (amount === null || amount === undefined) return `${symbol}0.00`
  return `${symbol}${Number(amount).toFixed(2)}`
}

// 百分比格式化
export const formatPercent = (value, decimals = 2) => {
  if (value === null || value === undefined) return '0.00%'
  return `${Number(value).toFixed(decimals)}%`
}

// 下载文件
export const downloadFile = (blob, filename) => {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

// 复制到剪贴板
export const copyToClipboard = async (text, message = '复制成功') => {
  try {
    await navigator.clipboard.writeText(text)
    showMessage.success(message)
  } catch (error) {
    showMessage.error('复制失败，请手动复制')
  }
}

// 防抖函数
export const debounce = (fn, delay = 300) => {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

// 节流函数
export const throttle = (fn, delay = 300) => {
  let timer = null
  return function (...args) {
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(this, args)
        timer = null
      }, delay)
    }
  }
}

// 深拷贝
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime())
  if (obj instanceof Array) return obj.map(item => deepClone(item))
  if (obj instanceof Object) {
    const clonedObj = {}
    Object.keys(obj).forEach(key => {
      clonedObj[key] = deepClone(obj[key])
    })
    return clonedObj
  }
  return obj
}

export default {
  validationRules,
  showMessage,
  showNotification,
  showConfirm,
  handleError,
  loadingState,
  resetForm,
  validateForm,
  checkPasswordStrength,
  validateFile,
  formatDate,
  validateDateRange,
  maskData,
  generateExportFileName,
  formatNumber,
  formatMoney,
  formatPercent,
  downloadFile,
  copyToClipboard,
  debounce,
  throttle,
  deepClone
}
