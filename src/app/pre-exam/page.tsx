'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function PreExam() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleStart = () => {
    setIsLoading(true)
    router.push('/exam')
  }

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* 戻るボタン */}
        <Link href="/" className="inline-flex items-center text-sky-600 hover:text-sky-800 mb-6">
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          トップに戻る
        </Link>

        {/* メインカード */}
        <div className="card fade-in">
          <div className="text-center mb-6">
            <div className="text-5xl mb-4">📋</div>
            <h1 className="text-2xl font-bold text-gray-800">
              試験前の確認
            </h1>
          </div>

          {/* 試験概要 */}
          <div className="bg-sky-50 rounded-xl p-5 mb-6">
            <h2 className="font-bold text-sky-800 mb-4 flex items-center gap-2">
              <span>📝</span> 試験概要
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-sky-500 mt-0.5">⏱️</span>
                <div>
                  <span className="font-medium">試験時間：</span>
                  <span className="font-bold text-sky-800">60分</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-sky-500 mt-0.5">📊</span>
                <div>
                  <span className="font-medium">問題数：</span>
                  <span className="font-bold text-sky-800">全100問</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-sky-500 mt-0.5">📚</span>
                <div>
                  <span className="font-medium">出題構成：</span>
                  <div className="mt-1 flex flex-wrap gap-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">知識 50問</span>
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">防災 25問</span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">生活 15問</span>
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">文化 10問</span>
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-sky-500 mt-0.5">🎯</span>
                <div>
                  <span className="font-medium">合格基準：</span>
                  <span className="font-bold text-green-600">70点以上</span>
                </div>
              </li>
            </ul>
          </div>

          {/* 注意事項 */}
          <div className="bg-amber-50 rounded-xl p-5 mb-8">
            <h2 className="font-bold text-amber-800 mb-4 flex items-center gap-2">
              <span>⚠️</span> 注意事項
            </h2>
            <ul className="space-y-2 text-amber-900 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-amber-500">•</span>
                <span>途中保存はできません。時間に余裕を持って挑戦してください。</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500">•</span>
                <span>制限時間（60分）を過ぎると自動的に採点されます。</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500">•</span>
                <span>未回答の問題は不正解として扱われます。</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500">•</span>
                <span>ブラウザの「戻る」ボタンや更新は使用しないでください。</span>
              </li>
            </ul>
          </div>

          {/* 開始ボタン */}
          <div className="space-y-4">
            <button
              onClick={handleStart}
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>読み込み中...</span>
                </>
              ) : (
                <>
                  <span>🚀</span>
                  <span>試験を始める</span>
                </>
              )}
            </button>
            
            <Link href="/">
              <button className="btn-secondary w-full">
                キャンセル
              </button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

