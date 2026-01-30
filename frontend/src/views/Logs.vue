<template>
  <div class="logs-page">
    <el-card class="search-card">
      <template #header>
        <div class="card-header">
          <span>日志审计</span>
        </div>
      </template>
      <div class="search-form">
        <el-form :inline="true" :model="searchForm" class="form-inline">
          <el-form-item label="操作人">
            <el-input
              v-model="searchForm.operator"
              placeholder="请输入操作人"
              clearable
              class="search-input"
            />
          </el-form-item>
          <el-form-item label="操作类型">
            <el-select
              v-model="searchForm.operationType"
              placeholder="请选择操作类型"
              clearable
              class="search-select"
            >
              <el-option label="新增" value="add" />
              <el-option label="编辑" value="edit" />
              <el-option label="删除" value="delete" />
              <el-option label="借阅" value="borrow" />
              <el-option label="归还" value="return" />
              <el-option label="预约" value="appointment" />
            </el-select>
          </el-form-item>
          <el-form-item label="操作时间">
            <el-date-picker
              v-model="searchForm.operationTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD"
              class="search-date"
            />
          </el-form-item>
          <el-form-item label="IP地址">
            <el-input
              v-model="searchForm.ipAddress"
              placeholder="请输入IP地址"
              clearable
              class="search-input"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">
              <el-icon><Search /></el-icon>
              搜索
            </el-button>
            <el-button type="success" @click="exportExcel">
              <el-icon><Download /></el-icon>
              导出Excel
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <el-card class="table-card" style="margin-top: 20px;">
      <template #header>
        <div class="card-header">
          <span>操作日志</span>
        </div>
      </template>
      <el-table
        v-loading="loading"
        :data="logsList"
        style="width: 100%"
        border
        stripe
      >
        <el-table-column prop="id" label="日志ID" width="100" />
        <el-table-column prop="operator" label="操作人" width="120" />
        <el-table-column prop="operationType" label="操作类型" width="120">
          <template #default="scope">
            <el-tag :type="getOperationTypeColor(scope.row.operationType)">
              {{ getOperationTypeText(scope.row.operationType) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="操作内容" min-width="300" />
        <el-table-column prop="operationTime" label="操作时间" width="180" />
        <el-table-column prop="ipAddress" label="IP地址" width="150" />
      </el-table>
      <div class="pagination-container">
        <el-pagination
          :current-page="pagination.current"
          :page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElNotification } from 'element-plus'
import {
  Search,
  Refresh,
  Download
} from '@element-plus/icons-vue'
import request from '@/utils/request'

// 搜索表单
const searchForm = reactive({
  operator: '',
  operationType: '',
  operationTime: [],
  ipAddress: ''
})

// 日志列表
const logsList = ref([])

// 分页
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
})

// 加载状态
const loading = ref(false)

// 获取日志数据
const getLogsList = async () => {
  try {
    loading.value = true
    
    const params = {
      operator: searchForm.operator,
      action: searchForm.operationType,
      startDate: searchForm.operationTime[0] || '',
      endDate: searchForm.operationTime[1] || '',
      ipAddress: searchForm.ipAddress,
      page: pagination.current,
      pageSize: pagination.pageSize
    }
    
    const res = await request({
      url: '/logs',
      method: 'get',
      params
    })
    
    if (res.code === 200) {
      logsList.value = res.data.list
      pagination.total = res.data.pagination.total
    } else {
      ElMessage.error(res.msg || '获取日志失败')
    }
  } catch (error) {
    ElMessage.error('获取日志失败')
  } finally {
    loading.value = false
  }
}

// 方法
const handleSearch = () => {
  pagination.current = 1
  getLogsList()
}


const handleSizeChange = (size) => {
  pagination.pageSize = size
  pagination.current = 1
  getLogsList()
}

const handleCurrentChange = (current) => {
  pagination.current = current
  getLogsList()
}

const getOperationTypeColor = (type) => {
  switch (type) {
    case 'add':
      return 'success'
    case 'edit':
      return 'warning'
    case 'delete':
      return 'danger'
    case 'borrow':
      return 'info'
    case 'return':
      return 'primary'
    case 'appointment':
      return 'success'
    default:
      return ''
  }
}

const getOperationTypeText = (type) => {
  switch (type) {
    case 'add':
      return '新增'
    case 'edit':
      return '编辑'
    case 'delete':
      return '删除'
    case 'borrow':
      return '借阅'
    case 'return':
      return '归还'
    case 'appointment':
      return '预约'
    default:
      return type
  }
}

const exportExcel = async () => {
  try {
    const params = {
      operator: searchForm.operator,
      action: searchForm.operationType,
      startDate: searchForm.operationTime[0] || '',
      endDate: searchForm.operationTime[1] || '',
      ipAddress: searchForm.ipAddress
    }
    
    // 构建查询字符串
    const queryString = Object.entries(params)
      .filter(([_, value]) => value)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&')
    
    // 构建完整的导出 URL
    const exportUrl = `/api/logs/export${queryString ? `?${queryString}` : ''}`
    
    // 创建一个临时的 <a> 标签来触发下载
    const link = document.createElement('a')
    link.href = exportUrl
    link.download = `操作日志_${new Date().toISOString().slice(0, 19).replace(/[-:]/g, '')}.xlsx`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    ElMessage.success('导出成功，文件正在下载中')
  } catch (error) {
    ElMessage.error('导出失败')
  }
}

// 生命周期
onMounted(() => {
  // 初始化数据
  getLogsList()
})
</script>

<style scoped>
.logs-page {
  padding: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-form {
  margin-top: 10px;
}

.form-inline {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.search-input {
  width: 200px;
}

.search-select {
  width: 160px;
}

.search-date {
  width: 240px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

/* 暗黑模式适配 */
html.dark .search-card,
html.dark .table-card {
  background-color: #2d2d2d;
  border-color: #404040;
}
</style>