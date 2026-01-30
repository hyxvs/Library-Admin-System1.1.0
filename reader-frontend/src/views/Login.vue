<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-form-wrapper">
        <h2 class="login-title">图书馆读者系统</h2>
        <h3 class="login-subtitle">用户登录</h3>
        
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginFormRules"
          label-width="80px"
          class="login-form"
        >
          <el-form-item label="登录方式">
            <el-radio-group v-model="loginType">
              <el-radio label="username">用户名登录</el-radio>
              <el-radio label="readerNo">读者号登录</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="用户名" v-if="loginType === 'username'" prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="请输入用户名"
              clearable
              prefix-icon="el-icon-user"
            />
          </el-form-item>

          <el-form-item label="读者号" v-if="loginType === 'readerNo'" prop="readerNo">
            <el-input
              v-model="loginForm.readerNo"
              placeholder="请输入读者号"
              clearable
              prefix-icon="el-icon-document"
            />
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              show-password
              prefix-icon="el-icon-lock"
            />
          </el-form-item>

          <el-form-item>
            <el-checkbox v-model="loginForm.remember">30天内记住登录</el-checkbox>
            <router-link to="/forgot-password" class="forgot-password">忘记密码？</router-link>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              class="login-button"
              :loading="loginLoading"
              @click="handleLogin"
            >
              登录
            </el-button>
          </el-form-item>

          <el-form-item class="register-link">
            <span>还没有账号？</span>
            <router-link to="/register">立即注册</router-link>
          </el-form-item>
        </el-form>
      </div>

      <div class="login-illustration">
        <img 
          src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20library%20interior%20with%20people%20reading%20books%2C%20bright%20lighting%2C%20clean%20design%2C%203D%20rendering&image_size=landscape_16_9" 
          alt="图书馆"
          class="illustration-image"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const loginFormRef = ref(null)
const loginLoading = ref(false)
const loginType = ref('username')

const loginForm = reactive({
  username: '',
  readerNo: '',
  password: '',
  remember: false
})

const loginFormRules = {
  username: [
    {
      required: loginType.value === 'username',
      message: '请输入用户名',
      trigger: 'blur'
    }
  ],
  readerNo: [
    {
      required: loginType.value === 'readerNo',
      message: '请输入读者号',
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
      max: 20,
      message: '密码长度为6-20位',
      trigger: 'blur'
    }
  ]
}

const handleLogin = async () => {
  try {
    await loginFormRef.value.validate()
    loginLoading.value = true

    const loginData = {
      password: loginForm.password,
      remember: loginForm.remember
    }

    if (loginType.value === 'username') {
      loginData.username = loginForm.username
    } else {
      loginData.reader_no = loginForm.readerNo
    }

    const res = await userStore.loginUser(loginData)
    
    if (res.code === 200) {
      ElMessage.success('登录成功')
      router.push('/home')
    } else {
      ElMessage.error(res.msg || '登录失败')
    }
  } catch (error) {
    if (error !== false) {
      ElMessage.error('登录失败')
    }
  } finally {
    loginLoading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
}

.login-container {
  display: flex;
  width: 900px;
  max-width: 90%;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.login-form-wrapper {
  flex: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
}

.login-title {
  font-size: 24px;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 10px;
}

.login-subtitle {
  font-size: 18px;
  color: #606266;
  margin-bottom: 30px;
}

.login-form {
  flex: 1;
}

.login-button {
  width: 100%;
  height: 40px;
  font-size: 16px;
}

.register-link {
  text-align: center;
  margin-top: 20px;
}

.register-link a {
  color: #409eff;
  text-decoration: none;
  margin-left: 5px;
}

.register-link a:hover {
  text-decoration: underline;
}

.forgot-password {
  float: right;
  color: #409eff;
  text-decoration: none;
}

.forgot-password:hover {
  text-decoration: underline;
}

.login-illustration {
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
  .login-container {
    flex-direction: column;
  }

  .login-illustration {
    order: -1;
    height: 200px;
  }

  .login-form-wrapper {
    padding: 20px;
  }
}
</style>
