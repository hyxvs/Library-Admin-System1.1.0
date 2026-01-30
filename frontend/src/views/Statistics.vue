<template>
  <div class="statistics-page">
    <el-row :gutter="20" class="stats-row">
      <el-col :xs="12" :sm="12" :md="6" :lg="6" :xl="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background: #409eff">
              <el-icon><User /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.totalReaders }}</div>
              <div class="stat-label">读者总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="12" :md="6" :lg="6" :xl="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background: #67c23a">
              <el-icon><Reading /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.totalBooks }}</div>
              <div class="stat-label">图书总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="12" :md="6" :lg="6" :xl="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background: #e6a23c">
              <el-icon><DocumentCopy /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.totalBorrowed }}</div>
              <div class="stat-label">当前借阅</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="12" :md="6" :lg="6" :xl="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background: #f56c6c">
              <el-icon><Warning /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.totalOverdue }}</div>
              <div class="stat-label">逾期未还</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="charts-row">
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-card>
          <template #header>
            <div class="card-header" style="display: flex; justify-content: space-between; align-items: center">
              <span>分类借阅占比</span>
              <el-dropdown size="small">
                <el-button size="small" type="primary" plain>
                  导出 <el-icon class="el-icon--right"><ArrowDown /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="exportChart(categoryChart, 'category')">导出图片</el-dropdown-item>
                    <el-dropdown-item @click="exportChartData(stats.value.categoryStats, 'category')">导出数据</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
          <div ref="categoryChartRef" style="width: 100%; height: 350px"></div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-card>
          <template #header>
            <div class="card-header" style="display: flex; justify-content: space-between; align-items: center">
              <span>借阅趋势</span>
              <div style="display: flex; gap: 10px; align-items: center">
                <el-select v-model="trendDateRange" size="small" style="width: 150px">
                  <el-option label="最近7天" value="7" />
                  <el-option label="最近30天" value="30" />
                  <el-option label="最近90天" value="90" />
                  <el-option label="最近180天" value="180" />
                </el-select>
                <el-dropdown size="small">
                  <el-button size="small" type="primary" plain>
                    导出 <el-icon class="el-icon--right"><ArrowDown /></el-icon>
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item @click="exportChart(trendChart, 'trend')">导出图片</el-dropdown-item>
                      <el-dropdown-item @click="exportChartData(stats.value.borrowTrend, 'trend')">导出数据</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </div>
          </template>
          <div ref="trendChartRef" style="width: 100%; height: 350px"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="charts-row">
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-card>
          <template #header>
            <div class="card-header" style="display: flex; justify-content: space-between; align-items: center">
              <span>图书状态分布</span>
              <el-dropdown size="small">
                <el-button size="small" type="primary" plain>
                  导出 <el-icon class="el-icon--right"><ArrowDown /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="exportChart(bookStatusChart, 'bookStatus')">导出图片</el-dropdown-item>
                    <el-dropdown-item @click="exportChartData(stats.value.bookStatus, 'bookStatus')">导出数据</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
          <div ref="bookStatusChartRef" style="width: 100%; height: 350px"></div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-card>
          <template #header>
            <div class="card-header" style="display: flex; justify-content: space-between; align-items: center">
              <span>月度借阅统计</span>
              <el-dropdown size="small">
                <el-button size="small" type="primary" plain>
                  导出 <el-icon class="el-icon--right"><ArrowDown /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="exportChart(monthlyChart, 'monthly')">导出图片</el-dropdown-item>
                    <el-dropdown-item @click="exportChartData(stats.value.monthlyStats, 'monthly')">导出数据</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
          <div ref="monthlyChartRef" style="width: 100%; height: 350px"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="charts-row">
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-card>
          <template #header>
            <div class="card-header" style="display: flex; justify-content: space-between; align-items: center">
              <span>热门图书排行</span>
              <el-input
                v-model="bookSearch"
                placeholder="搜索图书"
                size="small"
                style="width: 200px"
                clearable
              />
            </div>
          </template>
          <el-table 
            :data="filteredHotBooks" 
            style="width: 100%" 
            max-height="400"
            stripe
            border
            highlight-current-row
          >
            <el-table-column type="index" label="排名" width="80" />
            <el-table-column prop="isbn" label="ISBN" width="120" />
            <el-table-column prop="title" label="书名" min-width="150">
              <template #default="{ row }">
                <div class="book-title" :title="row.title">{{ row.title }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="author" label="作者" width="100" />
            <el-table-column prop="category_name" label="分类" width="100" />
            <el-table-column prop="borrow_count" label="借阅次数" width="100" sortable />
            <el-table-column prop="available_count" label="可借" width="80" />
          </el-table>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-card>
          <template #header>
            <div class="card-header" style="display: flex; justify-content: space-between; align-items: center">
              <span>读者借阅排行</span>
              <el-input
                v-model="readerSearch"
                placeholder="搜索读者"
                size="small"
                style="width: 200px"
                clearable
              />
            </div>
          </template>
          <el-table 
            :data="filteredReaderBorrow" 
            style="width: 100%" 
            max-height="400"
            stripe
            border
            highlight-current-row
          >
            <el-table-column type="index" label="排名" width="80" />
            <el-table-column prop="reader_no" label="读者编号" width="120" />
            <el-table-column prop="name" label="姓名" width="100" />
            <el-table-column prop="phone" label="手机号" width="130" />
            <el-table-column prop="borrow_count" label="借阅次数" width="100" sortable />
            <el-table-column label="当前借阅" width="100">
              <template #default="{ row }">
                {{ row.current_borrow_count || 0 }}
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="charts-row">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>借阅记录导出</span>
            </div>
          </template>
          <el-form :inline="true" :model="exportForm" style="flex-wrap: wrap; gap: 10px">
            <el-form-item label="日期范围">
              <el-date-picker
                v-model="exportDateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="YYYY-MM-DD"
                style="width: 280px"
              />
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="exportForm.status" placeholder="请选择状态" clearable style="width: 150px">
                <el-option label="借阅中" value="borrowed" />
                <el-option label="已归还" value="returned" />
                <el-option label="已逾期" value="overdue" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleExport" :loading="exportLoading">
                <el-icon><Download /></el-icon>
                导出Excel
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, watch, computed } from 'vue'
import * as echarts from 'echarts'
import { ElMessage } from 'element-plus'
import { getDashboard, getHotBooks, getCategoryBorrow, getReaderBorrow, exportBorrowRecords } from '@/api/statistics'
import { User, Reading, DocumentCopy, Warning, Download, ArrowDown } from '@element-plus/icons-vue'

