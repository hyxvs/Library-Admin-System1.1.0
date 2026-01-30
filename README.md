# 图书馆管理系统 v1.1.0

## 项目简介

图书馆管理系统是一个现代化的、功能完善的图书馆管理解决方案，采用前后端分离架构设计，旨在提高图书馆管理效率，优化读者服务体验。系统提供了全面的图书管理、读者管理、借阅管理、预约管理和统计报表等功能，支持多设备访问，具有良好的用户界面和用户体验。

### 系统目标

- 实现图书馆业务的数字化管理，提高工作效率
- 提供便捷的读者服务，提升读者满意度
- 实现数据的实时统计和分析，为决策提供支持
- 构建安全、稳定、可扩展的系统架构

### 系统价值

- 减少人工操作，降低管理成本
- 提高图书利用率和借阅效率
- 规范图书馆业务流程，提升管理水平
- 为读者提供更加便捷的服务体验

## 功能特性

### 前端功能

#### 1. 用户认证与权限管理
- 用户登录与登出
- 用户注册
- 角色权限控制（管理员/馆员）
- 个人信息管理
- 密码修改

#### 2. 图书管理
- 图书列表展示（支持分页、排序、筛选）
- 图书详情查看
- 新增图书
- 编辑图书信息
- 删除图书
- 批量导入图书（支持Excel文件）
- 扫码录入图书（支持ISBN扫码）
- 图书分类管理

#### 3. 读者管理
- 读者列表展示（支持分页、排序、筛选）
- 读者详情查看
- 新增读者
- 编辑读者信息
- 删除读者
- 信用状态管理（正常、逾期、欠费）
- 读者证管理

#### 4. 借阅管理
- 借书操作
- 还书操作
- 续借操作
- 借阅记录查询
- 逾期记录管理
- 罚款管理

#### 5. 预约管理
- 预约创建
- 预约列表查询
- 预约状态管理（待处理、已完成、已取消）
- 预约提醒发送
- 预约取消

#### 6. 统计报表
- 仪表盘数据展示
- 热门图书排行
- 分类借阅统计
- 读者借阅排行
- 借阅趋势分析
- 数据可视化图表
- 借阅记录导出（Excel格式）

#### 7. 日志审计
- 操作记录查询
- 日志筛选与排序
- 操作人、操作时间、操作类型记录

#### 8. 用户体验优化
- 响应式设计（支持PC、平板、移动设备）
- 暗黑模式支持
- 全局快捷键支持
- 表单验证
- 加载动画
- 消息通知
- 面包屑导航

### 后端功能

#### 1. API设计
- RESTful API设计规范
- 统一的响应格式
- API版本控制

#### 2. 认证与授权
- JWT身份认证
- 基于角色的权限控制
- 密码加密存储

#### 3. 数据库操作
- MySQL数据库连接
- 数据库事务处理
- SQL查询优化
- 数据库索引设计

#### 4. 日志管理
- 操作日志记录
- 错误日志记录
- 日志文件轮转

#### 5. 数据处理
- Excel数据导出
- 数据验证
- 数据转换

#### 6. 中间件
- 认证中间件
- 错误处理中间件
- 日志中间件
- CORS中间件

#### 7. 性能优化
- 连接池管理
- 缓存机制
- 异步处理

#### 8. 安全措施
- 参数验证
- SQL注入防护
- XSS防护
- CSRF防护

## 技术栈

### 前端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue 3 | 3.4.21 | 前端框架，用于构建用户界面 |
| Vue Router | 4.3.0 | 路由管理，实现页面跳转 |
| Pinia | 2.1.7 | 状态管理，管理全局状态 |
| Element Plus | 2.13.1 | UI组件库，提供丰富的界面组件 |
| ECharts | 5.5.0 | 数据可视化库，用于绘制图表 |
| Axios | 1.6.7 | HTTP客户端，用于发送API请求 |
| Vite | 5.4.21 | 构建工具，用于开发和构建项目 |
| dayjs | 1.11.10 | 日期处理库，用于日期格式化和计算 |
| lodash-es | 4.17.21 | 工具库，提供常用的工具函数 |

### 后端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Node.js | 16.0+ | JavaScript运行环境 |
| Express | 4.18.2 | Web框架，用于构建RESTful API |
| MySQL | 8.0 | 关系型数据库，用于存储数据 |
| JWT | 9.0.2 | JSON Web Token，用于身份认证 |
| bcryptjs | 2.4.3 | 密码加密库，用于安全存储密码 |
| exceljs | 4.4.0 | Excel处理库，用于数据导出 |
| Winston | 3.11.0 | 日志库，用于记录系统日志 |
| express-validator | 7.0.1 | 表单验证库，用于验证请求参数 |
| dotenv | 16.3.1 | 环境变量管理库，用于配置管理 |
| cors | 2.8.5 | CORS中间件，用于处理跨域请求 |

### 开发工具

| 工具 | 用途 |
|------|------|
| Visual Studio Code | 代码编辑器 |
| Git | 版本控制工具 |
| Postman | API测试工具 |
| MySQL Workbench | 数据库管理工具 |

## 数据库设计

### 核心表结构

#### 1. 用户表（users）

| 字段名 | 数据类型 | 约束 | 描述 |
|-------|---------|------|------|
| `id` | `INT` | `PRIMARY KEY AUTO_INCREMENT` | 用户ID |
| `username` | `VARCHAR(50)` | `UNIQUE NOT NULL` | 用户名 |
| `password` | `VARCHAR(100)` | `NOT NULL` | 密码（加密存储） |
| `role` | `VARCHAR(20)` | `NOT NULL` | 角色（admin/librarian） |
| `real_name` | `VARCHAR(50)` | `NOT NULL` | 真实姓名 |
| `phone` | `VARCHAR(20)` | | 联系电话 |
| `status` | `TINYINT` | `NOT NULL DEFAULT 1` | 状态（1-启用，0-禁用） |
| `created_at` | `DATETIME` | `NOT NULL DEFAULT CURRENT_TIMESTAMP` | 创建时间 |
| `updated_at` | `DATETIME` | `NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP` | 更新时间 |

