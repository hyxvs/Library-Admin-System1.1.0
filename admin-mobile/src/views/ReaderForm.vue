<template>
  <div class="reader-form-page">
    <van-nav-bar
      :title="isEdit ? '编辑读者' : '新增读者'"
      left-arrow
      @click-left="onClickLeft"
    />

    <van-form @submit="handleSubmit">
      <van-cell-group inset>
        <van-field
          v-model="form.reader_no"
          name="reader_no"
          label="读者证号"
          placeholder="请输入读者证号"
          :rules="[{ required: true, message: '请输入读者证号' }]"
        />
        <van-field
          v-model="form.name"
          name="name"
          label="姓名"
          placeholder="请输入姓名"
          :rules="[{ required: true, message: '请输入姓名' }]"
        />
        <van-field
          v-model="form.gender"
          name="gender"
          label="性别"
          placeholder="请选择性别"
          readonly
          is-link
          @click="showGenderPicker = true"
        />
        <van-field
          v-model="form.birthdate"
          name="birthdate"
          label="出生日期"
          type="date"
          placeholder="请选择出生日期"
        />
        <van-field
          v-model="form.id_card"
          name="id_card"
          label="身份证号"
          placeholder="请输入身份证号"
        />
        <van-field
          v-model="form.phone"
          name="phone"
          label="联系电话"
          type="tel"
          placeholder="请输入联系电话"
        />
        <van-field
          v-model="form.email"
          name="email"
          label="邮箱"
          type="email"
          placeholder="请输入邮箱"
        />
        <van-field
          v-model="form.address"
          name="address"
          label="地址"
          placeholder="请输入地址"
        />
        <van-field
          v-model.number="form.debt"
          name="debt"
          label="欠费金额"
          type="number"
          placeholder="请输入欠费金额"
        />
      </van-cell-group>

      <div class="submit-btn">
        <van-button round block type="primary" native-type="submit" :loading="loading">
          保存
        </van-button>
      </div>
    </van-form>

    <van-popup :show="showGenderPicker" @update:show="showGenderPicker = $event" position="bottom">
      <van-picker
        :columns="genderOptions"
        title="选择性别"
        @confirm="onGenderConfirm"
        @cancel="showGenderPicker = false"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getReaderDetail, createReader, updateReader } from '@/api/readers'
import { showToast } from 'vant'

const router = useRouter()
const route = useRoute()

const isEdit = computed(() => !!route.params.id)

const form = ref({
  reader_no: '',
  name: '',
  gender: '',
  birthdate: '',
  id_card: '',
  phone: '',
  email: '',
  address: '',
  debt: 0
})

const loading = ref(false)
const showGenderPicker = ref(false)

const genderOptions = ref([
  { text: '男', value: '男' },
  { text: '女', value: '女' }
])

const onClickLeft = () => {
  router.back()
}

const onGenderConfirm = ({ selectedOptions }) => {
  form.value.gender = selectedOptions[0].value
  showGenderPicker.value = false
}

const handleSubmit = async () => {
  loading.value = true
  try {
    if (isEdit.value) {
      await updateReader(route.params.id, form.value)
      showToast({
        type: 'success',
        message: '更新成功'
      })
    } else {
      await createReader(form.value)
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

const fetchReaderDetail = async () => {
  try {
    const res = await getReaderDetail(route.params.id)
    form.value = res.data
  } catch (error) {
    console.error('获取读者详情失败:', error)
  }
}

onMounted(() => {
  if (isEdit.value) {
    fetchReaderDetail()
  }
})
</script>

<style scoped>
.reader-form-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.submit-btn {
  margin: 20px 16px;
}
</style>
