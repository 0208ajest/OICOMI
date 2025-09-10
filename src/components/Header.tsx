import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { User, Task } from '@/types';
import { formatDate, formatTimeOnly } from '@/lib/utils';
import { signIn, signOutUser } from '@/lib/firebase-storage';
import { toast } from 'sonner';
import { LogOut, User as UserIcon } from 'lucide-react';
import { CompletedTasksModal } from './CompletedTasksModal';

interface HeaderProps {
  user: User | null;
  onUserChange: (user: User | null) => void;
  tasks: Task[];
  onRestoreTask: (taskId: string) => void;
  onShowLogin: () => void;
}

export function Header({ user, onUserChange, tasks, onRestoreTask, onShowLogin }: HeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCompletedTasksModalOpen, setIsCompletedTasksModalOpen] = useState(false);

  // 時計の更新
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    try {
      await signOutUser();
      onUserChange(null);
      toast.info('ログアウトしました');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('ログアウトに失敗しました');
    }
  };


  // 完了したタスクを取得
  const completedTasks = tasks.filter(task => task.isCompleted);

  const handleLogoClick = () => {
    setIsCompletedTasksModalOpen(true);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-gray-800">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* 左側: ロゴ + サービス名 */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleLogoClick}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-lg gradient-blue flex items-center justify-center">
              <span className="text-white font-bold text-sm">O</span>
            </div>
            <span className="text-xl font-light text-white">OICOMI</span>
          </button>
        </div>

        {/* 中央: デジタル時計 */}
        <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
          <div className="text-blue-400 opacity-70 font-mono text-sm">
            <div>{formatDate(currentTime)}</div>
            <div className="text-lg font-semibold">{formatTimeOnly(currentTime)}</div>
          </div>
        </div>

        {/* 右側: ユーザー情報 or ログインボタン */}
        <div className="flex items-center space-x-2">
          {user ? (
            <div className="flex items-center space-x-2">
              {user.isLoggedIn ? (
                <>
                  <div className="flex items-center space-x-2 text-sm text-gray-300">
                    <UserIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">{user.email}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-gray-400 hover:text-white"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">ゲストモード</span>
                  <Button variant="outline" size="sm" onClick={onShowLogin}>
                    ログイン
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={onShowLogin}
            >
              ログイン
            </Button>
          )}
        </div>
      </div>

      {/* 完了タスクモーダル */}
      <CompletedTasksModal
        isOpen={isCompletedTasksModalOpen}
        onClose={() => setIsCompletedTasksModalOpen(false)}
        completedTasks={completedTasks}
        onRestoreTask={onRestoreTask}
      />
    </header>
  );
}
