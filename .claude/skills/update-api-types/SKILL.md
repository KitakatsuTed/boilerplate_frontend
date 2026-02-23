---
name: update-api-types
description: バックエンドのOpenAPIスキーマからTypeScript型定義を自動生成し、API型を更新するスキル
---

# /update-api-types - API型定義更新スキル

このスキルは、バックエンドのOpenAPIスキーマからTypeScript型定義を自動生成し、フロントエンドとバックエンドの型を同期させます。

## 使い方

```bash
/update-api-types
```

バックエンドが起動している状態で実行してください（デフォルト: http://localhost:8000）。

## 実行フロー

### 1. バックエンドAPIの起動確認

まず、バックエンドAPIが起動しているか確認します：

```bash
curl -f http://localhost:8000/health
```

**成功時**:
```json
{"status":"ok"}
```

**失敗時**:
- バックエンドが起動していない場合は、エラーメッセージを表示して終了
- ユーザーにバックエンドを起動するよう促す

### 2. OpenAPI型定義の生成

バックエンドのOpenAPIスキーマから型定義を生成します：

```bash
npx openapi-typescript http://localhost:8000/openapi.json -o src/api/types/api.ts
```

**実行例**:

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

### 3. 型定義の確認

生成された型定義ファイルを確認します：

```typescript
// src/api/types/api.ts
export interface paths {
  '/api/v1/auth/login': {
    post: {
      requestBody: {
        content: {
          'application/x-www-form-urlencoded': {
            username: string
            password: string
          }
        }
      }
      responses: {
        200: {
          content: {
            'application/json': {
              access_token: string
              token_type: string
            }
          }
        }
      }
    }
  }
  '/api/v1/users/me': {
    get: {
      responses: {
        200: {
          content: {
            'application/json': {
              id: number
              email: string
              is_active: boolean
              is_superuser: boolean
            }
          }
        }
      }
    }
  }
}
```

### 4. TypeScript型チェック

型エラーがないか確認します：

```bash
npm run type-check
```

**成功時**:
```
> type-check
> tsc --noEmit

✓ 型チェックが完了しました。エラーはありません。
```

**失敗時**:
- 型エラーがある場合は、エラーメッセージを表示
- エンドポイント関数の型定義を修正する必要がある

### 5. 変更点のレポート

生成された型定義の変更点をレポートします：

**新しいエンドポイントが追加された場合**:
```
✅ 新しいエンドポイントが追加されました:
  - POST /api/v1/posts
  - GET /api/v1/posts/{id}
```

**既存のエンドポイントが変更された場合**:
```
⚠️ エンドポイントのスキーマが変更されました:
  - PUT /api/v1/users/{id}
    - 新しいフィールド: "avatar_url" (string)
```

**削除されたエンドポイント**:
```
❌ エンドポイントが削除されました:
  - DELETE /api/v1/posts/{id}
```

## エラーハンドリング

### バックエンドが起動していない

**エラーメッセージ**:
```
❌ バックエンドAPIに接続できませんでした。

以下を確認してください:
1. バックエンドが起動しているか (http://localhost:8000)
2. .envファイルのVITE_API_URLが正しいか

バックエンドを起動するには:
cd ../backend
source .venv/bin/activate
uvicorn app.main:app --reload
```

### OpenAPIスキーマが取得できない

**エラーメッセージ**:
```
❌ OpenAPIスキーマを取得できませんでした。

http://localhost:8000/openapi.json にアクセスできません。

バックエンドのログを確認してください。
```

### 型生成に失敗

**エラーメッセージ**:
```
❌ 型定義の生成に失敗しました。

openapi-typescriptのエラー:
[エラー詳細]

以下を試してください:
1. openapi-typescriptを最新版に更新
   npm install -D openapi-typescript@latest
2. バックエンドのOpenAPIスキーマが正しいか確認
```

### TypeScript型エラー

**エラーメッセージ**:
```
⚠️ 型チェックでエラーが見つかりました:

src/api/endpoints/users.ts:10:15 - error TS2339: Property 'avatar_url' does not exist on type 'User'.

以下のファイルを修正する必要があります:
- src/api/endpoints/users.ts
- src/types/index.ts
```

## 実装例

### 例1: 新しいエンドポイントが追加された場合

**バックエンドで新しいエンドポイントを追加**:

```python
# backend/app/api/v1/endpoints/posts.py
@router.post('/', response_model=PostResponse)
async def create_post(post: PostCreate, db: Session = Depends(get_db)):
    return create_post_in_db(db, post)
```

**フロントエンドで型定義を更新**:

```bash
/update-api-types
```

