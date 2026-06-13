import { useNavigate } from 'react-router-dom';
import { Heart, Building2, Package, PieChart } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import type { UserRole } from '@/types';

const roles: Array<{
  id: UserRole;
  title: string;
  subtitle: string;
  description: string;
  icon: typeof Heart;
  gradient: string;
  features: string[];
}> = [
  {
    id: 'couple',
    title: '新人',
    subtitle: 'Couple',
    description: '开启您的完美婚礼之旅',
    icon: Heart,
    gradient: 'from-blush-100 via-blush-50 to-white',
    features: ['智能匹配婚庆公司', '查看推荐报告', '在线签署合同', '分阶段支付'],
  },
  {
    id: 'company',
    title: '婚庆公司',
    subtitle: 'Wedding Company',
    description: '高效管理婚礼项目',
    icon: Building2,
    gradient: 'from-rose-gold-100 via-rose-gold-50 to-white',
    features: ['创建婚礼方案', '档期冲突检测', '电子合同签署', '任务进度追踪'],
  },
  {
    id: 'supplier',
    title: '供应商',
    subtitle: 'Vendor',
    description: '接单报价高效协作',
    icon: Package,
    gradient: 'from-fog-100 via-fog-50 to-white',
    features: ['查看推荐订单', '在线报价', '任务时间轴', '交付物管理'],
  },
  {
    id: 'finance',
    title: '财务',
    subtitle: 'Finance',
    description: '数据驱动运营决策',
    icon: PieChart,
    gradient: 'from-emerald-100 via-emerald-50 to-white',
    features: ['营收数据看板', '供应商排行', '月度报表', '纠纷率监控'],
  },
];

export default function EntryPage() {
  const navigate = useNavigate();
  const { setCurrentRole } = useAppStore();

  const handleRoleSelect = (role: UserRole) => {
    setCurrentRole(role);
    navigate(`/${role}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ivory-50 via-blush-50 to-rose-gold-50 relative overflow-hidden">
      {/* 装饰性背景元素 */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blush-200 rounded-full opacity-20 blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-rose-gold-200 rounded-full opacity-20 blur-3xl" />
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-fog-100 rounded-full opacity-30 blur-3xl" />

      <div className="relative z-10">
        {/* 顶部标题区 */}
        <header className="pt-16 pb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-rose-gold-200 mb-6">
            <span className="text-2xl">💍</span>
            <span className="text-sm font-medium text-rose-gold-600">一站式婚庆策划协同平台</span>
          </div>
          <h1 className="font-serif text-5xl font-bold text-rose-gold-800 mb-4 tracking-wide">
            良 缘
          </h1>
          <p className="text-lg text-fog-500 max-w-lg mx-auto">
            连接新人、婚庆公司、供应商与财务，让每一场婚礼都成为最美的记忆
          </p>
        </header>

        {/* 角色选择卡片 */}
        <main className="max-w-6xl mx-auto px-8 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roles.map((role, index) => {
              const Icon = role.icon;
              return (
                <button
                  key={role.id}
                  onClick={() => handleRoleSelect(role.id)}
                  style={{ animationDelay: `${index * 100}ms` }}
                  className={`group relative bg-gradient-to-br ${role.gradient} rounded-2xl p-6 text-left transition-all duration-300 hover:scale-105 hover:shadow-cardHover border border-white/60 backdrop-blur-sm animate-fade-in-up`}
                >
                  {/* 图标 */}
                  <div className="w-14 h-14 rounded-xl bg-white/80 backdrop-blur flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-soft">
                    <Icon size={28} className="text-rose-gold-600" />
                  </div>

                  {/* 标题 */}
                  <h3 className="font-serif text-2xl font-bold text-rose-gold-800 mb-1">
                    {role.title}
                  </h3>
                  <p className="text-xs text-rose-gold-400 uppercase tracking-wider mb-3">
                    {role.subtitle}
                  </p>
                  <p className="text-sm text-fog-500 mb-4">{role.description}</p>

                  {/* 功能列表 */}
                  <ul className="space-y-2 mb-5">
                    {role.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-xs text-fog-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-gold-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* 进入按钮 */}
                  <div className="flex items-center gap-2 text-rose-gold-600 text-sm font-medium group-hover:text-rose-gold-700">
                    <span>立即进入</span>
                    <svg
                      className="w-4 h-4 transition-transform group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>

                  {/* 悬浮光效 */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </button>
              );
            })}
          </div>

          {/* 数据展示 */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '500+', label: '合作供应商' },
              { value: '2000+', label: '成功婚礼' },
              { value: '98.5%', label: '客户满意度' },
              { value: '4.9', label: '平均评分' },
            ].map((stat, index) => (
              <div
                key={stat.label}
                style={{ animationDelay: `${400 + index * 100}ms` }}
                className="bg-white/60 backdrop-blur-sm rounded-xl p-5 text-center border border-rose-gold-100 animate-fade-in-up"
              >
                <p className="font-serif text-3xl font-bold text-rose-gold-700 mb-1">{stat.value}</p>
                <p className="text-sm text-fog-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </main>

        {/* 底部 */}
        <footer className="text-center pb-8 text-sm text-fog-300">
          <p>© 2026 良缘婚庆策划平台 · 让爱更简单</p>
        </footer>
      </div>
    </div>
  );
}
