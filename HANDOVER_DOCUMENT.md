# OICOMI プロジェクト引き継ぎドキュメント

## 📋 プロジェクト概要

**OICOMI** - エリートビジネスマン向けタスク管理アプリケーション

### 基本コンセプト
- 洗練されたエリートビジネスマン向けのタスク管理システム
- スケジュールを圧迫しない日々の細かい作業タスクの登録・管理
- タイムライン形式のUIでタスクを視覚的に管理
- 集中力を妨げないシンプルで洗練されたデザイン

## 🎨 デザイン仕様

### カラーパレット
- **背景色**: 黒（`bg-black`）
- **テキスト色**: 白（`text-white`）
- **キーカラー**: 淡く光るブルー（`text-blue-400`, `bg-blue-600`）
- **アクセントカラー**: 
  - 緑（タイマー実行中）
  - 赤（タイマー停止）
  - 黄（タイマー一時停止）
  - オレンジ（復活ボタン）
  - パープル（URL追加ボタン）

### UI原則
- ボタンは小さくスマートに（`h-6 w-6`、`size="icon"`）
- 集中を妨げないシンプルなデザイン
- 洗練されたエリート向けの外観

## 🏗️ 技術スタック

### フロントエンド
- **React 18** + **TypeScript**
- **Vite** (ビルドツール)
- **Tailwind CSS v3.4.0** (スタイリング)
- **shadcn/ui** (UIコンポーネント)
- **Lucide React** (アイコン)

### バックエンド・データ管理
- **Firebase Authentication** (認証)
- **Firestore** (データベース)
- **localStorage** (ゲストユーザー用フォールバック)

### デプロイメント
- **Vercel** (フロントエンド)
- **Firebase** (バックエンド)

### その他
- **Sonner** (トースト通知)
- **React Hooks** (状態管理)

## 📁 プロジェクト構造

```
OICOMI/
├── src/
│   ├── components/
│   │   ├── ui/                    # shadcn/uiコンポーネント
│   │   ├── Header.tsx             # ヘッダー（ロゴ、時計、ユーザー情報）
│   │   ├── StatsCards.tsx         # 統計カード
│   │   ├── TaskInput.tsx          # タスク入力
│   │   ├── TaskTimeline.tsx       # タスクタイムライン
│   │   ├── TimerModal.tsx         # タイマーモーダル（現在未使用）
│   │   ├── MemoSection.tsx        # 一時メモ欄
│   │   ├── LoginScreen.tsx        # ログイン画面
│   │   └── CompletedTasksModal.tsx # 完了タスク一覧
│   ├── lib/
│   │   ├── firebase.ts            # Firebase設定
│   │   ├── firebase-storage.ts    # Firebase操作関数
│   │   ├── storage.ts             # localStorage操作（ゲスト用）
│   │   └── utils.ts               # ユーティリティ関数
│   ├── types/
│   │   └── index.ts               # TypeScript型定義
│   ├── App.tsx                    # メインアプリケーション
│   ├── main.tsx                   # エントリーポイント
│   └── index.css                  # グローバルスタイル
├── .gitignore                     # Git除外設定
├── env.example                    # 環境変数テンプレート
├── vercel.json                    # Vercel設定
└── README.md                      # プロジェクト説明
```

## 🔧 主要機能

### 1. 認証システム
- **Firebase Authentication** (メイン)
- **ゲストモード** (localStorage使用)
- ログイン状態に応じた機能制限

### 2. タスク管理
- **タイムライン表示**: 古いタスクが上、新しいタスクが下
- **優先度管理**: 「今すぐ」ボタンでタスクを最上位に移動
- **URL管理**: タスクに複数のURLを追加可能
- **完了・復活**: タスクの完了と復活機能

### 3. タイマー機能
- **タスク上表示**: ポップアップなし、タスク上でカウントダウン
- **一時停止・再開**: 再生ボタンで一時停止/再開切り替え
- **視覚的フィードバック**: 状態に応じた色変更

### 4. 統計表示
- **総タスク数**: 登録されたタスクの総数
- **今日完了**: 今日完了したタスク数
- **今週完了**: 今週完了したタスク数

