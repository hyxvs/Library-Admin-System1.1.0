# Node.js与Express从入门到精通
## 基于图书馆管理系统实战教学

---

## 目录

- [第一章：Node.js基础入门](#第一章nodejs基础入门)
- [第二章：Express框架快速上手](#第二章express框架快速上手)
- [第三章：路由系统详解](#第三章路由系统详解)
- [第四章：中间件机制](#第四章中间件机制)
- [第五章：数据库操作](#第五章数据库操作)
- [第六章：用户认证与授权](#第六章用户认证与授权)
- [第七章：错误处理](#第七章错误处理)
- [第八章：日志系统](#第八章日志系统)
- [第九章：文件上传](#第九章文件上传)
- [第十章：数据导出](#第十章数据导出)
- [第十一章：项目实战](#第十一章项目实战)

---

## 第一章：Node.js基础入门

### 1.1 什么是Node.js？

Node.js是一个基于Chrome V8引擎的JavaScript运行时环境，它让JavaScript可以在服务器端运行。Node.js采用事件驱动、非阻塞I/O模型，使其轻量且高效。

**核心特点：**
- 单线程、事件驱动
- 非阻塞I/O
- 跨平台
- 丰富的npm生态系统

### 1.2 模块系统

Node.js使用CommonJS模块系统，通过`require()`导入模块，通过`module.exports`导出模块。

**案例：从package.json看项目依赖**

```json
{
  "name": "library-backend",
  "version": "1.0.0",
  "description": "图书馆管理系统后端",
  "main": "src/app.js",
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mysql2": "^3.6.5",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "winston": "^3.11.0"
  }
}
```

**知识点解析：**
- `main`: 指定程序的入口文件
- `scripts`: 定义可执行的命令脚本
- `dependencies`: 生产环境依赖
- `devDependencies`: 开发环境依赖

### 1.3 require()导入模块

**案例：导入各种模块**

```javascript
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
```

**解析：**
- `express`: 导入Express框架
- `cors`: 导入CORS中间件
- `path`: Node.js内置模块，处理文件路径
- `dotenv`: 加载环境变量

### 1.4 module.exports导出模块

**案例：导出数据库连接池**

```javascript
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10
});

module.exports = pool;
```

**解析：**
- 创建MySQL连接池
- 通过`module.exports`导出，供其他模块使用

---

## 第二章：Express框架快速上手

### 2.1 什么是Express？

Express是一个基于Node.js的Web应用框架，提供了一系列强大的特性来创建Web应用和API。

### 2.2 创建Express应用

**案例：app.js - 应用入口文件**

```javascript
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/api/health', (req, res) => {
  res.json({
    code: 200,
    msg: '服务正常运行',
    data: {
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    }
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});

module.exports = app;
```

**知识点解析：**

1. **创建应用实例**
```javascript
const app = express();
```

2. **使用中间件**
```javascript
app.use(cors());
app.use(express.json());
```

3. **静态文件服务**
```javascript
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
```
- `/uploads`: URL路径前缀
- `express.static()`: 静态文件中间件
- `path.join()`: 拼接文件路径

4. **定义路由**
```javascript
app.get('/api/health', (req, res) => {
  res.json({ code: 200, msg: '服务正常运行' });
});
```

5. **启动服务器**
```javascript
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});
```

### 2.3 请求与响应

**案例：处理不同类型的请求**

```javascript
app.get('/api/books', (req, res) => {
  res.json({ code: 200, msg: '获取图书列表' });
});

app.post('/api/books', (req, res) => {
  const body = req.body;
  res.json({ code: 200, msg: '创建图书', data: body });
});

app.put('/api/books/:id', (req, res) => {
  const { id } = req.params;
  res.json({ code: 200, msg: `更新图书 ${id}` });
});

app.delete('/api/books/:id', (req, res) => {
  const { id } = req.params;
  res.json({ code: 200, msg: `删除图书 ${id}` });
});
```

**知识点解析：**
- `req.params`: 路径参数
- `req.query`: 查询参数
- `req.body`: 请求体
- `res.json()`: 返回JSON响应
- `res.status()`: 设置HTTP状态码

---

## 第三章：路由系统详解

### 3.1 什么是路由？

路由是指确定应用程序如何响应客户端对特定端点的请求，该端点是URI（或路径）和特定的HTTP请求方法（GET、POST等）。

### 3.2 路由模块化

**案例：routes/index.js - 路由索引文件**

```javascript
const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const booksRoutes = require('./books');
const borrowRoutes = require('./borrow');

router.use('/auth', authRoutes);
router.use('/books', booksRoutes);
router.use('/borrow', borrowRoutes);

module.exports = router;
```

**知识点解析：**
- `express.Router()`: 创建路由实例
- `router.use()`: 挂载子路由
- 模块化设计，便于维护

### 3.3 RESTful API设计

**案例：books.js - 图书路由**

```javascript
const express = require('express');
const router = express.Router();
const pool = require('../config/database');

router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const offset = (page - 1) * pageSize;

    let whereClause = ' WHERE 1=1';
    const params = [];

    if (req.query.title) {
      whereClause += ' AND title LIKE ?';
      params.push(`%${req.query.title}%`);
    }

    if (req.query.category_id) {
      whereClause += ' AND category_id = ?';
      params.push(req.query.category_id);
    }

    const [books] = await pool.query(
      `SELECT b.*, c.category_name FROM books b 
       LEFT JOIN categories c ON b.category_id = c.id
       ${whereClause} 
       ORDER BY b.created_at DESC 
       LIMIT ? OFFSET ?`,
      [...params, pageSize, offset]
    );

    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total FROM books b${whereClause}`,
      params
    );

    res.json({
      code: 200,
      msg: '获取图书列表成功',
      data: {
        list: books,
        total: countResult[0].total,
        page,
        pageSize
      }
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      msg: '获取图书列表失败',
      data: null
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [books] = await pool.query(
      'SELECT * FROM books WHERE id = ?',
      [id]
    );

    if (books.length === 0) {
      return res.status(404).json({
        code: 404,
        msg: '图书不存在',
        data: null
      });
    }

    res.json({
      code: 200,
      msg: '获取图书信息成功',
      data: books[0]
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      msg: '获取图书信息失败',
      data: null
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const { isbn, title, author, publisher, category_id } = req.body;

    await pool.query(
      'INSERT INTO books (isbn, title, author, publisher, category_id) VALUES (?, ?, ?, ?, ?)',
      [isbn, title, author, publisher, category_id]
    );

    res.json({
      code: 200,
      msg: '创建图书成功',
      data: null
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      msg: '创建图书失败',
      data: null
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { isbn, title, author, publisher, category_id } = req.body;

    await pool.query(
      'UPDATE books SET isbn = ?, title = ?, author = ?, publisher = ?, category_id = ? WHERE id = ?',
      [isbn, title, author, publisher, category_id, id]
    );

    res.json({
      code: 200,
      msg: '更新图书成功',
      data: null
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      msg: '更新图书失败',
      data: null
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM books WHERE id = ?', [id]);

    res.json({
      code: 200,
      msg: '删除图书成功',
      data: null
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      msg: '删除图书失败',
      data: null
    });
  }
});

module.exports = router;
```

**知识点解析：**

1. **GET请求 - 获取列表**
```javascript
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const offset = (page - 1) * pageSize;
});
```
- 分页查询
- 条件过滤
- 返回总数和当前页数据

2. **GET请求 - 获取详情**
```javascript
router.get('/:id', async (req, res) => {
  const { id } = req.params;
});
```
- 路径参数
- 404处理

3. **POST请求 - 创建资源**
```javascript
router.post('/', async (req, res) => {
  const { isbn, title, author } = req.body;
});
```
- 从请求体获取数据
- 插入数据库

4. **PUT请求 - 更新资源**
```javascript
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, author } = req.body;
});
```
- 路径参数 + 请求体
- 更新数据库

5. **DELETE请求 - 删除资源**
```javascript
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
});
```
- 路径参数
- 删除数据库记录

---

## 第四章：中间件机制

### 4.1 什么是中间件？

中间件是一个函数，它可以访问请求对象（req）、响应对象（res）和应用程序的请求-响应循环中的下一个中间件函数（next）。

### 4.2 中间件类型

**案例：app.js中的中间件使用**

```javascript
const express = require('express');
const cors = require('cors');
const path = require('path');
const logger = require('./config/logger');
const { errorHandler, notFoundHandler } = require('./middleware/error');
const logOperation = require('./middleware/log');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use(logOperation);

app.use('/api/auth', require('./routes/auth'));
app.use('/api/books', require('./routes/books'));

app.use(notFoundHandler);
app.use(errorHandler);
```

**知识点解析：**

1. **应用级中间件**
```javascript
app.use(cors());
app.use(express.json());
```
- 使用`app.use()`绑定到app对象
- 对所有请求生效

2. **路由级中间件**
```javascript
app.use('/api/auth', require('./routes/auth'));
```
- 绑定到特定路由
- 只对匹配的路径生效

3. **错误处理中间件**
```javascript
app.use(errorHandler);
```
- 必须有4个参数：`(err, req, res, next)`
- 放在所有中间件之后

### 4.3 自定义中间件

**案例：认证中间件 - middleware/auth.js**

```javascript
const jwt = require('jsonwebtoken');
const logger = require('../config/logger');
const config = require('../config/config');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        code: 401,
        msg: '未提供认证令牌',
        data: null
      });
    }

    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded;
    next();
  } catch (error) {
    logger.error('JWT验证失败:', error);
    return res.status(401).json({
      code: 401,
      msg: '认证令牌无效或已过期',
      data: null
    });
  }
};

const adminAuthMiddleware = (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        code: 403,
        msg: '需要管理员权限',
        data: null
      });
    }
    next();
  } catch (error) {
    logger.error('权限验证失败:', error);
    return res.status(403).json({
      code: 403,
      msg: '权限验证失败',
      data: null
    });
  }
};

