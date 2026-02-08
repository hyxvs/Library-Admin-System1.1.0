<template>
  <div class="book-form-page">
    <van-nav-bar
      :title="isEdit ? '编辑图书' : '新增图书'"
      left-arrow
      @click-left="onClickLeft"
    />

    <van-form @submit="handleSubmit">
      <van-cell-group inset>
        <van-field name="uploader" label="图书封面">
          <template #input>
            <van-uploader
              v-model="fileList"
              :max-count="1"
              :after-read="afterRead"
              :before-delete="beforeDelete"
              accept="image/*"
            />
          </template>
        </van-field>
        <van-field
          v-model="form.isbn"
          name="isbn"
          label="ISBN"
          placeholder="请输入ISBN"
        />
        <van-field
          v-model="form.title"
          name="title"
          label="书名"
          placeholder="请输入书名"
          :rules="[{ required: true, message: '请输入书名' }]"
        />
        <van-field
          v-model="form.author"
          name="author"
          label="作者"
          placeholder="请输入作者"
          :rules="[{ required: true, message: '请输入作者' }]"
        />
        <van-field
          v-model="form.publisher"
          name="publisher"
          label="出版社"
          placeholder="请输入出版社"
        />
        <van-field
          v-model="form.publish_date"
          name="publish_date"
          label="出版日期"
          type="date"
          placeholder="请选择出版日期"
        />
        <van-field
          v-model="form.category_id"
          name="category_id"
          label="分类"
          placeholder="请选择分类"
          readonly
          is-link
          @click="showCategoryPicker = true"
        />
        <van-field
          v-model.number="form.price"
          name="price"
          label="价格"
          type="number"
          placeholder="请输入价格"
        />
        <van-field
          v-model.number="form.total_count"
          name="total_count"
          label="总数量"
          type="number"
          placeholder="请输入总数量"
          :rules="[{ required: true, message: '请输入总数量' }]"
        />
        <van-field
          v-model="form.location"
          name="location"
          label="馆藏位置"
          placeholder="请输入馆藏位置"
        />
        <van-field
          v-model="form.description"
          name="description"
          label="图书描述"
          type="textarea"
          placeholder="请输入图书描述"
          rows="3"
        />
      </van-cell-group>

      <div class="submit-btn">
        <van-button round block type="primary" native-type="submit" :loading="loading">
          保存
        </van-button>
      </div>
    </van-form>

    <van-popup :show="showCategoryPicker" @update:show="showCategoryPicker = $event" position="bottom">
      <van-picker
        :columns="categoryOptions"
        title="选择分类"
        @confirm="onCategoryConfirm"
        @cancel="showCategoryPicker = false"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getBookDetail, createBook, updateBook, uploadBookImage } from '@/api/books'
import { showToast } from 'vant'

const router = useRouter()
const route = useRoute()

const isEdit = computed(() => !!route.params.id)

const form = ref({
  isbn: '',
  title: '',
  author: '',
  publisher: '',
  publish_date: '',
  category_id: '',
  price: '',
  total_count: '',
  location: '',
  description: '',
  cover: ''
})

const fileList = ref([])
const loading = ref(false)
const showCategoryPicker = ref(false)
const uploading = ref(false)

const categoryOptions = ref([
  { text: '文学', value: 1 },
  { text: '科技', value: 2 },
  { text: '历史', value: 3 },
  { text: '艺术', value: 4 },
  { text: '哲学', value: 5 }
])

const onClickLeft = () => {
  router.back()
}

const onCategoryConfirm = ({ selectedOptions }) => {
  form.value.category_id = selectedOptions[0].value
  showCategoryPicker.value = false
}

const afterRead = async (file) => {
  uploading.value = true
  try {
    const formData = new FormData()
    formData.append('file', file.file)
    
    const res = await uploadBookImage(formData)
    form.value.cover = res.data.url
    
    showToast({
      type: 'success',
      message: '上传成功'
    })
  } catch (error) {
    console.error('上传失败:', error)
    showToast({
      type: 'fail',
      message: '上传失败'
    })
    fileList.value = []
  } finally {
    uploading.value = false
  }
}

const beforeDelete = () => {
  form.value.cover = ''
  return true
}

const handleSubmit = async () => {
  loading.value = true
  try {
    if (isEdit.value) {
      await updateBook(route.params.id, form.value)
      showToast({
        type: 'success',
        message: '更新成功'
      })
    } else {
      await createBook(form.value)
      showToast({
        type: 'success',
        message: '创建成功'
      })
    }
    router.back()
  } catch (error) {
    console.error('保存失败:', error)
  } finally {
    loading.value = false
  }
}

const fetchBookDetail = async () => {
  try {
    const res = await getBookDetail(route.params.id)
    const bookData = res.data
    // 转换 ISO 格式日期为 yyyy-MM-dd 格式
    if (bookData.publish_date) {
      const date = new Date(bookData.publish_date)
      bookData.publish_date = date.toISOString().split('T')[0]
    }
    form.value = bookData
    
    // 如果有封面图片，设置到 fileList
    if (bookData.cover) {
      fileList.value = [{
        url: bookData.cover,
        isImage: true
      }]
    }
  } catch (error) {
    console.error('获取图书详情失败:', error)
  }
}

onMounted(() => {
  if (isEdit.value) {
    fetchBookDetail()
  }
})
</script>

<style scoped>
.book-form-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.submit-btn {
  margin: 20px 16px;
}
</style>
