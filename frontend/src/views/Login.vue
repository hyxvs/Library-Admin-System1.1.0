<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <el-icon class="logo-icon"><Reading /></el-icon>
        <h2>图书馆管理系统</h2>
        <div class="version">v1.1.0</div>
      </div>
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        @keyup.enter="handleLogin"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            prefix-icon="User"
            size="large"
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="Lock"
            size="large"
            show-password
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        <el-form-item prop="captcha">
          <el-row :gutter="12" align="middle">
            <el-col :span="16">
              <el-input
                v-model="loginForm.captcha"
                placeholder="请输入验证码"
                prefix-icon="View"
                size="large"
                @keyup.enter="handleLogin"
              />
            </el-col>
            <el-col :span="8">
              <div class="captcha-container">
                <div class="captcha-image" @click="refreshCaptcha">
                  <img :src="captchaImage" alt="验证码" class="captcha-img" />
                  <div class="captcha-overlay">
                    <el-icon class="refresh-icon"><Refresh /></el-icon>
                    <span class="refresh-text">点击刷新</span>
                  </div>
                </div>
                <div class="captcha-audio" @click="playCaptchaAudio" :disabled="isSpeaking">
                  <el-icon class="audio-icon"><VideoCamera /></el-icon>
                  <span class="audio-text">{{ isSpeaking ? '播放中...' : '语音验证' }}</span>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-form-item>
        <div class="form-footer">
          <el-button link @click="handleForgotPassword" class="forgot-password">
            忘记密码？
          </el-button>
        </div>
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            :loading="loading"
            @click="handleLogin"
            class="login-button"
          >
            {{ loading ? '登录中...' : '登录' }}
          </el-button>
        </el-form-item>
        <div class="register-link">
          <span>还没有账号？</span>
          <router-link to="/register">立即注册</router-link>
        </div>
      </el-form>
      <div class="login-footer">
        <p class="default-account">默认账号: admin / 密码: 123456</p>
        <p class="copyright">© 2024 图书馆管理系统 v1.1.0</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Reading, View, Refresh, VideoCamera } from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()

const loginFormRef = ref(null)
const loading = ref(false)
const captchaCode = ref('')
const captchaImage = ref('')
const isSpeaking = ref(false)

const loginForm = reactive({
  username: '',
  password: '',
  captcha: ''
})

const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少6位', trigger: 'blur' }
  ],
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { min: 4, max: 4, message: '验证码为4位', trigger: 'blur' }
  ]
}

// 生成随机验证码
const generateCaptchaCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // 排除容易混淆的字符
  let code = ''
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// 生成验证码图片
const generateCaptchaImage = () => {
  const code = generateCaptchaCode()
  captchaCode.value = code
  
  // 创建canvas元素
  const canvas = document.createElement('canvas')
  canvas.width = 120
  canvas.height = 40
  const ctx = canvas.getContext('2d')
  
  // 绘制背景
  ctx.fillStyle = '#f5f7fa'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  // 绘制干扰线
  for (let i = 0; i < 5; i++) {
    ctx.strokeStyle = `rgba(${Math.random() * 100}, ${Math.random() * 100}, ${Math.random() * 100}, 0.3)`
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height)
    ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height)
    ctx.stroke()
  }
  
  // 绘制噪点
  for (let i = 0; i < 50; i++) {
    ctx.fillStyle = `rgba(${Math.random() * 100}, ${Math.random() * 100}, ${Math.random() * 100}, 0.5)`
    ctx.beginPath()
    ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 1, 0, Math.PI * 2)
    ctx.fill()
  }
  
  // 绘制验证码文本
  ctx.font = 'bold 20px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  
  // 为每个字符设置不同的颜色和位置
  for (let i = 0; i < code.length; i++) {
    ctx.fillStyle = `rgba(${Math.random() * 100 + 50}, ${Math.random() * 100 + 50}, ${Math.random() * 100 + 50}, 0.8)`
    const x = (i * canvas.width) / code.length + canvas.width / (code.length * 2)
    const y = canvas.height / 2 + (Math.random() * 10 - 5)
    const rotation = (Math.random() * 40 - 20) * Math.PI / 180
    
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(rotation)
    ctx.fillText(code[i], 0, 0)
    ctx.restore()
  }
  
  // 将canvas转换为base64图片
  return canvas.toDataURL('image/png')
}

