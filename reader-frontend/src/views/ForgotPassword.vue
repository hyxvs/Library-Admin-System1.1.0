<template>
  <div class="forgot-password-page">
    <div class="forgot-password-container">
      <div class="forgot-password-form-wrapper">
        <h2 class="forgot-password-title">图书馆读者系统</h2>
        <h3 class="forgot-password-subtitle">找回密码</h3>
        
        <el-form
          ref="forgotPasswordFormRef"
          :model="forgotPasswordForm"
          :rules="forgotPasswordFormRules"
          label-width="100px"
          class="forgot-password-form"
        >
          <el-form-item label="手机号" prop="phone">
            <el-input
              v-model="forgotPasswordForm.phone"
              placeholder="请输入手机号"
              clearable
              prefix-icon="el-icon-mobile"
            />
          </el-form-item>

          <el-form-item label="验证码" prop="smsCode">
            <el-input
              v-model="forgotPasswordForm.smsCode"
              placeholder="请输入验证码"
              clearable
              prefix-icon="el-icon-s-finance"
            >
              <template #append>
                <el-button
                  type="primary"
                  :disabled="countdown > 0"
                  @click="sendSmsCode"
                >
                  {{ countdown > 0 ? `${countdown}s后重发` : '获取验证码' }}
                </el-button>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="新密码" prop="password">
            <el-input
              v-model="forgotPasswordForm.password"
              type="password"
              placeholder="请输入新密码（6-20位）"
              show-password
              prefix-icon="el-icon-lock"
            />
          </el-form-item>

          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input
              v-model="forgotPasswordForm.confirmPassword"
              type="password"
              placeholder="请确认新密码"
              show-password
              prefix-icon="el-icon-lock"
            />
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              class="forgot-password-button"
              :loading="resetLoading"
              @click="handleResetPassword"
            >
              重置密码
            </el-button>
          </el-form-item>

          <el-form-item class="login-link">
            <span>想起密码了？</span>
            <router-link to="/login">立即登录</router-link>
          </el-form-item>

          <el-form-item class="register-link">
            <span>还没有账号？</span>
            <router-link to="/register">立即注册</router-link>
          </el-form-item>
        </el-form>
      </div>

      <div class="forgot-password-illustration">
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
import { sendSmsCode as apiSendSmsCode } from '@/api/auth'

const router = useRouter()
const userStore = useUserStore()
const forgotPasswordFormRef = ref(null)
const resetLoading = ref(false)
const countdown = ref(0)

const forgotPasswordForm = reactive({
  phone: '',
  smsCode: '',
  password: '',
  confirmPassword: ''
})

const forgotPasswordFormRules = {
  phone: [
    {
      required: true,
      message: '请输入手机号',
      trigger: 'blur'
    },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: '请输入正确的手机号',
      trigger: 'blur'
    }
  ],
  smsCode: [
    {
      required: true,
      message: '请输入验证码',
      trigger: 'blur'
    },
    {
      len: 6,
      message: '验证码长度为6位',
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: '请输入新密码',
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
      message: '请确认新密码',
      trigger: 'blur'
    },
    {
      validator: (rule, value, callback) => {
        if (value !== forgotPasswordForm.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

const sendSmsCode = async () => {
  try {
    // 验证手机号
    const phoneRule = forgotPasswordFormRules.phone
    for (const rule of phoneRule) {
      if (rule.required) {
        if (!forgotPasswordForm.phone) {
          ElMessage.error(rule.message)
          return
        }
      }
      if (rule.pattern) {
        const regex = new RegExp(rule.pattern)
        if (!regex.test(forgotPasswordForm.phone)) {
          ElMessage.error(rule.message)
          return
        }
      }
    }

    // 发送验证码
    const res = await apiSendSmsCode({ phone: forgotPasswordForm.phone, type: 'reset' })
    if (res.code === 200) {
      ElMessage.success('验证码发送成功')
      startCountdown()
    } else {
      ElMessage.error(res.msg || '验证码发送失败')
    }
  } catch (error) {
    ElMessage.error('验证码发送失败')
  }
}

const startCountdown = () => {
  countdown.value = 60
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

const handleResetPassword = async () => {
  try {
    await forgotPasswordFormRef.value.validate()
    resetLoading.value = true

    // 映射参数名称到后端期望的格式
    const resetData = {
      phone: forgotPasswordForm.phone,
      code: forgotPasswordForm.smsCode,
      newPassword: forgotPasswordForm.password,
      confirmPassword: forgotPasswordForm.confirmPassword
    }

    const res = await userStore.resetUserPassword(resetData)
    
    if (res.code === 200) {
      ElMessage.success('密码重置成功，请登录')
      router.push('/login')
    } else {
      ElMessage.error(res.msg || '密码重置失败')
    }
  } catch (error) {
    if (error !== false) {
      ElMessage.error('密码重置失败')
    }
  } finally {
    resetLoading.value = false
  }
}
</script>

<style scoped>
.forgot-password-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
}

.forgot-password-container {
  display: flex;
  width: 1000px;
  max-width: 90%;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.forgot-password-form-wrapper {
  flex: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
}

.forgot-password-title {
  font-size: 24px;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 10px;
}

.forgot-password-subtitle {
  font-size: 18px;
  color: #606266;
  margin-bottom: 30px;
}

.forgot-password-form {
  flex: 1;
}

.forgot-password-button {
  width: 100%;
  height: 40px;
  font-size: 16px;
}

.login-link,
.register-link {
  text-align: center;
  margin-top: 10px;
}

.login-link a,
.register-link a {
  color: #409eff;
  text-decoration: none;
  margin-left: 5px;
}

.login-link a:hover,
.register-link a:hover {
  text-decoration: underline;
}

.forgot-password-illustration {
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
  .forgot-password-container {
    flex-direction: column;
  }

  .forgot-password-illustration {
    order: -1;
    height: 200px;
  }

  .forgot-password-form-wrapper {
    padding: 20px;
  }
}
</style>
