'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { generateExamQuestions, getCurrentCategory } from '@/utils/examGenerator'
import type { Question, QuestionRow } from '@/types/database'

// DBデータをアプリ用に変換
const convertQuestion = (row: QuestionRow): Question => ({
  id: row.id,
  theme: row.作成テーマ,
  category: row.カテゴリ,
  question: row.問題,
  optionA: row.選択肢A,
  optionB: row.選択肢B,
  optionC: row.選択肢C,
  optionD: row.選択肢D,
  correctAnswer: row.正解 as 'A' | 'B' | 'C' | 'D',
  explanation: row.解説,
})

type Answer = 'A' | 'B' | 'C' | 'D' | null

export default function Exam() {
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Map<number, Answer>>(new Map())
  const [timeLeft, setTimeLeft] = useState(60 * 60) // 60分 = 3600秒
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showQuitModal, setShowQuitModal] = useState(false)

  // 問題を取得
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { data, error } = await supabase
          .from('questions')
          .select('*')

        if (error) throw error

        if (!data || data.length === 0) {
          throw new Error('問題が見つかりません')
        }

        // DBデータを変換
        const convertedData = (data as QuestionRow[]).map(convertQuestion)
        
        // 試験問題を生成
        const examQuestions = generateExamQuestions(convertedData)
        setQuestions(examQuestions)
      } catch (err) {
        console.error('問題取得エラー:', err)
        setError('問題の読み込みに失敗しました')
      } finally {
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [])

  // タイマー
  useEffect(() => {
    if (loading || questions.length === 0) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          // 時間切れで自動終了
          handleFinish()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [loading, questions])

  // 終了処理
  const handleFinish = useCallback(() => {
    // 結果をsessionStorageに保存して結果ページへ
    const resultData = {
      questions,
      answers: Object.fromEntries(answers),
      timeSpent: 60 * 60 - timeLeft,
    }
    sessionStorage.setItem('examResult', JSON.stringify(resultData))
    router.push('/result')
  }, [questions, answers, timeLeft, router])

  // 解答選択
  const handleSelectAnswer = (answer: Answer) => {
    const newAnswers = new Map(answers)
    newAnswers.set(questions[currentIndex].id, answer)
    setAnswers(newAnswers)
  }

  // 前の問題へ
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  // 次の問題へ
  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  // 終了ボタン
  const handleEndClick = () => {
    const unansweredCount = questions.length - answers.size
    if (unansweredCount > 0) {
      setShowConfirmModal(true)
    } else {
      handleFinish()
    }
  }

  // 時間フォーマット
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // タイマーの色
  const getTimerClass = () => {
    if (timeLeft <= 60) return 'timer danger'
    if (timeLeft <= 300) return 'timer warning'
    return 'timer'
  }

  // カテゴリの色
  const getCategoryColor = (category: string) => {
    switch (category) {
      case '知識編': return 'bg-blue-100 text-blue-800'
      case '防災編': return 'bg-red-100 text-red-800'
      case '生活編': return 'bg-green-100 text-green-800'
      case '文化編': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4"></div>
          <p className="text-gray-600">問題を読み込んでいます...</p>
        </div>
      </main>
    )
  }

  if (error || questions.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="card text-center max-w-md">
          <div className="text-5xl mb-4">😢</div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">エラー</h1>
          <p className="text-gray-600 mb-6">{error || '問題の読み込みに失敗しました'}</p>
          <button 
            onClick={() => router.push('/')}
            className="btn-primary"
          >
            トップに戻る
          </button>
        </div>
      </main>
    )
  }

  const currentQuestion = questions[currentIndex]
  const currentAnswer = answers.get(currentQuestion.id)
  const progress = ((currentIndex + 1) / questions.length) * 100
  const answeredCount = answers.size

  return (
    <main className="min-h-screen pb-24">
      {/* ヘッダー */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-sm shadow-sm z-10">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            {/* タイマー */}
            <div className={`${getTimerClass()} text-2xl`}>
              ⏱️ {formatTime(timeLeft)}
            </div>
            
            {/* 中断ボタン */}
            <button
              onClick={() => setShowQuitModal(true)}
              className="px-3 py-1 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
            >
              中断する
            </button>
            
            {/* 進捗 */}
            <div className="text-right">
              <span className="text-lg font-bold text-sky-800">
                {currentIndex + 1}
              </span>
              <span className="text-gray-500"> / {questions.length}</span>
            </div>
          </div>
          
          {/* プログレスバー */}
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          
          {/* カテゴリ */}
          <div className="flex items-center justify-between mt-2">
            <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(getCurrentCategory(currentIndex))}`}>
              {getCurrentCategory(currentIndex)}
            </span>
            <span className="text-xs text-gray-500">
              回答済み: {answeredCount}/{questions.length}
            </span>
          </div>
        </div>
      </header>

      {/* 問題エリア */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="card slide-in" key={currentIndex}>
          {/* 問題文 */}
          <div className="mb-6">
            <p className="text-lg leading-relaxed text-gray-800">
              {currentQuestion.question}
            </p>
          </div>

          {/* 選択肢 */}
          <div className="space-y-3">
            {(['A', 'B', 'C', 'D'] as const).map((option) => {
              const optionText = currentQuestion[`option${option}` as keyof Question]
              const isSelected = currentAnswer === option
              
              return (
                <button
                  key={option}
                  onClick={() => handleSelectAnswer(option)}
                  className={`option-btn ${isSelected ? 'selected' : ''}`}
                >
                  <span className="option-label">{option}</span>
                  <span className="flex-1">{optionText as string}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* フッター（ナビゲーション） */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="btn-secondary flex items-center gap-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            戻る
          </button>

          {currentIndex === questions.length - 1 ? (
            <button
              onClick={handleEndClick}
              className="btn-primary flex-1 max-w-xs"
            >
              解答終了
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="btn-primary flex items-center gap-1"
            >
              次へ
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </footer>

      {/* 確認モーダル */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card max-w-sm w-full">
            <div className="text-center">
              <div className="text-4xl mb-4">⚠️</div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                未回答の問題があります
              </h2>
              <p className="text-gray-600 mb-6">
                まだ <span className="font-bold text-amber-600">{questions.length - answeredCount}問</span> が未回答です。<br />
                本当に終了しますか？
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="btn-secondary flex-1"
                >
                  戻る
                </button>
                <button
                  onClick={handleFinish}
                  className="btn-primary flex-1"
                >
                  終了する
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 中断確認モーダル */}
      {showQuitModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card max-w-sm w-full">
            <div className="text-center">
              <div className="text-4xl mb-4">🛑</div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                試験を中断しますか？
              </h2>
              <p className="text-gray-600 mb-4">
                現在 <span className="font-bold text-sky-600">{answeredCount}問</span> 回答済みです。
              </p>
              <p className="text-sm text-red-600 mb-6">
                ⚠️ 中断すると、未回答の <span className="font-bold">{questions.length - answeredCount}問</span> は<br />
                すべて不正解として採点されます。
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowQuitModal(false)}
                  className="btn-secondary flex-1"
                >
                  続ける
                </button>
                <button
                  onClick={handleFinish}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-xl font-semibold flex-1 transition-colors"
                >
                  中断して採点
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