module.exports = {
  authMiddleware,
  adminAuthMiddleware
};
```

**知识点解析：**

1. **JWT认证中间件**
```javascript
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  const decoded = jwt.verify(token, config.jwt.secret);
  req.user = decoded;
  next();
};
```
- 从请求头获取token
- 验证token有效性
- 将解码后的用户信息存入req.user
- 调用next()继续处理

2. **权限验证中间件**
```javascript
const adminAuthMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: '需要管理员权限' });
  }
  next();
};
```
- 检查用户角色
- 拒绝无权限访问

3. **使用中间件**
```javascript
const { authMiddleware } = require('../middleware/auth');

router.post('/borrow', authMiddleware, async (req, res) => {
  const operator_id = req.user.id;
});
```

### 4.4 错误处理中间件

**案例：middleware/error.js**

```javascript
const logger = require('../config/logger');

const errorHandler = (err, req, res, next) => {
  logger.error('发生错误:', err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      code: 400,
      msg: '参数验证失败',
      data: err.errors
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      code: 401,
      msg: '未授权访问',
      data: null
    });
  }

  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      code: 409,
      msg: '数据已存在',
      data: null
    });
  }

  res.status(500).json({
    code: 500,
    msg: err.message || '服务器内部错误',
    data: null
  });
};

