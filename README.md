# Frontend Boilerplate - 本番対応のフロントエンドテンプレート

本番環境で使える、柔軟で拡張性の高いフロントエンドボイラープレートです。POCや新規開発案件で素早くWebサービスを立ち上げるために設計されています。

## ✨ 特徴

### 🎨 フレームワーク選択式
プロジェクトに応じて最適なフレームワークを選択できます：
- **React 18**（推奨）: 最新のReact、React Hook Form、Zustand
- **Vue 3**: Composition API、Pinia、Vue Router

### 🔐 バックエンドとの型共有
- **openapi-typescript**: バックエンドのOpenAPIスキーマから型定義を自動生成
- **型安全なAPI呼び出し**: バックエンドのスキーマ変更に自動追従
- **TypeScript必須**: すべてのコードで型安全性を保証

### 🎯 状態管理
- **グローバル状態**: Zustand（React）/ Pinia（Vue）
- **サーバー状態**: TanStack Query（React Query / Vue Query）
- **ローカル状態**: useState / ref
- 明確な使い分けでコードの見通しが良い

### 🏗️ クリーンアーキテクチャ
- **1ファイル1コンポーネント**: 保守性と可読性を向上
- **APIクライアントの抽象化**: Axiosインターセプターで認証トークン自動付与
- **エラーハンドリング統一**: HTTPステータスコード別の処理
- **過度な抽象化を避ける**: コードの明示性と理解しやすさ

### 🚀 開発速度の向上
- **setup.sh**: 対話的初期化スクリプト
  ```bash
  bash setup.sh
  ```
  フレームワーク、状態管理、パッケージマネージャーを選択して自動セットアップ

- **サンプルページ**: Login、Dashboard
  - フォーム管理、バリデーション、エラーハンドリング、ローディング状態の実装例
  - AIが自然にパターンを踏襲できるお手本コード

### 🎨 Tailwind CSS固定
- **utility-first**: カスタマイズ性が高く、ui-ux-pro-maxスキルと相性抜群
- **レスポンシブデザイン**: モバイルファースト
- **ダークモード対応**: 簡単に実装可能

### 👥 チーム品質統一
- **CLAUDE.md**: プロジェクト固有のガイドライン、Claude Codeが自動読み込み
- **Claude Codeスキル群**:
  - `/add-page`: 新ページ追加（ルーティング、認証設定も自動）
  - `/add-component`: 新コンポーネント追加（型定義、Props定義も自動）
  - `/update-api-types`: API型定義更新（バックエンドから最新取得）
  - `/ui-review`: UIレビュー（アクセシビリティ、レスポンシブ確認）

## 🚀 クイックスタート

### 1. リポジトリのクローン

```bash
# GitHubテンプレートから新規リポジトリを作成
# 「Use this template」ボタンをクリック

# または直接クローン
git clone https://github.com/yourusername/frontend-boilerplate.git my-new-frontend
cd my-new-frontend
```

### 2. プロジェクトの初期化

```bash
# setup.shスクリプトを実行（対話的に設定）
bash setup.sh
```

対話的に以下を選択します：
- プロジェクト名
- フレームワーク（React / Vue 3）
- パッケージマネージャー（npm / pnpm / yarn）
- バックエンドAPIのURL（デフォルト: http://localhost:8000）

スクリプトが自動的に：
- `.env`ファイルを生成
- 選択されなかったフレームワークのファイルを削除
- 依存関係をインストール
- OpenAPI型定義を生成（バックエンドが起動していれば）

### 3. 環境変数の設定

`.env`ファイルを編集して、必要な設定を調整：

```bash
# バックエンドAPIのURL
VITE_API_URL=http://localhost:8000

# アプリケーション名
VITE_APP_NAME=My Frontend App
```

### 4. バックエンドの起動

```bash
# バックエンドAPI起動（別ターミナル）
cd ../backend
source .venv/bin/activate
uvicorn app.main:app --reload
```

### 5. フロントエンドの起動

```bash
# 開発サーバー起動
npm run dev
# または
pnpm run dev
# または
yarn run dev
```

### 6. ブラウザで確認

