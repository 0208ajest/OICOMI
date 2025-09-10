# OICOMI - エリートビジネスサポートアプリ

洗練されたエリートビジネスマン向けのタスク管理アプリです。スケジュールを圧迫しないように日々の細かい作業タスクを登録し、タイムラインのようなUIで管理できます。

## 特徴

- **洗練されたデザイン**: 黒背景に白文字で集中を妨げないシンプルなUI
- **タイムライン管理**: タスクを時系列で視覚的に管理
- **タイマー機能**: ポモドーロテクニックを活用した集中作業
- **URL管理**: タスクに関連する資料リンクを複数保存
- **統計機能**: ログイン時は詳細な統計、ゲスト時は基本機能
- **メモ機能**: 一時的なメモを素早く記録

## 技術スタック

- **フレームワーク**: React 18 + TypeScript
- **スタイリング**: Tailwind CSS v4.0
- **UIコンポーネント**: shadcn/ui
- **アイコン**: Lucide React
- **通知**: Sonner
- **データ保存**: Firebase Firestore + localStorage（ゲストモード）

## セットアップ

### ローカル開発

1. 依存関係のインストール:
```bash
npm install
```

2. Firebase設定:
   - Firebase Consoleでプロジェクトを作成
   - Authentication と Firestore を有効化
   - `env.example` を `.env` にコピーしてFirebase設定を入力

3. 開発サーバーの起動:
```bash
npm run dev
```

4. ブラウザで `http://localhost:5174` にアクセス

### GitHub Pages + Firebase デプロイ

1. **Firebase設定**:
   - Firebase Consoleでプロジェクトを作成
   - Authentication を有効化（Email/Password認証）
   - Firestore Database を作成
   - セキュリティルールを設定:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId}/tasks/{taskId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       match /users/{userId}/memo {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```

2. **GitHub Pages設定**:
   - GitHubリポジトリの Settings > Pages に移動
   - Source を "GitHub Actions" に設定
   - 環境変数を設定（Repository secrets）:
     - `VITE_FIREBASE_API_KEY`
     - `VITE_FIREBASE_AUTH_DOMAIN`
     - `VITE_FIREBASE_PROJECT_ID`
     - `VITE_FIREBASE_STORAGE_BUCKET`
     - `VITE_FIREBASE_MESSAGING_SENDER_ID`
     - `VITE_FIREBASE_APP_ID`

3. **デプロイ**:
   ```bash
   npm run deploy
   ```
   または、mainブランチにプッシュすると自動デプロイされます。

4. **アクセス**: `https://0208ajest.github.io/OICOMI`

### Vercel + Firebase デプロイ（代替案）

1. **Firebase設定**:
   - Firebase Consoleでプロジェクトを作成
   - Authentication を有効化（Email/Password認証）
   - Firestore Database を作成
   - セキュリティルールを設定:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId}/{document=**} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```

2. **Vercelデプロイ**:
   - GitHubにリポジトリをプッシュ
   - Vercelでプロジェクトをインポート
   - 環境変数を設定:
     - `VITE_FIREBASE_API_KEY`
     - `VITE_FIREBASE_AUTH_DOMAIN`
     - `VITE_FIREBASE_PROJECT_ID`
     - `VITE_FIREBASE_STORAGE_BUCKET`
     - `VITE_FIREBASE_MESSAGING_SENDER_ID`
     - `VITE_FIREBASE_APP_ID`
   - デプロイ実行

## 使用方法

### ログイン
- メールアドレスとパスワードでFirebase Authenticationを使用したログイン
- ゲストモードでも基本機能は利用可能（ローカルストレージ使用）

### タスク管理
1. **タスクの追加**: 上部の入力欄にタスク名と想定時間を入力
2. **タスクの実行**: 「実行」ボタンでタイマーを開始
3. **タスクの完了**: 「完了」ボタンまたはタイマー終了時に完了
4. **優先設定**: 「優先」ボタンでタスクを最上位に移動
5. **URL追加**: 「+」ボタンでタスクに関連するリンクを追加

### タイマー機能
- タスクの想定時間でカウントダウン
- 完了時に5分間のブレイクタイム（スキップ可能）
- タイマー中は他のタスクは非アクティブ

### 統計機能
- **登録タスク数**: 全タスクの総数
- **今日完了数**: 本日完了したタスク数
- **今週完了数**: 今週完了したタスク数（日曜日起算）

### メモ機能
- 画面下部のメモ欄で一時的なメモを記録
- 自動保存機能付き

## ファイル構成

```
src/
├── components/          # Reactコンポーネント
│   ├── ui/             # shadcn/uiコンポーネント
│   ├── Header.tsx      # ヘッダー（ロゴ、時計、ユーザー情報）
│   ├── LoginScreen.tsx # ログイン画面
│   ├── StatsCards.tsx  # 統計カード
│   ├── TaskInput.tsx   # タスク入力フォーム
│   ├── TaskTimeline.tsx # タスクタイムライン
│   ├── TimerModal.tsx  # タイマーモーダル
│   └── MemoSection.tsx # メモセクション
├── lib/                # ユーティリティ関数
│   ├── utils.ts        # 汎用ユーティリティ
│   └── storage.ts      # localStorage操作
├── types/              # TypeScript型定義
│   └── index.ts        # データ型定義
├── App.tsx             # メインアプリケーション
└── main.tsx            # エントリーポイント
```

## データ構造

### User
```typescript
interface User {
  id: string;
  email: string;
  isLoggedIn: boolean;
}
```

### Task
```typescript
interface Task {
  id: string;
  title: string;
  estimatedTime: number; // 分
  urls: string[];
  isActive: boolean;
  isCompleted: boolean;
  createdAt: Date;
  completedAt?: Date;
  isPriority: boolean;
}
```

## カスタマイズ

### カラーパレット
`src/index.css` でカスタムCSS変数を定義:
- 背景色: `#000000` (黒)
- テキスト色: `#ffffff` (白)
- キーカラー: 淡いブルー系グラデーション

### ブレイクタイム
デフォルトは5分間。`TimerModal.tsx` の `timeLeft: 5 * 60` を変更して調整可能。

## ライセンス

MIT License

## 今後の拡張予定

- データ分析機能
- カテゴリ管理
- エクスポート機能
- キーボードショートカット
- ドラッグ&ドロップ
