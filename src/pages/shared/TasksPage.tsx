import { useState } from 'react';
import { Clock, MapPin, User, CheckCircle, Circle, AlertTriangle, Bell } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import type { TaskStatus, TaskType } from '@/types';

const taskTypeInfo: Record<TaskType, { label: string; icon: string; color: string }> = {
  makeup_test: { label: '试妆', icon: '💄', color: 'bg-pink-100' },
  rehearsal: { label: '彩排', icon: '🎭', color: 'bg-purple-100' },
  wedding: { label: '婚礼', icon: '💒', color: 'bg-rose-gold-100' },
  delivery: { label: '交付', icon: '📦', color: 'bg-blue-100' },
  meeting: { label: '会议', icon: '📋', color: 'bg-fog-100' },
};

const statusInfo: Record<TaskStatus, { label: string }> = {
  pending: { label: '待处理' },
  in_progress: { label: '进行中' },
  completed: { label: '已完成' },
};

export default function TasksPage() {
  const { tasks, updateTaskStatus, currentRole } = useAppStore();
  const [filter, setFilter] = useState<'all' | TaskStatus>('all');

  const filteredTasks = filter === 'all'
    ? tasks
    : tasks.filter((t) => t.status === filter);

  const sortedTasks = [...filteredTasks].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const isUpcoming = (date: string) => {
    const taskDate = new Date(date);
    const today = new Date();
    const diffDays = Math.ceil((taskDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 7;
  };

  const getDaysUntil = (date: string) => {
    const taskDate = new Date(date);
    const today = new Date();
    const diffDays = Math.ceil((taskDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-serif text-2xl font-bold text-rose-gold-800">任务时间轴</h2>
          <p className="text-sm text-fog-400 mt-1">查看所有婚礼相关任务节点</p>
        </div>

        <div className="flex gap-2">
          {(['all', 'pending', 'in_progress', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === f
                  ? 'bg-rose-gold-500 text-white'
                  : 'bg-white text-rose-gold-600 border border-rose-gold-200 hover:bg-rose-gold-50'
              }`}
            >
              {f === 'all' ? '全部' : statusInfo[f].label}
            </button>
          ))}
        </div>
      </div>

      {/* 即将到期提醒 */}
      {tasks.filter((t) => t.status !== 'completed' && isUpcoming(t.date)).length > 0 && (
        <div className="bg-gradient-to-r from-blush-50 to-rose-gold-50 rounded-2xl p-5 border border-blush-100 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-burgundy-500 rounded-xl flex items-center justify-center animate-pulse-soft">
              <Bell size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-medium text-burgundy-500">即将到期提醒</h3>
              <p className="text-sm text-fog-500">以下任务将在 7 天内到期</p>
            </div>
          </div>
          <div className="flex gap-3">
            {tasks
              .filter((t) => t.status !== 'completed' && isUpcoming(t.date))
              .map((task) => (
                <div
                  key={task.id}
                  className="flex-1 bg-white rounded-xl p-4 border border-blush-100"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{taskTypeInfo[task.type].icon}</span>
                    <span className="font-medium text-rose-gold-800 text-sm">{task.title}</span>
                  </div>
                  <p className="text-xs text-burgundy-500 font-medium">
                    还有 {getDaysUntil(task.date)} 天
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 时间轴 */}
      <div className="bg-white rounded-2xl border border-rose-gold-100 shadow-soft p-8">
        <div className="relative">
          {/* 时间轴线 */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-rose-gold-300 via-rose-gold-200 to-rose-gold-100" />

          <div className="space-y-0">
            {sortedTasks.map((task, index) => {
              const typeInfo = taskTypeInfo[task.type];
              const daysUntil = getDaysUntil(task.date);
              const isCompleted = task.status === 'completed';
              const isUrgent = !isCompleted && daysUntil > 0 && daysUntil <= 3;
              const isSoon = !isCompleted && daysUntil > 0 && daysUntil <= 7;

              return (
                <div key={task.id} className="relative pl-20 pb-8 last:pb-0">
                  {/* 节点圆点 */}
                  <div
                    className={`absolute left-6 w-5 h-5 rounded-full border-4 border-white ${
                      isCompleted
                        ? 'bg-emerald-500'
                        : isUrgent
                        ? 'bg-burgundy-500 animate-pulse-soft'
                        : isSoon
                        ? 'bg-rose-gold-500'
                        : 'bg-fog-300'
                    } shadow-md`}
                  />

                  {/* 任务卡片 */}
                  <div
                    className={`p-5 rounded-xl transition-all hover:shadow-card ${
                      isCompleted
                        ? 'bg-fog-50 border border-fog-100'
                        : isUrgent
                        ? 'bg-blush-50 border border-blush-200'
                        : 'bg-ivory-50 border border-rose-gold-100'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${typeInfo.color}`}
                        >
                          {typeInfo.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <h4
                              className={`font-serif text-lg font-bold ${
                                isCompleted ? 'text-fog-400 line-through' : 'text-rose-gold-800'
                              }`}
                            >
                              {task.title}
                            </h4>
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                isCompleted
                                  ? 'bg-fog-100 text-fog-500'
                                  : isUrgent
                                  ? 'bg-burgundy-500 text-white'
                                  : isSoon
                                  ? 'bg-rose-gold-100 text-rose-gold-600'
                                  : 'bg-fog-100 text-fog-500'
                              }`}
                            >
                              {isCompleted
                                ? '已完成'
                                : isUrgent
                                ? `紧急 · ${daysUntil}天后`
                                : isSoon
                                ? `${daysUntil}天后`
                                : daysUntil < 0
                                ? `已过期 ${Math.abs(daysUntil)} 天`
                                : `${daysUntil}天后`}
                            </span>
                          </div>

                          <p
                            className={`text-sm mt-2 ${
                              isCompleted ? 'text-fog-400' : 'text-fog-500'
                            }`}
                          >
                            {task.description}
                          </p>

                          <div className="flex items-center gap-4 mt-3 text-xs text-fog-400">
                            <span className="flex items-center gap-1">
                              <Clock size={12} />
                              {task.date} {task.time || ''}
                            </span>
                            {task.location && (
                              <span className="flex items-center gap-1">
                                <MapPin size={12} />
                                {task.location}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <User size={12} />
                              {task.assignee}
                            </span>
                          </div>
                        </div>
                      </div>

                      {!isCompleted && (
                        <button
                          onClick={() => updateTaskStatus(task.id, 'completed')}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-50 text-emerald-600 text-sm hover:bg-emerald-100 transition-colors"
                        >
                          <CheckCircle size={16} />
                          标记完成
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 空状态 */}
      {sortedTasks.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-medium text-rose-gold-700 mb-2">暂无任务</h3>
          <p className="text-fog-400">该分类下暂无任务</p>
        </div>
      )}
    </div>
  );
}
