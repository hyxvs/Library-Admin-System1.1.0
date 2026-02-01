# Vercel后端部署指南 - 解决404错误

## 问题分析

404错误的原因通常是：
1. 缺少`vercel.json`配置文件
2. Vercel无法正确路由到Node.js应用
3. 环境变量配置不正确

## 解决方案

### 步骤1：确保项目结构正确

```
backend/
├── src/
│   ├── app.js          # 主应用文件
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   └── routes/
├── uploads/            # 静态文件目录
├── package.json        # 依赖配置
├── vercel.json        # Vercel配置（必须）
└── .env              # 环境变量（不要提交到Git）
```

### 步骤2：验证vercel.json配置

确保`backend/vercel.json`文件存在且内容正确：

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/app.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/src/app.js"
    },
    {
      "src": "/uploads/(.*)",
      "dest": "/uploads/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/src/app.js"
    }
  ]
}
```

### 步骤3：配置Vercel环境变量

在Vercel控制台中配置以下环境变量：

**必须配置的环境变量**：
- `PORT` = `3000`
- `DB_HOST` = 你的数据库主机地址
- `DB_PORT` = `3306`
- `DB_USER` = 你的数据库用户名
- `DB_PASSWORD` = 你的数据库密码
- `DB_NAME` = `library_system`
- `JWT_SECRET` = 一个安全的密钥字符串
- `JWT_EXPIRES_IN` = `24h`
- `LOG_LEVEL` = `info`

### 步骤4：重新部署后端

#### 方法1：通过Vercel控制台
1. 登录Vercel控制台
2. 进入你的后端项目
3. 点击"Deployments"标签
4. 点击右上角的"..."菜单
5. 选择"Redeploy"

#### 方法2：通过Git推送
```bash
cd backend
git add vercel.json
git commit -m "添加Vercel配置文件"
git push
```

### 步骤5：验证部署

#### 5.1 检查部署状态
1. 在Vercel控制台查看部署日志
2. 确保没有错误信息
3. 等待部署完成（绿色勾号）

#### 5.2 测试API端点

**测试健康检查**：
```
GET https://your-backend.vercel.app/api/health
```

预期响应：
```json
{
  "code": 200,
  "msg": "服务正常运行",
  "data": {
    "timestamp": "...",
    "uptime": ...
  }
}
```

**测试注册接口**：
```
POST https://your-backend.vercel.app/api/reader/register
Content-Type: application/json

{
  "username": "testuser",
  "password": "password123",
  "realName": "测试用户",
  "idCard": "123456789012345678",
  "email": "test@example.com"
}
```

**测试登录接口**：
```
POST https://your-backend.vercel.app/api/reader/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "password123"
}
```

### 步骤6：更新前端配置

#### 6.1 修改前端环境变量
编辑`reader-mobile/.env.production`：

```env
VITE_API_BASE_URL=https://your-backend.vercel.app/api
```

#### 6.2 在Vercel前端项目中配置环境变量
1. 进入前端项目的Vercel控制台
2. Settings → Environment Variables
3. 添加：
   - Name: `VITE_API_BASE_URL`
   - Value: `https://your-backend.vercel.app/api`
   - Environment: Production, Preview, Development
4. 保存并重新部署

## 常见问题排查

### 问题1：仍然出现404错误

**检查清单**：
- [ ] `vercel.json`文件是否存在于backend目录根目录
- [ ] `vercel.json`中的`src`路径是否正确（`src/app.js`）
- [ ] 是否重新部署了后端
- [ ] Vercel部署日志中是否有错误

**解决方案**：
1. 删除Vercel项目，重新创建
2. 确保vercel.json在Git仓库中
3. 检查package.json中的main字段是否为`src/app.js`

### 问题2：数据库连接失败

**检查清单**：
- [ ] 环境变量是否正确配置
- [ ] 数据库是否可以从外网访问
- [ ] 数据库IP白名单是否配置

**解决方案**：
1. 检查Vercel环境变量配置
2. 确认数据库服务允许外部连接
3. 测试数据库连接是否正常

### 问题3：应用启动失败

**检查清单**：
- [ ] 依赖是否正确安装
- [ ] 端口配置是否正确
- [ ] 代码中是否有语法错误

**解决方案**：
1. 查看Vercel部署日志
2. 在本地测试`npm start`是否能正常启动
3. 检查所有依赖是否在package.json中列出

## 调试技巧

### 查看实时日志
1. 进入Vercel控制台
2. 选择你的项目
3. 点击"Logs"标签
4. 可以查看实时日志输出

### 本地测试
```bash
# 在backend目录下
npm start

# 测试API
curl http://localhost:3000/api/health
```

### 使用Postman测试
1. 创建新的请求
2. 设置URL为你的Vercel后端地址
3. 测试各个API端点
4. 查看响应状态和内容

## 推荐的替代方案

如果Vercel部署仍然有问题，建议使用Render：

### 为什么推荐Render？
1. 对Node.js支持更好
2. 部署配置更简单
3. 免费额度更充足
4. 更适合长期运行的服务

### Render部署步骤
参考`backend/DEPLOYMENT_GUIDE.md`文档

## 完整的API端点列表

### 认证相关
- `POST /api/reader/login` - 读者登录
- `POST /api/reader/register` - 读者注册
- `POST /api/reader/logout` - 读者登出
- `POST /api/reader/send-sms-code` - 发送短信验证码
- `POST /api/reader/reset-password` - 重置密码

### 用户相关（需要认证）
- `GET /api/reader/user/info` - 获取用户信息
- `PUT /api/reader/user/profile` - 更新用户信息
- `POST /api/reader/user/change-password` - 修改密码
- `POST /api/reader/user/avatar` - 上传头像
- `GET /api/reader/user/statistics` - 获取统计信息

### 图书相关（需要认证）
- `GET /api/reader/books/search` - 搜索图书
- `GET /api/reader/books/detail/:id` - 获取图书详情
- `GET /api/reader/books/hot` - 获取热门图书
- `GET /api/reader/books/categories` - 获取图书分类

### 预约相关（需要认证）
- `POST /api/reader/reservation/create` - 创建预约
- `POST /api/reader/reservation/cancel/:id` - 取消预约
- `GET /api/reader/reservation/list` - 获取预约列表
- `GET /api/reader/reservation/detail/:id` - 获取预约详情

### 借阅相关（需要认证）
- `GET /api/reader/borrow/list` - 获取借阅列表
- `GET /api/reader/borrow/detail/:id` - 获取借阅详情
- `POST /api/reader/borrow/renew/:id` - 续借图书
- `POST /api/reader/borrow/create` - 直接借阅图书

## 成功验证清单

部署完成后，确保以下所有项目都通过：

- [ ] 健康检查接口返回200状态码
- [ ] 注册接口正常工作
- [ ] 登录接口正常工作
- [ ] 获取用户信息接口正常工作
- [ ] 前端能够成功调用后端API
- [ ] 移动端能够正常访问

## 技术支持

- Vercel文档: https://vercel.com/docs
- Vercel Node.js指南: https://vercel.com/guides/using-express-with-vercel
- Express文档: https://expressjs.com/