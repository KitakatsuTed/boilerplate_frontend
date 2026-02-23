<template>
  <div v-if="isLoading" class="flex min-h-screen items-center justify-center bg-gray-50">
    <div class="text-gray-600">読み込み中...</div>
  </div>

  <div v-else-if="error" class="flex min-h-screen items-center justify-center bg-gray-50">
    <div class="text-red-600">エラーが発生しました</div>
  </div>

  <div v-else class="min-h-screen bg-gray-50">
    <header class="bg-white shadow">
      <div class="mx-auto max-w-7xl px-4 py-6 flex justify-between items-center">
        <h1 class="text-3xl font-bold">ダッシュボード</h1>
        <button
          @click="handleLogout"
          class="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
          ログアウト
        </button>
      </div>
    </header>

    <main class="mx-auto max-w-7xl px-4 py-6">
      <div class="rounded-lg bg-white p-6 shadow">
        <h2 class="mb-4 text-xl font-semibold">ユーザー情報</h2>
        <dl class="space-y-2">
          <div>
            <dt class="font-medium text-gray-600">メールアドレス</dt>
            <dd class="text-lg">{{ data?.email }}</dd>
          </div>
          <div>
            <dt class="font-medium text-gray-600">ユーザーID</dt>
            <dd class="text-lg">{{ data?.id }}</dd>
          </div>
          <div>
            <dt class="font-medium text-gray-600">アカウント状態</dt>
            <dd class="text-lg">
              <span v-if="data?.is_active" class="text-green-600">アクティブ</span>
              <span v-else class="text-red-600">非アクティブ</span>
            </dd>
          </div>
        </dl>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { useAuth } from '@/composables/useAuth'
import { getCurrentUser } from '@/api/endpoints/users'

/**
 * ダッシュボード画面（Vue版）
 *
 * パターンを示す:
 * - 認証チェック（未認証時はログイン画面へリダイレクト）
 * - APIデータ取得（TanStack Query使用）
 * - ローディング・エラー表示
 * - サーバー状態管理の実例
 */

const router = useRouter()
const { token, clearAuth } = useAuth()

// 認証チェック
onMounted(() => {
  if (!token.value) {
    router.push('/login')
  }
})

watch(token, (newToken) => {
  if (!newToken) {
    router.push('/login')
  }
})

// サーバー状態管理（TanStack Query）
const { data, isLoading, error } = useQuery({
  queryKey: ['currentUser'],
  queryFn: getCurrentUser,
  enabled: () => !!token.value, // トークンがある場合のみ実行
})

const handleLogout = () => {
  clearAuth()
  router.push('/login')
}
</script>