const stats = ref({
  totalReaders: 0,
  totalBooks: 0,
  totalBorrowed: 0,
  totalOverdue: 0,
  categoryStats: [
    { category_name: '文学', borrow_count: 10 },
    { category_name: '计算机科学', borrow_count: 8 },
    { category_name: '历史', borrow_count: 5 },
    { category_name: '哲学', borrow_count: 3 },
    { category_name: '艺术', borrow_count: 2 }
  ],
  borrowTrend: [
    { date: '2026-01-01', total_count: 5, borrowed_count: 3, returned_count: 2, overdue_count: 0 },
    { date: '2026-01-02', total_count: 7, borrowed_count: 4, returned_count: 3, overdue_count: 0 },
    { date: '2026-01-03', total_count: 3, borrowed_count: 1, returned_count: 2, overdue_count: 0 },
    { date: '2026-01-04', total_count: 6, borrowed_count: 4, returned_count: 2, overdue_count: 0 },
    { date: '2026-01-05', total_count: 8, borrowed_count: 5, returned_count: 3, overdue_count: 0 }
  ],
  bookStatus: [
    { status_name: '正常', count: 40 },
    { status_name: '下架', count: 5 }
  ],
  monthlyStats: [
    { month: '2025-09', borrow_count: 10 },
    { month: '2025-10', borrow_count: 15 },
    { month: '2025-11', borrow_count: 12 },
    { month: '2025-12', borrow_count: 18 },
    { month: '2026-01', borrow_count: 20 }
  ]
})

const hotBooks = ref([])
const readerBorrow = ref([])
const exportLoading = ref(false)
const exportDateRange = ref([])
const categoryChartRef = ref(null)
const trendChartRef = ref(null)
const bookStatusChartRef = ref(null)
const monthlyChartRef = ref(null)
const trendDateRange = ref('30')
const bookSearch = ref('')
const readerSearch = ref('')

let categoryChart = null
let trendChart = null
let bookStatusChart = null
let monthlyChart = null

const filteredHotBooks = computed(() => {
  if (!bookSearch.value) return hotBooks.value
  const search = bookSearch.value.toLowerCase()
  return hotBooks.value.filter(book => 
    book.title.toLowerCase().includes(search) ||
    book.author.toLowerCase().includes(search) ||
    book.isbn.toLowerCase().includes(search) ||
    book.category_name.toLowerCase().includes(search)
  )
})