const notFoundHandler = (req, res) => {
  res.status(404).json({
    code: 404,
    msg: '请求的资源不存在',
    data: null
  });
};

module.exports = {
  errorHandler,
  notFoundHandler
};
```

**知识点解析：**
- 统一错误处理
- 根据错误类型返回不同的状态码
- 记录错误日志

---

## 第五章：数据库操作

### 5.1 MySQL连接池

**案例：config/database.js**

```javascript
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

pool.getConnection()
  .then(connection => {
    console.log('数据库连接成功');
    connection.release();
  })
  .catch(err => {
    console.error('数据库连接失败:', err.message);
  });

module.exports = pool;
```

**知识点解析：**
- 使用连接池提高性能
- 支持异步操作（promise）
- 连接保活机制

### 5.2 环境变量配置

**案例：.env.example**

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=library_system
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRES_IN=24h
LOG_LEVEL=info
```

**知识点解析：**
- 敏感信息不硬编码
- 不同环境使用不同配置
- 通过`process.env`访问

### 5.3 基本CRUD操作

**案例：图书管理**

```javascript
const pool = require('../config/database');

router.get('/', async (req, res) => {
  try {
    const [books] = await pool.query('SELECT * FROM books');
    res.json({ code: 200, data: books });
  } catch (error) {
    res.status(500).json({ code: 500, msg: '查询失败' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { isbn, title, author } = req.body;
    await pool.query(
      'INSERT INTO books (isbn, title, author) VALUES (?, ?, ?)',
      [isbn, title, author]
    );
    res.json({ code: 200, msg: '创建成功' });
  } catch (error) {
    res.status(500).json({ code: 500, msg: '创建失败' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author } = req.body;
    await pool.query(
      'UPDATE books SET title = ?, author = ? WHERE id = ?',
      [title, author, id]
    );
    res.json({ code: 200, msg: '更新成功' });
  } catch (error) {
    res.status(500).json({ code: 500, msg: '更新失败' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM books WHERE id = ?', [id]);
    res.json({ code: 200, msg: '删除成功' });
  } catch (error) {
    res.status(500).json({ code: 500, msg: '删除失败' });
  }
});
```

### 5.4 复杂查询

**案例：带条件的分页查询**

```javascript
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const offset = (page - 1) * pageSize;

    let whereClause = ' WHERE 1=1';
    const params = [];

    if (req.query.title) {
      whereClause += ' AND title LIKE ?';
      params.push(`%${req.query.title}%`);
    }

    if (req.query.category_id) {
      whereClause += ' AND category_id = ?';
      params.push(req.query.category_id);
    }

    const [books] = await pool.query(
      `SELECT b.*, c.category_name 
       FROM books b 
       LEFT JOIN categories c ON b.category_id = c.id
       ${whereClause} 
       ORDER BY b.created_at DESC 
       LIMIT ? OFFSET ?`,
      [...params, pageSize, offset]
    );

    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total FROM books b${whereClause}`,
      params
    );

    res.json({
      code: 200,
      msg: '获取图书列表成功',
      data: {
        list: books,
        total: countResult[0].total,
        page,
        pageSize
      }
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      msg: '获取图书列表失败',
      data: null
    });
  }
});
```

**知识点解析：**
- 动态构建WHERE子句
- 参数化查询防止SQL注入
- 分页计算
- JOIN查询
- 统计总数

### 5.5 事务处理

**案例：借阅图书**

```javascript
router.post('/borrow', authMiddleware, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { reader_id, book_id } = req.body;
    const operator_id = req.user.id;

    const [readers] = await connection.query(
      'SELECT * FROM reader_info WHERE reader_no = ?',
      [reader_id]
    );

    if (readers.length === 0) {
      await connection.rollback();
      return res.status(404).json({ msg: '读者不存在' });
    }

    const [books] = await connection.query(
      'SELECT * FROM books WHERE id = ?',
      [book_id]
    );

    if (books[0].available_count <= 0) {
      await connection.rollback();
      return res.status(400).json({ msg: '图书库存不足' });
    }

    const borrow_no = 'B' + Date.now() + Math.floor(Math.random() * 1000);
    const borrow_date = new Date();
    const due_date = new Date(borrow_date);
    due_date.setDate(due_date.getDate() + 30);

    await connection.query(
      'INSERT INTO borrow_records (borrow_no, reader_id, book_id, borrow_date, due_date, operator_id) VALUES (?, ?, ?, ?, ?, ?)',
      [borrow_no, reader_id, book_id, borrow_date, due_date, operator_id]
    );

    await connection.query(
      'UPDATE books SET available_count = available_count - 1 WHERE id = ?',
      [book_id]
    );

    await connection.commit();

    res.json({
      code: 200,
      msg: '借阅成功',
      data: { borrow_no, due_date }
    });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ code: 500, msg: '借阅失败' });
  } finally {
    connection.release();
  }
});
```

**知识点解析：**
- 获取连接
- 开始事务
- 提交事务
- 回滚事务
- 释放连接
- finally确保连接释放

---

## 第六章：用户认证与授权

### 6.1 用户注册

**案例：routes/auth.js**

```javascript
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