#### 2. 读者表（readers）

| 字段名 | 数据类型 | 约束 | 描述 |
|-------|---------|------|------|
| `id` | `INT` | `PRIMARY KEY AUTO_INCREMENT` | 读者ID |
| `reader_no` | `VARCHAR(30)` | `UNIQUE NOT NULL` | 读者证号 |
| `name` | `VARCHAR(50)` | `NOT NULL` | 姓名 |
| `gender` | `VARCHAR(10)` | | 性别 |
| `birthdate` | `DATE` | | 出生日期 |
| `id_card` | `VARCHAR(20)` | `UNIQUE` | 身份证号 |
| `phone` | `VARCHAR(20)` | | 联系电话 |
| `email` | `VARCHAR(100)` | | 邮箱 |
| `address` | `VARCHAR(200)` | | 地址 |
| `credit_status` | `VARCHAR(20)` | `NOT NULL DEFAULT 'normal'` | 信用状态（normal/overdue/debt） |
| `debt` | `DECIMAL(10,2)` | `NOT NULL DEFAULT 0` | 欠费金额 |
| `created_at` | `DATETIME` | `NOT NULL DEFAULT CURRENT_TIMESTAMP` | 创建时间 |
| `updated_at` | `DATETIME` | `NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP` | 更新时间 |

#### 3. 图书分类表（categories）

| 字段名 | 数据类型 | 约束 | 描述 |
|-------|---------|------|------|
| `id` | `INT` | `PRIMARY KEY AUTO_INCREMENT` | 分类ID |
| `name` | `VARCHAR(50)` | `UNIQUE NOT NULL` | 分类名称 |
| `description` | `VARCHAR(200)` | | 分类描述 |
| `created_at` | `DATETIME` | `NOT NULL DEFAULT CURRENT_TIMESTAMP` | 创建时间 |
| `updated_at` | `DATETIME` | `NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP` | 更新时间 |

#### 4. 图书表（books）

| 字段名 | 数据类型 | 约束 | 描述 |
|-------|---------|------|------|
| `id` | `INT` | `PRIMARY KEY AUTO_INCREMENT` | 图书ID |
| `isbn` | `VARCHAR(20)` | `UNIQUE` | ISBN号 |
| `title` | `VARCHAR(100)` | `NOT NULL` | 书名 |
| `author` | `VARCHAR(100)` | `NOT NULL` | 作者 |
| `publisher` | `VARCHAR(100)` | | 出版社 |
| `publish_date` | `DATE` | | 出版日期 |
| `category_id` | `INT` | `REFERENCES categories(id)` | 分类ID |
| `price` | `DECIMAL(10,2)` | | 价格 |
| `total_count` | `INT` | `NOT NULL DEFAULT 0` | 总数量 |
| `available_count` | `INT` | `NOT NULL DEFAULT 0` | 可借数量 |
| `location` | `VARCHAR(100)` | | 馆藏位置 |
| `description` | `TEXT` | | 图书描述 |
| `cover_url` | `VARCHAR(200)` | | 封面图片URL |
| `created_at` | `DATETIME` | `NOT NULL DEFAULT CURRENT_TIMESTAMP` | 创建时间 |
| `updated_at` | `DATETIME` | `NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP` | 更新时间 |

#### 5. 借阅记录表（borrow_records）

| 字段名 | 数据类型 | 约束 | 描述 |
|-------|---------|------|------|
| `id` | `INT` | `PRIMARY KEY AUTO_INCREMENT` | 借阅记录ID |
| `book_id` | `INT` | `REFERENCES books(id)` | 图书ID |
| `reader_id` | `INT` | `REFERENCES readers(id)` | 读者ID |
| `borrow_date` | `DATETIME` | `NOT NULL DEFAULT CURRENT_TIMESTAMP` | 借阅日期 |
| `due_date` | `DATETIME` | `NOT NULL` | 应还日期 |
| `return_date` | `DATETIME` | | 实际还书日期 |
| `status` | `VARCHAR(20)` | `NOT NULL DEFAULT 'borrowed'` | 状态（borrowed/returned/overdue） |
| `fine` | `DECIMAL(10,2)` | `NOT NULL DEFAULT 0` | 罚款金额 |
| `fine_paid` | `TINYINT` | `NOT NULL DEFAULT 0` | 罚款是否已支付（0-未支付，1-已支付） |
| `operator_id` | `INT` | `REFERENCES users(id)` | 操作员ID |
| `created_at` | `DATETIME` | `NOT NULL DEFAULT CURRENT_TIMESTAMP` | 创建时间 |
| `updated_at` | `DATETIME` | `NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP` | 更新时间 |

#### 6. 预约记录表（appointments）

| 字段名 | 数据类型 | 约束 | 描述 |
|-------|---------|------|------|
| `id` | `INT` | `PRIMARY KEY AUTO_INCREMENT` | 预约记录ID |
| `book_id` | `INT` | `REFERENCES books(id)` | 图书ID |
| `reader_id` | `INT` | `REFERENCES readers(id)` | 读者ID |
| `appointment_date` | `DATETIME` | `NOT NULL DEFAULT CURRENT_TIMESTAMP` | 预约日期 |
| `expire_date` | `DATETIME` | `NOT NULL` | 预约过期日期 |
| `status` | `VARCHAR(20)` | `NOT NULL DEFAULT 'pending'` | 状态（pending/completed/cancelled） |
| `operator_id` | `INT` | `REFERENCES users(id)` | 操作员ID |
| `created_at` | `DATETIME` | `NOT NULL DEFAULT CURRENT_TIMESTAMP` | 创建时间 |
| `updated_at` | `DATETIME` | `NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP` | 更新时间 |

