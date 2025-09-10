import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Task } from '@/types';

interface TaskProgressChartProps {
  completedTasks: Task[];
}

type TimeRange = 'day' | 'week' | 'month' | 'year';

export function TaskProgressChart({ completedTasks }: TaskProgressChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('week');

  const chartData = useMemo(() => {
    if (completedTasks.length === 0) return [];

    const now = new Date();
    let startDate: Date;
    let dataPoints: { date: string; completed: number; cumulative: number }[] = [];

    // 時間範囲に応じて開始日を設定
    switch (timeRange) {
      case 'day':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
        break;
      case 'week':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6 * 7);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear() - 1, 0, 1);
        break;
    }

    // データポイントを生成
    const currentDate = new Date(startDate);
    let cumulative = 0;

    while (currentDate <= now) {
      const dateStr = currentDate.toISOString().split('T')[0];
      
      // その日の完了タスク数を計算
      const dayCompleted = completedTasks.filter(task => {
        if (!task.completedAt) return false;
        const taskDate = new Date(task.completedAt);
        return taskDate.toISOString().split('T')[0] === dateStr;
      }).length;

      cumulative += dayCompleted;

      dataPoints.push({
        date: dateStr,
        completed: dayCompleted,
        cumulative: cumulative
      });

      // 次の日付に進む
      switch (timeRange) {
        case 'day':
          currentDate.setDate(currentDate.getDate() + 1);
          break;
        case 'week':
          currentDate.setDate(currentDate.getDate() + 7);
          break;
        case 'month':
          currentDate.setMonth(currentDate.getMonth() + 1);
          break;
        case 'year':
          currentDate.setFullYear(currentDate.getFullYear() + 1);
          break;
      }
    }

    return dataPoints;
  }, [completedTasks, timeRange]);

  const formatXAxisLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    switch (timeRange) {
      case 'day':
        return `${date.getMonth() + 1}/${date.getDate()}`;
      case 'week':
        return `${date.getMonth() + 1}/${date.getDate()}`;
      case 'month':
        return `${date.getFullYear()}/${date.getMonth() + 1}`;
      case 'year':
        return `${date.getFullYear()}`;
      default:
        return dateStr;
    }
  };

  const formatTooltipLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    switch (timeRange) {
      case 'day':
        return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
      case 'week':
        return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
      case 'month':
        return `${date.getFullYear()}年${date.getMonth() + 1}月`;
      case 'year':
        return `${date.getFullYear()}年`;
      default:
        return dateStr;
    }
  };

  const timeRangeLabels = {
    day: '7日間',
    week: '6週間',
    month: '6ヶ月',
    year: '2年間'
  };

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-lg">完了タスク推移</CardTitle>
          <div className="flex space-x-1">
            {(['day', 'week', 'month', 'year'] as TimeRange[]).map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange(range)}
                className={`text-xs px-2 py-1 h-7 ${
                  timeRange === range
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {timeRangeLabels[range]}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatXAxisLabel}
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '6px',
                    color: '#F9FAFB'
                  }}
                  labelFormatter={formatTooltipLabel}
                  formatter={(value: number, name: string) => [
                    value,
                    name === 'completed' ? '完了数' : '累計完了数'
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="cumulative"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <p className="text-lg mb-2">データがありません</p>
              <p className="text-sm">タスクを完了するとグラフが表示されます</p>
            </div>
          </div>
        )}
        
        {/* 凡例 */}
        {chartData.length > 0 && (
          <div className="flex justify-center space-x-6 mt-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-300">日別完了数</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-300">累計完了数</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
