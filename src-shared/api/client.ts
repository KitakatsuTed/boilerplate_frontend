import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'
import { getToken, removeToken } from '@/utils/token'

/**
 * Axiosクライアント設定
 * - ベースURL設定（環境変数から取得）
 * - タイムアウト設定
 * - リクエスト/レスポンスインターセプター
 */

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * リクエストインターセプター
 * 認証トークンを自動的に付与
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * レスポンスインターセプター
 * エラーハンドリング（401エラー時はトークン削除、ログイン画面へリダイレクト）
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 認証エラー時はトークン削除、ログイン画面へリダイレクト
      removeToken()
      // SPAのため、window.location.hrefではなくイベント発行で対応
      // 各フレームワークのルーターで対応する
      window.dispatchEvent(new Event('unauthorized'))
    }
    return Promise.reject(error)
  }
)

export default apiClient
