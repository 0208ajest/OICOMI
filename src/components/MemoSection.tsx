import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Memo } from '@/types';
import { saveMemo } from '@/lib/storage';
import { FileText } from 'lucide-react';

interface MemoSectionProps {
  memo: Memo | null;
  onMemoChange: (memo: Memo) => void;
}

export function MemoSection({ memo, onMemoChange }: MemoSectionProps) {
  const [content, setContent] = useState(memo?.content || '');

  useEffect(() => {
    if (memo) {
      setContent(memo.content);
    }
  }, [memo]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    
    const updatedMemo: Memo = {
      content: newContent,
      lastUpdated: new Date(),
    };
    
    onMemoChange(updatedMemo);
    saveMemo(updatedMemo);
  };

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center space-x-2 text-sm font-medium">
          <FileText className="w-4 h-4" />
          <span>一時メモ</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder="メモを入力してください..."
          className="min-h-[100px] bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 resize-none"
        />
        {memo && (
          <p className="text-xs text-gray-500 mt-2">
            最終更新: {memo.lastUpdated.toLocaleString('ja-JP')}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
