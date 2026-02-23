---
name: ui-review
description: UIコンポーネントのアクセシビリティ、Tailwind CSS使用、レスポンシブデザインをレビューするスキル
---

# /ui-review - UIレビュースキル

このスキルは、UIコンポーネントのアクセシビリティ、Tailwind CSSの適切な使用、レスポンシブデザインを自動的にレビューします。

## 使い方

```bash
# 全コンポーネントをレビュー
/ui-review

# 特定のコンポーネントをレビュー
/ui-review src/components/common/Button.tsx

# 特定のディレクトリをレビュー
/ui-review src/components/features/
```

## レビュー項目

### 1. アクセシビリティチェック

**目的**: WCAG 2.1レベルAA準拠を目指す

**チェック項目**:

- [ ] **aria-label**: ボタン、リンクに説明的なラベルがある
- [ ] **role属性**: 適切なARIAロールが設定されている
- [ ] **キーボードナビゲーション**: タブキーで操作できる
- [ ] **フォーカス表示**: フォーカス時に視覚的なインジケーターがある
- [ ] **alt属性**: 画像に代替テキストがある
- [ ] **セマンティックHTML**: `<button>`、`<nav>`、`<main>`等を適切に使用
- [ ] **カラーコントラスト**: 文字と背景のコントラスト比が4.5:1以上
- [ ] **エラーメッセージ**: フォームエラーがaria-describedbyで関連付けられている

**実装例**:

```tsx
// ❌ 悪い例
<div onClick={handleClick}>送信</div>

// ✅ 良い例
<button
  onClick={handleClick}
  aria-label="フォームを送信"
  className="focus:ring-2 focus:ring-blue-500"
>
  送信
</button>
```

### 2. Tailwind CSS使用チェック

**目的**: Tailwind CSSを適切に使用し、カスタムCSSを最小化

**チェック項目**:

- [ ] **ユーティリティクラス優先**: カスタムCSSではなくTailwindクラスを使用
- [ ] **レスポンシブプレフィックス**: `sm:`、`md:`、`lg:`を適切に使用
- [ ] **モバイルファースト**: 基本スタイルをモバイル向けに、大画面は`md:`以上で上書き
- [ ] **状態バリアント**: `hover:`、`focus:`、`active:`を使用
- [ ] **ダークモード**: `dark:`クラスでダークモード対応（オプション）
- [ ] **スペーシング**: `p-4`、`m-2`等の一貫したスペーシング
- [ ] **カラーパレット**: Tailwindのカラーパレットを使用（`blue-600`等）
- [ ] **カスタムCSS**: 最小限に抑える

**実装例**:

```tsx
// ❌ 悪い例
<button className="custom-button">
  送信
</button>
// custom-button { background: blue; padding: 10px; ... }

// ✅ 良い例
<button className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500">
  送信
</button>
```

### 3. レスポンシブデザインチェック

**目的**: あらゆる画面サイズで適切に表示される

**チェック項目**:

- [ ] **モバイルファースト**: 基本スタイルがモバイル向け
- [ ] **ブレークポイント**: `sm:`（640px）、`md:`（768px）、`lg:`（1024px）を適切に使用
- [ ] **フレキシブルレイアウト**: `flex`、`grid`を使用
- [ ] **相対サイズ**: `w-full`、`max-w-7xl`等の相対サイズを使用
- [ ] **画像レスポンシブ**: `w-full h-auto`で画像を最適化
- [ ] **テキスト**: `text-sm md:text-base lg:text-lg`で画面サイズに応じて調整
- [ ] **非表示/表示**: `hidden md:block`で画面サイズに応じて表示切り替え

**実装例**:

```tsx
// ❌ 悪い例
<div className="w-1/3">コンテンツ</div>

// ✅ 良い例（モバイルファースト）
<div className="w-full md:w-1/2 lg:w-1/3">
  コンテンツ
</div>
```

## 実行フロー

### 1. コンポーネントファイルの検出

対象ファイルを検出します：

```bash
# 全コンポーネントを検出
find src/components -name "*.tsx" -o -name "*.vue"

# 特定のディレクトリを検出
find src/components/common -name "*.tsx" -o -name "*.vue"
```

### 2. アクセシビリティチェック

各コンポーネントファイルを読み込み、以下をチェック：

**チェックロジック**:

- ボタン要素に`aria-label`または`aria-labelledby`がある
- インタラクティブ要素に`role`属性がある
- 画像に`alt`属性がある
- フォームに`label`要素がある
- フォーカススタイル（`focus:`クラス）がある

### 3. Tailwind CSSチェック

