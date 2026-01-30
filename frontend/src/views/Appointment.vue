<template>
  <div class="appointment-page">
    <el-card class="search-card">
      <template #header>
        <div class="card-header">
          <span>预约管理</span>
        </div>
      </template>
      <div class="search-form">
        <el-form :inline="true" :model="searchForm" class="form-inline">
          <el-form-item label="图书名称">
            <el-input
              v-model="searchForm.bookName"
              placeholder="请输入图书名称"
              clearable
              class="search-input"
            />
          </el-form-item>
          <el-form-item label="ISBN">
            <el-input
              v-model="searchForm.isbn"
              placeholder="请输入ISBN"
              clearable
              class="search-input"
            />
          </el-form-item>
          <el-form-item label="读者ID">
            <el-input
              v-model="searchForm.readerId"
              placeholder="请输入读者ID"
              clearable
              class="search-input"
            />
          </el-form-item>
          <el-form-item label="预约状态">
            <el-select
              v-model="searchForm.status"
              placeholder="请选择预约状态"
              clearable
              class="search-select"
            >
              <el-option label="未提醒" value="unreminded" />
              <el-option label="已提醒" value="reminded" />
              <el-option label="已过期" value="expired" />
            </el-select>
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
          <span>预约列表</span>
        </div>
      </template>
      <el-table
        v-loading="loading"
        :data="appointmentList"
        style="width: 100%"
        border
        stripe
      >
        <el-table-column prop="id" label="预约ID" width="100" />
        <el-table-column label="图书信息" min-width="200">
          <template #default="scope">
            <div>
              <div>{{ scope.row.bookName }}</div>
              <div class="text-gray text-sm">{{ scope.row.isbn }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="读者信息" min-width="200">
          <template #default="scope">
            <div>
              <div>{{ scope.row.readerName }}</div>
              <div class="text-gray text-sm">ID: {{ scope.row.readerId }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="appointmentTime" label="预约时间" width="180" />
        <el-table-column prop="status" label="预约状态" width="120">
          <template #default="scope">
            <el-tag
              :type="getStatusType(scope.row.status)"
              effect="dark"
            >
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="expireTime" label="到期时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click="sendReminder(scope.row)"
              :disabled="scope.row.status === 'reminded'"
            >
              <el-icon><ChatDotRound /></el-icon>
              发送提醒
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="cancelAppointment(scope.row)"
            >
              <el-icon><Delete /></el-icon>
              取消预约
            </el-button>
          </template>
        </el-table-column>
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

    <!-- 发送提醒弹窗 -->
    <el-dialog
      v-model="reminderDialogVisible"
      title="发送到馆提醒"
      width="500px"
      draggable
    >
      <el-form :model="reminderForm">
        <el-form-item label="读者姓名">
          <el-input v-model="reminderForm.readerName" disabled />
        </el-form-item>
        <el-form-item label="图书名称">
          <el-input v-model="reminderForm.bookName" disabled />
        </el-form-item>
        <el-form-item label="提醒内容">
          <el-input
            v-model="reminderForm.content"
            type="textarea"
            rows="4"
            placeholder="请输入提醒内容"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="reminderDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmSendReminder" :loading="sendingReminder">
            {{ sendingReminder ? '发送中...' : '发送' }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElNotification, ElMessageBox } from 'element-plus'
import {
  Search,
  Refresh,
  Download,
  ChatDotRound,
  Delete
} from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

// 搜索表单
const searchForm = reactive({
  bookName: '',
  isbn: '',
  readerId: '',
  status: ''
})

// 预约列表
const appointmentList = ref([])

// 分页
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
})

// 加载状态
const loading = ref(false)

// 发送提醒弹窗
const reminderDialogVisible = ref(false)
const sendingReminder = ref(false)
const reminderForm = reactive({
  readerName: '',
  bookName: '',
  content: ''
})