router.post('/register', [
  body('username').notEmpty().withMessage('用户名不能为空')
    .isLength({ min: 3, max: 50 }).withMessage('用户名长度3-50位'),
  body('password').notEmpty().withMessage('密码不能为空')
    .isLength({ min: 6 }).withMessage('密码长度至少6位'),
  body('realName').notEmpty().withMessage('真实姓名不能为空')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        code: 400,
        msg: '参数验证失败',
        data: errors.array()
      });
    }

    const { username, password, realName, phone, role } = req.body;

    const [existingUsers] = await pool.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        code: 400,
        msg: '用户名已存在',
        data: null
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      'INSERT INTO users (username, password, role, real_name, phone) VALUES (?, ?, ?, ?, ?)',
      [username, hashedPassword, role || 'librarian', realName, phone || null]
    );

    res.json({
      code: 200,
      msg: '注册成功',
      data: {
        userId: result.insertId,
        username,
        role: role || 'librarian',
        realName
      }
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      msg: '注册失败',
      data: null
    });
  }
});
```

**知识点解析：**

1. **参数验证**
```javascript
const { body, validationResult } = require('express-validator');

router.post('/register', [
  body('username').notEmpty().withMessage('用户名不能为空'),
  body('password').isLength({ min: 6 }).withMessage('密码长度至少6位')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ data: errors.array() });
  }
});
```

2. **密码加密**
```javascript
const bcrypt = require('bcryptjs');
const hashedPassword = await bcrypt.hash(password, 10);
```
- 使用bcrypt进行密码哈希
- 10是盐值轮数

3. **检查用户是否存在**
```javascript
const [existingUsers] = await pool.query(
  'SELECT * FROM users WHERE username = ?',
  [username]
);
```

### 6.2 用户登录

**案例：登录接口**

```javascript
router.post('/login', [
  body('username').notEmpty().withMessage('用户名不能为空'),
  body('password').notEmpty().withMessage('密码不能为空')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        code: 400,
        msg: '参数验证失败',
        data: errors.array()
      });
    }

    const { username, password } = req.body;

    const [users] = await pool.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (users.length === 0) {
      return res.status(401).json({
        code: 401,
        msg: '用户名或密码错误',
        data: null
      });
    }

    const user = users[0];

    if (user.status === 0) {
      return res.status(403).json({
        code: 403,
        msg: '账号已被禁用',
        data: null
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        code: 401,
        msg: '用户名或密码错误',
        data: null
      });
    }

    const [sessionResult] = await pool.query(
      'INSERT INTO login_sessions (user_id, username, ip_address, user_agent) VALUES (?, ?, ?, ?)',
      [user.id, user.username, req.ip, req.headers['user-agent']]
    );

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
        realName: user.real_name,
        sessionId: sessionResult.insertId
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    await pool.query(
      'INSERT INTO operation_logs (user_id, username, module, action, description, ip_address) VALUES (?, ?, ?, ?, ?, ?)',
      [user.id, user.username, 'auth', 'login', '用户登录', req.ip]
    );

    res.json({
      code: 200,
      msg: '登录成功',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          realName: user.real_name,
          phone: user.phone
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      msg: '登录失败',
      data: null
    });
  }
});
```

**知识点解析：**

1. **验证密码**
```javascript
const isPasswordValid = await bcrypt.compare(password, user.password);
```

2. **生成JWT令牌**
```javascript
const token = jwt.sign(
  { id: user.id, username: user.username, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRES_IN }
);
```
- 载荷（payload）：用户信息
- 密钥（secret）：签名密钥
- 选项（options）：过期时间

3. **记录登录会话**
```javascript
await pool.query(
  'INSERT INTO login_sessions (user_id, username, ip_address, user_agent) VALUES (?, ?, ?, ?)',
  [user.id, user.username, req.ip, req.headers['user-agent']]
);
```

4. **记录操作日志**
```javascript
await pool.query(
  'INSERT INTO operation_logs (user_id, username, module, action, description, ip_address) VALUES (?, ?, ?, ?, ?, ?)',
  [user.id, user.username, 'auth', 'login', '用户登录', req.ip]
);
```

### 6.3 JWT配置

**案例：config/config.js**

```javascript
require('dotenv').config();

module.exports = {
  jwt: {
    secret: process.env.JWT_SECRET || 'library_system_secret_key_2024',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  }
};
```

### 6.4 用户登出

**案例：登出接口**

```javascript
router.post('/logout', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const sessionId = decoded.sessionId;

        if (sessionId) {
          await pool.query(
            `UPDATE login_sessions 
             SET logout_time = CURRENT_TIMESTAMP, 
                 duration = TIMESTAMPDIFF(SECOND, login_time, CURRENT_TIMESTAMP), 
                 status = 'ended' 
             WHERE id = ? AND status = 'active'`,
            [sessionId]
          );

          await pool.query(
            'INSERT INTO operation_logs (user_id, username, module, action, description, ip_address) VALUES (?, ?, ?, ?, ?, ?)',
            [decoded.id, decoded.username, 'auth', 'logout', '用户登出', req.ip]
          );
        }
      } catch (tokenError) {
        console.error('Token验证失败:', tokenError);
      }
    }

    res.json({
      code: 200,
      msg: '登出成功',
      data: null
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      msg: '登出失败',
      data: null
    });
  }
});
```

**知识点解析：**
- 更新登录会话状态
- 计算登录时长
- 记录登出日志

---

## 第七章：错误处理

### 7.1 统一错误处理

**案例：middleware/error.js**

```javascript
const logger = require('../config/logger');

const errorHandler = (err, req, res, next) => {
  logger.error('发生错误:', err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      code: 400,
      msg: '参数验证失败',
      data: err.errors
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      code: 401,
      msg: '未授权访问',
      data: null
    });
  }

  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      code: 409,
      msg: '数据已存在',
      data: null
    });
  }

  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({
      code: 400,
      msg: '关联数据不存在',
      data: null
    });
  }

  res.status(500).json({
    code: 500,
    msg: err.message || '服务器内部错误',
    data: null
  });
};