#### 7. 操作日志表（operation_logs）

| 字段名 | 数据类型 | 约束 | 描述 |
|-------|---------|------|------|
| `id` | `INT` | `PRIMARY KEY AUTO_INCREMENT` | 日志ID |
| `user_id` | `INT` | `REFERENCES users(id)` | 操作用户ID |
| `username` | `VARCHAR(50)` | `NOT NULL` | 操作用户名 |
| `module` | `VARCHAR(50)` | `NOT NULL` | 操作模块 |
| `action` | `VARCHAR(50)` | `NOT NULL` | 操作类型 |
| `description` | `VARCHAR(200)` | `NOT NULL` | 操作描述 |
| `ip_address` | `VARCHAR(50)` | | 操作IP地址 |
| `created_at` | `DATETIME` | `NOT NULL DEFAULT CURRENT_TIMESTAMP` | 操作时间 |

### 表关系

- **users** 与 **borrow_records**：一对多（一个用户可以处理多条借阅记录）
- **users** 与 **appointments**：一对多（一个用户可以处理多条预约记录）
- **users** 与 **operation_logs**：一对多（一个用户可以产生多条操作日志）
- **readers** 与 **borrow_records**：一对多（一个读者可以有多条借阅记录）
- **readers** 与 **appointments**：一对多（一个读者可以有多条预约记录）
- **categories** 与 **books**：一对多（一个分类可以包含多本图书）
- **books** 与 **borrow_records**：一对多（一本图书可以有多条借阅记录）
- **books** 与 **appointments**：一对多（一本图书可以有多条预约记录）

### 关键字段说明

#### 1. 读者信用状态
- `normal`：正常状态，无逾期或欠费
- `overdue`：逾期状态，有未归还的逾期图书
- `debt`：欠费状态，有未支付的罚款

#### 2. 借阅状态
- `borrowed`：借阅中，图书已借出但未归还
- `returned`：已归还，图书已正常归还
- `overdue`：已逾期，图书已超过应还日期但未归还

#### 3. 预约状态
- `pending`：待处理，预约已创建但未处理
- `completed`：已完成，预约已处理（图书已借出）
- `cancelled`：已取消，预约已取消

## 安装部署

### 环境要求

| 软件 | 版本要求 | 用途 |
|------|---------|------|
| Node.js | >= 16.0 | 运行后端服务和前端构建 |
| MySQL | >= 8.0 | 数据存储 |
| npm | >= 8.0 | 包管理工具 |
| Git | 最新版 | 版本控制（可选） |

### 系统要求

- **操作系统**：Windows 10+ / Linux / macOS
- **内存**：至少 4GB RAM
- **存储空间**：至少 5GB 可用空间
- **网络**：稳定的网络连接

### 数据库初始化

1. **创建数据库**
   ```bash
   mysql -u root -p
   CREATE DATABASE library_management_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   EXIT;
   ```

2. **导入初始化脚本**
   ```bash
   mysql -u root -p library_management_system < database/init.sql
   ```

3. **导入测试数据（可选）**
   ```bash
   mysql -u root -p library_management_system < database/add_more_data.sql
   ```

### 后端部署

#### 1. 安装依赖
```bash
cd backend
npm install
```

#### 2. 配置环境变量
```bash
cp .env.example .env
```

编辑 `.env` 文件，配置以下信息：

```env
# 服务器配置
PORT=3000
NODE_ENV=development

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=library_management_system

# JWT配置
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h

# 日志配置
LOG_LEVEL=info
```

#### 3. 启动服务

**开发模式**：
```bash
npm run dev
```

**生产模式**：
```bash
npm start
```

### 前端部署

#### 1. 安装依赖
```bash
cd frontend
npm install
```

#### 2. 配置API地址

编辑 `frontend/src/utils/request.js` 文件，配置后端API地址：

```javascript
const service = axios.create({
  baseURL: 'http://localhost:3000/api', // 后端API地址
  timeout: 10000
})
```

#### 3. 启动开发服务器
```bash
npm run dev
```

#### 4. 构建生产版本
```bash
npm run build
```

构建完成后，会在 `frontend/dist` 目录生成生产版本的静态文件，可以部署到任何静态文件服务器。

### 读者前端部署

系统还包含一个读者前端，用于读者自助服务：

#### 1. 安装依赖
```bash
cd reader-frontend
npm install
```

#### 2. 配置API地址

编辑 `reader-frontend/src/utils/request.js` 文件，配置后端API地址：

```javascript
const service = axios.create({
  baseURL: 'http://localhost:3000/api', // 后端API地址
  timeout: 10000
})
```

#### 3. 启动开发服务器
```bash
npm run dev
```

#### 4. 构建生产版本
```bash
npm run build
```

### 生产环境部署建议

#### 1. 使用PM2管理后端服务

```bash
# 安装PM2
npm install -g pm2

# 启动后端服务
cd backend
npm run build
npm prune --production
npm run start-pm2

# 查看服务状态
npm run status

# 重启服务
npm run restart

# 停止服务
npm run stop
```

#### 2. 使用Nginx作为反向代理

配置示例：

