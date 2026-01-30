<template>
  <div class="not-found-page">
    <el-card shadow="hover" class="not-found-card">
      <div class="not-found-content">
        <el-result
          icon="error"
          title="404"
          sub-title="页面不存在"
        >
          <template #extra>
            <el-button type="primary" @click="goHome">
              <el-icon><House /></el-icon>
              返回首页
            </el-button>
          </template>
        </el-result>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { House } from '@element-plus/icons-vue'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<style scoped>
.not-found-page {
  padding: 100px 0;
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
}

.not-found-card {
  width: 100%;
  max-width: 600px;
  text-align: center;
}

.not-found-content {
  padding: 40px 20px;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .not-found-page {
    padding: 50px 0;
    min-height: 70vh;
  }

  .not-found-content {
    padding: 30px 15px;
  }
}
</style>
