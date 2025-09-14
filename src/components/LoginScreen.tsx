import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { User } from '@/types';
import { signIn, signUp, signInWithGoogle } from '@/lib/firebase-storage';
import { trackLogin, trackError } from '@/lib/analytics';

interface LoginScreenProps {
  onLogin: (user: User) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('メールアドレスとパスワードを入力してください');
      return;
    }

    setIsLoading(true);
    
    try {
      const user = isRegisterMode 
        ? await signUp(email, password)
        : await signIn(email, password);
      
      onLogin(user);
      
      // ログインイベントを追跡
      trackLogin(isRegisterMode ? 'email_register' : 'email_login', user.id);
      
      toast.success(isRegisterMode ? 'アカウントを作成しました' : 'ログインしました');
    } catch (error: any) {
      console.error('Auth error:', error);
      
      if (isRegisterMode) {
        if (error.code === 'auth/email-already-in-use') {
          toast.error('このメールアドレスは既に使用されています');
        } else if (error.code === 'auth/weak-password') {
          toast.error('パスワードは6文字以上で入力してください');
        } else if (error.code === 'auth/invalid-email') {
          toast.error('メールアドレスの形式が正しくありません');
        } else {
          toast.error('アカウント作成に失敗しました');
        }
      } else {
        if (error.code === 'auth/user-not-found') {
          toast.error('ユーザーが見つかりません');
        } else if (error.code === 'auth/wrong-password') {
          toast.error('パスワードが間違っています');
        } else if (error.code === 'auth/invalid-email') {
          toast.error('メールアドレスの形式が正しくありません');
        } else {
          toast.error('ログインに失敗しました');
        }
      }
      
      // エラーイベントを追跡
      trackError('auth_failed', error.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    
    try {
      const user = await signInWithGoogle();
      onLogin(user);
      
      // Google認証イベントを追跡
      trackLogin('google', user.id);
      
      toast.success('Googleアカウントでログインしました');
    } catch (error: any) {
      console.error('Google auth error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        toast.error('ログインがキャンセルされました');
      } else {
        toast.error('Googleログインに失敗しました');
      }
      
      // エラーイベントを追跡
      trackError('google_auth_failed', error.message || 'Google authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = () => {
    const guestUser: User = {
      id: 'guest',
      email: 'guest@oicomi.com',
      isLoggedIn: false,
    };
    
    onLogin(guestUser);
    
    // ゲストログインイベントを追跡
    trackLogin('guest', guestUser.id);
    
    toast.info('ゲストモードでログインしました');
  };

  const isFormValid = email.trim() !== '' && password.trim() !== '';

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-900 border-gray-800">
        <CardHeader className="text-center">
          {/* ロゴエリア */}
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 rounded-xl gradient-blue flex items-center justify-center">
              <span className="text-white font-bold text-lg">O</span>
            </div>
            <div>
              <CardTitle className="text-3xl font-light text-white">OICOMI</CardTitle>
              <CardDescription className="text-gray-400 mt-2">
                エリートビジネスサポートアプリ
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* モード切り替えボタン */}
          <div className="flex space-x-2">
            <Button
              type="button"
              variant={!isRegisterMode ? "default" : "outline"}
              onClick={() => setIsRegisterMode(false)}
              className="flex-1"
              disabled={isLoading}
            >
              ログイン
            </Button>
            <Button
              type="button"
              variant={isRegisterMode ? "default" : "outline"}
              onClick={() => setIsRegisterMode(true)}
              className="flex-1"
              disabled={isLoading}
            >
              新規登録
            </Button>
          </div>

          {/* 認証フォーム */}
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="メールアドレス"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="パスワード"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                disabled={isLoading}
              />
            </div>
            
            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              disabled={!isFormValid || isLoading}
            >
              {isLoading 
                ? (isRegisterMode ? '登録中...' : 'ログイン中...') 
                : (isRegisterMode ? 'アカウント作成' : 'ログイン')
              }
            </Button>
          </form>

          {/* 区切り線 */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gray-900 px-2 text-gray-400">または</span>
            </div>
          </div>

          {/* Google認証ボタン */}
          <Button
            variant="outline"
            onClick={handleGoogleAuth}
            className="w-full bg-white text-black hover:bg-gray-100 border-white flex items-center justify-center space-x-2"
            disabled={isLoading}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Googleで{isRegisterMode ? '登録' : 'ログイン'}</span>
          </Button>

          {/* ゲストログインボタン */}
          <Button
            variant="outline"
            onClick={handleGuestLogin}
            className="w-full bg-gray-800 text-white hover:bg-gray-700 border-gray-600"
            disabled={isLoading}
          >
            ゲストモードで利用
          </Button>

          {/* 注意書き */}
          <div className="text-xs text-gray-500 text-center space-y-1">
            <p>ゲストモードでは統計機能が制限されます</p>
            <p>ログインすると全ての機能が利用可能です</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
