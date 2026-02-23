#!/bin/bash

#################################################################
# フロントエンドボイラープレート初期化スクリプト
#
# このスクリプトは、フロントエンドプロジェクトを対話的に初期化します。
# - プロジェクト名の設定
# - フレームワーク選択（React / Vue 3）
# - 状態管理ライブラリ選択
# - パッケージマネージャー選択
# - .env ファイル生成
# - 不要ファイルの削除
# - 依存関係のインストール
#################################################################

set -e  # エラー時に即座に終了

echo "🚀 Frontend Boilerplate Setup"
echo ""

# 1. プロジェクト名
read -p "Enter project name [my-frontend-app]: " PROJECT_NAME
PROJECT_NAME=${PROJECT_NAME:-my-frontend-app}

# 2. フレームワーク選択
echo ""
echo "Select framework:"
echo "  1) React 18 (推奨)"
echo "  2) Vue 3"
read -p "Enter choice [1]: " FRAMEWORK_CHOICE
FRAMEWORK_CHOICE=${FRAMEWORK_CHOICE:-1}

case $FRAMEWORK_CHOICE in
    1) FRAMEWORK="react" ;;
    2) FRAMEWORK="vue" ;;
    *) echo "Invalid choice, using React"; FRAMEWORK="react" ;;
esac

echo "✅ Selected: $FRAMEWORK"

# 3. 状態管理ライブラリ（フレームワークに応じて固定）
if [ "$FRAMEWORK" == "react" ]; then
    STATE_LIBRARY="zustand"
    echo "✅ State management: Zustand"
else
    STATE_LIBRARY="pinia"
    echo "✅ State management: Pinia"
fi

# 4. サーバー状態管理（固定）
SERVER_STATE="tanstack-query"
echo "✅ Server state: TanStack Query"

# 5. パッケージマネージャー選択
echo ""
echo "Select package manager:"
echo "  1) npm"
echo "  2) pnpm (推奨、高速)"
echo "  3) yarn"
read -p "Enter choice [2]: " PKG_CHOICE
PKG_CHOICE=${PKG_CHOICE:-2}

case $PKG_CHOICE in
    1) PKG_MANAGER="npm" ;;
    2) PKG_MANAGER="pnpm" ;;
    3) PKG_MANAGER="yarn" ;;
    *) echo "Invalid choice, using pnpm"; PKG_MANAGER="pnpm" ;;
esac

echo "✅ Package manager: $PKG_MANAGER"

# 6. バックエンドAPIのURL
echo ""
read -p "Backend API URL [http://localhost:8000]: " API_URL
API_URL=${API_URL:-http://localhost:8000}

# .envファイル生成
echo ""
echo "✅ Creating .env file"
cat > .env <<EOF
VITE_API_URL=$API_URL
VITE_APP_NAME=$PROJECT_NAME
EOF

# ファイル生成・削除ロジック
echo ""
echo "📦 Setting up project structure..."

# フレームワークに応じた処理
if [ "$FRAMEWORK" == "react" ]; then
    echo "   Setting up React..."

    # src-react/ と src-shared/ を src/ にマージ
    mv src-shared src
    cp -r src-react/* src/ 2>/dev/null || true

    # Vueファイルを削除
    rm -rf src-vue

    # package.jsonを生成（Reactテンプレートから）
    cp package-template-react.json package.json

    # vite.config.tsをコピー
    cp src-react/vite.config.ts .

    # index.htmlのsrcを更新
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' 's|/src/main.tsx|/src/main.tsx|g' index.html
    else
        sed -i 's|/src/main.tsx|/src/main.tsx|g' index.html
    fi

    # Vueルーター削除
    rm -rf src-router-vue

    # Reactルーターをリネーム
    mv src-router-react src/router

    # React用ストア削除（Zustand以外）
    rm -rf src-stores-jotai src-stores-redux 2>/dev/null || true

    # Zustandストアをリネーム
    mv src-stores-zustand src/stores

    # Vue用ストア削除
    rm -rf src-stores-pinia

    # src-reactディレクトリ削除
    rm -rf src-react

else
    echo "   Setting up Vue 3..."

    # src-vue/ と src-shared/ を src/ にマージ
    mv src-shared src
    cp -r src-vue/* src/ 2>/dev/null || true

    # Reactファイルを削除
    rm -rf src-react

    # package.jsonを生成（Vueテンプレートから）
    cp package-template-vue.json package.json

    # vite.config.tsをコピー
    cp src-vue/vite.config.ts .

    # index.htmlのsrcを更新
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' 's|/src/main.tsx|/src/main.ts|g' index.html
    else
        sed -i 's|/src/main.tsx|/src/main.ts|g' index.html
    fi

    # Reactルーター削除
    rm -rf src-router-react

    # Vueルーターをリネーム
    mv src-router-vue src/router

    # Piniaストアをリネーム
    mv src-stores-pinia src/stores

    # React用ストア削除
    rm -rf src-stores-zustand src-stores-jotai src-stores-redux

    # src-vueディレクトリ削除
    rm -rf src-vue
fi

# package.jsonにプロジェクト名を反映
if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s/\"name\": \"frontend-boilerplate\"/\"name\": \"$PROJECT_NAME\"/g" package.json
else
    sed -i "s/\"name\": \"frontend-boilerplate\"/\"name\": \"$PROJECT_NAME\"/g" package.json
fi

# テンプレートファイルを削除
rm -f package-template-react.json package-template-vue.json

# パッケージマネージャーのインストール確認
echo ""
echo "📦 Checking package manager..."

case $PKG_MANAGER in
    pnpm)
        if ! command -v pnpm &> /dev/null; then
            echo "   pnpm not found. Installing..."
            npm install -g pnpm
        fi
        ;;
    yarn)
        if ! command -v yarn &> /dev/null; then
            echo "   yarn not found. Installing..."
            npm install -g yarn
        fi
        ;;
esac

# 依存関係のインストール
echo ""
echo "📦 Installing dependencies with $PKG_MANAGER..."
case $PKG_MANAGER in
    npm) npm install ;;
    pnpm) pnpm install ;;
    yarn) yarn install ;;
esac

# OpenAPI型定義の生成
echo ""
echo "📦 Generating API types from OpenAPI..."
echo "   (バックエンドが起動していない場合はスキップされます)"
if [ "$PKG_MANAGER" == "npm" ]; then
    npm run generate:api-types 2>/dev/null || echo "⚠️  Could not generate API types. Make sure backend is running at $API_URL"
elif [ "$PKG_MANAGER" == "pnpm" ]; then
    pnpm run generate:api-types 2>/dev/null || echo "⚠️  Could not generate API types. Make sure backend is running at $API_URL"
else
    yarn run generate:api-types 2>/dev/null || echo "⚠️  Could not generate API types. Make sure backend is running at $API_URL"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Summary:"
echo "   Project name: $PROJECT_NAME"
echo "   Framework: $FRAMEWORK"
echo "   State management: $STATE_LIBRARY"
echo "   Server state: $SERVER_STATE"
echo "   Package manager: $PKG_MANAGER"
echo "   Backend API: $API_URL"
echo ""
echo "📝 Next steps:"
echo "   1. バックエンドAPIを起動してください: $API_URL"
if [ "$PKG_MANAGER" == "npm" ]; then
    echo "   2. npm run dev"
elif [ "$PKG_MANAGER" == "pnpm" ]; then
    echo "   2. pnpm run dev"
else
    echo "   2. yarn run dev"
fi
echo "   3. ブラウザで http://localhost:5173 を開いてください"
echo ""
echo "Happy coding! 🚀"
