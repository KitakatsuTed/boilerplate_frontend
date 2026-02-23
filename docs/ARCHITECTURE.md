# アーキテクチャ設計

このドキュメントでは、フロントエンドボイラープレートのアーキテクチャ設計とその設計理由を説明します。

## 📚 関連ドキュメント

- [SETUP.md](SETUP.md) - 開発環境セットアップ
- [CODING_STANDARDS.md](CODING_STANDARDS.md) - コーディング規約
- [API_INTEGRATION.md](API_INTEGRATION.md) - API連携
- [FAQ.md](FAQ.md) - よくある質問

---

## 設計思想

このプロジェクトは、以下の設計思想に基づいています：

1. **クリーンアーキテクチャ**: 関心の分離、依存性の方向、テスタビリティ
2. **型安全性**: TypeScript必須、OpenAPIスキーマから型を自動生成
3. **拡張性**: フレームワーク、状態管理を簡単に切り替え可能
4. **保守性**: 1ファイル1コンポーネント、過度な抽象化を避ける
5. **チーム品質統一**: CLAUDE.md、Claude Codeスキル、docsディレクトリ

---

## ディレクトリ構造の設計

### 全体像

```
src/
├── api/                # APIクライアント層
│   ├── client.ts       # Axios設定、インターセプター
│   ├── endpoints/      # エンドポイント定義
│   └── types/          # OpenAPI型定義（自動生成）
├── utils/              # ユーティリティ層
├── constants/          # 定数
├── types/              # 型定義
├── stores/             # グローバル状態管理
├── router/             # ルーティング
├── components/         # UIコンポーネント
├── pages/              # ページコンポーネント
└── hooks/composables/  # カスタムフック/Composables
```

### 設計理由

#### 1. API層の分離

**なぜ？**: APIクライアントとビジネスロジックを分離することで、以下のメリットがあります：

- **テスタビリティ**: APIクライアントをモック化しやすい
- **再利用性**: 複数のコンポーネントで同じAPI呼び出しを再利用
- **保守性**: APIエンドポイントの変更が1箇所で済む

**実装例**:

```typescript
// src/api/endpoints/users.ts
import apiClient from '@/api/client'

export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get<User>('/api/v1/users/me')
  return response.data
}
```

#### 2. ユーティリティ層

**なぜ？**: ビジネスロジックから独立した汎用的な処理を分離することで、再利用性と テスタビリティが向上します。

**実装例**:

```typescript
// src/utils/error-handler.ts
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    switch (status) {
      case 401: return '認証に失敗しました。'
      case 403: return '権限がありません。'
      // ...
    }
  }
  return '予期しないエラーが発生しました。'
}
```

#### 3. コンポーネントの3層構造

**なぜ？**: コンポーネントの責務を明確にすることで、保守性が向上します。

```
components/
├── common/      # 汎用的な再利用可能コンポーネント（Button、Input等）
├── layout/      # レイアウトコンポーネント（Header、Sidebar等）
└── features/    # 機能別コンポーネント（LoginForm、UserProfile等）
```

---

## 状態管理の設計

### 3種類の状態

このプロジェクトでは、状態を3種類に分類します：

```
┌─────────────────────────────────────────┐
│ 1. ローカル状態 (useState / ref)        │
│    - コンポーネント内でのみ使用         │
│    - フォームの入力値、UI状態           │
├─────────────────────────────────────────┤
│ 2. グローバル状態 (Zustand / Pinia)     │
│    - 複数のコンポーネントで共有         │
│    - 認証情報、テーマ設定               │
├─────────────────────────────────────────┤
│ 3. サーバー状態 (TanStack Query)        │
│    - サーバーから取得するデータ         │
│    - キャッシュ、自動リフェッチ         │
└─────────────────────────────────────────┘
```

### なぜ3種類に分けるのか？

**理由**: それぞれの状態に最適なツールを使用することで、以下のメリットがあります：

- **パフォーマンス**: 不要な再レンダリングを防ぐ
- **保守性**: 状態の責務が明確になる
- **開発効率**: キャッシュやリフェッチを自動化

### 実装例

**ローカル状態**:

```typescript
// モーダルの開閉状態（他のコンポーネントでは使わない）
const [isOpen, setIsOpen] = useState(false)
```

**グローバル状態（Zustand）**:

```typescript
// src/stores/auth.ts
import { create } from 'zustand'

interface AuthState {
  token: string | null
  user: User | null
  setToken: (token: string) => void
  setUser: (user: User) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  setToken: (token) => {
    localStorage.setItem('token', token)
    set({ token })
  },
  setUser: (user) => set({ user }),
  clearAuth: () => {
    localStorage.removeItem('token')
    set({ token: null, user: null })
  },
}))
```

**サーバー状態（TanStack Query）**:

```typescript
// ユーザー一覧を取得（キャッシュ、自動リフェッチ）
const { data, isLoading, error } = useQuery({
  queryKey: ['users'],
  queryFn: getUsers,
  staleTime: 5 * 60 * 1000, // 5分間はキャッシュを使用
})
```

---

## APIクライアントの抽象化

### Axiosインターセプター

**なぜ？**: 認証トークンの自動付与、エラーハンドリングの統一、ログ出力などを一元管理できます。

```typescript
// src/api/client.ts
import axios from 'axios'
import { getToken, removeToken } from '@/utils/token'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
})

// リクエストインターセプター（認証トークン自動付与）
apiClient.interceptors.request.use((config) => {
  const token = getToken()
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// レスポンスインターセプター（401エラー時の処理）
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken()
      window.dispatchEvent(new Event('unauthorized'))
    }
    return Promise.reject(error)
  }
)

export default apiClient
```

