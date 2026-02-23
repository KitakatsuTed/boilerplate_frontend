# API連携

このドキュメントでは、バックエンドAPIとの連携方法を説明します。

## 📚 関連ドキュメント

- [SETUP.md](SETUP.md) - 開発環境セットアップ
- [CODING_STANDARDS.md](CODING_STANDARDS.md) - コーディング規約
- [ARCHITECTURE.md](ARCHITECTURE.md) - アーキテクチャ設計
- [FAQ.md](FAQ.md) - よくある質問

---

## OpenAPI型定義の自動生成

### 概要

このプロジェクトでは、バックエンドのOpenAPIスキーマから TypeScript型定義を自動生成します。これにより、型安全なAPI呼び出しが可能になります。

### 前提条件

- バックエンドAPIが起動していること（http://localhost:8000）
- バックエンドがOpenAPIスキーマを公開していること（/openapi.json）

### 型定義の生成

```bash
# npm
npm run generate:api-types

# pnpm
pnpm run generate:api-types

# yarn
yarn run generate:api-types
```

**内部で実行されるコマンド**:

```bash
npx openapi-typescript http://localhost:8000/openapi.json -o src/api/types/api.ts
```

### 生成された型の使用

```typescript
import type { paths } from '@/api/types/api'

// エンドポイントのリクエスト型
type LoginRequest = paths['/api/v1/auth/login']['post']['requestBody']['content']['application/json']

// エンドポイントのレスポンス型
type LoginResponse = paths['/api/v1/auth/login']['post']['responses']['200']['content']['application/json']

export const loginApi = async (email: string, password: string): Promise<LoginResponse> => {
  const formData = new URLSearchParams()
  formData.append('username', email)
  formData.append('password', password)

  const response = await apiClient.post<LoginResponse>('/api/v1/auth/login', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })

  return response.data
}
```

---

## APIクライアントの設定

### Axiosクライアントの初期化

```typescript
// src/api/client.ts
import axios, { type AxiosInstance } from 'axios'
import { getToken, removeToken } from '@/utils/token'

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default apiClient
```

### リクエストインターセプター

**目的**: 認証トークンを自動的にAuthorizationヘッダーに付与

```typescript
apiClient.interceptors.request.use(
  (config) => {
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
```

**使用例**:

```typescript
// トークンが自動的に付与されるため、手動で設定する必要なし
const user = await apiClient.get('/api/v1/users/me')
// 内部的に: Authorization: Bearer <token> が付与される
```

### レスポンスインターセプター

**目的**: 401エラー時の統一的な処理

```typescript
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 認証エラー時はトークン削除、ログイン画面へリダイレクト
      removeToken()
      window.dispatchEvent(new Event('unauthorized'))
    }
    return Promise.reject(error)
  }
)
```

---

## エンドポイント定義

### ディレクトリ構成

```
src/api/endpoints/
├── auth.ts       # 認証関連API
├── users.ts      # ユーザー関連API
└── posts.ts      # 投稿関連API（例）
```

### エンドポイント定義の基本パターン

```typescript
// src/api/endpoints/users.ts
import apiClient from '@/api/client'
import { API_ENDPOINTS } from '@/constants/api'
import type { User, PaginatedResponse } from '@/types'

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

/**
 * ユーザーを作成
 */
export const createUser = async (data: Partial<User>): Promise<User> => {
  const response = await apiClient.post<User>(API_ENDPOINTS.USERS.LIST, data)
  return response.data
}

/**
 * ユーザーを更新
 */
export const updateUser = async (id: number, data: Partial<User>): Promise<User> => {
  const response = await apiClient.put<User>(API_ENDPOINTS.USERS.DETAIL(id), data)
  return response.data
}

/**
 * ユーザーを削除
 */
export const deleteUser = async (id: number): Promise<void> => {
  await apiClient.delete(API_ENDPOINTS.USERS.DETAIL(id))
}
```

### API定数の定義

```typescript
// src/constants/api.ts
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
```

---

## エラーハンドリング

### handleApiErrorの使用

```typescript
import { handleApiError } from '@/utils/error-handler'

try {
  const user = await getCurrentUser()
  setUser(user)
} catch (error) {
  const errorMessage = handleApiError(error)
  setApiError(errorMessage)
}
```

### HTTPステータスコード別の処理

```typescript
// src/utils/error-handler.ts
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    const detail = error.response?.data?.detail

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
        return 'サーバーエラーが発生しました。'
      default:
        return detail || '予期しないエラーが発生しました。'
    }
  }

  return '予期しないエラーが発生しました。'
}
```

### バリデーションエラーの詳細抽出

FastAPIのバリデーションエラー（422）の詳細を抽出：

```typescript
export const extractValidationErrors = (error: unknown): Record<string, string> => {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail

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
```

**使用例**:

```typescript
try {
  await createUser(userData)
} catch (error) {
  const validationErrors = extractValidationErrors(error)
  // { email: 'Invalid email format', password: 'Too short' }
  setFieldErrors(validationErrors)
}
```

---

## TanStack Queryの使用

### 基本的な使用方法

**データ取得（GET）**:

