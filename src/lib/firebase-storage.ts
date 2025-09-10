import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  updateDoc, 
  deleteDoc, 
  query, 
  getDocs,
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { auth, db } from './firebase';
import { User, Task, Memo } from '@/types';

// 認証関連
export async function signIn(email: string, password: string): Promise<User> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    
    const user: User = {
      id: firebaseUser.uid,
      email: firebaseUser.email || email,
      isLoggedIn: true,
    };
    
    return user;
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
}

export async function signUp(email: string, password: string): Promise<User> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    
    const user: User = {
      id: firebaseUser.uid,
      email: firebaseUser.email || email,
      isLoggedIn: true,
    };
    
    return user;
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
}

export async function signOutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
}

export function onAuthStateChange(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser) {
      const user: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        isLoggedIn: true,
      };
      callback(user);
    } else {
      callback(null);
    }
  });
}

// タスク関連
export async function saveTask(userId: string, task: Task): Promise<void> {
  try {
    const taskRef = doc(db, 'users', userId, 'tasks', task.id);
    await setDoc(taskRef, {
      ...task,
      createdAt: Timestamp.fromDate(task.createdAt),
      completedAt: task.completedAt ? Timestamp.fromDate(task.completedAt) : null,
    });
  } catch (error) {
    console.error('Save task error:', error);
    throw error;
  }
}

export async function loadTasks(userId: string): Promise<Task[]> {
  try {
    const tasksRef = collection(db, 'users', userId, 'tasks');
    const q = query(tasksRef, orderBy('createdAt', 'asc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        createdAt: data.createdAt.toDate(),
        completedAt: data.completedAt ? data.completedAt.toDate() : undefined,
      } as Task;
    });
  } catch (error) {
    console.error('Load tasks error:', error);
    return [];
  }
}

export async function updateTask(userId: string, taskId: string, updates: Partial<Task>): Promise<void> {
  try {
    const taskRef = doc(db, 'users', userId, 'tasks', taskId);
    const updateData: any = { ...updates };
    
    if (updates.createdAt) {
      updateData.createdAt = Timestamp.fromDate(updates.createdAt);
    }
    if (updates.completedAt) {
      updateData.completedAt = Timestamp.fromDate(updates.completedAt);
    }
    
    await updateDoc(taskRef, updateData);
  } catch (error) {
    console.error('Update task error:', error);
    throw error;
  }
}

export async function deleteTask(userId: string, taskId: string): Promise<void> {
  try {
    const taskRef = doc(db, 'users', userId, 'tasks', taskId);
    await deleteDoc(taskRef);
  } catch (error) {
    console.error('Delete task error:', error);
    throw error;
  }
}

// メモ関連
export async function saveMemo(userId: string, memo: Memo): Promise<void> {
  try {
    const memoRef = doc(db, 'users', userId, 'memo', 'current');
    await setDoc(memoRef, {
      ...memo,
      lastUpdated: Timestamp.fromDate(memo.lastUpdated),
    });
  } catch (error) {
    console.error('Save memo error:', error);
    throw error;
  }
}

export async function loadMemo(userId: string): Promise<Memo | null> {
  try {
    const memoRef = doc(db, 'users', userId, 'memo', 'current');
    const memoSnap = await getDoc(memoRef);
    
    if (memoSnap.exists()) {
      const data = memoSnap.data();
      return {
        ...data,
        lastUpdated: data.lastUpdated.toDate(),
      } as Memo;
    }
    
    return null;
  } catch (error) {
    console.error('Load memo error:', error);
    return null;
  }
}

// ゲストモード用のローカルストレージ（フォールバック）
export function saveTaskLocal(task: Task): void {
  try {
    const tasks = loadTasksLocal();
    const existingIndex = tasks.findIndex(t => t.id === task.id);
    
    if (existingIndex >= 0) {
      tasks[existingIndex] = task;
    } else {
      tasks.push(task);
    }
    
    localStorage.setItem('oicomi-tasks', JSON.stringify(tasks));
  } catch (error) {
    console.error('Save task local error:', error);
  }
}

export function loadTasksLocal(): Task[] {
  try {
    const tasksData = localStorage.getItem('oicomi-tasks');
    if (!tasksData) return [];
    
    const tasks = JSON.parse(tasksData);
    return tasks.map((task: any) => ({
      ...task,
      createdAt: new Date(task.createdAt),
      completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
    }));
  } catch (error) {
    console.error('Load tasks local error:', error);
    return [];
  }
}

export function saveMemoLocal(memo: Memo): void {
  try {
    localStorage.setItem('oicomi-memo', JSON.stringify(memo));
  } catch (error) {
    console.error('Save memo local error:', error);
  }
}

export function loadMemoLocal(): Memo | null {
  try {
    const memoData = localStorage.getItem('oicomi-memo');
    if (!memoData) return null;
    
    const memo = JSON.parse(memoData);
    return {
      ...memo,
      lastUpdated: new Date(memo.lastUpdated),
    };
  } catch (error) {
    console.error('Load memo local error:', error);
    return null;
  }
}