ブラウザで以下を開く：
- アプリケーション: http://localhost:5173
- バックエンドAPI: http://localhost:8000/docs

## 📁 ディレクトリ構造（setup.sh実行後）

### React選択時

```
frontend/
├── src/
│   ├── main.tsx                    # エントリーポイント
│   ├── index.css                   # Tailwind CSS
│   ├── api/                        # APIクライアント
│   │   ├── client.ts               # Axios設定、インターセプター
│   │   ├── endpoints/
│   │   │   ├── auth.ts             # 認証API
│   │   │   └── users.ts            # ユーザーAPI
│   │   └── types/                  # OpenAPI型定義（自動生成）
│   │       └── api.ts
│   ├── utils/                      # ユーティリティ
│   │   ├── error-handler.ts        # エラーハンドリング
│   │   └── token.ts                # トークン管理
│   ├── constants/
│   │   └── api.ts                  # API定数
│   ├── types/
│   │   └── index.ts                # 型定義
│   ├── stores/                     # Zustand状態管理
│   │   └── auth.ts
│   ├── router/                     # React Router
│   │   └── index.tsx
│   ├── components/
│   │   ├── common/                 # 共通コンポーネント
│   │   ├── layout/                 # レイアウト
│   │   └── features/               # 機能別
│   ├── pages/
│   │   ├── Login.tsx               # ログイン画面
│   │   └── Dashboard.tsx           # ダッシュボード
│   └── hooks/
│       └── useAuth.ts              # 認証カスタムフック
├── .claude/                        # Claude Codeスキル
│   └── skills/
│       ├── add-page/
│       ├── add-component/
│       ├── update-api-types/
│       └── ui-review/
├── docs/                           # 詳細ドキュメント
│   ├── SETUP.md
│   ├── CODING_STANDARDS.md
│   ├── ARCHITECTURE.md
│   ├── API_INTEGRATION.md
│   └── FAQ.md
├── public/                         # 静的ファイル
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
├── .env
├── .gitignore
├── CLAUDE.md                       # プロジェクトガイドライン
└── README.md
```

### Vue選択時

```
frontend/
├── src/
│   ├── main.ts                     # エントリーポイント
│   ├── App.vue                     # ルートコンポーネント
│   ├── index.css                   # Tailwind CSS
│   ├── api/                        # APIクライアント（Reactと共通）
│   ├── utils/                      # ユーティリティ（Reactと共通）
│   ├── constants/                  # 定数（Reactと共通）
│   ├── types/                      # 型定義（Reactと共通）
│   ├── stores/                     # Pinia状態管理
│   │   └── auth.ts
│   ├── router/                     # Vue Router
│   │   └── index.ts
│   ├── components/
│   │   ├── common/
│   │   ├── layout/
│   │   └── features/
│   ├── pages/
│   │   ├── Login.vue               # ログイン画面
│   │   └── Dashboard.vue           # ダッシュボード
│   └── composables/
│       └── useAuth.ts              # 認証Composable
├── （以下、Reactと同じ）
```

## 🛠️ 開発ワークフロー

### 新しいページの追加

**方法1: Claude Codeスキル（推奨）**

```bash
/add-page
```

対話形式でページ名、ルート、認証の有無を質問され、自動生成されます。

**方法2: 手動**

1. `src/pages/Profile.tsx`（またはProfile.vue）を作成
2. `src/router/index.tsx`にルートを追加
3. 必要に応じて認証チェックを追加

### API型定義の更新

```bash
# バックエンドのOpenAPIスキーマから最新の型定義を取得
npm run generate:api-types
# または
pnpm run generate:api-types
# または
yarn run generate:api-types
```

### コードフォーマット

```bash
# Prettierでフォーマット
npm run format

# ESLintチェック
npm run lint

# TypeScript型チェック
npm run type-check
```

### ビルド

```bash
# 本番用ビルド
npm run build

# ビルドのプレビュー
npm run preview
```

## 🔧 環境変数

| 変数名 | 説明 | デフォルト値 |
|--------|------|--------------|
| `VITE_API_URL` | バックエンドAPIのURL | `http://localhost:8000` |
| `VITE_APP_NAME` | アプリケーション名 | `Frontend Boilerplate` |