// 方法
const fetchAppointments = async () => {
  console.log('开始获取预约列表')
  loading.value = true
  try {
    const params = new URLSearchParams()
    params.append('page', pagination.current)
    params.append('pageSize', pagination.pageSize)
    if (searchForm.bookName) {
      params.append('book_title', searchForm.bookName)
    }
    if (searchForm.readerId) {
      params.append('reader_name', searchForm.readerId)
    }
    if (searchForm.status) {
      params.append('status', searchForm.status)
    }
    
    console.log('请求参数:', params.toString())
    const response = await fetch(`/api/appointment?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${userStore.token}`
      }
    })
    
    console.log('响应状态:', response.status)
    const data = await response.json()
    console.log('响应数据:', data)
    if (data.code === 200) {
      console.log('获取预约列表成功，共', data.data.list.length, '条记录')
      appointmentList.value = data.data.list.map(item => ({
        id: item.id,
        bookName: item.book_title,
        isbn: item.isbn,
        readerId: item.reader_no,
        readerName: item.reader_name,
        appointmentTime: item.appointment_date,
        status: item.status,
        expireTime: item.appointment_date
      }))
      console.log('转换后的预约列表:', appointmentList.value)
      pagination.total = data.data.total
    } else {
      ElMessage.error(data.msg || '获取预约记录失败')
    }
  } catch (error) {
    console.error('获取预约记录失败:', error)
    ElMessage.error('获取预约记录失败，请稍后再试')
  } finally {
    loading.value = false
    console.log('获取预约列表完成')
  }
}

const handleSearch = () => {
  pagination.current = 1
  fetchAppointments()
}


const handleSizeChange = (size) => {
  pagination.pageSize = size
  fetchAppointments()
}

const handleCurrentChange = (current) => {
  pagination.current = current
  fetchAppointments()
}

const getStatusType = (status) => {
  switch (status) {
    case 'pending':
      return 'warning'
    case 'completed':
      return 'success'
    case 'cancelled':
      return 'danger'
    default:
      return ''
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'pending':
      return '未提醒'
    case 'completed':
      return '已完成'
    case 'cancelled':
      return '已取消'
    default:
      return status
  }
}

const sendReminder = (row) => {
  reminderForm.readerName = row.readerName
  reminderForm.bookName = row.bookName
  reminderForm.content = `尊敬的${row.readerName}，您预约的图书《${row.bookName}》已到馆，请及时到图书馆领取。`
  reminderDialogVisible.value = true
}

const confirmSendReminder = async () => {
  sendingReminder.value = true
  try {
    // 模拟发送提醒
    await new Promise(resolve => setTimeout(resolve, 1000))
    reminderDialogVisible.value = false
    ElNotification({
      title: '成功',
      message: '提醒已发送',
      type: 'success',
      duration: 2000
    })
  } catch (error) {
    ElMessage.error('发送失败，请稍后再试')
  } finally {
    sendingReminder.value = false
  }
}

const cancelAppointment = async (row) => {
  ElMessageBox.confirm(`确定要取消${row.readerName}的预约吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      console.log('开始取消预约，ID:', row.id)
      const response = await fetch(`/api/appointment/${row.id}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userStore.token}`,
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      console.log('取消预约响应:', data)
      if (data.code === 200) {
        ElNotification({
          title: '成功',
          message: '预约已取消',
          type: 'success',
          duration: 2000
        })
        console.log('开始刷新预约列表')
        await fetchAppointments()
        console.log('预约列表刷新完成')
      } else {
        ElMessage.error(data.msg || '取消预约失败')
      }
    } catch (error) {
      console.error('取消预约失败:', error)
      ElMessage.error('取消预约失败，请稍后再试')
    }
  }).catch(() => {})
}

const exportExcel = () => {
  // 模拟导出
  ElMessage.success('导出成功，可前往下载')
}

// 生命周期
onMounted(() => {
  fetchAppointments()
})
</script>

<style scoped>
.appointment-page {
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

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.text-gray {
  color: #909399;
}

.text-sm {
  font-size: 12px;
}

/* 暗黑模式适配 */
html.dark .search-card,
html.dark .table-card {
  background-color: #2d2d2d;
  border-color: #404040;
}

html.dark .text-gray {
  color: #8391a5;
}
</style>