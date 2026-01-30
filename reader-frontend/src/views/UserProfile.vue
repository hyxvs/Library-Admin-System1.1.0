<template>
  <div class="user-profile-page">
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
              <el-form-item label="读者号">
                <el-input v-model="userInfo.reader_no" disabled />
              </el-form-item>
              <el-form-item label="姓名">
                <el-input v-model="userInfo.name" />
              </el-form-item>
              <el-form-item label="性别">
                <el-select v-model="userInfo.gender">
                  <el-option label="男" value="male" />
                  <el-option label="女" value="female" />
                </el-select>
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="userInfo.email" />
              </el-form-item>
              <el-form-item label="身份证号">
                <el-input v-model="userInfo.id_card" disabled />
              </el-form-item>
              <el-form-item label="注册日期">
                <el-input v-model="userInfo.create_time" disabled />
              </el-form-item>
              <el-form-item label="信用状态">
                <el-tag :type="getCreditStatusType(userInfo.credit_status)">
                  {{ getCreditStatusText(userInfo.credit_status) }}
                </el-tag>
              </el-form-item>
              <el-form-item label="欠费金额">
                <el-input v-model="userInfo.arrears_amount" disabled />
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
            <el-form :model="passwordForm" label-width="120px" class="password-form">
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
                    <p class="stat-value">{{ userStats.totalBorrow || 0 }}</p>
                    <p class="stat-label">累计借阅</p>
                  </div>
                </div>
                <div class="stat-item">
                  <el-icon class="stat-icon"><Timer /></el-icon>
                  <div class="stat-content">
                    <p class="stat-value">{{ userStats.currentBorrow || 0 }}</p>
                    <p class="stat-label">当前借阅</p>
                  </div>
                </div>
                <div class="stat-item">
                  <el-icon class="stat-icon"><Calendar /></el-icon>
                  <div class="stat-content">
                    <p class="stat-value">{{ userStats.totalReservation || 0 }}</p>
                    <p class="stat-label">累计预约</p>
                  </div>
                </div>
                <div class="stat-item">
                  <el-icon class="stat-icon"><Warning /></el-icon>
                  <div class="stat-content">
                    <p class="stat-value">{{ userStats.totalOverdue || 0 }}</p>
                    <p class="stat-label">历史逾期</p>
                  </div>
                </div>
              </div>
            </el-card>

            <!-- 借阅趋势 -->
            <el-card shadow="hover" class="chart-card">
              <template #header>
                <div class="chart-header">
                  <span>近12个月借阅趋势</span>
                </div>
              </template>
              <div class="chart-container">
                <el-empty v-if="!userStats.borrowTrend" description="暂无数据" />
                <div v-else ref="chartRef" class="borrow-chart"></div>
              </div>
            </el-card>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Reading, Timer, Calendar, Warning } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import * as echarts from 'echarts'
import { updateUserInfo, changePassword, getUserStatistics } from '@/api/user'
import { getUserInfo } from '@/api/auth'

const activeTab = ref('profile')
const userInfo = ref({})
const userStats = ref({})
const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})
const updateLoading = ref(false)
const passwordLoading = ref(false)
const chartRef = ref(null)
let chart = null

const fetchUserInfo = async () => {
  try {
    const res = await getUserInfo()
    if (res.code === 200) {
      userInfo.value = res.data
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
    ElMessage.error('获取用户信息失败')
  }
}

const fetchUserStatistics = async () => {
  try {
    const res = await getUserStatistics()
    if (res.code === 200) {
      userStats.value = res.data
      if (userStats.value.borrowTrend) {
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
    const res = await updateUserInfo(userInfo.value)
    if (res.code === 200) {
      ElMessage.success('修改成功')
    } else {
      ElMessage.error(res.msg || '修改失败')
    }
  } catch (error) {
    console.error('修改失败:', error)
    ElMessage.error('修改失败')
  } finally {
    updateLoading.value = false
  }
}

const updatePassword = async () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    ElMessage.error('两次输入的密码不一致')
    return
  }

  try {
    passwordLoading.value = true
    const res = await changePassword({
      oldPassword: passwordForm.value.oldPassword,
      newPassword: passwordForm.value.newPassword
    })
    if (res.code === 200) {
      ElMessage.success('密码修改成功')
      passwordForm.value = {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
    } else {
      ElMessage.error(res.msg || '密码修改失败')
    }
  } catch (error) {
    console.error('密码修改失败:', error)
    ElMessage.error('密码修改失败')
  } finally {
    passwordLoading.value = false
  }
}

const getCreditStatusType = (status) => {
  const typeMap = {
    good: 'success',
    warning: 'warning',
    bad: 'danger'
  }
  return typeMap[status] || ''
}

const getCreditStatusText = (status) => {
  const textMap = {
    good: '良好',
    warning: '警告',
    bad: '不良'
  }
  return textMap[status] || status
}

const initChart = () => {
  if (!chartRef.value) return

  chart = echarts.init(chartRef.value)
  const trend = userStats.value.borrowTrend
  
  const option = {
    tooltip: {
      trigger: 'axis',
      formatter: '{b}: {c} 次'
    },
    xAxis: {
      type: 'category',
      data: trend.map(item => item.month)
    },
    yAxis: {
      type: 'value',
      minInterval: 1
    },
    series: [
      {
        data: trend.map(item => item.count),
        type: 'bar',
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

watch(
  () => userStats.value.borrowTrend,
  () => {
    if (userStats.value.borrowTrend) {
      initChart()
    }
  }
)

onMounted(() => {
  fetchUserInfo()
  fetchUserStatistics()
})
</script>

<style scoped>
.user-profile-page {
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

.borrow-chart {
  width: 100%;
  height: 100%;
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
