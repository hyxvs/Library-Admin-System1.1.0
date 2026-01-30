<template>
  <div class="users-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>用户管理</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增用户
          </el-button>
        </div>
      </template>

      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="用户名">
          <el-input v-model="searchForm.username" placeholder="请输入用户名" clearable />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="searchForm.role" placeholder="请选择角色" clearable>
            <el-option label="管理员" value="admin" />
            <el-option label="馆员" value="librarian" />
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
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="real_name" label="真实姓名" width="120" />
        <el-table-column label="角色" width="100">
          <template #default="{ row }">
            <el-tag :type="row.role === 'admin' ? 'danger' : 'primary'">
              {{ row.role === 'admin' ? '管理员' : '馆员' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="联系电话" width="130" />
        <el-table-column label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.created_at) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
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
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formData.username" placeholder="请输入用户名" :disabled="!!formData.id" />
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="!formData.id">
          <el-input v-model="formData.password" type="password" placeholder="请输入密码" show-password />
        </el-form-item>
        <el-form-item label="真实姓名" prop="real_name">
          <el-input v-model="formData.real_name" placeholder="请输入真实姓名" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-radio-group v-model="formData.role">
            <el-radio value="admin">管理员</el-radio>
            <el-radio value="librarian">馆员</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="formData.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="formData.status">
            <el-radio :value="1">启用</el-radio>
            <el-radio :value="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">确定</el-button>
      </template>
    </el-dialog>


  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search } from '@element-plus/icons-vue'
import request from '@/utils/request'
import dayjs from 'dayjs'
// 表格加载状态
const loading = ref(false)    
// 提交按钮加载状态
const submitLoading = ref(false)
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref(null)
const tableData = ref([])

const searchForm = reactive({
  username: '',
  role: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const formData = reactive({
  id: null,
  username: '',
  password: '',
  real_name: '',
  role: 'librarian',
  phone: '',
  status: 1
})


const formRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少6位', trigger: 'blur' }
  ],
  real_name: [
    { required: true, message: '请输入真实姓名', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ]
}

const formatDate = (date) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}

const fetchUsers = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...searchForm
    }
    const res = await request({
      url: '/users',
      method: 'get',
      params
    })
    if (res.code === 200) {
      tableData.value = res.data.list
      pagination.total = res.data.total
    }
  } catch (error) {
    console.error('获取用户列表失败:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.page = 1
  fetchUsers()
}


const handleAdd = () => {
  dialogTitle.value = '新增用户'
  Object.assign(formData, {
    id: null,
    username: '',
    password: '',
    real_name: '',
    role: 'librarian',
    phone: '',
    status: 1
  })
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑用户'
  Object.assign(formData, {
    id: row.id,
    username: row.username,
    password: '',
    real_name: row.real_name,
    role: row.role,
    phone: row.phone,
    status: row.status
  })
  dialogVisible.value = true
}


const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该用户吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const res = await request({
        url: `/users/${row.id}`,
        method: 'delete'
      })
      if (res.code === 200) {
        ElMessage.success('删除成功')
        fetchUsers()
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
      res = await request({
        url: `/users/${formData.id}`,
        method: 'put',
        data
      })
    } else {
      res = await request({
        url: '/users',
        method: 'post',
        data
      })
    }

    if (res.code === 200) {
      ElMessage.success(formData.id ? '更新成功' : '创建成功')
      dialogVisible.value = false
      fetchUsers()
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


const handleDialogClose = () => {
  formRef.value?.resetFields()
}

const handleSizeChange = (val) => {
  pagination.pageSize = val
  fetchUsers()
}

const handleCurrentChange = (val) => {
  pagination.page = val
  fetchUsers()
}

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.users-page {
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

/* 暗黑模式适配 */
html.dark .users-page {
  background-color: #1a1a1a;
}
</style>