// 刷新验证码
const refreshCaptcha = () => {
  captchaImage.value = generateCaptchaImage()
}

// 语音验证码
const playCaptchaAudio = () => {
  if (isSpeaking.value) return
  
  isSpeaking.value = true
  
  try {
    const speech = new SpeechSynthesisUtterance(captchaCode.value.split('').join(' '))
    speech.lang = 'zh-CN'
    speech.rate = 0.8
    speech.onend = () => {
      isSpeaking.value = false
    }
    speechSynthesis.speak(speech)
  } catch (error) {
    ElMessage.warning('浏览器不支持语音功能')
    isSpeaking.value = false
  }
}

// 忘记密码处理
const handleForgotPassword = () => {
  ElMessageBox.alert(
    '请联系管理员重置密码',
    '忘记密码',
    {
      confirmButtonText: '确定',
      type: 'info'
    }
  )
}

// 登录处理
const handleLogin = async () => {
  try {
    await loginFormRef.value.validate()
    loading.value = true

    // 验证验证码
    if (loginForm.captcha.toUpperCase() !== captchaCode.value) {
      ElMessage.error('验证码错误')
      refreshCaptcha()
      loading.value = false
      return
    }

    const res = await userStore.login(loginForm)

    if (res.code === 200) {
      ElMessage.success('登录成功')
      router.push('/dashboard')
    } else {
      ElMessage.error(res.msg || '登录失败')
      refreshCaptcha()
    }
  } catch (error) {
    if (error !== false) {
      ElMessage.error('登录失败，请检查网络连接')
    }
  } finally {
    loading.value = false
  }
}

// 生命周期
onMounted(() => {
  // 初始化验证码
  refreshCaptcha()
  
  // 应用暗黑模式
  const isDarkMode = localStorage.getItem('theme') === 'dark'
  if (isDarkMode) {
    document.documentElement.classList.add('dark')
  }
})
</script>

<style scoped>
.login-container {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #409eff 0%, #67c23a 100%);
  position: relative;
  overflow: hidden;
}

/* 背景纹理 */
.login-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/></svg>');
  opacity: 0.3;
  pointer-events: none;
}

.login-box {
  width: 420px;
  padding: 40px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.15);
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
  position: relative;
}

.logo-icon {
  font-size: 48px;
  color: #409eff;
  margin-bottom: 16px;
}

.login-header h2 {
  margin: 0 0 8px 0;
  color: #303133;
  font-size: 24px;
  font-weight: bold;
}

.login-header .version {
  font-size: 12px;
  color: #909399;
  position: absolute;
  top: 0;
  right: 0;
}

.login-form {
  margin-top: 20px;
}

/* 验证码样式 */
.captcha-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.captcha-image {
  position: relative;
  cursor: pointer;
  height: 40px;
  border-radius: 4px;
  overflow: hidden;
  background-color: #f5f7fa;
  transition: all 0.3s ease;
}

.captcha-image:hover {
  background-color: #ecf5ff;
}

.captcha-img {
  width: 100%;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
}

.captcha-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #909399;
  font-size: 10px;
  background-color: rgba(255, 255, 255, 0.8);
  opacity: 0;
  transition: opacity 0.3s ease;
  gap: 2px;
}

.captcha-image:hover .captcha-overlay {
  opacity: 1;
}

.refresh-icon {
  font-size: 14px;
}

.refresh-text {
  font-size: 10px;
}

