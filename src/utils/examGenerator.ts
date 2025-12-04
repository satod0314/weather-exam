import type { Question } from '@/types/database'

/**
 * Fisher-Yatesシャッフルアルゴリズム
 * 配列をランダムに並び替える
 */
const shuffle = <T>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * 試験問題を生成する
 * 配分: 知識50問、防災25問、生活15問、文化10問（合計100問）
 * カテゴリ順は固定（知識→防災→生活→文化）、各カテゴリ内はランダム
 */
export const generateExamQuestions = (allQuestions: Question[]): Question[] => {
  // 1. カテゴリごとにデータを分割
  const knowledge = allQuestions.filter(q => q.category === '知識')
  const disaster = allQuestions.filter(q => q.category === '防災')
  const life = allQuestions.filter(q => q.category === '生活')
  const culture = allQuestions.filter(q => q.category === '文化')

  // 2. 規定数ピックアップして結合
  // 配分: 知識50, 防災25, 生活15, 文化10
  const examSet = [
    ...shuffle(knowledge).slice(0, 50),
    ...shuffle(disaster).slice(0, 25),
    ...shuffle(life).slice(0, 15),
    ...shuffle(culture).slice(0, 10),
  ]

  return examSet // 合計100問の配列
}

/**
 * 現在の問題がどのカテゴリに属するかを取得
 */
export const getCurrentCategory = (questionIndex: number): string => {
  if (questionIndex < 50) return '知識編'
  if (questionIndex < 75) return '防災編'
  if (questionIndex < 90) return '生活編'
  return '文化編'
}

/**
 * スコアを計算する
 */
export const calculateScore = (
  questions: Question[],
  answers: Map<number, 'A' | 'B' | 'C' | 'D' | null>
): number => {
  let score = 0
  questions.forEach(question => {
    const userAnswer = answers.get(question.id)
    if (userAnswer === question.correct_answer) {
      score++
    }
  })
  return score
}

/**
 * 合格判定（70点以上で合格）
 */
export const isPassed = (score: number): boolean => {
  return score >= 70
}

