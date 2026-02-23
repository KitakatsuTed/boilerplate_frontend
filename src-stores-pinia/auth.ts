import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { setToken as saveToken, removeToken as deleteToken } from '@/utils/token'
import type { User } from '@/types'

/**
 * 認証状態管理（Pinia）
 */

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)
  const user = ref<User | null>(null)

  const isAuthenticated = computed(() => !!token.value)

  const setToken = (newToken: string) => {
    saveToken(newToken)
    token.value = newToken
  }

  const setUser = (newUser: User) => {
    user.value = newUser
  }

  const clearAuth = () => {
    deleteToken()
    token.value = null
    user.value = null
  }

  return {
    token,
    user,
    isAuthenticated,
    setToken,
    setUser,
    clearAuth,
  }
})
