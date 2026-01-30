<template>
  <div class="borrow-page">
    <el-card class="main-card">
      <template #header>
        <div class="card-header">
          <span>借阅管理</span>
        </div>
      </template>

      <!-- 标签页 -->
      <el-tabs v-model="activeTab" class="borrow-tabs" @tab-click="handleTabChange">
        <!-- 借阅登记 -->
        <el-tab-pane label="借阅登记" name="borrow">
          <el-form
            ref="borrowFormRef"
            :model="borrowForm"
            :rules="borrowFormRules"
            label-width="100px"
            class="borrow-form"
          >
            <el-form-item label="读者ID" prop="readerId">
              <el-input
                v-model="borrowForm.readerId"
                placeholder="请输入读者ID"
                clearable
              />
            </el-form-item>

            <el-form-item label="图书ISBN" prop="bookIsbn">
              <el-input
                v-model="borrowForm.bookIsbn"
                placeholder="请输入图书ISBN"
                clearable
              />
            </el-form-item>

            <div class="form-buttons">
              <el-button type="primary" @click="handleBorrowSubmit" :loading="borrowLoading">
                {{ borrowLoading ? '借阅中...' : '确认借阅' }}
              </el-button>
            </div>
          </el-form>
        </el-tab-pane>

        <!-- 归还登记 -->
        <el-tab-pane label="归还登记" name="return">
          <el-form
            ref="returnFormRef"
            :model="returnForm"
            :rules="returnFormRules"
            label-width="100px"
            class="return-form"
          >
            <el-form-item label="借阅编号" prop="borrowNo">
              <el-input
                v-model="returnForm.borrowNo"
                placeholder="请输入借阅编号"
                clearable
              />
            </el-form-item>

            <div class="form-buttons">
              <el-button type="primary" @click="handleReturnSubmit" :loading="returnLoading">
                {{ returnLoading ? '归还中...' : '确认归还' }}
              </el-button>
            </div>
          </el-form>
        </el-tab-pane>

        <!-- 借阅记录查询 -->
        <el-tab-pane label="借阅记录查询" name="search">
          <el-form :inline="true" :model="searchForm" class="search-form">
            <el-form-item label="借阅编号">
              <el-input v-model="searchForm.borrowNo" placeholder="请输入借阅编号" clearable />
            </el-form-item>
            <el-form-item label="读者姓名">
              <el-input v-model="searchForm.readerName" placeholder="请输入读者姓名" clearable />
            </el-form-item>
            <el-form-item label="读者编号">
              <el-input v-model="searchForm.readerNo" placeholder="请输入读者编号" clearable />
            </el-form-item>
            <el-form-item label="图书名称">
              <el-input v-model="searchForm.bookTitle" placeholder="请输入图书名称" clearable />
            </el-form-item>
            <el-form-item label="ISBN">
              <el-input v-model="searchForm.bookId" placeholder="请输入图书ISBN" clearable />
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="searchForm.status" placeholder="选择状态" clearable>
                <el-option label="借阅中" value="borrowed" />
                <el-option label="已归还" value="returned" />
                <el-option label="已逾期" value="overdue" />
              </el-select>
            </el-form-item>
            <el-form-item label="借阅日期">
              <el-date-picker
                v-model="searchForm.dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                clearable
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSearch">搜索</el-button>
            </el-form-item>
          </el-form>

          <el-table
            :data="tableData"
            style="width: 100%"
            v-loading="loading"
            border
          >
            <el-table-column type="index" label="序号" width="60" />
            <el-table-column prop="borrow_no" label="借阅编号" width="180" />
            <el-table-column prop="reader_name" label="读者姓名" width="100" />
            <el-table-column prop="reader_no" label="读者编号" width="120" />
            <el-table-column prop="book_title" label="图书名称" min-width="200" />
            <el-table-column prop="isbn" label="ISBN" width="150" />
            <el-table-column label="借阅时间" width="180">
              <template #default="{ row }">
                {{ formatDate(row.borrow_date) }}
              </template>
            </el-table-column>
            <el-table-column label="应还时间" width="180">
              <template #default="{ row }">
                {{ formatDate(row.due_date) }}
              </template>
            </el-table-column>
            <el-table-column label="归还时间" width="180">
              <template #default="{ row }">
                {{ row.return_date ? formatDate(row.return_date) : '未归还' }}
              </template>
            </el-table-column>
            <el-table-column label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="getStatusType(row.status)">
                  {{ getStatusText(row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="renew_count" label="续借次数" width="80" />
            <el-table-column prop="overdue_days" label="逾期天数" width="80">
              <template #default="{ row }">
                <span v-if="row.overdue_days > 0" style="color: #f56c6c; font-weight: bold">
                  {{ row.overdue_days }}
                </span>
                <span v-else>0</span>
              </template>
            </el-table-column>
            <el-table-column prop="fine_amount" label="罚款金额" width="100">
              <template #default="{ row }">
                <span v-if="row.fine_amount > 0" style="color: #f56c6c; font-weight: bold">
                  ¥{{ row.fine_amount.toFixed(2) }}
                </span>
                <span v-else>¥0.00</span>
              </template>
            </el-table-column>
            <el-table-column prop="operator_name" label="操作员" width="100" />
          </el-table>

          <el-pagination
            :current-page="pagination.page"
            :page-size="pagination.pageSize"
            :total="pagination.total"
            layout="total, prev, pager, next"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            class="pagination-container"
          />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getBorrowRecords, borrowBook, returnBook } from '@/api/borrow'
import { getBookByIsbn } from '@/api/books'
import dayjs from 'dayjs'

// 标签页
const activeTab = ref('borrow')

// 加载状态
const loading = ref(false)
const borrowLoading = ref(false)
const returnLoading = ref(false)

// 表单引用
const borrowFormRef = ref(null)
const returnFormRef = ref(null)

// 数据
const tableData = ref([])

// 借阅表单
const borrowForm = reactive({
  readerId: '',
  bookIsbn: ''
})

// 归还表单
const returnForm = reactive({
  borrowNo: ''
})

// 搜索表单
const searchForm = reactive({
  borrowNo: '',
  readerName: '',
  readerNo: '',
  bookTitle: '',
  bookId: '',
  status: '',
  dateRange: []
})

// 表单规则
const borrowFormRules = {
  readerId: [
    { required: true, message: '请输入读者ID', trigger: 'blur' }
  ],
  bookIsbn: [
    { required: true, message: '请输入图书ISBN', trigger: 'blur' }
  ]
}

const returnFormRules = {
  borrowNo: [
    { required: true, message: '请输入借阅编号', trigger: 'blur' }
  ]
}

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 格式化日期
const formatDate = (date) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}

// 状态类型
const getStatusType = (status) => {
  const map = {
    borrowed: 'primary',
    returned: 'success',
    overdue: 'danger'
  }
  return map[status] || ''
}

// 状态文本
const getStatusText = (status) => {
  const map = {
    borrowed: '借阅中',
    returned: '已归还',
    overdue: '已逾期'
  }
  return map[status] || status
}

// 获取借阅记录
const fetchBorrowRecords = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      borrow_no: searchForm.borrowNo,
      reader_name: searchForm.readerName,
      book_title: searchForm.bookTitle,
      book_id: searchForm.bookId,
      status: searchForm.status
    }
    
    // 处理读者编号搜索
    if (searchForm.readerNo) {
      params.reader_no = searchForm.readerNo
    }
    
    // 处理日期范围
    if (searchForm.dateRange && searchForm.dateRange.length === 2) {
      params.start_date = searchForm.dateRange[0]
      params.end_date = searchForm.dateRange[1]
    }
    
    const res = await getBorrowRecords(params)
    if (res.code === 200) {
      tableData.value = res.data.list
      pagination.total = res.data.total
    }
  } catch (error) {
    console.error('获取借阅记录失败:', error)
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  fetchBorrowRecords()
}