```nginx
server {
    listen 80;
    server_name library.example.com;

    # 前端静态文件
    location / {
        root /path/to/library/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # 读者前端
    location /reader {
        root /path/to/library/reader-frontend/dist;
        index index.html;
        try_files $uri $uri/ /reader/index.html;
    }

    # 后端API
    location /api {
        proxy_pass http://localhost:3000/api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### 3. 配置HTTPS

建议在生产环境中使用HTTPS协议，可以使用Let's Encrypt免费证书。

#### 4. 数据库优化

- 定期备份数据库
- 配置MySQL慢查询日志
- 优化数据库索引

### 常见部署问题

| 问题 | 原因 | 解决方案 |
|------|------|---------|
| 后端启动失败 | 端口被占用 | 更改 `.env` 文件中的 `PORT` 配置 |
| 数据库连接失败 | 数据库配置错误 | 检查 `.env` 文件中的数据库配置 |
| 前端无法连接后端 | API地址配置错误 | 检查 `request.js` 文件中的 `baseURL` 配置 |
| 404错误 | 路由配置错误 | 检查前端路由配置和后端API路由 |

## API接口文档

### 1. 认证接口

#### 1.1 用户登录
- **请求方式**：POST
- **请求路径**：`/api/auth/login`
- **请求参数**：
  | 参数名 | 类型 | 必填 | 描述 |
  |-------|------|------|------|
  | `username` | `string` | 是 | 用户名 |
  | `password` | `string` | 是 | 密码 |

- **响应格式**：
  ```json
  {
    "code": 200,
    "msg": "登录成功",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": 1,
        "username": "admin",
        "role": "admin",
        "real_name": "管理员"
      }
    }
  }
  ```

#### 1.2 用户登出
- **请求方式**：POST
- **请求路径**：`/api/auth/logout`
- **请求参数**：无
- **响应格式**：
  ```json
  {
    "code": 200,
    "msg": "登出成功",
    "data": null
  }
  ```

### 2. 图书管理接口

#### 2.1 获取图书列表
- **请求方式**：GET
- **请求路径**：`/api/books`
- **请求参数**：
  | 参数名 | 类型 | 必填 | 描述 |
  |-------|------|------|------|
  | `page` | `number` | 否 | 页码，默认1 |
  | `pageSize` | `number` | 否 | 每页数量，默认10 |
  | `title` | `string` | 否 | 书名搜索 |
  | `author` | `string` | 否 | 作者搜索 |
  | `category_id` | `number` | 否 | 分类ID |

- **响应格式**：
  ```json
  {
    "code": 200,
    "msg": "获取图书列表成功",
    "data": {
      "list": [
        {
          "id": 1,
          "isbn": "9787115428028",
          "title": "JavaScript权威指南",
          "author": "David Flanagan",
          "publisher": "人民邮电出版社",
          "category_id": 1,
          "total_count": 5,
          "available_count": 3
        }
      ],
      "total": 100,
      "page": 1,
      "pageSize": 10
    }
  }
  ```

#### 2.2 获取图书详情
- **请求方式**：GET
- **请求路径**：`/api/books/:id`
- **响应格式**：
  ```json
  {
    "code": 200,
    "msg": "获取图书详情成功",
    "data": {
      "id": 1,
      "isbn": "9787115428028",
      "title": "JavaScript权威指南",
      "author": "David Flanagan",
      "publisher": "人民邮电出版社",
      "publish_date": "2017-01-01",
      "category_id": 1,
      "price": 129.00,
      "total_count": 5,
      "available_count": 3,
      "location": "A区1层",
      "description": "JavaScript领域的权威著作"
    }
  }
  ```

#### 2.3 创建图书
- **请求方式**：POST
- **请求路径**：`/api/books`
- **请求参数**：
  | 参数名 | 类型 | 必填 | 描述 |
  |-------|------|------|------|
  | `isbn` | `string` | 否 | ISBN号 |
  | `title` | `string` | 是 | 书名 |
  | `author` | `string` | 是 | 作者 |
  | `publisher` | `string` | 否 | 出版社 |
  | `publish_date` | `string` | 否 | 出版日期 |
  | `category_id` | `number` | 是 | 分类ID |
  | `price` | `number` | 否 | 价格 |
  | `total_count` | `number` | 是 | 总数量 |
  | `location` | `string` | 否 | 馆藏位置 |
  | `description` | `string` | 否 | 图书描述 |

#### 2.4 更新图书
- **请求方式**：PUT
- **请求路径**：`/api/books/:id`
- **请求参数**：同创建图书

#### 2.5 删除图书
- **请求方式**：DELETE
- **请求路径**：`/api/books/:id`

### 3. 读者管理接口

#### 3.1 获取读者列表
- **请求方式**：GET
- **请求路径**：`/api/readers`
- **请求参数**：
  | 参数名 | 类型 | 必填 | 描述 |
  |-------|------|------|------|
  | `page` | `number` | 否 | 页码，默认1 |
  | `pageSize` | `number` | 否 | 每页数量，默认10 |
  | `name` | `string` | 否 | 姓名搜索 |
  | `reader_no` | `string` | 否 | 读者证号搜索 |
  | `credit_status` | `string` | 否 | 信用状态搜索 |

- **响应格式**：
  ```json
  {
    "code": 200,
    "msg": "获取读者列表成功",
    "data": {
      "list": [
        {
          "id": 1,
          "reader_no": "RD20230001",
          "name": "张三",
          "gender": "男",
          "phone": "13800138000",
          "credit_status": "normal",
          "debt": 0
        }
      ],
      "total": 50,
      "page": 1,
      "pageSize": 10
    }
  }
  ```

#### 3.2 创建读者
- **请求方式**：POST
- **请求路径**：`/api/readers`
- **请求参数**：
  | 参数名 | 类型 | 必填 | 描述 |
  |-------|------|------|------|
  | `reader_no` | `string` | 是 | 读者证号 |
  | `name` | `string` | 是 | 姓名 |
  | `gender` | `string` | 否 | 性别 |
  | `birthdate` | `string` | 否 | 出生日期 |
  | `id_card` | `string` | 否 | 身份证号 |
  | `phone` | `string` | 否 | 联系电话 |
  | `email` | `string` | 否 | 邮箱 |
  | `address` | `string` | 否 | 地址 |

### 4. 借阅管理接口

#### 4.1 借书
- **请求方式**：POST
- **请求路径**：`/api/borrow/borrow`
- **请求参数**：
  | 参数名 | 类型 | 必填 | 描述 |
  |-------|------|------|------|
  | `book_id` | `number` | 是 | 图书ID |
  | `reader_id` | `number` | 是 | 读者ID |
  | `days` | `number` | 是 | 借阅天数 |

#### 4.2 还书
- **请求方式**：POST
- **请求路径**：`/api/borrow/return`
- **请求参数**：
  | 参数名 | 类型 | 必填 | 描述 |
  |-------|------|------|------|
  | `borrow_id` | `number` | 是 | 借阅记录ID |

#### 4.3 续借
- **请求方式**：POST
- **请求路径**：`/api/borrow/renew`
- **请求参数**：
  | 参数名 | 类型 | 必填 | 描述 |
  |-------|------|------|------|
  | `borrow_id` | `number` | 是 | 借阅记录ID |
  | `days` | `number` | 是 | 续借天数 |

### 5. 预约管理接口

#### 5.1 创建预约
- **请求方式**：POST
- **请求路径**：`/api/appointment`
- **请求参数**：
  | 参数名 | 类型 | 必填 | 描述 |
  |-------|------|------|------|
  | `book_id` | `number` | 是 | 图书ID |
  | `reader_id` | `number` | 是 | 读者ID |

### 6. 统计报表接口

#### 6.1 获取仪表盘数据
- **请求方式**：GET
- **请求路径**：`/api/statistics/dashboard`
- **响应格式**：
  ```json
  {
    "code": 200,
    "msg": "获取仪表盘数据成功",
    "data": {
      "total_books": 1000,
      "available_books": 800,
      "total_readers": 500,
      "total_borrows": 200,
      "overdue_count": 10,
      "today_borrows": 5,
      "today_returns": 3
    }
  }
  ```

#### 6.2 获取热门图书
- **请求方式**：GET
- **请求路径**：`/api/statistics/hot-books`
- **请求参数**：
  | 参数名 | 类型 | 必填 | 描述 |
  |-------|------|------|------|
  | `limit` | `number` | 否 | 返回数量，默认10 |

#### 6.3 获取分类借阅统计
- **请求方式**：GET
- **请求路径**：`/api/statistics/category-borrow`

#### 6.4 获取读者借阅排行
- **请求方式**：GET
- **请求路径**：`/api/statistics/reader-borrow`
- **请求参数**：
  | 参数名 | 类型 | 必填 | 描述 |
  |-------|------|------|------|
  | `limit` | `number` | 否 | 返回数量，默认10 |

#### 6.5 导出借阅记录
- **请求方式**：GET
- **请求路径**：`/api/statistics/export/borrow-records`
- **请求参数**：
  | 参数名 | 类型 | 必填 | 描述 |
  |-------|------|------|------|
  | `start_date` | `string` | 否 | 开始日期 |
  | `end_date` | `string` | 否 | 结束日期 |

- **响应**：Excel文件

## 快捷键说明

### 通用快捷键
- `Ctrl+F` - 页面搜索
- `Enter` - 提交表单
- `Escape` - 关闭弹窗

### 导航快捷键
- `Ctrl+1` - 首页
- `Ctrl+2` - 图书管理
- `Ctrl+3` - 借阅管理
- `Ctrl+4` - 读者管理
- `Ctrl+5` - 预约管理
- `Ctrl+6` - 统计报表
- `Ctrl+7` - 用户管理

### 操作快捷键
- `Ctrl+N` - 新增
- `Ctrl+E` - 编辑
- `Ctrl+D` - 删除
- `Ctrl+R` - 刷新

## 默认账号

### 管理员账号
- 用户名：admin
- 密码：admin123

### 馆员账号
- 用户名：librarian1
- 密码：librarian123

## 性能优化

### 前端优化
- 代码分割（按路由和依赖分包）
- 懒加载（路由级别）
- Gzip压缩
- 图片优化
- 缓存策略

### 后端优化
- 数据库索引优化
- SQL查询优化
- 连接池管理
- 缓存机制

## 浏览器兼容性

- Chrome >= 90
- Firefox >= 88
- Safari >= 14
- Edge >= 90

## 响应式设计

- PC端：>= 1920px
- 平板端：768px - 1919px
- 移动端：< 768px

## 项目结构

### 整体结构

```
Library Admin System1.1.0/
├── backend/                 # 后端代码
├── frontend/               # 前端代码（管理员/馆员）
├── reader-frontend/        # 读者前端代码
├── database/               # 数据库脚本
└── README.md               # 项目文档
```

### 后端详细结构

```
backend/
├── src/
│   ├── config/             # 配置文件
│   │   ├── config.js       # 系统配置
│   │   ├── database.js     # 数据库配置
│   │   └── logger.js       # 日志配置
│   ├── controllers/        # 控制器
│   │   └── readerController.js  # 读者相关控制器
│   ├── middleware/         # 中间件
│   │   ├── auth.js         # 认证中间件
│   │   ├── error.js        # 错误处理中间件
│   │   ├── log.js          # 日志中间件
│   │   └── readerAuth.js   # 读者认证中间件
│   ├── routes/             # 路由
│   │   ├── appointment.js  # 预约管理路由
│   │   ├── auth.js         # 认证路由
│   │   ├── books.js        # 图书管理路由
│   │   ├── borrow.js       # 借阅管理路由
│   │   ├── index.js        # 路由入口
│   │   ├── logs.js         # 日志管理路由
│   │   ├── reader.js       # 读者相关路由
│   │   ├── readers.js      # 读者管理路由
│   │   ├── statistics.js   # 统计报表路由
│   │   └── users.js        # 用户管理路由
│   ├── logs/               # 日志文件
│   │   ├── combined.log    # 综合日志
│   │   └── error.log       # 错误日志
│   └── app.js              # 应用入口
├── .env                    # 环境变量配置
├── .env.example            # 环境变量示例
├── app.js                  # 主入口文件
├── package.json            # 依赖配置
└── package-lock.json       # 依赖锁定文件
```

### 前端详细结构

```
frontend/
├── public/                 # 静态资源
│   └── logo.svg            # 系统 logo
├── src/
│   ├── api/                # API接口
│   │   ├── appointment.js  # 预约管理API
│   │   ├── auth.js         # 认证API
│   │   ├── books.js        # 图书管理API
│   │   ├── borrow.js       # 借阅管理API
│   │   ├── readers.js      # 读者管理API
│   │   └── statistics.js   # 统计报表API
│   ├── layouts/            # 布局组件
│   │   └── MainLayout.vue  # 主布局组件
│   ├── router/             # 路由配置
│   │   └── index.js        # 路由入口
│   ├── stores/             # 状态管理
│   │   └── user.js         # 用户状态管理
│   ├── utils/              # 工具函数
│   │   ├── keyboard.js     # 键盘快捷键
│   │   ├── request.js      # API请求封装
│   │   └── validation.js   # 表单验证
│   ├── views/              # 页面组件
│   │   ├── Appointment.vue # 预约管理页面
│   │   ├── Books.vue       # 图书管理页面
│   │   ├── Borrow.vue      # 借阅管理页面
│   │   ├── Dashboard.vue   # 首页/仪表盘
│   │   ├── Login.vue       # 登录页面
│   │   ├── Logs.vue        # 日志审计页面
│   │   ├── Profile.vue     # 个人中心页面
│   │   ├── Readers.vue     # 读者管理页面
│   │   ├── Register.vue    # 注册页面
│   │   ├── Statistics.vue  # 统计报表页面
│   │   └── Users.vue       # 用户管理页面
│   ├── App.vue             # 根组件
│   ├── main.js             # 主入口文件
│   └── style.css           # 全局样式
├── index.html              # HTML模板
├── package.json            # 依赖配置
├── package-lock.json       # 依赖锁定文件
└── vite.config.js          # Vite配置
```

### 读者前端详细结构

```
reader-frontend/
├── public/                 # 静态资源
│   ├── logos.svg           # 系统 logo
│   └── vite.svg            # Vite logo
├── src/
│   ├── api/                # API接口
│   │   ├── announcement.js # 公告API
│   │   ├── auth.js         # 认证API
│   │   ├── books.js        # 图书API
│   │   ├── borrow.js       # 借阅API
│   │   ├── reservation.js  # 预约API
│   │   └── user.js         # 用户API
│   ├── layouts/            # 布局组件
│   │   └── MainLayout.vue  # 主布局组件
│   ├── router/             # 路由配置
│   │   └── index.js        # 路由入口
│   ├── stores/             # 状态管理
│   │   └── user.js         # 用户状态管理
│   ├── utils/              # 工具函数
│   │   └── request.js      # API请求封装
│   ├── views/              # 页面组件
│   │   ├── Announcement.vue    # 公告页面
│   │   ├── BookDetail.vue      # 图书详情页面
│   │   ├── BookSearch.vue      # 图书搜索页面
│   │   ├── BorrowList.vue      # 借阅列表页面
│   │   ├── ForgotPassword.vue  # 忘记密码页面
│   │   ├── Home.vue            # 首页
│   │   ├── Login.vue           # 登录页面
│   │   ├── NotFound.vue        # 404页面
│   │   ├── Register.vue        # 注册页面
│   │   ├── ReservationList.vue # 预约列表页面
│   │   └── UserProfile.vue     # 用户中心页面
│   ├── App.vue             # 根组件
│   ├── main.js             # 主入口文件
│   └── style.css           # 全局样式
├── index.html              # HTML模板
├── package.json            # 依赖配置
├── package-lock.json       # 依赖锁定文件
└── vite.config.js          # Vite配置
```

### 数据库脚本结构

```
database/
├── init.sql                        # 数据库初始化脚本
├── add_more_data.sql               # 测试数据脚本
├── check_operation_logs.sql        # 操作日志检查脚本
├── create_sys_config.sql           # 系统配置创建脚本
├── delete_null_username_logs.sql   # 删除空用户名日志脚本
├── insert_missing_readers.sql      # 插入缺失读者脚本
├── sync_readers_to_reader_info.sql # 同步读者信息脚本
├── update_book_titles.sql          # 更新图书标题脚本
├── update_borrow_records.sql       # 更新借阅记录脚本
└── update_reader_info_reader_no.sql # 更新读者证号脚本
```

## 开发规范

### 代码规范

#### 前端代码规范

1. **ESLint规则**
   - 遵循Vue 3官方推荐的ESLint规则
   - 禁止使用未声明的变量
   - 禁止使用console.log（生产环境）
   - 强制使用单引号
   - 强制使用分号

2. **Prettier格式化**
   - 配置文件：`.prettierrc.js`
   - 行宽：80个字符
   - 使用单引号
   - 使用分号
   - 尾随逗号：es5

3. **Vue 3 Composition API规范**
   - 使用`<script setup>`语法
   - 组件命名：PascalCase（如`MainLayout.vue`）
   - 变量命名：camelCase（如`userName`）
   - 常量命名：UPPER_CASE（如`MAX_LENGTH`）
   - 函数命名：camelCase（如`handleSubmit`）

4. **注释规范**
   - 统一使用中文注释
   - 组件头部添加功能描述
   - 复杂逻辑添加注释说明
   - 函数添加参数和返回值说明

5. **代码组织**
   - 按功能模块组织代码
   - 组件拆分合理，职责单一
   - 工具函数封装复用
   - API接口统一管理

#### 后端代码规范

1. **ESLint规则**
   - 遵循Node.js官方推荐的ESLint规则
   - 禁止使用未声明的变量
   - 禁止使用console.log（生产环境）
   - 强制使用单引号
   - 强制使用分号

2. **代码风格**
   - 缩进：2个空格
   - 行宽：80个字符
   - 使用单引号
   - 使用分号
   - 尾随逗号：es5

3. **命名规范**
   - 文件命名：kebab-case（如`user-controller.js`）
   - 变量命名：camelCase（如`userName`）
   - 常量命名：UPPER_CASE（如`MAX_LENGTH`）
   - 函数命名：camelCase（如`getUserList`）
   - 类命名：PascalCase（如`UserController`）

4. **注释规范**
   - 统一使用中文注释
   - 文件头部添加功能描述
   - 复杂逻辑添加注释说明
   - 函数添加参数和返回值说明
   - API接口添加路由说明

5. **代码组织**
   - 按MVC架构组织代码
   - 路由、控制器、中间件分离
   - 配置文件集中管理
   - 工具函数封装复用

### 提交规范

#### Git提交消息格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

#### 类型说明

| 类型 | 描述 |
|------|------|
| `feat` | 新功能 |
| `fix` | 修复bug |
| `docs` | 文档更新 |
| `style` | 代码格式调整（不影响功能） |
| `refactor` | 代码重构（不新增功能，不修复bug） |
| `test` | 测试相关 |
| `chore` | 构建/工具链相关 |
| `perf` | 性能优化 |
| `ci` | CI配置更新 |
| `revert` | 回滚代码 |

#### 示例

```
feat(auth): 添加JWT身份认证功能

