<template>
  <div class="home-page">
    <!-- 系统公告 -->
    <el-card class="announcement-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>系统公告</span>
          <router-link to="/announcement" class="view-more">查看更多</router-link>
        </div>
      </template>
      <div class="announcement-content">
        <el-timeline v-if="latestAnnouncement">
          <el-timeline-item
            :timestamp="formatDate(latestAnnouncement.created_at)"
            placement="top"
          >
            <el-card :body-style="{ padding: '10px' }">
              <h4 class="announcement-title">{{ latestAnnouncement.title }}</h4>
              <p class="announcement-desc">{{ latestAnnouncement.content }}</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
        <el-empty v-else description="暂无公告" />
      </div>
    </el-card>

    <!-- 搜索框 -->
    <div class="search-section">
      <el-card shadow="hover">
        <div class="search-container">
          <h3 class="search-title">图书搜索</h3>
          <el-form :inline="true" :model="searchForm" class="search-form">
            <el-form-item>
              <el-input
                v-model="searchForm.keyword"
                placeholder="请输入书名、作者、ISBN"
                clearable
                style="width: 300px"
              >
                <template #append>
                  <el-button type="primary" @click="handleSearch">
                    <el-icon><Search /></el-icon>
                    搜索
                  </el-button>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-select v-model="searchForm.categoryId" placeholder="图书分类" clearable>
                <el-option
                  v-for="category in categories"
                  :key="category.id"
                  :label="category.name"
                  :value="category.id"
                />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </div>

    <!-- 热门图书 -->
    <div class="hot-books-section">
      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <span>热门图书 TOP10</span>
            <router-link to="/book/search?hot=true" class="view-more">查看更多</router-link>
          </div>
        </template>
        <div class="hot-books-container">
          <div
            v-for="book in hotBooks"
            :key="book.id"
            class="book-card"
            @click="goToBookDetail(book.id)"
          >
            <div class="book-cover">
              <img 
                :src="`https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=book%20cover%2C%20${encodeURIComponent(book.title)}%2C%20simple%20design%2C%203D%20rendering&image_size=square`" 
                :alt="book.title"
              />
            </div>
            <div class="book-info">
              <h4 class="book-title">{{ book.title }}</h4>
              <p class="book-author">{{ book.author }}</p>
              <p class="book-status">
                <el-tag :type="book.available_count > 0 ? 'success' : 'warning'">
                  {{ book.available_count > 0 ? '可借' : '已借出' }}
                </el-tag>
              </p>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 个人统计 -->
    <div class="personal-stats-section">
      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <span>个人统计</span>
            <router-link to="/user/statistics" class="view-more">查看详情</router-link>
          </div>
        </template>
        <div class="stats-container">
          <div class="stat-item">
            <el-icon class="stat-icon"><Reading /></el-icon>
            <div class="stat-content">
              <p class="stat-value">{{ userStats.totalBorrow || 0 }}</p>
              <p class="stat-label">累计借阅</p>
            </div>
          </div>
          <div class="stat-item">
            <el-icon class="stat-icon"><Timer /></el-icon>
            <div class="stat-content">
              <p class="stat-value">{{ userStats.currentBorrow || 0 }}</p>
              <p class="stat-label">当前借阅</p>
            </div>
          </div>
          <div class="stat-item">
            <el-icon class="stat-icon"><Calendar /></el-icon>
            <div class="stat-content">
              <p class="stat-value">{{ userStats.totalReservation || 0 }}</p>
              <p class="stat-label">累计预约</p>
            </div>
          </div>
          <div class="stat-item">
            <el-icon class="stat-icon"><Warning /></el-icon>
            <div class="stat-content">
              <p class="stat-value">{{ userStats.totalOverdue || 0 }}</p>
              <p class="stat-label">历史逾期</p>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Search, Reading, Timer, Calendar, Warning } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import { getHotBooks, getBookCategories } from '@/api/books'
import { getUserStatistics } from '@/api/user'
import { getLatestAnnouncement } from '@/api/announcement'

const router = useRouter()
const hotBooks = ref([])
const categories = ref([])
const userStats = ref({})
const latestAnnouncement = ref(null)
const searchForm = ref({
  keyword: '',
  categoryId: ''
})

const fetchHotBooks = async () => {
  try {
    const res = await getHotBooks()
    if (res.code === 200) {
      hotBooks.value = res.data
    }
  } catch (error) {
    console.error('获取热门图书失败:', error)
  }
}

const fetchCategories = async () => {
  try {
    const res = await getBookCategories()
    if (res.code === 200) {
      categories.value = res.data
    }
  } catch (error) {
    console.error('获取图书分类失败:', error)
  }
}

const fetchUserStatistics = async () => {
  try {
    const res = await getUserStatistics()
    if (res.code === 200) {
      userStats.value = res.data
    }
  } catch (error) {
    console.error('获取个人统计失败:', error)
  }
}

const fetchLatestAnnouncement = async () => {
  try {
    const res = await getLatestAnnouncement()
    if (res.code === 200) {
      latestAnnouncement.value = res.data
    }
  } catch (error) {
    console.error('获取最新公告失败:', error)
  }
}

const handleSearch = () => {
  if (!searchForm.value.keyword && !searchForm.value.categoryId) {
    ElMessage.warning('请输入搜索关键词或选择分类')
    return
  }
  router.push({
    path: '/book/search',
    query: {
      keyword: searchForm.value.keyword,
      categoryId: searchForm.value.categoryId
    }
  })
}

const goToBookDetail = (bookId) => {
  router.push(`/book/detail/${bookId}`)
}

const formatDate = (date) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

onMounted(() => {
  fetchHotBooks()
  fetchCategories()
  fetchUserStatistics()
  fetchLatestAnnouncement()
})
</script>

<style scoped>
.home-page {
  padding: 20px 0;
}

.announcement-card,
.search-section,
.hot-books-section,
.personal-stats-section {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.view-more {
  color: #409eff;
  text-decoration: none;
  font-size: 14px;
}

.view-more:hover {
  text-decoration: underline;
}

.announcement-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
}

.announcement-desc {
  font-size: 14px;
  color: #606266;
  line-height: 1.5;
}

.search-container {
  padding: 20px;
}

.search-title {
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: bold;
}

.search-form {
  display: flex;
  align-items: center;
  gap: 10px;
}

.hot-books-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
  padding: 10px 0;
}

.book-card {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.book-card:hover {
  transform: translateY(-5px);
}

.book-cover {
  width: 100%;
  height: 200px;
  overflow: hidden;
  border-radius: 8px;
  margin-bottom: 10px;
}

.book-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.book-card:hover .book-cover img {
  transform: scale(1.05);
}

.book-title {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.book-author {
  font-size: 12px;
  color: #606266;
  margin-bottom: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  padding: 10px 0;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.stat-item:hover {
  background-color: #f0f9ff;
}

.stat-icon {
  font-size: 32px;
  color: #409eff;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.stat-label {
  font-size: 14px;
  color: #606266;
  margin-top: 5px;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .search-form {
    flex-direction: column;
    align-items: flex-start;
  }

  .hot-books-container {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }

  .book-cover {
    height: 150px;
  }

  .stats-container {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
