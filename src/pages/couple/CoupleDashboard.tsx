import { useNavigate } from 'react-router-dom';
import { Heart, FileText, Calendar, DollarSign, Folder, Star, Bell, ChevronRight, Clock } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export default function CoupleDashboard() {
  const navigate = useNavigate();
  const { couple, plans, payments, tasks, notifications } = useAppStore();

  const plan = plans[0];
  const pendingPayments = payments.filter((p) => p.status === 'pending');
  const upcomingTasks = tasks
    .filter((t) => t.status !== 'completed')
    .slice(0, 3);

  const quickActions = [
    { icon: Heart, label: '填写需求', path: '/couple/preference', color: 'text-burgundy-500', bg: 'bg-blush-50' },
    { icon: FileText, label: '推荐报告', path: '/couple/recommendation', color: 'text-rose-gold-600', bg: 'bg-rose-gold-50' },
    { icon: DollarSign, label: '支付管理', path: '/couple/payment', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { icon: Folder, label: '文件中心', path: '/couple/files', color: 'text-fog-500', bg: 'bg-fog-50' },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* 欢迎横幅 */}
      <div className="bg-gradient-to-r from-rose-gold-500 to-rose-gold-600 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute right-20 bottom-0 w-40 h-40 bg-white/10 rounded-full translate-y-1/2" />
        <div className="relative z-10">
          <p className="text-rose-gold-100 mb-2">欢迎回来，{couple.name}</p>
          <h2 className="font-serif text-3xl font-bold mb-2">距离你们的婚礼还有 127 天</h2>
          <p className="text-rose-gold-100 text-sm">愿你们的爱情如钻石般永恒闪耀 ✨</p>
          {plan && (
            <div className="mt-4 flex items-center gap-4 text-sm">
              <span className="px-3 py-1 bg-white/20 rounded-full">📅 {plan.weddingDate}</span>
              <span className="px-3 py-1 bg-white/20 rounded-full">📍 {plan.venueName}</span>
            </div>
          )}
        </div>
      </div>

      {/* 待办卡片 */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-rose-gold-100 shadow-soft hover:shadow-card transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-blush-50 flex items-center justify-center">
              <FileText size={20} className="text-burgundy-500" />
            </div>
            <span className="text-xs text-fog-300">待签署</span>
          </div>
          <p className="text-2xl font-bold text-rose-gold-800">1</p>
          <p className="text-sm text-fog-400 mt-1">合同待签署</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-rose-gold-100 shadow-soft hover:shadow-card transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
              <DollarSign size={20} className="text-emerald-600" />
            </div>
            <span className="text-xs text-fog-300">待支付</span>
          </div>
          <p className="text-2xl font-bold text-rose-gold-800">{pendingPayments.length}</p>
          <p className="text-sm text-fog-400 mt-1">笔款项待支付</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-rose-gold-100 shadow-soft hover:shadow-card transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-rose-gold-50 flex items-center justify-center">
              <Calendar size={20} className="text-rose-gold-600" />
            </div>
            <span className="text-xs text-fog-300">待办任务</span>
          </div>
          <p className="text-2xl font-bold text-rose-gold-800">{upcomingTasks.length}</p>
          <p className="text-sm text-fog-400 mt-1">项任务待处理</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-rose-gold-100 shadow-soft hover:shadow-card transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-fog-50 flex items-center justify-center">
              <Star size={20} className="text-fog-500" />
            </div>
            <span className="text-xs text-fog-300">待评价</span>
          </div>
          <p className="text-2xl font-bold text-rose-gold-800">0</p>
          <p className="text-sm text-fog-400 mt-1">个供应商待评价</p>
        </div>
      </div>

      {/* 快捷操作 */}
      <div className="bg-white rounded-2xl p-6 border border-rose-gold-100 shadow-soft">
        <h3 className="font-serif text-lg font-bold text-rose-gold-800 mb-5">快捷操作</h3>
        <div className="grid grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                onClick={() => navigate(action.path)}
                className="flex flex-col items-center gap-3 p-5 rounded-xl hover:bg-rose-gold-50 transition-colors group"
              >
                <div className={`w-12 h-12 rounded-xl ${action.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon size={24} className={action.color} />
                </div>
                <span className="text-sm font-medium text-rose-gold-700">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* 即将到来的任务 */}
        <div className="col-span-2 bg-white rounded-2xl p-6 border border-rose-gold-100 shadow-soft">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-serif text-lg font-bold text-rose-gold-800">即将到来的任务</h3>
            <button
              onClick={() => navigate('/tasks')}
              className="text-sm text-rose-gold-500 hover:text-rose-gold-600 flex items-center gap-1"
            >
              查看全部 <ChevronRight size={16} />
            </button>
          </div>
          <div className="space-y-3">
            {upcomingTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-4 p-4 rounded-xl bg-ivory-50 hover:bg-rose-gold-50 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-2xl shadow-soft">
                  {task.type === 'makeup_test' && '💄'}
                  {task.type === 'rehearsal' && '🎭'}
                  {task.type === 'wedding' && '💒'}
                  {task.type === 'meeting' && '📋'}
                  {task.type === 'delivery' && '📦'}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-rose-gold-800">{task.title}</p>
                  <p className="text-sm text-fog-400">{task.date} {task.time || ''}</p>
                </div>
                <div className="flex items-center gap-1 text-sm text-rose-gold-500">
                  <Clock size={14} />
                  <span>7天后</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 消息通知 */}
        <div className="bg-white rounded-2xl p-6 border border-rose-gold-100 shadow-soft">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-serif text-lg font-bold text-rose-gold-800">最新消息</h3>
            <Bell size={18} className="text-fog-300" />
          </div>
          <div className="space-y-3">
            {notifications.slice(0, 3).map((notif) => (
              <div
                key={notif.id}
                className={`p-3 rounded-lg ${notif.read ? 'bg-fog-50' : 'bg-blush-50 border border-blush-100'}`}
              >
                <p className={`text-sm font-medium ${notif.read ? 'text-fog-500' : 'text-rose-gold-700'}`}>
                  {notif.title}
                </p>
                <p className="text-xs text-fog-400 mt-1 line-clamp-2">{notif.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