- 实现用户登录生成token
- 实现token验证中间件
- 添加token过期处理

Closes #123
```

### 开发流程

1. **环境搭建**
   - 克隆代码仓库
   - 安装依赖
   - 配置环境变量
   - 初始化数据库

2. **分支管理**
   - `main`：主分支（生产环境）
   - `develop`：开发分支
   - `feature/xxx`：功能分支
   - `bugfix/xxx`： bug修复分支

3. **开发流程**
   - 从`develop`分支创建功能分支
   - 完成开发和测试
   - 提交代码到远程仓库
   - 创建Pull Request到`develop`分支
   - 代码审核通过后合并

4. **测试流程**
   - 单元测试：测试单个功能模块
   - 集成测试：测试多个模块的交互
   - 端到端测试：测试完整的用户流程
   - 性能测试：测试系统性能

5. **发布流程**
   - 从`develop`分支合并到`main`分支
   - 运行构建命令
   - 部署到生产环境
   - 运行健康检查

### 代码审查

1. **审查内容**
   - 代码质量：可读性、可维护性
   - 功能实现：是否符合需求
   - 性能优化：是否存在性能问题
   - 安全性：是否存在安全隐患
   - 代码规范：是否遵循代码规范

2. **审查工具**
   - ESLint：代码质量检查
   - Prettier：代码格式检查
   - SonarQube：代码质量分析
   - GitLab/GitHub：代码审查平台

3. **审查流程**
   - 提交Pull Request
   - 自动运行CI/CD
   - 团队成员代码审查
   - 解决审查意见
   - 合并代码

## 常见问题

### 安装部署问题

#### Q: 如何修改数据库连接配置？
A: 编辑backend/.env文件，修改以下数据库连接信息：
```env
# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=library_management_system
```

#### Q: 数据库连接失败怎么办？
A: 检查以下几点：
1. MySQL服务是否正常运行
2. 数据库连接配置是否正确
3. 数据库用户是否有正确的权限
4. 防火墙是否允许MySQL端口访问

#### Q: 前端无法连接后端API怎么办？
A: 检查以下几点：
1. 后端服务是否正常运行
2. 前端API地址配置是否正确（frontend/src/utils/request.js）
3. CORS配置是否正确
4. 网络连接是否正常

#### Q: 端口被占用怎么办？
A: 修改backend/.env文件中的PORT配置：
```env
# 服务器配置
PORT=3001
```

### 系统使用问题

#### Q: 如何重置管理员密码？
A: 有两种方法：
1. 使用系统界面：登录系统后，进入个人中心修改密码
2. 直接修改数据库：使用bcryptjs生成新的密码哈希值，更新users表中的password字段

#### Q: 如何添加新的图书分类？
A: 登录系统后，进入图书管理页面，点击分类管理，然后添加新分类。

#### Q: 如何处理逾期图书？
A: 登录系统后，进入借阅管理页面，查看逾期记录，然后处理罚款和还书操作。

#### Q: 如何导出借阅记录？
A: 登录系统后，进入统计报表页面，点击导出按钮，选择导出范围和格式。

#### Q: 如何查看系统操作日志？
A: 登录系统后，进入日志审计页面，查看和筛选操作日志。

### 系统维护问题

#### Q: 如何备份数据库？
A: 使用mysqldump命令备份数据库：
```bash
mysqldump -u root -p library_management_system > backup.sql
```

#### Q: 如何恢复数据库？
A: 使用以下命令恢复数据库：
```bash
mysql -u root -p library_management_system < backup.sql
```

#### Q: 如何查看系统日志？
A: 后端日志位于backend/src/logs/目录，包括：
- combined.log：综合日志
- error.log：错误日志

#### Q: 系统运行缓慢怎么办？
A: 检查以下几点：
1. 数据库索引是否优化
2. SQL查询是否高效
3. 服务器资源是否充足
4. 是否存在内存泄漏

#### Q: 如何更新系统版本？
A: 按照以下步骤更新：
1. 备份数据库
2. 拉取最新代码
3. 安装依赖
4. 运行数据库更新脚本
5. 重启服务

### 安全问题

#### Q: 如何加强系统安全性？
A: 采取以下措施：
1. 使用强密码策略
2. 定期更新系统和依赖
3. 配置HTTPS
4. 限制API访问频率
5. 定期备份数据
6. 监控系统日志

#### Q: 如何防止SQL注入攻击？
A: 采取以下措施：
1. 使用参数化查询
2. 验证用户输入
3. 限制数据库用户权限
4. 使用ORM框架

#### Q: 如何防止XSS攻击？
A: 采取以下措施：
1. 对用户输入进行过滤
2. 使用Content-Security-Policy头
3. 转义HTML特殊字符
4. 使用HTTPS

### 其他问题

#### Q: 系统支持多语言吗？
A: 目前系统仅支持中文，后续版本将考虑添加多语言支持。

#### Q: 系统支持扫码功能吗？
A: 支持，系统支持扫码录入图书和扫码借书还书。

#### Q: 如何配置邮件通知？
A: 编辑backend/.env文件，添加邮件配置：
```env
# 邮件配置
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

