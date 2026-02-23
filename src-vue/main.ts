import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { router } from '@/router'
import App from './App.vue'
import './index.css'

/**
 * Vueエントリーポイント
 * - Pinia設定
 * - Vue Router設定
 * - TanStack Query設定
 */

const app = createApp(App)

// Pinia状態管理
app.use(createPinia())

// Vue Router
app.use(router)

// TanStack Query
app.use(VueQueryPlugin, {
  queryClientConfig: {
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000, // 5分
      },
    },
  },
})

app.mount('#root')