/* 语音验证码样式 */
.captcha-audio {
  position: relative;
  cursor: pointer;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  background-color: #f0f9eb;
  color: #67c23a;
  transition: all 0.3s ease;
  font-size: 12px;
  gap: 4px;
}

.captcha-audio:hover:not(:disabled) {
  background-color: #e1f5c4;
  color: #85ce61;
}

.captcha-audio:disabled {
  cursor: not-allowed;
  opacity: 0.6;
  background-color: #f5f7fa;
  color: #909399;
}

.audio-icon {
  font-size: 14px;
}

.audio-text {
  font-size: 11px;
}

/* 表单底部 */
.form-footer {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
}

.forgot-password {
  font-size: 14px;
  color: #409eff;
  transition: color 0.3s ease;
}

.forgot-password:hover {
  color: #66b1ff;
}

/* 登录按钮 */
.login-button {
  width: 100%;
  height: 42px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
}

/* 注册链接 */
.register-link {
  text-align: center;
  margin-top: 16px;
  font-size: 14px;
  color: #909399;
}

.register-link a {
  color: #409eff;
  text-decoration: none;
  margin-left: 4px;
  transition: color 0.3s ease;
}

.register-link a:hover {
  color: #66b1ff;
  text-decoration: underline;
}

/* 登录页脚 */
.login-footer {
  text-align: center;
  margin-top: 24px;
  color: #909399;
  font-size: 12px;
}

.default-account {
  margin-bottom: 8px;
  color: #909399;
}

.copyright {
  color: #c0c4cc;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .login-box {
    width: 90%;
    max-width: 400px;
    padding: 30px 24px;
  }
}

@media screen and (max-width: 480px) {
  .login-header h2 {
    font-size: 20px;
  }
  
  .logo-icon {
    font-size: 40px;
  }
}

/* 输入框样式优化 */
:deep(.el-input__wrapper) {
  border-radius: 4px;
  transition: all 0.3s ease;
}

:deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #ecf5ff inset;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #409eff inset;
}

/* 按钮样式优化 */
:deep(.el-button--primary) {
  border-radius: 8px;
  transition: all 0.3s ease;
}

:deep(.el-button--primary:hover) {
  opacity: 0.9;
  transform: translateY(-1px);
}

:deep(.el-button--primary:active) {
  transform: translateY(0);
}

/* 暗黑模式支持 */
html.dark .login-container {
  background: linear-gradient(135deg, #1f2d3d 0%, #304156 100%);
}

html.dark .login-box {
  background: #1f2d3d;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
}

html.dark .login-header h2 {
  color: #bfcbd9;
}

html.dark .login-header .version {
  color: #8391a5;
}

html.dark .logo-icon {
  color: #409eff;
}

html.dark .captcha-image {
  background-color: #304156;
}

html.dark .captcha-image:hover {
  background-color: #2c3e50;
}

html.dark .captcha-overlay {
  background-color: rgba(31, 45, 61, 0.8);
  color: #bfcbd9;
}

html.dark .captcha-audio {
  background-color: #2c3e50;
  color: #409eff;
}

html.dark .captcha-audio:hover:not(:disabled) {
  background-color: #233240;
  color: #66b1ff;
}

html.dark .captcha-audio:disabled {
  background-color: #304156;
  color: #8391a5;
}

html.dark .forgot-password {
  color: #409eff;
}

html.dark .forgot-password:hover {
  color: #66b1ff;
}

html.dark .register-link {
  color: #8391a5;
}

html.dark .register-link a {
  color: #409eff;
}

html.dark .register-link a:hover {
  color: #66b1ff;
}

html.dark .login-footer {
  color: #8391a5;
}

html.dark .default-account {
  color: #8391a5;
}

html.dark .copyright {
  color: #606266;
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

html.dark :deep(.el-button--primary) {
  background-color: #409eff;
  border-color: #409eff;
}

html.dark :deep(.el-button--primary:hover) {
  background-color: #66b1ff;
  border-color: #66b1ff;
}
</style>
