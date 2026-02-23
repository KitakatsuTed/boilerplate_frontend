/**
 * API定数
 * エンドポイントのパスを定義
 */

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    LOGOUT: '/api/v1/auth/logout',
    REFRESH: '/api/v1/auth/refresh',
  },
  USERS: {
    ME: '/api/v1/users/me',
    LIST: '/api/v1/users',
    DETAIL: (id: number) => `/api/v1/users/${id}`,
  },
} as const
