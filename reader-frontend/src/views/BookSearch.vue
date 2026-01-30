<template>
  <div class="book-search-page">
    <!-- 搜索和筛选区域 -->
    <el-card shadow="hover" class="search-filter-card">
      <template #header>
        <div class="card-header">
          <span>图书查询</span>
        </div>
      </template>
      
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="关键词">
          <el-input
            v-model="searchForm.keyword"
            placeholder="请输入书名、作者、ISBN"
            clearable
            style="width: 300px"
          />
        </el-form-item>
        
        <el-form-item label="分类">
          <el-select v-model="searchForm.categoryId" placeholder="选择分类" clearable>
            <el-option
              v-for="category in categories"
              :key="category.id"
              :label="category.name"
              :value="category.id"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="选择状态" clearable>
            <el-option label="可借" value="available" />
            <el-option label="已借出" value="borrowed" />
            <el-option label="预约中" value="reserved" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="排序">
          <el-select v-model="searchForm.sort" placeholder="选择排序" clearable>
            <el-option label="热门程度" value="hot" />
            <el-option label="出版日期" value="publish_date" />
            <el-option label="书名" value="title" />
          </el-select>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 搜索结果 -->
    <div class="search-results">
      <div class="results-header">
        <span>共找到 {{ pagination.total }} 本图书</span>
      </div>
      
      <div class="books-grid" v-if="books.length > 0">
        <div
          v-for="book in books"
          :key="book.id"
          class="book-card"
          @click="goToBookDetail(book.id)"
        >
          <div class="book-cover">
            <img 
              :src="`https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=book%20cover%2C%20${encodeURIComponent(book.title)}%2C%20simple%20design%2C%203D%20rendering&image_size=square`" 
              :alt="book.title"
            />
            <div class="book-status">
              <el-tag :type="getBookStatusType(book.status)">
                {{ getBookStatusText(book.status) }}
              </el-tag>
            </div>
          </div>
          <div class="book-info">
            <h4 class="book-title">{{ book.title }}</h4>
            <p class="book-author">{{ book.author }}</p>
            <p class="book-isbn">ISBN: {{ book.isbn }}</p>
            <p class="book-category">{{ book.category_name }}</p>
            <p class="book-publish">
              {{ book.publisher }} · {{ book.publish_date }}
            </p>
            <div class="book-actions">
              <el-button 
                type="primary" 
                size="small" 
                @click.stop="handleReserve(book.id)"
                :disabled="book.status !== 'available'"
              >
                立即预约
              </el-button>
            </div>
          </div>
        </div>
      </div>
      
      <el-empty v-else description="未找到相关图书" />

      <!-- 分页 -->
      <el-pagination
        v-if="pagination.total > 0"
        :current-page="pagination.page"
        :page-size="pagination.pageSize"
        :total="pagination.total"
        layout="total, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        class="pagination"
      />
    </div>

    <!-- 最近搜索记录 -->
    <el-card shadow="hover" class="recent-search-card">
      <template #header>
        <div class="card-header">
          <span>最近搜索</span>
          <el-button type="text" @click="clearRecentSearches">清空记录</el-button>
        </div>
      </template>
      <div class="recent-searches">
        <el-tag
          v-for="(search, index) in recentSearches"
          :key="index"
          closable
          @close="removeRecentSearch(index)"
          @click="useRecentSearch(search)"
          class="recent-search-tag"
        >
          {{ search }}
        </el-tag>
        <el-empty v-if="recentSearches.length === 0" description="暂无搜索记录" />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { searchBooks, getBookCategories } from '@/api/books'

const router = useRouter()
const route = useRoute()
const books = ref([])
const categories = ref([])
const recentSearches = ref([])
const pagination = ref({
  page: 1,
  pageSize: 12,
  total: 0
})

const searchForm = ref({
  keyword: '',
  categoryId: '',
  status: '',
  sort: ''
})

// 获取图书分类
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

// 搜索图书
const fetchBooks = async () => {
  try {
    const params = {
      ...searchForm.value,
      page: pagination.value.page,
      pageSize: pagination.value.pageSize
    }
    const res = await searchBooks(params)
    if (res.code === 200) {
      books.value = res.data.list
      pagination.value.total = res.data.total
    }
  } catch (error) {
    console.error('搜索图书失败:', error)
    ElMessage.error('搜索图书失败')
  }
}

