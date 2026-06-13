import { useNavigate } from 'react-router-dom';
import { FileText, Calendar, Users, DollarSign, Plus, ChevronRight, Clock, FileSignature, Eye } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export default function CompanyDashboard() {
  const navigate = useNavigate();
  const { plans, tasks, notifications, contracts } = useAppStore();

  const activePlans = plans.filter((p) => p.status !== 'completed');
  const completedPlans = plans.filter((p) => p.status === 'completed');
  const pendingTasks = tasks.filter((t) => t.status !== 'completed').length;

  const stats = [
    { label: '进行中方案', value: activePlans.length, icon: FileText, color: 'text-rose-gold-600', bg: 'bg-rose-gold-50' },
    { label: '待处理任务', value: pendingTasks, icon: Calendar, color: 'text-burgundy-500', bg: 'bg-blush-50' },
    { label: '本月营收', value: '¥38.6万', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: '合作供应商', value: 28, icon: Users, color: 'text-fog-500', bg: 'bg-fog-50' },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* 顶部欢迎 */}
      <div className="bg-gradient-to-r from-rose-gold-600 to-rose-gold-500 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-72 h-72 bg-white/10 rounded-full -translate-y-1/3 translate-x-1/4" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-rose-gold-100 mb-2">欢迎回来，良缘婚庆</p>
            <h2 className="font-serif text-3xl font-bold mb-2">今日有 3 个方案待跟进</h2>
            <p className="text-rose-gold-100">您本月的客户满意度为 98.5%，继续保持！</p>
          </div>
          <button
            onClick={() => navigate('/company/plan/create')}
            className="flex items-center gap-2 px-6 py-3 bg-white text-rose-gold-600 rounded-xl font-medium hover:bg-rose-gold-50 transition-colors shadow-lg"
          >
            <Plus size={20} />
            创建新方案
          </button>
        </div>
      </div>

      {/* 数据卡片 */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-xl p-5 border border-rose-gold-100 shadow-soft hover:shadow-card transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <Icon size={20} className={stat.color} />
                </div>
              </div>
              <p className="text-2xl font-bold text-rose-gold-800">{stat.value}</p>
              <p className="text-sm text-fog-400 mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* 进行中的方案 */}
        <div className="col-span-2 bg-white rounded-2xl p-6 border border-rose-gold-100 shadow-soft">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-serif text-lg font-bold text-rose-gold-800">进行中的方案</h3>
            <button
              onClick={() => navigate('/company/plan/create')}
              className="text-sm text-rose-gold-500 hover:text-rose-gold-600 flex items-center gap-1"
            >
              新建方案 <Plus size={16} />
            </button>
          </div>
          <div className="space-y-3">
            {plans.map((plan) => {
              const hasContract = contracts.some((c) => c.planId === plan.id);
              const contract = contracts.find((c) => c.planId === plan.id);
              return (
                <div
                  key={plan.id}
                  className="p-4 rounded-xl bg-ivory-50 hover:bg-rose-gold-50 transition-colors"
                >
                  <div
                    className="flex items-center gap-4 cursor-pointer"
                    onClick={() => navigate(`/company/plan/${plan.id}`)}
                  >
                    <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center shadow-soft">
                      <span className="text-2xl">💒</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-rose-gold-800">{plan.coupleName}</p>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            plan.status === 'confirmed'
                              ? 'bg-emerald-100 text-emerald-600'
                              : plan.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-600'
                              : 'bg-fog-100 text-fog-500'
                          }`}
                        >
                          {plan.status === 'confirmed'
                            ? '已确认'
                            : plan.status === 'pending'
                            ? '待确认'
                            : '草稿'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-sm text-fog-400">
                        <span>📅 {plan.weddingDate}</span>
                        <span>📍 {plan.venueName}</span>
                        <span>💰 ¥{plan.totalPrice.toLocaleString()}</span>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-fog-300" />
                  </div>
                  {hasContract && contract && (
                    <div className="mt-3 pt-3 border-t border-rose-gold-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileSignature size={14} className="text-rose-gold-500" />
                        <span className="text-xs text-fog-500">
                          {contract.signedByCouple && contract.signedByCompany
                            ? '合同已签署'
                            : '合同待签署'}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/contract/${contract.id}`);
                        }}
                        className="flex items-center gap-1 text-xs text-rose-gold-600 hover:text-rose-gold-700 font-medium"
                      >
                        <Eye size={14} />
                        查看合同
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 最新消息 */}
        <div className="bg-white rounded-2xl p-6 border border-rose-gold-100 shadow-soft">
          <h3 className="font-serif text-lg font-bold text-rose-gold-800 mb-5">最新消息</h3>
          <div className="space-y-3">
            {notifications.slice(0, 4).map((notif) => (
              <div
                key={notif.id}
                className={`p-3 rounded-lg ${notif.read ? 'bg-fog-50' : 'bg-blush-50 border border-blush-100'}`}
              >
                <p className={`text-sm font-medium ${notif.read ? 'text-fog-500' : 'text-rose-gold-700'}`}>
                  {notif.title}
                </p>
                <p className="text-xs text-fog-400 mt-1 line-clamp-2">{notif.content}</p>
                <p className="text-xs text-fog-300 mt-2">{notif.createdAt}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 今日任务 */}
      <div className="bg-white rounded-2xl p-6 border border-rose-gold-100 shadow-soft">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-serif text-lg font-bold text-rose-gold-800">今日待办任务</h3>
          <button
            onClick={() => navigate('/tasks')}
            className="text-sm text-rose-gold-500 hover:text-rose-gold-600 flex items-center gap-1"
          >
            查看全部 <ChevronRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {tasks.slice(0, 3).map((task) => (
            <div
              key={task.id}
              className="p-4 rounded-xl bg-gradient-to-br from-ivory-50 to-white border border-rose-gold-100"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-xl shadow-soft">
                  {task.type === 'makeup_test' && '💄'}
                  {task.type === 'rehearsal' && '🎭'}
                  {task.type === 'wedding' && '💒'}
                  {task.type === 'meeting' && '📋'}
                  {task.type === 'delivery' && '📦'}
                </div>
                <div>
                  <p className="font-medium text-rose-gold-800 text-sm">{task.title}</p>
                  <p className="text-xs text-fog-400">{task.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-rose-gold-500">
                <Clock size={12} />
                <span>负责人：{task.assignee}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