const notFoundHandler = (req, res) => {
  res.status(404).json({
    code: 404,
    msg: '请求的资源不存在',
    data: null
  });
};

module.exports = {
  errorHandler,
  notFoundHandler
};
```

**知识点解析：**

1. **验证错误**
```javascript
if (err.name === 'ValidationError') {
  return res.status(400).json({
    code: 400,
    msg: '参数验证失败',
    data: err.errors
  });
}
```

2. **未授权错误**
```javascript
if (err.name === 'UnauthorizedError') {
  return res.status(401).json({
    code: 401,
    msg: '未授权访问',
    data: null
  });
}
```

3. **数据库错误**
```javascript
if (err.code === 'ER_DUP_ENTRY') {
  return res.status(409).json({
    code: 409,
    msg: '数据已存在',
    data: null
  });
}
```

4. **404处理**
```javascript
const notFoundHandler = (req, res) => {
  res.status(404).json({
    code: 404,
    msg: '请求的资源不存在',
    data: null
  });
};
```

### 7.2 路由中的错误处理

**案例：try-catch模式**

```javascript
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [books] = await pool.query(
      'SELECT * FROM books WHERE id = ?',
      [id]
    );

    if (books.length === 0) {
      return res.status(404).json({
        code: 404,
        msg: '图书不存在',
        data: null
      });
    }

    res.json({
      code: 200,
      msg: '获取图书信息成功',
      data: books[0]
    });
  } catch (error) {
    logger.error('获取图书信息失败:', error);
    res.status(500).json({
      code: 500,
      msg: '获取图书信息失败',
      data: null
    });
  }
});
```

**知识点解析：**
- try-catch捕获异步错误
- 记录错误日志
- 返回友好的错误信息

---

## 第八章：日志系统

### 8.1 Winston日志库

**案例：config/logger.js**

```javascript
const winston = require('winston');
const path = require('path');
require('dotenv').config();

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    if (stack) {
      return `${timestamp} [${level.toUpperCase()}]: ${message}\n${stack}`;
    }
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
  })
);

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        logFormat
      )
    }),
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/error.log'),
      level: 'error',
      maxsize: 5242880,
      maxFiles: 5
    }),
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/combined.log'),
      maxsize: 5242880,
      maxFiles: 5
    })
  ]
});

module.exports = logger;
```

**知识点解析：**

1. **日志格式**
```javascript
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    if (stack) {
      return `${timestamp} [${level.toUpperCase()}]: ${message}\n${stack}`;
    }
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
  })
);
```
- 时间戳
- 错误堆栈
- 自定义输出格式

2. **日志传输（Transports）**
```javascript
transports: [
  new winston.transports.Console(),  // 控制台输出
  new winston.transports.File({     // 文件输出
    filename: path.join(__dirname, '../logs/error.log'),
    level: 'error',
    maxsize: 5242880,
    maxFiles: 5
  })
]
```
- Console: 控制台
- File: 文件
- maxsize: 最大文件大小
- maxFiles: 最大文件数

3. **日志级别**
```javascript
level: process.env.LOG_LEVEL || 'info'
```
- error: 错误
- warn: 警告
- info: 信息
- debug: 调试

### 8.2 使用日志

**案例：在路由中使用日志**

```javascript
const logger = require('../config/logger');

router.get('/', async (req, res) => {
  try {
    logger.info('获取图书列表');
    const [books] = await pool.query('SELECT * FROM books');
    res.json({ code: 200, data: books });
  } catch (error) {
    logger.error('获取图书列表失败:', error);
    res.status(500).json({ code: 500, msg: '查询失败' });
  }
});
```

**知识点解析：**
- `logger.info()`: 信息日志
- `logger.error()`: 错误日志
- `logger.warn()`: 警告日志
- `logger.debug()`: 调试日志

---

## 第九章：文件上传

### 9.1 Multer中间件

**案例：config/multer.js**

```javascript
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../../uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = 'book-' + uniqueSuffix + path.extname(file.originalname);
    cb(null, filename);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('只允许上传图片文件 (jpeg, jpg, png, gif, webp)'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: fileFilter
});

module.exports = upload;
```

**知识点解析：**

1. **存储配置**
```javascript
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = 'book-' + uniqueSuffix + path.extname(file.originalname);
    cb(null, filename);
  }
});
```
- destination: 存储目录
- filename: 文件名生成

2. **文件过滤**
```javascript
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('只允许上传图片文件'));
  }
};
```
- 检查文件扩展名
- 检查MIME类型

3. **限制配置**
```javascript
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: fileFilter
});
```
- fileSize: 最大文件大小（5MB）

### 9.2 使用文件上传

**案例：上传图书封面**

```javascript
const upload = require('../config/multer');

router.post('/upload', upload.single('cover'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        code: 400,
        msg: '请选择要上传的文件',
        data: null
      });
    }

    const coverUrl = `/uploads/${req.file.filename}`;

    res.json({
      code: 200,
      msg: '上传成功',
      data: {
        url: coverUrl,
        filename: req.file.filename
      }
    });
  } catch (error) {
    logger.error('上传失败:', error);
    res.status(500).json({
      code: 500,
      msg: '上传失败',
      data: null
    });
  }
});
```

**知识点解析：**
- `upload.single('cover')`: 单文件上传
- `req.file`: 上传的文件信息
- 返回文件URL

---

## 第十章：数据导出

### 10.1 Excel导出

**案例：routes/statistics.js**

```javascript
const ExcelJS = require('exceljs');

