<template>
  <div class="profile-page">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>个人中心</span>
        </div>
      </template>

      <el-tabs v-model="activeTab">
        <!-- 个人资料 -->
        <el-tab-pane label="个人资料" name="profile">
          <div class="profile-section">
            <el-form :model="userInfo" label-width="120px" class="profile-form">
              <el-form-item label="用户名">
                <el-input v-model="userInfo.username" disabled />
              </el-form-item>
              <el-form-item label="真实姓名" prop="real_name">
                <el-input v-model="userInfo.real_name" />
              </el-form-item>
              <el-form-item label="角色">
                <el-input v-model="userInfo.role_text" disabled />
              </el-form-item>
              <el-form-item label="联系电话">
                <el-input v-model="userInfo.phone" />
              </el-form-item>
              <el-form-item label="账号状态">
                <el-tag :type="userInfo.status === 1 ? 'success' : 'danger'">
                  {{ userInfo.status === 1 ? '启用' : '禁用' }}
                </el-tag>
              </el-form-item>
              <el-form-item label="创建时间">
                <el-input v-model="userInfo.created_at" disabled />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="updateProfile" :loading="updateLoading">
                  保存修改
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>

        <!-- 修改密码 -->
        <el-tab-pane label="修改密码" name="password">
          <div class="password-section">
            <el-form :model="passwordForm" :rules="passwordRules" ref="passwordFormRef" label-width="120px" class="password-form">
              <el-form-item label="当前密码" prop="oldPassword">
                <el-input v-model="passwordForm.oldPassword" type="password" show-password />
              </el-form-item>
              <el-form-item label="新密码" prop="newPassword">
                <el-input v-model="passwordForm.newPassword" type="password" show-password />
              </el-form-item>
              <el-form-item label="确认密码" prop="confirmPassword">
                <el-input v-model="passwordForm.confirmPassword" type="password" show-password />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="updatePassword" :loading="passwordLoading">
                  修改密码
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>

        <!-- 个人统计 -->
        <el-tab-pane label="个人统计" name="statistics">
          <div class="statistics-section">
            <el-card shadow="hover" class="stat-card">
              <div class="stat-grid">
                <div class="stat-item">
                  <el-icon class="stat-icon"><Reading /></el-icon>
                  <div class="stat-content">
                    <p class="stat-value">{{ userStats.totalOperations || 0 }}</p>
                    <p class="stat-label">累计操作</p>
                  </div>
                </div>
                <div class="stat-item">
                  <el-icon class="stat-icon"><Timer /></el-icon>
                  <div class="stat-content">
                    <p class="stat-value">{{ userStats.loginCount || 0 }}</p>
                    <p class="stat-label">登录次数</p>
                  </div>
                </div>
                <div class="stat-item">
                  <el-icon class="stat-icon"><Calendar /></el-icon>
                  <div class="stat-content">
                    <p class="stat-value">{{ userStats.thisMonthOperations || 0 }}</p>
                    <p class="stat-label">本月操作</p>
                  </div>
                </div>
                <div class="stat-item">
                  <el-icon class="stat-icon"><Warning /></el-icon>
                  <div class="stat-content">
                    <p class="stat-value">{{ userStats.errorOperations || 0 }}</p>
                    <p class="stat-label">错误操作</p>
                  </div>
                </div>
              </div>
            </el-card>

            <!-- 操作趋势 -->
            <el-card shadow="hover" class="chart-card">
              <template #header>
                <div class="chart-header">
                  <span>近30天操作趋势</span>
                </div>
              </template>
              <div class="chart-container">
                <el-empty v-if="!userStats.operationTrend" description="暂无数据" />
                <div v-else ref="chartRef" class="operation-chart"></div>
              </div>
            </el-card>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Reading, Timer, Calendar, Warning } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import * as echarts from 'echarts'
import request from '@/utils/request'

const activeTab = ref('profile')
const userInfo = ref({ real_name: '', phone: '' })
const userStats = ref({})
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})
const updateLoading = ref(false)
const passwordLoading = ref(false)
const passwordFormRef = ref(null)
const chartRef = ref(null)
let chart = null

