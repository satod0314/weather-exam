'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { ExamResult } from '@/types/database'

export default function Ranking() {
  const [results, setResults] = useState<ExamResult[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRanking()
  }, [])

  const fetchRanking = async () => {
    try {
      const { data, error } = await supabase
        .from('exam_results')
        .select('*')
        .order('score', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) throw error
      setResults(data || [])
    } catch (error) {
      console.error('ランキング取得エラー:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getRankEmoji = (index: number) => {
    switch (index) {
      case 0: return '🥇'
      case 1: return '🥈'
      case 2: return '🥉'
      default: return `${index + 1}`
    }
  }

  if (loading) {
    return (
      <div className="card">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          🏆 ランキング
        </h2>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
        </div>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="card">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          🏆 ランキング
        </h2>
        <p className="text-center py-8 text-gray-500">
          まだ記録がありません。<br />
          最初の挑戦者になりましょう！
        </p>
      </div>
    )
  }

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        🏆 ランキング TOP10
      </h2>
      <div className="space-y-2">
        {results.map((result, index) => (
          <div
            key={result.id}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
              index < 3 
                ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200' 
                : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <span className="text-xl w-8 text-center font-bold">
              {getRankEmoji(index)}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{result.user_name}</p>
              <p className="text-xs text-gray-500">{formatDate(result.created_at)}</p>
            </div>
            <div className="text-right">
              <span className={`text-xl font-bold ${
                result.score >= 70 ? 'text-green-600' : 'text-gray-600'
              }`}>
                {result.score}
              </span>
              <span className="text-sm text-gray-500">点</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

