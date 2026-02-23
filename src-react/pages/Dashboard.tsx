import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/hooks/useAuth'
import { getCurrentUser } from '@/api/endpoints/users'

/**
 * ダッシュボード画面（React版）
 *
 * パターンを示す:
 * - 認証チェック（未認証時はログイン画面へリダイレクト）
 * - APIデータ取得（TanStack Query使用）
 * - ローディング・エラー表示
 * - サーバー状態管理の実例
 */

export default function Dashboard() {
  const navigate = useNavigate()
  const { token, clearAuth } = useAuth()

  // 認証チェック
  useEffect(() => {
    if (!token) {
      navigate('/login')
    }
  }, [token, navigate])

  // サーバー状態管理（TanStack Query）
  const { data, isLoading, error } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    enabled: !!token, // トークンがある場合のみ実行
  })

  const handleLogout = () => {
    clearAuth()
    navigate('/login')
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-gray-600">読み込み中...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-red-600">エラーが発生しました</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold">ダッシュボード</h1>
          <button
            onClick={handleLogout}
            className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            ログアウト
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">ユーザー情報</h2>
          <dl className="space-y-2">
            <div>
              <dt className="font-medium text-gray-600">メールアドレス</dt>
              <dd className="text-lg">{data?.email}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-600">ユーザーID</dt>
              <dd className="text-lg">{data?.id}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-600">アカウント状態</dt>
              <dd className="text-lg">
                {data?.is_active ? (
                  <span className="text-green-600">アクティブ</span>
                ) : (
                  <span className="text-red-600">非アクティブ</span>
                )}
              </dd>
            </div>
          </dl>
        </div>
      </main>
    </div>
  )
}
