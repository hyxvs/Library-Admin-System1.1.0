<template>
  <div class="borrow-page">
    <van-tabs v-model="activeTab" sticky>
      <van-tab title="借阅图书" name="borrow">
        <van-form @submit="handleBorrow">
          <van-cell-group inset>
            <van-field
              v-model="borrowForm.reader_no"
              name="reader_no"
              label="读者证号"
              placeholder="请输入读者证号"
              :rules="[{ required: true, message: '请输入读者证号' }]"
            >
              <template #button>
                <van-button size="small" type="primary" @click="searchReader">查询</van-button>
              </template>
            </van-field>
            
            <van-cell v-if="readerInfo" title="读者信息">
              <template #value>
                <div class="info-item">
                  <van-icon name="user-o" size="20" color="#07c160" />
                  <span>{{ readerInfo.name }}</span>
                </div>
                <div class="info-item">
                  <van-icon name="phone-o" size="20" color="#969799" />
                  <span>{{ readerInfo.phone || '未设置' }}</span>
                </div>
                <van-tag :type="readerInfo.credit_status === 'normal' ? 'success' : 'danger'">
                  {{ readerInfo.credit_status === 'normal' ? '正常' : '异常' }}
                </van-tag>
              </template>
            </van-cell>

            <van-field
              v-model="borrowForm.book_isbn"
              name="book_isbn"
              label="图书ISBN"
              placeholder="请输入图书ISBN"
              :rules="[{ required: true, message: '请输入图书ISBN' }]"
            >
              <template #button>
                <van-button size="small" type="primary" @click="searchBook">查询</van-button>
              </template>
            </van-field>

            <van-cell v-if="bookInfo" title="图书信息">
              <template #value>
                <div class="info-item">
                  <van-icon name="books-o" size="20" color="#1989fa" />
                  <span>{{ bookInfo.title }}</span>
                </div>
                <div class="info-item">
                  <van-icon name="user-o" size="20" color="#969799" />
                  <span>{{ bookInfo.author }}</span>
                </div>
                <van-tag :type="bookInfo.available_count > 0 ? 'success' : 'warning'">
                  可借: {{ bookInfo.available_count }}
                </van-tag>
              </template>
            </van-cell>

            <van-field
              v-model="borrowForm.borrow_days"
              name="borrow_days"
              label="借阅天数"
              type="number"
              placeholder="请输入借阅天数"
              :rules="[{ required: true, message: '请输入借阅天数' }]"
            />
          </van-cell-group>

          <div class="submit-btn">
            <van-button round block type="primary" native-type="submit" :loading="loading">
              <van-icon name="passed" />
              确认借阅
            </van-button>
          </div>
        </van-form>
      </van-tab>

      <van-tab title="借阅记录" name="records">
        <div class="search-section">
          <van-search
            v-model="searchForm.keyword"
            placeholder="搜索读者、图书"
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
            <div class="record-list">
              <div
                v-for="record in list"
                :key="record.id"
                class="record-item"
              >
                <div class="record-icon">
                  <van-icon name="records-o" size="48" color="#ff976a" />
                </div>
                <div class="record-info">
                  <div class="record-book">{{ record.book_title }}</div>
                  <div class="record-reader">
                    <van-icon name="user-o" size="14" color="#969799" />
                    {{ record.reader_name }}
                  </div>
                  <div class="record-meta">
                    <van-tag :type="getStatusType(record.status)">
                      {{ getStatusText(record.status) }}
                    </van-tag>
                    <span class="record-date">{{ formatDate(record.borrow_date) }}</span>
                  </div>
                </div>
                <div class="record-actions">
                  <van-button
                    v-if="record.status === 'borrowed'"
                    size="small"
                    type="primary"
                    @click.stop="handleReturn(record.id)"
                  >
                    <van-icon name="passed" />
                    还书
                  </van-button>
                  <van-button
                    v-if="record.status === 'borrowed'"
                    size="small"
                    @click.stop="handleRenew(record.id)"
                  >
                    <van-icon name="replay" />
                    续借
                  </van-button>
                </div>
              </div>
            </div>
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { borrowBook, returnBook, renewBook, getBorrowList } from '@/api/borrow'
import { getReadersList } from '@/api/readers'
import { getBooksList } from '@/api/books'
import { showConfirmDialog, showToast } from 'vant'
import dayjs from 'dayjs'

const activeTab = ref('borrow')

const borrowForm = ref({
  reader_no: '',
  book_isbn: '',
  borrow_days: 30
})

