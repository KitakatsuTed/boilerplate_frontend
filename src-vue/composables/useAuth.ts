import { useAuthStore } from '@/stores/auth'

/**
 * 認証Composable
 * Piniaストアへのアクセスを簡潔にする
 */

export const useAuth = () => {
  const authStore = useAuthStore()

  return {
    token: authStore.token,
    user: authStore.user,
    isAuthenticated: authStore.isAuthenticated,
    setToken: authStore.setToken,
    setUser: authStore.setUser,
    clearAuth: authStore.clearAuth,
  }
}