### 5. 完了タスク管理
- **サービスロゴクリック**: 完了タスク一覧表示
- **復活機能**: 間違って完了したタスクを復活

## 🚨 重要な注意点

### 1. インポートエラーの修正履歴
**問題**: 以下のインポートエラーが発生していた
```
✘ [ERROR] No matching export in "src/lib/storage.ts" for import "generateId"
✘ [ERROR] No matching export in "src/lib/utils.ts" for import "saveUser"
```

**解決策**: 
- `generateId`は`src/lib/utils.ts`に配置
- `saveUser`/`clearUser`は`src/lib/storage.ts`に配置
- Firebase統合後は`firebase-storage.ts`の関数を使用

### 2. Tailwind CSS v4.0の問題
**問題**: PostCSSプラグインエラー
```
[postcss] It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin
```

**解決策**: 
- Tailwind CSS v3.4.0にダウングレード
- `postcss.config.js`と`tailwind.config.js`をv3.x形式に戻す
- `@tailwindcss/postcss`パッケージを削除

### 3. タイマー機能の実装
**問題**: タイマーが開始されない
**解決策**: 
- `App.tsx`の`handleStartTimer`で`saveTasks`ではなく`handleUpdateTask`を使用
- `TaskTimeline.tsx`で`activeTimer`状態を管理
- ポップアップを無効化し、タスク上でのみ表示

### 4. データ永続化の仕組み
- **ログインユーザー**: Firebase Firestore
- **ゲストユーザー**: localStorage
- **ハイブリッド方式**: 認証状態に応じて自動切り替え

## 🔄 開発フロー

### ローカル開発
```bash
npm run dev
# http://localhost:5173/ でアクセス
```

### デプロイメント
1. **GitHub**: コード管理
2. **Vercel**: フロントエンドデプロイ
3. **Firebase**: バックエンド・認証

### 環境変数設定
`.env`ファイルに以下を設定:
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## 📝 今後の改善点

### 1. 機能追加候補
- タスクの編集機能
- タスクの削除機能
- タスクのカテゴリ分類
- データエクスポート機能
- ダークモード/ライトモード切り替え

### 2. パフォーマンス改善
- タスク数の増加に対する最適化
- 無限スクロールの実装
- メモリ使用量の最適化

### 3. UX改善
- キーボードショートカット
- ドラッグ&ドロップでの優先度変更
- タスクの検索・フィルタリング

## 🐛 既知の問題

### 1. タイマーの状態管理
- ページリロード時にタイマー状態がリセットされる
- 複数タブでの同期問題

### 2. データ同期
- オフライン時の動作
- ネットワークエラー時の処理

## 📚 学習ポイント

### 1. Firebase統合
- 認証とFirestoreの連携
- ローカルストレージとのフォールバック
- リアルタイムデータ同期

### 2. React状態管理
- 複数コンポーネント間の状態共有
- カスタムフックの活用
- 副作用の適切な管理

### 3. TypeScript活用
- 型安全性の確保
- インターフェース設計
- ジェネリクスの活用

### 4. UI/UX設計
- アクセシビリティの考慮
- レスポンシブデザイン
- ユーザビリティテスト

## 🔗 関連リンク

- **GitHubリポジトリ**: https://github.com/0208ajest/OICOMI
- **Firebase Console**: https://console.firebase.google.com/
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Tailwind CSS**: https://tailwindcss.com/
- **shadcn/ui**: https://ui.shadcn.com/

## 📞 サポート情報

### 開発環境
- **Node.js**: v18以上推奨
- **npm**: v8以上推奨
- **ブラウザ**: Chrome, Firefox, Safari, Edge

### トラブルシューティング
1. **依存関係エラー**: `npm install`を実行
2. **ビルドエラー**: `npm run build`で確認
3. **Firebaseエラー**: 環境変数を確認
4. **スタイルエラー**: Tailwind CSSの設定を確認

---

**最終更新**: 2024年12月
**作成者**: AI Assistant
**プロジェクト状態**: 開発完了、GitHub連携済み
