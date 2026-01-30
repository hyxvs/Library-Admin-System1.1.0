<template>
  <div class="announcement-page">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>系统公告</span>
        </div>
      </template>

      <!-- 公告列表 -->
      <div class="announcement-list">
        <el-timeline v-if="announcements.length > 0">
          <el-timeline-item
            v-for="announcement in announcements"
            :key="announcement.id"
            :timestamp="formatDate(announcement.created_at)"
            placement="top"
          >
            <el-card :body-style="{ padding: '20px' }" class="announcement-card">
              <h3 class="announcement-title">{{ announcement.title }}</h3>
              <p class="announcement-content">{{ announcement.content }}</p>
              <div class="announcement-footer">
                <span class="announcement-author">发布人: {{ announcement.author }}</span>
                <span class="announcement-view">浏览次数: {{ announcement.view_count }}</span>
              </div>
            </el-card>
          </el-timeline-item>
        </el-timeline>
        <el-empty v-else description="暂无公告" />
      </div>

      <!-- 分页 -->
      <div class="pagination-section" v-if="announcements.length > 0">
        <el-pagination
          :current-page="pagination.page"
          :page-size="pagination.pageSize"
          :total="pagination.total"
          layout="total, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 借阅须知 -->
    <el-card shadow="hover" class="rules-card">
      <template #header>
        <div class="card-header">
          <span>借阅须知</span>
        </div>
      </template>

      <div class="rules-content">
        <h3 class="rules-title">借阅规则</h3>
        <el-divider />
        <el-descriptions :column="1" border>
          <el-descriptions-item label="最大借阅册数">
            {{ systemConfig.max_borrow_count || 5 }} 本
          </el-descriptions-item>
          <el-descriptions-item label="借阅时长">
            {{ systemConfig.borrow_duration || 30 }} 天
          </el-descriptions-item>
          <el-descriptions-item label="续借次数">
            {{ systemConfig.renew_count || 1 }} 次
          </el-descriptions-item>
          <el-descriptions-item label="续借时长">
            {{ systemConfig.renew_duration || 30 }} 天
          </el-descriptions-item>
          <el-descriptions-item label="逾期费用">
            ¥{{ systemConfig.overdue_fee || 0.1 }}/天
          </el-descriptions-item>
          <el-descriptions-item label="最大预约册数">
            {{ systemConfig.max_reserve_count || 3 }} 本
          </el-descriptions-item>
          <el-descriptions-item label="预约有效期">
            {{ systemConfig.reserve_duration || 7 }} 天
          </el-descriptions-item>
        </el-descriptions>

        <h3 class="rules-title" style="margin-top: 30px;">常见问题</h3>
        <el-divider />
        <el-collapse>
          <el-collapse-item title="如何查询图书？" name="1">
            <div class="faq-content">
              您可以在首页的搜索框中输入书名、作者、ISBN等关键词进行搜索，也可以进入图书查询页面进行高级筛选。
            </div>
          </el-collapse-item>
          <el-collapse-item title="如何预约图书？" name="2">
            <div class="faq-content">
              当图书显示为"已借出"或"预约中"时，您可以在图书详情页点击"立即预约"按钮进行预约。
            </div>
          </el-collapse-item>
          <el-collapse-item title="如何续借图书？" name="3">
            <div class="faq-content">
              在"我的借阅记录"页面，对于借阅中的图书，您可以点击"续借"按钮进行续借，每本书最多续借1次。
            </div>
          </el-collapse-item>
          <el-collapse-item title="如何修改个人信息？" name="4">
            <div class="faq-content">
              进入"个人中心"页面，在"个人资料"标签页中修改您的个人信息，点击"保存修改"按钮即可。
            </div>
          </el-collapse-item>
          <el-collapse-item title="如何找回密码？" name="5">
            <div class="faq-content">
              在登录页面点击"找回密码"链接，按照提示输入手机号和验证码，设置新密码即可。
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'
import { getAnnouncements, getLatestAnnouncement, getSystemConfig } from '@/api/announcement'

const announcements = ref([])
const systemConfig = ref({
  max_borrow_count: 5,
  borrow_duration: 30,
  renew_count: 1,
  renew_duration: 30,
  overdue_fee: 0.1,
  max_reserve_count: 3,
  reserve_duration: 7
})
const pagination = ref({
  page: 1,
  pageSize: 10,
  total: 0
})

const fetchAnnouncements = async () => {
  try {
    const params = {
      page: pagination.value.page,
      pageSize: pagination.value.pageSize
    }
    const res = await getAnnouncements(params)
    if (res.code === 200) {
      announcements.value = res.data.list
      pagination.value.total = res.data.total
    }
  } catch (error) {
    console.error('获取公告失败:', error)
    ElMessage.error('获取公告失败')
  }
}



const handleSizeChange = (size) => {
  pagination.value.pageSize = size
  fetchAnnouncements()
}

const handleCurrentChange = (current) => {
  pagination.value.page = current
  fetchAnnouncements()
}

const formatDate = (date) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

const fetchSystemConfig = async () => {
  try {
    const res = await getSystemConfig()
    if (res.code === 200 && res.data) {
      systemConfig.value = res.data
    }
  } catch (error) {
    console.error('获取系统配置失败:', error)
  }
}

onMounted(() => {
  fetchAnnouncements()
  fetchSystemConfig()
})
</script>

<style scoped>
.announcement-page {
  padding: 20px 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.announcement-list {
  margin-bottom: 20px;
}

.announcement-card {
  transition: transform 0.3s ease;
}

.announcement-card:hover {
  transform: translateY(-5px);
}

.announcement-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #303133;
}

.announcement-content {
  font-size: 14px;
  line-height: 1.6;
  color: #606266;
  margin-bottom: 15px;
}

.announcement-footer {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #909399;
}

.pagination-section {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.rules-card {
  margin-top: 20px;
}

.rules-content {
  padding: 20px 0;
}

.rules-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #303133;
}

.faq-content {
  font-size: 14px;
  line-height: 1.6;
  color: #606266;
  padding: 10px;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .announcement-title {
    font-size: 16px;
  }

  .announcement-content {
    font-size: 14px;
  }

  .rules-title {
    font-size: 16px;
  }

  .faq-content {
    font-size: 14px;
  }
}
</style>
