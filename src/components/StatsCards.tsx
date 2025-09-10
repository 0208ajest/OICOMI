import { Card, CardContent } from '@/components/ui/card';
import { TaskStats } from '@/types';

interface StatsCardsProps {
  stats: TaskStats;
  isLoggedIn: boolean;
}

export function StatsCards({ stats, isLoggedIn }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {/* 登録タスク数 */}
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-mono text-white mb-1">
            {stats.totalTasks}
          </div>
          <div className="text-sm text-gray-400">登録タスク</div>
        </CardContent>
      </Card>

      {/* 今日完了数 */}
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-mono text-white mb-1">
            {isLoggedIn ? stats.todayCompleted : '?'}
          </div>
          <div className="text-sm text-gray-400">今日完了</div>
        </CardContent>
      </Card>

      {/* 今週完了数 */}
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-mono text-white mb-1">
            {isLoggedIn ? stats.weekCompleted : '?'}
          </div>
          <div className="text-sm text-gray-400">今週完了</div>
        </CardContent>
      </Card>
    </div>
  );
}
