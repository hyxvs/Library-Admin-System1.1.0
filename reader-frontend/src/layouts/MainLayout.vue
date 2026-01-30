<template>
  <el-container class="main-layout">
    <el-aside :width="isCollapse ? '64px' : '200px'" class="sidebar">
      <div class="logo">
        <el-icon><Reading /></el-icon>
        <span v-if="!isCollapse">图书馆读者系统</span>
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
        <!-- 主要功能组 -->
        <el-menu-item-group>
          <template #title>
            <span class="menu-group-title">主要功能</span>
          </template>
          <el-menu-item index="/">
            <el-icon><House /></el-icon>
            <span>首页</span>
          </el-menu-item>
          <el-menu-item index="/book/search">
            <el-icon><Search /></el-icon>
            <span>图书查询</span>
          </el-menu-item>
        </el-menu-item-group>
        
        <!-- 个人中心组 -->
        <el-menu-item-group>
          <template #title>
            <span class="menu-group-title">个人中心</span>
          </template>
          <el-menu-item index="/reservation/list">
            <el-icon><Calendar /></el-icon>
            <span>我的预约</span>
          </el-menu-item>
          <el-menu-item index="/borrow/list">
            <el-icon><Reading /></el-icon>
            <span>我的借阅</span>
          </el-menu-item>
          <el-menu-item index="/user/profile">
            <el-icon><User /></el-icon>
            <span>个人资料</span>
          </el-menu-item>
          <el-menu-item index="/announcement">
            <el-icon><Bell /></el-icon>
            <span>系统公告</span>
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
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-if="$route.meta.title">{{ $route.meta.title }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
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
              <span class="user-name">{{ userStore.user && userStore.user.name ? userStore.user.name : '游客' }}</span>
              <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item disabled>
                  <div class="user-details">
                    <div class="user-role">{{ userStore.user ? '读者' : '游客' }}</div>
                    <div class="login-time">登录时长: {{ loginDuration }}</div>
                  </div>
                </el-dropdown-item>
                <el-dropdown-item command="profile">
                  <el-icon><UserFilled /></el-icon>
                  <span>个人中心</span>
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
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { House, Search, Calendar, Reading, User, Bell, ArrowDown, Fold, Expand, Moon, Sunny, RefreshLeft, UserFilled } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
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
// 登录时长定时器
let durationTimer = null

// 计算属性
const activeMenu = computed(() => route.path)

// 方法
const toggleSidebar = () => {
  isCollapse.value = !isCollapse.value
  localStorage.setItem('sidebarCollapse', isCollapse.value)
}

const toggleTheme = (value) => {
  const html = document.documentElement
  if (value) {
    html.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    html.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
  ElMessage({
    title: '成功',
    message: `已切换到${value ? '暗黑' : '亮色'}模式`,
    type: 'success',
    duration: 2000
  })
}

const handleCommand = (command) => {
  if (command === 'logout') {
    userStore.logoutUser()
    ElMessage.success('退出登录成功')
    router.push('/login')
  } else if (command === 'profile') {
    router.push('/user/profile')
  }
}

const updateLoginDuration = () => {
  const now = new Date()
  const diff = Math.floor((now - loginTime.value) / 1000)
  const hours = Math.floor(diff / 3600).toString().padStart(2, '0')
  const minutes = Math.floor((diff % 3600) / 60).toString().padStart(2, '0')
  loginDuration.value = `${hours}:${minutes}`
}

// 监听路由变化
watch(
  () => route.path,
  (newPath) => {
    // 路由变化时显示加载状态
    isLoading.value = true
    setTimeout(() => {
      isLoading.value = false
    }, 300)
  }
)

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
