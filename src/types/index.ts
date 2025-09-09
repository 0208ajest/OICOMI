export interface User {
  id: string;
  email: string;
  isLoggedIn: boolean;
}

export interface Task {
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

export interface TaskStats {
  totalTasks: number;
  todayCompleted: number;
  weekCompleted: number;
}

export interface TimerState {
  isRunning: boolean;
  timeLeft: number; // 秒
  taskId?: string;
  isBreak: boolean;
}

export interface Memo {
  content: string;
  lastUpdated: Date;
}