const searchForm = ref({
  keyword: '',
  status: ''
})

const statusOptions = ref([
  { text: '全部状态', value: '' },
  { text: '借阅中', value: 'borrowed' },
  { text: '已归还', value: 'returned' },
  { text: '已逾期', value: 'overdue' }
])

const readerInfo = ref(null)
const bookInfo = ref(null)
const loading = ref(false)

const list = ref([])
const refreshing = ref(false)
const finished = ref(false)
const page = ref(1)
const pageSize = ref(10)

const formatDate = (date) => {
  return date ? dayjs(date).format('YYYY-MM-DD') : '-'
}

const searchReader = async () => {
  try {
    const res = await getReadersList({ reader_no: borrowForm.value.reader_no })
    if (res.data.list && res.data.list.length > 0) {
      readerInfo.value = res.data.list[0]
    } else {
      showToast('未找到该读者')
      readerInfo.value = null
    }
  } catch (error) {
    console.error('查询读者失败:', error)
  }
}

const searchBook = async () => {
  try {
    const res = await getBooksList({ isbn: borrowForm.value.book_isbn })
    if (res.data.list && res.data.list.length > 0) {
      bookInfo.value = res.data.list[0]
    } else {
      showToast('未找到该图书')
      bookInfo.value = null
    }
  } catch (error) {
    console.error('查询图书失败:', error)
  }
}

const handleBorrow = async () => {
  if (!readerInfo.value) {
    showToast('请先查询读者信息')
    return
  }
  if (!bookInfo.value) {
    showToast('请先查询图书信息')
    return
  }
  if (bookInfo.value.available_count <= 0) {
    showToast('该图书已借完')
    return
  }

  loading.value = true
  try {
    await borrowBook({
      reader_id: readerInfo.value.id,
      book_id: bookInfo.value.id,
      borrow_days: borrowForm.value.borrow_days
    })
    showToast({
      type: 'success',
      message: '借阅成功'
    })
    borrowForm.value = {
      reader_no: '',
      book_isbn: '',
      borrow_days: 30
    }
    readerInfo.value = null
    bookInfo.value = null
  } catch (error) {
    console.error('借阅失败:', error)
  } finally {
    loading.value = false
  }
}

const getStatusType = (status) => {
  const map = {
    borrowed: 'primary',
    returned: 'success',
    overdue: 'danger'
  }
  return map[status] || 'default'
}

const getStatusText = (status) => {
  const map = {
    borrowed: '借阅中',
    returned: '已归还',
    overdue: '已逾期'
  }
  return map[status] || '未知'
}

const onLoad = async () => {
  if (refreshing.value) {
    list.value = []
    page.value = 1
    refreshing.value = false
  }

  try {
    const res = await getBorrowList({
      page: page.value,
      pageSize: pageSize.value,
      ...searchForm.value
    })
    
    list.value = [...list.value, ...(res.data.list || [])]
    loading.value = false
    
    if (list.value.length >= res.data.total) {
      finished.value = true
    } else {
      page.value++
    }
  } catch (error) {
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
  list.value = []
  page.value = 1
  finished.value = false
  onLoad()
}

const handleReturn = async (id) => {
  try {
    await showConfirmDialog({
      title: '确认还书',
      message: '确定要归还这本书吗？'
    })
    
    await returnBook(id)
    showToast({
      type: 'success',
      message: '还书成功'
    })
    onRefresh()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('还书失败:', error)
    }
  }
}

const handleRenew = async (id) => {
  try {
    await renewBook(id)
    showToast({
      type: 'success',
      message: '续借成功'
    })
    onRefresh()
  } catch (error) {
    console.error('续借失败:', error)
  }
}
</script>

<style scoped>
.borrow-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 20px;
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

.submit-btn {
  margin: 20px 16px;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.record-list {
  padding: 12px;
}

.record-item {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  display: flex;
  gap: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.record-item:active {
  transform: scale(0.98);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.record-icon {
  flex-shrink: 0;
  width: 80px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ff976a 0%, #ff7a45 100%);
  border-radius: 8px;
}

.record-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.record-book {
  font-size: 16px;
  font-weight: 600;
  color: #323233;
}

.record-reader {
  font-size: 14px;
  color: #969799;
  display: flex;
  align-items: center;
  gap: 4px;
}

.record-meta {
  display: flex;
  gap: 8px;
  align-items: center;
}

.record-date {
  font-size: 13px;
  color: #969799;
}

.record-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: center;
  flex-shrink: 0;
}
</style>
