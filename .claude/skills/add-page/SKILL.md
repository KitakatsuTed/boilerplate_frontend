---
name: add-page
description: 新しいページを追加するスキル。ページコンポーネント、ルーティング設定、認証チェックを自動生成します。
---

# /add-page - 新ページ追加スキル

このスキルは、新しいページを追加する際に使用します。ページコンポーネント、ルーティング設定、認証チェックを自動生成し、サンプルページ（Login、Dashboard）のパターンを踏襲します。

## 使い方

```bash
/add-page
```

対話形式で以下を質問します：
1. ページ名（例: Profile、Settings）
2. ルートパス（例: /profile、/settings）
3. 認証が必要か（yes/no）

## 実行フロー

### 1. ユーザーへの質問

以下の質問を対話形式で行います：

**Q1: ページ名を入力してください（PascalCase）**
- 例: `Profile`、`UserSettings`、`PostList`
- PascalCaseで入力（単語の先頭を大文字）

**Q2: ルートパスを入力してください（スラッシュで始まる）**
- 例: `/profile`、`/settings`、`/posts`
- スラッシュ（/）で始まる

**Q3: 認証が必要ですか？（yes/no）**
- `yes`: ログインしていないとアクセスできないページ
- `no`: 誰でもアクセスできるページ

### 2. フレームワークの検出

プロジェクトのフレームワークを検出します：
- `src/pages/Login.tsx`が存在 → React
- `src/pages/Login.vue`が存在 → Vue

### 3. ファイル生成

#### React版

**ページコンポーネント（`src/pages/{PageName}.tsx`）**:

```typescript
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

/**
 * {PageName}ページ
 */

export default function {PageName}() {
  const navigate = useNavigate()
  const { token } = useAuth()

  // 認証チェック（認証が必要な場合のみ）
  useEffect(() => {
    if (!token) {
      navigate('/login')
    }
  }, [token, navigate])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <h1 className="text-3xl font-bold">{PageName}</h1>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        <div className="rounded-lg bg-white p-6 shadow">
          <p>This is the {PageName} page.</p>
        </div>
      </main>
    </div>
  )
}
```

**認証不要の場合**:

```typescript
/**
 * {PageName}ページ
 */

export default function {PageName}() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <h1 className="text-3xl font-bold">{PageName}</h1>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        <div className="rounded-lg bg-white p-6 shadow">
          <p>This is the {PageName} page.</p>
        </div>
      </main>
    </div>
  )
}
```

**ルーティング設定の更新（`src/router/index.tsx`）**:

```typescript
// 既存のインポートに追加
import {PageName} from '@/pages/{PageName}'

// routesに追加
{
  path: '{routePath}',
  element: <{PageName} />,
}
```

#### Vue版

**ページコンポーネント（`src/pages/{PageName}.vue`）**:

```vue
<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow">
      <div class="mx-auto max-w-7xl px-4 py-6">
        <h1 class="text-3xl font-bold">{PageName}</h1>
      </div>
    </header>

    <main class="mx-auto max-w-7xl px-4 py-6">
      <div class="rounded-lg bg-white p-6 shadow">
        <p>This is the {PageName} page.</p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

/**
 * {PageName}ページ
 */

const router = useRouter()
const { token } = useAuth()

// 認証チェック（認証が必要な場合のみ）
onMounted(() => {
  if (!token.value) {
    router.push('/login')
  }
})

watch(token, (newToken) => {
  if (!newToken) {
    router.push('/login')
  }
})
</script>
```

**認証不要の場合**:

```vue
<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow">
      <div class="mx-auto max-w-7xl px-4 py-6">
        <h1 class="text-3xl font-bold">{PageName}</h1>
      </div>
    </header>

    <main class="mx-auto max-w-7xl px-4 py-6">
      <div class="rounded-lg bg-white p-6 shadow">
        <p>This is the {PageName} page.</p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
/**
 * {PageName}ページ
 */
</script>
```

**ルーティング設定の更新（`src/router/index.ts`）**:

```typescript
// 既存のインポートに追加
import {PageName} from '@/pages/{PageName}.vue'

// routesに追加
{
  path: '{routePath}',
  name: '{pageName}',
  component: {PageName},
}
```

## 実装例

### 入力例

- ページ名: `Profile`
- ルートパス: `/profile`
- 認証が必要: `yes`

### 生成されるファイル（React）

**src/pages/Profile.tsx**:

```typescript
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export default function Profile() {
  const navigate = useNavigate()
  const { token } = useAuth()

  useEffect(() => {
    if (!token) {
      navigate('/login')
    }
  }, [token, navigate])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <h1 className="text-3xl font-bold">Profile</h1>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        <div className="rounded-lg bg-white p-6 shadow">
          <p>This is the Profile page.</p>
        </div>
      </main>
    </div>
  )
}
```

**src/router/index.tsx**（更新）:

```typescript
import Profile from '@/pages/Profile'

// ... 既存のルート

{
  path: '/profile',
  element: <Profile />,
}
```

## 実行後の確認

- [ ] `src/pages/{PageName}.tsx`（または`.vue`）が作成された
- [ ] `src/router/index.tsx`（または`.ts`）にルートが追加された
- [ ] ブラウザで`http://localhost:5173{routePath}`にアクセスできる
- [ ] 認証が必要な場合、ログインしていないと`/login`にリダイレクトされる
- [ ] TypeScript型エラーがない（`npm run type-check`）

## 注意事項

### 1. ページ名の命名規則

- PascalCaseを使用（例: `UserProfile`、`PostList`）
- ファイル名もPascalCase（例: `UserProfile.tsx`）

### 2. ルートパスの命名規則

- kebab-caseを使用（例: `/user-profile`、`/post-list`）
- スラッシュ（/）で始まる

### 3. サンプルページのパターンを踏襲

このスキルは、サンプルページ（Login、Dashboard）のパターンを踏襲します：
- Tailwind CSSでスタイリング
- レスポンシブデザイン
- 認証チェック（必要な場合）
- エラーハンドリング（API呼び出しがある場合）

### 4. 追加実装が必要な場合

生成されたページは基本的なテンプレートです。以下を追加実装してください：
- APIデータ取得（TanStack Query）
- フォーム処理（React Hook Form / Vueのv-model）
- バリデーション（Zod）
- ローディング・エラー状態

## まとめ

このスキルを使用することで、以下のメリットがあります：

1. **開発効率**: ページの基本構造を自動生成
2. **一貫性**: サンプルページのパターンを踏襲
3. **品質**: 認証チェック、TypeScript型定義を自動追加
4. **保守性**: 1ファイル1コンポーネントの原則に従う

詳細な実装方法は、[CODING_STANDARDS.md](../../docs/CODING_STANDARDS.md)と[ARCHITECTURE.md](../../docs/ARCHITECTURE.md)を参照してください。
