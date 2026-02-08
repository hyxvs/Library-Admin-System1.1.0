<template>
  <div class="profile-page">
    <div class="user-header">
      <div class="avatar-container">
        <van-image
          round
          width="80"
          height="80"
          :src="userAvatar"
        />
        <div class="avatar-upload-btn" @click="showUploader = true">
          <van-icon name="camera" size="18" />
        </div>
      </div>
      <div class="user-info">
        <h3>{{ userStore.user ? userStore.user.real_name : '管理员' }}</h3>
        <p>{{ userStore.user && userStore.user.role === 'admin' ? '系统管理员' : '馆员' }}</p>
      </div>
    </div>

    <van-cell-group inset title="个人信息">
      <van-cell title="用户名" :value="userStore.user ? userStore.user.username : ''" />
      <van-cell title="真实姓名" :value="userStore.user ? userStore.user.real_name : ''" />
      <van-cell title="联系电话" :value="userStore.user && userStore.user.phone ? userStore.user.phone : '未设置'" />
      <van-cell title="创建时间" :value="userStore.user && userStore.user.created_at ? formatDate(userStore.user.created_at) : ''" />
    </van-cell-group>

    <van-popup v-model="showUploader" position="bottom" :round="true" style="padding: 20px;">
      <van-uploader
        v-model="uploadFiles"
        :max-count="1"
        :capture="['camera', 'album']"
        accept="image/*"
        @after-read="handleAvatarUpload"
        @delete="handleAvatarDelete"
      />
    </van-popup>


    <van-cell-group inset title="系统设置">
      <van-cell title="修改密码" is-link @click="showPasswordDialog = true" />
      <van-cell title="关于系统" is-link @click="showAboutDialog = true" />
    </van-cell-group>

    <div class="logout-btn">
      <van-button round block type="danger" @click="handleLogout">
        退出登录
      </van-button>
    </div>

    <van-dialog v-model="showPasswordDialog" title="修改密码" show-cancel-button @confirm="handleChangePassword">
      <van-field
        v-model="passwordForm.oldPassword"
        type="password"
        label="原密码"
        placeholder="请输入原密码"
      />
      <van-field
        v-model="passwordForm.newPassword"
        type="password"
        label="新密码"
        placeholder="请输入新密码"
      />
      <van-field
        v-model="passwordForm.confirmPassword"
        type="password"
        label="确认密码"
        placeholder="请再次输入新密码"
      />
    </van-dialog>

    <van-dialog v-model="showAboutDialog" title="关于系统">
      <div class="about-content">
        <p>图书馆管理系统 v1.1.0</p>
        <p>移动端版本</p>
        <p>© 2026 All Rights Reserved</p>
      </div>
    </van-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { logout, changePassword, uploadAvatar } from '@/api/auth'
import { showToast, showConfirmDialog, showImagePreview } from 'vant'
import { Uploader, Icon } from 'vant'
import dayjs from 'dayjs'

const router = useRouter()
const userStore = useUserStore()

const showPasswordDialog = ref(false)
const showAboutDialog = ref(false)
const showUploader = ref(false)
const uploadFiles = ref([])

const userAvatar = computed(() => {
  if (uploadFiles.value && uploadFiles.value.length > 0) {
    return uploadFiles.value[0].content
  }
  if (userStore.user && userStore.user.avatar) {
    // 检查是否为完整URL
    if (userStore.user.avatar.startsWith('http://') || userStore.user.avatar.startsWith('https://')) {
      return userStore.user.avatar
    }
    // 相对路径，使用完整URL
    return 'http://localhost:3000' + userStore.user.avatar
  }
  return 'https://picsum.photos/80'
})

const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const formatDate = (date) => {
  return date ? dayjs(date).format('YYYY-MM-DD HH:mm') : '-'
}

const handleAvatarUpload = async (file) => {
  try {
    // 创建FormData对象
    const formData = new FormData()
    formData.append('avatar', file.file)
    
    // 调用上传头像的API
    const response = await uploadAvatar(formData)
    
    if (response.code === 200) {
      showToast({
        type: 'success',
        message: '头像上传成功'
      })
      
      // 保存到本地状态
      uploadFiles.value = [file]
      showUploader.value = false
      
      // 刷新用户信息
      // 这里可以重新获取用户信息，或者直接更新本地状态
      // 暂时通过刷新页面来更新
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } else {
      throw new Error('上传失败')
    }
  } catch (error) {
    console.error('头像上传失败:', error)
    showToast({
      type: 'error',
      message: '头像上传失败'
    })
  }
}

const handleAvatarDelete = () => {
  uploadFiles.value = []
  showToast({
    type: 'success',
    message: '头像已删除'
  })
}

const handleLogout = async () => {
  try {
    await showConfirmDialog({
      title: '确认退出',
      message: '确定要退出登录吗？'
    })
    
    await logout()
    userStore.logout()
    showToast({
      type: 'success',
      message: '退出成功'
    })
    router.push('/login')
  } catch (error) {
    if (error !== 'cancel') {
      console.error('退出失败:', error)
    }
  }
}

const handleChangePassword = async () => {
  if (!passwordForm.value.oldPassword) {
    showToast('请输入原密码')
    return
  }
  if (!passwordForm.value.newPassword) {
    showToast('请输入新密码')
    return
  }
  if (passwordForm.value.newPassword.length < 6) {
    showToast('新密码至少6位')
    return
  }
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    showToast('两次输入的密码不一致')
    return
  }
  
  try {
    await changePassword({
      oldPassword: passwordForm.value.oldPassword,
      newPassword: passwordForm.value.newPassword
    })
    showToast({
      type: 'success',
      message: '密码修改成功'
    })
    passwordForm.value = {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
    showPasswordDialog.value = false
  } catch (error) {
    console.error('修改密码失败:', error)
  }
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 20px;
}

.user-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  color: white;
}

.avatar-container {
  position: relative;
}

.avatar-upload-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  cursor: pointer;
}

.avatar-upload-btn:hover {
  background: rgba(0, 0, 0, 0.8);
}

.user-info h3 {
  margin: 0 0 5px;
  font-size: 20px;
}

.user-info p {
  margin: 0;
  opacity: 0.9;
  font-size: 14px;
}

.logout-btn {
  margin: 20px 16px;
}

.about-content {
  padding: 20px;
  text-align: center;
  color: #666;
}

.about-content p {
  margin: 8px 0;
}
</style>
