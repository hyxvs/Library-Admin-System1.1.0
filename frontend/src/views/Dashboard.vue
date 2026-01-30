<template>
  <div class="dashboard">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>统计报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 筛选区 -->
    <el-card class="filter-card">
      <el-form :inline="true" :model="filterForm" class="filter-form">
        <el-form-item label="时间范围">
          <el-select v-model="filterForm.timeRange" placeholder="请选择时间范围" clearable>
            <el-option label="近7天" value="7" />
            <el-option label="近30天" value="30" />
            <el-option label="自定义" value="custom" />
          </el-select>
        </el-form-item>
        <el-form-item label="日期选择" v-if="filterForm.timeRange === 'custom'">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            @change="handleDateChange"
          />
        </el-form-item>
        <el-form-item label="统计维度">
          <el-select v-model="filterForm.dimension" placeholder="请选择统计维度" clearable>
            <el-option label="全部" value="all" />
            <el-option label="图书" value="books" />
            <el-option label="读者" value="readers" />
            <el-option label="借阅" value="borrow" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleRefresh" :loading="refreshLoading">
            <el-icon><Refresh /></el-icon>
            刷新图表
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 数据卡片区域 -->
    <el-row :gutter="20" class="stats-row">
      <!-- 图书总数 -->
      <el-col :span="6">
        <el-card class="stat-card">
          <el-statistic
            :value="stats.totalBooks"
            title="图书总数"
            :precision="0"
          >
            <template #prefix>
              <el-icon><Reading /></el-icon>
            </template>
            <template #suffix>
              <span class="stat-change" :class="{ 'increase': stats.booksChange > 0, 'decrease': stats.booksChange < 0 }">
                {{ stats.booksChange > 0 ? '+' : '' }}{{ stats.booksChange }}%
              </span>
            </template>
          </el-statistic>
        </el-card>
      </el-col>

      <!-- 读者总数 -->
      <el-col :span="6">
        <el-card class="stat-card">
          <el-statistic
            :value="stats.totalReaders"
            title="读者总数"
            :precision="0"
          >
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
            <template #suffix>
              <span class="stat-change" :class="{ 'increase': stats.readersChange > 0, 'decrease': stats.readersChange < 0 }">
                {{ stats.readersChange > 0 ? '+' : '' }}{{ stats.readersChange }}%
              </span>
            </template>
          </el-statistic>
        </el-card>
      </el-col>

      <!-- 当前借阅 -->
      <el-col :span="6">
        <el-card class="stat-card">
          <el-statistic
            :value="stats.totalBorrowed"
            title="当前借阅"
            :precision="0"
          >
            <template #prefix>
              <el-icon><DocumentCopy /></el-icon>
            </template>
            <template #suffix>
              <span class="stat-change" :class="{ 'increase': stats.borrowedChange > 0, 'decrease': stats.borrowedChange < 0 }">
                {{ stats.borrowedChange > 0 ? '+' : '' }}{{ stats.borrowedChange }}%
              </span>
            </template>
          </el-statistic>
        </el-card>
      </el-col>

      <!-- 逾期未还 -->
      <el-col :span="6">
        <el-card class="stat-card">
          <el-statistic
            :value="stats.totalOverdue"
            title="逾期未还"
            :precision="0"
          >
            <template #prefix>
              <el-icon><Warning /></el-icon>
            </template>
            <template #suffix>
              <span class="stat-change" :class="{ 'increase': stats.overdueChange > 0, 'decrease': stats.overdueChange < 0 }">
                {{ stats.overdueChange > 0 ? '+' : '' }}{{ stats.overdueChange }}%
              </span>
            </template>
          </el-statistic>
        </el-card>
      </el-col>

      <!-- 预约总数 -->
      <el-col :span="6">
        <el-card class="stat-card">
          <el-statistic
            :value="stats.totalAppointments"
            title="预约总数"
            :precision="0"
          >
            <template #prefix>
              <el-icon><Tickets /></el-icon>
            </template>
            <template #suffix>
              <span class="stat-change" :class="{ 'increase': stats.appointmentsChange > 0, 'decrease': stats.appointmentsChange < 0 }">
                {{ stats.appointmentsChange > 0 ? '+' : '' }}{{ stats.appointmentsChange }}%
              </span>
            </template>
          </el-statistic>
        </el-card>
      </el-col>

      <!-- 催还总数 -->
      <el-col :span="6">
        <el-card class="stat-card">
          <el-statistic
            :value="stats.totalReminders"
            title="催还总数"
            :precision="0"
          >
            <template #prefix>
              <el-icon><ChatDotRound /></el-icon>
            </template>
            <template #suffix>
              <span class="stat-change" :class="{ 'increase': stats.remindersChange > 0, 'decrease': stats.remindersChange < 0 }">
                {{ stats.remindersChange > 0 ? '+' : '' }}{{ stats.remindersChange }}%
              </span>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="charts-row">
      <!-- 热门图书 TOP10 -->
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="chart-header">
              <span>热门图书 TOP10</span>
              <el-dropdown @command="handleChartTypeChange('hotBooks', $event)">
                <el-button size="small">
                  {{ chartTypes.hotBooks }} <el-icon class="el-icon--right"><ArrowDown /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="bar">柱状图</el-dropdown-item>
                    <el-dropdown-item command="line">折线图</el-dropdown-item>
                    <el-dropdown-item command="pie">饼图</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
          <div ref="hotBooksChartRef" style="width: 100%; height: 400px"></div>
        </el-card>
      </el-col>

      <!-- 分类借阅占比 -->
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="chart-header">
              <span>分类借阅占比</span>
              <el-dropdown @command="handleChartTypeChange('category', $event)">
                <el-button size="small">
                  {{ chartTypes.category }} <el-icon class="el-icon--right"><ArrowDown /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="pie">饼图</el-dropdown-item>
                    <el-dropdown-item command="bar">柱状图</el-dropdown-item>
                    <el-dropdown-item command="line">折线图</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
          <!-- 为了确保DOM元素存在，添加一个唯一的id和ref属性，并确保样式正确 -->
          <div id="categoryChart" ref="categoryChartRef" style="width: 100%; height: 400px; background-color: #f5f7fa;"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 借阅趋势图 -->
    <el-row :gutter="20" class="charts-row">
      <el-col :span="24">
        <el-card class="chart-card">
          <template #header>
            <div class="chart-header">
              <span>借阅趋势</span>
              <el-dropdown @command="handleChartTypeChange('trend', $event)">
                <el-button size="small">
                  {{ chartTypes.trend }} <el-icon class="el-icon--right"><ArrowDown /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="line">折线图</el-dropdown-item>
                    <el-dropdown-item command="bar">柱状图</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
          <div ref="trendChartRef" style="width: 100%; height: 400px"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 热门图书表格 -->
    <el-row :gutter="20" class="charts-row">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>热门图书详情</span>
            </div>
          </template>
          <el-table :data="hotBooks" style="width: 100%" border stripe>
            <el-table-column type="index" label="排名" width="80" />
            <el-table-column prop="isbn" label="ISBN" width="150" />
            <el-table-column prop="title" label="书名" min-width="200" />
            <el-table-column prop="author" label="作者" width="120" />
            <el-table-column prop="category_name" label="分类" width="100" />
            <el-table-column prop="borrow_count" label="借阅次数" width="100" />
            <el-table-column label="库存" width="150">
              <template #default="{ row }">
                <el-tag type="success" v-if="row.available_count > 0">
                  {{ row.available_count }} / {{ row.total_count }}
                </el-tag>
                <el-tag type="danger" v-else>无库存</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import { getDashboard, getHotBooks } from '@/api/statistics'
