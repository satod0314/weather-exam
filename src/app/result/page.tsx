'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { Question, ExamResultDetails } from '@/types/database'

type ExamResultData = {
  questions: Question[]
  answers: Record<string, 'A' | 'B' | 'C' | 'D' | null>
  timeSpent: number
}

// 紙吹雪コンポーネント
function Confetti() {
  const colors = ['#fbbf24', '#f97316', '#22c55e', '#3b82f6', '#a855f7', '#ec4899']
  const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 3,
    color: colors[Math.floor(Math.random() * colors.length)],
    size: Math.random() * 10 + 5,
  }))

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confettiPieces.map((piece) => (
        <div
          key={piece.id}
          className="confetti"
          style={{
            left: `${piece.left}%`,
            backgroundColor: piece.color,
            width: piece.size,
            height: piece.size,
            animationDelay: `${piece.delay}s`,
            borderRadius: Math.random() > 0.5 ? '50%' : '0',
          }}
        />
      ))}
    </div>
  )
}

export default function Result() {
  const router = useRouter()
  const [resultData, setResultData] = useState<ExamResultData | null>(null)
  const [userName, setUserName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set())

  useEffect(() => {
    const data = sessionStorage.getItem('examResult')
    if (!data) {
      router.push('/')
      return
    }

    const parsed = JSON.parse(data) as ExamResultData
    setResultData(parsed)

    // 合格なら紙吹雪を表示
    const score = calculateScore(parsed)
    if (score >= 70) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 5000)
    }
  }, [router])

  const calculateScore = (data: ExamResultData) => {
    let correct = 0
    data.questions.forEach((q) => {
      const userAnswer = data.answers[q.id]
      if (userAnswer === q.correctAnswer) {
        correct++
      }
    })
    return correct
  }

  const handleSubmit = async () => {
    if (!resultData || !userName.trim()) return

    setIsSubmitting(true)
    try {
      const score = calculateScore(resultData)
      const details: ExamResultDetails = {
        answers: resultData.questions.map((q) => ({
          questionId: q.id,
          userAnswer: resultData.answers[q.id] || null,
          isCorrect: resultData.answers[q.id] === q.correctAnswer,
        })),
      }

      const { error } = await supabase
        .from('exam_results')
        .insert({
          user_name: userName.trim(),
          score,
          details,
        })

      if (error) throw error

      setIsSubmitted(true)
      // セッションストレージをクリア
      sessionStorage.removeItem('examResult')
    } catch (error) {
      console.error('結果保存エラー:', error)
      alert('結果の保存に失敗しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleQuestion = (index: number) => {
    const newExpanded = new Set(expandedQuestions)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedQuestions(newExpanded)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}分${secs}秒`
  }

  if (!resultData) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
      </main>
    )
  }

  const score = calculateScore(resultData)
  const isPassed = score >= 70
  const incorrectCount = resultData.questions.length - score

  return (
    <main className="min-h-screen py-8 px-4">
      {showConfetti && <Confetti />}
      
      <div className="max-w-3xl mx-auto">
        {/* 結果カード */}
        <div className="card mb-6 fade-in">
          <div className="text-center">
            {/* 合否表示 */}
            <div className={`text-6xl mb-4 ${isPassed ? 'animate-bounce' : ''}`}>
              {isPassed ? '🎉' : '😢'}
            </div>
            <h1 className={`text-3xl font-bold mb-2 ${isPassed ? 'text-green-600' : 'text-gray-600'}`}>
              {isPassed ? '合格！' : '不合格'}
            </h1>
            {isPassed && (
              <p className="text-green-600 font-medium mb-4">
                おめでとうございます！
              </p>
            )}

            {/* スコア表示 */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-6">
              <p className="text-sm text-gray-500 mb-1">あなたのスコア</p>
              <div className="flex items-baseline justify-center gap-1">
                <span className={`text-6xl font-bold ${isPassed ? 'text-green-600' : 'text-gray-700'}`}>
                  {score}
                </span>
                <span className="text-2xl text-gray-500">/ 100点</span>
              </div>
              <div className="mt-4 flex justify-center gap-6 text-sm">
                <div>
                  <span className="text-green-600 font-bold">{score}</span>
                  <span className="text-gray-500"> 正解</span>
                </div>
                <div>
                  <span className="text-red-500 font-bold">{incorrectCount}</span>
                  <span className="text-gray-500"> 不正解</span>
                </div>
                <div>
                  <span className="text-gray-600 font-bold">{formatTime(resultData.timeSpent)}</span>
                  <span className="text-gray-500"> 経過</span>
                </div>
              </div>
            </div>

            {/* 名前入力・登録 */}
            {!isSubmitted ? (
              <div className="bg-sky-50 rounded-xl p-5">
                <h2 className="font-bold text-sky-800 mb-3">📝 結果を登録する</h2>
                <p className="text-sm text-gray-600 mb-4">
                  ランキングに表示される名前を入力してください
                </p>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="名前を入力"
                    maxLength={20}
                    className="flex-1 px-4 py-3 border-2 border-sky-200 rounded-lg focus:border-sky-500 focus:outline-none"
                  />
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !userName.trim()}
                    className="btn-primary whitespace-nowrap"
                  >
                    {isSubmitting ? '登録中...' : '登録'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-green-50 rounded-xl p-5">
                <p className="text-green-800 font-medium">
                  ✅ 結果を登録しました！
                </p>
                <button
                  onClick={() => router.push('/')}
                  className="btn-primary mt-4"
                >
                  トップに戻る
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 解説リスト */}
        <div className="card fade-in" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            📚 解答・解説
          </h2>
          
          <div className="space-y-3">
            {resultData.questions.map((question, index) => {
              const userAnswer = resultData.answers[question.id]
              const isCorrect = userAnswer === question.correctAnswer
              const isExpanded = expandedQuestions.has(index)

              return (
                <div
                  key={question.id}
                  className={`rounded-xl border-2 overflow-hidden transition-all ${
                    isCorrect 
                      ? 'border-green-200 bg-green-50/50' 
                      : 'border-red-200 bg-red-50/50'
                  }`}
                >
                  {/* ヘッダー（クリックで展開） */}
                  <button
                    onClick={() => toggleQuestion(index)}
                    className="w-full px-4 py-3 flex items-center gap-3 text-left"
                  >
                    <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                      isCorrect ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                      {isCorrect ? '○' : '×'}
                    </span>
                    <span className="flex-1 font-medium text-gray-800 line-clamp-1">
                      Q{index + 1}. {question.question}
                    </span>
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* 詳細（展開時） */}
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-gray-200">
                      <div className="pt-4">
                        {/* 問題文 */}
                        <p className="text-gray-800 mb-4">{question.question}</p>

                        {/* 選択肢 */}
                        <div className="space-y-2 mb-4">
                          {(['A', 'B', 'C', 'D'] as const).map((opt) => {
                            const optionText = question[`option${opt}` as keyof Question]
                            const isUserAnswer = userAnswer === opt
                            const isCorrectAnswer = question.correctAnswer === opt

                            let bgClass = 'bg-white'
                            if (isCorrectAnswer) bgClass = 'bg-green-100 border-green-400'
                            else if (isUserAnswer && !isCorrectAnswer) bgClass = 'bg-red-100 border-red-400'

                            return (
                              <div
                                key={opt}
                                className={`flex items-center gap-2 p-2 rounded-lg border ${bgClass}`}
                              >
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                  isCorrectAnswer 
                                    ? 'bg-green-500 text-white' 
                                    : isUserAnswer 
                                      ? 'bg-red-500 text-white'
                                      : 'bg-gray-200 text-gray-600'
                                }`}>
                                  {opt}
                                </span>
                                <span className="flex-1 text-sm">{optionText as string}</span>
                                {isCorrectAnswer && (
                                  <span className="text-green-600 text-xs font-bold">正解</span>
                                )}
                                {isUserAnswer && !isCorrectAnswer && (
                                  <span className="text-red-600 text-xs font-bold">あなたの回答</span>
                                )}
                              </div>
                            )
                          })}
                        </div>

                        {/* 解説 */}
                        {question.explanation && (
                          <div className="bg-amber-50 rounded-lg p-3">
                            <p className="text-xs font-bold text-amber-800 mb-1">💡 解説</p>
                            <p className="text-sm text-amber-900">{question.explanation}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* トップに戻るボタン */}
        {!isSubmitted && (
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                sessionStorage.removeItem('examResult')
                router.push('/')
              }}
              className="btn-secondary"
            >
              登録せずにトップへ戻る
            </button>
          </div>
        )}
      </div>
    </main>
  )
}

