<template>
  <!-- 路由视图组件，用于显示当前路由对应的组件 -->
  <router-view />
</template>

<script setup>
// 组合式 API 脚本部分
// 由于该组件只是一个简单的路由容器，因此不需要额外的逻辑
</script>

<style>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 设置根元素样式 */
html, body, #app {
  width: 100%;
  height: 100%;
  font-family: 'Microsoft YaHei', Arial, sans-serif;
}
</style>
