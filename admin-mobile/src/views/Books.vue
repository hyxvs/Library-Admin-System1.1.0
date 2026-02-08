<template>
  <div class="books-page">
    <div class="search-section">
      <van-search
        v-model="searchForm.keyword"
        placeholder="搜索书名、作者、ISBN"
        show-action
        shape="round"
        @search="handleSearch"
      >
        <template #action>
          <div class="search-btn" @click="handleSearch">搜索</div>
        </template>
      </van-search>
    </div>

    <div class="filter-section">
      <van-dropdown-menu>
        <van-dropdown-item v-model="searchForm.category_id" :options="categoryOptions" @change="handleSearch" />
        <van-dropdown-item v-model="searchForm.status" :options="statusOptions" @change="handleSearch" />
      </van-dropdown-menu>
    </div>

    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        :loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div class="book-list">
          <div
            v-for="book in list"
            :key="book.id"
            class="book-item"
            @click="handleView(book.id)"
          >
            <div class="book-cover" @click.stop="handlePreview(book)">
              <img v-if="book.cover" :src="book.cover" :alt="book.title" class="cover-image" />
              <van-icon v-else name="books-o" size="48" color="#1989fa" />
            </div>
            <div class="book-info">
              <div class="book-title">{{ book.title }}</div>
              <div class="book-author">{{ book.author }}</div>
              <div class="book-meta">
                <van-tag type="primary" size="small">{{ book.category_name }}</van-tag>
                <van-tag :type="book.available_count > 0 ? 'success' : 'warning'" size="small">
                  {{ book.available_count > 0 ? '可借' : '已借完' }}
                </van-tag>
              </div>
              <div class="book-stock">
                <span class="stock-label">库存:</span>
                <span class="stock-value">{{ book.available_count }}/{{ book.total_count }}</span>
              </div>
            </div>
            <div class="book-actions">
              <van-button size="small" type="primary" @click.stop="handleEdit(book.id)">编辑</van-button>
              <van-button size="small" type="default" @click.stop="handleUploadCover(book)">上传封面</van-button>
              <van-button size="small" type="danger" @click.stop="handleDelete(book.id)">删除</van-button>
            </div>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>

    <div class="add-btn">
      <van-button round type="primary" size="normal" @click="handleAdd">
        <van-icon name="plus" />
        新增图书
      </van-button>
    </div>

    <input
      ref="coverInput"
      type="file"
      accept="image/*"
      style="display: none"
      @change="handleCoverChange"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getBooksList, deleteBook, uploadBookImage, updateBook } from '@/api/books'
import { showConfirmDialog, showToast, showImagePreview, showLoadingToast, closeToast } from 'vant'

const router = useRouter()

const searchForm = ref({
  keyword: '',
  category_id: '',
  status: ''
})

const categoryOptions = ref([
  { text: '全部分类', value: '' },
  { text: '计算机科学', value: 13 },
  { text: '文学', value: 14 },
  { text: '历史', value: 15 },
  { text: '哲学', value: 16 },
  { text: '艺术', value: 17 }
])

const statusOptions = ref([
  { text: '全部状态', value: '' },
  { text: '可借', value: 'available' },
  { text: '已借完', value: 'empty' }
])

const list = ref([])
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
const page = ref(1)
const pageSize = ref(10)
const coverInput = ref(null)
const currentBook = ref(null)

const onLoad = async () => {
  if (refreshing.value) {
    list.value = []
    page.value = 1
    refreshing.value = false
  }

  try {
    console.log('开始获取图书数据...', {
      page: page.value,
      pageSize: pageSize.value,
      ...searchForm.value
    })
    const res = await getBooksList({
      page: page.value,
      pageSize: pageSize.value,
      ...searchForm.value
    })
    console.log('获取图书数据成功:', res)
    
    list.value = [...list.value, ...(res.data.list || [])]
    console.log('图书列表数据:', list.value)
    loading.value = false
    
    if (list.value.length >= res.data.total) {
      finished.value = true
    } else {
      page.value++
    }
  } catch (error) {
    console.error('获取图书数据失败:', error)
    loading.value = false
    finished.value = true
  }
}

const onRefresh = () => {
  finished.value = false
  loading.value = true
  onLoad()
}

const handleSearch = () => {
  console.log('开始搜索:', searchForm.value)
  list.value = []
  page.value = 1
  finished.value = false
  onLoad()
}

const handleAdd = () => {
  router.push('/books/add')
}

const handleEdit = (id) => {
  router.push(`/books/${id}/edit`)
}

const handleView = (id) => {
  router.push(`/books/${id}/edit`)
}

const handlePreview = (book) => {
  if (book.cover) {
    showImagePreview({
      images: [book.cover],
      closeable: true
    })
  }
}

const handleDelete = async (id) => {
  try {
    await showConfirmDialog({
      title: '确认删除',
      message: '确定要删除这本图书吗？'
    })
    
    await deleteBook(id)
    showToast({
      type: 'success',
      message: '删除成功'
    })
    
    list.value = []
    page.value = 1
    finished.value = false
    onLoad()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
    }
  }
}

const handleUploadCover = (book) => {
  currentBook.value = book
  if (coverInput.value) {
    coverInput.value.click()
  }
}

const handleCoverChange = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  if (!file.type.startsWith('image/')) {
    showToast('请选择图片文件')
    return
  }
  
  if (file.size > 5 * 1024 * 1024) {
    showToast('图片大小不能超过5MB')
    return
  }
  
  const loadingToast = showLoadingToast({
    message: '上传中...',
    forbidClick: true,
    duration: 0
  })
  
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('book_id', currentBook.value.id)
    
    console.log('开始上传图片:', file.name)
    console.log('FormData 内容:', formData)
    
    const res = await uploadBookImage(formData)
    console.log('上传图片成功:', res)
    
    const coverUrl = res.data.url
    console.log('封面 URL:', coverUrl)
    
    await updateBook(currentBook.value.id, { cover: coverUrl })
    console.log('更新图书封面成功')
    
    closeToast(loadingToast)
    showToast({
      type: 'success',
      message: '封面上传成功'
    })
    
    if (currentBook.value) {
      currentBook.value.cover = coverUrl
      console.log('更新图书封面 URL:', currentBook.value.cover)
    }
    
    list.value = []
    page.value = 1
    finished.value = false
    onLoad()
  } catch (error) {
    closeToast(loadingToast)
    console.error('上传封面失败:', error)
    showToast('封面上传失败')
  }
}

onMounted(() => {
  onLoad()
})
</script>

<style scoped>
.books-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 80px;
}

.search-section {
  background: white;
  padding: 12px 16px;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.search-btn {
  color: #1989fa;
  font-weight: 500;
}

.filter-section {
  background: white;
  border-bottom: 1px solid #ebedf0;
}

.book-list {
  padding: 12px;
}

.book-item {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  display: flex;
  gap: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.book-item:active {
  transform: scale(0.98);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.book-cover {
  flex-shrink: 0;
  width: 80px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border-radius: 8px;
  overflow: hidden;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.book-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.book-title {
  font-size: 16px;
  font-weight: 600;
  color: #323233;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.book-author {
  font-size: 14px;
  color: #969799;
}

.book-meta {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.book-stock {
  font-size: 13px;
  color: #969799;
  margin-top: 4px;
}

.stock-label {
  color: #969799;
}

.stock-value {
  font-weight: 600;
  color: #323233;
}

.book-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: center;
  flex-shrink: 0;
}

.add-btn {
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  box-shadow: 0 4px 12px rgba(25, 137, 250, 0.3);
}
</style>
