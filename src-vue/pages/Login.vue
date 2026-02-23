<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50">
    <div class="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
      <h1 class="mb-6 text-2xl font-bold">ログイン</h1>

      <div v-if="apiError" class="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">
        {{ apiError }}
      </div>

      <form @submit.prevent="onSubmit" class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium">
            メールアドレス
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            class="mt-1 w-full rounded border px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            :disabled="isSubmitting"
            placeholder="example@example.com"
            @blur="validateEmail"
          />
          <p v-if="errors.email" class="mt-1 text-sm text-red-600">
            {{ errors.email }}
          </p>
        </div>

        <div>
          <label for="password" class="block text-sm font-medium">
            パスワード
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            class="mt-1 w-full rounded border px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            :disabled="isSubmitting"
            placeholder="8文字以上"
            @blur="validatePassword"
          />
          <p v-if="errors.password" class="mt-1 text-sm text-red-600">
            {{ errors.password }}
          </p>
        </div>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {{ isSubmitting ? 'ログイン中...' : 'ログイン' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { z } from 'zod'
import { useAuth } from '@/composables/useAuth'
import { loginApi } from '@/api/endpoints/auth'
import { handleApiError } from '@/utils/error-handler'

/**
 * ログイン画面（Vue版）
 *
 * パターンを示す:
 * - フォーム管理（v-model）
 * - バリデーション（Zod）
 * - エラーハンドリング（APIエラー表示）
 * - ローディング状態（ボタン無効化）
 * - 認証トークンの保存（localStorage）
 */

const router = useRouter()
const { setToken, setUser } = useAuth()

const email = ref('')
const password = ref('')
const apiError = ref<string | null>(null)
const isSubmitting = ref(false)
const errors = ref<{ email?: string; password?: string }>({})

// バリデーションスキーマ
const loginSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(8, 'パスワードは8文字以上である必要があります'),
})

const validateEmail = () => {
  try {
    z.string().email().parse(email.value)
    errors.value.email = undefined
  } catch (e) {
    errors.value.email = '有効なメールアドレスを入力してください'
  }
}

const validatePassword = () => {
  try {
    z.string().min(8).parse(password.value)
    errors.value.password = undefined
  } catch (e) {
    errors.value.password = 'パスワードは8文字以上である必要があります'
  }
}

const onSubmit = async () => {
  apiError.value = null

  // バリデーション
  try {
    loginSchema.parse({ email: email.value, password: password.value })
    errors.value = {}
  } catch (e) {
    if (e instanceof z.ZodError) {
      e.errors.forEach((err) => {
        if (err.path[0] === 'email') errors.value.email = err.message
        if (err.path[0] === 'password') errors.value.password = err.message
      })
    }
    return
  }

  isSubmitting.value = true

  try {
    const response = await loginApi(email.value, password.value)
    setToken(response.access_token)
    setUser(response.user)
    router.push('/dashboard')
  } catch (error) {
    const errorMessage = handleApiError(error)
    apiError.value = errorMessage
  } finally {
    isSubmitting.value = false
  }
}
</script>
