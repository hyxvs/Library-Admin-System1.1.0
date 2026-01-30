/**
 * 前端应用入口文件
 * 负责初始化和配置Vue应用实例
 */

/**
 * 导入必要的模块
 */
import { createApp } from 'vue' // 导入 createApp 函数，用于创建 Vue 应用实例
import { createPinia } from 'pinia' // 导入 createPinia 函数，用于创建 Pinia 状态管理实例
import ElementPlus from 'element-plus' // 导入 ElementPlus 组件库
import 'element-plus/dist/index.css' // 导入 ElementPlus 样式
import * as ElementPlusIconsVue from '@element-plus/icons-vue' // 导入 ElementPlus 图标
import zhCn from 'element-plus/dist/locale/zh-cn.mjs' // 导入 ElementPlus 中文语言包

/**
 * 导入应用组件和路由
 */
import App from './App.vue' // 导入根组件
import router from './router' // 导入路由实例
import { KeyboardShortcuts } from './utils/keyboard' // 导入快捷键系统
import { validationRules, showMessage, showConfirm, showNotify } from './utils/validation' // 导入验证规则和消息提示

/**
 * 创建应用实例
 */
const app = createApp(App)

/**
 * 创建 Pinia 实例
 * 用于状态管理
 */
const pinia = createPinia()

/**
 * 初始化快捷键系统
 * 用于全局快捷键管理
 */
const keyboardShortcuts = new KeyboardShortcuts()

/**
 * 注册全局属性
 * 使这些属性在所有组件中可用
 */
app.config.globalProperties.$keyboard = keyboardShortcuts // 快捷键系统
app.config.globalProperties.$rules = validationRules // 验证规则
app.config.globalProperties.$message = showMessage // 消息提示
app.config.globalProperties.$confirm = showConfirm // 确认对话框
app.config.globalProperties.$notify = showNotify // 通知提示

/**
 * 注册 ElementPlus 图标
 * 使所有图标组件在全局可用
 */
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

/**
 * 使用插件
 * 配置应用的核心功能
 */
app.use(pinia) // 使用 Pinia 状态管理
app.use(router) // 使用路由
app.use(ElementPlus, {
  locale: zhCn, // 使用中文语言包
  dark: localStorage.getItem('theme') === 'dark' // 根据本地存储设置暗黑模式
})

/**
 * 挂载应用
 * 将应用实例挂载到DOM元素上
 */
app.mount('#app')