router.get('/export/borrow-records', authMiddleware, async (req, res) => {
  try {
    const { start_date, end_date, status } = req.query;

    let whereClause = 'WHERE 1=1';
    const params = [];

    if (start_date) {
      whereClause += ' AND br.borrow_date >= ?';
      params.push(start_date);
    }

    if (end_date) {
      whereClause += ' AND br.borrow_date <= ?';
      params.push(end_date);
    }

    if (status) {
      whereClause += ' AND br.status = ?';
      params.push(status);
    }

    const [records] = await pool.query(
      `SELECT br.borrow_no, ri.reader_no, ri.name as reader_name, 
              b.isbn, b.title as book_title, b.author, 
              br.borrow_date, br.due_date, br.return_date, 
              br.status, br.overdue_days, br.fine_amount
       FROM borrow_records br
       LEFT JOIN reader_info ri ON br.reader_id = ri.reader_no
       LEFT JOIN books b ON br.book_id = b.id
       ${whereClause}
       ORDER BY br.borrow_date DESC`,
      params
    );

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('借阅记录');

    worksheet.columns = [
      { header: '借阅编号', key: 'borrow_no', width: 20 },
      { header: '读者编号', key: 'reader_no', width: 15 },
      { header: '读者姓名', key: 'reader_name', width: 15 },
      { header: 'ISBN', key: 'isbn', width: 15 },
      { header: '图书名称', key: 'book_title', width: 30 },
      { header: '作者', key: 'author', width: 15 },
      { header: '借阅时间', key: 'borrow_date', width: 20 },
      { header: '应还时间', key: 'due_date', width: 20 },
      { header: '归还时间', key: 'return_date', width: 20 },
      { header: '状态', key: 'status', width: 10 },
      { header: '逾期天数', key: 'overdue_days', width: 10 },
      { header: '罚款金额', key: 'fine_amount', width: 10 }
    ];

    const statusMap = {
      'borrowed': '借阅中',
      'returned': '已归还',
      'overdue': '已逾期'
    };

    records.forEach(record => {
      worksheet.addRow({
        borrow_no: record.borrow_no,
        reader_no: record.reader_no,
        reader_name: record.reader_name,
        isbn: record.isbn,
        book_title: record.book_title,
        author: record.author,
        borrow_date: record.borrow_date ? new Date(record.borrow_date).toLocaleString('zh-CN') : '',
        due_date: record.due_date ? new Date(record.due_date).toLocaleString('zh-CN') : '',
        return_date: record.return_date ? new Date(record.return_date).toLocaleString('zh-CN') : '',
        status: statusMap[record.status] || record.status,
        overdue_days: record.overdue_days || 0,
        fine_amount: record.fine_amount || 0
      });
    });

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };

    const fileName = `借阅记录_${new Date().getTime()}.xlsx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${encodeURIComponent(fileName)}`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    logger.error('导出借阅记录失败:', error);
    res.status(500).json({
      code: 500,
      msg: '导出借阅记录失败',
      data: null
    });
  }
});
```

**知识点解析：**

1. **创建工作簿**
```javascript
const workbook = new ExcelJS.Workbook();
const worksheet = workbook.addWorksheet('借阅记录');
```

2. **设置列**
```javascript
worksheet.columns = [
  { header: '借阅编号', key: 'borrow_no', width: 20 },
  { header: '读者编号', key: 'reader_no', width: 15 }
];
```

3. **添加数据**
```javascript
records.forEach(record => {
  worksheet.addRow({
    borrow_no: record.borrow_no,
    reader_no: record.reader_no
  });
});
```

4. **设置样式**
```javascript
worksheet.getRow(1).font = { bold: true };
worksheet.getRow(1).fill = {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: 'FFE0E0E0' }
};
```

5. **发送文件**
```javascript
res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
res.setHeader('Content-Disposition', `attachment; filename=${encodeURIComponent(fileName)}`);
await workbook.xlsx.write(res);
```

---

## 第十一章：项目实战

### 11.1 项目结构

```
backend/
├── src/
│   ├── config/          # 配置文件
│   │   ├── config.js    # 系统配置
│   │   ├── database.js  # 数据库配置
│   │   ├── logger.js    # 日志配置
│   │   └── multer.js    # 文件上传配置
│   ├── controllers/     # 控制器
│   ├── middleware/      # 中间件
│   │   ├── auth.js      # 认证中间件
│   │   ├── error.js     # 错误处理
│   │   └── log.js       # 日志中间件
│   ├── routes/          # 路由
│   │   ├── index.js     # 路由索引
│   │   ├── auth.js      # 认证路由
│   │   ├── books.js     # 图书路由
│   │   ├── borrow.js    # 借阅路由
│   │   └── statistics.js # 统计路由
│   └── app.js           # 应用入口
├── uploads/             # 上传文件目录
├── logs/                # 日志文件目录
├── .env.example         # 环境变量示例
├── package.json         # 项目配置
└── server.js            # 服务器启动文件
```

### 11.2 完整的API示例

**案例：借阅管理API**

```javascript
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const logger = require('../config/logger');
const { authMiddleware } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const offset = (page - 1) * pageSize;

    let whereClause = ' WHERE 1=1';
    const params = [];

    if (req.query.borrow_no) {
      whereClause += ' AND br.borrow_no LIKE ?';
      params.push(`%${req.query.borrow_no}%`);
    }

    if (req.query.reader_name) {
      whereClause += ' AND ri.name LIKE ?';
      params.push(`%${req.query.reader_name}%`);
    }

    if (req.query.status) {
      whereClause += ' AND br.status = ?';
      params.push(req.query.status);
    }

    const [records] = await pool.query(
      `SELECT br.*, ri.name as reader_name, ri.reader_no, 
              b.title as book_title, b.isbn, u.real_name as operator_name 
       FROM borrow_records br
       LEFT JOIN reader_info ri ON br.reader_id = ri.reader_no
       LEFT JOIN books b ON br.book_id = b.id
       LEFT JOIN users u ON br.operator_id = u.id
       ${whereClause}
       ORDER BY br.borrow_date DESC
       LIMIT ? OFFSET ?`,
      [...params, pageSize, offset]
    );

    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total FROM borrow_records br
       LEFT JOIN reader_info ri ON br.reader_id = ri.reader_no
       LEFT JOIN books b ON br.book_id = b.id
       ${whereClause}`,
      params
    );

    res.json({
      code: 200,
      msg: '获取借阅记录成功',
      data: {
        list: records,
        total: countResult[0].total,
        page,
        pageSize
      }
    });
  } catch (error) {
    logger.error('获取借阅记录失败:', error);
    res.status(500).json({
      code: 500,
      msg: '获取借阅记录失败',
      data: null
    });
  }
});

router.post('/borrow', authMiddleware, [
  body('reader_id').notEmpty().withMessage('读者ID不能为空'),
  body('book_id').notEmpty().withMessage('图书ID不能为空')
], async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await connection.rollback();
      return res.status(400).json({
        code: 400,
        msg: '参数验证失败',
        data: errors.array()
      });
    }

    const { reader_id, book_id } = req.body;
    const operator_id = req.user.id;

    const [readers] = await connection.query(
      'SELECT * FROM reader_info WHERE reader_no = ?',
      [reader_id]
    );

    if (readers.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        code: 404,
        msg: '读者不存在',
        data: null
      });
    }

    const reader = readers[0];

    if (reader.credit_status !== 'good' && reader.credit_status !== 'normal') {
      await connection.rollback();
      return res.status(400).json({
        code: 400,
        msg: '读者信用状态异常，无法借阅',
        data: null
      });
    }

    const [borrowCount] = await connection.query(
      'SELECT COUNT(*) as count FROM borrow_records WHERE reader_id = ? AND status = "borrowed"',
      [reader_id]
    );

    if (borrowCount[0].count >= 5) {
      await connection.rollback();
      return res.status(400).json({
        code: 400,
        msg: '已达到最大借阅册数限制',
        data: null
      });
    }

    const [books] = await connection.query(
      'SELECT * FROM books WHERE id = ?',
      [book_id]
    );

    if (books.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        code: 404,
        msg: '图书不存在',
        data: null
      });
    }

    const book = books[0];

    if (book.available_count <= 0) {
      await connection.rollback();
      return res.status(400).json({
        code: 400,
        msg: '图书库存不足',
        data: null
      });
    }

    if (book.status === 0) {
      await connection.rollback();
      return res.status(400).json({
        code: 400,
        msg: '图书已下架',
        data: null
      });
    }

    const borrow_no = 'B' + Date.now() + Math.floor(Math.random() * 1000);
    const borrow_date = new Date();
    const due_date = new Date(borrow_date);
    due_date.setDate(due_date.getDate() + 30);

    await connection.query(
      'INSERT INTO borrow_records (borrow_no, reader_id, book_id, borrow_date, due_date, operator_id) VALUES (?, ?, ?, ?, ?, ?)',
      [borrow_no, reader_id, book_id, borrow_date, due_date, operator_id]
    );

    await connection.query(
      'UPDATE books SET available_count = available_count - 1, borrow_count = borrow_count + 1 WHERE id = ?',
      [book_id]
    );

    await connection.commit();

    res.json({
      code: 200,
      msg: '借阅成功',
      data: {
        borrow_no,
        due_date
      }
    });
  } catch (error) {
    await connection.rollback();
    logger.error('借阅失败:', error);
    res.status(500).json({
      code: 500,
      msg: '借阅失败',
      data: null
    });
  } finally {
    connection.release();
  }
});

router.post('/return', authMiddleware, [
  body('borrow_no').notEmpty().withMessage('借阅编号不能为空')
], async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await connection.rollback();
      return res.status(400).json({
        code: 400,
        msg: '参数验证失败',
        data: errors.array()
      });
    }

    const { borrow_no } = req.body;
    const operator_id = req.user.id;

    const [records] = await connection.query(
      'SELECT * FROM borrow_records WHERE borrow_no = ? AND status = "borrowed"',
      [borrow_no]
    );

    if (records.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        code: 404,
        msg: '借阅记录不存在或已归还',
        data: null
      });
    }

    const record = records[0];
    const return_date = new Date();

    let overdue_days = 0;
    let fine_amount = 0;

    if (return_date > record.due_date) {
      const diffTime = Math.abs(return_date - record.due_date);
      overdue_days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      fine_amount = overdue_days * 0.5;
    }

    await connection.query(
      'UPDATE borrow_records SET return_date = ?, status = "returned", overdue_days = ?, fine_amount = ?, operator_id = ? WHERE borrow_no = ?',
      [return_date, overdue_days, fine_amount, operator_id, borrow_no]
    );

    await connection.query(
      'UPDATE reader_info SET arrears_amount = arrears_amount + ? WHERE reader_no = ?',
      [fine_amount, record.reader_id]
    );

    await connection.query(
      'UPDATE books SET available_count = available_count + 1 WHERE id = ?',
      [record.book_id]
    );

    if (fine_amount > 0) {
      await connection.query(
        'UPDATE reader_info SET credit_status = "debt" WHERE reader_no = ?',
        [record.reader_id]
      );
    }

    await connection.commit();

    res.json({
      code: 200,
      msg: '归还成功',
      data: {
        overdue_days,
        fine_amount
      }
    });
  } catch (error) {
    await connection.rollback();
    logger.error('归还失败:', error);
    res.status(500).json({
      code: 500,
      msg: '归还失败',
      data: null
    });
  } finally {
    connection.release();
  }
});

module.exports = router;
```

