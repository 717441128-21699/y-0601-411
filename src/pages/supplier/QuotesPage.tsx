import { useState } from 'react';
import { DollarSign, Clock, CheckCircle, XCircle, Send, ChevronDown } from 'lucide-react';

type QuoteStatus = 'pending' | 'quoted' | 'accepted' | 'rejected';

interface Quote {
  id: string;
  couple: string;
  date: string;
  budget: number;
  style: string;
  requirements: string;
  status: QuoteStatus;
  myPrice?: number;
  quotedAt?: string;
}

const mockQuotes: Quote[] = [
  {
    id: 'quote-001',
    couple: '林小雨 & 张明远',
    date: '2026-10-18',
    budget: 150000,
    style: '浪漫唯美',
    requirements: '双机位摄影，全天跟拍，精修100张',
    status: 'accepted',
    myPrice: 12800,
    quotedAt: '2026-06-03',
  },
  {
    id: 'quote-002',
    couple: '王女士 & 李先生',
    date: '2026-11-05',
    budget: 200000,
    style: '奢华宫廷',
    requirements: '三机位，电影级拍摄，48小时出预告片',
    status: 'quoted',
    myPrice: 18800,
    quotedAt: '2026-06-08',
  },
  {
    id: 'quote-003',
    couple: '陈小姐 & 刘先生',
    date: '2026-12-12',
    budget: 120000,
    style: '森系自然',
    requirements: '双机位，户外婚礼，底片全送',
    status: 'pending',
  },
  {
    id: 'quote-004',
    couple: '张小姐 & 周先生',
    date: '2026-09-28',
    budget: 180000,
    style: '中式传统',
    requirements: '单机位，中式迎亲流程',
    status: 'rejected',
    myPrice: 10800,
    quotedAt: '2026-05-20',
  },
];

const statusConfig: Record<QuoteStatus, { label: string; color: string; bg: string; icon: string }> = {
  pending: { label: '待报价', color: 'text-yellow-600', bg: 'bg-yellow-50', icon: '⏳' },
  quoted: { label: '已报价', color: 'text-blue-600', bg: 'bg-blue-50', icon: '📤' },
  accepted: { label: '已接单', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: '✅' },
  rejected: { label: '未中标', color: 'text-fog-500', bg: 'bg-fog-50', icon: '❌' },
};

export default function QuotesPage() {
  const [activeTab, setActiveTab] = useState<QuoteStatus | 'all'>('all');
  const [quotePrice, setQuotePrice] = useState<Record<string, number>>({});
  const [showQuoteInput, setShowQuoteInput] = useState<string | null>(null);

  const filteredQuotes = activeTab === 'all'
    ? mockQuotes
    : mockQuotes.filter((q) => q.status === activeTab);

  const tabs = [
    { key: 'all', label: '全部' },
    { key: 'pending', label: '待报价' },
    { key: 'quoted', label: '已报价' },
    { key: 'accepted', label: '已接单' },
    { key: 'rejected', label: '未中标' },
  ] as const;

  const handleSubmitQuote = (quoteId: string) => {
    const price = quotePrice[quoteId];
    if (!price || price <= 0) return;
    setShowQuoteInput(null);
    alert(`报价已提交：¥${price.toLocaleString()}`);
  };

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-2xl font-bold text-rose-gold-800">报价管理</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-fog-400">共</span>
            <span className="font-bold text-rose-gold-600">{mockQuotes.length}</span>
            <span className="text-fog-400">条订单</span>
          </div>
        </div>
      </div>

      {/* Tab 切换 */}
      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => (
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
            <span className="ml-2 text-xs opacity-70">
              ({tab.key === 'all' ? mockQuotes.length : mockQuotes.filter(q => q.status === tab.key).length})
            </span>
          </button>
        ))}
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
                      💒
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-serif text-lg font-bold text-rose-gold-800">
                          {quote.couple}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                          {status.icon} {status.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-fog-500">
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {quote.date}
                        </span>
                        <span>💰 预算 {(quote.budget / 10000).toFixed(0)}万</span>
                        <span>🎨 {quote.style}</span>
                      </div>
                    </div>
                  </div>

                  {quote.myPrice && (
                    <div className="text-right">
                      <p className="text-sm text-fog-400">我的报价</p>
                      <p className="font-serif text-2xl font-bold text-rose-gold-600">
                        ¥{quote.myPrice.toLocaleString()}
                      </p>
                      {quote.quotedAt && (
                        <p className="text-xs text-fog-300 mt-1">报价于 {quote.quotedAt}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* 需求详情 */}
                <div className="mt-4 p-4 bg-ivory-50 rounded-xl">
                  <p className="text-sm text-fog-500">
                    <span className="font-medium text-rose-gold-700">客户需求：</span>
                    {quote.requirements}
                  </p>
                </div>

                {/* 报价输入 */}
                {showQuoteInput === quote.id && (
                  <div className="mt-4 p-4 bg-rose-gold-50 rounded-xl">
                    <p className="text-sm font-medium text-rose-gold-700 mb-3">输入您的报价</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-gold-600 font-medium">¥</span>
                        <input
                          type="number"
                          value={quotePrice[quote.id] || ''}
                          onChange={(e) =>
                            setQuotePrice((prev) => ({ ...prev, [quote.id]: Number(e.target.value) }))
                          }
                          placeholder="请输入报价金额"
                          className="w-full pl-8 pr-4 py-3 rounded-xl border border-rose-gold-200 focus:border-rose-gold-500 focus:ring-2 focus:ring-rose-gold-100 outline-none transition-all"
                        />
                      </div>
                      <button
                        onClick={() => handleSubmitQuote(quote.id)}
                        className="flex items-center gap-2 px-6 py-3 bg-burgundy-500 text-white rounded-xl font-medium hover:bg-burgundy-600 transition-colors"
                      >
                        <Send size={16} />
                        提交报价
                      </button>
                    </div>
                  </div>
                )}

                {/* 操作按钮 */}
                <div className="mt-4 flex justify-end gap-3">
                  {quote.status === 'pending' && !showQuoteInput && (
                    <button
                      onClick={() => setShowQuoteInput(quote.id)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-rose-gold-500 text-white rounded-xl text-sm font-medium hover:bg-rose-gold-600 transition-colors"
                    >
                      <DollarSign size={16} />
                      立即报价
                    </button>
                  )}
                  {quote.status === 'quoted' && (
                    <button
                      onClick={() => setShowQuoteInput(quote.id)}
                      className="flex items-center gap-2 px-5 py-2.5 border border-rose-gold-200 text-rose-gold-600 rounded-xl text-sm hover:bg-rose-gold-50 transition-colors"
                    >
                      修改报价
                    </button>
                  )}
                  {quote.status === 'accepted' && (
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-emerald-50 text-emerald-600 rounded-xl text-sm">
                      <CheckCircle size={16} />
                      已接单，查看详情
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
