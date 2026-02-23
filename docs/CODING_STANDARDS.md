# コーディング規約

このドキュメントでは、フロントエンドボイラープレートのコーディング規約を定義します。チーム全体で一貫したコードを保つため、以下のルールに従ってください。

## 📚 関連ドキュメント

- [SETUP.md](SETUP.md) - 開発環境セットアップ
- [ARCHITECTURE.md](ARCHITECTURE.md) - アーキテクチャ設計
- [API_INTEGRATION.md](API_INTEGRATION.md) - API連携
- [FAQ.md](FAQ.md) - よくある質問

---

## 基本方針

1. **TypeScript必須**: すべてのコードでTypeScriptを使用
2. **型ヒント必須**: `any`型の使用は原則禁止
3. **1ファイル1コンポーネント**: 各コンポーネントを独立したファイルに配置
4. **過度な抽象化を避ける**: コードの明示性を優先
5. **Prettier/ESLintに従う**: コードフォーマットとリンターのルールを遵守

---

## ファイル命名規則

### コンポーネントファイル

**React**: PascalCase + `.tsx`

```
✅ Button.tsx
✅ LoginForm.tsx
✅ UserProfile.tsx

❌ button.tsx
❌ login-form.tsx
❌ user_profile.tsx
```

**Vue**: PascalCase + `.vue`

```
✅ Button.vue
✅ LoginForm.vue
✅ UserProfile.vue

❌ button.vue
❌ login-form.vue
❌ user_profile.vue
```

### ユーティリティ・API・ストア

**camelCase + `.ts`**

```
✅ error-handler.ts
✅ token.ts
✅ auth.ts
✅ users.ts

❌ ErrorHandler.ts
❌ Token.ts
❌ Auth.ts
```

---

## TypeScript型定義

### any型の使用禁止

```typescript
// ❌ 悪い例
const data: any = response.data
const handleClick = (event: any) => {}

// ✅ 良い例
const data: User = response.data
const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {}
```

### 型推論を活用

```typescript
// ❌ 冗長
const count: number = 0
const name: string = 'John'

// ✅ 型推論を活用
const count = 0
const name = 'John'

// ✅ 明示的な型が必要な場合のみ指定
const user: User | null = null
```

### Propsの型定義

**React**:

```typescript
// ✅ 良い例
interface ButtonProps {
  label: string
  onClick: () => void
  disabled?: boolean
  variant?: 'primary' | 'secondary'
}

export default function Button({ label, onClick, disabled, variant = 'primary' }: ButtonProps) {
  return <button onClick={onClick} disabled={disabled}>{label}</button>
}
```

**Vue**:

```typescript
// ✅ 良い例
<script setup lang="ts">
interface Props {
  label: string
  disabled?: boolean
  variant?: 'primary' | 'secondary'
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  variant: 'primary',
})

const emit = defineEmits<{
  click: []
}>()
</script>
```

---

## インポート順序

以下の順序でインポートを記述します：

1. React/Vue本体
2. サードパーティライブラリ
3. `@/`エイリアス（プロジェクト内）
4. 相対パス（同じディレクトリ内）
5. CSSファイル

**React例**:

```typescript
// 1. React本体
import { useState, useEffect } from 'react'

// 2. サードパーティライブラリ
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

// 3. @/エイリアス
import { useAuth } from '@/hooks/useAuth'
import { loginApi } from '@/api/endpoints/auth'
import { handleApiError } from '@/utils/error-handler'

// 4. 型定義
import type { User } from '@/types'

// 5. CSS
import './Login.css'
```

**Vue例**:

```typescript
// 1. Vue本体
import { ref, computed, onMounted } from 'vue'

// 2. サードパーティライブラリ
import { useRouter } from 'vue-router'
import { z } from 'zod'

// 3. @/エイリアス
import { useAuth } from '@/composables/useAuth'
import { loginApi } from '@/api/endpoints/auth'
import { handleApiError } from '@/utils/error-handler'

// 4. 型定義
import type { User } from '@/types'
```

---

## コンポーネント設計

### 1ファイル1コンポーネント

```
✅ 良い例
src/components/
  ├── Button.tsx
  ├── Modal.tsx
  └── Input.tsx

❌ 悪い例
src/components/
  └── Components.tsx  // 複数のコンポーネントを1ファイルに
```

### コンポーネントの粒度

**Atomic Design的な構成**:

```
src/components/
├── common/          # 汎用的な再利用可能コンポーネント
│   ├── Button.tsx
│   ├── Input.tsx
│   └── Modal.tsx
├── layout/          # レイアウトコンポーネント
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   └── Footer.tsx
└── features/        # 機能別コンポーネント
    ├── auth/
    │   └── LoginForm.tsx
    └── user/
        └── UserProfile.tsx
```

### コンポーネントの責務

**単一責任の原則**:

```typescript
// ❌ 悪い例：1つのコンポーネントが多すぎる責務を持つ
export default function Dashboard() {
  // ユーザー情報取得
  // 統計データ取得
  // グラフ描画
  // フォーム処理
  // ...
}

// ✅ 良い例：責務を分離
export default function Dashboard() {
  return (
    <div>
      <UserInfo />
      <Statistics />
      <Chart />
      <SettingsForm />
    </div>
  )
}
```

---

## 状態管理

### ローカル状態 vs グローバル状態 vs サーバー状態

**ローカル状態（useState / ref）**:

