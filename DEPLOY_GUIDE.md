# デプロイ＆iOSアプリ化ガイド

## 📌 前提条件

- Node.js がインストールされていること
- Xcode がインストールされていること（iOS開発用）
- Apple Developer Program に登録していること（TestFlight用、年額$99）
- GitHubアカウントがあること

---

## 🌐 Part 1: Vercelへのデプロイ（Webアプリ公開）

### Step 1: GitHubリポジトリの作成

```bash
cd /Users/satodaisuke/WeatherExamination

# Gitリポジトリを初期化
git init
git add .
git commit -m "Initial commit: 気象検定3級アプリ"
```

### Step 2: GitHubにリポジトリを作成

1. https://github.com/new にアクセス
2. リポジトリ名: `weather-exam`（任意）
3. Private または Public を選択
4. 「Create repository」をクリック

### Step 3: GitHubにプッシュ

```bash
git remote add origin https://github.com/YOUR_USERNAME/weather-exam.git
git branch -M main
git push -u origin main
```

### Step 4: Vercelにデプロイ

1. https://vercel.com にアクセスしてログイン（GitHubアカウントで可）
2. 「Add New...」→「Project」をクリック
3. GitHubリポジトリ「weather-exam」をインポート
4. **Environment Variables（環境変数）を設定**:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://yduitzmfjkypckwmdmkx.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = あなたのanon key
5. 「Deploy」をクリック

✅ デプロイ完了後、`https://your-project.vercel.app` でアクセス可能になります。

---

## 📱 Part 2: iOSアプリ化（Capacitor）

### Step 1: 依存関係のインストール

```bash
cd /Users/satodaisuke/WeatherExamination
npm install
```

### Step 2: ビルドとiOSプロジェクト生成

```bash
# Next.jsをビルド（静的ファイル生成）
npm run build

# iOSプロジェクトを追加
npx cap add ios

# 変更を同期
npx cap sync ios
```

### Step 3: Xcodeで開く

```bash
npx cap open ios
```

### Step 4: Xcodeでの設定

Xcodeが開いたら：

1. **Signing & Capabilities** タブを開く
2. **Team** にあなたのApple Developer Team を選択
3. **Bundle Identifier** を確認（例: `com.weatherexam.app`）

### Step 5: シミュレーターでテスト

1. Xcode上部でシミュレーター（例: iPhone 15）を選択
2. ▶️ ボタンでビルド＆実行

---

## 🚀 Part 3: TestFlightへの配布

### 前提条件
- Apple Developer Program（$99/年）への登録が必要
- App Store Connect へのアクセス

### Step 1: App Store Connectでアプリを作成

1. https://appstoreconnect.apple.com にログイン
2. 「マイApp」→「+」→「新規App」
3. 以下を入力:
   - プラットフォーム: iOS
   - 名前: 気象検定3級
   - プライマリ言語: 日本語
   - バンドルID: `com.weatherexam.app`
   - SKU: `weather-exam-001`（任意のユニークID）

### Step 2: Xcodeでアーカイブ

1. Xcodeで **Product** → **Destination** → **Any iOS Device (arm64)** を選択
2. **Product** → **Archive** を実行
3. ビルドが完了するとOrganizerが開く

### Step 3: App Store Connectにアップロード

1. Organizerで作成したアーカイブを選択
2. 「Distribute App」をクリック
3. 「App Store Connect」を選択
4. 「Upload」を選択
5. 画面の指示に従ってアップロード

### Step 4: TestFlightでテスター招待

1. App Store Connectで該当アプリを選択
2. 「TestFlight」タブを開く
3. アップロードしたビルドが処理されるのを待つ（数分〜数十分）
4. 「内部テスター」または「外部テスター」を追加
   - 内部テスター: Apple Developer Teamのメンバー（最大100人）
   - 外部テスター: 一般ユーザー（最大10,000人、Apple審査が必要）
5. テスターにメールが送信され、TestFlightアプリからインストール可能に

---

## 📋 チェックリスト

### Vercelデプロイ
- [ ] GitHubリポジトリ作成
- [ ] コードをプッシュ
- [ ] Vercelプロジェクト作成
- [ ] 環境変数を設定
- [ ] デプロイ確認

### iOSアプリ
- [ ] `npm run build` 実行
- [ ] `npx cap add ios` 実行
- [ ] `npx cap sync ios` 実行
- [ ] Xcodeで開いてTeam設定
- [ ] シミュレーターでテスト

### TestFlight
- [ ] Apple Developer Program に登録
- [ ] App Store Connectでアプリ作成
- [ ] Xcodeでアーカイブ
- [ ] App Store Connectにアップロード
- [ ] TestFlightでテスター招待

---

## ⚠️ よくあるトラブル

### ビルドエラー: "No team selected"
→ Xcode の Signing & Capabilities で Team を選択してください

### アップロードエラー: "Invalid Bundle Identifier"
→ App Store Connect と Xcode の Bundle ID が一致しているか確認

### TestFlightで「処理中」のまま
→ 通常は数分〜30分で完了します。長時間続く場合はApp Store Connectを確認

---

## 🔄 アプリ更新時の手順

```bash
# コード変更後
npm run build
npx cap sync ios
npx cap open ios
# → Xcodeでアーカイブ＆アップロード
```

---

## 📞 参考リンク

- [Vercel Documentation](https://vercel.com/docs)
- [Capacitor iOS Documentation](https://capacitorjs.com/docs/ios)
- [App Store Connect Help](https://developer.apple.com/help/app-store-connect/)
- [TestFlight Guide](https://developer.apple.com/testflight/)

