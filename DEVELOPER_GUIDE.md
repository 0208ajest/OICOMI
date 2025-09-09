# OICOMI 開発者ガイド

## 🚀 クイックスタート

### 1. 環境セットアップ
```bash
# リポジトリのクローン
git clone https://github.com/0208ajest/OICOMI.git
cd OICOMI

# 依存関係のインストール
npm install

# 環境変数の設定
cp env.example .env
# .envファイルを編集してFirebase設定を追加

# 開発サーバーの起動
npm run dev
```

### 2. Firebase設定
1. Firebase Consoleでプロジェクトを作成
2. Authenticationを有効化（Email/Password）
3. Firestore Databaseを作成
4. 環境変数を`.env`に設定

### 3. 主要コマンド
```bash
npm run dev          # 開発サーバー起動
npm run build        # プロダクションビルド
npm run preview      # ビルド結果のプレビュー
npm run lint         # リンター実行
```

## 🏗️ アーキテクチャ

### コンポーネント階層
```
App.tsx
├── Header.tsx
│   └── CompletedTasksModal.tsx
├── StatsCards.tsx
├── TaskInput.tsx
├── TaskTimeline.tsx
├── MemoSection.tsx
└── TimerModal.tsx (未使用)
```

### 状態管理
- **App.tsx**: グローバル状態管理
- **各コンポーネント**: ローカル状態管理
- **Firebase**: データ永続化
- **localStorage**: ゲストユーザー用

## 🔧 主要機能の実装

### タイマー機能
```typescript
// TaskTimeline.tsx
const [activeTimer, setActiveTimer] = useState<{
  taskId: string;
  timeLeft: number;
  isPaused: boolean;
} | null>(null);

// カウントダウン処理
useEffect(() => {
  if (activeTimer && activeTimer.timeLeft > 0 && !activeTimer.isPaused) {
    const timer = setInterval(() => {
      setActiveTimer(prev => {
        if (!prev) return null;
        const newTimeLeft = prev.timeLeft - 1;
        if (newTimeLeft <= 0) return null;
        return { ...prev, timeLeft: newTimeLeft };
      });
    }, 1000);
    return () => clearInterval(timer);
  }
}, [activeTimer]);
```

### タスク復活機能
```typescript
// App.tsx
const handleRestoreTask = (taskId: string) => {
  handleUpdateTask(taskId, {
    isCompleted: false,
    completedAt: undefined,
    isActive: false,
  });
  toast.success('タスクを復活させました');
};
```

### Firebase統合
```typescript
// firebase-storage.ts
export const saveTask = async (task: Task) => {
  if (user?.isLoggedIn) {
    await setDoc(doc(db, 'tasks', task.id), task);
  } else {
    saveTaskLocal(task);
  }
};
```

## 🎨 スタイリングガイド

### カラーパレット
```css
/* メインカラー */
--bg-primary: #000000;      /* 黒背景 */
--text-primary: #ffffff;    /* 白テキスト */
--accent-blue: #60a5fa;     /* ブルーアクセント */

/* 状態カラー */
--success: #10b981;         /* 緑（実行中） */
--danger: #ef4444;          /* 赤（停止） */
--warning: #f59e0b;         /* 黄（一時停止） */
--info: #8b5cf6;            /* パープル（URL） */
```

### コンポーネントサイズ
```css
/* ボタンサイズ */
.btn-sm: h-6 w-6;           /* 小さいボタン */
.btn-md: h-8 w-8;           /* 中サイズボタン */
.btn-lg: h-10 w-10;         /* 大きいボタン */

/* アイコンサイズ */
.icon-sm: w-3 h-3;          /* 小さいアイコン */
.icon-md: w-4 h-4;          /* 中サイズアイコン */
.icon-lg: w-5 h-5;          /* 大きいアイコン */
```

## 🐛 デバッグガイド

### よくある問題

#### 1. インポートエラー
```bash
# エラー例
No matching export in "src/lib/storage.ts" for import "generateId"

# 解決策
# generateIdはsrc/lib/utils.tsにあります
import { generateId } from '@/lib/utils';
```

#### 2. Tailwind CSSエラー
```bash
# エラー例
[postcss] It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin

# 解決策
# Tailwind CSS v3.4.0を使用
npm install tailwindcss@^3.4.0
```

#### 3. Firebase認証エラー
```bash
# エラー例
Firebase: Error (auth/invalid-api-key)

# 解決策
# .envファイルの環境変数を確認
VITE_FIREBASE_API_KEY=your_api_key_here
```

### デバッグツール
```typescript
// コンソールログの追加
console.log('Debug info:', { tasks, user, activeTimer });

// React DevTools
// Chrome拡張機能でコンポーネント状態を確認

// Firebase Debug
// Firebase Consoleでデータベース状態を確認
```

## 📦 依存関係

### 主要パッケージ
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "firebase": "^10.14.1",
    "tailwindcss": "^3.4.0",
    "lucide-react": "^0.263.1",
    "sonner": "^1.2.4"
  }
}
```

### 開発依存関係
```json
{
  "devDependencies": {
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@vitejs/plugin-react": "^4.0.3",
    "typescript": "^5.0.2",
    "vite": "^4.4.5"
  }
}
```

## 🚀 デプロイメント

### Vercelデプロイ
1. GitHubリポジトリをVercelに接続
2. 環境変数をVercelダッシュボードで設定
3. 自動デプロイが有効化

### Firebase設定
```javascript
// vercel.json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## 🔒 セキュリティ

### Firebase Security Rules
```javascript
// Firestore Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tasks/{taskId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 環境変数
- `.env`ファイルはGitにコミットしない
- 本番環境ではVercelダッシュボードで設定
- APIキーは適切に管理

## 📊 パフォーマンス

### 最適化ポイント
1. **React.memo**: 不要な再レンダリングを防止
2. **useCallback**: 関数の再作成を防止
3. **useMemo**: 計算結果のキャッシュ
4. **Lazy Loading**: コンポーネントの遅延読み込み

### 監視項目
- バンドルサイズ
- 初回読み込み時間
- メモリ使用量
- Firebase API呼び出し回数

## 🧪 テスト

### テスト環境
```bash
# テスト実行
npm run test

# カバレッジ確認
npm run test:coverage
```

### テストケース例
```typescript
// タスク作成テスト
test('should create a new task', () => {
  const task = createTask('Test task', 30);
  expect(task.title).toBe('Test task');
  expect(task.estimatedTime).toBe(30);
});

// タイマー機能テスト
test('should start timer', () => {
  const { result } = renderHook(() => useTimer());
  act(() => {
    result.current.startTimer(60);
  });
  expect(result.current.isActive).toBe(true);
});
```

---

**更新日**: 2024年12月
**バージョン**: 1.0.0
**ステータス**: 開発完了