// 处理搜索
const handleSearch = () => {
  pagination.value.page = 1
  fetchBooks()
  
  // 保存搜索记录
  if (searchForm.value.keyword) {
    saveSearchRecord(searchForm.value.keyword)
  }
}

// 保存搜索记录
const saveSearchRecord = (keyword) => {
  // 从本地存储获取最近搜索记录
  const storedSearches = localStorage.getItem('recentSearches')
  let searches = storedSearches ? JSON.parse(storedSearches) : []
  
  // 移除重复的搜索词
  searches = searches.filter(item => item !== keyword)
  
  // 添加到开头
  searches.unshift(keyword)
  
  // 只保留最近10条
  searches = searches.slice(0, 10)
  
  // 保存回本地存储
  localStorage.setItem('recentSearches', JSON.stringify(searches))
  recentSearches.value = searches
}

// 加载最近搜索记录
const loadRecentSearches = () => {
  const storedSearches = localStorage.getItem('recentSearches')
  recentSearches.value = storedSearches ? JSON.parse(storedSearches) : []
}

// 使用最近搜索记录
const useRecentSearch = (keyword) => {
  searchForm.value.keyword = keyword
  handleSearch()
}

// 移除最近搜索记录
const removeRecentSearch = (index) => {
  recentSearches.value.splice(index, 1)
  localStorage.setItem('recentSearches', JSON.stringify(recentSearches.value))
}

// 清空最近搜索记录
const clearRecentSearches = () => {
  recentSearches.value = []
  localStorage.removeItem('recentSearches')
}


// 处理分页大小变化
const handleSizeChange = (size) => {
  pagination.value.pageSize = size
  fetchBooks()
}

// 处理页码变化
const handleCurrentChange = (current) => {
  pagination.value.page = current
  fetchBooks()
}

// 跳转到图书详情
const goToBookDetail = (bookId) => {
  router.push(`/book/detail/${bookId}`)
}

// 处理图书预约
const handleReserve = async (bookId) => {
  try {
    router.push(`/book/detail/${bookId}?action=reserve`)
  } catch (error) {
    console.error('预约图书失败:', error)
    ElMessage.error('预约图书失败')
  }
}

// 获取图书状态类型
const getBookStatusType = (status) => {
  const typeMap = {
    available: 'success',
    borrowed: 'info',
    reserved: 'warning'
  }
  return typeMap[status] || ''
}

// 获取图书状态文本
const getBookStatusText = (status) => {
  const textMap = {
    available: '可借',
    borrowed: '已借出',
    reserved: '预约中'
  }
  return textMap[status] || status
}

onMounted(() => {
  fetchCategories()
  loadRecentSearches()
  
  // 从路由参数获取搜索条件
  if (route.query.keyword) {
    searchForm.value.keyword = route.query.keyword
  }
  
  fetchBooks()
})
</script>

<style scoped>
.book-search-page {
  padding: 20px 0;
}

.search-filter-card,
.recent-search-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-form {
  padding: 20px 0;
}

.search-results {
  margin-bottom: 20px;
}

.results-header {
  margin-bottom: 15px;
  font-size: 14px;
  color: #606266;
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.book-card {
  border: 1px solid #ebeef5;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
}

.book-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-5px);
}

.book-cover {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
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

.book-status {
  position: absolute;
  top: 10px;
  right: 10px;
}

.book-info {
  padding: 15px;
}

.book-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.book-author {
  font-size: 14px;
  color: #606266;
  margin-bottom: 5px;
}

.book-isbn {
  font-size: 12px;
  color: #909399;
  margin-bottom: 5px;
}

.book-category {
  font-size: 12px;
  color: #909399;
  margin-bottom: 5px;
}

.book-publish {
  font-size: 12px;
  color: #909399;
  margin-bottom: 15px;
}

.book-actions {
  display: flex;
  justify-content: center;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.recent-searches {
  padding: 10px 0;
}

.recent-search-tag {
  margin-right: 10px;
  margin-bottom: 10px;
  cursor: pointer;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .search-form {
    flex-direction: column;
    align-items: flex-start;
  }

  .books-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }

  .book-cover {
    height: 150px;
  }

  .book-info {
    padding: 10px;
  }

  .book-title {
    font-size: 14px;
  }

  .book-author,
  .book-isbn,
  .book-category,
  .book-publish {
    font-size: 12px;
  }
}
</style>
