import { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  FileText,
  Users,
  AlertTriangle,
  Calendar,
  ChevronRight,
  BarChart3,
  PieChart,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { vendorTypeLabels } from '@/data/mockData';

export default function FinanceDashboard() {
  const { financeStats } = useAppStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'vendors' | 'orders'>('overview');

  const statCards = [
    {
      label: '本月总营收',
      value: `¥${(financeStats.totalRevenue / 10000).toFixed(1)}万`,
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: '订单总数',
      value: financeStats.totalOrders,
      change: '+8.3%',
      trend: 'up',
      icon: FileText,
      color: 'text-rose-gold-600',
      bg: 'bg-rose-gold-50',
    },
    {
      label: '完成率',
      value: `${financeStats.completionRate}%`,
      change: '+2.1%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: '纠纷率',
      value: `${financeStats.disputeRate}%`,
      change: '-0.5%',
      trend: 'down',
      icon: AlertTriangle,
      color: 'text-burgundy-500',
      bg: 'bg-blush-50',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* 顶部欢迎 */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-72 h-72 bg-white/10 rounded-full -translate-y-1/3 translate-x-1/4" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-emerald-100 mb-2">财务管理员，您好</p>
            <h2 className="font-serif text-3xl font-bold mb-2">2026年6月运营数据</h2>
            <p className="text-emerald-100">数据更新时间：2026-06-13 10:30</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-white text-emerald-600 rounded-xl font-medium hover:bg-emerald-50 transition-colors shadow-lg">
            <FileText size={20} />
            导出报表
          </button>
        </div>
      </div>

      {/* Tab 切换 */}
      <div className="flex gap-2">
        {[
          { key: 'overview', label: '数据概览', icon: BarChart3 },
          { key: 'vendors', label: '供应商排行', icon: Users },
          { key: 'orders', label: '订单管理', icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-rose-gold-500 text-white shadow-md'
                  : 'bg-white text-rose-gold-600 border border-rose-gold-200 hover:bg-rose-gold-50'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'overview' && (
        <>
          {/* 数据卡片 */}
          <div className="grid grid-cols-4 gap-4">
            {statCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.label}
                  className="bg-white rounded-2xl p-6 border border-rose-gold-100 shadow-soft hover:shadow-card transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center`}>
                      <Icon size={24} className={card.color} />
                    </div>
                    <div
                      className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                        card.trend === 'up'
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-red-50 text-red-500'
                      }`}
                    >
                      {card.trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {card.change}
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-rose-gold-800 mt-4">{card.value}</p>
                  <p className="text-sm text-fog-400 mt-1">{card.label}</p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* 月度营收趋势 */}
            <div className="col-span-2 bg-white rounded-2xl p-6 border border-rose-gold-100 shadow-soft">
              <h3 className="font-serif text-lg font-bold text-rose-gold-800 mb-6">月度营收趋势</h3>
              <div className="h-64 flex items-end justify-between gap-3">
                {financeStats.monthlyRevenue.map((item, index) => {
                  const maxRevenue = Math.max(...financeStats.monthlyRevenue.map((m) => m.revenue));
                  const height = (item.revenue / maxRevenue) * 100;
                  return (
                    <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                      <span className="text-xs text-fog-500">
                        ¥{(item.revenue / 10000).toFixed(0)}万
                      </span>
                      <div
                        className="w-full bg-gradient-to-t from-rose-gold-500 to-rose-gold-300 rounded-t-lg transition-all duration-500 hover:from-rose-gold-600 hover:to-rose-gold-400"
                        style={{ height: `${height}%`, minHeight: '20px' }}
                      />
                      <span className="text-xs text-fog-400">{item.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 订单分布 */}
            <div className="bg-white rounded-2xl p-6 border border-rose-gold-100 shadow-soft">
              <h3 className="font-serif text-lg font-bold text-rose-gold-800 mb-6">服务类型占比</h3>
              <div className="flex flex-col items-center justify-center h-64">
                <div className="relative w-40 h-40">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#F9EDE2" strokeWidth="12" />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#D4A574"
                      strokeWidth="12"
                      strokeDasharray="125.6 251.2"
                      strokeLinecap="round"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#722F37"
                      strokeWidth="12"
                      strokeDasharray="75.4 251.2"
                      strokeDashoffset="-125.6"
                      strokeLinecap="round"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#A8B5C4"
                      strokeWidth="12"
                      strokeDasharray="50.2 251.2"
                      strokeDashoffset="-201"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-rose-gold-800">32</span>
                    <span className="text-xs text-fog-400">总订单</span>
                  </div>
                </div>
                <div className="mt-6 space-y-2 w-full">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-rose-gold-500" />
                      <span className="text-fog-500">摄影</span>
                    </div>
                    <span className="font-medium text-rose-gold-700">50%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-burgundy-500" />
                      <span className="text-fog-500">化妆</span>
                    </div>
                    <span className="font-medium text-rose-gold-700">30%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-fog-300" />
                      <span className="text-fog-500">其他</span>
                    </div>
                    <span className="font-medium text-rose-gold-700">20%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'vendors' && (
        <div className="bg-white rounded-2xl border border-rose-gold-100 shadow-soft overflow-hidden">
          <div className="p-6 border-b border-rose-gold-100">
            <h3 className="font-serif text-lg font-bold text-rose-gold-800">供应商收入排行</h3>
          </div>
          <div className="divide-y divide-rose-gold-50">
            {financeStats.topVendors.map((vendor, index) => (
              <div key={vendor.id} className="p-5 flex items-center gap-4 hover:bg-rose-gold-50/30 transition-colors">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0
                      ? 'bg-gradient-to-br from-yellow-300 to-yellow-500 text-white'
                      : index === 1
                      ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white'
                      : index === 2
                      ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white'
                      : 'bg-fog-100 text-fog-500'
                  }`}
                >
                  {index + 1}
                </div>

                <div className="w-12 h-12 rounded-xl bg-rose-gold-50 flex items-center justify-center text-2xl">
                  {vendor.type === 'photography' && '📷'}
                  {vendor.type === 'makeup' && '💄'}
                  {vendor.type === 'host' && '🎤'}
                  {vendor.type === 'venue' && '🏨'}
                  {vendor.type === 'flower' && '💐'}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-rose-gold-800">{vendor.name}</h4>
                    <span className="text-xs px-2 py-0.5 bg-rose-gold-100 text-rose-gold-600 rounded">
                      {vendorTypeLabels[vendor.type]}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-xs text-fog-400">
                    <span>接单 {vendor.orderCount} 单</span>
                    <span>⭐ {vendor.rating} 分</span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-bold text-rose-gold-600">¥{(vendor.revenue / 10000).toFixed(1)}万</p>
                  <p className="text-xs text-fog-400">本月营收</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl p-6 border border-rose-gold-100 shadow-soft">
          <h3 className="font-serif text-lg font-bold text-rose-gold-800 mb-4">订单管理</h3>
          <div className="text-center py-16 text-fog-400">
            <FileText size={48} className="mx-auto mb-3 opacity-30" />
            <p>订单列表功能开发中...</p>
          </div>
        </div>
      )}
    </div>
  );
}
