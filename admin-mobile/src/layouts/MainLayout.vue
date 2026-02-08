<template>
  <div class="main-layout">
    <div class="content">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" v-if="$route.meta.keepAlive" />
        </keep-alive>
        <component :is="Component" v-if="!$route.meta.keepAlive" />
      </router-view>
    </div>
    <van-tabbar v-model="active" route safe-area-inset-bottom>
      <van-tabbar-item to="/dashboard" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item to="/books" icon="books-o">图书</van-tabbar-item>
      <van-tabbar-item to="/readers" icon="friends-o">读者</van-tabbar-item>
      <van-tabbar-item to="/borrow" icon="todo-list-o">借阅</van-tabbar-item>
      <van-tabbar-item to="/profile" icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const active = ref(0)
</script>

<style scoped>
.main-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

.content {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 50px;
}
</style>
