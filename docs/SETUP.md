# 開発環境セットアップ

このドキュメントでは、フロントエンドボイラープレートの開発環境をセットアップする手順を説明します。

## 📚 関連ドキュメント

- [CODING_STANDARDS.md](CODING_STANDARDS.md) - コーディング規約
- [ARCHITECTURE.md](ARCHITECTURE.md) - アーキテクチャ設計
- [API_INTEGRATION.md](API_INTEGRATION.md) - API連携
- [FAQ.md](FAQ.md) - よくある質問

---

## 前提条件

### 必須

- **Node.js**: v18.x以上（推奨: v20.x）
- **パッケージマネージャー**: npm、pnpm、またはyarn
- **Git**: バージョン管理

### 推奨

- **VSCode**: エディタ（拡張機能推奨）
- **バックエンドAPI**: FastAPIボイラープレート（別リポジトリ）

---

## Node.jsのインストール

### macOS / Linux

**nvm（Node Version Manager）を使用（推奨）**:

```bash
# nvmのインストール
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash

# nvmの有効化（~/.bashrc または ~/.zshrc に追記）
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Node.js 20のインストール
nvm install 20
nvm use 20
nvm alias default 20

# バージョン確認
node -v  # v20.x.x
npm -v   # 10.x.x
```

### Windows

**Node.jsの公式サイトからインストーラーをダウンロード**:

https://nodejs.org/

または**nvm-windows**を使用:

https://github.com/coreybutler/nvm-windows

---

## パッケージマネージャーの選択

### npm（デフォルト）

Node.jsに同梱されています。追加のインストールは不要です。

```bash
npm -v
```

### pnpm（推奨、高速）

```bash
# pnpmのインストール
npm install -g pnpm

# バージョン確認
pnpm -v
```

**メリット**:
- npmより高速（ディスク使用量が少ない）
- モノレポに強い
- 厳密な依存関係管理

### yarn

```bash
# yarnのインストール
npm install -g yarn

# バージョン確認
yarn -v
```

---

## プロジェクトのセットアップ

### 1. リポジトリのクローン

```bash
git clone <your-repository-url> my-frontend-app
cd my-frontend-app
```

### 2. setup.shの実行

```bash
bash setup.sh
```

**対話的に以下を選択**:
- プロジェクト名: `my-frontend-app`
- フレームワーク: `1` (React) または `2` (Vue 3)
- パッケージマネージャー: `1` (npm)、`2` (pnpm)、または `3` (yarn)
- バックエンドAPIのURL: `http://localhost:8000`（デフォルト）

**setup.shが自動的に実行すること**:
- `.env`ファイルの生成
- 選択されなかったフレームワークのファイル削除
- 依存関係のインストール
- OpenAPI型定義の生成（バックエンドが起動していれば）

### 3. 環境変数の確認

`.env`ファイルが自動生成されます。必要に応じて編集してください。

```bash
# .env
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=my-frontend-app
```

---

## バックエンドAPIの起動

フロントエンドを起動する前に、バックエンドAPIを起動してください。

```bash
# 別ターミナルで
cd ../backend  # FastAPIボイラープレートのディレクトリ
source .venv/bin/activate
uvicorn app.main:app --reload
```

バックエンドが起動したら、以下にアクセスして確認：
- http://localhost:8000/docs（Swagger UI）
- http://localhost:8000/health（ヘルスチェック）

---

## フロントエンドの起動

