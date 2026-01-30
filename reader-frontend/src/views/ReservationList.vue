<template>
  <div class="reservation-list-page">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>我的预约记录</span>
        </div>
      </template>

      <!-- 筛选器 -->
      <div class="filter-section">
        <el-form :inline="true" :model="filterForm" class="filter-form">
          <el-form-item label="状态">
            <el-select v-model="filterForm.status" placeholder="选择状态" clearable>
              <el-option label="预约中" value="pending" />
              <el-option label="已到馆" value="arrived" />
              <el-option label="已完成" value="completed" />
              <el-option label="已取消" value="cancelled" />
              <el-option label="已过期" value="expired" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleFilter">
              <el-icon><Filter /></el-icon>
              筛选
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 预约记录列表 -->
      <div class="reservation-list">
        <el-table :data="reservations" style="width: 100%" v-loading="loading">
          <el-table-column prop="book_title" label="图书名称" min-width="180">
            <template #default="scope">
              <div class="book-info">
                <div class="book-cover-small">
                  <img 
                    :src="`https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=book%20cover%2C%20${encodeURIComponent(scope.row.book_title)}%2C%20simple%20design%2C%203D%20rendering&image_size=square`" 
                    :alt="scope.row.book_title"
                  />
                </div>
                <span>{{ scope.row.book_title }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="isbn" label="ISBN" width="150" />
          <el-table-column prop="reserve_time" label="预约时间" width="180">
            <template #default="scope">
              {{ formatDate(scope.row.reserve_time) }}
            </template>
          </el-table-column>
          <el-table-column prop="expire_time" label="过期时间" width="180">
            <template #default="scope">
              {{ formatDate(scope.row.expire_time) }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="120">
            <template #default="scope">
              <el-tag :type="getReservationStatusType(scope.row.status)">
                {{ getReservationStatusText(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="remind_time" label="提醒时间" width="180">
            <template #default="scope">
              {{ scope.row.remind_time ? formatDate(scope.row.remind_time) : '未提醒' }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="scope">
              <el-button 
                type="danger" 
                size="small" 
                :disabled="!canCancelReservation(scope.row.status)"
                @click="handleCancelReservation(scope.row.id)"
                :loading="cancelLoading[scope.row.id]"
              >
                取消预约
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
      <div class="pagination-section">
        <el-pagination
          :current-page="pagination.page"
          :page-size="pagination.pageSize"
          :total="pagination.total"
          layout="total, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Filter } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import { getReservationList, cancelReservation } from '@/api/reservation'

const reservations = ref([])
const loading = ref(false)
const cancelLoading = ref({})
const pagination = ref({
  page: 1,
  pageSize: 10,
  total: 0
})
const filterForm = ref({
  status: ''
})

const fetchReservations = async () => {
  try {
    loading.value = true
    const params = {
      page: pagination.value.page,
      pageSize: pagination.value.pageSize,
      status: filterForm.value.status
    }
    const res = await getReservationList(params)
    if (res.code === 200) {
      reservations.value = res.data.list
      pagination.value.total = res.data.total
    }
  } catch (error) {
    console.error('获取预约记录失败:', error)
    ElMessage.error('获取预约记录失败')
  } finally {
    loading.value = false
  }
}

const handleFilter = () => {
  pagination.value.page = 1
  fetchReservations()
}


const handleSizeChange = (size) => {
  pagination.value.pageSize = size
  fetchReservations()
}

const handleCurrentChange = (current) => {
  pagination.value.page = current
  fetchReservations()
}

const handleCancelReservation = async (reservationId) => {
  try {
    cancelLoading.value[reservationId] = true
    const res = await cancelReservation(reservationId)
    if (res.code === 200) {
      ElMessage.success('取消预约成功')
      fetchReservations()
    } else {
      ElMessage.error(res.msg || '取消预约失败')
    }
  } catch (error) {
    console.error('取消预约失败:', error)
    ElMessage.error('取消预约失败')
  } finally {
    cancelLoading.value[reservationId] = false
  }
}

const getReservationStatusType = (status) => {
  const typeMap = {
    pending: 'warning',
    arrived: 'info',
    completed: 'success',
    cancelled: 'danger',
    expired: 'danger'
  }
  return typeMap[status] || ''
}

const getReservationStatusText = (status) => {
  const textMap = {
    pending: '预约中',
    arrived: '已到馆',
    completed: '已完成',
    cancelled: '已取消',
    expired: '已过期'
  }
  return textMap[status] || status
}

const canCancelReservation = (status) => {
  // 只有预约中的记录可以取消
  return status === 'pending'
}

const formatDate = (date) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

onMounted(() => {
  fetchReservations()
})
</script>

<style scoped>
.reservation-list-page {
  padding: 20px 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-section {
  margin-bottom: 20px;
}

.filter-form {
  display: flex;
  align-items: center;
}

.reservation-list {
  margin-bottom: 20px;
}

.book-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.book-cover-small {
  width: 40px;
  height: 50px;
  overflow: hidden;
  border-radius: 4px;
}

.book-cover-small img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.pagination-section {
  display: flex;
  justify-content: flex-end;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .filter-form {
    flex-direction: column;
    align-items: flex-start;
  }

  .el-table {
    font-size: 14px;
  }

  .el-table__column {
    padding: 0 5px;
  }

  .book-cover-small {
    width: 30px;
    height: 40px;
  }
}
</style>
