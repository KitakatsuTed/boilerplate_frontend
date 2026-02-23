# Frontend Boilerplate - プロジェクトガイドライン

このファイルは、Claude Codeが自動的に読み込むプロジェクト固有のガイドラインです。チーム全体で品質を統一するため、以下の原則に従ってください。

## 📚 関連ドキュメント

開発を開始する前に、以下のドキュメントを参照してください：

### 開発環境とコーディング
- [docs/SETUP.md](docs/SETUP.md) - 開発環境セットアップ
- [docs/CODING_STANDARDS.md](docs/CODING_STANDARDS.md) - コーディング規約

### アーキテクチャとAPI連携
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) - アーキテクチャ設計
- [docs/API_INTEGRATION.md](docs/API_INTEGRATION.md) - API連携

### その他
- [docs/FAQ.md](docs/FAQ.md) - よくある質問

---

## アーキテクチャの原則

このプロジェクトは以下の原則に従っています：

- **1ファイル1コンポーネント**: 各コンポーネントを独立したファイルに配置
- **型安全性**: TypeScript必須、openapi-typescriptでバックエンドと型共有
- **状態管理の分離**: ローカル状態、グローバル状態、サーバー状態を明確に使い分け
- **エラーハンドリング統一**: `handleApiError`で統一されたエラー処理
- **過度な抽象化を避ける**: バックエンドの「Mixinを使用しない」と同じ思想

**詳細は[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)と[docs/CODING_STANDARDS.md](docs/CODING_STANDARDS.md)を参照してください。**

---

## よく使う開発タスク

### 新ページ追加（推奨）

```bash
/add-page
```

対話形式でページ名、ルート、認証の有無を質問され、自動生成されます。

または手動で：
1. `src/pages/PageName.tsx`（またはPageName.vue）を作成
2. `src/router/index.tsx`（またはindex.ts）にルートを追加
3. サンプルページ（Login、Dashboard）のパターンを参考に実装

### 新コンポーネント追加

```bash
/add-component
```

対話形式でコンポーネント名、種類（common/layout/features）を質問され、自動生成されます。

### API型定義の更新

```bash
npm run generate:api-types
```

バックエンドのOpenAPIスキーマから最新の型定義を取得します。

### UIレビュー

```bash
/ui-review
```

アクセシビリティ、Tailwind CSSの適切な使用、レスポンシブデザインを確認します。

---

## 状態管理の使い分け

このプロジェクトでは、3種類の状態を明確に使い分けます：

### 1. ローカル状態（useState / ref）

コンポーネント内でのみ使用する一時的な状態：
- フォームの入力値
- モーダルの開閉状態
- ローカルなUI状態

**React例**:
```typescript
const [isOpen, setIsOpen] = useState(false)
```

**Vue例**:
```typescript
const isOpen = ref(false)
```

### 2. グローバル状態（Zustand / Pinia）

複数のコンポーネントで共有する状態：
- 認証情報（トークン、ユーザー情報）
- テーマ設定（ダークモード等）
- グローバルなUI状態（サイドバーの開閉等）

**React例（Zustand）**:
```typescript
import { useAuthStore } from '@/stores/auth'

const { token, user, setToken } = useAuthStore()
```

**Vue例（Pinia）**:
```typescript
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
```

### 3. サーバー状態（TanStack Query）

サーバーから取得するデータ：
- APIレスポンス
- キャッシュが必要なデータ
- 自動リフェッチが必要なデータ

**React例**:
```typescript
import { useQuery } from '@tanstack/react-query'
import { getCurrentUser } from '@/api/endpoints/users'

const { data, isLoading, error } = useQuery({
  queryKey: ['currentUser'],
  queryFn: getCurrentUser,
})
```

**Vue例**:
```typescript
import { useQuery } from '@tanstack/vue-query'
import { getCurrentUser } from '@/api/endpoints/users'

const { data, isLoading, error } = useQuery({
  queryKey: ['currentUser'],
  queryFn: getCurrentUser,
})
```

