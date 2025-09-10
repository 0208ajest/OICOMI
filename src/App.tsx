import { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import { LoginScreen } from '@/components/LoginScreen';
import { Header } from '@/components/Header';
import { StatsCards } from '@/components/StatsCards';
import { TaskInput } from '@/components/TaskInput';
import { TaskTimeline } from '@/components/TaskTimeline';
import { TimerModal } from '@/components/TimerModal';
import { MemoSection } from '@/components/MemoSection';
import { User, Task, TaskStats, Memo } from '@/types';
import { 
  onAuthStateChange,
  loadTasks,
  saveTask,
  updateTask,
  loadMemo,
  saveMemo,
  loadTasksLocal,
  saveTaskLocal,
  loadMemoLocal,
  saveMemoLocal
} from '@/lib/firebase-storage';
import { generateId, isToday, isThisWeek } from '@/lib/utils';
import { toast } from 'sonner';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [memo, setMemo] = useState<Memo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginScreen, setShowLoginScreen] = useState(false);
  const [timerModal, setTimerModal] = useState<{
    isOpen: boolean;
    task: Task | null;
  }>({
    isOpen: false,
    task: null,
  });

  // 初期データの読み込み
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Firebase認証状態の監視
        const unsubscribe = onAuthStateChange(async (firebaseUser) => {
          if (firebaseUser) {
            // ログイン済みの場合
            setUser(firebaseUser);
            try {
              const userTasks = await loadTasks(firebaseUser.id);
              const userMemo = await loadMemo(firebaseUser.id);
              setTasks(userTasks);
              setMemo(userMemo);
            } catch (error) {
              console.error('Failed to load user data:', error);
              toast.error('データの読み込みに失敗しました');
            }
          } else {
            // 未ログインの場合（ゲストモード）
            const guestUser: User = {
              id: 'guest',
              email: '',
              isLoggedIn: false,
            };
            setUser(guestUser);
            const localTasks = loadTasksLocal();
            const localMemo = loadMemoLocal();
            setTasks(localTasks);
            setMemo(localMemo);
          }
          setIsLoading(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Failed to initialize app:', error);
        toast.error('アプリの初期化に失敗しました');
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  // タスクの統計を計算
  const calculateStats = (): TaskStats => {
    const completedTasks = tasks.filter(task => task.isCompleted);
    const todayCompleted = completedTasks.filter(task => 
      task.completedAt && isToday(task.completedAt)
    ).length;
    const weekCompleted = completedTasks.filter(task => 
      task.completedAt && isThisWeek(task.completedAt)
    ).length;

    return {
      totalTasks: tasks.length,
      todayCompleted,
      weekCompleted,
    };
  };

  // タスクの追加
  const handleAddTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'isActive' | 'isCompleted' | 'isPriority'>) => {
    const newTask: Task = {
      id: generateId(),
      ...taskData,
      createdAt: new Date(),
      isActive: false,
      isCompleted: false,
      isPriority: false,
    };

    try {
      if (user?.isLoggedIn) {
        // ログイン済みの場合、Firebaseに保存
        await saveTask(user.id, newTask);
      } else {
        // ゲストモードの場合、ローカルストレージに保存
        saveTaskLocal(newTask);
      }
      
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      toast.success('タスクを追加しました');
    } catch (error) {
      console.error('Failed to add task:', error);
      toast.error('タスクの追加に失敗しました');
    }
  };

  // タスクの更新
  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      if (user?.isLoggedIn) {
        // ログイン済みの場合、Firebaseを更新
        await updateTask(user.id, taskId, updates);
      } else {
        // ゲストモードの場合、ローカルストレージを更新
        const updatedTask = tasks.find(t => t.id === taskId);
        if (updatedTask) {
          const newTask = { ...updatedTask, ...updates };
          saveTaskLocal(newTask);
        }
      }
      
      const updatedTasks = tasks.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      );
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Failed to update task:', error);
      toast.error('タスクの更新に失敗しました');
    }
  };

  // タイマーの開始
  const handleStartTimer = async (task: Task) => {
    // 他のタスクを非アクティブにする
    const updatedTasks = tasks.map(t => ({
      ...t,
      isActive: t.id === task.id
    }));
    
    // 各タスクの状態を更新
    for (const updatedTask of updatedTasks) {
      await handleUpdateTask(updatedTask.id, { isActive: updatedTask.isActive });
    }
    
    setTasks(updatedTasks);
    
    // ポップアップは表示しない（タスク上のUIのみでタイマー表示）
  };

  // タスクの完了
  const handleCompleteTask = (taskId: string) => {
    handleUpdateTask(taskId, {
      isCompleted: true,
      completedAt: new Date(),
      isActive: false,
    });
    toast.success('タスクを完了しました');
  };

  // タスクの復活
  const handleRestoreTask = (taskId: string) => {
    handleUpdateTask(taskId, {
      isCompleted: false,
      completedAt: undefined,
      isActive: false,
    });
    toast.success('タスクを復活させました');
  };

  // ブレイクタイムの開始
  const handleStartBreak = () => {
    toast.info('5分間のブレイクタイムを開始しました');
  };

  // メモの更新
  const handleMemoChange = async (updatedMemo: Memo) => {
    try {
      if (user?.isLoggedIn) {
        // ログイン済みの場合、Firebaseに保存
        await saveMemo(user.id, updatedMemo);
      } else {
        // ゲストモードの場合、ローカルストレージに保存
        saveMemoLocal(updatedMemo);
      }
      
      setMemo(updatedMemo);
    } catch (error) {
      console.error('Failed to save memo:', error);
      toast.error('メモの保存に失敗しました');
    }
  };

  // ローディング中
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg">読み込み中...</div>
      </div>
    );
  }

  // ログイン画面
  if (showLoginScreen) {
    return (
      <>
        <LoginScreen onLogin={(user) => {
          setUser(user);
          setShowLoginScreen(false);
        }} />
        <Toaster theme="dark" position="top-right" />
      </>
    );
  }

  const stats = calculateStats();

  return (
    <div className="min-h-screen bg-black">
      <Header user={user} onUserChange={setUser} tasks={tasks} onRestoreTask={handleRestoreTask} onShowLogin={() => setShowLoginScreen(true)} />
      
      <main className="max-w-4xl mx-auto px-4 pt-24 pb-8">
        {/* 統計カード */}
        <StatsCards stats={stats} isLoggedIn={user?.isLoggedIn || false} />
        
        {/* タスク入力 */}
        <TaskInput onAddTask={handleAddTask} />
        
        {/* タスクタイムライン */}
        <TaskTimeline 
          tasks={tasks}
          onUpdateTask={handleUpdateTask}
          onStartTimer={handleStartTimer}
        />
        
        {/* メモセクション */}
        <MemoSection 
          memo={memo}
          onMemoChange={handleMemoChange}
        />
      </main>

      {/* タイマーモーダル */}
      <TimerModal
        isOpen={timerModal.isOpen}
        onClose={() => setTimerModal({ isOpen: false, task: null })}
        task={timerModal.task}
        onCompleteTask={handleCompleteTask}
        onStartBreak={handleStartBreak}
      />

      {/* トースト通知 */}
      <Toaster theme="dark" position="top-right" />
    </div>
  );
}

export default App;
