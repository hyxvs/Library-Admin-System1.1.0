<template>
  <div class="borrow-list-page">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>我的借阅记录</span>
        </div>
      </template>

      <!-- 筛选器 -->
      <div class="filter-section">
        <el-form :inline="true" :model="filterForm" class="filter-form">
          <el-form-item label="状态">
            <el-select v-model="filterForm.status" placeholder="选择状态" clearable>
              <el-option label="借阅中" value="borrowing" />
              <el-option label="已归还" value="returned" />
              <el-option label="逾期未还" value="overdue" />
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

      <!-- 借阅记录列表 -->
      <div class="borrow-list">
        <el-table :data="borrowRecords" style="width: 100%" v-loading="loading">
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
          <el-table-column prop="borrow_time" label="借阅时间" width="180">
            <template #default="scope">
              {{ formatDate(scope.row.borrow_time) }}
            </template>
          </el-table-column>
          <el-table-column prop="expire_time" label="到期时间" width="180">
            <template #default="scope">
              <span :class="{ 'overdue': scope.row.status === 'overdue' }">
                {{ formatDate(scope.row.expire_time) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="return_time" label="归还时间" width="180">
            <template #default="scope">
              {{ scope.row.return_time ? formatDate(scope.row.return_time) : '未归还' }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="120">
            <template #default="scope">
              <el-tag :type="getBorrowStatusType(scope.row.status)">
                {{ getBorrowStatusText(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="overdue_days" label="逾期天数" width="100">
            <template #default="scope">
              <span v-if="scope.row.overdue_days > 0" class="overdue-days">
                {{ scope.row.overdue_days }}
              </span>
              <span v-else>0</span>
            </template>
          </el-table-column>
          <el-table-column prop="overdue_fee" label="逾期费用" width="100">
            <template #default="scope">
              <span v-if="scope.row.overdue_fee > 0" class="overdue-fee">
                ¥{{ scope.row.overdue_fee.toFixed(2) }}
              </span>
              <span v-else>¥0.00</span>
            </template>
          </el-table-column>
          <el-table-column prop="renew_count" label="续借次数" width="100">
            <template #default="scope">
              {{ scope.row.renew_count || 0 }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120" fixed="right">
            <template #default="scope">
              <el-button 
                type="primary" 
                size="small" 
                :disabled="!canRenew(scope.row)"
                @click="handleRenew(scope.row.id)"
                :loading="renewLoading[scope.row.id]"
              >
                续借
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
import { getBorrowRecords, renewBook } from '@/api/borrow'

const borrowRecords = ref([])
const loading = ref(false)
const renewLoading = ref({})
const pagination = ref({
  page: 1,
  pageSize: 10,
  total: 0
})
const filterForm = ref({
  status: ''
})

const fetchBorrowRecords = async () => {
  try {
    loading.value = true
    const params = {
      page: pagination.value.page,
      pageSize: pagination.value.pageSize,
      status: filterForm.value.status
    }
    const res = await getBorrowRecords(params)
    if (res.code === 200) {
      borrowRecords.value = res.data.list
      pagination.value.total = res.data.total
    }
  } catch (error) {
    console.error('获取借阅记录失败:', error)
    ElMessage.error('获取借阅记录失败')
  } finally {
    loading.value = false
  }
}

const handleFilter = () => {
  pagination.value.page = 1
  fetchBorrowRecords()
}


const handleSizeChange = (size) => {
  pagination.value.pageSize = size
  fetchBorrowRecords()
}

const handleCurrentChange = (current) => {
  pagination.value.page = current
  fetchBorrowRecords()
}

const handleRenew = async (borrowId) => {
  try {
    renewLoading.value[borrowId] = true
    const res = await renewBook(borrowId)
    if (res.code === 200) {
      ElMessage.success('续借成功')
      fetchBorrowRecords()
    } else {
      ElMessage.error(res.msg || '续借失败')
    }
  } catch (error) {
    console.error('续借失败:', error)
    ElMessage.error('续借失败')
  } finally {
    renewLoading.value[borrowId] = false
  }
}

const getBorrowStatusType = (status) => {
  const typeMap = {
    borrowed: 'info',
    returned: 'success',
    overdue: 'danger'
  }
  return typeMap[status] || ''
}

const getBorrowStatusText = (status) => {
  const textMap = {
    borrowed: '借阅中',
    returned: '已归还',
    overdue: '逾期未还'
  }
  return textMap[status] || status
}

const canRenew = (record) => {
  // 只有借阅中的记录可以续借，且续借次数小于1
  const result = record.status === 'borrowed' && (record.renew_count || 0) < 1
  console.log('canRenew:', { status: record.status, renew_count: record.renew_count, result })
  return result
}

const formatDate = (date) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

onMounted(() => {
  fetchBorrowRecords()
})
</script>

<style scoped>
.borrow-list-page {
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

.borrow-list {
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

.overdue {
  color: #f56c6c;
  font-weight: bold;
}

.overdue-days,
.overdue-fee {
  color: #f56c6c;
  font-weight: bold;
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