### エンドポイント定義の統一

**なぜ？**: APIエンドポイントの定義を統一することで、以下のメリットがあります：

- **保守性**: エンドポイントの変更が1箇所で済む
- **型安全性**: 戻り値の型を明示
- **再利用性**: 複数のコンポーネントで同じAPI呼び出しを再利用

```typescript
// src/api/endpoints/users.ts
import apiClient from '@/api/client'
import type { User } from '@/types'

export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get<User>('/api/v1/users/me')
  return response.data
}

export const getUsers = async (skip = 0, limit = 20): Promise<PaginatedResponse<User>> => {
  const response = await apiClient.get('/api/v1/users', {
    params: { skip, limit },
  })
  return response.data
}
```

---

## エラーハンドリングの設計

### 統一されたエラーハンドリング

**なぜ？**: エラーメッセージの表示を統一することで、ユーザー体験が向上します。

```
┌─────────────────────────────────────────┐
│ API呼び出し                              │
├─────────────────────────────────────────┤
│ try-catch                               │
│   ↓                                     │
│ handleApiError()                        │
│   ↓                                     │
│ HTTPステータスコード別の処理             │
│   ↓                                     │
│ ユーザーフレンドリーなメッセージを返す   │
└─────────────────────────────────────────┘
```

**実装例**:

```typescript
// src/utils/error-handler.ts
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    const detail = error.response?.data?.detail

    switch (status) {
      case 400: return detail || '入力内容に誤りがあります。'
      case 401: return '認証に失敗しました。ログインしてください。'
      case 403: return 'この操作を実行する権限がありません。'
      case 404: return 'リソースが見つかりませんでした。'
      case 500: return 'サーバーエラーが発生しました。'
      default: return detail || '予期しないエラーが発生しました。'
    }
  }
  return '予期しないエラーが発生しました。'
}
```

---

## 認証トークン管理

### localStorage vs sessionStorage vs Cookie

このプロジェクトでは、**localStorage**を使用しています。

**理由**:
- **シンプル**: 実装が簡単
- **永続的**: ブラウザを閉じても保持される
- **XSS対策**: HttpOnly Cookieほど安全ではないが、CSP（Content Security Policy）で対策可能

**実装例**:

```typescript
// src/utils/token.ts
const TOKEN_KEY = 'auth_token'

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token)
}

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY)
}

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY)
}
```

**セキュリティ上の注意**:
- XSS攻撃に注意
- CSP（Content Security Policy）を設定
- HTTPSを使用

---

## ルーティング設計

### React Router / Vue Router

**なぜ？**: 標準的なルーターを使用することで、以下のメリットがあります：

- **学習コスト低**: 多くの開発者が知っている
- **機能豊富**: ネストされたルート、プログラマティックナビゲーション等
- **型安全**: TypeScriptと相性が良い

**React Router例**:

```typescript
// src/router/index.tsx
import { createBrowserRouter } from 'react-router-dom'
import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'

export const router = createBrowserRouter([
  { path: '/', element: <Login /> },
  { path: '/login', element: <Login /> },
  { path: '/dashboard', element: <Dashboard /> },
])
```

**認証ガード**:

```typescript
// ページコンポーネント内で認証チェック
useEffect(() => {
  if (!token) {
    navigate('/login')
  }
}, [token, navigate])
```

---

## OpenAPI型定義の自動生成

### なぜ型を自動生成するのか？

**理由**:
- **型安全性**: バックエンドのスキーマ変更に自動追従
- **開発効率**: 手動で型を定義する必要がない
- **バグ削減**: 型の不一致を事前に検出

**フロー**:

```
┌─────────────────────────────────────────┐
│ バックエンド（FastAPI）                  │
│   ↓                                     │
│ OpenAPIスキーマ生成                      │
│   ↓                                     │
│ openapi-typescript                      │
│   ↓                                     │
│ TypeScript型定義生成                     │
│   ↓                                     │
│ フロントエンドで使用                     │
└─────────────────────────────────────────┘
```

**使用例**:

```typescript
import type { paths } from '@/api/types/api'

// エンドポイントのレスポンス型を取得
type LoginResponse = paths['/api/v1/auth/login']['post']['responses']['200']['content']['application/json']

export const loginApi = async (email: string, password: string): Promise<LoginResponse> => {
  // ...
}
```

---

## Tailwind CSSの設計方針

### なぜTailwind CSSを固定採用するのか？

**理由**:
- **utility-first**: カスタマイズ性が高い
- **ui-ux-pro-maxスキルとの相性**: Claude Codeのui-ux-pro-maxスキルと相性抜群
- **開発効率**: クラス名を組み合わせるだけでスタイリング
- **一貫性**: デザイントークンが統一される

**設計方針**:
- カスタムCSSは最小限に
- ユーティリティクラスを優先
- レスポンシブデザインはモバイルファースト

---

## まとめ

このアーキテクチャ設計に従うことで、以下のメリットがあります：

1. **保守性**: 関心の分離、明確な責務
2. **拡張性**: フレームワーク、状態管理の切り替えが容易
3. **型安全性**: TypeScript、OpenAPI型定義で型エラーを事前検出
4. **開発効率**: Claude Codeスキル、サンプルコードでパターンを踏襲
5. **チーム品質統一**: CLAUDE.md、docsディレクトリで一貫した品質

詳細な実装方法は、[API_INTEGRATION.md](API_INTEGRATION.md)と[CODING_STANDARDS.md](CODING_STANDARDS.md)を参照してください。