**生成された型を使用**:

```typescript
// src/api/endpoints/posts.ts
import apiClient from '@/api/client'
import type { paths } from '@/api/types/api'

type PostCreateRequest = paths['/api/v1/posts']['post']['requestBody']['content']['application/json']
type PostResponse = paths['/api/v1/posts']['post']['responses']['200']['content']['application/json']

export const createPost = async (data: PostCreateRequest): Promise<PostResponse> => {
  const response = await apiClient.post<PostResponse>('/api/v1/posts', data)
  return response.data
}
```

### 例2: 既存のエンドポイントが変更された場合

**バックエンドでフィールドを追加**:

```python
# backend/app/schemas/user.py
class UserResponse(BaseModel):
    id: int
    email: str
    is_active: bool
    is_superuser: bool
    avatar_url: str | None = None  # 新しいフィールド
```

**フロントエンドで型定義を更新**:

```bash
/update-api-types
```

**型エラーを修正**:

```typescript
// src/types/index.ts
export interface User {
  id: number
  email: string
  is_active: boolean
  is_superuser: boolean
  avatar_url?: string  // 新しいフィールドを追加
}
```

### 例3: エンドポイントが削除された場合

**バックエンドでエンドポイントを削除**:

```python
# backend/app/api/v1/endpoints/posts.py
# @router.delete('/{id}')  # 削除
```

**フロントエンドで型定義を更新**:

```bash
/update-api-types
```

**使用箇所を削除**:

```typescript
// src/api/endpoints/posts.ts
// export const deletePost = async (id: number): Promise<void> => {
//   await apiClient.delete(`/api/v1/posts/${id}`)
// }  // 削除
```

## カスタムバックエンドURL

`.env`ファイルでバックエンドのURLをカスタマイズできます：

```bash
# .env
VITE_API_URL=http://localhost:8000
```

**別のURLを使用する場合**:

```bash
npx openapi-typescript https://api.example.com/openapi.json -o src/api/types/api.ts
```

## package.jsonスクリプト

`package.json`に以下のスクリプトが定義されています：

```json
{
  "scripts": {
    "generate:api-types": "openapi-typescript http://localhost:8000/openapi.json -o src/api/types/api.ts"
  }
}
```

**実行**:

```bash
npm run generate:api-types
```

## 実行後の確認

- [ ] `src/api/types/api.ts` が更新された
- [ ] TypeScript型チェックが通る（`npm run type-check`）
- [ ] 新しいエンドポイントが型定義に含まれている
- [ ] 変更されたフィールドが反映されている
- [ ] 削除されたエンドポイントが型定義から削除されている

## トラブルシューティング

### Q1. バックエンドが起動しているのに接続できない

**A**: 以下を確認してください：

1. **ポートが正しいか確認**:
   ```bash
   curl http://localhost:8000/health
   ```

2. **.envファイルのURLが正しいか確認**:
   ```bash
   cat .env
   # VITE_API_URL=http://localhost:8000
   ```

3. **ファイアウォールやプロキシの設定を確認**

### Q2. 型定義が生成されたが、型エラーが出る

**A**: 以下を確認してください：

1. **エンドポイント関数の型定義を修正**:
   ```typescript
   // src/api/endpoints/users.ts
   import type { paths } from '@/api/types/api'

   type UserResponse = paths['/api/v1/users/me']['get']['responses']['200']['content']['application/json']
   ```

2. **型定義ファイルを確認**:
   ```bash
   cat src/api/types/api.ts
   ```

3. **TypeScriptのバージョンを確認**:
   ```bash
   npx tsc --version
   ```

### Q3. openapi-typescriptのバージョンを更新したい

**A**: 以下のコマンドで更新してください：

```bash
npm install -D openapi-typescript@latest
```

**最新バージョンを確認**:

```bash
npm list openapi-typescript
```

### Q4. 複数のバックエンドAPIがある場合

**A**: 複数のスキーマファイルを生成できます：

```bash
# API 1
npx openapi-typescript http://localhost:8000/openapi.json -o src/api/types/api1.ts

# API 2
npx openapi-typescript http://localhost:8001/openapi.json -o src/api/types/api2.ts
```

## まとめ

このスキルを使用することで、以下のメリットがあります：

1. **型安全性**: バックエンドとフロントエンドの型が自動同期
2. **開発効率**: 手動で型を定義する必要がない
3. **バグ削減**: 型の不一致を事前に検出
4. **ドキュメント**: 型定義がAPIドキュメントの役割も果たす

詳細な実装方法は、[API_INTEGRATION.md](../../docs/API_INTEGRATION.md)を参照してください。
