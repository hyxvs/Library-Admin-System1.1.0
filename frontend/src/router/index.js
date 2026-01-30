/**
 * 路由配置文件
 * 定义前端应用的所有路由
 */

/**
 * 导入必要的模块
 */
import { createRouter, createWebHistory } from 'vue-router' // 导入路由创建函数
import { useUserStore } from '@/stores/user' // 导入用户状态管理

/**
 * 定义路由配置
 * 包含所有页面的路由信息
 */
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'), // 登录页面
    meta: { requiresAuth: false } // 不需要认证
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue'), // 注册页面
    meta: { requiresAuth: false } // 不需要认证
  },
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'), // 主布局组件
    meta: { requiresAuth: true }, // 需要认证
    children: [
      {
        path: '',
        redirect: '/dashboard' // 默认重定向到首页
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'), // 首页
        meta: { title: '首页' }
      },
      {
        path: 'books',
        name: 'Books',
        component: () => import('@/views/Books.vue'), // 图书管理
        meta: { title: '图书管理' }
      },
      {
        path: 'readers',
        name: 'Readers',
        component: () => import('@/views/Readers.vue'), // 读者管理
        meta: { title: '读者管理' }
      },
      {
        path: 'borrow',
        name: 'Borrow',
        component: () => import('@/views/Borrow.vue'), // 借阅管理
        meta: { title: '借阅管理' }
      },
      {
        path: 'appointment',
        name: 'Appointment',
        component: () => import('@/views/Appointment.vue'), // 预约管理
        meta: { title: '预约管理' }
      },
      {
        path: 'statistics',
        name: 'Statistics',
        component: () => import('@/views/Statistics.vue'), // 统计报表
        meta: { title: '统计报表' }
      },
      {
        path: 'users',
        name: 'Users',
        component: () => import('@/views/Users.vue'), // 用户管理
        meta: { title: '用户管理', requiresAdmin: true } // 需要管理员权限
      },
      {
        path: 'logs',
        name: 'Logs',
        component: () => import('@/views/Logs.vue'), // 日志审计
        meta: { title: '日志审计', requiresAdmin: true } // 需要管理员权限
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/Profile.vue'), // 个人中心
        meta: { title: '个人中心' }
      }
    ]
  }
]

/**
 * 创建路由实例
 */
const router = createRouter({
  history: createWebHistory(), // 使用 HTML5 历史模式
  routes // 使用定义的路由配置
})

/**
 * 路由守卫
 * 用于权限控制和导航管理
 */
router.beforeEach((to, from, next) => {
  const userStore = useUserStore() // 获取用户状态
  const token = userStore.token // 获取 token

  // 检查是否需要认证
  if (to.meta.requiresAuth) {
    // 如果没有 token，重定向到登录页面
    if (!token) {
      next('/login')
    } else if (to.meta.requiresAdmin && userStore.user && userStore.user.role !== 'admin') {
      // 如果需要管理员权限但用户不是管理员，重定向到首页
      next('/dashboard')
    } else {
      // 有权限，继续导航
      next()
    }
  } else {
    // 不需要认证的页面
    if (to.path === '/login' && token) {
      // 如果已经登录，重定向到首页
      next('/dashboard')
    } else {
      // 继续导航
      next()
    }
  }
})

/**
 * 导出路由实例
 * 供main.js使用
 */
export default router