#### Q: 如何修改系统名称和logo？
A: 修改以下文件：
1. 系统名称：修改前端和后端的配置文件
2. Logo：替换frontend/public/logo.svg文件

## 更新日志

### v1.1.0 (2024-01-28)

**新增功能**
- 预约管理功能：支持图书预约、预约状态管理、预约提醒
- 暗黑模式支持：系统界面支持亮色/暗黑模式切换
- 全局快捷键：添加导航和操作快捷键，提高操作效率
- 读者前端：新增读者自助服务前端，支持图书查询、借阅管理、预约管理

**优化改进**
- 响应式设计：优化移动端和平板设备的显示效果
- 统计报表功能：完善数据可视化图表，添加更多统计维度
- 性能优化：优化API响应速度，减少页面加载时间
- 用户体验：改进表单验证，添加操作反馈，优化界面交互

**Bug修复**
- 修复图书列表分页问题
- 修复读者信用状态更新问题
- 修复借阅记录导出问题

### v1.0.0 (2023-12-15)

**初始版本**
- 基础认证与权限管理
- 图书管理（增删改查、批量导入）
- 读者管理（信息管理、信用状态管理）
- 借阅管理（借书、还书、续借、逾期管理）
- 统计报表（基础数据统计）
- 日志审计（操作记录查询）

