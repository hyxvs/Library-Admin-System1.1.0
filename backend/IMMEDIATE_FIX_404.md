# 立即修复Vercel 404错误

## 问题确认

你的Vercel部署返回404错误，原因是：
- 根目录存在`backend/app.js`文件
- Vercel可能使用了错误的入口文件
- 需要明确指定使用`backend/src/app.js`

## 立即执行步骤

### 步骤1：重命名根目录的app.js

在PowerShell中执行：

```powershell
cd "c:\Users\hyx20\Desktop\Library Admin System1.1.0\backend"
git mv app.js server.js
```

### 步骤2：提交更改

```powershell
git add .
git commit -m "重命名根目录app.js为server.js，避免Vercel部署混淆"
git push
```

### 步骤3：在Vercel中重新部署

1. 访问 https://vercel.com/dashboard
2. 进入你的后端项目（backend-system-psi）
3. 点击"Deployments"标签
4. 点击右上角的"..."菜单
5. 选择"Redeploy"
6. 等待部署完成（2-5分钟）

### 步骤4：测试API

部署完成后，测试以下端点：

**测试1：健康检查**
```powershell
curl https://backend-system-psi.vercel.app/api/health
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

**测试2：注册接口**
```powershell
curl -X POST https://backend-system-psi.vercel.app/api/reader/register `
  -H "Content-Type: application/json" `
  -d '{"username":"testuser","password":"password123","realName":"测试用户","idCard":"123456789012345678","email":"test@example.com"}'
```

## 为什么这样解决？

### 1. 保留两个文件的功能
- `backend/server.js`（原app.js）- 旧版本入口，保留用于本地开发
- `backend/src/app.js` - 新版本入口，用于Vercel生产部署

### 2. 避免Vercel混淆
- Vercel看到两个app.js文件时可能选择错误的入口
- 重命名后，vercel.json明确指定使用src/app.js
- 部署过程更加可靠

### 3. 明确的文件结构
```
backend/
├── src/
│   └── app.js          # Vercel使用这个
├── server.js            # 本地开发使用这个（原app.js）
├── vercel.json          # 明确指定src/app.js
└── package.json
```

## 验证清单

完成上述步骤后，确保：

- [ ] 根目录的app.js已重命名为server.js
- [ ] Git提交已推送到远程仓库
- [ ] Vercel重新部署成功
- [ ] 部署状态显示为"Ready"
- [ ] 健康检查接口返回200状态码
- [ ] 注册接口正常工作
- [ ] 前端能够成功调用API

## 如果仍然出现404错误

### 检查1：查看Vercel部署日志
1. 进入Vercel控制台
2. 选择你的项目
3. 点击"Logs"标签
4. 查看是否有启动错误

### 检查2：验证环境变量
确保以下环境变量已配置：
- PORT = 3000
- DB_HOST = 你的数据库地址
- DB_PORT = 3306
- DB_USER = 数据库用户名
- DB_PASSWORD = 数据库密码
- DB_NAME = library_system
- JWT_SECRET = 安全密钥
- JWT_EXPIRES_IN = 24h
- LOG_LEVEL = info

### 检查3：清理Vercel缓存
1. 在Vercel控制台删除项目
2. 重新创建项目
3. 重新连接GitHub仓库
4. 配置环境变量
5. 重新部署

## 替代方案：使用Render

如果Vercel仍然有问题，建议使用Render：

### 为什么推荐Render？
1. 对Node.js支持更好
2. 部署配置更简单
3. 免费额度更充足
4. 更适合长期运行的服务

### 快速部署步骤
1. 访问 https://render.com/
2. 注册并登录
3. 点击"New +" → "Web Service"
4. 连接GitHub仓库
5. 选择backend目录
6. 配置环境变量
7. 部署完成

## 技术支持

- Vercel文档: https://vercel.com/docs
- Vercel Node.js指南: https://vercel.com/guides/using-express-with-vercel
- Render文档: https://render.com/docs

## 下一步

完成上述步骤后：
1. 更新前端配置中的API地址
2. 测试移动端访问
3. 监控应用性能
4. 定期备份数据库