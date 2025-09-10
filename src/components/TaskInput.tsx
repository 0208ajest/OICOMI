import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { Task } from '@/types';

interface TaskInputProps {
  onAddTask: (task: Omit<Task, 'id' | 'createdAt' | 'isActive' | 'isCompleted' | 'isPriority'>) => void;
}

export function TaskInput({ onAddTask }: TaskInputProps) {
  const [title, setTitle] = useState('');
  const [estimatedTime, setEstimatedTime] = useState(30);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      return;
    }

    onAddTask({
      title: title.trim(),
      estimatedTime,
      urls: [],
    });

    setTitle('');
    setEstimatedTime(30);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="mb-6">
      <form onSubmit={handleSubmit} className="flex items-center space-x-3">
        <Input
          type="text"
          placeholder="新しいタスクを入力..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 bg-gray-900 border-gray-700 text-white placeholder:text-gray-400"
        />
        
        <Input
          type="number"
          min="1"
          max="999"
          value={estimatedTime}
          onChange={(e) => setEstimatedTime(parseInt(e.target.value) || 30)}
          className="w-20 bg-gray-900 border-gray-700 text-white text-center"
        />
        
        <Button
          type="submit"
          size="icon"
          className="bg-blue-500 hover:bg-blue-600 text-white"
          disabled={!title.trim()}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </form>
      
      <p className="text-sm text-gray-400 mt-2">
        想定時間（分）を設定してタスクを追加
      </p>
    </div>
  );
}
