# 管理员移动端

图书馆管理系统的管理员移动端应用，专为移动设备优化。

## 功能特性

- 用户登录/登出
- 首页数据统计
- 图书管理（新增、编辑、删除、搜索）
- 读者管理（新增、编辑、删除、搜索）
- 借阅管理（借书、还书、续借、借阅记录）
- 个人中心（个人信息、修改密码）

## 技术栈

- Vue 3
- Vant 4 (移动端UI组件库)
- Vue Router
- Pinia
- Axios

## 安装依赖

```bash
cd admin-mobile
npm install
```

## 开发运行

```bash
npm run dev
```

应用将在 http://localhost:3002 启动

## 构建生产版本

```bash
npm run build
```

## 项目结构

```
admin-mobile/
├── src/
│   ├── api/           # API接口
│   ├── layouts/       # 布局组件
│   ├── router/        # 路由配置
│   ├── stores/        # 状态管理
│   ├── utils/         # 工具函数
│   ├── views/         # 页面组件
│   ├── App.vue        # 根组件
│   └── main.js        # 入口文件
├── index.html         # HTML模板
├── package.json       # 项目配置
└── vite.config.js     # Vite配置
```

## 主要页面

- `/login` - 登录页面
- `/dashboard` - 首页（数据统计）
- `/books` - 图书管理
- `/readers` - 读者管理
- `/borrow` - 借阅管理
- `/profile` - 个人中心
