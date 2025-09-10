import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Task, TimerState } from '@/types';
import { formatTime } from '@/lib/utils';
import { Play, Pause, Square, Check } from 'lucide-react';

interface TimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onCompleteTask: (taskId: string) => void;
  onStartBreak: () => void;
}

export function TimerModal({ 
  isOpen, 
  onClose, 
  task, 
  onCompleteTask, 
  onStartBreak 
}: TimerModalProps) {
  const [timerState, setTimerState] = useState<TimerState>({
    isRunning: false,
    timeLeft: 0,
    isBreak: false,
  });
  const [isCompleted, setIsCompleted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (task && isOpen) {
      setTimerState({
        isRunning: false,
        timeLeft: task.estimatedTime * 60, // 分を秒に変換
        taskId: task.id,
        isBreak: false,
      });
      setIsCompleted(false);
    }
  }, [task, isOpen]);

  useEffect(() => {
    if (timerState.isRunning && timerState.timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimerState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1,
        }));
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timerState.isRunning, timerState.timeLeft]);

  useEffect(() => {
    if (timerState.timeLeft === 0 && timerState.isRunning && !timerState.isBreak) {
      setTimerState(prev => ({ ...prev, isRunning: false }));
      setIsCompleted(true);
    }
  }, [timerState.timeLeft, timerState.isRunning, timerState.isBreak]);

  const handleStart = () => {
    setTimerState(prev => ({ ...prev, isRunning: true }));
  };

  const handlePause = () => {
    setTimerState(prev => ({ ...prev, isRunning: false }));
  };

  const handleStop = () => {
    setTimerState(prev => ({ ...prev, isRunning: false }));
    onClose();
  };

  const handleComplete = () => {
    if (task) {
      onCompleteTask(task.id);
      onStartBreak();
      onClose();
    }
  };

  const handleSkipBreak = () => {
    onClose();
  };

  const handleStartBreak = () => {
    setTimerState({
      isRunning: true,
      timeLeft: 5 * 60, // 5分のブレイク
      isBreak: true,
    });
    setIsCompleted(false);
  };

  if (!task) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-800 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white text-center">
            {timerState.isBreak ? 'ブレイクタイム' : 'タスクタイマー'}
          </DialogTitle>
          <DialogDescription className="text-gray-400 text-center">
            {timerState.isBreak 
              ? '少し休憩しましょう' 
              : task.title
            }
          </DialogDescription>
        </DialogHeader>

        <div className="text-center space-y-6">
          {/* タイマー表示 */}
          <div className="text-6xl font-mono text-blue-400 font-bold">
            {formatTime(timerState.timeLeft)}
          </div>

          {/* プログレスバー */}
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-1000 ${
                timerState.isBreak ? 'bg-yellow-500' : 'bg-blue-500'
              }`}
              style={{
                width: timerState.isBreak 
                  ? `${((5 * 60 - timerState.timeLeft) / (5 * 60)) * 100}%`
                  : `${((task.estimatedTime * 60 - timerState.timeLeft) / (task.estimatedTime * 60)) * 100}%`
              }}
            />
          </div>

          {/* 完了確認モーダル */}
          {isCompleted && !timerState.isBreak && (
            <div className="space-y-4">
              <p className="text-white text-lg">タスクを完了しますか？</p>
              <div className="flex space-x-3 justify-center">
                <Button
                  onClick={handleComplete}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Check className="w-4 h-4 mr-2" />
                  完了
                </Button>
                <Button
                  variant="outline"
                  onClick={handleStartBreak}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  ブレイクを取る
                </Button>
              </div>
            </div>
          )}

          {/* ブレイクタイム完了 */}
          {timerState.isBreak && timerState.timeLeft === 0 && (
            <div className="space-y-4">
              <p className="text-white text-lg">ブレイクタイム終了</p>
              <Button
                onClick={handleSkipBreak}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                続行
              </Button>
            </div>
          )}

          {/* 通常のタイマーコントロール */}
          {!isCompleted && !(timerState.isBreak && timerState.timeLeft === 0) && (
            <div className="flex space-x-3 justify-center">
              {!timerState.isRunning ? (
                <Button
                  onClick={handleStart}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Play className="w-4 h-4 mr-2" />
                  開始
                </Button>
              ) : (
                <Button
                  onClick={handlePause}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  <Pause className="w-4 h-4 mr-2" />
                  一時停止
                </Button>
              )}
              
              <Button
                variant="outline"
                onClick={handleStop}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <Square className="w-4 h-4 mr-2" />
                停止
              </Button>
            </div>
          )}

          {/* ブレイクタイム中はスキップボタン */}
          {timerState.isBreak && timerState.timeLeft > 0 && (
            <Button
              variant="ghost"
              onClick={handleSkipBreak}
              className="text-gray-400 hover:text-white"
            >
              スキップ
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
