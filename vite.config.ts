import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'NotebookViewerPlugin',
      fileName: 'index',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['vuepress', 'vuepress-theme-plume', 'vue'],
      output: {
        globals: {
          vuepress: 'vuepress',
          'vuepress-theme-plume': 'vuepress-theme-plume',
          vue: 'Vue',
        },
      },
    },
  },
})
