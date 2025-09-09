import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { User } from '@/types';
import { signIn, signUp } from '@/lib/firebase-storage';

interface LoginScreenProps {
  onLogin: (user: User) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('メールアドレスとパスワードを入力してください');
      return;
    }

    setIsLoading(true);
    
    try {
      const user = await signIn(email, password);
      onLogin(user);
      toast.success('ログインしました');
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.code === 'auth/user-not-found') {
        toast.error('ユーザーが見つかりません');
      } else if (error.code === 'auth/wrong-password') {
        toast.error('パスワードが間違っています');
      } else if (error.code === 'auth/invalid-email') {
        toast.error('メールアドレスの形式が正しくありません');
      } else {
        toast.error('ログインに失敗しました');
      }
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
          {/* ログインフォーム */}
          <form onSubmit={handleLogin} className="space-y-4">
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
              {isLoading ? 'ログイン中...' : 'ログイン'}
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

          {/* ゲストログインボタン */}
          <Button
            variant="outline"
            onClick={handleGuestLogin}
            className="w-full bg-white text-black hover:bg-gray-100 border-white"
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
