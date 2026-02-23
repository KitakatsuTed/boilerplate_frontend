---
name: add-component
description: 新しいコンポーネントを追加するスキル。TypeScript型定義、Props定義を含むコンポーネントを自動生成します。
---

# /add-component - 新コンポーネント追加スキル

このスキルは、新しいコンポーネントを追加する際に使用します。TypeScript型定義、Props定義を含むコンポーネントを自動生成し、プロジェクトのコーディング規約に従います。

## 使い方

```bash
/add-component
```

対話形式で以下を質問します：
1. コンポーネント名（例: Button、UserCard）
2. コンポーネントの種類（common/layout/features）
3. Propsの定義（オプション）

## 実行フロー

### 1. ユーザーへの質問

以下の質問を対話形式で行います：

**Q1: コンポーネント名を入力してください（PascalCase）**
- 例: `Button`、`UserCard`、`LoginForm`
- PascalCaseで入力（単語の先頭を大文字）

**Q2: コンポーネントの種類を選択してください**
- `1) common` - 汎用的な再利用可能コンポーネント（Button、Input等）
- `2) layout` - レイアウトコンポーネント（Header、Sidebar等）
- `3) features` - 機能別コンポーネント（LoginForm、UserProfile等）

**Q3: Propsを定義しますか？（yes/no）**
- `yes`: Props定義を追加
- `no`: Propsなしのシンプルなコンポーネント

**Q4（Q3でyesの場合）: Propsを定義してください**
- 例: `label:string, onClick:function, disabled:boolean`
- カンマ区切りで入力: `propName:type, propName:type`

### 2. フレームワークの検出

プロジェクトのフレームワークを検出します：
- `src/components/common/`に`.tsx`ファイルが存在 → React
- `src/components/common/`に`.vue`ファイルが存在 → Vue

### 3. ファイル生成

#### React版

**Propsありの場合（`src/components/{種類}/{ComponentName}.tsx`）**:

```typescript
/**
 * {ComponentName}コンポーネント
 */

interface {ComponentName}Props {
  label: string
  onClick: () => void
  disabled?: boolean
}

export default function {ComponentName}({ label, onClick, disabled = false }: {ComponentName}Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400"
    >
      {label}
    </button>
  )
}
```

**Propsなしの場合**:

```typescript
/**
 * {ComponentName}コンポーネント
 */

export default function {ComponentName}() {
  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <p>{ComponentName} component</p>
    </div>
  )
}
```

#### Vue版

**Propsありの場合（`src/components/{種類}/{ComponentName}.vue`）**:

```vue
<template>
  <button
    @click="emit('click')"
    :disabled="disabled"
    class="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400"
  >
    {{ label }}
  </button>
</template>

<script setup lang="ts">
/**
 * {ComponentName}コンポーネント
 */

interface Props {
  label: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})

const emit = defineEmits<{
  click: []
}>()
</script>
```

**Propsなしの場合**:

```vue
<template>
  <div class="rounded-lg bg-white p-6 shadow">
    <p>{ComponentName} component</p>
  </div>
</template>

<script setup lang="ts">
/**
 * {ComponentName}コンポーネント
 */
</script>
```

## 実装例

### 例1: Buttonコンポーネント（common）

**入力**:
- コンポーネント名: `Button`
- 種類: `1) common`
- Props定義: `yes`
- Props: `label:string, onClick:function, disabled:boolean, variant:string`

**生成（React）**:

```typescript
// src/components/common/Button.tsx

interface ButtonProps {
  label: string
  onClick: () => void
  disabled?: boolean
  variant?: 'primary' | 'secondary'
}

export default function Button({
  label,
  onClick,
  disabled = false,
  variant = 'primary',
}: ButtonProps) {
  const baseClasses = 'rounded px-4 py-2 text-white disabled:bg-gray-400'
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700',
    secondary: 'bg-gray-600 hover:bg-gray-700',
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      {label}
    </button>
  )
}
```

### 例2: Headerコンポーネント（layout）

**入力**:
- コンポーネント名: `Header`
- 種類: `2) layout`
- Props定義: `no`

**生成（React）**:

```typescript
// src/components/layout/Header.tsx

export default function Header() {
  return (
    <header className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <h1 className="text-3xl font-bold">Header</h1>
      </div>
    </header>
  )
}
```

### 例3: UserCardコンポーネント（features）

**入力**:
- コンポーネント名: `UserCard`
- 種類: `3) features`
- Props定義: `yes`
- Props: `user:object, onEdit:function`

**生成（React）**:

```typescript
// src/components/features/UserCard.tsx
import type { User } from '@/types'

interface UserCardProps {
  user: User
  onEdit: (user: User) => void
}

export default function UserCard({ user, onEdit }: UserCardProps) {
  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h2 className="text-xl font-semibold">{user.email}</h2>
      <p className="text-gray-600">ID: {user.id}</p>
      <button
        onClick={() => onEdit(user)}
        className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        編集
      </button>
    </div>
  )
}
```

## Props型の対応表

| 入力 | TypeScript型（React） | TypeScript型（Vue） |
|------|----------------------|---------------------|
| `string` | `string` | `string` |
| `number` | `number` | `number` |
| `boolean` | `boolean` | `boolean` |
| `function` | `() => void` | `emit` |
| `object` | `Record<string, any>` または 型インポート | `Record<string, any>` または 型インポート |
| `array` | `any[]` | `any[]` |

## 実行後の確認

- [ ] `src/components/{種類}/{ComponentName}.tsx`（または`.vue`）が作成された
- [ ] TypeScript型エラーがない（`npm run type-check`）
- [ ] Props定義が正しい（interface/type）
- [ ] Tailwind CSSでスタイリングされている
- [ ] コンポーネントをインポートして使用できる

## 注意事項

### 1. コンポーネント名の命名規則

- PascalCaseを使用（例: `UserCard`、`LoginForm`）
- ファイル名もPascalCase（例: `UserCard.tsx`）

### 2. コンポーネントの種類

**common**:
- 汎用的な再利用可能コンポーネント
- 例: Button、Input、Modal、Card

**layout**:
- レイアウトコンポーネント
- 例: Header、Sidebar、Footer、Layout

**features**:
- 機能別コンポーネント
- 例: LoginForm、UserProfile、PostList

### 3. Props定義のベストプラクティス

**必須vs任意**:
- 必須: `label: string`
- 任意: `disabled?: boolean`

**デフォルト値**:
- React: `disabled = false`
- Vue: `withDefaults(defineProps<Props>(), { disabled: false })`

**型の厳密性**:
- `variant?: 'primary' | 'secondary'`（Union型）
- `size?: 'sm' | 'md' | 'lg'`

### 4. Tailwind CSSの使用

生成されるコンポーネントは、Tailwind CSSでスタイリングされます：
- ユーティリティクラスを使用
- レスポンシブデザイン対応
- カスタムCSSは最小限に

### 5. 追加実装が必要な場合

生成されたコンポーネントは基本的なテンプレートです。以下を追加実装してください：
- 状態管理（useState/ref）
- イベントハンドリング
- バリデーション
- アクセシビリティ（aria-label等）

## まとめ

このスキルを使用することで、以下のメリットがあります：

1. **開発効率**: コンポーネントの基本構造を自動生成
2. **一貫性**: プロジェクトのコーディング規約に従う
3. **品質**: TypeScript型定義を自動追加
4. **保守性**: 1ファイル1コンポーネントの原則に従う

詳細な実装方法は、[CODING_STANDARDS.md](../../docs/CODING_STANDARDS.md)を参照してください。
