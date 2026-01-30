<script setup>
/**
 * App.vue 根组件
 * 应用的入口组件，包含路由视图和全局样式
 */
</script>

<template>
  <!-- 路由视图，用于显示当前路由对应的组件 -->
  <router-view />
</template>

<style>
/* 全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box; /* 盒模型设置为 border-box */
}

body {
  font-family: 'Microsoft YaHei', Arial, sans-serif; /* 字体设置 */
  background-color: #f5f7fa; /* 背景颜色 */
  color: #303133; /* 文字颜色 */
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px; /* 滚动条宽度 */
  height: 8px; /* 滚动条高度 */
}

::-webkit-scrollbar-track {
  background: #f1f1f1; /* 滚动条轨道颜色 */
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1; /* 滚动条滑块颜色 */
  border-radius: 4px; /* 滚动条滑块圆角 */
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8; /* 滚动条滑块悬停颜色 */
}
</style>
