<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-form-wrapper">
        <h2 class="register-title">图书馆管理系统</h2>
        <h3 class="register-subtitle">用户注册</h3>
        
        <el-form
          ref="registerFormRef"
          :model="registerForm"
          :rules="registerFormRules"
          label-width="100px"
          class="register-form"
        >
          <el-form-item label="用户名" prop="username">
            <el-input
              v-model="registerForm.username"
              placeholder="请输入用户名"
              clearable
              prefix-icon="el-icon-user"
            />
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input
              v-model="registerForm.password"
              type="password"
              placeholder="请输入密码"
              show-password
              prefix-icon="el-icon-lock"
            />
          </el-form-item>

          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input
              v-model="registerForm.confirmPassword"
              type="password"
              placeholder="请确认密码"
              show-password
              prefix-icon="el-icon-lock"
            />
          </el-form-item>

          <el-form-item label="真实姓名" prop="realName">
            <el-input
              v-model="registerForm.realName"
              placeholder="请输入真实姓名"
              clearable
              prefix-icon="el-icon-user-solid"
            />
          </el-form-item>

          <el-form-item label="手机号" prop="phone">
            <el-input
              v-model="registerForm.phone"
              placeholder="请输入手机号"
              clearable
              prefix-icon="el-icon-phone"
            />
          </el-form-item>

          <el-form-item label="角色" prop="role">
            <el-radio-group v-model="registerForm.role">
              <el-radio label="librarian">图书管理员</el-radio>
              <el-radio label="admin">系统管理员</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              class="register-button"
              :loading="registerLoading"
              @click="handleRegister"
            >
              注册
            </el-button>
          </el-form-item>

          <el-form-item class="login-link">
            <span>已有账号？</span>
            <router-link to="/login">立即登录</router-link>
          </el-form-item>
        </el-form>
      </div>

      <div class="register-illustration">
        <img 
          src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20library%20management%20system%20registration%20illustration%2C%20professional%20design%2C%20clean%20interface%2C%203D%20rendering&image_size=landscape_16_9" 
          alt="图书馆管理系统"
          class="illustration-image"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'

const router = useRouter()
const registerFormRef = ref(null)
const registerLoading = ref(false)

const registerForm = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  realName: '',
  phone: '',
  role: 'librarian'
})

const registerFormRules = {
  username: [
    {
      required: true,
      message: '请输入用户名',
      trigger: 'blur'
    },
    {
      min: 3,
      max: 50,
      message: '用户名长度3-50位',
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur'
    },
    {
      min: 6,
      message: '密码长度至少6位',
      trigger: 'blur'
    }
  ],
  confirmPassword: [
    {
      required: true,
      message: '请确认密码',
      trigger: 'blur'
    },
    {
      validator: (rule, value, callback) => {
        if (value !== registerForm.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  realName: [
    {
      required: true,
      message: '请输入真实姓名',
      trigger: 'blur'
    }
  ],
  phone: [
    {
      pattern: /^1[3-9]\d{9}$/,
      message: '请输入正确的手机号',
      trigger: 'blur',
      required: false
    }
  ],
  role: [
    {
      required: true,
      message: '请选择角色',
      trigger: 'change'
    }
  ]
}

const handleRegister = async () => {
  try {
    await registerFormRef.value.validate()
    registerLoading.value = true

    const registerData = {
      username: registerForm.username,
      password: registerForm.password,
      realName: registerForm.realName,
      phone: registerForm.phone,
      role: registerForm.role
    }

    const res = await request({
      url: '/auth/register',
      method: 'post',
      data: registerData
    })
    
    if (res.code === 200) {
      ElMessage.success('注册成功，请登录')
      router.push('/login')
    } else {
      ElMessage.error(res.msg || '注册失败')
    }
  } catch (error) {
    if (error !== false) {
      ElMessage.error('注册失败')
    }
  } finally {
    registerLoading.value = false
  }
}

// 生命周期
onMounted(() => {
  // 应用暗黑模式
  const isDarkMode = localStorage.getItem('theme') === 'dark'
  if (isDarkMode) {
    document.documentElement.classList.add('dark')
  }
})
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
}

.register-container {
  display: flex;
  width: 900px;
  max-width: 90%;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.register-form-wrapper {
  flex: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
}

.register-title {
  font-size: 24px;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 10px;
}

.register-subtitle {
  font-size: 18px;
  color: #606266;
  margin-bottom: 30px;
}

.register-form {
  flex: 1;
}

.register-button {
  width: 100%;
  height: 40px;
  font-size: 16px;
}

.login-link {
  text-align: center;
  margin-top: 20px;
}

.login-link a {
  color: #409eff;
  text-decoration: none;
  margin-left: 5px;
}

.login-link a:hover {
  text-decoration: underline;
}

.register-illustration {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f9ff;
  padding: 20px;
}

.illustration-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .register-container {
    flex-direction: column;
  }

  .register-illustration {
    order: -1;
    height: 200px;
  }

  .register-form-wrapper {
    padding: 20px;
  }
}

/* 暗黑模式支持 */
html.dark .register-page {
  background-color: #1d1d1d;
}

html.dark .register-container {
  background-color: #1f2d3d;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

html.dark .register-title {
  color: #409eff;
}

html.dark .register-subtitle {
  color: #bfcbd9;
}

html.dark .register-illustration {
  background-color: #2c3e50;
}

html.dark .login-link {
  color: #8391a5;
}

html.dark .login-link a {
  color: #409eff;
}

html.dark .login-link a:hover {
  color: #66b1ff;
}

html.dark :deep(.el-input__wrapper) {
  background-color: #304156;
  border-color: #409eff;
}

html.dark :deep(.el-input__inner) {
  color: #bfcbd9;
}

html.dark :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px rgba(64, 158, 255, 0.3) inset;
}

html.dark :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #409eff inset;
}

html.dark :deep(.el-form-item__label) {
  color: #bfcbd9;
}

html.dark :deep(.el-radio__label) {
  color: #bfcbd9;
}

html.dark :deep(.el-radio__input.is-checked .el-radio__inner) {
  background-color: #409eff;
  border-color: #409eff;
}

html.dark :deep(.el-button--primary) {
  background-color: #409eff;
  border-color: #409eff;
}

html.dark :deep(.el-button--primary:hover) {
  background-color: #66b1ff;
  border-color: #66b1ff;
}
</style>