```typescript
// ✅ コンポーネント内でのみ使用する状態
const [isOpen, setIsOpen] = useState(false)
const [inputValue, setInputValue] = useState('')
```

**グローバル状態（Zustand / Pinia）**:

```typescript
// ✅ 複数のコンポーネントで共有する状態
import { useAuthStore } from '@/stores/auth'

const { token, user, setToken } = useAuthStore()
```

**サーバー状態（TanStack Query）**:

```typescript
// ✅ サーバーから取得するデータ
import { useQuery } from '@tanstack/react-query'

const { data, isLoading, error } = useQuery({
  queryKey: ['users'],
  queryFn: getUsers,
})
```

---

## 命名規則

### 変数・関数

**camelCase**:

```typescript
// ✅ 良い例
const userName = 'John'
const isAuthenticated = true
const handleClick = () => {}
const fetchUserData = async () => {}

// ❌ 悪い例
const UserName = 'John'
const is_authenticated = true
const HandleClick = () => {}
```

### 定数

**UPPER_SNAKE_CASE**:

```typescript
// ✅ 良い例
const API_BASE_URL = 'http://localhost:8000'
const MAX_RETRY_COUNT = 3
const DEFAULT_PAGE_SIZE = 20

// ❌ 悪い例
const apiBaseUrl = 'http://localhost:8000'
const maxRetryCount = 3
```

### コンポーネント

**PascalCase**:

```typescript
// ✅ 良い例
export default function UserProfile() {}
export default function LoginForm() {}

// ❌ 悪い例
export default function userProfile() {}
export default function login_form() {}
```

### カスタムフック / Composables

**`use` プレフィックス + camelCase**:

```typescript
// ✅ 良い例
export const useAuth = () => {}
export const useFetch = () => {}
export const useLocalStorage = () => {}

// ❌ 悪い例
export const auth = () => {}
export const fetchData = () => {}
```

---

## エラーハンドリング

### try-catchの使用

```typescript
// ✅ 良い例
try {
  const user = await loginApi(email, password)
  setUser(user)
} catch (error) {
  const errorMessage = handleApiError(error)
  setApiError(errorMessage)
}

// ❌ 悪い例
const user = await loginApi(email, password)  // エラーハンドリングなし
```

### エラーメッセージの統一

```typescript
// ✅ 良い例：handleApiErrorを使用
import { handleApiError } from '@/utils/error-handler'

const errorMessage = handleApiError(error)

// ❌ 悪い例：エラーメッセージがバラバラ
const errorMessage = error.message
const errorMessage = 'エラーが発生しました'
```

---

## コメント

### ドキュメンテーションコメント

関数やコンポーネントの目的を説明する場合のみコメントを記述：

```typescript
/**
 * ログイン画面
 *
 * パターンを示す:
 * - フォーム管理（React Hook Form）
 * - バリデーション（Zod）
 * - エラーハンドリング（APIエラー表示）
 */
export default function Login() {
  // ...
}
```

### インラインコメント

コードが自明でない場合のみ記述：

```typescript
// ✅ 良い例：複雑なロジックの説明
// 401エラー時はトークンを削除してログイン画面へリダイレクト
if (error.response?.status === 401) {
  removeToken()
  navigate('/login')
}

// ❌ 悪い例：自明なことのコメント
// ユーザー名を設定
setUserName('John')
```

---

## Tailwind CSS

### クラス名の順序

Prettierの`prettier-plugin-tailwindcss`を使用して自動整列：

```bash
npm install -D prettier-plugin-tailwindcss
```

```tsx
// ✅ 自動整列される
<div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
```

### レスポンシブデザイン

モバイルファーストで記述：

```tsx
// ✅ 良い例：モバイルファースト
<div className="w-full md:w-1/2 lg:w-1/3">

// ❌ 悪い例：デスクトップファースト
<div className="w-1/3 md:w-1/2 sm:w-full">
```

### カスタムCSSの最小化

可能な限りTailwind CSSのユーティリティクラスを使用：

```tsx
// ✅ 良い例
<button className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">

// ❌ 悪い例
<button className="custom-button">
// custom-button { background: blue; ... }
```

---

## チェックリスト

コミット前に以下を確認してください：

### 型安全性
- [ ] TypeScript型チェックが通る（`npm run type-check`）
- [ ] `any`型を使用していない
- [ ] すべての関数に型ヒントがある

### コーディング規約
- [ ] 1ファイル1コンポーネントの原則に従っている
- [ ] インポートパスは`@/`エイリアスを使用している
- [ ] 命名規則に従っている（camelCase、PascalCase、UPPER_SNAKE_CASE）
- [ ] ESLintエラーがない（`npm run lint`）
- [ ] Prettierフォーマットが適用されている（`npm run format`）

### コンポーネント設計
- [ ] コンポーネントの責務が明確
- [ ] 過度な抽象化を避けている
- [ ] Props定義がある（TypeScript interfaceまたはtype）

### エラーハンドリング
- [ ] try-catchでエラーをキャッチしている
- [ ] `handleApiError`を使用している

### Tailwind CSS
- [ ] ユーティリティクラスを使用している
- [ ] レスポンシブデザイン対応している
- [ ] モバイルファーストで記述している

---

## まとめ

このコーディング規約に従うことで、チーム全体で一貫した品質のコードを保つことができます。不明な点があれば、[FAQ.md](FAQ.md)を参照するか、チームメンバーに相談してください。