## 未来规划

### v1.2.0 计划功能
- 多语言支持
- 邮件通知系统
- 短信通知系统
- 图书推荐系统
- 智能书架管理
- 移动端APP

### v2.0.0 计划功能
- 微服务架构重构
- 容器化部署支持
- 大数据分析平台
- 人工智能助手
- 区块链图书溯源

## 许可证

本项目采用 ISC 许可证。详情请参阅 [LICENSE](LICENSE) 文件。

```
ISC License

Copyright (c) 2024, Library Admin System Team

Permission to use, copy, modify, and distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
```

## 贡献指南

### 如何贡献

1. **Fork 仓库**
   - 在 GitHub 上 Fork 本项目到自己的账号

2. **克隆仓库**
   ```bash
   git clone https://github.com/your-username/library-admin-system.git
   cd library-admin-system
   ```

3. **创建分支**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **安装依赖**
   ```bash
   # 安装后端依赖
   cd backend
   npm install
   
   # 安装前端依赖
   cd ../frontend
   npm install
   
   # 安装读者前端依赖
   cd ../reader-frontend
   npm install
   ```

5. **开发和测试**
   - 遵循代码规范
   - 编写测试用例
   - 确保代码通过测试

6. **提交代码**
   ```bash
   git add .
   git commit -m "feat: 描述你的功能"
   git push origin feature/your-feature-name
   ```