import {
  User,
  Reading,
  DocumentCopy,
  Warning,
  Tickets,
  ChatDotRound,
  Refresh,
  ArrowDown
} from '@element-plus/icons-vue'

// 筛选表单
const filterForm = ref({
  timeRange: '7',
  dimension: 'all',
  startDate: '',
  endDate: ''
})

// 日期范围
const dateRange = ref([])

// 加载状态
const refreshLoading = ref(false)

// 数据
const stats = ref({
  totalReaders: 0,
  totalBooks: 0,
  totalBorrowed: 0,
  totalOverdue: 0,
  totalAppointments: 0,
  totalReminders: 0,
  // 变化率
  readersChange: 0,
  booksChange: 0,
  borrowedChange: 0,
  overdueChange: 0,
  appointmentsChange: 0,
  remindersChange: 0
})

// 热门图书
const hotBooks = ref([])

// 图表引用
const hotBooksChartRef = ref(null)
const categoryChartRef = ref(null)
const trendChartRef = ref(null)

// 图表实例
let hotBooksChart = null
let categoryChart = null
let trendChart = null

// 图表类型
const chartTypes = ref({
  hotBooks: '柱状图',
  category: '饼图',
  trend: '折线图'
})

// 图表类型映射
const chartTypeMap = {
  hotBooks: 'bar',
  category: 'pie',
  trend: 'line'
}

