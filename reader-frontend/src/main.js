/**
 * 读者前端应用入口文件
 * 负责初始化和配置Vue应用实例
 */

/**
 * 导入必要的模块
 */
import { createApp } from 'vue' // 导入 Vue 的 createApp 函数
import { createPinia } from 'pinia' // 导入 Pinia 的 createPinia 函数
import ElementPlus from 'element-plus' // 导入 ElementPlus 组件库
import 'element-plus/dist/index.css' // 导入 ElementPlus 的样式
import router from './router' // 导入路由配置
import App from './App.vue' // 导入根组件

/**
 * 创建 Vue 应用实例
 */
const app = createApp(App)

/**
 * 使用插件
 * 配置应用的核心功能
 */
app.use(createPinia()) // 使用 Pinia 状态管理
app.use(router) // 使用路由
app.use(ElementPlus) // 使用 ElementPlus 组件库

/**
 * 挂载应用到 DOM
 * 将应用实例挂载到 id 为 app 的元素上
 */
app.mount('#app')
