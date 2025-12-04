# 環境変数の設定

アプリを動作させるために、以下の環境変数を設定してください。

## 1. `.env.local` ファイルを作成

プロジェクトのルートディレクトリに `.env.local` ファイルを作成し、以下の内容を記述してください：

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## 2. Supabaseの設定値を取得

1. [Supabase](https://supabase.com/) にログイン
2. プロジェクトを選択（または新規作成）
3. Settings > API に移動
4. 以下の値をコピー：
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 3. Supabaseのテーブル作成

Supabaseのダッシュボードで以下のSQLを実行してテーブルを作成してください：

```sql
-- 既存テーブルがあれば削除
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS exam_results;

-- 問題マスタテーブル（CSVのカラム名に対応）
CREATE TABLE questions (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "作成テーマ" TEXT,
  "カテゴリ" TEXT NOT NULL CHECK ("カテゴリ" IN ('知識', '防災', '生活', '文化')),
  "問題" TEXT NOT NULL,
  "選択肢A" TEXT NOT NULL,
  "選択肢B" TEXT NOT NULL,
  "選択肢C" TEXT NOT NULL,
  "選択肢D" TEXT NOT NULL,
  "正解" TEXT NOT NULL CHECK ("正解" IN ('A', 'B', 'C', 'D')),
  "解説" TEXT,
  "対象級" TEXT,
  "義雄さんメモ" TEXT
);

-- 成績データテーブル
CREATE TABLE exam_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_name TEXT NOT NULL,
  score SMALLINT NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックス（ランキング表示用）
CREATE INDEX idx_exam_results_score ON exam_results(score DESC);
CREATE INDEX idx_exam_results_created_at ON exam_results(created_at DESC);
```

## 4. 問題データのインポート

1. SupabaseのダッシュボードでTable Editorを開く
2. questionsテーブルを選択
3. 「Import data from CSV」をクリック
4. `検定問題分野分け - まとめ.csv` ファイルをアップロード