7. **创建 Pull Request**
   - 在 GitHub 上创建 Pull Request
   - 描述你的修改内容和目的
   - 等待代码审查

### 贡献规范

1. **代码规范**
   - 遵循项目的代码规范
   - 使用 ESLint 和 Prettier 检查代码
   - 确保代码可读性和可维护性

2. **提交规范**
   - 遵循 Git 提交规范
   - 提交消息清晰明了
   - 每个提交只包含一个功能或修复

3. **测试规范**
   - 为新功能编写测试用例
   - 确保测试覆盖率
   - 运行测试确保代码质量

4. **文档规范**
   - 更新相关文档
   - 添加新功能的使用说明
   - 确保文档与代码同步

## 致谢

### 技术依赖

- [Vue 3](https://vuejs.org/) - 前端框架
- [Express](https://expressjs.com/) - 后端框架
- [MySQL](https://www.mysql.com/) - 数据库
- [Element Plus](https://element-plus.org/) - UI组件库
- [ECharts](https://echarts.apache.org/) - 数据可视化库
- [Axios](https://axios-http.com/) - HTTP客户端
- [Pinia](https://pinia.vuejs.org/) - 状态管理
- [Vue Router](https://router.vuejs.org/) - 路由管理
- [bcryptjs](https://www.npmjs.com/package/bcryptjs) - 密码加密
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) - JWT认证
- [exceljs](https://www.npmjs.com/package/exceljs) - Excel文件处理
- [Winston](https://www.npmjs.com/package/winston) - 日志管理

### 开发工具

- [Visual Studio Code](https://code.visualstudio.com/) - 代码编辑器
- [Postman](https://www.postman.com/) - API测试工具
- [MySQL Workbench](https://www.mysql.com/products/workbench/) - 数据库管理工具
- [Git](https://git-scm.com/) - 版本控制
- [npm](https://www.npmjs.com/) - 包管理器

### 特别感谢

感谢所有为项目做出贡献的开发者和测试人员，以及提供技术支持的社区。

## 联系方式

如有问题或建议，请联系开发团队。