### 開発サーバーの起動

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn run dev
```

ブラウザで自動的に開かれます（または手動で http://localhost:5173 を開く）。

### ログイン画面の確認

1. ブラウザで http://localhost:5173 を開く
2. ログイン画面が表示される
3. メールアドレスとパスワードを入力してログイン
4. ダッシュボード画面にリダイレクトされる

**デフォルトのテストユーザー（バックエンドで作成）**:
- メールアドレス: `test@example.com`
- パスワード: `password123`

---

## VSCode拡張機能（推奨）

### 必須

1. **ESLint** (dbaeumer.vscode-eslint)
   - JavaScriptとTypeScriptのリンター

2. **Prettier** (esbenp.prettier-vscode)
   - コードフォーマッター

3. **TypeScript Vue Plugin (Volar)** (Vue.volar)
   - Vue 3のTypeScript サポート（Vue選択時）

4. **Tailwind CSS IntelliSense** (bradlc.vscode-tailwindcss)
   - Tailwind CSSのオートコンプリート

### 推奨

5. **Auto Rename Tag** (formulahendry.auto-rename-tag)
   - HTMLタグの自動リネーム

6. **Path Intellisense** (christian-kohler.path-intellisense)
   - ファイルパスのオートコンプリート

7. **GitLens** (eamodio.gitlens)
   - Git履歴の可視化

### VSCode設定（.vscode/settings.json）

プロジェクトに以下の設定を追加することを推奨します：

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

---

## API型定義の生成

バックエンドのOpenAPIスキーマから型定義を生成します。

### 前提条件

バックエンドAPIが起動していること（http://localhost:8000）。

### 型定義の生成

```bash
# npm
npm run generate:api-types

# pnpm
pnpm run generate:api-types

# yarn
yarn run generate:api-types
```

生成されたファイル: `src/api/types/api.ts`

### 使用方法

```typescript
import type { paths } from '@/api/types/api'

// エンドポイントのリクエスト型
type LoginRequest = paths['/api/v1/auth/login']['post']['requestBody']['content']['application/json']

// エンドポイントのレスポンス型
type LoginResponse = paths['/api/v1/auth/login']['post']['responses']['200']['content']['application/json']
```

---

## トラブルシューティング

### 依存関係のインストールエラー

```bash
# node_modulesとpackage-lock.jsonを削除して再インストール
rm -rf node_modules package-lock.json
npm install
# または
pnpm install
# または
yarn install
```

### ポート5173が既に使用されている

```bash
# vite.config.tsでポートを変更
export default defineConfig({
  server: {
    port: 3000,  // 別のポートに変更
  },
})
```

### OpenAPI型定義の生成に失敗

**原因**: バックエンドAPIが起動していない、またはURLが間違っている。

**解決方法**:
1. バックエンドAPIが起動しているか確認
2. `.env`ファイルの`VITE_API_URL`が正しいか確認
3. 手動で生成:
   ```bash
   npx openapi-typescript http://localhost:8000/openapi.json -o src/api/types/api.ts
   ```

### ESLintエラーが表示される

```bash
# ESLintの自動修正
npm run lint

# 自動修正できない場合は手動で修正
```

### TypeScript型エラー

```bash
# 型チェック
npm run type-check

# エラーを確認して修正
```

---

## 本番環境へのデプロイ

### ビルド

```bash
# 本番用ビルド
npm run build
# または
pnpm run build
# または
yarn run build
```

ビルド成果物は`dist/`ディレクトリに生成されます。

### プレビュー

```bash
# ビルドしたアプリケーションをプレビュー
npm run preview
```

### 環境変数の設定（本番環境）

本番環境では、以下の環境変数を設定してください：

- `VITE_API_URL`: 本番バックエンドAPIのURL（例: https://api.example.com）
- `VITE_APP_NAME`: アプリケーション名

**Vercelの例**:

プロジェクト設定 > Environment Variables で設定。

**Netlifyの例**:

Site settings > Build & deploy > Environment で設定。

---

## 次のステップ

開発環境のセットアップが完了したら、以下のドキュメントを参照してください：

- [CODING_STANDARDS.md](CODING_STANDARDS.md) - コーディング規約を確認
- [ARCHITECTURE.md](ARCHITECTURE.md) - プロジェクトのアーキテクチャを理解
- [API_INTEGRATION.md](API_INTEGRATION.md) - API連携の方法を学習
- [FAQ.md](FAQ.md) - よくある質問を確認