---

## API連携の基本パターン

### 1. エンドポイント定義

`src/api/endpoints/`に新しいエンドポイントを追加：

```typescript
import apiClient from '@/api/client'
import { API_ENDPOINTS } from '@/constants/api'
import type { User } from '@/types'

export const getUser = async (id: number): Promise<User> => {
  const response = await apiClient.get<User>(API_ENDPOINTS.USERS.DETAIL(id))
  return response.data
}
```

### 2. エラーハンドリング

```typescript
import { handleApiError } from '@/utils/error-handler'

try {
  const user = await getUser(123)
} catch (error) {
  const errorMessage = handleApiError(error)
  // エラーメッセージを表示
}
```

### 3. 認証トークンの自動付与

Axiosインターセプターで自動的にAuthorizationヘッダーに付与されます。
特別な処理は不要です。

---

## バリデーション

### Zodを使用した厳格なバリデーション

フォームのバリデーションは、Zodを使用します：

**React例（React Hook Form）**:
```typescript
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(8, 'パスワードは8文字以上である必要があります'),
})

type FormData = z.infer<typeof schema>

const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
  resolver: zodResolver(schema),
})
```

**Vue例**:
```typescript
import { z } from 'zod'

const schema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(8, 'パスワードは8文字以上である必要があります'),
})

const validate = () => {
  try {
    schema.parse({ email: email.value, password: password.value })
    errors.value = {}
  } catch (e) {
    if (e instanceof z.ZodError) {
      // エラーハンドリング
    }
  }
}
```

---

## Tailwind CSSの使用方針

### 基本方針

- **utility-first**: ユーティリティクラスを組み合わせてスタイリング
- **レスポンシブ**: モバイルファーストで、`sm:`、`md:`、`lg:`を使用
- **ダークモード対応**: `dark:`プレフィックスで対応可能

### 例

```tsx
<div className="flex min-h-screen items-center justify-center bg-gray-50">
  <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
    <h1 className="mb-6 text-2xl font-bold">ログイン</h1>
    <button className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
      ログイン
    </button>
  </div>
</div>
```

### ui-ux-pro-maxスキルとの連携

このプロジェクトでは、Tailwind CSSを固定採用しています。`ui-ux-pro-max`スキルを使用する場合も、Tailwind CSSの範囲内でデザインを生成してください。

---

## レビュー前チェックリスト

コミット前に以下を確認してください：

### 型安全性
- [ ] TypeScript型チェックが通る（`npm run type-check`）
- [ ] `any`型を使用していない
- [ ] すべての関数に型ヒントがある
- [ ] Props定義がある（TypeScript interfaceまたはtype）

### コーディング規約
- [ ] 1ファイル1コンポーネントの原則に従っている
- [ ] インポートパスは`@/`エイリアスを使用している
- [ ] ESLintエラーがない（`npm run lint`）
- [ ] Prettierフォーマットが適用されている（`npm run format`）

### API連携
- [ ] API呼び出しにopenapi-typescript型を使用している（可能な場合）
- [ ] エラーハンドリングを実装している（`handleApiError`使用）
- [ ] ローディング状態を表示している
- [ ] 認証が必要なページで認証チェックしている

### スタイリング
- [ ] Tailwind CSSでスタイリングしている
- [ ] レスポンシブデザイン対応している
- [ ] アクセシビリティを考慮している（aria-label等）

### 状態管理
- [ ] ローカル状態、グローバル状態、サーバー状態を適切に使い分けている
- [ ] サーバー状態にTanStack Queryを使用している（可能な場合）

---

## まとめ

このガイドラインに従うことで、チーム全体で一貫した品質のコードを保つことができます。Claude Codeスキルを活用し、レビュー前チェックリストを確認することで、品質の高いフロントエンドを効率的に開発しましょう。

詳細なドキュメントは[docs/](docs/)ディレクトリを参照してください。
