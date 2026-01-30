<template>
  <el-container class="main-layout">
    <el-aside :width="isCollapse ? '64px' : '200px'" class="sidebar">
      <div class="logo">
        <el-icon><Reading /></el-icon>
        <span v-if="!isCollapse">图书馆管理系统</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        router
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409eff"
        :collapse="isCollapse"
        :collapse-transition="true"
      >
        <!-- 系统管理组 -->
        <template v-if="isAdmin">
          <el-menu-item-group>
            <template #title>
              <span class="menu-group-title">系统管理</span>
            </template>
            <el-menu-item index="/dashboard">
              <el-icon><DataAnalysis /></el-icon>
              <span>首页</span>
            </el-menu-item>
            <el-menu-item index="/users">
              <el-icon><Setting /></el-icon>
              <span>用户管理</span>
            </el-menu-item>
          </el-menu-item-group>
        </template>
        <!-- 图书管理组 -->
        <el-menu-item-group>
          <template #title>
            <span class="menu-group-title">图书管理</span>
          </template>
          <el-menu-item index="/books">
            <el-icon><Reading /></el-icon>
            <span>图书管理</span>
          </el-menu-item>
          <el-menu-item index="/appointment">
            <el-icon><Tickets /></el-icon>
            <span>预约管理</span>
          </el-menu-item>
        </el-menu-item-group>
        <!-- 读者管理组 -->
        <el-menu-item-group>
          <template #title>
            <span class="menu-group-title">读者管理</span>
          </template>
          <el-menu-item index="/readers">
            <el-icon><User /></el-icon>
            <span>读者管理</span>
          </el-menu-item>
          <el-menu-item index="/borrow">
            <el-icon><DocumentCopy /></el-icon>
            <span>借阅管理</span>
          </el-menu-item>
        </el-menu-item-group>
        <!-- 个人中心 -->
        <el-menu-item-group>
          <template #title>
            <span class="menu-group-title">个人中心</span>
          </template>
          <el-menu-item index="/profile">
            <el-icon><UserFilled /></el-icon>
            <span>个人中心</span>
          </el-menu-item>
        </el-menu-item-group>

        <!-- 统计分析组 -->
        <el-menu-item-group>
          <template #title>
            <span class="menu-group-title">统计分析</span>
          </template>
          <el-menu-item index="/statistics">
            <el-icon><DataLine /></el-icon>
            <span>统计报表</span>
          </el-menu-item>
          <el-menu-item v-if="isAdmin" index="/logs">
            <el-icon><View /></el-icon>
            <span>日志审计</span>
          </el-menu-item>
        </el-menu-item-group>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="header">
        <div class="header-left">
          <el-icon class="toggle-icon" @click="toggleSidebar">
            <Fold v-if="!isCollapse" />
            <Expand v-else />
          </el-icon>
          <el-breadcrumb separator="/" class="breadcrumb">
            <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-if="$route.meta.title">{{ $route.meta.title }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <!-- 消息通知 -->
          <el-dropdown class="notification">
            <el-badge :value="notificationCount" :hidden="notificationCount === 0">
              <el-button circle>
                <el-icon><Bell /></el-icon>
              </el-button>
            </el-badge>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-if="notifications.length === 0">
                  <span class="no-notification">暂无通知</span>
                </el-dropdown-item>
                <el-dropdown-item v-for="(item, index) in notifications" :key="index">
                  <div class="notification-item">
                    <el-icon :class="getNotificationIcon(item.type)">
                      {{ getNotificationIcon(item.type) }}
                    </el-icon>
                    <div class="notification-content">
                      <div class="notification-title">{{ item.title }}</div>
                      <div class="notification-time">{{ item.time }}</div>
                    </div>
                  </div>
                </el-dropdown-item>
                <el-dropdown-item divided v-if="notifications.length > 0">
                  <span class="mark-all-read" @click="markAllRead">全部标为已读</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          
          <!-- 模式切换 -->
          <el-switch
            v-model="isDarkMode"
            inline-prompt
            :active-icon="Moon"
            :inactive-icon="Sunny"
            @change="(value) => toggleTheme(value)"
            class="theme-switch"
          />
          
          <!-- 用户信息 -->
          <el-dropdown @command="handleCommand">
            <span class="user-info">
              <el-avatar :size="32" :icon="UserFilled" />
              <span class="user-name">{{ userRealName }}</span>
              <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item disabled>
                  <div class="user-details">
                    <div class="user-role">{{ userRole }}</div>
                    <div class="login-time">登录时长: {{ loginDuration }}</div>
                  </div>
                </el-dropdown-item>
                <el-dropdown-item command="profile">
                  <el-icon><UserFilled /></el-icon>
                  <span>个人中心</span>
                </el-dropdown-item>
                <el-dropdown-item v-if="isAdmin" command="logs">
                  <el-icon><View /></el-icon>
                  <span>日志审计</span>
                </el-dropdown-item>
                <el-dropdown-item command="logout">
                  <el-icon><RefreshLeft /></el-icon>
                  <span>退出登录</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main class="main-content">
        <div class="content-wrapper">
          <!-- 页面加载骨架屏 -->
          <el-skeleton :loading="isLoading" :rows="5" animated>
            <template #template>
              <el-skeleton-item variant="h1" style="width: 50%" />
              <el-skeleton-item variant="p" />
              <el-skeleton-item variant="p" />
              <el-skeleton-item variant="p" />
            </template>
          </el-skeleton>
          <router-view v-show="!isLoading" />
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessageBox, ElNotification } from 'element-plus'
import {
  Reading,
  DataAnalysis,
  User,
  UserFilled,
  DocumentCopy,
  DataLine,
  Setting,
  Fold,
  Expand,
  ArrowDown,
  Moon,
  Sunny,
  Bell,
  Tickets,
  View,
  RefreshLeft,
  Warning,
  CircleCheck,
  InfoFilled
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// 侧边栏折叠状态（带记忆功能）
const isCollapse = ref(localStorage.getItem('sidebarCollapse') === 'true')
// 主题模式
const isDarkMode = ref(localStorage.getItem('theme') === 'dark')
// 页面加载状态
const isLoading = ref(true)
// 登录时间
const loginTime = ref(new Date())
// 登录时长
const loginDuration = ref('00:00')
// 消息通知
const notifications = ref([
  {
    id: 1,
    title: '预约到馆提醒',
    content: '读者张三预约的图书《Vue.js实战》已到馆',
    time: '10分钟前',
    type: 'appointment'
  },
  {
    id: 2,
    title: '逾期催还提醒',
    content: '读者李四借阅的图书《JavaScript权威指南》已逾期3天',
    time: '1小时前',
    type: 'overdue'
  }
])
// 登录时长定时器
let durationTimer = null

// 计算属性
const activeMenu = computed(() => route.path)

const isAdmin = computed(() => {
  return userStore.user && userStore.user.role === 'admin'
})

const userRealName = computed(() => {
  return userStore.user && userStore.user.realName || ''
})

const userRole = computed(() => {
  return userStore.user && userStore.user.role === 'admin' ? '管理员' : '馆员'
})

const notificationCount = computed(() => {
  return notifications.value.length
})

// 方法
const toggleSidebar = () => {
  isCollapse.value = !isCollapse.value
  localStorage.setItem('sidebarCollapse', isCollapse.value)
}

const toggleTheme = (value) => {
  console.log('主题切换触发，值为:', value)
  const html = document.documentElement
  if (value) {
    html.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    html.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
  console.log('主题切换后，html类名:', html.classList)
  console.log('主题切换后，localStorage主题:', localStorage.getItem('theme'))
  ElNotification({
    title: '成功',
    message: `已切换到${value ? '暗黑' : '亮色'}模式`,
    type: 'success',
    duration: 2000
  })
}

const handleCommand = (command) => {
  if (command === 'logout') {
    ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      // 直接清除本地存储中的用户状态
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      router.push('/login')
    }).catch(() => {})
  } else if (command === 'logs') {
    router.push('/logs')
  } else if (command === 'profile') {
    router.push('/profile')
  }
}

