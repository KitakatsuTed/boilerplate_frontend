import apiClient from '@/api/client'
import { API_ENDPOINTS } from '@/constants/api'
import type { LoginResponse } from '@/types'

/**
 * 認証API
 */

/**
 * ログイン
 */
export const loginApi = async (email: string, password: string): Promise<LoginResponse> => {
  // FastAPIのOAuth2PasswordRequestFormはform-dataを期待する
  const formData = new URLSearchParams()
  formData.append('username', email)
  formData.append('password', password)

  const response = await apiClient.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })

  return response.data
}

/**
 * ログアウト
 */
export const logoutApi = async (): Promise<void> => {
  await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT)
}
