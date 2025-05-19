import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  configureWebpack: {
    devtool: 'source-map' // 必须为完整 SourceMap
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler' // or "modern", "legacy"
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src') // 设置 `@` 指向 `src` 目录
    }
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, './src/lib/index.js'), //指定组件编译入口文件
      name: 'zzlhpdk-ui'
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['vue'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue'
        }
      }
    } // rollup打包配置
  }
});