// 日期变化处理
const handleDateChange = (val) => {
  if (val && val.length === 2) {
    filterForm.value.startDate = val[0]
    filterForm.value.endDate = val[1]
  } else {
    filterForm.value.startDate = ''
    filterForm.value.endDate = ''
  }
}

// 刷新图表
const handleRefresh = async () => {
  refreshLoading.value = true
  try {
    await fetchDashboard()
    await fetchHotBooks()
  } catch (error) {
    console.error('刷新数据失败:', error)
  } finally {
    refreshLoading.value = false
  }
}

// 图表类型切换
const handleChartTypeChange = (chartName, type) => {
  // 更新图表类型
  switch (type) {
    case 'bar':
      chartTypes.value[chartName] = '柱状图'
      break
    case 'line':
      chartTypes.value[chartName] = '折线图'
      break
    case 'pie':
      chartTypes.value[chartName] = '饼图'
      break
  }
  chartTypeMap[chartName] = type
  console.log('图表类型更新成功:', { chartName, type, chartTypeMap })
  
  // 重新初始化图表
  fetchDashboard()
}

// 获取仪表盘数据
const fetchDashboard = async () => {
  try {
    console.log('开始获取仪表盘数据')
    const params = {
      timeRange: filterForm.value.timeRange,
      dimension: filterForm.value.dimension,
      startDate: filterForm.value.startDate,
      endDate: filterForm.value.endDate
    }
    console.log('发送请求到getDashboard接口，参数:', params)
    const res = await getDashboard(params)
    console.log('收到getDashboard接口响应:', res)
    if (res.code === 200) {
      // 模拟数据变化率
      const data = res.data
      console.log('仪表盘数据:', data)
      console.log('categoryStats数据:', data.categoryStats)
      console.log('categoryStats类型:', typeof data.categoryStats)
      console.log('categoryStats是否为数组:', Array.isArray(data.categoryStats))
      stats.value = {
        ...data,
        // 模拟变化率
        readersChange: Math.floor(Math.random() * 20) - 5,
        booksChange: Math.floor(Math.random() * 15) - 3,
        borrowedChange: Math.floor(Math.random() * 25) - 8,
        overdueChange: Math.floor(Math.random() * 30) - 10,
        appointmentsChange: Math.floor(Math.random() * 20) - 5,
        remindersChange: Math.floor(Math.random() * 25) - 8
      }
      // 初始化图表
      console.log('准备初始化热门图书图表，数据:', data.hotBooks)
      initHotBooksChart(data.hotBooks)
      
      // 使用nextTick确保DOM元素已经渲染完成，然后再初始化分类借阅占比图表
      console.log('准备初始化分类借阅占比图表，数据:', data.categoryStats)
      nextTick(() => {
        console.log('使用nextTick确保DOM元素已经渲染完成')
        initCategoryChart(data.categoryStats)
      })
      
      console.log('准备初始化借阅趋势图表，数据:', data.borrowTrend)
      initTrendChart(data.borrowTrend)
    } else {
      console.log('接口返回错误代码:', res.code)
    }
  } catch (error) {
    console.error('获取统计数据失败:', error)
    console.error('错误堆栈:', error.stack)
  }
}

// 获取热门图书
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