const filteredReaderBorrow = computed(() => {
  if (!readerSearch.value) return readerBorrow.value
  const search = readerSearch.value.toLowerCase()
  return readerBorrow.value.filter(reader => 
    reader.name.toLowerCase().includes(search) ||
    reader.reader_no.toLowerCase().includes(search) ||
    (reader.phone && reader.phone.toLowerCase().includes(search))
  )
})

const exportForm = reactive({
  start_date: '',
  end_date: '',
  status: ''
})

const fetchDashboard = async () => {
  console.log('开始获取统计数据...')
  console.log('trendDateRange.value:', trendDateRange.value)
  try {
    console.log('调用 getDashboard API...')
    const res = await getDashboard({ days: trendDateRange.value })
    console.log('获取统计数据响应:', res)
    if (res.code === 200) {
      // 更新统计数据
      stats.value.totalReaders = res.data.totalReaders || 0
      stats.value.totalBooks = res.data.totalBooks || 0
      stats.value.totalBorrowed = res.data.totalBorrowed || 0
      stats.value.totalOverdue = res.data.totalOverdue || 0
      
      // 更新图表数据
      if (res.data.categoryStats && Array.isArray(res.data.categoryStats) && res.data.categoryStats.length > 0) {
        stats.value.categoryStats = res.data.categoryStats
        initCategoryChart(res.data.categoryStats)
      }
      if (res.data.borrowTrend && Array.isArray(res.data.borrowTrend) && res.data.borrowTrend.length > 0) {
        stats.value.borrowTrend = res.data.borrowTrend
        initTrendChart(res.data.borrowTrend)
      }
      if (res.data.bookStatus && Array.isArray(res.data.bookStatus) && res.data.bookStatus.length > 0) {
        stats.value.bookStatus = res.data.bookStatus
        initBookStatusChart(res.data.bookStatus)
      }
      if (res.data.monthlyStats && Array.isArray(res.data.monthlyStats) && res.data.monthlyStats.length > 0) {
        stats.value.monthlyStats = res.data.monthlyStats
        initMonthlyChart(res.data.monthlyStats)
      }
    }
    console.log('获取统计数据完成')
  } catch (error) {
    console.error('获取统计数据失败:', error)
    // API 请求失败时，保留默认数据
    console.log('使用默认数据')
  }
}

const fetchHotBooks = async () => {
  try {
    const res = await getHotBooks({ limit: 10 })
    if (res.code === 200) {
      hotBooks.value = res.data
    }
  } catch (error) {
    console.error('获取热门图书失败:', error)
  }
}

const fetchCategoryBorrow = async () => {
  try {
    const res = await getCategoryBorrow()
    if (res.code === 200 && res.data && Array.isArray(res.data) && res.data.length > 0) {
      if (categoryChart) {
        categoryChart.setOption({
          series: [{
            data: res.data.map(item => ({
              value: item.borrow_count,
              name: item.category_name
            }))
          }]
        })
      }
    }
  } catch (error) {
    console.error('获取分类借阅统计失败:', error)
  }
}

const fetchReaderBorrow = async () => {
  try {
    const res = await getReaderBorrow({ limit: 10 })
    if (res.code === 200) {
      readerBorrow.value = res.data
    }
  } catch (error) {
    console.error('获取读者借阅排行失败:', error)
  }
}

const initCategoryChart = (data) => {
  if (!categoryChartRef.value) return

  categoryChart = echarts.init(categoryChartRef.value)

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#409eff',
      borderWidth: 1,
      textStyle: {
        color: '#333'
      }
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'center',
      formatter: '{name}',
      textStyle: {
        color: '#666',
        fontSize: 12
      },
      selectedMode: 'multiple'
    },
    series: [
      {
        name: '借阅次数',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.1)'
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold',
            color: '#333'
          },
          itemStyle: {
            shadowBlur: 20,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.2)'
          }
        },
        labelLine: {
          show: false
        },
        data: data.map(item => ({
          value: item.borrow_count,
          name: item.category_name
        })),
        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDelay: function(idx) {
          return Math.random() * 200;
        }
      }
    ]
  }

  categoryChart.setOption(option)
}

