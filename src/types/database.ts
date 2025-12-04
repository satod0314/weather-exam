export type Database = {
  public: {
    Tables: {
      questions: {
        Row: {
          id: number
          作成テーマ: string | null
          カテゴリ: '知識' | '防災' | '生活' | '文化'
          問題: string
          選択肢A: string
          選択肢B: string
          選択肢C: string
          選択肢D: string
          正解: 'A' | 'B' | 'C' | 'D'
          解説: string | null
          対象級: string | null
          義雄さんメモ: string | null
        }
        Insert: {
          id?: number
          作成テーマ?: string | null
          カテゴリ: '知識' | '防災' | '生活' | '文化'
          問題: string
          選択肢A: string
          選択肢B: string
          選択肢C: string
          選択肢D: string
          正解: 'A' | 'B' | 'C' | 'D'
          解説?: string | null
          対象級?: string | null
          義雄さんメモ?: string | null
        }
        Update: {
          id?: number
          作成テーマ?: string | null
          カテゴリ?: '知識' | '防災' | '生活' | '文化'
          問題?: string
          選択肢A?: string
          選択肢B?: string
          選択肢C?: string
          選択肢D?: string
          正解?: 'A' | 'B' | 'C' | 'D'
          解説?: string | null
          対象級?: string | null
          義雄さんメモ?: string | null
        }
      }
      exam_results: {
        Row: {
          id: string
          user_name: string
          score: number
          details: ExamResultDetails | null
          created_at: string
        }
        Insert: {
          id?: string
          user_name: string
          score: number
          details?: ExamResultDetails | null
          created_at?: string
        }
        Update: {
          id?: string
          user_name?: string
          score?: number
          details?: ExamResultDetails | null
          created_at?: string
        }
      }
    }
  }
}

// 問題の型（DBの生データ）
export type QuestionRow = Database['public']['Tables']['questions']['Row']

// アプリ内で使用する問題の型（英語プロパティ名）
export type Question = {
  id: number
  theme: string | null
  category: '知識' | '防災' | '生活' | '文化'
  question: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  correctAnswer: 'A' | 'B' | 'C' | 'D'
  explanation: string | null
}

// DBの生データをアプリ用に変換する関数
export const convertToQuestion = (row: QuestionRow): Question => ({
  id: row.id,
  theme: row.作成テーマ,
  category: row.カテゴリ,
  question: row.問題,
  optionA: row.選択肢A,
  optionB: row.選択肢B,
  optionC: row.選択肢C,
  optionD: row.選択肢D,
  correctAnswer: row.正解,
  explanation: row.解説,
})

// 試験結果の型
export type ExamResult = Database['public']['Tables']['exam_results']['Row']

// 試験結果の詳細（どの問題を間違えたか等）
export type ExamResultDetails = {
  answers: {
    questionId: number
    userAnswer: 'A' | 'B' | 'C' | 'D' | null
    isCorrect: boolean
  }[]
}

// カテゴリの型
export type Category = '知識' | '防災' | '生活' | '文化'

// 解答状態の型（試験中に使用）
export type AnswerState = {
  questionId: number
  selectedAnswer: 'A' | 'B' | 'C' | 'D' | null
}

