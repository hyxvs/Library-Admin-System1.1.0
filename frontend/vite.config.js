import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
  build: {
    // 代码分割配置
    rollupOptions: {
      output: {
        manualChunks: {
          // 将echarts和相关依赖分离到单独的chunk
          'echarts-vendor': ['echarts'],
          // 将element-plus相关依赖分离到单独的chunk
          'element-plus-vendor': ['element-plus', '@element-plus/icons-vue'],
          // 将核心依赖分离到单独的chunk
          'core-vendor': ['vue', 'vue-router', 'pinia', 'axios'],
          // 将工具库分离到单独的chunk
          'utils-vendor': ['dayjs']
        }
      }
    },
    // 启用gzip压缩
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    // 优化chunk大小警告限制
    chunkSizeWarningLimit: 1500
  }
})
