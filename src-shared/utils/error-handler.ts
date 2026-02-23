import axios, { type AxiosError } from 'axios'

/**
 * APIエラーハンドリングユーティリティ
 * HTTPステータスコード別にエラーメッセージを返す
 */

export interface ApiErrorResponse {
  detail?: string
  message?: string
}

/**
 * APIエラーを処理し、ユーザーフレンドリーなメッセージを返す
 */
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>
    const status = axiosError.response?.status
    const detail = axiosError.response?.data?.detail || axiosError.response?.data?.message

    switch (status) {
      case 400:
        return detail || '入力内容に誤りがあります。'
      case 401:
        return '認証に失敗しました。ログインしてください。'
      case 403:
        return 'この操作を実行する権限がありません。'
      case 404:
        return 'リソースが見つかりませんでした。'
      case 409:
        return detail || '既に存在するリソースです。'
      case 422:
        return detail || 'バリデーションエラーが発生しました。'
      case 500:
        return 'サーバーエラーが発生しました。しばらく時間をおいて再度お試しください。'
      case 502:
      case 503:
      case 504:
        return 'サーバーに接続できません。しばらく時間をおいて再度お試しください。'
      default:
        return detail || axiosError.message || '予期しないエラーが発生しました。'
    }
  }

  if (error instanceof Error) {
    return error.message
  }

  return '予期しないエラーが発生しました。'
}

/**
 * バリデーションエラーの詳細を抽出
 */
export const extractValidationErrors = (error: unknown): Record<string, string> => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ detail?: Array<{ loc: string[]; msg: string }> }>
    const detail = axiosError.response?.data?.detail

    if (Array.isArray(detail)) {
      return detail.reduce((acc, err) => {
        const field = err.loc[err.loc.length - 1]
        acc[field] = err.msg
        return acc
      }, {} as Record<string, string>)
    }
  }

  return {}
}