// 初始化热门图书图表
const initHotBooksChart = (data) => {
  if (!hotBooksChartRef.value || !data || !Array.isArray(data)) return

  try {
    // 确保DOM元素已经渲染完成
    if (hotBooksChartRef.value.clientWidth === 0 || hotBooksChartRef.value.clientHeight === 0) {
      // 延迟初始化
      setTimeout(() => initHotBooksChart(data), 100)
      return
    }

    // 销毁现有实例
    if (hotBooksChart) {
      hotBooksChart.dispose()
    }
    hotBooksChart = echarts.init(hotBooksChartRef.value)

    const type = chartTypeMap.hotBooks
    const chartData = data.slice(0, 10)

    let option

    if (type === 'bar') {
      option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
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
          data: chartData.map(item => item.title),
          axisLabel: {
            rotate: 45,
            fontSize: 12
          }
        },
        yAxis: {
          type: 'value',
          name: '借阅次数'
        },
        series: [
          {
            name: '借阅次数',
            type: 'bar',
            data: chartData.map(item => item.borrow_count),
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#409eff' },
                { offset: 1, color: '#66b1ff' }
              ])
            }
          }
        ]
      }
    } else if (type === 'line') {
      option = {
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: chartData.map(item => item.title),
          axisLabel: {
            rotate: 45,
            fontSize: 12
          }
        },
        yAxis: {
          type: 'value',
          name: '借阅次数'
        },
        series: [
          {
            name: '借阅次数',
            type: 'line',
            data: chartData.map(item => item.borrow_count),
            smooth: true,
            lineStyle: {
              color: '#409eff'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(64, 158, 255, 0.5)' },
                { offset: 1, color: 'rgba(64, 158, 255, 0.1)' }
              ])
            }
          }
        ]
      }
    } else if (type === 'pie') {
      option = {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          textStyle: {
            fontSize: 12
          }
        },
        series: [
          {
            name: '借阅次数',
            type: 'pie',
            radius: '50%',
            data: chartData.map(item => ({
              value: item.borrow_count,
              name: item.title
            })),
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
    }

    if (option) {
      hotBooksChart.setOption(option)
    }
  } catch (error) {
    console.error('初始化热门图书图表失败:', error)
  }
}