### 11.3 统计分析API

**案例：dashboard统计**

```javascript
router.get('/dashboard', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    
    const [totalReaders] = await pool.query('SELECT COUNT(*) as count FROM reader_info');
    const [totalBooks] = await pool.query('SELECT COUNT(*) as count FROM books WHERE status = 1');
    const [totalBorrowed] = await pool.query('SELECT COUNT(*) as count FROM borrow_records WHERE status = "borrowed"');
    const [totalOverdue] = await pool.query('SELECT COUNT(*) as count FROM borrow_records WHERE status = "borrowed" AND due_date < NOW()');

    const [categoryStats] = await pool.query(
      `SELECT c.category_name, COUNT(br.id) as borrow_count 
       FROM categories c 
       LEFT JOIN books b ON c.id = b.category_id
       LEFT JOIN borrow_records br ON b.id = br.book_id AND br.borrow_date >= DATE_SUB(NOW(), INTERVAL ? DAY)
       GROUP BY c.id, c.category_name
       ORDER BY borrow_count DESC`,
      [days]
    );

    const [borrowTrend] = await pool.query(
      `SELECT DATE(borrow_date) as date, 
              COUNT(*) as total_count,
              COUNT(CASE WHEN status = 'borrowed' THEN 1 END) as borrowed_count,
              COUNT(CASE WHEN status = 'returned' THEN 1 END) as returned_count,
              COUNT(CASE WHEN status = 'overdue' THEN 1 END) as overdue_count
       FROM borrow_records 
       WHERE borrow_date >= DATE_SUB(NOW(), INTERVAL ? DAY)
       GROUP BY DATE(borrow_date)
       ORDER BY date ASC`,
      [days]
    );

    const [hotBooks] = await pool.query(
      `SELECT b.id, b.isbn, b.title, b.author, c.category_name, b.borrow_count, b.available_count, b.total_count
       FROM books b
       LEFT JOIN categories c ON b.category_id = c.id
       WHERE b.status = 1
       ORDER BY b.borrow_count DESC
       LIMIT 10`
    );

    res.json({
      code: 200,
      msg: '获取统计数据成功',
      data: {
        totalReaders: totalReaders[0].count,
        totalBooks: totalBooks[0].count,
        totalBorrowed: totalBorrowed[0].count,
        totalOverdue: totalOverdue[0].count,
        categoryStats,
        borrowTrend,
        hotBooks
      }
    });
  } catch (error) {
    logger.error('获取统计数据失败:', error);
    res.status(500).json({
      code: 500,
      msg: '获取统计数据失败',
      data: null
    });
  }
});
```

