import { useNavigate } from 'react-router-dom';
import { Package, Calendar, DollarSign, FileUp, ChevronRight, Clock, Star } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export default function SupplierDashboard() {
  const navigate = useNavigate();
  const { tasks, notifications, reviews } = useAppStore();

  const pendingTasks = tasks.filter((t) => t.status !== 'completed').length;
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '4.9';

  const stats = [
    { label: '推荐订单', value: 3, icon: Package, color: 'text-rose-gold-600', bg: 'bg-rose-gold-50' },
    { label: '进行中任务', value: pendingTasks, icon: Calendar, color: 'text-burgundy-500', bg: 'bg-blush-50' },
    { label: '本月收入', value: '¥2.8万', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: '客户评分', value: avgRating, icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-50' },
  ];

  const recommendedOrders = [
    { id: 'order-001', couple: '林小姐 & 张先生', date: '2026-10-18', budget: 150000, style: '浪漫唯美' },
    { id: 'order-002', couple: '王女士 & 李先生', date: '2026-11-05', budget: 200000, style: '奢华宫廷' },
    { id: 'order-003', couple: '陈小姐 & 刘先生', date: '2026-12-12', budget: 120000, style: '森系自然' },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* 顶部欢迎 */}
      <div className="bg-gradient-to-r from-fog-500 via-fog-500 to-rose-gold-500 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-72 h-72 bg-white/10 rounded-full -translate-y-1/3 translate-x-1/4" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-white/80 mb-2">欢迎回来，时光映画</p>
            <h2 className="font-serif text-3xl font-bold mb-2">您有 3 个新订单可报价</h2>
            <p className="text-white/80">本月已完成 5 单，继续加油！</p>
          </div>
          <button
            onClick={() => navigate('/supplier/quotes')}
            className="flex items-center gap-2 px-6 py-3 bg-white text-fog-600 rounded-xl font-medium hover:bg-fog-50 transition-colors shadow-lg"
          >
            查看推荐订单
            <ChevronRight size={20} />
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
        {/* 推荐订单 */}
        <div className="col-span-2 bg-white rounded-2xl p-6 border border-rose-gold-100 shadow-soft">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-serif text-lg font-bold text-rose-gold-800">推荐订单</h3>
            <button
              onClick={() => navigate('/supplier/quotes')}
              className="text-sm text-rose-gold-500 hover:text-rose-gold-600 flex items-center gap-1"
            >
              全部订单 <ChevronRight size={16} />
            </button>
          </div>
          <div className="space-y-3">
            {recommendedOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center gap-4 p-4 rounded-xl bg-ivory-50 hover:bg-rose-gold-50 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-2xl shadow-soft">
                  💒
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-rose-gold-800">{order.couple}</p>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-600 rounded text-xs">
                      可接单
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-sm text-fog-400">
                    <span>📅 {order.date}</span>
                    <span>💰 预算{(order.budget / 10000).toFixed(0)}万</span>
                    <span>🎨 {order.style}</span>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/supplier/quotes')}
                  className="px-4 py-2 bg-rose-gold-500 text-white rounded-lg text-sm hover:bg-rose-gold-600 transition-colors"
                >
                  去报价
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 最新消息 */}
        <div className="bg-white rounded-2xl p-6 border border-rose-gold-100 shadow-soft">
          <h3 className="font-serif text-lg font-bold text-rose-gold-800 mb-5">最新消息</h3>
          <div className="space-y-3">
            {notifications.filter(n => n.targetRole.includes('supplier')).concat(notifications.slice(0, 2)).slice(0, 4).map((notif, i) => (
              <div
                key={i}
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

      {/* 任务时间轴预览 */}
      <div className="bg-white rounded-2xl p-6 border border-rose-gold-100 shadow-soft">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-serif text-lg font-bold text-rose-gold-800">我的任务</h3>
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
              className={`p-4 rounded-xl border ${
                task.status === 'completed'
                  ? 'bg-fog-50 border-fog-100'
                  : 'bg-gradient-to-br from-ivory-50 to-white border-rose-gold-100'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${
                  task.status === 'completed' ? 'bg-fog-100' : 'bg-white shadow-soft'
                }`}>
                  {task.type === 'makeup_test' && '💄'}
                  {task.type === 'rehearsal' && '🎭'}
                  {task.type === 'wedding' && '💒'}
                  {task.type === 'meeting' && '📋'}
                  {task.type === 'delivery' && '📦'}
                </div>
                <div>
                  <p className={`font-medium text-sm ${
                    task.status === 'completed' ? 'text-fog-400' : 'text-rose-gold-800'
                  }`}>
                    {task.title}
                  </p>
                  <p className="text-xs text-fog-400">{task.date}</p>
                </div>
              </div>
              {task.status !== 'completed' && (
                <div className="flex items-center gap-1 text-xs text-rose-gold-500">
                  <Clock size={12} />
                  <span>即将到来</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
