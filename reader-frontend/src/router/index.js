/**
 * 读者前端路由配置文件
 * 定义读者端应用的所有路由
 */

/**
 * 导入必要的模块
 */
import { createRouter, createWebHistory } from 'vue-router' // 导入路由创建函数
import MainLayout from '@/layouts/MainLayout.vue' // 导入主布局组件
import Login from '@/views/Login.vue' // 导入登录组件
import Register from '@/views/Register.vue' // 导入注册组件
import ForgotPassword from '@/views/ForgotPassword.vue' // 导入找回密码组件
import Home from '@/views/Home.vue' // 导入首页组件
import BookSearch from '@/views/BookSearch.vue' // 导入图书查询组件
import BookDetail from '@/views/BookDetail.vue' // 导入图书详情组件
import ReservationList from '@/views/ReservationList.vue' // 导入预约列表组件
import BorrowList from '@/views/BorrowList.vue' // 导入借阅列表组件
import UserProfile from '@/views/UserProfile.vue' // 导入用户个人中心组件
import Announcement from '@/views/Announcement.vue' // 导入系统公告组件
import NotFound from '@/views/NotFound.vue' // 导入404组件
import { useUserStore } from '@/stores/user' // 导入用户状态管理

/**
 * 路由配置
 * 定义应用的所有路由和导航结构
 */
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { title: '登录', requiresAuth: false } // 不需要认证
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { title: '注册', requiresAuth: false } // 不需要认证
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword,
    meta: { title: '找回密码', requiresAuth: false } // 不需要认证
  },
  {
    path: '/',
    component: MainLayout, // 使用主布局
    meta: { title: '首页', requiresAuth: true }, // 需要认证
    children: [
      {
        path: '',
        name: 'Home',
        component: Home,
        meta: { title: '首页', requiresAuth: true } // 需要认证
      },
      {
        path: 'book/search',
        name: 'BookSearch',
        component: BookSearch,
        meta: { title: '图书查询', requiresAuth: true } // 需要认证
      },
      {
        path: 'book/detail/:id',
        name: 'BookDetail',
        component: BookDetail,
        meta: { title: '图书详情', requiresAuth: true } // 需要认证
      },
      {
        path: 'reservation/list',
        name: 'ReservationList',
        component: ReservationList,
        meta: { title: '我的预约', requiresAuth: true } // 需要认证
      },
      {
        path: 'borrow/list',
        name: 'BorrowList',
        component: BorrowList,
        meta: { title: '我的借阅', requiresAuth: true } // 需要认证
      },
      {
        path: 'user/profile',
        name: 'UserProfile',
        component: UserProfile,
        meta: { title: '个人中心', requiresAuth: true } // 需要认证
      },
      {
        path: 'announcement',
        name: 'Announcement',
        component: Announcement,
        meta: { title: '系统公告', requiresAuth: true } // 需要认证
      }
    ]
  },
  // 404页面
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: { title: '404', requiresAuth: false } // 不需要认证
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
 * 用于处理路由导航前的逻辑，如设置页面标题、检查认证状态等
 */
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - 图书馆读者系统` : '图书馆读者系统'
  
  // 检查是否需要认证
  if (to.meta.requiresAuth) {
    const userStore = useUserStore() // 获取用户状态
    if (userStore.isLoggedIn) {
      // 已登录，继续导航
      next()
    } else {
      // 未登录，重定向到登录页
      next({
        path: '/login',
        query: { redirect: to.fullPath } // 记录重定向路径
      })
    }
  } else {
    // 不需要认证，继续导航
    next()
  }
})

/**
 * 导出路由实例
 * 供main.js使用
 */
export default router