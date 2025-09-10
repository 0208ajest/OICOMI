import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Task } from '@/types';
import { formatTime, truncateText } from '@/lib/utils';
import { 
  Play, 
  Check, 
  ArrowUp, 
  ExternalLink, 
  Plus, 
  X,
  Clock,
  Calendar
} from 'lucide-react';

interface TaskTimelineProps {
  tasks: Task[];
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onStartTimer: (task: Task) => void;
}

export function TaskTimeline({ tasks, onUpdateTask, onStartTimer }: TaskTimelineProps) {
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [newUrl, setNewUrl] = useState('');
  const [activeTimer, setActiveTimer] = useState<{ taskId: string; timeLeft: number; isPaused: boolean } | null>(null);

  // タイマーのカウントダウン
  useEffect(() => {
    if (activeTimer && activeTimer.timeLeft > 0 && !activeTimer.isPaused) {
      const timer = setInterval(() => {
        setActiveTimer(prev => {
          if (!prev) return null;
          const newTimeLeft = prev.timeLeft - 1;
          if (newTimeLeft <= 0) {
            // タイマー終了時の処理
            return null;
          }
          return { ...prev, timeLeft: newTimeLeft };
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [activeTimer]);

  // 未完了タスクのみを表示し、優先度と作成日時でソート
  const activeTasks = tasks
    .filter(task => !task.isCompleted)
    .sort((a, b) => {
      if (a.isPriority && !b.isPriority) return -1;
      if (!a.isPriority && b.isPriority) return 1;
      return a.createdAt.getTime() - b.createdAt.getTime();
    });

  const handleAddUrl = (taskId: string) => {
    if (!newUrl.trim()) return;
    
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      onUpdateTask(taskId, {
        urls: [...task.urls, newUrl.trim()]
      });
      setNewUrl('');
    }
  };

  const handleRemoveUrl = (taskId: string, urlIndex: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const newUrls = task.urls.filter((_, index) => index !== urlIndex);
      onUpdateTask(taskId, { urls: newUrls });
    }
  };

  const handleCompleteTask = (taskId: string) => {
    onUpdateTask(taskId, {
      isCompleted: true,
      completedAt: new Date()
    });
  };

  const handleSetPriority = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      onUpdateTask(taskId, { isPriority: !task.isPriority });
    }
  };

  const formatCreatedTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'たった今';
    if (minutes < 60) return `${minutes}分前`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}時間前`;
    return date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="mb-6">
      <Card className="bg-gray-900/50 border-gray-800">
        <CardContent className="p-0">
          <ScrollArea className="h-96">
            <div className="p-4 space-y-4">
              {activeTasks.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>タスクがありません</p>
                  <p className="text-sm">新しいタスクを追加してください</p>
                </div>
              ) : (
                activeTasks.map((task, index) => (
                  <div key={task.id} className="relative">
                    {/* タイムライン接続線 */}
                    {index > 0 && (
                      <div className="absolute -top-4 left-6 w-0.5 h-4 bg-gray-700" />
                    )}
                    
                    <Card 
                      className={`bg-gray-800/50 border-gray-700 transition-all duration-200 ${
                        task.isActive ? 'ring-1 ring-blue-400' : ''
                      } ${task.isPriority ? 'border-blue-400/50' : ''}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          {/* インジケーター */}
                          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                          
                          <div className="flex-1 min-w-0">
                            {/* タスクヘッダー */}
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <h3 className="text-white font-medium truncate">
                                  {task.title}
                                </h3>
                                {task.isPriority && (
                                  <span className="px-2 py-1 text-xs bg-blue-600 text-white rounded-full">
                                    優先
                                  </span>
                                )}
                              </div>
                              
                              {/* アクションボタン（右端） */}
                              <div className="flex items-center space-x-1">
                              <Button
                                size="icon"
                                onClick={() => {
                                  if (activeTimer && activeTimer.taskId === task.id) {
                                    // タイマーを一時停止/再開
                                    setActiveTimer(prev => {
                                      if (!prev) return null;
                                      return { ...prev, isPaused: !prev.isPaused };
                                    });
                                  } else {
                                    // タイマーを開始
                                    setActiveTimer({
                                      taskId: task.id,
                                      timeLeft: task.estimatedTime * 60, // 分を秒に変換
                                      isPaused: false
                                    });
                                    onStartTimer(task);
                                  }
                                }}
                                className={`h-6 w-6 ${
                                  activeTimer && activeTimer.taskId === task.id
                                    ? activeTimer.isPaused
                                      ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                                      : 'bg-red-600 hover:bg-red-700 text-white'
                                    : 'bg-green-600 hover:bg-green-700 text-white'
                                }`}
                              >
                                {activeTimer && activeTimer.taskId === task.id ? (
                                  activeTimer.isPaused ? (
                                    <Play className="w-3 h-3" />
                                  ) : (
                                    <X className="w-3 h-3" />
                                  )
                                ) : (
                                  <Play className="w-3 h-3" />
                                )}
                              </Button>
                                
                                <Button
                                  size="icon"
                                  onClick={() => handleCompleteTask(task.id)}
                                  className="h-6 w-6 bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                  <Check className="w-3 h-3" />
                                </Button>
                                
                                <Button
                                  size="icon"
                                  onClick={() => handleSetPriority(task.id)}
                                  className={`h-6 w-6 ${
                                    task.isPriority 
                                      ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                                  }`}
                                >
                                  <ArrowUp className="w-3 h-3" />
                                </Button>
                                
                                <Button
                                  size="icon"
                                  onClick={() => setExpandedTask(
                                    expandedTask === task.id ? null : task.id
                                  )}
                                  className="h-6 w-6 text-purple-400 hover:text-purple-300 hover:bg-purple-900/30"
                                >
                                  <Plus className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                            
                            {/* メタ情報 */}
                            <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{task.estimatedTime}分</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-3 h-3" />
                                <span>{formatCreatedTime(task.createdAt)}</span>
                              </div>
                              {/* タイマー表示 */}
                              {activeTimer && activeTimer.taskId === task.id && (
                                <div className={`flex items-center space-x-1 font-mono ${
                                  activeTimer.isPaused ? 'text-yellow-400' : 'text-green-400'
                                }`}>
                                  <Clock className="w-3 h-3" />
                                  <span className="text-lg font-bold">
                                    {formatTime(activeTimer.timeLeft)}
                                  </span>
                                  {activeTimer.isPaused && (
                                    <span className="text-xs text-yellow-400 ml-1">(一時停止)</span>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* URL一覧 */}
                            {task.urls.length > 0 && (
                              <div className="mb-3">
                                <div className="flex flex-wrap gap-2">
                                  {task.urls.map((url, urlIndex) => (
                                    <div
                                      key={urlIndex}
                                      className="flex items-center space-x-1 bg-gray-700 px-2 py-1 rounded text-xs"
                                    >
                                      <ExternalLink className="w-3 h-3" />
                                      <a
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-400 hover:text-blue-300 truncate max-w-32"
                                        title={url}
                                      >
                                        {truncateText(url, 30)}
                                      </a>
                                      <button
                                        onClick={() => handleRemoveUrl(task.id, urlIndex)}
                                        className="text-gray-400 hover:text-red-400"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* URL追加フォーム */}
                            {expandedTask === task.id && (
                              <div className="mb-3">
                                <div className="flex space-x-2">
                                  <Input
                                    type="url"
                                    placeholder="URLを入力..."
                                    value={newUrl}
                                    onChange={(e) => setNewUrl(e.target.value)}
                                    className="flex-1 bg-gray-700 border-gray-600 text-white text-sm"
                                    onKeyPress={(e) => {
                                      if (e.key === 'Enter') {
                                        handleAddUrl(task.id);
                                      }
                                    }}
                                  />
                                  <Button
                                    size="sm"
                                    onClick={() => handleAddUrl(task.id)}
                                    disabled={!newUrl.trim()}
                                    className="bg-blue-500 hover:bg-blue-600"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            )}

                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
