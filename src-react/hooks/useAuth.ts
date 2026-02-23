import { useAuthStore } from '@/stores/auth'

/**
 * 認証カスタムフック
 * Zustandストアへのアクセスを簡潔にする
 */

export const useAuth = () => {
  const { token, user, isAuthenticated, setToken, setUser, clearAuth } = useAuthStore()

  return {
    token,
    user,
    isAuthenticated,
    setToken,
    setUser,
    clearAuth,
  }
}
