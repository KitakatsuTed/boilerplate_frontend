# よくある質問（FAQ）

このドキュメントでは、フロントエンドボイラープレートに関するよくある質問とその回答をまとめています。

## 📚 関連ドキュメント

- [SETUP.md](SETUP.md) - 開発環境セットアップ
- [CODING_STANDARDS.md](CODING_STANDARDS.md) - コーディング規約
- [ARCHITECTURE.md](ARCHITECTURE.md) - アーキテクチャ設計
- [API_INTEGRATION.md](API_INTEGRATION.md) - API連携

---

## 環境構築

### Q1. Node.jsのバージョンはいくつを使えば良いですか？

**A**: v18.x以上を推奨します。最新のLTS版（v20.x）を使用することを強く推奨します。

```bash
# バージョン確認
node -v

# nvm使用の場合
nvm install 20
nvm use 20
```

詳細は[SETUP.md](SETUP.md)を参照してください。

---

### Q2. パッケージマネージャーはどれを使えば良いですか？

**A**: pnpm（推奨）、npm、yarnのいずれかを使用できます。

- **pnpm**: 高速、ディスク使用量が少ない（推奨）
- **npm**: Node.jsに同梱、追加インストール不要
- **yarn**: npmより高速

```bash
# pnpmのインストール
npm install -g pnpm

# バージョン確認
pnpm -v
```

---

### Q3. setup.shを実行したらエラーが出ました

**A**: 以下を確認してください：

1. **Bashが使えるか確認**:
   ```bash
   bash --version
   ```

2. **実行権限があるか確認**:
   ```bash
   chmod +x setup.sh
   ```

3. **macOS/Linuxで実行しているか確認**:
   - Windowsの場合はGit Bashまたは WSL2を使用してください

---

### Q4. OpenAPI型定義の生成に失敗します

**A**: 以下を確認してください：

1. **バックエンドAPIが起動しているか**:
   ```bash
   curl http://localhost:8000/health
   ```

2. **.envファイルのAPIのURLが正しいか**:
   ```bash
   cat .env
   # VITE_API_URL=http://localhost:8000
   ```

3. **手動で生成を試す**:
   ```bash
   npx openapi-typescript http://localhost:8000/openapi.json -o src/api/types/api.ts
   ```

詳細は[API_INTEGRATION.md](API_INTEGRATION.md)を参照してください。

---

## 開発

### Q5. 新しいページを追加したいです

**A**: 以下の方法があります：

**方法1: Claude Codeスキル（推奨）**:
```bash
/add-page
```

**方法2: 手動**:
1. `src/pages/PageName.tsx`（またはPageName.vue）を作成
2. `src/router/index.tsx`にルートを追加
3. サンプルページ（Login、Dashboard）のパターンを参考に実装

---

### Q6. 新しいコンポーネントを追加したいです

**A**: 以下の方法があります：

**方法1: Claude Codeスキル（推奨）**:
```bash
/add-component
```

**方法2: 手動**:
1. `src/components/[種類]/ComponentName.tsx`を作成
   - 種類: `common`、`layout`、`features`
2. Props定義を追加（TypeScript interface）
3. エクスポート

詳細は[CODING_STANDARDS.md](CODING_STANDARDS.md)を参照してください。

---

### Q7. APIエンドポイントを追加したいです

**A**: 以下の手順で追加します：

1. **定数を追加**:
   ```typescript
   // src/constants/api.ts
   export const API_ENDPOINTS = {
     POSTS: {
       LIST: '/api/v1/posts',
       DETAIL: (id: number) => `/api/v1/posts/${id}`,
     },
   }
   ```

2. **エンドポイント関数を作成**:
   ```typescript
   // src/api/endpoints/posts.ts
   import apiClient from '@/api/client'

   export const getPosts = async () => {
     const response = await apiClient.get('/api/v1/posts')
     return response.data
   }
   ```

詳細は[API_INTEGRATION.md](API_INTEGRATION.md)を参照してください。

---

### Q8. 状態管理はどう使い分ければ良いですか？

**A**: 以下のように使い分けます：

- **ローカル状態（useState/ref）**: コンポーネント内でのみ使用する状態
  - 例: モーダルの開閉状態、フォームの入力値

- **グローバル状態（Zustand/Pinia）**: 複数のコンポーネントで共有する状態
  - 例: 認証情報、テーマ設定

- **サーバー状態（TanStack Query）**: サーバーから取得するデータ
  - 例: ユーザー一覧、投稿データ

詳細は[ARCHITECTURE.md](ARCHITECTURE.md)を参照してください。

---

## API連携

### Q9. バックエンドとの通信でCORSエラーが出ます

**A**: バックエンドの`.env`ファイルにフロントエンドのURLを追加してください：

```bash
# バックエンドの.env
BACKEND_CORS_ORIGINS=["http://localhost:5173","http://localhost:3000"]
```

バックエンドを再起動してください。

---

### Q10. 認証トークンが自動的に付与されません

**A**: 以下を確認してください：

1. **トークンが保存されているか**:
   ```typescript
   import { getToken } from '@/utils/token'
   console.log(getToken())
   ```

2. **Axiosインターセプターが正しく設定されているか**:
   ```typescript
   // src/api/client.tsを確認
   ```

3. **API呼び出しでapiClientを使用しているか**:
   ```typescript
   // ✅ 正しい
   import apiClient from '@/api/client'
   await apiClient.get('/api/v1/users/me')

   // ❌ 間違い
   import axios from 'axios'
   await axios.get('/api/v1/users/me')
   ```

---

### Q11. 401エラーが出たらどうすれば良いですか？

**A**: 以下を確認してください：