const getNotificationIcon = (type) => {
  switch (type) {
    case 'appointment':
      return 'Tickets'
    case 'overdue':
      return 'Warning'
    default:
      return 'InfoFilled'
  }
}

const markAllRead = () => {
  notifications.value = []
  ElNotification({
    title: '成功',
    message: '已全部标为已读',
    type: 'success',
    duration: 2000
  })
}

const updateLoginDuration = () => {
  const now = new Date()
  const diff = Math.floor((now - loginTime.value) / 1000)
  const hours = Math.floor(diff / 3600).toString().padStart(2, '0')
  const minutes = Math.floor((diff % 3600) / 60).toString().padStart(2, '0')
  loginDuration.value = `${hours}:${minutes}`
}

// 生命周期
onMounted(() => {
  // 恢复主题
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
  }
  
  // 启动登录时长计时器
  updateLoginDuration()
  durationTimer = setInterval(updateLoginDuration, 60000)
  
  // 模拟页面加载
  setTimeout(() => {
    isLoading.value = false
  }, 500)
})

onUnmounted(() => {
  if (durationTimer) {
    clearInterval(durationTimer)
  }
})
</script>

<style scoped>
.main-layout {
  height: 100vh;
  transition: all 0.3s ease;
}

.sidebar {
  background-color: #304156;
  overflow-x: hidden;
  transition: all 0.3s ease;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  border-bottom: 1px solid #1f2d3d;
  transition: all 0.3s ease;
  position: relative;
}