各コンポーネントファイルを読み込み、以下をチェック：

**チェックロジック**:

- `className`にTailwindクラスが使用されている
- カスタムCSSファイル（`.css`）のインポートが最小限
- レスポンシブプレフィックス（`sm:`、`md:`、`lg:`）が使用されている
- 状態バリアント（`hover:`、`focus:`）が使用されている

### 4. レスポンシブデザインチェック

各コンポーネントファイルを読み込み、以下をチェック：

**チェックロジック**:

- モバイルファーストのクラス順序（基本クラス → `md:` → `lg:`）
- `w-full`、`max-w-*`等の相対サイズが使用されている
- `flex`、`grid`でレイアウトが構築されている

### 5. レポート生成

マークダウン形式でレポートを生成します：

```markdown
# UIレビューレポート

## 概要

- **レビュー日時**: 2026-02-23 14:30:00
- **対象ファイル**: 12個
- **重大な問題**: 2個
- **警告**: 5個
- **情報**: 3個

---

## アクセシビリティ

### 🔴 重大な問題

#### src/components/common/Button.tsx:15

**問題**: ボタンにaria-labelがない

**現在のコード**:
```tsx
<button onClick={handleClick}>送信</button>
```

**修正案**:
```tsx
<button onClick={handleClick} aria-label="フォームを送信">
  送信
</button>
```

**理由**: スクリーンリーダーユーザーがボタンの目的を理解できない

---

### ⚠️ 警告

#### src/components/common/Input.tsx:20

**問題**: フォーカススタイルがない

**現在のコード**:
```tsx
<input className="border rounded px-4 py-2" />
```

**修正案**:
```tsx
<input className="border rounded px-4 py-2 focus:ring-2 focus:ring-blue-500" />
```

**理由**: キーボードナビゲーション時にフォーカスが分かりにくい

---

## Tailwind CSS

### 🔴 重大な問題

#### src/components/features/LoginForm.tsx:30

**問題**: カスタムCSSを使用している

**現在のコード**:
```tsx
import './LoginForm.css'
<div className="custom-card">...</div>
```

**修正案**:
```tsx
<div className="rounded-lg bg-white p-6 shadow">...</div>
```

**理由**: Tailwindのユーティリティクラスで十分実装可能

---

### ⚠️ 警告

#### src/components/common/Modal.tsx:40

**問題**: レスポンシブプレフィックスがない

**現在のコード**:
```tsx
<div className="w-1/2">...</div>
```

**修正案**:
```tsx
<div className="w-full md:w-1/2">...</div>
```

**理由**: モバイルで表示が崩れる可能性がある

---

## レスポンシブデザイン

### ⚠️ 警告

#### src/components/layout/Header.tsx:50

**問題**: モバイルファーストになっていない

**現在のコード**:
```tsx
<div className="flex lg:hidden md:flex sm:block">...</div>
```

**修正案**:
```tsx
<div className="block md:flex lg:hidden">...</div>
```

**理由**: 小さい画面から大きい画面の順でスタイルを上書きするのがモバイルファースト

---

## まとめ

### 重大な問題（2個）

1. src/components/common/Button.tsx:15 - aria-labelがない
2. src/components/features/LoginForm.tsx:30 - カスタムCSSを使用

### 警告（5個）

1. src/components/common/Input.tsx:20 - フォーカススタイルがない
2. src/components/common/Modal.tsx:40 - レスポンシブプレフィックスがない
3. src/components/layout/Header.tsx:50 - モバイルファーストになっていない
4. src/components/features/UserProfile.tsx:60 - 画像にalt属性がない
5. src/components/common/Card.tsx:70 - カラーコントラストが低い

### 推奨アクション

1. **重大な問題を優先的に修正**: aria-label、カスタムCSS削除
2. **警告を順次修正**: フォーカススタイル、レスポンシブ対応
3. **アクセシビリティテストを実施**: スクリーンリーダー、キーボードナビゲーション
4. **レスポンシブテストを実施**: 複数の画面サイズで表示確認
```

## 実装例

### 例1: Buttonコンポーネントのレビュー

**入力**:

```bash
/ui-review src/components/common/Button.tsx
```

**出力**:

```markdown
# UIレビューレポート - Button.tsx

## アクセシビリティ

### ✅ 合格

- aria-labelが設定されている
- フォーカススタイルがある
- ボタン要素を使用している

## Tailwind CSS

### ✅ 合格

- ユーティリティクラスを使用
- 状態バリアント（hover:、focus:）がある
- カスタムCSSなし

## レスポンシブデザイン

### ⚠️ 警告

#### 行42

**問題**: レスポンシブプレフィックスがない

**修正案**:
```tsx
<button className="w-full md:w-auto px-4 py-2">
  送信