// 初始化分类借阅占比图表
const initCategoryChart = (data) => {
  console.log('==================== 开始初始化分类借阅占比图表 ====================')
  console.log('传入的数据:', data)
  console.log('categoryChartRef:', categoryChartRef)
  console.log('categoryChartRef.value:', categoryChartRef.value)
  
  // 确保DOM元素存在
  if (!categoryChartRef.value) {
    console.log('❌ categoryChartRef.value不存在，使用setTimeout重试')
    // 使用setTimeout重试
    setTimeout(() => {
      console.log('⏰ 重试获取categoryChartRef.value:', categoryChartRef.value)
      if (categoryChartRef.value) {
        console.log('✅ categoryChartRef.value现在存在了，重新初始化图表')
        initCategoryChart(data)
      } else {
        console.log('❌ categoryChartRef.value仍然不存在')
      }
    }, 1000)
    return
  }
  
  // 确保数据存在且是数组
  if (!data || !Array.isArray(data)) {
    console.log('❌ 数据不存在或不是数组:', data)
    return
  }
  
  // 确保数据不为空
  if (data.length === 0) {
    console.log('❌ 数据为空数组:', data)
    return
  }
  
  try {
    console.log('✅ 开始创建图表实例')
    // 销毁现有实例
    if (categoryChart) {
      console.log('🔄 销毁现有图表实例')
      categoryChart.dispose()
    }
    
    // 创建新实例
    console.log('📊 创建新图表实例')
    categoryChart = echarts.init(categoryChartRef.value)
    console.log('✅ 创建的图表实例:', categoryChart)
    
    // 准备图表数据
    console.log('📝 准备图表数据')
    const chartData = data.filter(item => {
      const borrowCount = Number(item.borrow_count)
      return borrowCount != null && borrowCount > 0
    }).map(item => ({
      value: Number(item.borrow_count),
      name: item.category_name
    }))
    console.log('✅ 准备的图表数据:', chartData)
    
    // 确保过滤后的数据不为空
    if (chartData.length === 0) {
      console.log('❌ 过滤后的数据为空数组，显示空数据提示')
      const emptyOption = {
        title: {
          text: '暂无借阅数据',
          left: 'center',
          top: 'center',
          textStyle: {
            color: '#999',
            fontSize: 16
          }
        }
      }
      categoryChart.setOption(emptyOption)
      return
    }
    
    const type = chartTypeMap.category
    let option

    if (type === 'pie') {
      option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c}次 ({d}%)'
        },
        legend: {
          orient: 'vertical',
          right: '5%',
          top: 'center',
          textStyle: {
            fontSize: 12
          }
        },
        series: [
          {
            name: '分类借阅占比',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['35%', '50%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: true,
              formatter: '{b}: {d}%',
              fontSize: 12
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 14,
                fontWeight: 'bold'
              },
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            labelLine: {
              show: true
            },
            data: chartData
          }
        ]
      }
    } else if (type === 'bar') {
      option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
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
          data: chartData.map(item => item.name),
          axisLabel: {
            rotate: 30,
            fontSize: 12
          }
        },
        yAxis: {
          type: 'value',
          name: '借阅次数'
        },
        series: [
          {
            name: '借阅次数',
            type: 'bar',
            data: chartData.map(item => item.value),
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#67C23A' },
                { offset: 1, color: '#95D475' }
              ])
            }
          }
        ]
      }
    } else if (type === 'line') {
      option = {
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: chartData.map(item => item.name),
          axisLabel: {
            rotate: 30,
            fontSize: 12
          }
        },
        yAxis: {
          type: 'value',
          name: '借阅次数'
        },
        series: [
          {
            name: '借阅次数',
            type: 'line',
            data: chartData.map(item => item.value),
            smooth: true,
            lineStyle: {
              color: '#67C23A'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(103, 194, 58, 0.5)' },
                { offset: 1, color: 'rgba(103, 194, 58, 0.1)' }
              ])
            }
          }
        ]
      }
    }
    console.log('✅ 图表配置:', option)
    
    // 设置图表选项
    console.log('📈 设置图表选项')
    const result = categoryChart.setOption(option)
    console.log('✅ 设置图表选项结果:', result)
    console.log('🎉 分类借阅占比图表初始化成功')
    
    // 监听图表点击事件，测试图表是否正常工作
    categoryChart.on('click', function(params) {
      console.log('👆 图表点击事件:', params)
    })
  } catch (error) {
    console.error('💥 初始化分类借阅占比图表失败:', error)
    console.error('💥 错误堆栈:', error.stack)
  }
  console.log('==================== 结束初始化分类借阅占比图表 ====================')
}