1. **トークンが有効か確認**:
   - トークンの有効期限が切れていないか
   - バックエンドで正しいトークンか確認

2. **再ログイン**:
   - 401エラー時は自動的にトークンが削除されログイン画面にリダイレクトされます

3. **Axiosインターセプターを確認**:
   ```typescript
   // src/api/client.ts
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
   ```

---

## スタイリング

### Q12. Tailwind CSSのクラスが効かないです

**A**: 以下を確認してください：

1. **tailwind.config.jsのcontent設定を確認**:
   ```javascript
   content: [
     './index.html',
     './src/**/*.{js,ts,jsx,tsx,vue}',
   ],
   ```

2. **index.cssでTailwindをインポートしているか確認**:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

3. **開発サーバーを再起動**:
   ```bash
   npm run dev
   ```

---

### Q13. カスタムCSSを追加したいです

**A**: 可能な限りTailwind CSSのユーティリティクラスを使用してください。

どうしても必要な場合は、コンポーネント単位でCSSファイルを作成：

```typescript
// Button.tsx
import './Button.css'

export default function Button() {
  return <button className="custom-button">Click</button>
}
```

ただし、Tailwind CSSで対応できる場合はユーティリティクラスを優先してください。

---

## テスト・ビルド

### Q14. 本番用ビルドを作成したいです

**A**: 以下のコマンドを実行してください：

```bash
# ビルド
npm run build

# ビルドのプレビュー
npm run preview
```

ビルド成果物は`dist/`ディレクトリに生成されます。

---

### Q15. TypeScript型エラーが出ます

**A**: 以下のコマンドで型チェックを実行してください：

```bash
npm run type-check
```

エラーメッセージを確認して、型定義を修正してください。

---

### Q16. ESLintエラーが出ます

**A**: 以下のコマンドで自動修正を試してください：

```bash
npm run lint
```

自動修正できない場合は、エラーメッセージに従って手動で修正してください。

---

## デプロイ

### Q17. Vercelにデプロイしたいです

**A**: 以下の手順でデプロイできます：

1. **Vercelにログイン**:
   ```bash
   npx vercel login
   ```

2. **デプロイ**:
   ```bash
   npx vercel
   ```

3. **環境変数を設定**:
   - Vercelダッシュボード > Project Settings > Environment Variables
   - `VITE_API_URL`: 本番バックエンドAPIのURL

---

### Q18. Netlifyにデプロイしたいです

**A**: 以下の設定でデプロイできます：

1. **ビルドコマンド**: `npm run build`
2. **公開ディレクトリ**: `dist`
3. **環境変数**:
   - `VITE_API_URL`: 本番バックエンドAPIのURL

---

## フレームワーク選択

### Q19. ReactとVue、どちらを選べば良いですか？

**A**: 以下を参考に選択してください：

**React**:
- **メリット**: 大規模コミュニティ、豊富なライブラリ、求人が多い
- **デメリット**: 学習曲線がやや急
- **向いている**: 大規模アプリ、チーム開発

**Vue 3**:
- **メリット**: 学習しやすい、公式ライブラリが充実、日本語ドキュメント
- **デメリット**: Reactよりコミュニティが小さい
- **向いている**: 小〜中規模アプリ、個人開発

どちらも優れたフレームワークです。チームのスキルセットやプロジェクトの要件に応じて選択してください。

---

### Q20. フレームワークを後から変更できますか？

**A**: 基本的には変更は推奨しません。setup.shで最初に選択したフレームワークを使い続けてください。

どうしても変更したい場合は、新しいプロジェクトを作成してコードを移植することを推奨します。

---

## その他

### Q21. サンプルページ（Login、Dashboard）を削除しても良いですか？

**A**: プロジェクトが十分に成熟した後は削除しても構いません。ただし、以下の理由から残しておくことを推奨します：

- 新しいページを追加する際の参考になる
- エラーハンドリング、バリデーション、ローディング状態の実装例
- Claude Codeが自然にパターンを踏襲できるお手本

---

### Q22. Claude Codeスキルが使えません

**A**: 以下を確認してください：

1. **`.claude/skills/`ディレクトリが存在するか**:
   ```bash
   ls -la .claude/skills/
   ```

2. **SKILL.mdファイルが存在するか**:
   ```bash
   ls .claude/skills/add-page/
   # SKILL.md
   ```

3. **Claude Codeで正しく認識されているか**:
   - Claude Codeのスキル一覧で確認

---

### Q23. プロジェクトをチームで使う場合の注意点は？

**A**: 以下を推奨します：

1. **CLAUDE.mdを読む**: チーム全員がCLAUDE.mdを読んで、プロジェクトのガイドラインを理解する
2. **Claude Codeスキルを活用**: 一貫した品質を保つためにスキルを使用
3. **コードレビュー**: レビュー前チェックリストを使用
4. **ドキュメントを更新**: プロジェクト固有のルールがあれば、docsに追記

---

### Q24. このボイラープレートはどのようなプロジェクトに向いていますか？

**A**: 以下のようなプロジェクトに向いています：

- **POC（概念実証）**: 素早くプロトタイプを作成
- **新規開発案件**: 初期セットアップの時間を削減
- **チーム開発**: 一貫した品質を保つ
- **学習目的**: ベストプラクティスを学ぶ

---

## まとめ

このFAQで解決しない問題がある場合は、以下のドキュメントを参照してください：

- [SETUP.md](SETUP.md) - 開発環境セットアップ
- [CODING_STANDARDS.md](CODING_STANDARDS.md) - コーディング規約
- [ARCHITECTURE.md](ARCHITECTURE.md) - アーキテクチャ設計
- [API_INTEGRATION.md](API_INTEGRATION.md) - API連携

また、GitHubのissueで質問することもできます。