.logo .el-icon {
  margin-right: 8px;
  font-size: 24px;
}

.logo .version {
  position: absolute;
  right: 16px;
  font-size: 12px;
  font-weight: normal;
  color: #bfcbd9;
}

/* 菜单分组样式 */
.menu-group-title {
  font-size: 12px;
  font-weight: normal;
  color: #8391a5;
  text-align: center;
  padding: 8px 0;
}

.header {
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  transition: all 0.3s ease;
  height: 60px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.toggle-icon {
  font-size: 20px;
  cursor: pointer;
  color: #606266;
  transition: color 0.3s ease;
}

.toggle-icon:hover {
  color: #409eff;
}

.breadcrumb {
  font-size: 14px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* 消息通知样式 */
.notification {
  position: relative;
}

.notification .el-button {
  --el-button-bg-color: transparent;
  --el-button-border-color: transparent;
  --el-button-text-color: #606266;
  transition: all 0.3s ease;
}

.notification .el-button:hover {
  --el-button-bg-color: #ecf5ff;
  --el-button-text-color: #409eff;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 8px 0;
}

.notification-item .el-icon {
  font-size: 16px;
  margin-top: 2px;
}

.notification-content {
  flex: 1;
}

.notification-title {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 4px;
}

.notification-time {
  font-size: 12px;
  color: #909399;
}

.no-notification {
  text-align: center;
  color: #909399;
  font-size: 14px;
  padding: 16px 0;
}

.mark-all-read {
  color: #409eff;
  cursor: pointer;
  font-size: 14px;
  text-align: center;
  width: 100%;
  display: block;
}

.mark-all-read:hover {
  text-decoration: underline;
}

.theme-switch {
  margin-right: 8px;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.user-info:hover {
  background-color: #ecf5ff;
}

.user-name {
  margin: 0 8px;
  font-size: 14px;
  color: #303133;
}

.user-details {
  padding: 8px 16px;
}

.user-role {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 4px;
}

.login-time {
  font-size: 12px;
  color: #909399;
}

.main-content {
  background-color: #f5f7fa;
  padding: 20px;
  overflow-y: auto;
  transition: all 0.3s ease;
}

.content-wrapper {
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
}

/* 响应式设计 */
@media screen and (min-width: 1920px) {
  .content-wrapper {
    max-width: 1800px;
  }
  
  .main-content {
    padding: 30px;
  }
  
  .header {
    padding: 0 30px;
  }
}

/* 移动设备响应式设计 */
@media screen and (max-width: 768px) {
  .header {
    padding: 0 12px;
  }
  
  .header-left {
    gap: 12px;
  }
  
  .breadcrumb {
    display: none;
  }
  
  .header-right {
    gap: 8px;
  }
  
  .user-name {
    display: none;
  }
  
  .main-content {
    padding: 12px;
  }
  
  .content-wrapper {
    max-width: 100%;
  }
  
  .logo span {
    display: none;
  }
  
  .logo .version {
    display: none;
  }
  
  .el-aside {
    width: 64px !important;
  }
  
  .el-menu {
    width: 64px;
  }
  
  .el-menu-item-group__title {
    display: none;
  }
  
  .el-menu-item {
    justify-content: center;
  }
  
  .el-menu-item span {
    display: none;
  }
}

/* 平板设备响应式设计 */
@media screen and (min-width: 769px) and (max-width: 1024px) {
  .content-wrapper {
    max-width: 100%;
  }
  
  .main-content {
    padding: 16px;
  }
  
  .header {
    padding: 0 16px;
  }
  
  .logo span {
    font-size: 16px;
  }
  
  .el-aside {
    width: 180px !important;
  }
  
  .el-menu {
    width: 180px;
  }
}

/* 暗黑模式 */
html.dark .header {
  background-color: #1f2d3d;
  border-bottom: 1px solid #304156;
  color: #bfcbd9;
}

html.dark .toggle-icon {
  color: #bfcbd9;
}

html.dark .toggle-icon:hover {
  color: #409eff;
}

html.dark .main-content {
  background-color: #1d1d1d;
  color: #bfcbd9;
}

html.dark .el-breadcrumb__inner {
  color: #bfcbd9 !important;
}

html.dark .el-breadcrumb__separator {
  color: #4e6a8a !important;
}

html.dark .el-card {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
  color: #bfcbd9;
  border-radius: 8px;
}

html.dark .el-card__header {
  background-color: #2d2d2d;
  border-bottom: 1px solid #3d3d3d;
  border-radius: 8px 8px 0 0;
}

html.dark .el-table {
  background-color: #2d2d2d;
  color: #bfcbd9;
  border-radius: 8px;
}

html.dark .el-table th {
  background-color: #2d2d2d !important;
  color: #bfcbd9 !important;
  border-bottom: 1px solid #3d3d3d !important;
}

html.dark .el-table td {
  background-color: #2d2d2d !important;
  color: #bfcbd9 !important;
  border-bottom: 1px solid #3d3d3d !important;
}

html.dark .el-table__empty-text {
  color: #bfcbd9 !important;
}

html.dark .el-input__wrapper {
  background-color: #2d2d2d !important;
  border-color: #3d3d3d !important;
  border-radius: 4px;
}

html.dark .el-input__inner {
  color: #bfcbd9 !important;
}

html.dark .el-button {
  --el-button-text-color: #bfcbd9;
  --el-button-bg-color: #3d3d3d;
  --el-button-border-color: #4d4d4d;
  border-radius: 4px;
}

html.dark .el-button--primary {
  --el-button-bg-color: #409eff;
  --el-button-border-color: #409eff;
}

html.dark .el-dialog {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
  color: #bfcbd9;
  border-radius: 8px;
}

html.dark .el-dialog__header {
  border-bottom: 1px solid #3d3d3d;
}

html.dark .el-dialog__title {
  color: #bfcbd9;
}

html.dark .user-info {
  color: #bfcbd9;
}

html.dark .user-info:hover {
  background-color: #2d3748;
}

html.dark .user-name {
  color: #bfcbd9;
}

html.dark .user-role {
  color: #bfcbd9;
}

html.dark .login-time {
  color: #8391a5;
}

html.dark .notification-item .el-icon {
  color: #bfcbd9;
}

html.dark .notification-title {
  color: #bfcbd9;
}

html.dark .notification-time {
  color: #8391a5;
}

html.dark .no-notification {
  color: #8391a5;
}

html.dark .mark-all-read {
  color: #409eff;
}

html.dark .notification .el-button {
  --el-button-text-color: #bfcbd9;
}

html.dark .notification .el-button:hover {
  --el-button-bg-color: #2d3748;
  --el-button-text-color: #409eff;
}

/* 通用div盒子暗黑模式样式 */
html.dark div {
  color: #bfcbd9;
}

/* 通用容器类 */
html.dark .container,
html.dark .wrapper,
html.dark .box,
html.dark .card,
html.dark .panel,
html.dark .section,
html.dark .area {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
  color: #bfcbd9;
}

/* 表单容器 */
html.dark .form-container,
html.dark .form-wrapper {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
  color: #bfcbd9;
}

/* 搜索容器 */
html.dark .search-container,
html.dark .search-wrapper {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
  color: #bfcbd9;
}

/* 表格容器 */
html.dark .table-container,
html.dark .table-wrapper {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
  color: #bfcbd9;
}

/* 统计容器 */
html.dark .stat-container,
html.dark .stat-wrapper,
html.dark .stat-box {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
  color: #bfcbd9;
}

/* 信息容器 */
html.dark .info-container,
html.dark .info-wrapper,
html.dark .info-box {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
  color: #bfcbd9;
}

/* 数据容器 */
html.dark .data-container,
html.dark .data-wrapper,
html.dark .data-box {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
  color: #bfcbd9;
}

/* 结果容器 */
html.dark .result-container,
html.dark .result-wrapper,
html.dark .result-box {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
  color: #bfcbd9;
}

/* 上传容器 */
html.dark .upload-container,
html.dark .upload-wrapper {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
  color: #bfcbd9;
}

/* 预览容器 */
html.dark .preview-container,
html.dark .preview-wrapper {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
  color: #bfcbd9;
}

/* 编辑容器 */
html.dark .edit-container,
html.dark .edit-wrapper {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
  color: #bfcbd9;
}

/* 详情容器 */
html.dark .detail-container,
html.dark .detail-wrapper {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
  color: #bfcbd9;
}

/* 列表容器 */
html.dark .list-container,
html.dark .list-wrapper {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
  color: #bfcbd9;
}

/* 卡片容器 */
html.dark .card-container,
html.dark .card-wrapper {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
  color: #bfcbd9;
}

/* 模态框容器 */
html.dark .modal-container,
html.dark .modal-wrapper {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
  color: #bfcbd9;
}

/* 抽屉容器 */
html.dark .drawer-container,
html.dark .drawer-wrapper {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
  color: #bfcbd9;
}

/* 步骤容器 */
html.dark .steps-container,
html.dark .steps-wrapper {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
  color: #bfcbd9;
}

/* 标签页容器 */
html.dark .tabs-container,
html.dark .tabs-wrapper {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
  color: #bfcbd9;
}

/* 导航容器 */
html.dark .nav-container,
html.dark .nav-wrapper {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
  color: #bfcbd9;
}

/* 分页容器 */
html.dark .pagination-container,
html.dark .pagination-wrapper {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
  color: #bfcbd9;
}

/* 加载容器 */
html.dark .loading-container,
html.dark .loading-wrapper {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
  color: #bfcbd9;
}

/* 错误容器 */
html.dark .error-container,
html.dark .error-wrapper {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
  color: #bfcbd9;
}

/* 成功容器 */
html.dark .success-container,
html.dark .success-wrapper {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
  color: #bfcbd9;
}

/* 警告容器 */
html.dark .warning-container,
html.dark .warning-wrapper {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
  color: #bfcbd9;
}

/* 信息容器 */
html.dark .info-container,
html.dark .info-wrapper {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
  color: #bfcbd9;
}

/* 确认容器 */
html.dark .confirm-container,
html.dark .confirm-wrapper {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
  color: #bfcbd9;
}

/* 提示容器 */
html.dark .tip-container,
html.dark .tip-wrapper {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
  color: #bfcbd9;
}

/* 帮助容器 */
html.dark .help-container,
html.dark .help-wrapper {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
  color: #bfcbd9;
}

/* 关于容器 */
html.dark .about-container,
html.dark .about-wrapper {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
  color: #bfcbd9;
}

/* 设置容器 */
html.dark .settings-container,
html.dark .settings-wrapper {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
  color: #bfcbd9;
}

/* 个人中心容器 */
html.dark .profile-container,
html.dark .profile-wrapper {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
  color: #bfcbd9;
}

/* 仪表盘容器 */
html.dark .dashboard-container,
html.dark .dashboard-wrapper {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
  color: #bfcbd9;
}

/* 统计报表容器 */
html.dark .statistics-container,
html.dark .statistics-wrapper {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
  color: #bfcbd9;
}

/* 日志容器 */
html.dark .logs-container,
html.dark .logs-wrapper {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
  color: #bfcbd9;
}

/* 用户容器 */
html.dark .users-container,
html.dark .users-wrapper {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
  color: #bfcbd9;
}

/* 图书容器 */
html.dark .books-container,
html.dark .books-wrapper {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
  color: #bfcbd9;
}

/* 借阅容器 */
html.dark .borrow-container,
html.dark .borrow-wrapper {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
  color: #bfcbd9;
}

/* 预约容器 */
html.dark .appointment-container,
html.dark .appointment-wrapper {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
  color: #bfcbd9;
}

/* 读者容器 */
html.dark .readers-container,
html.dark .readers-wrapper {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
  color: #bfcbd9;
}

/* 权限容器 */
html.dark .permission-container,
html.dark .permission-wrapper {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
  color: #bfcbd9;
}

/* 角色容器 */
html.dark .role-container,
html.dark .role-wrapper {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
  color: #bfcbd9;
}

/* 菜单容器 */
html.dark .menu-container,
html.dark .menu-wrapper {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
  color: #bfcbd9;
}

/* 导航容器 */
html.dark .navigation-container,
html.dark .navigation-wrapper {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
  color: #bfcbd9;
}

/* 页脚容器 */
html.dark .footer-container,
html.dark .footer-wrapper {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
  color: #bfcbd9;
}

/* 头部容器 */
html.dark .header-container,
html.dark .header-wrapper {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
  color: #bfcbd9;
}

/* 侧边栏容器 */
html.dark .sidebar-container,
html.dark .sidebar-wrapper {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
  color: #bfcbd9;
}

/* 内容容器 */
html.dark .content-container,
html.dark .content-wrapper {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
  color: #bfcbd9;
}

/* 工具栏容器 */
html.dark .toolbar-container,
html.dark .toolbar-wrapper {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
  color: #bfcbd9;
}

/* 操作栏容器 */
html.dark .actionbar-container,
html.dark .actionbar-wrapper {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
  color: #bfcbd9;
}

/* 按钮栏容器 */
html.dark .buttonbar-container,
html.dark .buttonbar-wrapper {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
  color: #bfcbd9;
}

/* 状态栏容器 */
html.dark .statusbar-container,
html.dark .statusbar-wrapper {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
  color: #bfcbd9;
}

/* 标题栏容器 */
html.dark .titlebar-container,
html.dark .titlebar-wrapper {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
  color: #bfcbd9;
}

/* 副标题栏容器 */
html.dark .subtitlebar-container,
html.dark .subtitlebar-wrapper {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
  color: #bfcbd9;
}

/* 面包屑容器 */
html.dark .breadcrumb-container,
html.dark .breadcrumb-wrapper {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
  color: #bfcbd9;
}

/* 分页栏容器 */
html.dark .paginationbar-container,
html.dark .paginationbar-wrapper {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
  color: #bfcbd9;
}

/* 筛选栏容器 */
html.dark .filterbar-container,
html.dark .filterbar-wrapper {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
  color: #bfcbd9;
}

/* 排序栏容器 */
html.dark .sortbar-container,
html.dark .sortbar-wrapper {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
  color: #bfcbd9;
}

/* 搜索栏容器 */
html.dark .searchbar-container,
html.dark .searchbar-wrapper {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
  color: #bfcbd9;
}

/* 工具栏容器 */
html.dark .toolbar-container,
html.dark .toolbar-wrapper {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
  color: #bfcbd9;
}

/* 操作栏容器 */
html.dark .actionbar-container,
html.dark .actionbar-wrapper {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
  color: #bfcbd9;
}

/* 按钮栏容器 */
html.dark .buttonbar-container,
html.dark .buttonbar-wrapper {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
  color: #bfcbd9;
}

/* 状态栏容器 */
html.dark .statusbar-container,
html.dark .statusbar-wrapper {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
  color: #bfcbd9;
}

/* 标题栏容器 */
html.dark .titlebar-container,
html.dark .titlebar-wrapper {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
  color: #bfcbd9;
}

/* 副标题栏容器 */
html.dark .subtitlebar-container,
html.dark .subtitlebar-wrapper {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
  color: #bfcbd9;
}

/* 面包屑容器 */
html.dark .breadcrumb-container,
html.dark .breadcrumb-wrapper {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
  color: #bfcbd9;
}

/* 分页栏容器 */
html.dark .paginationbar-container,
html.dark .paginationbar-wrapper {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
  color: #bfcbd9;
}

/* 筛选栏容器 */
html.dark .filterbar-container,
html.dark .filterbar-wrapper {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
  color: #bfcbd9;
}

/* 排序栏容器 */
html.dark .sortbar-container,
html.dark .sortbar-wrapper {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
  color: #bfcbd9;
}

/* 搜索栏容器 */
html.dark .searchbar-container,
html.dark .searchbar-wrapper {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
  color: #bfcbd9;
}

/* 通用样式优化 */
.el-menu {
  border-right: none;
}

.el-menu-item {
  margin: 0 16px;
  border-radius: 4px;
  height: 40px;
  line-height: 40px;
}

.el-menu-item.is-active {
  background-color: #1f2d3d !important;
}

.el-menu-item:hover {
  background-color: rgba(255, 255, 255, 0.05) !important;
}

.el-menu-item-group {
  padding: 0;
}

.el-menu-item-group__title {
  padding: 8px 16px;
  font-size: 12px;
  color: #8391a5;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  margin-bottom: 8px;
}
</style>