const passwordRules = {
  oldPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

const fetchUserInfo = async () => {
  try {
    const res = await request({
      url: '/auth/info',
      method: 'get'
    })
    if (res.code === 200) {
      userInfo.value = {
        ...res.data,
        role_text: res.data.role === 'admin' ? '管理员' : '馆员'
      }
      console.log('用户信息数据结构:', userInfo.value)
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
    ElMessage.error('获取用户信息失败')
  }
}

const fetchUserStatistics = async () => {
  try {
    const res = await request({
      url: '/users/statistics',
      method: 'get'
    })
    if (res.code === 200) {
      userStats.value = res.data
      if (userStats.value.operationTrend) {
        initChart()
      }
    }
  } catch (error) {
    console.error('获取用户统计失败:', error)
    ElMessage.error('获取用户统计失败')
  }
}

const updateProfile = async () => {
  try {
    updateLoading.value = true
    const submitData = {
      real_name: userInfo.value.real_name,
      phone: userInfo.value.phone
    }
    console.log('提交的个人资料数据:', submitData)
    console.log('请求URL:', '/users/profile')
    console.log('请求方法:', 'put')
    const res = await request({
      url: '/users/profile',
      method: 'put',
      data: submitData
    })
    console.log('后端返回:', res)
    if (res.code === 200) {
      ElMessage.success('修改成功')
    } else {
      console.error('修改失败，后端返回:', res)
      ElMessage.error(res.msg || '修改失败')
    }
  } catch (error) {
    console.error('修改失败:', error)
    console.error('错误详情:', error.response)
    if (error.response) {
      console.error('错误状态码:', error.response.status)
      console.error('错误数据:', error.response.data)
    }
    ElMessage.error('修改失败')
  } finally {
    updateLoading.value = false
  }
}

const updatePassword = async () => {
  try {
    await passwordFormRef.value.validate()
    passwordLoading.value = true
    const res = await request({
      url: '/users/change-password',
      method: 'put',
      data: {
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword
      }
    })
    if (res.code === 200) {
      ElMessage.success('密码修改成功')
      passwordForm.oldPassword = ''
      passwordForm.newPassword = ''
      passwordForm.confirmPassword = ''
    } else {
      ElMessage.error(res.msg || '密码修改失败')
    }
  } catch (error) {
    if (error !== false) {
      ElMessage.error('密码修改失败')
    }
  } finally {
    passwordLoading.value = false
  }
}

const initChart = () => {
  if (!chartRef.value) return

  chart = echarts.init(chartRef.value)
  const trend = userStats.value.operationTrend
  
  const option = {
    tooltip: {
      trigger: 'axis',
      formatter: '{b}: {c} 次'
    },
    xAxis: {
      type: 'category',
      data: trend.map(item => item.date)
    },
    yAxis: {
      type: 'value',
      minInterval: 1
    },
    series: [
      {
        data: trend.map(item => item.count),
        type: 'line',
        smooth: true,
        itemStyle: {
          color: '#409eff'
        }
      }
    ]
  }

  chart.setOption(option)

  window.addEventListener('resize', () => {
    chart.resize()
  })
}

onMounted(() => {
  fetchUserInfo()
  fetchUserStatistics()
})
</script>

<style scoped>
.profile-page {
  padding: 20px 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.profile-form,
.password-form {
  max-width: 600px;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
  padding: 20px 0;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.stat-item:hover {
  background-color: #f0f9ff;
}

.stat-icon {
  font-size: 32px;
  color: #409eff;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.stat-label {
  font-size: 14px;
  color: #606266;
  margin-top: 5px;
}

.chart-card {
  margin-top: 20px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-container {
  height: 400px;
  padding: 20px 0;
}

.operation-chart {
  width: 100%;
  height: 100%;
}

/* 暗黑模式适配 */
html.dark .stat-item {
  background-color: #2d2d2d;
  border: 1px solid #3d3d3d;
}

html.dark .stat-item:hover {
  background-color: #3a4a64;
}

html.dark .stat-value {
  color: #bfcbd9;
}

html.dark .stat-label {
  color: #8391a5;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .profile-form,
  .password-form {
    max-width: 100%;
  }

  .stat-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .chart-container {
    height: 300px;
  }
}
</style>