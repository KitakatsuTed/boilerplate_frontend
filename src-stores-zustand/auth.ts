import { create } from 'zustand'
import { setToken as saveToken, removeToken as deleteToken } from '@/utils/token'
import type { User } from '@/types'

/**
 * 認証状態管理（Zustand）
 */

interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  setToken: (token: string) => void
  setUser: (user: User) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,

  setToken: (token: string) => {
    saveToken(token)
    set({ token, isAuthenticated: true })
  },

  setUser: (user: User) => {
    set({ user })
  },

  clearAuth: () => {
    deleteToken()
    set({ token: null, user: null, isAuthenticated: false })
  },
}))