</button>
```
```

### 例2: 全コンポーネントのレビュー

**入力**:

```bash
/ui-review
```

**出力**:

```markdown
# UIレビューレポート

## 概要

- **レビュー日時**: 2026-02-23 14:30:00
- **対象ファイル**: 12個
- **重大な問題**: 0個
- **警告**: 2個
- **情報**: 5個

## ファイル別結果

| ファイル | アクセシビリティ | Tailwind CSS | レスポンシブ |
|---------|----------------|-------------|-------------|
| Button.tsx | ✅ | ✅ | ⚠️ |
| Input.tsx | ✅ | ✅ | ✅ |
| Modal.tsx | ⚠️ | ✅ | ✅ |
| Header.tsx | ✅ | ✅ | ✅ |
| LoginForm.tsx | ✅ | ✅ | ✅ |
| Dashboard.tsx | ✅ | ✅ | ✅ |

## 推奨アクション

1. Modal.tsx: フォーカストラップを実装
2. Button.tsx: レスポンシブ対応
```

## アクセシビリティベストプラクティス

### 1. セマンティックHTML

```tsx
// ✅ 良い例
<nav>
  <ul>
    <li><a href="/home">ホーム</a></li>
  </ul>
</nav>

// ❌ 悪い例
<div className="nav">
  <div className="list">
    <div onClick={() => navigate('/home')}>ホーム</div>
  </div>
</div>
```

### 2. ARIA属性

```tsx
// ✅ 良い例
<button
  aria-label="メニューを開く"
  aria-expanded={isOpen}
  aria-controls="menu"
>
  <MenuIcon />
</button>

// ❌ 悪い例
<button onClick={toggle}>
  <MenuIcon />
</button>
```

### 3. キーボードナビゲーション

```tsx
// ✅ 良い例
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick()
    }
  }}
>
  クリック可能
</div>

// ❌ 悪い例
<div onClick={handleClick}>
  クリック可能
</div>
```

### 4. フォームラベル

```tsx
// ✅ 良い例
<label htmlFor="email" className="block text-sm font-medium">
  メールアドレス
</label>
<input
  id="email"
  type="email"
  aria-describedby="email-error"
  className="mt-1 block w-full rounded border px-3 py-2"
/>
<p id="email-error" className="mt-1 text-sm text-red-600">
  {errors.email}
</p>

// ❌ 悪い例
<input type="email" placeholder="メールアドレス" />
```

## Tailwind CSSベストプラクティス

### 1. モバイルファースト

```tsx
// ✅ 良い例
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* 内容 */}
</div>

// ❌ 悪い例
<div className="grid grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
  {/* 内容 */}
</div>
```

### 2. 状態バリアント

```tsx
// ✅ 良い例
<button className="bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 active:bg-blue-800 disabled:bg-gray-400">
  送信
</button>

// ❌ 悪い例
<button className="bg-blue-600">
  送信
</button>
```

### 3. ダークモード

```tsx
// ✅ 良い例
<div className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
  コンテンツ
</div>

// ❌ 悪い例
<div className="bg-white text-gray-900">
  コンテンツ
</div>
```

## レスポンシブデザインベストプラクティス

### 1. フレキシブルレイアウト

```tsx
// ✅ 良い例
<div className="flex flex-col md:flex-row gap-4">
  <div className="flex-1">左</div>
  <div className="flex-1">右</div>
</div>

// ❌ 悪い例
<div className="flex">
  <div className="w-1/2">左</div>
  <div className="w-1/2">右</div>
</div>
```

### 2. 画像レスポンシブ

```tsx
// ✅ 良い例
<img
  src="/image.jpg"
  alt="説明"
  className="h-auto w-full max-w-2xl"
/>

// ❌ 悪い例
<img src="/image.jpg" alt="説明" width="800" height="600" />
```

### 3. テキストサイズ

```tsx
// ✅ 良い例
<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
  見出し
</h1>

// ❌ 悪い例
<h1 className="text-4xl font-bold">
  見出し
</h1>
```

## まとめ

このスキルを使用することで、以下のメリットがあります：

1. **アクセシビリティ向上**: WCAG 2.1準拠、スクリーンリーダー対応
2. **一貫性**: Tailwind CSSの適切な使用パターン
3. **レスポンシブ**: あらゆる画面サイズで最適な表示
4. **品質統一**: チーム全体で一貫したUI品質

詳細な実装方法は、[CODING_STANDARDS.md](../../docs/CODING_STANDARDS.md)を参照してください。
