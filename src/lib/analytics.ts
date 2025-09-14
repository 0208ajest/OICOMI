/**
 * Google Analytics 4 (GA4) ユーティリティ
 * ユーザーの行動を追跡し、データを送信するための関数群
 */

// GA4の型定義
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

/**
 * GA4イベントを送信する
 * @param eventName イベント名
 * @param parameters イベントパラメータ
 */
export function trackEvent(eventName: string, parameters?: Record<string, any>): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
    console.log('GA4 Event tracked:', eventName, parameters);
  }
}

/**
 * ページビューを追跡する
 * @param pageTitle ページタイトル
 * @param pagePath ページパス
 */
export function trackPageView(pageTitle: string, pagePath: string): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-J28LZVLY95', {
      page_title: pageTitle,
      page_location: window.location.href,
      page_path: pagePath,
    });
    console.log('GA4 Page view tracked:', pageTitle, pagePath);
  }
}

/**
 * ユーザープロパティを設定する
 * @param userId ユーザーID
 * @param userProperties ユーザープロパティ
 */
export function setUserProperties(userId: string, userProperties?: Record<string, any>): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-J28LZVLY95', {
      user_id: userId,
      custom_map: userProperties,
    });
    console.log('GA4 User properties set:', userId, userProperties);
  }
}

// アプリケーション固有のイベント追跡関数

/**
 * ログインイベントを追跡
 * @param method ログイン方法 ('email', 'email_register', 'email_login', 'google', 'guest', 'firebase')
 * @param userId ユーザーID
 */
export function trackLogin(method: 'email' | 'email_register' | 'email_login' | 'google' | 'guest' | 'firebase', userId?: string): void {
  trackEvent('login', {
    method: method,
    user_id: userId || 'guest',
    timestamp: new Date().toISOString(),
  });
}

/**
 * ログアウトイベントを追跡
 * @param userId ユーザーID
 */
export function trackLogout(userId?: string): void {
  trackEvent('logout', {
    user_id: userId || 'guest',
    timestamp: new Date().toISOString(),
  });
}

/**
 * タスク作成イベントを追跡
 * @param taskId タスクID
 * @param estimatedTime 想定時間（分）
 * @param userId ユーザーID
 */
export function trackTaskCreated(taskId: string, estimatedTime: number, userId?: string): void {
  trackEvent('task_created', {
    task_id: taskId,
    estimated_time: estimatedTime,
    user_id: userId || 'guest',
    timestamp: new Date().toISOString(),
  });
}

/**
 * タスク完了イベントを追跡
 * @param taskId タスクID
 * @param actualTime 実際の作業時間（分）
 * @param userId ユーザーID
 */
export function trackTaskCompleted(taskId: string, actualTime?: number, userId?: string): void {
  trackEvent('task_completed', {
    task_id: taskId,
    actual_time: actualTime,
    user_id: userId || 'guest',
    timestamp: new Date().toISOString(),
  });
}

/**
 * タスクタイマー開始イベントを追跡
 * @param taskId タスクID
 * @param estimatedTime 想定時間（分）
 * @param userId ユーザーID
 */
export function trackTimerStarted(taskId: string, estimatedTime: number, userId?: string): void {
  trackEvent('timer_started', {
    task_id: taskId,
    estimated_time: estimatedTime,
    user_id: userId || 'guest',
    timestamp: new Date().toISOString(),
  });
}

/**
 * タスク優先度設定イベントを追跡
 * @param taskId タスクID
 * @param isPriority 優先度フラグ
 * @param userId ユーザーID
 */
export function trackTaskPriority(taskId: string, isPriority: boolean, userId?: string): void {
  trackEvent('task_priority_set', {
    task_id: taskId,
    is_priority: isPriority,
    user_id: userId || 'guest',
    timestamp: new Date().toISOString(),
  });
}

/**
 * URL追加イベントを追跡
 * @param taskId タスクID
 * @param urlCount URLの数
 * @param userId ユーザーID
 */
export function trackUrlAdded(taskId: string, urlCount: number, userId?: string): void {
  trackEvent('url_added', {
    task_id: taskId,
    url_count: urlCount,
    user_id: userId || 'guest',
    timestamp: new Date().toISOString(),
  });
}

/**
 * メモ更新イベントを追跡
 * @param memoLength メモの文字数
 * @param userId ユーザーID
 */
export function trackMemoUpdated(memoLength: number, userId?: string): void {
  trackEvent('memo_updated', {
    memo_length: memoLength,
    user_id: userId || 'guest',
    timestamp: new Date().toISOString(),
  });
}

/**
 * 完了タスク一覧表示イベントを追跡
 * @param taskCount 完了タスク数
 * @param userId ユーザーID
 */
export function trackCompletedTasksViewed(taskCount: number, userId?: string): void {
  trackEvent('completed_tasks_viewed', {
    task_count: taskCount,
    user_id: userId || 'guest',
    timestamp: new Date().toISOString(),
  });
}

/**
 * タスク復元イベントを追跡
 * @param taskId タスクID
 * @param userId ユーザーID
 */
export function trackTaskRestored(taskId: string, userId?: string): void {
  trackEvent('task_restored', {
    task_id: taskId,
    user_id: userId || 'guest',
    timestamp: new Date().toISOString(),
  });
}

/**
 * グラフ表示切り替えイベントを追跡
 * @param viewMode 表示モード ('list', 'chart')
 * @param userId ユーザーID
 */
export function trackViewModeChanged(viewMode: 'list' | 'chart', userId?: string): void {
  trackEvent('view_mode_changed', {
    view_mode: viewMode,
    user_id: userId || 'guest',
    timestamp: new Date().toISOString(),
  });
}

/**
 * エラーイベントを追跡
 * @param errorType エラータイプ
 * @param errorMessage エラーメッセージ
 * @param userId ユーザーID
 */
export function trackError(errorType: string, errorMessage: string, userId?: string): void {
  trackEvent('error_occurred', {
    error_type: errorType,
    error_message: errorMessage,
    user_id: userId || 'guest',
    timestamp: new Date().toISOString(),
  });
}
