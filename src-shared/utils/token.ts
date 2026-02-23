/**
 * 認証トークン管理ユーティリティ
 * - トークンの保存、取得、削除
 * - localStorageを使用（sessionStorageやCookieに変更可能）
 */

const TOKEN_KEY = 'auth_token'

/**
 * トークンを保存
 */
export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token)
}

/**
 * トークンを取得
 */
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY)
}

/**
 * トークンを削除
 */
export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY)
}

/**
 * トークンの存在確認
 */
export const hasToken = (): boolean => {
  return !!getToken()
}
