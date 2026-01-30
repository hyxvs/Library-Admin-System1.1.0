<template>
  <div class="readers-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>读者管理</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增读者
          </el-button>
        </div>
      </template>

      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="读者编号">
          <el-input v-model="searchForm.reader_no" placeholder="请输入读者编号" clearable />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="searchForm.name" placeholder="请输入姓名" clearable />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="searchForm.phone" placeholder="请输入手机号" clearable />
        </el-form-item>
        <el-form-item label="信用状态">
          <el-select v-model="searchForm.credit_status" placeholder="请选择信用状态" clearable>
            <el-option label="正常" value="normal" />
            <el-option label="逾期" value="overdue" />
            <el-option label="欠费" value="debt" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="reader_no" label="读者编号" width="120" />
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column prop="phone" label="手机号" width="130" />
        <el-table-column prop="email" label="邮箱" width="180" />
        <el-table-column label="信用状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getCreditStatusType(row.credit_status)">
              {{ getCreditStatusText(row.credit_status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="借阅情况" width="150">
          <template #default="{ row }">
            <span>{{ row.current_borrow_count }} / {{ row.max_borrow_count }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="debt_amount" label="欠费金额" width="100">
          <template #default="{ row }">
            <span :style="{ color: Number(row.debt_amount) > 0 ? '#f56c6c' : '' }">
              ¥{{ Number(row.debt_amount).toFixed(2) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="warning" link @click="handleCredit(row)">信用</el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
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
        style="margin-top: 20px; justify-content: flex-end"
      />
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="读者编号" prop="reader_no">
          <el-input v-model="formData.reader_no" placeholder="请输入读者编号" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="formData.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="formData.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="formData.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="身份证号" prop="id_card">
          <el-input v-model="formData.id_card" placeholder="请输入身份证号" />
        </el-form-item>
        <el-form-item label="最大借阅册数">
          <el-input-number v-model="formData.max_borrow_count" :min="1" :max="20" style="width: 100%" />
        </el-form-item>
        <el-form-item label="最大借阅天数">
          <el-input-number v-model="formData.max_borrow_days" :min="1" :max="90" style="width: 100%" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="formData.status">
            <el-radio :value="1">正常</el-radio>
            <el-radio :value="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="creditDialogVisible"
      title="修改信用状态"
      width="400px"
    >
      <el-form :model="creditForm" label-width="100px">
        <el-form-item label="信用状态">
          <el-select v-model="creditForm.credit_status" placeholder="请选择信用状态" style="width: 100%">
            <el-option label="正常" value="normal" />
            <el-option label="逾期" value="overdue" />
            <el-option label="欠费" value="debt" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="creditDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreditSubmit" :loading="creditLoading">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search } from '@element-plus/icons-vue'
import { getReaders, createReader, updateReader, deleteReader, updateReaderCredit } from '@/api/readers'

const loading = ref(false)
const submitLoading = ref(false)
const creditLoading = ref(false)
const dialogVisible = ref(false)
const creditDialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref(null)
const tableData = ref([])

const searchForm = reactive({
  reader_no: '',
  name: '',
  phone: '',
  credit_status: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const formData = reactive({
  id: null,
  reader_no: '',
  name: '',
  phone: '',
  email: '',
  id_card: '',
  max_borrow_count: 5,
  max_borrow_days: 30,
  status: 1
})

const creditForm = reactive({
  id: null,
  credit_status: 'normal'
})

const formRules = {
  reader_no: [
    { required: true, message: '请输入读者编号', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  id_card: [
    { pattern: /^\d{17}[\dXx]$/, message: '身份证号格式不正确', trigger: 'blur' }
  ]
}

const getCreditStatusType = (status) => {
  const map = {
    normal: 'success',
    overdue: 'warning',
    debt: 'danger'
  }
  return map[status] || ''
}

const getCreditStatusText = (status) => {
  const map = {
    normal: '正常',
    overdue: '逾期',
    debt: '欠费'
  }
  return map[status] || status
}

const fetchReaders = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...searchForm
    }
    const res = await getReaders(params)
    if (res.code === 200) {
      tableData.value = res.data.list
      pagination.total = res.data.total
    }
  } catch (error) {
    console.error('获取读者列表失败:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.page = 1
  fetchReaders()
}


const handleAdd = () => {
  dialogTitle.value = '新增读者'
  Object.assign(formData, {
    id: null,
    reader_no: '',
    name: '',
    phone: '',
    email: '',
    id_card: '',
    max_borrow_count: 5,
    max_borrow_days: 30,
    status: 1
  })
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑读者'
  Object.assign(formData, {
    id: row.id,
    reader_no: row.reader_no,
    name: row.name,
    phone: row.phone,
    email: row.email,
    id_card: row.id_card,
    max_borrow_count: row.max_borrow_count,
    max_borrow_days: row.max_borrow_days,
    status: row.status
  })
  dialogVisible.value = true
}

const handleCredit = (row) => {
  creditForm.id = row.id
  creditForm.credit_status = row.credit_status
  creditDialogVisible.value = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该读者吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const res = await deleteReader(row.id)
      if (res.code === 200) {
        ElMessage.success('删除成功')
        fetchReaders()
      } else {
        ElMessage.error(res.msg || '删除失败')
      }
    } catch (error) {
      ElMessage.error('删除失败')
    }
  }).catch(() => {})
}

const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    submitLoading.value = true

    const data = { ...formData }
    delete data.id

    let res
    if (formData.id) {
      res = await updateReader(formData.id, data)
    } else {
      res = await createReader(data)
    }

    if (res.code === 200) {
      ElMessage.success(formData.id ? '更新成功' : '创建成功')
      dialogVisible.value = false
      fetchReaders()
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

const handleCreditSubmit = async () => {
  try {
    creditLoading.value = true
    const res = await updateReaderCredit(creditForm.id, {
      credit_status: creditForm.credit_status
    })
    if (res.code === 200) {
      ElMessage.success('修改成功')
      creditDialogVisible.value = false
      fetchReaders()
    } else {
      ElMessage.error(res.msg || '修改失败')
    }
  } catch (error) {
    ElMessage.error('修改失败')
  } finally {
    creditLoading.value = false
  }
}

const handleDialogClose = () => {
  formRef.value?.resetFields()
}

const handleSizeChange = (val) => {
  pagination.pageSize = val
  fetchReaders()
}

const handleCurrentChange = (val) => {
  pagination.page = val
  fetchReaders()
}

onMounted(() => {
  fetchReaders()
})
</script>

<style scoped>
.readers-page {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-form {
  margin-bottom: 20px;
}
</style>