詳細は[.env.example](.env.example)を参照してください。

## 🚢 デプロイ

### Vercel

```bash
# Vercelにデプロイ
npx vercel
```

環境変数を設定：
- `VITE_API_URL`: 本番バックエンドAPIのURL

### Netlify

```bash
# Netlifyにデプロイ
npx netlify deploy --prod
```

ビルドコマンド: `npm run build`
公開ディレクトリ: `dist`

### その他のホスティング

1. `npm run build`でビルド
2. `dist/`ディレクトリをホスティングサービスにアップロード

## 👥 チームでの利用方法

このボイラープレートは、チーム全体で品質を統一するための仕組みが組み込まれています。

### CLAUDE.mdによるガイドライン統一

`CLAUDE.md`には、プロジェクトのコアガイドライン（アーキテクチャの原則、よく使う開発タスク）が簡潔にまとめられています。詳細なドキュメントはdocs/ディレクトリに分離されており、必要に応じて参照できます。Claude Codeが自動的に読み込んで従います。

### Claude Codeスキルの活用

チームメンバー全員が同じスキルを使用することで、一貫した品質のコードを生成できます：

- **`/add-page`**: ガイドラインに従ったページ自動生成
- **`/add-component`**: コンポーネントの標準パターン適用
- **`/update-api-types`**: バックエンドとの型同期
- **`/ui-review`**: アクセシビリティ、レスポンシブデザインの自動チェック

### ワークフロー

1. ボイラープレートをクローン
2. `setup.sh`で初期化（フレームワーク・状態管理を選択）
3. `CLAUDE.md`と`.claude/skills/`がプロジェクトに含まれる
4. チームメンバー全員が同じガイドライン・スキルを使用
5. Claude Codeが一貫した品質でコードを生成
6. レビュー工数削減、品質向上

## 📚 ドキュメント

- [CLAUDE.md](CLAUDE.md) - プロジェクト固有のガイドライン（Claude Codeが自動読み込み）

### 開発環境とコーディング
- [docs/SETUP.md](docs/SETUP.md) - 開発環境セットアップ
- [docs/CODING_STANDARDS.md](docs/CODING_STANDARDS.md) - コーディング規約

### アーキテクチャとAPI連携
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) - アーキテクチャ設計
- [docs/API_INTEGRATION.md](docs/API_INTEGRATION.md) - API連携

### その他
- [docs/FAQ.md](docs/FAQ.md) - よくある質問

## 🔗 バックエンドとの連携

このフロントエンドボイラープレートは、FastAPIベースのバックエンドボイラープレートと組み合わせて使うことを想定しています。

### 推奨バックエンド

**[boilerplate](https://github.com/KitakatsuTed/boilerplate)** - 本番対応のFastAPIボイラープレート

- **柔軟な認証システム** - JWT、セッション、OAuth2、認証なしを選択可能
- **複数DB対応** - PostgreSQL、MySQL、SQLite
- **クリーンアーキテクチャ** - BaseRepositoryパターン、1ファイル1クラス
- **AI連携** - AWS Bedrock統合（Claude、Titan等）
- **Claude Codeスキル** - `/add-endpoint`、`/add-model`、`/security-check`等

### OpenAPI型定義の自動生成

```bash
# バックエンドのOpenAPIスキーマから型を生成
npm run generate:api-types
# 内部で実行: npx openapi-typescript http://localhost:8000/openapi.json -o src/api/types/api.ts
```

### CORS設定

バックエンドの`.env`ファイルに以下を設定：

```bash
BACKEND_CORS_ORIGINS=["http://localhost:5173","http://localhost:3000"]
```

### 認証フローの統一

- バックエンドがJWT認証の場合、フロントエンドもJWT対応
- トークンはlocalStorageに保存
- Axiosインターセプターで自動的にAuthorizationヘッダーに付与

## 🤝 貢献

プルリクエストを歓迎します！大きな変更の場合は、まずissueを開いて変更内容を議論してください。

## 📄 ライセンス

MIT
