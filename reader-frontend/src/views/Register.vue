<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-form-wrapper">
        <h2 class="register-title">图书馆读者系统</h2>
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

          <el-form-item label="读者号" prop="readerNo">
            <el-input
              v-model="registerForm.readerNo"
              placeholder="请输入读者号"
              clearable
              prefix-icon="el-icon-document"
            />
          </el-form-item>

          <el-form-item label="姓名" prop="name">
            <el-input
              v-model="registerForm.name"
              placeholder="请输入姓名"
              clearable
              prefix-icon="el-icon-user"
            />
          </el-form-item>

          <el-form-item label="性别" prop="gender">
            <el-select v-model="registerForm.gender" placeholder="请选择性别">
              <el-option label="男" value="male" />
              <el-option label="女" value="female" />
            </el-select>
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input
              v-model="registerForm.password"
              type="password"
              placeholder="请输入密码（6-20位）"
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

          <el-form-item label="身份证号" prop="idCard">
            <el-input
              v-model="registerForm.idCard"
              placeholder="请输入身份证号"
              clearable
              prefix-icon="el-icon-document-copy"
            />
          </el-form-item>

          <el-form-item label="邮箱" prop="email">
            <el-input
              v-model="registerForm.email"
              placeholder="请输入邮箱（选填）"
              clearable
              prefix-icon="el-icon-message"
            />
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
const registerFormRef = ref(null)
const registerLoading = ref(false)

const registerForm = reactive({
  username: '',
  readerNo: '',
  name: '',
  gender: '',
  password: '',
  confirmPassword: '',
  idCard: '',
  email: ''
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
      max: 20,
      message: '用户名长度为3-20位',
      trigger: 'blur'
    }
  ],
  readerNo: [
    {
      required: true,
      message: '请输入读者号',
      trigger: 'blur'
    }
  ],
  name: [
    {
      required: true,
      message: '请输入姓名',
      trigger: 'blur'
    }
  ],
  gender: [
    {
      required: true,
      message: '请选择性别',
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
  idCard: [
    {
      required: true,
      message: '请输入身份证号',
      trigger: 'blur'
    },
    {
      pattern: /^[1-9]\d{5}(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[0-9Xx]$/,
      message: '请输入正确的身份证号',
      trigger: 'blur'
    }
  ],
  email: [
    {
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: '请输入正确的邮箱地址',
      trigger: 'blur',
      required: false
    }
  ],
}



const handleRegister = async () => {
  try {
    await registerFormRef.value.validate()
    registerLoading.value = true

    // 映射参数名称到后端期望的格式
    const registerData = {
      username: registerForm.username,
      password: registerForm.password,
      confirmPassword: registerForm.confirmPassword,
      name: registerForm.name,
      gender: registerForm.gender,
      reader_no: registerForm.readerNo,
      id_card: registerForm.idCard,
      email: registerForm.email
    }

    const res = await userStore.registerUser(registerData)
    
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
  width: 1000px;
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
</style>