// 初始化借阅趋势图表
const initTrendChart = (data) => {
  if (!trendChartRef.value || !data || !Array.isArray(data)) return

  try {
    // 确保DOM元素已经渲染完成
    if (trendChartRef.value.clientWidth === 0 || trendChartRef.value.clientHeight === 0) {
      // 延迟初始化
      setTimeout(() => initTrendChart(data), 100)
      return
    }

    // 销毁现有实例
    if (trendChart) {
      trendChart.dispose()
    }
    trendChart = echarts.init(trendChartRef.value)

    const type = chartTypeMap.trend

    let option

    if (type === 'line') {
      option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: ['总借阅', '借阅中', '已归还', '已逾期'],
          bottom: 10
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          top: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: data.map(item => item.date.split(' ')[0])
        },
        yAxis: {
          type: 'value',
          name: '借阅次数'
        },
        series: [
          {
            name: '总借阅',
            type: 'line',
            stack: 'Total',
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(64, 158, 255, 0.5)' },
                { offset: 1, color: 'rgba(64, 158, 255, 0.1)' }
              ])
            },
            emphasis: {
              focus: 'series'
            },
            data: data.map(item => item.total_count),
            itemStyle: {
              color: '#409eff'
            }
          },
          {
            name: '借阅中',
            type: 'line',
            emphasis: {
              focus: 'series'
            },
            data: data.map(item => item.borrowed_count),
            itemStyle: {
              color: '#67c23a'
            }
          },
          {
            name: '已归还',
            type: 'line',
            emphasis: {
              focus: 'series'
            },
            data: data.map(item => item.returned_count),
            itemStyle: {
              color: '#e6a23c'
            }
          },
          {
            name: '已逾期',
            type: 'line',
            emphasis: {
              focus: 'series'
            },
            data: data.map(item => item.overdue_count),
            itemStyle: {
              color: '#f56c6c'
            }
          }
        ]
      }
    } else if (type === 'bar') {
      option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['总借阅', '借阅中', '已归还', '已逾期'],
          bottom: 10
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          top: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: data.map(item => item.date.split(' ')[0])
        },
        yAxis: {
          type: 'value',
          name: '借阅次数'
        },
        series: [
          {
            name: '总借阅',
            type: 'bar',
            data: data.map(item => item.total_count),
            itemStyle: {
              color: '#409eff'
            }
          },
          {
            name: '借阅中',
            type: 'bar',
            data: data.map(item => item.borrowed_count),
            itemStyle: {
              color: '#67c23a'
            }
          },
          {
            name: '已归还',
            type: 'bar',
            data: data.map(item => item.returned_count),
            itemStyle: {
              color: '#e6a23c'
            }
          },
          {
            name: '已逾期',
            type: 'bar',
            data: data.map(item => item.overdue_count),
            itemStyle: {
              color: '#f56c6c'
            }
          }
        ]
      }
    }

    if (option) {
      trendChart.setOption(option)
    }
  } catch (error) {
    console.error('初始化借阅趋势图表失败:', error)
  }
}

// 窗口大小变化处理
const handleResize = () => {
  hotBooksChart?.resize()
  categoryChart?.resize()
  trendChart?.resize()
}

// 生命周期
onMounted(() => {
  fetchDashboard()
  fetchHotBooks()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  hotBooksChart?.dispose()
  categoryChart?.dispose()
  trendChart?.dispose()
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.dashboard {
  padding: 20px;
  background-color: var(--el-bg-color);
  min-height: calc(100vh - 60px);
}

/* 面包屑导航 */
.breadcrumb {
  margin-bottom: 20px;
}

/* 筛选卡片 */
.filter-card {
  margin-bottom: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  overflow: hidden;
}

.filter-form {
  width: 100%;
}

.filter-form .el-form-item {
  margin-right: 16px;
  margin-bottom: 16px;
}

/* 数据卡片 */
.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  overflow: hidden;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.stat-change {
  font-size: 12px;
  margin-left: 8px;
}

.stat-change.increase {
  color: #67c23a;
}

.stat-change.decrease {
  color: #f56c6c;
}

/* 图表区域 */
.charts-row {
  margin-bottom: 20px;
}

.chart-card {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  overflow: hidden;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  font-size: 16px;
}

.card-header {
  font-weight: bold;
  font-size: 16px;
}

/* 响应式设计 */
@media screen and (max-width: 1200px) {
  .stats-row .el-col {
    flex: 0 0 50%;
    max-width: 50%;
  }
}

@media screen and (max-width: 768px) {
  .dashboard {
    padding: 10px;
  }

  .stats-row .el-col {
    flex: 0 0 100%;
    max-width: 100%;
  }

  .charts-row .el-col {
    flex: 0 0 100%;
    max-width: 100%;
  }

  .filter-form {
    flex-direction: column;
    align-items: flex-start;
  }

  .filter-form .el-form-item {
    margin-right: 0;
    width: 100%;
  }

  .chart-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}

/* 暗黑模式由Element Plus内置支持 */

/* 1920px+ 大屏幕适配 */
@media screen and (min-width: 1920px) {
  .dashboard {
    max-width: 1880px;
    margin: 0 auto;
  }

  .stats-row .el-col {
    flex: 0 0 25%;
    max-width: 25%;
  }

  .charts-row .el-col {
    flex: 0 0 50%;
    max-width: 50%;
  }

  .chart-card {
    height: 450px;
  }

  .stat-card {
    height: 180px;
  }
}
</style>