```typescript
import { useQuery } from '@tanstack/react-query'
import { getCurrentUser } from '@/api/endpoints/users'

const { data, isLoading, error } = useQuery({
  queryKey: ['currentUser'],
  queryFn: getCurrentUser,
})
```

**データ更新（POST/PUT/DELETE）**:

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createUser } from '@/api/endpoints/users'

const queryClient = useQueryClient()

const mutation = useMutation({
  mutationFn: createUser,
  onSuccess: () => {
    // ユーザー一覧のキャッシュを無効化して再取得
    queryClient.invalidateQueries({ queryKey: ['users'] })
  },
})

// 使用
mutation.mutate({ email: 'test@example.com', password: 'password' })
```

### キャッシュ戦略

```typescript
const { data } = useQuery({
  queryKey: ['users'],
  queryFn: getUsers,
  staleTime: 5 * 60 * 1000,      // 5分間はキャッシュを使用
  cacheTime: 10 * 60 * 1000,     // 10分間キャッシュを保持
  refetchOnWindowFocus: false,   // ウィンドウフォーカス時に再取得しない
})
```

### ページネーション

```typescript
const [page, setPage] = useState(0)
const limit = 20

const { data, isLoading } = useQuery({
  queryKey: ['users', page],
  queryFn: () => getUsers(page * limit, limit),
  keepPreviousData: true,  // ページ切り替え時に前のデータを保持
})
```

---

## 認証フロー

### ログイン

```typescript
import { loginApi } from '@/api/endpoints/auth'
import { useAuthStore } from '@/stores/auth'
import { handleApiError } from '@/utils/error-handler'

const { setToken, setUser } = useAuthStore()

try {
  const response = await loginApi(email, password)
  setToken(response.access_token)  // localStorageに保存
  setUser(response.user)
  navigate('/dashboard')
} catch (error) {
  const errorMessage = handleApiError(error)
  setApiError(errorMessage)
}
```

### ログアウト

```typescript
import { useAuthStore } from '@/stores/auth'

const { clearAuth } = useAuthStore()

const handleLogout = () => {
  clearAuth()  // トークン削除
  navigate('/login')
}
```

### 認証チェック

```typescript
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth'

const { token } = useAuthStore()
const navigate = useNavigate()

useEffect(() => {
  if (!token) {
    navigate('/login')
  }
}, [token, navigate])
```

---

## CORS設定

### バックエンド側の設定

バックエンド（FastAPI）の`.env`ファイルに以下を設定：

```bash
BACKEND_CORS_ORIGINS=["http://localhost:5173","http://localhost:3000"]
```

### 開発環境での確認

```bash
# バックエンドのログで確認
# CORS許可オリジン: ['http://localhost:5173', 'http://localhost:3000']
```

### 本番環境での設定

```bash
# 本番環境のバックエンド.env
BACKEND_CORS_ORIGINS=["https://your-frontend-domain.com"]
```

---

## 実践例

### ユーザー一覧ページ

```typescript
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getUsers } from '@/api/endpoints/users'

export default function UsersPage() {
  const [page, setPage] = useState(0)
  const limit = 20

  const { data, isLoading, error } = useQuery({
    queryKey: ['users', page],
    queryFn: () => getUsers(page * limit, limit),
    keepPreviousData: true,
  })

  if (isLoading) return <div>読み込み中...</div>
  if (error) return <div>エラーが発生しました</div>

  return (
    <div>
      <h1>ユーザー一覧</h1>
      <ul>
        {data?.items.map((user) => (
          <li key={user.id}>{user.email}</li>
        ))}
      </ul>
      <button onClick={() => setPage(page - 1)} disabled={page === 0}>
        前へ
      </button>
      <button onClick={() => setPage(page + 1)}>
        次へ
      </button>
    </div>
  )
}
```

### ユーザー作成フォーム

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createUser } from '@/api/endpoints/users'
import { handleApiError } from '@/utils/error-handler'

export default function CreateUserForm() {
  const queryClient = useQueryClient()
  const [apiError, setApiError] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      alert('ユーザーを作成しました')
    },
    onError: (error) => {
      const errorMessage = handleApiError(error)
      setApiError(errorMessage)
    },
  })

  const handleSubmit = (data: { email: string; password: string }) => {
    mutation.mutate(data)
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(/* ... */) }}>
      {apiError && <div className="text-red-600">{apiError}</div>}
      {/* フォームフィールド */}
      <button type="submit" disabled={mutation.isLoading}>
        {mutation.isLoading ? '作成中...' : '作成'}
      </button>
    </form>
  )
}
```

---

## まとめ

このドキュメントで説明したAPI連携の方法に従うことで、以下のメリットがあります：

1. **型安全性**: OpenAPI型定義でAPI呼び出しが型安全に
2. **エラーハンドリング統一**: handleApiErrorで一貫したエラー処理
3. **認証自動化**: Axiosインターセプターでトークン自動付与
4. **キャッシュ管理**: TanStack Queryで効率的なデータ管理

詳細な実装方法は、[ARCHITECTURE.md](ARCHITECTURE.md)と[CODING_STANDARDS.md](CODING_STANDARDS.md)を参照してください。
