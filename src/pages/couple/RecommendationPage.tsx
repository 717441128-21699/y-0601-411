import { useState } from 'react';
import { Star, Check, ChevronDown, ChevronUp, Sparkles, Heart } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { vendorTypeLabels, vendorTypeIcons } from '@/data/mockData';
import type { VendorType } from '@/types';

export default function RecommendationPage() {
  const { recommendationResult, couple } = useAppStore();
  const [expandedCompany, setExpandedCompany] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'companies' | 'vendors'>('companies');

  if (!recommendationResult) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">💝</div>
        <h3 className="text-xl font-medium text-rose-gold-700 mb-2">暂无推荐</h3>
        <p className="text-fog-400">请先填写您的婚礼需求，我们将为您生成专属推荐</p>
      </div>
    );
  }

  const { companies, vendorCombos } = recommendationResult;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up">
      {/* 报告头部 */}
      <div className="bg-gradient-to-r from-rose-gold-500 via-rose-gold-400 to-blush-300 rounded-2xl p-8 text-white mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/3 translate-x-1/3" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Sparkles className="text-white" size={24} />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold">专属推荐报告</h2>
              <p className="text-rose-gold-100 text-sm">基于您的预算和偏好智能匹配</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6 mt-6">
            <div>
              <p className="text-rose-gold-100 text-sm mb-1">预算匹配度</p>
              <p className="font-serif text-3xl font-bold">95%</p>
            </div>
            <div>
              <p className="text-rose-gold-100 text-sm mb-1">推荐组合</p>
              <p className="font-serif text-3xl font-bold">{companies.length + vendorCombos.length}</p>
              <p className="text-xs text-rose-gold-100">个方案</p>
            </div>
            <div>
              <p className="text-rose-gold-100 text-sm mb-1">预计总价</p>
              <p className="font-serif text-3xl font-bold">
                ¥{(couple.budget * 0.95 / 10000).toFixed(1)}万
              </p>
              <p className="text-xs text-rose-gold-100">起</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab 切换 */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('companies')}
          className={`px-6 py-3 rounded-xl font-medium transition-all ${
            activeTab === 'companies'
              ? 'bg-rose-gold-500 text-white shadow-md'
              : 'bg-white text-rose-gold-600 border border-rose-gold-200 hover:bg-rose-gold-50'
          }`}
        >
          🏢 婚庆公司推荐
        </button>
        <button
          onClick={() => setActiveTab('vendors')}
          className={`px-6 py-3 rounded-xl font-medium transition-all ${
            activeTab === 'vendors'
              ? 'bg-rose-gold-500 text-white shadow-md'
              : 'bg-white text-rose-gold-600 border border-rose-gold-200 hover:bg-rose-gold-50'
          }`}
        >
          🎯 供应商组合
        </button>
      </div>

      {/* 婚庆公司推荐 */}
      {activeTab === 'companies' && (
        <div className="space-y-4">
          {companies.map((item, index) => {
            const isExpanded = expandedCompany === item.company.id;
            return (
              <div
                key={item.company.id}
                className="bg-white rounded-2xl border border-rose-gold-100 shadow-soft overflow-hidden hover:shadow-card transition-shadow"
              >
                <div
                  className="p-6 cursor-pointer"
                  onClick={() => setExpandedCompany(isExpanded ? null : item.company.id)}
                >
                  <div className="flex items-start gap-5">
                    {/* 排名徽章 */}
                    <div className="flex-shrink-0">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
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
                    </div>

                    {/* 公司信息 */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 rounded-xl bg-rose-gold-50 flex items-center justify-center text-3xl">
                            {item.company.logo}
                          </div>
                          <div>
                            <h3 className="font-serif text-xl font-bold text-rose-gold-800">
                              {item.company.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center gap-1">
                                <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                <span className="text-sm font-medium text-rose-gold-700">
                                  {item.company.rating}
                                </span>
                              </div>
                              <span className="text-xs text-fog-300">|</span>
                              <span className="text-xs text-fog-400">{item.company.caseCount} 个案例</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-fog-400">价格区间</p>
                          <p className="font-bold text-rose-gold-600">
                            ¥{(item.company.priceRange[0] / 10000).toFixed(1)}万 - {(item.company.priceRange[1] / 10000).toFixed(1)}万
                          </p>
                        </div>
                      </div>

                      {/* 标签 */}
                      <div className="flex items-center gap-2 mt-3">
                        {item.company.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-rose-gold-50 text-rose-gold-600 rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* 推荐理由 */}
                      <div className="mt-4 flex items-center gap-2">
                        <span className="text-xs text-fog-400">匹配度</span>
                        <div className="flex-1 h-2 bg-rose-gold-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-rose-gold-400 to-rose-gold-500 rounded-full transition-all duration-500"
                            style={{ width: `${item.matchScore}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold text-rose-gold-600">{item.matchScore}%</span>
                      </div>
                    </div>

                    {/* 展开按钮 */}
                    <button className="p-2 text-fog-300 hover:text-rose-gold-500">
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>
                </div>

                {/* 展开详情 */}
                {isExpanded && (
                  <div className="px-6 pb-6 pt-2 border-t border-rose-gold-50">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-rose-gold-700 mb-3 flex items-center gap-2">
                          <Sparkles size={14} className="text-rose-gold-500" />
                          推荐理由
                        </h4>
                        <ul className="space-y-2">
                          {item.reasons.map((reason, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-fog-500">
                              <Check size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                              {reason}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-rose-gold-700 mb-3">公司简介</h4>
                        <p className="text-sm text-fog-500 leading-relaxed">
                          {item.company.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3 mt-5">
                      <button className="flex-1 py-3 rounded-xl bg-rose-gold-500 text-white hover:bg-rose-gold-600 transition-colors font-medium">
                        立即预约
                      </button>
                      <button className="px-6 py-3 rounded-xl border border-rose-gold-200 text-rose-gold-600 hover:bg-rose-gold-50 transition-colors">
                        查看详情
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 供应商组合推荐 */}
      {activeTab === 'vendors' && (
        <div className="space-y-6">
          {vendorCombos.map((combo, comboIndex) => (
            <div
              key={comboIndex}
              className="bg-white rounded-2xl border border-rose-gold-100 shadow-soft overflow-hidden"
            >
              {/* 组合头部 */}
              <div className="bg-gradient-to-r from-blush-50 to-rose-gold-50 p-6 border-b border-rose-gold-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-2xl shadow-soft">
                      💝
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-bold text-rose-gold-800">
                        推荐组合 #{comboIndex + 1}
                      </h3>
                      <p className="text-sm text-fog-400">黄金搭配，性价比之选</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-fog-400">组合总价</p>
                    <p className="font-serif text-2xl font-bold text-rose-gold-600">
                      ¥{combo.totalPrice.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* 推荐理由 */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {combo.reasons.map((reason, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-white/80 text-rose-gold-600 rounded-full text-xs border border-rose-gold-100"
                    >
                      ✨ {reason}
                    </span>
                  ))}
                </div>
              </div>

              {/* 供应商列表 */}
              <div className="p-6 space-y-4">
                {Object.entries(combo.vendors).map(([type, vendor]) => {
                  const vendorType = type as VendorType;
                  return (
                    <div
                      key={vendor.id}
                      className="flex items-center gap-4 p-4 rounded-xl bg-ivory-50 hover:bg-rose-gold-50 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-2xl shadow-soft">
                        {vendorTypeIcons[vendorType]}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-0.5 bg-rose-gold-100 text-rose-gold-600 rounded">
                            {vendorTypeLabels[vendorType]}
                          </span>
                          <h4 className="font-medium text-rose-gold-800">{vendor.name}</h4>
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="flex items-center gap-1">
                            <Star size={12} className="text-yellow-400 fill-yellow-400" />
                            <span className="text-xs text-rose-gold-600">{vendor.rating}</span>
                          </div>
                          <span className="text-xs text-fog-400">
                            {vendor.reviewCount} 条评价
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-rose-gold-600">¥{vendor.price.toLocaleString()}</p>
                        <p className="text-xs text-emerald-500">档期可用 ✓</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 操作按钮 */}
              <div className="px-6 pb-6">
                <button className="w-full py-3 rounded-xl bg-burgundy-500 text-white hover:bg-burgundy-600 transition-colors font-medium flex items-center justify-center gap-2">
                  <Heart size={18} />
                  选择此组合
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
