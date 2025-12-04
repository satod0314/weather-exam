'use client'

import Link from 'next/link'
import Ranking from '@/components/Ranking'

export default function Home() {
  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-8 fade-in">
          {/* 天気アイコン */}
          <div className="text-6xl mb-4">
            🌤️
          </div>
          
          {/* タイトル */}
          <h1 className="text-3xl md:text-4xl font-bold text-sky-800 mb-2">
            気象検定3級
          </h1>
          <p className="text-xl text-sky-600 font-medium">
            模擬試験
          </p>
        </div>

        {/* メインカード */}
        <div className="card mb-6 fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="text-center">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              試験概要
            </h2>
            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              <div className="bg-sky-50 rounded-lg p-3">
                <p className="text-sky-600 font-medium">試験時間</p>
                <p className="text-2xl font-bold text-sky-800">60分</p>
              </div>
              <div className="bg-sky-50 rounded-lg p-3">
                <p className="text-sky-600 font-medium">問題数</p>
                <p className="text-2xl font-bold text-sky-800">100問</p>
              </div>
            </div>
            
            <div className="bg-amber-50 rounded-lg p-4 mb-6">
              <p className="text-amber-800 font-medium mb-2">📝 出題カテゴリ</p>
              <div className="flex flex-wrap justify-center gap-2 text-sm">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">知識 50問</span>
                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full">防災 25問</span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">生活 15問</span>
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">文化 10問</span>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-3 mb-6">
              <p className="text-green-800">
                <span className="font-bold">70点以上</span>で合格です！
              </p>
            </div>

            <Link href="/pre-exam">
              <button className="btn-primary w-full text-lg">
                🚀 試験を開始する
              </button>
            </Link>
          </div>
        </div>

        {/* ランキング */}
        <div className="fade-in" style={{ animationDelay: '0.2s' }}>
          <Ranking />
        </div>

        {/* フッター */}
        <footer className="text-center mt-8 text-sm text-gray-500">
          <p>気象検定3級 模擬試験アプリ</p>
        </footer>
      </div>
    </main>
  )
}
