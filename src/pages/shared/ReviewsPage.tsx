import { useState } from 'react';
import { Star, TrendingUp, MessageSquare, ThumbsUp, Award, X, Send } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { vendorTypeLabels } from '@/data/mockData';
import type { Review, VendorType } from '@/types';

export default function ReviewsPage() {
  const { reviews, vendors, currentRole, addReview, couple, updateVendorRating } = useAppStore();
  const [activeTab, setActiveTab] = useState<'ranking' | 'myReviews'>('ranking');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const vendorTypeOptions = [
    { key: 'all', label: '全部' },
    { key: 'photography', label: '摄影摄像' },
    { key: 'makeup', label: '化妆造型' },
    { key: 'host', label: '司仪主持' },
    { key: 'venue', label: '场地' },
    { key: 'flower', label: '花艺布置' },
  ];

  const availableVendors = vendors.filter(
    (v) => selectedType === 'all' || v.type === selectedType
  );

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
    '耐心细致',
    '值得推荐',
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmitReview = () => {
    if (!selectedVendorId) {
      alert('请选择要评价的供应商');
      return;
    }
    if (rating === 0) {
      alert('请选择评分星级');
      return;
    }
    if (!reviewText.trim()) {
      alert('请填写评价内容');
      return;
    }

    const vendor = vendors.find((v) => v.id === selectedVendorId);
    if (!vendor) return;

    const newReview: Review = {
      id: `review-${Date.now()}`,
      coupleId: couple.id,
      coupleName: couple.name + ' & ' + couple.partnerName,
      vendorId: selectedVendorId,
      vendorName: vendor.name,
      vendorType: vendor.type as VendorType,
      rating,
      tags: selectedTags,
      comment: reviewText,
      createdAt: new Date().toLocaleDateString('zh-CN'),
    };

    addReview(newReview);
    updateVendorRating(selectedVendorId, rating);

    // 重置表单
    setShowReviewModal(false);
    setSelectedVendorId('');
    setRating(5);
    setReviewText('');
    setSelectedTags([]);
    setActiveTab('myReviews');
  };

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-serif text-2xl font-bold text-rose-gold-800">评价与排行</h2>
          <p className="text-sm text-fog-400 mt-1">查看供应商满意度排行榜</p>
        </div>

        {currentRole === 'couple' && (
          <button
            onClick={() => setShowReviewModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-burgundy-500 text-white rounded-xl font-medium hover:bg-burgundy-600 transition-colors shadow-md"
          >
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
          <span className="ml-2 text-xs opacity-70">({reviews.length})</span>
        </button>
      </div>

      {activeTab === 'ranking' && (
        <div className="grid grid-cols-3 gap-6">
          {/* 排行榜 */}
          <div className="col-span-2 bg-white rounded-2xl border border-rose-gold-100 shadow-soft overflow-hidden">
            {/* 类型筛选 */}
            <div className="p-5 border-b border-rose-gold-100 flex items-center gap-3">
              <span className="text-sm text-fog-500">分类：</span>
              <div className="flex gap-2 flex-wrap">
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
                    vendor.rank <= 3
                      ? 'bg-gradient-to-r from-rose-gold-50 to-transparent'
                      : 'bg-ivory-50'
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
                        {vendorTypeLabels[vendor.type as VendorType]}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1">
                        <Star size={14} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-bold text-rose-gold-700">
                          {vendor.rating.toFixed(1)}
                        </span>
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
                  <span className="font-bold text-rose-gold-700">{reviews.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-fog-500">平均评分</span>
                  <span className="font-bold text-rose-gold-700">
                    {vendors.length > 0
                      ? (
                          vendors.reduce((sum, v) => sum + v.rating, 0) / vendors.length
                        ).toFixed(1)
                      : '0'}
                  </span>
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
                        <span className="font-medium text-rose-gold-800">
                          {review.coupleName}
                        </span>
                        <span className="text-xs text-fog-400">评价了</span>
                        <span className="text-sm font-medium text-rose-gold-600">
                          {review.vendorName}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={
                              i < review.rating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-fog-200'
                            }
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

          {reviews.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-xl font-medium text-rose-gold-700 mb-2">暂无评价</h3>
              <p className="text-fog-400">还没有用户发表评价</p>
            </div>
          )}
        </div>
      )}

      {/* 发表评价弹窗 */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg mx-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-rose-gold-100 sticky top-0 bg-white">
              <h3 className="font-serif text-lg font-bold text-rose-gold-800">发表评价</h3>
              <button
                onClick={() => setShowReviewModal(false)}
                className="p-1 rounded-lg hover:bg-rose-gold-50 text-fog-400 hover:text-rose-gold-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* 选择供应商 */}
              <div>
                <label className="block text-sm font-medium text-rose-gold-700 mb-2">
                  选择供应商 <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
                  {vendors.map((vendor) => (
                    <button
                      key={vendor.id}
                      onClick={() => setSelectedVendorId(vendor.id)}
                      className={`p-3 rounded-lg text-left text-sm transition-all ${
                        selectedVendorId === vendor.id
                          ? 'bg-rose-gold-500 text-white shadow-md'
                          : 'bg-rose-gold-50 text-rose-gold-700 hover:bg-rose-gold-100'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {vendor.type === 'photography' && '📷'}
                          {vendor.type === 'makeup' && '💄'}
                          {vendor.type === 'host' && '🎤'}
                          {vendor.type === 'venue' && '🏨'}
                          {vendor.type === 'flower' && '💐'}
                        </span>
                        <span className="font-medium truncate">{vendor.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 评分 */}
              <div>
                <label className="block text-sm font-medium text-rose-gold-700 mb-2">
                  服务评分 <span className="text-red-400">*</span>
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        size={28}
                        className={
                          star <= (hoverRating || rating)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-fog-200'
                        }
                      />
                    </button>
                  ))}
                  <span className="ml-3 text-sm text-fog-400">
                    {rating === 1 && '很差'}
                    {rating === 2 && '一般'}
                    {rating === 3 && '还行'}
                    {rating === 4 && '满意'}
                    {rating === 5 && '非常满意'}
                  </span>
                </div>
              </div>

              {/* 标签选择 */}
              <div>
                <label className="block text-sm font-medium text-rose-gold-700 mb-2">
                  选择标签（可多选）
                </label>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                        selectedTags.includes(tag)
                          ? 'bg-rose-gold-500 text-white'
                          : 'bg-rose-gold-50 text-rose-gold-600 hover:bg-rose-gold-100'
                      }`}
                    >
                      {selectedTags.includes(tag) && '✓ '}
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* 评价内容 */}
              <div>
                <label className="block text-sm font-medium text-rose-gold-700 mb-2">
                  评价内容 <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="分享您的服务体验，帮助其他新人做出更好的选择..."
                  rows={4}
                  maxLength={500}
                  className="w-full px-4 py-3 rounded-xl border border-rose-gold-200 focus:border-rose-gold-500 focus:ring-2 focus:ring-rose-gold-100 outline-none transition-all resize-none text-sm"
                />
                <p className="text-xs text-fog-400 mt-1 text-right">
                  {reviewText.length}/500
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-rose-gold-100 sticky bottom-0 bg-white">
              <button
                onClick={() => setShowReviewModal(false)}
                className="flex-1 py-3 rounded-xl border border-rose-gold-200 text-rose-gold-600 font-medium hover:bg-rose-gold-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSubmitReview}
                className="flex-1 py-3 rounded-xl bg-burgundy-500 text-white font-medium hover:bg-burgundy-600 transition-colors flex items-center justify-center gap-2"
              >
                <Send size={16} />
                提交评价
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
