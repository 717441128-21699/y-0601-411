import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Users,
  Camera,
  Sparkles,
  AlertCircle,
  CheckCircle,
  Lock,
  FileText,
  ChevronRight,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { vendorTypeLabels, vendorTypeIcons } from '@/data/mockData';
import type { VendorType } from '@/types';

export default function PlanCreatePage() {
  const navigate = useNavigate();
  const { vendors, checkScheduleConflict, addPlan } = useAppStore();
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    coupleName: '',
    weddingDate: '2026-10-18',
    venueId: 'venue-001',
    guestCount: 200,
    selectedVendors: ['photo-001', 'makeup-001', 'host-001'],
  });

  const [conflictResult, setConflictResult] = useState<{
    hasConflict: boolean;
    conflicts: string[];
  } | null>(null);

  const [planLocked, setPlanLocked] = useState(false);

  const venueVendors = vendors.filter((v) => v.type === 'venue');
  const photographyVendors = vendors.filter((v) => v.type === 'photography');
  const makeupVendors = vendors.filter((v) => v.type === 'makeup');
  const hostVendors = vendors.filter((v) => v.type === 'host');

  const handleInputChange = (field: string, value: string | number | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setConflictResult(null);
    setPlanLocked(false);
  };

  const toggleVendor = (vendorId: string) => {
    setFormData((prev) => {
      const newVendors = prev.selectedVendors.includes(vendorId)
        ? prev.selectedVendors.filter((id) => id !== vendorId)
        : [...prev.selectedVendors, vendorId];
      return { ...prev, selectedVendors: newVendors };
    });
    setConflictResult(null);
    setPlanLocked(false);
  };

  const handleCheckConflict = () => {
    const allIds = [...formData.selectedVendors, formData.venueId];
    const result = checkScheduleConflict(allIds, formData.weddingDate);
    setConflictResult(result);
    if (!result.hasConflict) {
      setPlanLocked(true);
    }
  };

  const handleCreatePlan = () => {
    const totalPrice = formData.selectedVendors.reduce((sum, id) => {
      const vendor = vendors.find((v) => v.id === id);
      return sum + (vendor?.price || 0);
    }, 0);

    const venue = vendors.find((v) => v.id === formData.venueId);
    const vendorNames: Record<string, string> = {};
    formData.selectedVendors.forEach((id) => {
      const v = vendors.find((vendor) => vendor.id === id);
      if (v) vendorNames[id] = v.name;
    });

    const newPlan = {
      id: `plan-${Date.now()}`,
      coupleId: 'couple-001',
      coupleName: formData.coupleName || '新人大数据',
      companyId: 'company-001',
      companyName: '良缘婚庆策划',
      venueId: formData.venueId,
      venueName: venue?.name || '',
      weddingDate: formData.weddingDate,
      vendors: formData.selectedVendors,
      vendorNames,
      status: 'pending' as const,
      totalPrice: totalPrice + 50000,
      createdAt: new Date().toISOString().split('T')[0],
      guestCount: formData.guestCount,
    };

    addPlan(newPlan);
    navigate('/company');
  };

  const renderVendorCard = (vendor: typeof vendors[0], selected: boolean) => (
    <button
      key={vendor.id}
      onClick={() => toggleVendor(vendor.id)}
      className={`p-4 rounded-xl text-left transition-all ${
        selected
          ? 'bg-rose-gold-500 text-white shadow-md ring-2 ring-rose-gold-300'
          : 'bg-white border border-rose-gold-100 hover:border-rose-gold-300 hover:shadow-soft'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${
            selected ? 'bg-white/20' : 'bg-rose-gold-50'
          }`}
        >
          {vendorTypeIcons[vendor.type as VendorType]}
        </div>
        <div className="flex-1">
          <p className={`font-medium text-sm ${selected ? 'text-white' : 'text-rose-gold-800'}`}>
            {vendor.name}
          </p>
          <p className={`text-xs mt-0.5 ${selected ? 'text-rose-gold-100' : 'text-fog-400'}`}>
            ⭐ {vendor.rating} · ¥{vendor.price.toLocaleString()}
          </p>
        </div>
        {selected && <CheckCircle size={18} className="text-white" />}
      </div>
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up">
      {/* 步骤条 */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-2xl font-bold text-rose-gold-800">创建婚礼方案</h2>
          <span className="text-sm text-fog-400">第 {step} / 3 步</span>
        </div>
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1 flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  s <= step
                    ? 'bg-rose-gold-500 text-white'
                    : 'bg-rose-gold-100 text-rose-gold-400'
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`flex-1 h-1 rounded-full ${
                    s < step ? 'bg-rose-gold-500' : 'bg-rose-gold-100'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-fog-400">
          <span>基本信息</span>
          <span>选配供应商</span>
          <span>冲突检测 & 确认</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-rose-gold-100 shadow-soft overflow-hidden">
        {/* 步骤1：基本信息 */}
        {step === 1 && (
          <div className="p-8 space-y-6">
            <h3 className="font-serif text-xl font-bold text-rose-gold-800 flex items-center gap-2">
              <FileText size={20} className="text-rose-gold-500" />
              方案基本信息
            </h3>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-rose-gold-700 mb-2">
                  新人姓名
                </label>
                <input
                  type="text"
                  value={formData.coupleName}
                  onChange={(e) => handleInputChange('coupleName', e.target.value)}
                  placeholder="例如：张小姐 & 李先生"
                  className="w-full px-4 py-3 rounded-xl border border-rose-gold-200 focus:border-rose-gold-500 focus:ring-2 focus:ring-rose-gold-100 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-rose-gold-700 mb-2 flex items-center gap-2">
                  <Calendar size={16} />
                  婚礼日期
                </label>
                <input
                  type="date"
                  value={formData.weddingDate}
                  onChange={(e) => handleInputChange('weddingDate', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-rose-gold-200 focus:border-rose-gold-500 focus:ring-2 focus:ring-rose-gold-100 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-rose-gold-700 mb-2 flex items-center gap-2">
                  <MapPin size={16} />
                  婚礼场地
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {venueVendors.map((venue) => (
                    <button
                      key={venue.id}
                      onClick={() => handleInputChange('venueId', venue.id)}
                      className={`p-3 rounded-xl text-left transition-all ${
                        formData.venueId === venue.id
                          ? 'bg-rose-gold-500 text-white shadow-md'
                          : 'bg-rose-gold-50 text-rose-gold-700 hover:bg-rose-gold-100'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🏨</span>
                        <div>
                          <p className="text-sm font-medium">{venue.name}</p>
                          <p className={`text-xs ${formData.venueId === venue.id ? 'text-rose-gold-100' : 'text-fog-400'}`}>
                            ¥{venue.price}/桌
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-rose-gold-700 mb-2 flex items-center gap-2">
                  <Users size={16} />
                  预计宾客数
                </label>
                <input
                  type="number"
                  value={formData.guestCount}
                  onChange={(e) => handleInputChange('guestCount', Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-rose-gold-200 focus:border-rose-gold-500 focus:ring-2 focus:ring-rose-gold-100 outline-none transition-all"
                />
                <p className="text-xs text-fog-400 mt-1">预计 20 桌，每桌 10 人</p>
              </div>
            </div>
          </div>
        )}

        {/* 步骤2：选配供应商 */}
        {step === 2 && (
          <div className="p-8 space-y-8">
            <h3 className="font-serif text-xl font-bold text-rose-gold-800 flex items-center gap-2">
              <Sparkles size={20} className="text-rose-gold-500" />
              选配供应商
            </h3>

            {/* 摄影 */}
            <div>
              <h4 className="text-sm font-medium text-rose-gold-700 mb-3 flex items-center gap-2">
                <Camera size={16} className="text-rose-gold-500" />
                摄影摄像
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {photographyVendors.map((v) =>
                  renderVendorCard(v, formData.selectedVendors.includes(v.id))
                )}
              </div>
            </div>

            {/* 化妆 */}
            <div>
              <h4 className="text-sm font-medium text-rose-gold-700 mb-3">
                💄 化妆造型
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {makeupVendors.map((v) =>
                  renderVendorCard(v, formData.selectedVendors.includes(v.id))
                )}
              </div>
            </div>

            {/* 主持 */}
            <div>
              <h4 className="text-sm font-medium text-rose-gold-700 mb-3">
                🎤 司仪主持
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {hostVendors.map((v) =>
                  renderVendorCard(v, formData.selectedVendors.includes(v.id))
                )}
              </div>
            </div>

            <div className="bg-rose-gold-50 rounded-xl p-4">
              <p className="text-sm text-rose-gold-700">
                已选择 <span className="font-bold">{formData.selectedVendors.length}</span> 位供应商
              </p>
            </div>
          </div>
        )}

        {/* 步骤3：冲突检测 & 确认 */}
        {step === 3 && (
          <div className="p-8 space-y-6">
            <h3 className="font-serif text-xl font-bold text-rose-gold-800 flex items-center gap-2">
              <AlertCircle size={20} className="text-rose-gold-500" />
              档期冲突检测
            </h3>

            {!conflictResult && (
              <div className="text-center py-10">
                <div className="w-20 h-20 bg-rose-gold-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle size={40} className="text-rose-gold-400" />
                </div>
                <p className="text-rose-gold-700 mb-2">点击下方按钮检测档期冲突</p>
                <p className="text-sm text-fog-400">系统将检测场地和所有供应商在 {formData.weddingDate} 的档期情况</p>
                <button
                  onClick={handleCheckConflict}
                  className="mt-6 px-8 py-3 bg-rose-gold-500 text-white rounded-xl font-medium hover:bg-rose-gold-600 transition-colors shadow-md"
                >
                  开始检测
                </button>
              </div>
            )}

            {conflictResult && (
              <div
                className={`p-6 rounded-xl ${
                  conflictResult.hasConflict
                    ? 'bg-red-50 border border-red-100'
                    : 'bg-emerald-50 border border-emerald-100'
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  {conflictResult.hasConflict ? (
                    <>
                      <AlertCircle size={24} className="text-red-500" />
                      <h4 className="font-medium text-red-700">检测到档期冲突</h4>
                    </>
                  ) : (
                    <>
                      <CheckCircle size={24} className="text-emerald-500" />
                      <h4 className="font-medium text-emerald-700">所有档期可用</h4>
                    </>
                  )}
                </div>

                {conflictResult.hasConflict ? (
                  <ul className="space-y-2">
                    {conflictResult.conflicts.map((name, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-red-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                        {name} - {formData.weddingDate} 档期不可用
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-emerald-600">
                    场地和所有供应商在 {formData.weddingDate} 均有空档，可以安排！
                  </p>
                )}
              </div>
            )}

            {planLocked && (
              <div className="bg-gradient-to-r from-emerald-50 to-rose-gold-50 rounded-xl p-6 border border-emerald-100">
                <div className="flex items-center gap-3 mb-3">
                  <Lock size={20} className="text-emerald-600" />
                  <h4 className="font-medium text-emerald-700">档期已锁定</h4>
                </div>
                <p className="text-sm text-emerald-600">
                  系统已为您锁定 {formData.weddingDate} 的所有档期，有效期至 2026-06-20，
                  请尽快签署合同确认订单。
                </p>
              </div>
            )}

            {/* 方案概览 */}
            {conflictResult && !conflictResult.hasConflict && (
              <div className="bg-ivory-50 rounded-xl p-5 border border-rose-gold-100">
                <h4 className="font-medium text-rose-gold-800 mb-4">方案概览</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-fog-400">新人</span>
                    <span className="text-rose-gold-700">{formData.coupleName || '待填写'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-fog-400">婚礼日期</span>
                    <span className="text-rose-gold-700">{formData.weddingDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-fog-400">场地</span>
                    <span className="text-rose-gold-700">
                      {venueVendors.find((v) => v.id === formData.venueId)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-fog-400">供应商数</span>
                    <span className="text-rose-gold-700">{formData.selectedVendors.length} 位</span>
                  </div>
                  <div className="flex justify-between col-span-2 pt-2 border-t border-rose-gold-100">
                    <span className="text-rose-gold-700 font-medium">方案总价（含策划费）</span>
                    <span className="text-rose-gold-600 font-bold text-lg">
                      ¥
                      {(
                        formData.selectedVendors.reduce((sum, id) => {
                          const v = vendors.find((vendor) => vendor.id === id);
                          return sum + (v?.price || 0);
                        }, 0) + 50000
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 底部操作 */}
        <div className="px-8 py-5 border-t border-rose-gold-100 flex justify-between">
          <button
            onClick={() => (step > 1 ? setStep(step - 1) : navigate('/company'))}
            className="px-6 py-3 rounded-xl text-rose-gold-600 hover:bg-rose-gold-50 transition-colors"
          >
            {step > 1 ? '上一步' : '取消'}
          </button>

          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-rose-gold-500 text-white hover:bg-rose-gold-600 transition-colors shadow-md"
            >
              下一步
              <ChevronRight size={18} />
            </button>
          ) : (
            <button
              onClick={handleCreatePlan}
              disabled={!planLocked}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-medium shadow-md transition-all ${
                planLocked
                  ? 'bg-burgundy-500 text-white hover:bg-burgundy-600'
                  : 'bg-fog-100 text-fog-400 cursor-not-allowed'
              }`}
            >
              <FileText size={18} />
              生成方案 & 合同
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
