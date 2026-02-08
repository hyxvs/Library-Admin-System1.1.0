<template>
  <div class="readers-page">
    <div class="search-section">
      <van-search
        v-model="searchForm.keyword"
        placeholder="搜索姓名、读者证号"
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
        <van-dropdown-item v-model="searchForm.credit_status" :options="statusOptions" @change="handleSearch" />
      </van-dropdown-menu>
    </div>

    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        :loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div class="reader-list">
          <div
            v-for="reader in list"
            :key="reader.id"
            class="reader-item"
            @click="handleView(reader.id)"
          >
            <div class="reader-avatar">
              <van-icon name="user-o" size="48" color="#07c160" />
            </div>
            <div class="reader-info">
              <div class="reader-name">{{ reader.name }}</div>
              <div class="reader-no">{{ reader.reader_no }}</div>
              <div class="reader-meta">
                <van-tag :type="getStatusType(reader.credit_status)">
                  {{ getStatusText(reader.credit_status) }}
                </van-tag>
              </div>
              <div class="reader-phone" v-if="reader.phone">
                <van-icon name="phone-o" size="14" />
                {{ reader.phone }}
              </div>
            </div>
            <div class="reader-actions">
              <van-button size="small" type="primary" @click.stop="handleView(reader.id)">查看</van-button>
              <van-button size="small" type="danger" @click.stop="handleDelete(reader.id)">删除</van-button>
            </div>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>

    <div class="add-btn">
      <van-button round type="primary" size="normal" @click="handleAdd">
        <van-icon name="plus" />
        新增读者
      </van-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getReadersList, deleteReader } from '@/api/readers'
import { showConfirmDialog, showToast } from 'vant'

const router = useRouter()

const searchForm = ref({
  keyword: '',
  credit_status: ''
})

const statusOptions = ref([
  { text: '全部状态', value: '' },
  { text: '正常', value: 'normal' },
  { text: '逾期', value: 'overdue' },
  { text: '欠费', value: 'debt' }
])

const list = ref([])
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
const page = ref(1)
const pageSize = ref(10)

const getStatusType = (status) => {
  const map = {
    normal: 'success',
    overdue: 'warning',
    debt: 'danger'
  }
  return map[status] || 'default'
}

const getStatusText = (status) => {
  const map = {
    normal: '正常',
    overdue: '逾期',
    debt: '欠费'
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
    const res = await getReadersList({
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

const handleAdd = () => {
  router.push('/readers/add')
}

const handleView = (id) => {
  router.push(`/readers/${id}/edit`)
}

const handleDelete = async (id) => {
  try {
    await showConfirmDialog({
      title: '确认删除',
      message: '确定要删除这位读者吗？'
    })
    
    await deleteReader(id)
    showToast({
      type: 'success',
      message: '删除成功'
    })
    onRefresh()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
    }
  }
}
</script>

<style scoped>
.readers-page {
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

.reader-list {
  padding: 12px;
}

.reader-item {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  display: flex;
  gap: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.reader-item:active {
  transform: scale(0.98);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.reader-avatar {
  flex-shrink: 0;
  width: 80px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #a8e6cf 0%, #00d4ff 100%);
  border-radius: 8px;
}

.reader-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.reader-name {
  font-size: 16px;
  font-weight: 600;
  color: #323233;
}

.reader-no {
  font-size: 14px;
  color: #969799;
}

.reader-meta {
  display: flex;
  gap: 6px;
}

.reader-phone {
  font-size: 13px;
  color: #969799;
  display: flex;
  align-items: center;
  gap: 4px;
}

.reader-actions {
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