const initTrendChart = (data) => {
  if (!trendChartRef.value) return

  trendChart = echarts.init(trendChartRef.value)

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985',
          color: '#fff'
        }
      },
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#409eff',
      borderWidth: 1,
      textStyle: {
        color: '#333'
      },
      formatter: function(params) {
        let result = params[0].name + '<br/>';
        params.forEach(item => {
          result += `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${item.color};"></span>`;
          result += `${item.seriesName}: ${item.value}<br/>`;
        });
        return result;
      }
    },
    legend: {
      data: ['总借阅', '借阅中', '已归还', '已逾期'],
      top: 0,
      textStyle: {
        color: '#666'
      },
      selectedMode: 'multiple'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.map(item => item.date.split(' ')[0]),
      axisLine: {
        lineStyle: {
          color: '#e0e0e0'
        }
      },
      axisLabel: {
        color: '#666',
        fontSize: 11
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false
      },
      axisLabel: {
        color: '#666',
        fontSize: 11
      },
      splitLine: {
        lineStyle: {
          color: '#f0f0f0',
          type: 'dashed'
        }
      }
    },
    series: [
      {
        name: '总借阅',
        type: 'line',
        stack: 'Total',
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(64, 158, 255, 0.8)' },
            { offset: 1, color: 'rgba(64, 158, 255, 0.1)' }
          ])
        },
        emphasis: {
          focus: 'series'
        },
        data: data.map(item => item.total_count),
        smooth: true,
        itemStyle: {
          color: '#409eff'
        },
        lineStyle: {
          width: 3
        },
        symbol: 'circle',
        symbolSize: 6,
        showSymbol: false
      },
      {
        name: '借阅中',
        type: 'line',
        emphasis: {
          focus: 'series'
        },
        data: data.map(item => item.borrowed_count),
        smooth: true,
        itemStyle: {
          color: '#67c23a'
        },
        lineStyle: {
          width: 2
        },
        symbol: 'circle',
        symbolSize: 6,
        showSymbol: false
      },
      {
        name: '已归还',
        type: 'line',
        emphasis: {
          focus: 'series'
        },
        data: data.map(item => item.returned_count),
        smooth: true,
        itemStyle: {
          color: '#e6a23c'
        },
        lineStyle: {
          width: 2
        },
        symbol: 'circle',
        symbolSize: 6,
        showSymbol: false
      },
      {
        name: '已逾期',
        type: 'line',
        emphasis: {
          focus: 'series'
        },
        data: data.map(item => item.overdue_count),
        smooth: true,
        itemStyle: {
          color: '#f56c6c'
        },
        lineStyle: {
          width: 2
        },
        symbol: 'circle',
        symbolSize: 6,
        showSymbol: false
      }
    ],
    animationDuration: 1500,
    animationEasing: 'cubicOut'
  }

  trendChart.setOption(option)
}

const initBookStatusChart = (data) => {
  if (!bookStatusChartRef.value) return

  bookStatusChart = echarts.init(bookStatusChartRef.value)

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#409eff',
      borderWidth: 1,
      textStyle: {
        color: '#333'
      }
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'center',
      textStyle: {
        color: '#666'
      }
    },
    series: [
      {
        name: '图书状态',
        type: 'pie',
        radius: '60%',
        center: ['50%', '50%'],
        data: data.map(item => ({
          value: item.count,
          name: item.status_name
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          formatter: '{b}: {c}'
        },
        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDelay: function(idx) {
          return Math.random() * 200;
        }
      }
    ]
  }

  bookStatusChart.setOption(option)
}

const initMonthlyChart = (data) => {
  if (!monthlyChartRef.value) return

  monthlyChart = echarts.init(monthlyChartRef.value)

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#409eff',
      borderWidth: 1,
      textStyle: {
        color: '#333'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: data.map(item => item.month),
      axisLine: {
        lineStyle: {
          color: '#e0e0e0'
        }
      },
      axisLabel: {
        color: '#666',
        rotate: 45,
        fontSize: 11
      }
    },
    yAxis: {
      type: 'value',
      name: '借阅次数',
      nameTextStyle: {
        color: '#666'
      },
      axisLine: {
        show: false
      },
      axisLabel: {
        color: '#666'
      },
      splitLine: {
        lineStyle: {
          color: '#f0f0f0',
          type: 'dashed'
        }
      }
    },
    series: [
      {
        name: '借阅次数',
        type: 'bar',
        data: data.map(item => item.borrow_count),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#409eff' },
            { offset: 1, color: '#66b1ff' }
          ]),
          borderRadius: [4, 4, 0, 0]
        },
        emphasis: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#2979ff' },
              { offset: 1, color: '#409eff' }
            ])
          }
        },
        animationDelay: function(idx) {
          return idx * 100;
        }
      }
    ],
    animationEasing: 'elasticOut',
    animationDelayUpdate: function(idx) {
      return idx * 5;
    }
  }

  monthlyChart.setOption(option)
}

