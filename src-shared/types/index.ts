/**
 * 共通型定義
 */

/**
 * ユーザー型
 */
export interface User {
  id: number
  email: string
  is_active: boolean
  is_superuser: boolean
  created_at: string
  updated_at: string
}

/**
 * ログインレスポンス型
 */
export interface LoginResponse {
  access_token: string
  token_type: string
  user: User
}

/**
 * ページネーションレスポンス型
 */
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  skip: number
  limit: number
}

/**
 * APIエラーレスポンス型
 */
export interface ApiError {
  detail: string
}
