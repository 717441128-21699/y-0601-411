import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  Heart,
  FileText,
  Calendar,
  DollarSign,
  Folder,
  Star,
  Settings,
  Bell,
  ArrowLeft,
  Sparkles,
  Building2,
  Users,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import type { UserRole } from '@/types';

const roleConfig: Record<UserRole, { name: string; icon: string; color: string; bgColor: string }> = {
  couple: { name: '新人', icon: '💕', color: 'text-burgundy-500', bgColor: 'bg-blush-50' },
  company: { name: '婚庆公司', icon: '💒', color: 'text-rose-gold-600', bgColor: 'bg-rose-gold-50' },
  supplier: { name: '供应商', icon: '🎯', color: 'text-fog-500', bgColor: 'bg-fog-50' },
  finance: { name: '财务', icon: '💰', color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
};

const navConfig: Record<UserRole, Array<{ path: string; label: string; icon: typeof Home }>> = {
  couple: [
    { path: '/couple', label: '工作台', icon: Home },
    { path: '/couple/preference', label: '需求设置', icon: Heart },
    { path: '/couple/recommendation', label: '推荐报告', icon: Sparkles },
    { path: '/tasks', label: '任务时间轴', icon: Calendar },
    { path: '/couple/payment', label: '支付管理', icon: DollarSign },
    { path: '/couple/files', label: '文件中心', icon: Folder },
    { path: '/couple/reviews', label: '评价排行', icon: Star },
  ],
  company: [
    { path: '/company', label: '工作台', icon: Home },
    { path: '/company/plan/create', label: '创建方案', icon: FileText },
    { path: '/tasks', label: '任务时间轴', icon: Calendar },
    { path: '/contract/contract-001', label: '合同管理', icon: FileText },
    { path: '/files', label: '文件中心', icon: Folder },
  ],
  supplier: [
    { path: '/supplier', label: '工作台', icon: Home },
    { path: '/supplier/quotes', label: '报价管理', icon: DollarSign },
    { path: '/tasks', label: '任务时间轴', icon: Calendar },
    { path: '/files', label: '交付文件', icon: Folder },
  ],
  finance: [
    { path: '/finance', label: '数据看板', icon: Home },
    { path: '/finance/orders', label: '订单管理', icon: FileText },
    { path: '/finance/vendors', label: '供应商统计', icon: Users },
  ],
};

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentRole, setCurrentRole, notifications } = useAppStore();

  if (!currentRole) {
    return <Outlet />;
  }

  const config = roleConfig[currentRole];
  const navItems = navConfig[currentRole];
  const unreadCount = notifications.filter((n) => !n.read && n.targetRole.includes(currentRole)).length;

  return (
    <div className="min-h-screen bg-ivory-50 flex">
      {/* 侧边栏 */}
      <aside className="w-64 bg-white border-r border-rose-gold-100 flex flex-col">
        {/* Logo 区 */}
        <div className="p-6 border-b border-rose-gold-100">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${config.bgColor} flex items-center justify-center text-xl`}>
              {config.icon}
            </div>
            <div>
              <h1 className="font-serif text-lg font-bold text-rose-gold-800">良缘</h1>
              <p className="text-xs text-fog-300">{config.name}端</p>
            </div>
          </div>
        </div>

        {/* 导航菜单 */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.path ||
              (item.path !== `/${currentRole}` && location.pathname.startsWith(item.path));
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm ${
                  isActive
                    ? 'bg-rose-gold-100 text-rose-gold-700 font-medium'
                    : 'text-fog-500 hover:bg-rose-gold-50 hover:text-rose-gold-600'
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* 底部 */}
        <div className="p-4 border-t border-rose-gold-100 space-y-2">
          <button
            onClick={() => setCurrentRole(null)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-fog-500 hover:bg-rose-gold-50 hover:text-rose-gold-600 transition-all duration-200"
          >
            <ArrowLeft size={18} />
            <span>切换角色</span>
          </button>
        </div>
      </aside>

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col">
        {/* 顶部导航 */}
        <header className="h-16 bg-white border-b border-rose-gold-100 flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-medium text-rose-gold-800">
              {navItems.find((n) => location.pathname.startsWith(n.path) && n.path !== `/${currentRole}`)?.label ||
                navItems[0]?.label}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-lg hover:bg-rose-gold-50 transition-colors">
              <Bell size={20} className="text-fog-300" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-burgundy-500 rounded-full text-xs text-white flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full ${config.bgColor} flex items-center justify-center`}>
                {config.icon}
              </div>
              <span className="text-sm text-rose-gold-700">
                {currentRole === 'couple' && '林小雨'}
                {currentRole === 'company' && '良缘婚庆'}
                {currentRole === 'supplier' && '时光映画'}
                {currentRole === 'finance' && '财务管理员'}
              </span>
            </div>
          </div>
        </header>

        {/* 页面内容 */}
        <main className="flex-1 p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
