// pages/books/books.js
import { searchBooks, getBookCategories } from '../../api/books'

Page({
  data: {
    keyword: '',
    books: [],
    categories: [],
    selectedCategory: null,
    sortBy: 'default',
    page: 1,
    pageSize: 12,
    hasMore: true,
    loading: false
  },

  onLoad() {
    this.initData()
  },

  // 初始化数据
  async initData() {
    try {
      // 获取图书分类
      const categoriesRes = await getBookCategories()
      if (categoriesRes.data) {
        this.setData({ categories: categoriesRes.data })
      }

      // 初始加载图书
      await this.loadBooks()
    } catch (error) {
      console.error('初始化数据失败:', error)
    }
  },

  // 关键词输入
  onKeywordInput(e) {
    this.setData({ keyword: e.detail.value })
  },

  // 清除关键词
  clearKeyword() {
    this.setData({ keyword: '' })
  },

  // 选择分类
  selectCategory(e) {
    const categoryId = e.currentTarget.dataset.id
    this.setData({
      selectedCategory: this.data.selectedCategory === categoryId ? null : categoryId,
      page: 1,
      books: []
    })
    this.loadBooks()
  },

  // 排序
  sortBy(e) {
    this.setData({
      sortBy: e.currentTarget.dataset.type,
      page: 1,
      books: []
    })
    this.loadBooks()
  },

  // 搜索
  handleSearch() {
    this.setData({ page: 1, books: [] })
    this.loadBooks()
  },

  // 加载图书
  async loadBooks() {
    if (this.data.loading || !this.data.hasMore) return

    this.setData({ loading: true })

    try {
      const params = {
        keyword: this.data.keyword,
        categoryId: this.data.selectedCategory,
        sort: this.data.sortBy,
        page: this.data.page,
        pageSize: this.data.pageSize
      }

      const res = await searchBooks(params)

      if (res.data) {
        const newBooks = this.data.page === 1 ? res.data.list : [...this.data.books, ...res.data.list]
        this.setData({
          books: newBooks,
          hasMore: newBooks.length < res.data.total,
          page: this.data.page + 1
        })
      }
    } catch (error) {
      console.error('加载图书失败:', error)
    } finally {
      this.setData({ loading: false })
    }
  },

  // 跳转到图书详情
  goToBookDetail(e) {
    const bookId = e.currentTarget.dataset.id
    wx.navigateTo({ url: `/pages/bookDetail/bookDetail?id=${bookId}` })
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.setData({ page: 1, books: [], hasMore: true })
    this.loadBooks().finally(() => {
      wx.stopPullDownRefresh()
    })
  },

  // 上拉加载更多
  onReachBottom() {
    this.loadBooks()
  },

  // 获取封面图片URL
  getCoverUrl(cover) {
    if (!cover) {
      return 'https://img.yzcdn.cn/vant/cat.jpeg'
    }
    // 检查是否为完整URL
    if (cover.startsWith('http://') || cover.startsWith('https://')) {
      return cover
    }
    // 相对路径，拼接完整URL
    const app = getApp()
    const baseUrl = app.globalData.apiBaseUrl
    // 移除baseUrl中的/api后缀
    const uploadBaseUrl = baseUrl.replace('/api', '')
    return uploadBaseUrl + cover
  }
})