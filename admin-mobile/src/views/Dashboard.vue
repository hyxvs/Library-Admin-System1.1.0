<template>
  <div class="dashboard-page">
    <van-notice-bar
      left-icon="volume-o"
      text="欢迎使用图书馆管理系统移动端"
      background="#ecf9ff"
      color="#1989fa"
    />
    
    <div class="stats-grid">
      <van-grid :column-num="2" :border="false" :gutter="10">
        <van-grid-item>
          <van-card class="stat-card">
            <template #thumb>
              <van-icon name="books-o" size="40" color="#1989fa" />
            </template>
            <template #title>
              <div class="stat-title">图书总数</div>
            </template>
            <template #desc>
              <div class="stat-value">{{ stats.totalBooks }}</div>
            </template>
          </van-card>
        </van-grid-item>
        <van-grid-item>
          <van-card class="stat-card">
            <template #thumb>
              <van-icon name="friends-o" size="40" color="#07c160" />
            </template>
            <template #title>
              <div class="stat-title">读者总数</div>
            </template>
            <template #desc>
              <div class="stat-value">{{ stats.totalReaders }}</div>
            </template>
          </van-card>
        </van-grid-item>
        <van-grid-item>
          <van-card class="stat-card">
            <template #thumb>
              <van-icon name="todo-list-o" size="40" color="#ff976a" />
            </template>
            <template #title>
              <div class="stat-title">借阅中</div>
            </template>
            <template #desc>
              <div class="stat-value">{{ stats.borrowing }}</div>
            </template>
          </van-card>
        </van-grid-item>
        <van-grid-item>
          <van-card class="stat-card">
            <template #thumb>
              <van-icon name="warning-o" size="40" color="#ee0a24" />
            </template>
            <template #title>
              <div class="stat-title">逾期未还</div>
            </template>
            <template #desc>
              <div class="stat-value">{{ stats.overdue }}</div>
            </template>
          </van-card>
        </van-grid-item>
      </van-grid>
    </div>

    <div class="quick-actions">
      <van-cell-group title="快捷操作" inset>
        <van-cell title="新增图书" is-link to="/books/add" icon="plus" />
        <van-cell title="新增读者" is-link to="/readers/add" icon="add-o" />
        <van-cell title="借阅图书" is-link to="/borrow" icon="records-o" />
      </van-cell-group>
    </div>

    <div class="recent-books">
      <van-cell-group title="最近借阅" inset>
        <van-empty v-if="recentBorrowList.length === 0" description="暂无数据" />
        <van-cell
          v-for="item in recentBorrowList"
          :key="item.id"
          :title="item.book_title"
          :label="item.reader_name"
          is-link
        >
          <template #right-icon>
            <van-tag :type="item.status === 'borrowed' ? 'primary' : 'success'">
              {{ item.status === 'borrowed' ? '借阅中' : '已归还' }}
            </van-tag>
          </template>
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getBorrowList } from '@/api/borrow'
import { getDashboardStats } from '@/api/statistics'

const stats = ref({
  totalBooks: 0,
  totalReaders: 0,
  borrowing: 0,
  overdue: 0
})

const recentBorrowList = ref([])

const fetchStats = async () => {
  try {
    const res = await getDashboardStats()
    stats.value.totalBooks = res.data.totalBooks || 0
    stats.value.totalReaders = res.data.totalReaders || 0
    stats.value.borrowing = res.data.totalBorrowed || 0
    stats.value.overdue = res.data.totalOverdue || 0

    const borrowRes = await getBorrowList({ page: 1, pageSize: 5 })
    recentBorrowList.value = borrowRes.data.list || []
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
}

onMounted(() => {
  fetchStats()
})
</script>

<style scoped>
.dashboard-page {
  padding: 10px 0 70px;
}

.stats-grid {
  padding: 10px;
}

.stat-card {
  background: white;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
}

.stat-title {
  font-size: 14px;
  color: #666;
  margin-top: 8px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-top: 5px;
}

.quick-actions,
.recent-books {
  margin-top: 15px;
}
</style>
