import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Task } from '@/types';
import { formatDate } from '@/lib/utils';
import { CheckCircle, Clock, Calendar, ExternalLink, RotateCcw } from 'lucide-react';

interface CompletedTasksModalProps {
  isOpen: boolean;
  onClose: () => void;
  completedTasks: Task[];
  onRestoreTask: (taskId: string) => void;
}

export function CompletedTasksModal({ isOpen, onClose, completedTasks, onRestoreTask }: CompletedTasksModalProps) {
  const formatCompletedTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}日前`;
    if (hours > 0) return `${hours}時間前`;
    if (minutes > 0) return `${minutes}分前`;
    return 'たった今';
  };


  // 完了日時でソート（新しい順）
  const sortedTasks = [...completedTasks].sort((a, b) => {
    if (!a.completedAt || !b.completedAt) return 0;
    return b.completedAt.getTime() - a.completedAt.getTime();
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-800 max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span>完了したタスク</span>
            <span className="text-sm text-gray-400">({completedTasks.length}件)</span>
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            これまでに完了したタスクの一覧です
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-96">
          <div className="space-y-3">
            {sortedTasks.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>完了したタスクがありません</p>
                <p className="text-sm">タスクを完了するとここに表示されます</p>
              </div>
            ) : (
              sortedTasks.map((task) => (
                <Card key={task.id} className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        {/* タスクタイトル */}
                        <h3 className="text-white font-medium mb-2 line-clamp-2">
                          {task.title}
                        </h3>
                        
                        {/* メタ情報 */}
                        <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>想定: {task.estimatedTime}分</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>完了: {formatCompletedTime(task.completedAt!)}</span>
                          </div>
                        </div>

                        {/* URL一覧 */}
                        {task.urls.length > 0 && (
                          <div className="mb-3">
                            <div className="flex flex-wrap gap-2">
                              {task.urls.map((url, index) => (
                                <div
                                  key={index}
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
                                    {url.length > 30 ? `${url.substring(0, 30)}...` : url}
                                  </a>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 完了情報 */}
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <span>作成: {formatDate(task.createdAt)}</span>
                          </div>
                          {task.completedAt && (
                            <div className="flex items-center space-x-1">
                              <span>完了: {formatDate(task.completedAt)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* 復活ボタン */}
                      <div className="ml-3 flex-shrink-0">
                        <Button
                          size="icon"
                          onClick={() => onRestoreTask(task.id)}
                          className="h-8 w-8 bg-orange-600 hover:bg-orange-700 text-white"
                          title="タスクを復活させる"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