// 重置

// 标签页切换
const handleTabChange = (tab) => {
  if (tab.props.name === 'search') {
    fetchBorrowRecords()
  }
}

// 借阅提交
const handleBorrowSubmit = async () => {
  try {
    await borrowFormRef.value.validate()
    borrowLoading.value = true

    // 首先根据 ISBN 获取图书信息，得到 book_id
    const bookRes = await getBookByIsbn(borrowForm.bookIsbn)
    if (bookRes.code === 200) {
      const bookId = bookRes.data.id
      
      const res = await borrowBook({
        reader_id: borrowForm.readerId,
        book_id: bookId
      })
      
      if (res.code === 200) {
        ElMessage.success('借阅成功')
      } else {
        ElMessage.error(res.msg || '借阅失败')
      }
    } else {
      ElMessage.error('图书不存在')
    }
  } catch (error) {
    if (error !== false) {
      ElMessage.error('借阅失败')
    }
  } finally {
    borrowLoading.value = false
  }
}

// 归还提交
const handleReturnSubmit = async () => {
  try {
    await returnFormRef.value.validate()
    returnLoading.value = true

    const res = await returnBook({ borrow_no: returnForm.borrowNo })
    
    if (res.code === 200) {
      ElMessage.success('归还成功')
    } else {
      ElMessage.error(res.msg || '归还失败')
    }
  } catch (error) {
    if (error !== false) {
      ElMessage.error('归还失败')
    }
  } finally {
    returnLoading.value = false
  }
}


// 分页处理
const handleSizeChange = (val) => {
  pagination.pageSize = val
  fetchBorrowRecords()
}

const handleCurrentChange = (val) => {
  pagination.page = val
  fetchBorrowRecords()
}

onMounted(() => {
  fetchBorrowRecords()
})
</script>

<style scoped>
.borrow-page {
  padding: 20px;
  min-height: calc(100vh - 120px);
}

.main-card {
  min-height: 600px;
}

.card-header {
  margin-bottom: 20px;
}

/* 标签页样式 */
.borrow-tabs {
  margin-bottom: 20px;
}

.borrow-tabs :deep(.el-tabs__header) {
  margin-bottom: 20px;
}

/* 借阅表单 */
.borrow-form,
.return-form {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

/* 暗黑模式适配 */
html.dark .borrow-form,
html.dark .return-form {
  background-color: #2d2d2d;
  border: 1px solid #3d3d3d;
}

/* 表单按钮 */
.form-buttons {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 10px;
}

/* 搜索表单 */
.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: flex-end;
  margin-bottom: 20px;
}

/* 表格 */
:deep(.el-table) {
  margin-bottom: 20px;
}

/* 分页 */
.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>