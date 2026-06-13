import { useState } from 'react';
import { Star, TrendingUp, MessageSquare, ThumbsUp, Award, ChevronDown } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { vendorTypeLabels } from '@/data/mockData';

export default function ReviewsPage() {
  const { reviews, vendors, currentRole } = useAppStore();
  const [activeTab, setActiveTab] = useState<'ranking' | 'myReviews'>('ranking');
  const [selectedType, setSelectedType] = useState<string>('all');

  const vendorTypeOptions = [
    { key: 'all', label: '全部' },
    { key: 'photography', label: '摄影摄像' },
    { key: 'makeup', label: '化妆造型' },
    { key: 'host', label: '司仪主持' },
    { key: 'venue', label: '场地' },
    { key: 'flower', label: '花艺布置' },
  ];

  const vendorRankings = vendors
    .filter((v) => selectedType === 'all' || v.type === selectedType)
    .sort((a, b) => b.rating - a.rating)
    .map((vendor, index) => ({
      ...vendor,
      rank: index + 1,
    }));

  const allTags = [
    '技术专业',
    '沟通顺畅',
    '服务贴心',
    '性价比高',
    '准时到位',
    '创意十足',
    '出片率高',
    '妆容精致',
    '气场强大',
    '环境优美',
  ];

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-serif text-2xl font-bold text-rose-gold-800">评价与排行</h2>
          <p className="text-sm text-fog-400 mt-1">查看供应商满意度排行榜</p>
        </div>

        {currentRole === 'couple' && (
          <button className="flex items-center gap-2 px-5 py-2.5 bg-burgundy-500 text-white rounded-xl font-medium hover:bg-burgundy-600 transition-colors">
            <MessageSquare size={18} />
            发表评价
          </button>
        )}
      </div>

      {/* Tab 切换 */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('ranking')}
          className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'ranking'
              ? 'bg-rose-gold-500 text-white shadow-md'
              : 'bg-white text-rose-gold-600 border border-rose-gold-200 hover:bg-rose-gold-50'
          }`}
        >
          🏆 满意度排行
        </button>
        <button
          onClick={() => setActiveTab('myReviews')}
          className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'myReviews'
              ? 'bg-rose-gold-500 text-white shadow-md'
              : 'bg-white text-rose-gold-600 border border-rose-gold-200 hover:bg-rose-gold-50'
          }`}
        >
          💬 最新评价
        </button>
      </div>

      {activeTab === 'ranking' && (
        <div className="grid grid-cols-3 gap-6">
          {/* 排行榜 */}
          <div className="col-span-2 bg-white rounded-2xl border border-rose-gold-100 shadow-soft overflow-hidden">
            {/* 类型筛选 */}
            <div className="p-5 border-b border-rose-gold-100 flex items-center gap-3">
              <span className="text-sm text-fog-500">分类：</span>
              <div className="flex gap-2">
                {vendorTypeOptions.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setSelectedType(opt.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedType === opt.key
                        ? 'bg-rose-gold-500 text-white'
                        : 'bg-rose-gold-50 text-rose-gold-600 hover:bg-rose-gold-100'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-5 space-y-3">
              {vendorRankings.map((vendor) => (
                <div
                  key={vendor.id}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all hover:shadow-soft ${
                    vendor.rank <= 3 ? 'bg-gradient-to-r from-rose-gold-50 to-transparent' : 'bg-ivory-50'
                  }`}
                >
                  {/* 排名 */}
                  <div className="w-10 h-10 flex items-center justify-center">
                    {vendor.rank === 1 && (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                        1
                      </div>
                    )}
                    {vendor.rank === 2 && (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white font-bold text-lg shadow-md">
                        2
                      </div>
                    )}
                    {vendor.rank === 3 && (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center text-white font-bold text-lg shadow-md">
                        3
                      </div>
                    )}
                    {vendor.rank > 3 && (
                      <span className="text-lg font-bold text-fog-300">{vendor.rank}</span>
                    )}
                  </div>

                  {/* 供应商信息 */}
                  <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center text-3xl shadow-soft">
                    {vendor.type === 'photography' && '📷'}
                    {vendor.type === 'makeup' && '💄'}
                    {vendor.type === 'host' && '🎤'}
                    {vendor.type === 'venue' && '🏨'}
                    {vendor.type === 'flower' && '💐'}
                    {vendor.type === 'catering' && '🍽️'}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-rose-gold-800">{vendor.name}</h4>
                      <span className="text-xs px-2 py-0.5 bg-rose-gold-100 text-rose-gold-600 rounded">
                        {vendorTypeLabels[vendor.type]}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1">
                        <Star size={14} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-bold text-rose-gold-700">{vendor.rating}</span>
                      </div>
                      <span className="text-xs text-fog-400">{vendor.reviewCount} 条评价</span>
                    </div>
                  </div>

                  {/* 价格 */}
                  <div className="text-right">
                    <p className="font-bold text-rose-gold-600">¥{vendor.price.toLocaleString()}</p>
                    <p className="text-xs text-fog-400">起</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 好评词云 */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-rose-gold-100 shadow-soft">
              <h3 className="font-serif text-lg font-bold text-rose-gold-800 mb-4 flex items-center gap-2">
                <Award size={20} className="text-rose-gold-500" />
                好评标签
              </h3>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag, index) => (
                  <span
                    key={tag}
                    className={`px-3 py-1.5 rounded-full text-sm ${
                      index < 3
                        ? 'bg-rose-gold-500 text-white font-medium'
                        : index < 7
                        ? 'bg-rose-gold-100 text-rose-gold-700'
                        : 'bg-fog-100 text-fog-500'
                    }`}
                    style={{ fontSize: `${12 + (allTags.length - index) * 0.5}px` }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blush-50 to-rose-gold-50 rounded-2xl p-6 border border-rose-gold-100">
              <h3 className="font-serif text-lg font-bold text-rose-gold-800 mb-4 flex items-center gap-2">
                <TrendingUp size={20} className="text-rose-gold-500" />
                平台数据
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-fog-500">供应商总数</span>
                  <span className="font-bold text-rose-gold-700">{vendors.length}+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-fog-500">总评价数</span>
                  <span className="font-bold text-rose-gold-700">2,856</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-fog-500">平均评分</span>
                  <span className="font-bold text-rose-gold-700">4.8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-fog-500">好评率</span>
                  <span className="font-bold text-emerald-600">96.8%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'myReviews' && (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-2xl p-6 border border-rose-gold-100 shadow-soft"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-blush-100 flex items-center justify-center text-xl">
                  👰
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-rose-gold-800">{review.coupleName}</span>
                        <span className="text-xs text-fog-400">评价了</span>
                        <span className="text-sm font-medium text-rose-gold-600">{review.vendorName}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-fog-200'}
                          />
                        ))}
                        <span className="text-xs text-fog-400 ml-2">{review.createdAt}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {review.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 bg-rose-gold-50 text-rose-gold-600 rounded-full text-xs flex items-center gap-1"
                      >
                        <ThumbsUp size={10} />
                        {tag}
                      </span>
                    ))}
                  </div>

                  <p className="text-sm text-fog-500 mt-3 leading-relaxed">{review.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
