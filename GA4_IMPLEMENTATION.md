# GA4（Google Analytics 4）実装ドキュメント

## 📊 実装概要

OICOMIアプリにGoogle Analytics 4（GA4）を統合し、ユーザーの行動を詳細に追跡できるようにしました。

## 🔧 実装内容

### 1. GA4スクリプトの追加
- **ファイル**: `index.html`
- **内容**: Google Tag ManagerスクリプトとGA4設定
- **測定ID**: `G-J28LZVLY95`

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-J28LZVLY95"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-J28LZVLY95');
</script>
```

### 2. Analyticsユーティリティライブラリの作成
- **ファイル**: `src/lib/analytics.ts`
- **機能**: GA4イベント送信のための包括的なユーティリティ関数群

#### 主要な関数
- `trackEvent()` - 汎用イベント送信
- `trackPageView()` - ページビュー追跡
- `setUserProperties()` - ユーザープロパティ設定
- `trackLogin()` - ログインイベント追跡
- `trackLogout()` - ログアウトイベント追跡
- `trackTaskCreated()` - タスク作成イベント追跡
- `trackTaskCompleted()` - タスク完了イベント追跡
- `trackTimerStarted()` - タイマー開始イベント追跡
- `trackTaskPriority()` - 優先度設定イベント追跡
- `trackUrlAdded()` - URL追加イベント追跡
- `trackMemoUpdated()` - メモ更新イベント追跡
- `trackCompletedTasksViewed()` - 完了タスク一覧表示イベント追跡
- `trackTaskRestored()` - タスク復元イベント追跡
- `trackViewModeChanged()` - 表示モード変更イベント追跡
- `trackError()` - エラーイベント追跡

### 3. 主要コンポーネントへの統合

#### App.tsx
- ページビュー追跡
- ユーザープロパティ設定
- タスク作成・完了・復元イベント
- タイマー開始イベント
- メモ更新イベント
- エラーイベント

#### LoginScreen.tsx
- ログインイベント（メール、Google、ゲスト）
- 認証エラーイベント

#### Header.tsx
- ログアウトイベント
- 完了タスク一覧表示イベント

#### TaskTimeline.tsx
- タスク優先度設定イベント
- URL追加イベント

#### CompletedTasksModal.tsx
- 表示モード変更イベント（一覧/グラフ）

## 📈 追跡されるイベント

### ユーザー認証
- `login` - ログイン（メール、Google、ゲスト）
- `logout` - ログアウト

### タスク管理
- `task_created` - タスク作成
- `task_completed` - タスク完了
- `task_restored` - タスク復元
- `task_priority_set` - 優先度設定
- `timer_started` - タイマー開始

### コンテンツ管理
- `url_added` - URL追加
- `memo_updated` - メモ更新

### ナビゲーション
- `completed_tasks_viewed` - 完了タスク一覧表示
- `view_mode_changed` - 表示モード変更

### エラー
- `error_occurred` - エラー発生

## 🎯 イベントパラメータ

各イベントには以下のパラメータが含まれます：

### 共通パラメータ
- `user_id` - ユーザーID（ゲストの場合は'guest'）
- `timestamp` - イベント発生時刻（ISO形式）

### タスク関連パラメータ
- `task_id` - タスクID
- `estimated_time` - 想定時間（分）
- `actual_time` - 実際の作業時間（分）
- `is_priority` - 優先度フラグ

### コンテンツ関連パラメータ
- `url_count` - URL数
- `memo_length` - メモの文字数
- `task_count` - 完了タスク数

### エラー関連パラメータ
- `error_type` - エラータイプ
- `error_message` - エラーメッセージ

## 🔍 データ分析の活用

### ユーザー行動分析
1. **ログイン方法の比較**
   - メール認証 vs Google認証 vs ゲストモードの利用率
   - 認証方法別の継続利用率

2. **タスク管理パターン**
   - 1日あたりのタスク作成数
   - タスク完了率
   - 優先度設定の頻度
   - タイマー使用率

3. **機能利用率**
   - URL追加機能の使用率
   - メモ機能の使用率
   - 完了タスク一覧の閲覧頻度
   - グラフ表示の利用率

### パフォーマンス分析
1. **エラー分析**
   - エラータイプ別の発生頻度
   - エラー発生時のユーザー行動
   - システムの安定性評価

2. **ユーザビリティ分析**
   - 機能別の利用パターン
   - ユーザーの操作フロー
   - 改善が必要な機能の特定

## 📊 GA4ダッシュボードでの確認方法

### 1. リアルタイムレポート
- **場所**: GA4 > レポート > リアルタイム
- **確認内容**: 現在のアクティブユーザー数、イベント発生状況

### 2. イベントレポート
- **場所**: GA4 > レポート > エンゲージメント > イベント
- **確認内容**: 各カスタムイベントの発生回数、パラメータ詳細

### 3. ユーザー属性レポート
- **場所**: GA4 > レポート > ユーザー属性
- **確認内容**: ログイン方法別のユーザー分布

### 4. カスタムレポートの作成
- **場所**: GA4 > エクスプローラー
- **作成可能**: タスク完了率、機能利用率などのカスタム分析

## 🚀 今後の拡張予定

### 1. 詳細なユーザーセグメント分析
- ログイン方法別の行動パターン
- 利用頻度別のユーザー分類

### 2. パフォーマンス指標の追加
- タスク完了時間の分析
- ユーザーの作業効率指標

### 3. エンゲージメント分析
- セッション時間の分析
- 機能別の滞在時間

### 4. A/Bテスト機能
- UI変更の効果測定
- 機能改善の効果検証

## 📝 注意事項

### プライバシー配慮
- ユーザーIDは匿名化されたFirebase UIDを使用
- 個人情報は追跡対象外
- ゲストモードのデータは完全に匿名

### データ保持期間
- GA4の標準データ保持期間（14ヶ月）に従う
- 必要に応じてデータ保持期間の調整が可能

### 開発環境でのテスト
- 開発環境ではGA4のデバッグモードを使用
- 本番環境と開発環境のデータは分離

## 🔗 関連リンク

- **GA4測定ID**: G-J28LZVLY95
- **本番URL**: https://0208ajest.github.io/OICOMI
- **GA4コンソール**: https://analytics.google.com/

---

この実装により、OICOMIアプリのユーザー行動を詳細に分析し、継続的な改善に活用できます。
