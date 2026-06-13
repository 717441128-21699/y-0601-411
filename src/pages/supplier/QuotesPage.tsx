import { useState } from 'react';
import { DollarSign, Clock, CheckCircle, Send, Edit3 } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { vendorTypeLabels } from '@/data/mockData';
import type { QuoteStatus } from '@/types';

const statusConfig: Record<QuoteStatus, { label: string; color: string; bg: string; icon: string }> = {
  pending: { label: '待报价', color: 'text-yellow-600', bg: 'bg-yellow-50', icon: '⏳' },
  quoted: { label: '已报价', color: 'text-blue-600', bg: 'bg-blue-50', icon: '📤' },
  accepted: { label: '已接单', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: '✅' },
  rejected: { label: '未中标', color: 'text-fog-500', bg: 'bg-fog-50', icon: '❌' },
};

export default function QuotesPage() {
  const { quotes, submitQuoteForOrder, currentVendorId } = useAppStore();
  const [activeTab, setActiveTab] = useState<QuoteStatus | 'all'>('all');
  const [quotePrice, setQuotePrice] = useState<Record<string, number>>({});
  const [quoteDesc, setQuoteDesc] = useState<Record<string, string>>({});
  const [showQuoteInput, setShowQuoteInput] = useState<string | null>(null);

  const vendorQuotes = quotes.filter((q) => q.vendorId === currentVendorId);

  const filteredQuotes =
    activeTab === 'all' ? vendorQuotes : vendorQuotes.filter((q) => q.status === activeTab);

  const tabs = [
    { key: 'all', label: '全部' },
    { key: 'pending', label: '待报价' },
    { key: 'quoted', label: '已报价' },
    { key: 'accepted', label: '已接单' },
    { key: 'rejected', label: '未中标' },
  ] as const;

  const handleSubmitQuote = (quoteId: string) => {
    const price = quotePrice[quoteId];
    const desc = quoteDesc[quoteId] || '';
    if (!price || price <= 0) {
      alert('请输入有效的报价金额');
      return;
    }
    submitQuoteForOrder(quoteId, price, desc);
    setShowQuoteInput(null);
  };

  const handleEditQuote = (quote: typeof quotes[0]) => {
    setQuotePrice((prev) => ({ ...prev, [quote.id]: quote.price }));
    setQuoteDesc((prev) => ({ ...prev, [quote.id]: quote.description }));
    setShowQuoteInput(quote.id);
  };

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-2xl font-bold text-rose-gold-800">报价管理</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-fog-400">共</span>
            <span className="font-bold text-rose-gold-600">{vendorQuotes.length}</span>
            <span className="text-fog-400">条订单</span>
          </div>
        </div>
      </div>

      {/* Tab 切换 */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {tabs.map((tab) => {
          const count =
            tab.key === 'all'
              ? vendorQuotes.length
              : vendorQuotes.filter((q) => q.status === tab.key).length;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-rose-gold-500 text-white shadow-md'
                  : 'bg-white text-rose-gold-600 border border-rose-gold-200 hover:bg-rose-gold-50'
              }`}
            >
              {tab.label}
              <span className="ml-2 text-xs opacity-70">({count})</span>
            </button>
          );
        })}
      </div>

      {/* 报价列表 */}
      <div className="space-y-4">
        {filteredQuotes.map((quote) => {
          const status = statusConfig[quote.status];
          return (
            <div
              key={quote.id}
              className="bg-white rounded-2xl border border-rose-gold-100 shadow-soft overflow-hidden hover:shadow-card transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-rose-gold-50 flex items-center justify-center text-3xl">
                      {quote.vendorType === 'photography' && '�'}
                      {quote.vendorType === 'makeup' && '💄'}
                      {quote.vendorType === 'host' && '🎤'}
                      {quote.vendorType === 'flower' && '💐'}
                      {quote.vendorType === 'venue' && '🏨'}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-serif text-lg font-bold text-rose-gold-800">
                          {quote.orderTitle}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}
                        >
                          {status.icon} {status.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-fog-500 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {quote.weddingDate}
                        </span>
                        <span>� {quote.coupleName}</span>
                        <span>�️ {vendorTypeLabels[quote.vendorType]}</span>
                      </div>
                    </div>
                  </div>

                  {quote.price > 0 && quote.status !== 'pending' && (
                    <div className="text-right">
                      <p className="text-sm text-fog-400">我的报价</p>
                      <p className="font-serif text-2xl font-bold text-rose-gold-600">
                        ¥{quote.price.toLocaleString()}
                      </p>
                      {quote.submittedAt && (
                        <p className="text-xs text-fog-300 mt-1">报价于 {quote.submittedAt}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* 需求详情 */}
                {quote.description && quote.status !== 'pending' && (
                  <div className="mt-4 p-4 bg-ivory-50 rounded-xl">
                    <p className="text-sm text-fog-500">
                      <span className="font-medium text-rose-gold-700">报价说明：</span>
                      {quote.description}
                    </p>
                  </div>
                )}

                {/* 报价输入 */}
                {showQuoteInput === quote.id && (
                  <div className="mt-4 p-4 bg-rose-gold-50 rounded-xl space-y-4">
                    <p className="text-sm font-medium text-rose-gold-700">
                      {quote.status === 'pending' ? '输入您的报价' : '修改您的报价'}
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-gold-600 font-medium">
                          ¥
                        </span>
                        <input
                          type="number"
                          value={quotePrice[quote.id] || ''}
                          onChange={(e) =>
                            setQuotePrice((prev) => ({
                              ...prev,
                              [quote.id]: Number(e.target.value),
                            }))
                          }
                          placeholder="请输入报价金额"
                          className="w-full pl-8 pr-4 py-3 rounded-xl border border-rose-gold-200 focus:border-rose-gold-500 focus:ring-2 focus:ring-rose-gold-100 outline-none transition-all"
                        />
                      </div>
                      <button
                        onClick={() => handleSubmitQuote(quote.id)}
                        className="flex items-center gap-2 px-6 py-3 bg-burgundy-500 text-white rounded-xl font-medium hover:bg-burgundy-600 transition-colors whitespace-nowrap"
                      >
                        <Send size={16} />
                        提交报价
                      </button>
                    </div>
                    <div>
                      <textarea
                        value={quoteDesc[quote.id] || ''}
                        onChange={(e) =>
                          setQuoteDesc((prev) => ({ ...prev, [quote.id]: e.target.value }))
                        }
                        placeholder="报价说明（可选）：包含服务内容、交付物等"
                        rows={2}
                        className="w-full px-4 py-3 rounded-xl border border-rose-gold-200 focus:border-rose-gold-500 focus:ring-2 focus:ring-rose-gold-100 outline-none transition-all resize-none text-sm"
                      />
                    </div>
                  </div>
                )}

                {/* 操作按钮 */}
                <div className="mt-4 flex justify-end gap-3">
                  {quote.status === 'pending' && !showQuoteInput && (
                    <button
                      onClick={() => {
                        setQuotePrice((prev) => ({ ...prev, [quote.id]: 0 }));
                        setQuoteDesc((prev) => ({ ...prev, [quote.id]: '' }));
                        setShowQuoteInput(quote.id);
                      }}
                      className="flex items-center gap-2 px-5 py-2.5 bg-rose-gold-500 text-white rounded-xl text-sm font-medium hover:bg-rose-gold-600 transition-colors"
                    >
                      <DollarSign size={16} />
                      立即报价
                    </button>
                  )}
                  {quote.status === 'quoted' && !showQuoteInput && (
                    <button
                      onClick={() => handleEditQuote(quote)}
                      className="flex items-center gap-2 px-5 py-2.5 border border-rose-gold-200 text-rose-gold-600 rounded-xl text-sm hover:bg-rose-gold-50 transition-colors"
                    >
                      <Edit3 size={16} />
                      修改报价
                    </button>
                  )}
                  {quote.status === 'accepted' && (
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-emerald-50 text-emerald-600 rounded-xl text-sm">
                      <CheckCircle size={16} />
                      已接单，进入任务
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredQuotes.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-medium text-rose-gold-700 mb-2">暂无订单</h3>
          <p className="text-fog-400">该分类下暂无订单</p>
        </div>
      )}
    </div>
  );
}
