<template>
  <div class="book-detail-page">
    <el-card shadow="hover" v-if="book">
      <div class="book-detail-content">
        <!-- 图书封面 -->
        <div class="book-cover-section">
          <div class="book-cover">
            <img 
              :src="`https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=book%20cover%2C%20${encodeURIComponent(book.title)}%2C%20simple%20design%2C%203D%20rendering&image_size=square`" 
              :alt="book.title"
            />
          </div>
          <div class="book-status-section">
            <el-tag :type="getBookStatusType(book.status)" size="large" class="book-status-tag">
              {{ getBookStatusText(book.status) }}
            </el-tag>
            <p class="book-stock">
              库存: {{ book.total_count }} 本
            </p>
            <p class="book-available">
              可借: {{ book.available_count }} 本
            </p>
            <p class="book-borrow-count">
              借阅次数: {{ book.borrow_count }} 次
            </p>
          </div>
        </div>

        <!-- 图书信息 -->
        <div class="book-info-section">
          <h1 class="book-title">{{ book.title }}</h1>
          <p class="book-author">作者: {{ book.author }}</p>
          <p class="book-isbn">ISBN: {{ book.isbn }}</p>
          <p class="book-publisher">出版社: {{ book.publisher }}</p>
          <p class="book-publish-date">出版日期: {{ book.publish_date }}</p>
          <p class="book-category">分类: {{ book.category_name }}</p>
          <p class="book-price">价格: ¥{{ book.price }}</p>
          <p class="book-location">馆藏位置: {{ book.location }}</p>
          <p class="book-description">
            <span class="description-label">内容简介:</span>
            {{ book.description }}
          </p>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="book-actions">
        <el-button 
          type="primary" 
          size="large" 
          :disabled="false" 
          @click="handleReserve"
          :loading="reserveLoading"
        >
          {{ book.status === 1 ? '直接借阅' : '立即预约' }}
        </el-button>
        <el-button 
          type="info" 
          size="large"
          :disabled="false"
          @click="goBack"
        >
          返回
        </el-button>
      </div>
    </el-card>

    <el-empty v-else description="图书信息加载中..." />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getBookDetail } from '@/api/books'
import { createReservation } from '@/api/reservation'
import { borrowBook } from '@/api/borrow'

const router = useRouter()
const route = useRoute()
const book = ref(null)
const reserveLoading = ref(false)

const fetchBookDetail = async () => {
  try {
    const bookId = route.params.id
    const res = await getBookDetail(bookId)
    if (res.code === 200) {
      book.value = res.data
    } else {
      ElMessage.error(res.msg || '获取图书信息失败')
    }
  } catch (error) {
    console.error('获取图书信息失败:', error)
    ElMessage.error('获取图书信息失败')
  }
}

const handleReserve = async () => {
  try {
    // 如果图书信息未加载完成，直接返回
    if (!book.value) {
      return
    }
    
    reserveLoading.value = true
    
    // 如果图书状态为 1（可借），执行直接借阅操作
    if (book.value.status === 1) {
      const res = await borrowBook(book.value.id)
      if (res.code === 200) {
        ElMessage.success('借阅成功')
        // 刷新图书信息
        await fetchBookDetail()
      } else {
        ElMessage.error(res.msg || '借阅失败')
      }
    } else {
      // 否则执行预约操作
      const res = await createReservation({ book_id: book.value.id })
      if (res.code === 200) {
        ElMessage.success('预约成功')
        // 刷新图书信息
        await fetchBookDetail()
      } else {
        ElMessage.error(res.msg || '预约失败')
      }
    }
  } catch (error) {
    console.error('操作失败:', error)
    ElMessage.error('操作失败')
  } finally {
    reserveLoading.value = false
  }
}

const goBack = () => {
  router.back()
}

const getBookStatusType = (status) => {
  const typeMap = {
    1: 'success',
    2: 'info',
    3: 'warning'
  }
  return typeMap[status] || ''
}

const getBookStatusText = (status) => {
  const textMap = {
    1: '可借',
    2: '已借出',
    3: '预约中'
  }
  return textMap[status] || status
}

onMounted(() => {
  fetchBookDetail()
})
</script>

<style scoped>
.book-detail-page {
  padding: 20px 0;
}

.book-detail-content {
  display: flex;
  gap: 40px;
  margin-bottom: 30px;
}

.book-cover-section {
  flex-shrink: 0;
  width: 300px;
}

.book-cover {
  width: 100%;
  height: 400px;
  overflow: hidden;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.book-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.book-status-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.book-status-tag {
  font-size: 16px;
  padding: 5px 20px;
}

.book-stock,
.book-available,
.book-borrow-count {
  font-size: 14px;
  color: #606266;
  margin: 0;
}

.book-info-section {
  flex: 1;
}

.book-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #303133;
}

.book-author,
.book-isbn,
.book-publisher,
.book-publish-date,
.book-category,
.book-price,
.book-location {
  font-size: 16px;
  margin-bottom: 10px;
  color: #606266;
}

.book-description {
  font-size: 14px;
  line-height: 1.6;
  color: #606266;
  margin-top: 20px;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.description-label {
  font-weight: bold;
  display: block;
  margin-bottom: 10px;
}

.book-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .book-detail-content {
    flex-direction: column;
    align-items: center;
  }

  .book-cover-section {
    width: 200px;
  }

  .book-cover {
    height: 250px;
  }

  .book-title {
    font-size: 20px;
    text-align: center;
  }

  .book-info-section {
    width: 100%;
  }

  .book-actions {
    flex-direction: column;
  }

  .book-actions el-button {
    width: 100%;
  }
}
</style>
