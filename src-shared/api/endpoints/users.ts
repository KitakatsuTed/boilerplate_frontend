import apiClient from '@/api/client'
import { API_ENDPOINTS } from '@/constants/api'
import type { User, PaginatedResponse } from '@/types'

/**
 * ユーザーAPI
 */

/**
 * 現在のユーザー情報を取得
 */
export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get<User>(API_ENDPOINTS.USERS.ME)
  return response.data
}

/**
 * ユーザー一覧を取得
 */
export const getUsers = async (skip = 0, limit = 20): Promise<PaginatedResponse<User>> => {
  const response = await apiClient.get<PaginatedResponse<User>>(API_ENDPOINTS.USERS.LIST, {
    params: { skip, limit },
  })
  return response.data
}

/**
 * ユーザー詳細を取得
 */
export const getUser = async (id: number): Promise<User> => {
  const response = await apiClient.get<User>(API_ENDPOINTS.USERS.DETAIL(id))
  return response.data
}