const handleExport = async () => {
  if (exportDateRange.value && exportDateRange.value.length === 2) {
    exportForm.start_date = exportDateRange.value[0]
    exportForm.end_date = exportDateRange.value[1]
  } else {
    exportForm.start_date = ''
    exportForm.end_date = ''
  }

  exportLoading.value = true
  try {
    const res = await exportBorrowRecords(exportForm)
    const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `借阅记录_${new Date().getTime()}.xlsx`
    link.click()
    window.URL.revokeObjectURL(url)
    ElMessage.success('导出成功')
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败')
  } finally {
    exportLoading.value = false
  }
}

const exportChart = (chart, filename) => {
  if (!chart) {
    ElMessage.warning('图表未初始化')
    return
  }
  
  try {
    const url = chart.getDataURL({
      type: 'png',
      pixelRatio: 2,
      backgroundColor: '#ffffff'
    })
    
    const link = document.createElement('a')
    link.href = url
    link.download = `${filename}_图表_${new Date().getTime()}.png`
    link.click()
    ElMessage.success('图表导出成功')
  } catch (error) {
    console.error('图表导出失败:', error)
    ElMessage.error('图表导出失败')
  }
}

const exportChartData = (data, filename) => {
  if (!data || !Array.isArray(data)) {
    ElMessage.warning('数据不存在')
    return
  }
  
  if (data.length === 0) {
    ElMessage.warning('数据为空')
    return
  }
  
  try {
    const headers = Object.keys(data[0])
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header]
          return typeof value === 'string' && value.includes(',') ? `"${value}"` : value
        }).join(',')
      )
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${filename}_数据_${new Date().getTime()}.csv`
    link.click()
    window.URL.revokeObjectURL(url)
    ElMessage.success('数据导出成功')
  } catch (error) {
    console.error('数据导出失败:', error)
    ElMessage.error('数据导出失败')
  }
}

watch(trendDateRange, () => {
  fetchDashboard()
})

const handleResize = () => {
  categoryChart?.resize()
  trendChart?.resize()
  bookStatusChart?.resize()
  monthlyChart?.resize()
}

onMounted(async () => {
  // 初始化图表，使用默认数据
  initCategoryChart(stats.value.categoryStats)
  initTrendChart(stats.value.borrowTrend)
  initBookStatusChart(stats.value.bookStatus)
  initMonthlyChart(stats.value.monthlyStats)
  
  // 尝试从 API 获取数据，确保 fetchDashboard 先执行
  await fetchDashboard()
  // 其他 API 请求可以并行执行
  Promise.all([
    fetchHotBooks(),
    fetchCategoryBorrow(),
    fetchReaderBorrow()
  ])
  
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  categoryChart?.dispose()
  trendChart?.dispose()
  bookStatusChart?.dispose()
  monthlyChart?.dispose()
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.statistics-page {
  padding: 20px;
}

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  cursor: pointer;
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.stat-content {
  display: flex;
  align-items: center;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
}

.stat-icon .el-icon {
  font-size: 30px;
  color: #fff;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #333;
}

.stat-label {
  font-size: 14px;
  color: #999;
  margin-top: 5px;
}

.charts-row {
  margin-bottom: 20px;
}

.card-header {
  font-weight: bold;
  font-size: 16px;
}

.book-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.el-table {
  font-size: 13px;
}

.el-table th {
  background-color: #f5f7fa !important;
  font-weight: bold;
  color: #606266;
}

.el-table--striped .el-table__row--striped {
  background-color: #f9fafc !important;
}

.el-table__row:hover {
  background-color: #ecf5ff !important;
}

/* 暗黑模式适配 */
html.dark .stat-card {
  background-color: #2d2d2d;
  border-color: #3d3d3d;
}

html.dark .stat-value {
  color: #bfcbd9;
}

html.dark .stat-label {
  color: #8391a5;
}

html.dark .stat-icon {
  background-color: #3a4a64;
}
</style>
