import { User, Task, Memo } from '@/types';

const STORAGE_KEYS = {
  USER: 'oicomi-user',
  TASKS: 'oicomi-tasks',
  MEMO: 'oicomi-memo',
} as const;

export function saveUser(user: User): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } catch (error) {
    console.error('Failed to save user:', error);
  }
}

export function loadUser(): User | null {
  try {
    const userData = localStorage.getItem(STORAGE_KEYS.USER);
    if (!userData) return null;
    
    const user = JSON.parse(userData);
    // Date objects need to be reconstructed
    return {
      ...user,
      // Add any date reconstruction if needed
    };
  } catch (error) {
    console.error('Failed to load user:', error);
    return null;
  }
}

export function clearUser(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.USER);
  } catch (error) {
    console.error('Failed to clear user:', error);
  }
}

export function saveTasks(tasks: Task[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save tasks:', error);
  }
}

export function loadTasks(): Task[] {
  try {
    const tasksData = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (!tasksData) return [];
    
    const tasks = JSON.parse(tasksData);
    // Reconstruct Date objects
    return tasks.map((task: any) => ({
      ...task,
      createdAt: new Date(task.createdAt),
      completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
    }));
  } catch (error) {
    console.error('Failed to load tasks:', error);
    return [];
  }
}

export function saveMemo(memo: Memo): void {
  try {
    localStorage.setItem(STORAGE_KEYS.MEMO, JSON.stringify(memo));
  } catch (error) {
    console.error('Failed to save memo:', error);
  }
}

export function loadMemo(): Memo | null {
  try {
    const memoData = localStorage.getItem(STORAGE_KEYS.MEMO);
    if (!memoData) return null;
    
    const memo = JSON.parse(memoData);
    return {
      ...memo,
      lastUpdated: new Date(memo.lastUpdated),
    };
  } catch (error) {
    console.error('Failed to load memo:', error);
    return null;
  }
}

export function clearAllData(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.TASKS);
    localStorage.removeItem(STORAGE_KEYS.MEMO);
  } catch (error) {
    console.error('Failed to clear all data:', error);
  }
}