### 11.4 最佳实践总结

**1. 项目结构**
- 模块化设计
- 分层架构（路由-控制器-模型）
- 配置集中管理

**2. 错误处理**
- 统一错误处理中间件
- try-catch捕获异步错误
- 友好的错误信息

**3. 日志记录**
- 使用Winston日志库
- 分级日志（error, warn, info, debug）
- 日志文件轮转

**4. 安全性**
- JWT认证
- 密码加密（bcrypt）
- 参数验证（express-validator）
- SQL注入防护（参数化查询）

**5. 数据库操作**
- 使用连接池
- 事务处理
- 错误回滚
- 连接释放

**6. 代码规范**
- 清晰的注释
- 一致的命名规范
- 模块化设计
- 错误处理

---

## 附录

### A. 常用npm包

```json
{
  "express": "Web框架",
  "mysql2": "MySQL数据库驱动",
  "jsonwebtoken": "JWT认证",
  "bcryptjs": "密码加密",
  "cors": "跨域处理",
  "winston": "日志记录",
  "multer": "文件上传",
  "express-validator": "参数验证",
  "dotenv": "环境变量",
  "exceljs": "Excel导出"
}
```

### B. HTTP状态码

```javascript
200 OK - 请求成功
201 Created - 资源创建成功
400 Bad Request - 请求参数错误
401 Unauthorized - 未授权
403 Forbidden - 禁止访问
404 Not Found - 资源不存在
409 Conflict - 资源冲突
500 Internal Server Error - 服务器内部错误
```

### C. RESTful API设计规范

```
GET    /api/books        - 获取图书列表
GET    /api/books/:id    - 获取图书详情
POST   /api/books        - 创建图书
PUT    /api/books/:id    - 更新图书
DELETE /api/books/:id    - 删除图书
```

---

## 结语

通过本书的学习，你已经掌握了Node.js和Express的核心知识，并通过图书馆管理系统这个实战项目，深入理解了如何构建一个完整的后端应用。

**学习建议：**
1. 多动手实践，修改和扩展项目功能
2. 阅读官方文档，深入了解各个模块
3. 参与开源项目，学习优秀的代码风格
4. 持续学习新技术，保持技术敏感度

**进阶方向：**
- 学习TypeScript
- 掌握GraphQL
- 了解微服务架构
- 学习容器化部署（Docker）
- 掌握CI/CD流程

祝你编程愉快！
