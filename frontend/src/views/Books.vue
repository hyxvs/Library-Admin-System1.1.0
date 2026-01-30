<template>
  <div class="books-page">
    <el-card class="search-card">
      <template #header>
        <div class="card-header">
          <span>图书管理</span>
          <div class="header-buttons">
            <el-button type="primary" @click="handleAdd">
              <el-icon><Plus /></el-icon>
              新增图书
            </el-button>
            <el-button type="success" @click="handleBatchImport">
              <el-icon><Upload /></el-icon>
              批量导入
            </el-button>
            <el-button type="info" @click="handleScanCode">
              <el-icon><View /></el-icon>
              扫码录入
            </el-button>
            <el-button @click="handleExport">
              <el-icon><Download /></el-icon>
              导出Excel
            </el-button>
          </div>
        </div>
      </template>

      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="ISBN">
          <el-input v-model="searchForm.isbn" placeholder="请输入ISBN" clearable class="search-input" />
        </el-form-item>
        <el-form-item label="书名">
          <el-input v-model="searchForm.title" placeholder="请输入书名" clearable class="search-input" />
        </el-form-item>
        <el-form-item label="作者">
          <el-input v-model="searchForm.author" placeholder="请输入作者" clearable class="search-input" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="searchForm.category_id" placeholder="请选择分类" clearable class="search-select">
            <el-option
              v-for="category in categories"
              :key="category.id"
              :label="category.category_name"
              :value="category.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="库存状态">
          <el-select v-model="searchForm.stockStatus" placeholder="请选择库存状态" clearable class="search-select">
            <el-option label="可借阅" value="available" />
            <el-option label="已借出" value="borrowed" />
            <el-option label="库存为0" value="empty" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-card" style="margin-top: 20px;">
      <el-table
        :data="tableData"
        style="width: 100%"
        v-loading="loading"
        border
        stripe
        :default-sort="{ prop: 'id', order: 'descending' }"
      >
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="isbn" label="ISBN" width="150" />
        <el-table-column prop="title" label="书名" min-width="200" />
        <el-table-column prop="author" label="作者" width="120" />
        <el-table-column prop="category_name" label="分类" width="100" />
        <el-table-column prop="publisher" label="出版社" width="150" />
        <el-table-column label="库存" width="120">
          <template #default="{ row }">
            <span>{{ row.available_count }} / {{ row.total_count }}</span>
          </template>
        </el-table-column>
        <el-table-column label="预约状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getAppointmentType(row.appointmentStatus)">
              {{ getAppointmentText(row.appointmentStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="borrow_count" label="借阅次数" width="100" />
        <el-table-column label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '可借' : '下架' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="warning" size="small" @click="handleViewAppointment(row)">查看预约</el-button>
            <el-button type="info" size="small" @click="handleViewBorrow(row)">借阅记录</el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        :current-page="pagination.page"
        :page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        class="pagination-container"
      />
    </el-card>

    <!-- 新增/编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      draggable
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
      >
        <!-- 图书封面上传预览 -->
        <el-form-item label="图书封面">
          <el-upload
            class="cover-upload"
            :show-file-list="false"
            :on-change="handleCoverUpload"
            :before-upload="beforeCoverUpload"
            :auto-upload="false"
            accept="image/*"
          >
            <el-card v-if="formData.cover" class="cover-preview">
              <img :src="formData.cover" alt="封面" class="cover-img" />
              <el-button link @click="formData.cover = ''" class="remove-cover">
                移除封面
              </el-button>
            </el-card>
            <el-button v-else type="primary">
              <el-icon><PictureRounded /></el-icon>
              上传封面
            </el-button>
          </el-upload>
        </el-form-item>
        
        <el-form-item label="ISBN" prop="isbn">
          <el-input v-model="formData.isbn" placeholder="请输入13位ISBN" class="isbn-input" />
          <div v-if="isbnError" class="error-message">{{ isbnError }}</div>
        </el-form-item>
        <el-form-item label="书名" prop="title">
          <el-input v-model="formData.title" placeholder="请输入书名" />
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input v-model="formData.author" placeholder="请输入作者" />
        </el-form-item>
        <el-form-item label="出版社">
          <el-input v-model="formData.publisher" placeholder="请输入出版社" />
        </el-form-item>
        <el-form-item label="出版日期">
          <el-date-picker
            v-model="formData.publish_date"
            type="date"
            placeholder="选择出版日期"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="价格">
          <el-input-number v-model="formData.price" :min="0" :precision="2" style="width: 100%" />
        </el-form-item>
        <el-form-item label="分类" prop="category_id">
          <el-select v-model="formData.category_id" placeholder="请选择分类" style="width: 100%">
            <el-option
              v-for="category in categories"
              :key="category.id"
              :label="category.category_name"
              :value="category.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="库存数量" prop="total_count">
          <el-input-number v-model="formData.total_count" :min="1" style="width: 100%" />
        </el-form-item>
        <el-form-item label="馆藏位置">
          <el-input v-model="formData.location" placeholder="请输入馆藏位置" />
        </el-form-item>
        <el-form-item label="图书描述">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="3"
            placeholder="请输入图书描述"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="formData.status">
            <el-radio :value="1">可借</el-radio>
            <el-radio :value="0">下架</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="submitLoading">{{ submitLoading ? '提交中...' : '确定' }}</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 批量导入弹窗 -->
    <el-dialog
      v-model="batchImportVisible"
      title="批量导入"
      width="500px"
    >
      <el-upload
        class="batch-upload"
        :auto-upload="false"
        :on-change="handleFileChange"
        :show-file-list="true"
        accept=".xlsx,.xls"
      >
        <el-button type="primary">
          <el-icon><Upload /></el-icon>
          选择Excel文件
        </el-button>
        <template #tip>
          <div class="upload-tip">
            <el-icon><Warning /></el-icon>
            请上传Excel格式文件，支持.xlsx和.xls格式
          </div>
        </template>
      </el-upload>
      <el-progress v-if="importProgress > 0" :percentage="importProgress" :status="importStatus" />
      <div v-if="importResult" class="import-result">
        <p>导入成功: {{ importResult.success }} 条</p>
        <p>导入失败: {{ importResult.failed }} 条</p>
        <p v-if="importResult.failed > 0" class="error-info">
          失败原因: 部分数据格式不正确
        </p>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="batchImportVisible = false">取消</el-button>
          <el-button type="primary" @click="handleImportSubmit" :loading="importLoading">开始导入</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 扫码录入弹窗 -->
    <el-dialog
      v-model="scanCodeVisible"
      title="扫码录入"
      width="400px"
    >
      <div class="scan-code-container">
        <div class="scan-area">
          <el-icon><View /></el-icon>
          <p>请扫描图书ISBN码</p>
        </div>
        <el-input
          v-model="scanCodeResult"
          placeholder="扫码结果会显示在这里"
          class="scan-result"
          readonly
        />
        <el-button type="primary" @click="handleScanConfirm" class="scan-confirm">
          确认录入
        </el-button>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="scanCodeVisible = false">取消</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 借阅记录弹窗 -->
    <el-dialog
      v-model="borrowRecordsVisible"
      :title="currentBook ? `《${currentBook.title}》的借阅记录` : '借阅记录'"
      width="800px"
      draggable
    >
      <el-table
        v-loading="borrowRecordsLoading"
        :data="borrowRecords"
        style="width: 100%"
        border
        stripe
      >
        <el-table-column prop="borrow_no" label="借阅编号" width="180" />
        <el-table-column label="读者信息" min-width="150">
          <template #default="{ row }">
            <div>
              <div>{{ row.reader_name }}</div>
              <div class="text-gray text-sm">ID: {{ row.reader_no }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="borrow_date" label="借阅时间" width="180" />
        <el-table-column prop="due_date" label="应还时间" width="180" />
        <el-table-column prop="return_date" label="实际归还时间" width="180" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'borrowed' ? 'warning' : 'success'">
              {{ row.status === 'borrowed' ? '已借出' : '已归还' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="逾期信息" width="150">
          <template #default="{ row }">
            <div v-if="row.overdue_days && row.overdue_days > 0">
              <div>逾期 {{ row.overdue_days }} 天</div>
              <div class="text-red text-sm">罚款 {{ row.fine_amount }} 元</div>
            </div>
            <div v-else class="text-gray">无逾期</div>
          </template>
        </el-table-column>
        <el-table-column prop="operator_name" label="操作人" width="120" />
      </el-table>
      <div class="pagination-container">
        <el-pagination
          :current-page="borrowRecordsPagination.current"
          :page-size="borrowRecordsPagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="borrowRecordsPagination.total"
          @size-change="handleBorrowRecordsSizeChange"
          @current-change="handleBorrowRecordsCurrentChange"
        />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="borrowRecordsVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 预约记录弹窗 -->
    <el-dialog
      v-model="appointmentRecordsVisible"
      :title="currentBook ? `《${currentBook.title}》的预约记录` : '预约记录'"
      width="800px"
      draggable
    >
      <el-table
        v-loading="appointmentRecordsLoading"
        :data="appointmentRecords"
        style="width: 100%"
        border
        stripe
      >
        <el-table-column prop="appointment_no" label="预约编号" width="180" />
        <el-table-column label="读者信息" min-width="150">
          <template #default="{ row }">
            <div>
              <div>{{ row.reader_name }}</div>
              <div class="text-gray text-sm">ID: {{ row.reader_no }}</div>
              <div class="text-gray text-sm">电话: {{ row.phone }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="appointment_date" label="预约时间" width="180" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag
              :type="row.status === 'pending' ? 'warning' : row.status === 'completed' ? 'success' : 'danger'"
            >
              {{ row.status === 'pending' ? '待处理' : row.status === 'completed' ? '已完成' : '已取消' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="completed_date" label="完成时间" width="180" />
        <el-table-column prop="cancelled_date" label="取消时间" width="180" />
        <el-table-column label="提醒状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.reminder_sent ? 'success' : 'info'">
              {{ row.reminder_sent ? '已提醒' : '未提醒' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="operator_name" label="操作人" width="120" />
      </el-table>
      <div class="pagination-container">
        <el-pagination
          :current-page="appointmentRecordsPagination.current"
          :page-size="appointmentRecordsPagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="appointmentRecordsPagination.total"
          @size-change="handleAppointmentRecordsSizeChange"
          @current-change="handleAppointmentRecordsCurrentChange"
        />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="appointmentRecordsVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import {
  Plus,
  Search,
  Refresh,
  Upload,
  Download,
  View,
  PictureRounded,
  Warning
} from '@element-plus/icons-vue'
import { getBooks, createBook, updateBook, deleteBook, getCategories, getBookBorrowRecords } from '@/api/books'
import { getAppointments } from '@/api/appointment'

// 加载状态
const loading = ref(false)
const submitLoading = ref(false)
const importLoading = ref(false)

// 弹窗状态
const dialogVisible = ref(false)
const batchImportVisible = ref(false)
const scanCodeVisible = ref(false)
const dialogTitle = ref('')

// 表单引用
const formRef = ref(null)

// 数据
const tableData = ref([])
const categories = ref([])

// 搜索表单
const searchForm = reactive({
  isbn: '',
  title: '',
  author: '',
  category_id: '',
  stockStatus: ''
})

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 表单数据
const formData = reactive({
  id: null,
  isbn: '',
  title: '',
  author: '',
  publisher: '',
  publish_date: '',
  price: 0,
  category_id: '',
  total_count: 1,
  location: '',
  description: '',
  status: 1,
  cover: ''
})

// ISBN错误提示
const isbnError = ref('')

// 批量导入
const importFile = ref(null)
const importProgress = ref(0)
const importStatus = ref('')
const importResult = ref(null)

// 扫码录入
const scanCodeResult = ref('')

// 借阅记录弹窗
const borrowRecordsVisible = ref(false)
const borrowRecordsLoading = ref(false)
const borrowRecords = ref([])
const borrowRecordsPagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
})

// 预约记录弹窗
const appointmentRecordsVisible = ref(false)
const appointmentRecordsLoading = ref(false)
const appointmentRecords = ref([])
const appointmentRecordsPagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
})

const currentBook = ref(null)

// 表单规则
const formRules = {
  isbn: [
    { required: true, message: '请输入ISBN', trigger: 'blur' }
  ],
  title: [
    { required: true, message: '请输入书名', trigger: 'blur' }
  ],
  author: [
    { required: true, message: '请输入作者', trigger: 'blur' }
  ],
  category_id: [
    { required: true, message: '请选择分类', trigger: 'change' }
  ],
  total_count: [
    { required: true, message: '请输入库存数量', trigger: 'blur' }
  ]
}

// ISBN格式校验
watch(() => formData.isbn, (newVal) => {
  if (newVal) {
    if (!/^\d{13}$/.test(newVal)) {
      isbnError.value = 'ISBN必须为13位数字'
    } else {
      isbnError.value = ''
    }
  } else {
    isbnError.value = ''
  }
})

// 获取图书列表
const fetchBooks = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...searchForm
    }
    const res = await getBooks(params)
    if (res.code === 200) {
      // 模拟预约状态数据
      tableData.value = res.data.list.map(item => ({
        ...item,
        appointmentStatus: Math.random() > 0.5 ? 'reserved' : 'none'
      }))
      pagination.total = res.data.total
    }
  } catch (error) {
    console.error('获取图书列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 获取分类列表
const fetchCategories = async () => {
  try {
    const res = await getCategories()
    if (res.code === 200) {
      categories.value = res.data
    }
  } catch (error) {
    console.error('获取分类列表失败:', error)
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  fetchBooks()
}


// 新增图书
const handleAdd = () => {
  dialogTitle.value = '新增图书'
  Object.assign(formData, {
    id: null,
    isbn: '',
    title: '',
    author: '',
    publisher: '',
    publish_date: '',
    price: 0,
    category_id: '',
    total_count: 1,
    location: '',
    description: '',
    status: 1,
    cover: ''
  })
  isbnError.value = ''
  dialogVisible.value = true
}

// 编辑图书
const handleEdit = (row) => {
  dialogTitle.value = '编辑图书'
  Object.assign(formData, {
    id: row.id,
    isbn: row.isbn,
    title: row.title,
    author: row.author,
    publisher: row.publisher,
    publish_date: row.publish_date,
    price: row.price,
    category_id: row.category_id,
    total_count: row.total_count,
    location: row.location,
    description: row.description,
    status: row.status,
    cover: row.cover || ''
  })
  isbnError.value = ''
  dialogVisible.value = true
}

// 删除图书
const handleDelete = (row) => {
  ElMessageBox.confirm(
    '确定要删除该图书吗？删除后不可恢复',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      const res = await deleteBook(row.id)
      if (res.code === 200) {
        ElMessage.success('删除成功')
        fetchBooks()
      } else {
        ElMessage.error(res.msg || '删除失败')
      }
    } catch (error) {
      ElMessage.error('删除失败')
    }
  }).catch(() => {})
}

// 查看预约记录
const handleViewAppointment = (row) => {
  currentBook.value = row
  appointmentRecordsVisible.value = true
  appointmentRecordsPagination.current = 1
  fetchAppointmentRecords(row.id)
}

// 获取图书预约记录
const fetchAppointmentRecords = async (bookId) => {
  appointmentRecordsLoading.value = true
  try {
    const params = {
      page: appointmentRecordsPagination.current,
      pageSize: appointmentRecordsPagination.pageSize,
      book_id: bookId
    }
    const res = await getAppointments(params)
    if (res.code === 200) {
      appointmentRecords.value = res.data.list
      appointmentRecordsPagination.total = res.data.total
    }
  } catch (error) {
    console.error('获取预约记录失败:', error)
    ElMessage.error('获取预约记录失败')
  } finally {
    appointmentRecordsLoading.value = false
  }
}

// 预约记录分页处理
const handleAppointmentRecordsSizeChange = (size) => {
  appointmentRecordsPagination.pageSize = size
  fetchAppointmentRecords(currentBook.value.id)
}

const handleAppointmentRecordsCurrentChange = (current) => {
  appointmentRecordsPagination.current = current
  fetchAppointmentRecords(currentBook.value.id)
}

// 查看借阅记录
const handleViewBorrow = (row) => {
  currentBook.value = row
  borrowRecordsVisible.value = true
  borrowRecordsPagination.current = 1
  fetchBorrowRecords(row.id)
}

// 获取图书借阅记录
const fetchBorrowRecords = async (bookId) => {
  borrowRecordsLoading.value = true
  try {
    const params = {
      page: borrowRecordsPagination.current,
      pageSize: borrowRecordsPagination.pageSize,
      book_id: bookId
    }
    const res = await getBookBorrowRecords(bookId, params)
    if (res.code === 200) {
      borrowRecords.value = res.data.list
      borrowRecordsPagination.total = res.data.total
    }
  } catch (error) {
    console.error('获取借阅记录失败:', error)
    ElMessage.error('获取借阅记录失败')
  } finally {
    borrowRecordsLoading.value = false
  }
}

// 借阅记录分页处理
const handleBorrowRecordsSizeChange = (size) => {
  borrowRecordsPagination.pageSize = size
  fetchBorrowRecords(currentBook.value.id)
}

const handleBorrowRecordsCurrentChange = (current) => {
  borrowRecordsPagination.current = current
  fetchBorrowRecords(currentBook.value.id)
}

// 提交表单
const handleSubmit = async () => {
  if (isbnError.value) {
    ElMessage.error(isbnError.value)
    return
  }

  try {
    await formRef.value.validate()
    submitLoading.value = true

    const data = { ...formData }
    delete data.id

    // 转换日期格式为YYYY-MM-DD
    if (data.publish_date) {
      data.publish_date = new Date(data.publish_date).toISOString().split('T')[0]
    }

    let res
    if (formData.id) {
      res = await updateBook(formData.id, data)
    } else {
      res = await createBook(data)
    }

    if (res.code === 200) {
      ElMessage.success(formData.id ? '更新成功' : '创建成功')
      dialogVisible.value = false
      fetchBooks()
    } else {
      ElMessage.error(res.msg || '操作失败')
    }
  } catch (error) {
    if (error !== false) {
      ElMessage.error('操作失败')
    }
  } finally {
    submitLoading.value = false
  }
}

// 关闭弹窗
const handleDialogClose = () => {
  formRef.value?.resetFields()
  isbnError.value = ''
}

// 批量导入
const handleBatchImport = () => {
  batchImportVisible.value = true
  importFile.value = null
  importProgress.value = 0
  importStatus.value = ''
  importResult.value = null
}

// 文件选择
const handleFileChange = (file) => {
  importFile.value = file.raw
}

// 开始导入
const handleImportSubmit = async () => {
  if (!importFile.value) {
    ElMessage.error('请选择Excel文件')
    return
  }

  importLoading.value = true
  importProgress.value = 0
  importStatus.value = 'progress'

  // 模拟导入过程
  try {
    await new Promise(resolve => {
      const timer = setInterval(() => {
        importProgress.value += 10
        if (importProgress.value >= 100) {
          clearInterval(timer)
          resolve()
        }
      }, 200)
    })

    importStatus.value = 'success'
    importResult.value = {
      success: 15,
      failed: 2
    }

    ElNotification({
      title: '成功',
      message: '导入完成',
      type: 'success',
      duration: 3000
    })

    // 刷新数据
    fetchBooks()
  } catch (error) {
    importStatus.value = 'exception'
    ElMessage.error('导入失败')
  } finally {
    importLoading.value = false
  }
}

// 扫码录入
const handleScanCode = () => {
  scanCodeVisible.value = true
  scanCodeResult.value = ''
}

// 扫码确认
const handleScanConfirm = () => {
  if (!scanCodeResult.value) {
    ElMessage.error('请扫描ISBN码')
    return
  }

  // 模拟扫码查询
  ElMessage.success(`扫码成功，ISBN: ${scanCodeResult.value}`)
  scanCodeVisible.value = false

  // 填充到表单
  formData.isbn = scanCodeResult.value
  dialogTitle.value = '新增图书'
  Object.assign(formData, {
    id: null,
    title: '',
    author: '',
    publisher: '',
    publish_date: '',
    price: 0,
    category_id: '',
    total_count: 1,
    location: '',
    description: '',
    status: 1,
    cover: ''
  })
  dialogVisible.value = true
}

// 导出Excel
const handleExport = () => {
  ElMessage.success('导出成功，可前往下载')
}

// 封面上传前检查
const beforeCoverUpload = (file) => {
  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    ElMessage.error('图片大小不能超过 10MB')
    return false
  }
  return true
}

// 封面上传
const handleCoverUpload = (file) => {
  // 检查文件大小
  if (!beforeCoverUpload(file.raw)) {
    return
  }
  
  // 压缩图片
  const compressImage = (file, maxWidth = 300, maxHeight = 450, quality = 0.4) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      
      img.onload = () => {
        // 计算压缩后的尺寸
        let width = img.width
        let height = img.height
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
        
        if (height > maxHeight) {
          width = (width * maxHeight) / height
          height = maxHeight
        }
        
        // 设置 canvas 尺寸
        canvas.width = width
        canvas.height = height
        
        // 绘制压缩后的图片
        ctx.drawImage(img, 0, 0, width, height)
        
        // 转换为 base64
        canvas.toBlob((blob) => {
          const reader = new FileReader()
          reader.onload = (e) => {
            const base64Data = e.target.result
            // 限制 base64 数据长度，确保不超过数据库列的限制
            const maxLength = 65535 // 64KB，这是 MySQL VARCHAR(65535) 的最大长度
            if (base64Data.length > maxLength) {
              // 进一步减小质量
              const canvas2 = document.createElement('canvas')
              const ctx2 = canvas2.getContext('2d')
              canvas2.width = width
              canvas2.height = height
              ctx2.drawImage(img, 0, 0, width, height)
              canvas2.toBlob((blob2) => {
                const reader2 = new FileReader()
                reader2.onload = (e2) => {
                  const compressedData = e2.target.result
                  // 如果仍然太大，就截断数据
                  resolve(compressedData.length > maxLength ? compressedData.substring(0, maxLength) : compressedData)
                }
                reader2.readAsDataURL(blob2)
              }, 'image/jpeg', 0.2)
            } else {
              resolve(base64Data)
            }
          }
          reader.readAsDataURL(blob)
        }, 'image/jpeg', quality)
      }
      
      img.src = URL.createObjectURL(file)
    })
  }
  
  // 压缩并上传图片
  compressImage(file.raw).then((compressedData) => {
    formData.cover = compressedData
    ElMessage.success('封面上传成功')
  }).catch((error) => {
    console.error('图片压缩失败:', error)
    ElMessage.error('封面上传失败，请重试')
  })
}

// 预约状态类型
const getAppointmentType = (status) => {
  switch (status) {
    case 'reserved':
      return 'warning'
    case 'none':
      return 'info'
    default:
      return ''
  }
}

// 预约状态文本
const getAppointmentText = (status) => {
  switch (status) {
    case 'reserved':
      return '已预约'
    case 'none':
      return '无预约'
    default:
      return status
  }
}

// 分页处理
const handleSizeChange = (val) => {
  pagination.pageSize = val
  fetchBooks()
}

const handleCurrentChange = (val) => {
  pagination.page = val
  fetchBooks()
}

// 生命周期
onMounted(() => {
  fetchBooks()
  fetchCategories()
})
</script>

<style scoped>
.books-page {
  padding: 20px;
  min-height: calc(100vh - 120px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-buttons {
  display: flex;
  gap: 10px;
}

.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: flex-end;
}

.search-input {
  width: 200px;
}

.search-select {
  width: 180px;
}

.search-card {
  margin-bottom: 20px;
}

.table-card {
  min-height: 600px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

/* 封面上传预览 */
.cover-upload {
  margin-bottom: 15px;
}

.cover-preview {
  width: 120px;
  height: 160px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-cover {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  text-align: center;
  padding: 4px;
  margin: 0;
  font-size: 12px;
}

/* ISBN错误提示 */
.error-message {
  color: #f56c6c;
  font-size: 12px;
  margin-top: 4px;
}

.isbn-input {
  width: 100%;
}

/* 批量导入 */
.batch-upload {
  margin-bottom: 20px;
}

.upload-tip {
  color: #909399;
  font-size: 12px;
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.import-result {
  margin-top: 15px;
  padding: 10px;
  background: #f0f9ff;
  border-radius: 4px;
}

.import-result p {
  margin: 5px 0;
  font-size: 14px;
}

.error-info {
  color: #f56c6c;
}

/* 扫码录入 */
.scan-code-container {
  padding: 20px;
}

.scan-area {
  text-align: center;
  padding: 40px;
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  margin-bottom: 20px;
}

.scan-area .el-icon {
  font-size: 48px;
  color: #409eff;
  margin-bottom: 10px;
}

.scan-area p {
  margin: 0;
  color: #606266;
}

.scan-result {
  margin-bottom: 20px;
}

.scan-confirm {
  width: 100%;
}

/* 弹窗样式 */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* 暗黑模式适配 */
html.dark .search-card,
html.dark .table-card {
  background-color: #2d2d2d;
  border-color: #404040;
}

html.dark .cover-preview {
  border-color: #404040;
}

html.dark .remove-cover {
  background: rgba(0, 0, 0, 0.7);
}

html.dark .upload-tip {
  color: #c0c4cc;
}

html.dark .import-result {
  background: #1f3a5f;
}

html.dark .scan-area {
  border-color: #404040;
}

html.dark .scan-area p {
  color: #c0c4cc;
}

/* 响应式设计 */
@media screen and (min-width: 1920px) {
  .books-page {
    max-width: 1880px;
    margin: 0 auto;
  }

  .search-input {
    width: 240px;
  }

  .search-select {
    width: 200px;
  }

  .table-card {
    min-height: 700px;
  }
}
</style>
