import { useState } from 'react';
import { DollarSign, CheckCircle, Clock, AlertTriangle, CreditCard, FileText } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export default function PaymentPage() {
  const { payments, makePayment, plans, currentRole } = useAppStore();
  const [payingId, setPayingId] = useState<string | null>(null);

  const plan = plans[0];
  const sortedPayments = [...payments].sort((a, b) => {
    const order = { deposit: 1, middle: 2, final: 3 };
    return order[a.stage] - order[b.stage];
  });

  const totalPaid = payments.filter((p) => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  const progress = (totalPaid / totalAmount) * 100;

  const handlePay = (paymentId: string) => {
    setPayingId(paymentId);
    setTimeout(() => {
      makePayment(paymentId);
      setPayingId(null);
    }, 1500);
  };

  const statusConfig = {
    paid: { label: '已支付', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle },
    pending: { label: '待支付', color: 'text-rose-gold-600', bg: 'bg-rose-gold-50', icon: Clock },
    overdue: { label: '已逾期', color: 'text-red-600', bg: 'bg-red-50', icon: AlertTriangle },
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in-up">
      {/* 总览卡片 */}
      <div className="bg-gradient-to-r from-rose-gold-500 to-rose-gold-600 rounded-2xl p-8 text-white mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-rose-gold-100 text-sm">订单总金额</p>
            <h2 className="font-serif text-4xl font-bold mt-1">
              ¥{plan?.totalPrice.toLocaleString() || 0}
            </h2>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
            <DollarSign size={32} />
          </div>
        </div>

        {/* 进度条 */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>付款进度</span>
            <span className="font-medium">{progress.toFixed(0)}%</span>
          </div>
          <div className="h-3 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-rose-gold-100">
            <span>已付 ¥{totalPaid.toLocaleString()}</span>
            <span>待付 ¥{(totalAmount - totalPaid).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* 订单信息 */}
      <div className="bg-white rounded-2xl p-6 border border-rose-gold-100 shadow-soft mb-6">
        <h3 className="font-serif text-lg font-bold text-rose-gold-800 mb-4">订单信息</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-fog-400">新人</span>
            <span className="text-rose-gold-700">{plan?.coupleName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-fog-400">婚礼日期</span>
            <span className="text-rose-gold-700">{plan?.weddingDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-fog-400">场地</span>
            <span className="text-rose-gold-700">{plan?.venueName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-fog-400">供应商数</span>
            <span className="text-rose-gold-700">{plan?.vendors.length} 位</span>
          </div>
        </div>
      </div>

      {/* 付款阶段 */}
      <div className="bg-white rounded-2xl border border-rose-gold-100 shadow-soft overflow-hidden">
        <h3 className="font-serif text-lg font-bold text-rose-gold-800 p-6 border-b border-rose-gold-100">
          付款阶段
        </h3>

        <div className="divide-y divide-rose-gold-50">
          {sortedPayments.map((payment, index) => {
            const status = statusConfig[payment.status];
            const StatusIcon = status.icon;
            const isPaying = payingId === payment.id;

            return (
              <div key={payment.id} className="p-6">
                <div className="flex items-start gap-4">
                  {/* 步骤序号 */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                      payment.status === 'paid'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-rose-gold-100 text-rose-gold-600'
                    }`}
                  >
                    {payment.status === 'paid' ? <CheckCircle size={18} /> : index + 1}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3">
                          <h4 className="font-medium text-rose-gold-800">
                            {payment.stageName}
                          </h4>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color} flex items-center gap-1`}>
                            <StatusIcon size={12} />
                            {status.label}
                          </span>
                        </div>
                        <p className="text-sm text-fog-400 mt-1">
                          里程碑：{payment.milestone}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-serif text-2xl font-bold text-rose-gold-700">
                          ¥{payment.amount.toLocaleString()}
                        </p>
                        <p className="text-xs text-fog-400 mt-1">
                          到期日：{payment.dueDate}
                        </p>
                      </div>
                    </div>

                    {/* 操作按钮 */}
                    {currentRole === 'couple' && payment.status === 'pending' && (
                      <div className="mt-4 flex items-center gap-3">
                        <button
                          onClick={() => handlePay(payment.id)}
                          disabled={isPaying}
                          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all ${
                            isPaying
                              ? 'bg-fog-100 text-fog-400 cursor-wait'
                              : 'bg-burgundy-500 text-white hover:bg-burgundy-600'
                          }`}
                        >
                          {isPaying ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              支付中...
                            </>
                          ) : (
                            <>
                              <CreditCard size={16} />
                              立即支付
                            </>
                          )}
                        </button>
                        <button className="px-4 py-2.5 text-sm text-rose-gold-500 hover:text-rose-gold-600">
                          查看凭证
                        </button>
                      </div>
                    )}

                    {payment.status === 'paid' && payment.paidAt && (
                      <div className="mt-3 flex items-center gap-2 text-sm text-emerald-600">
                        <FileText size={14} />
                        <span>支付时间：{payment.paidAt}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 支付说明 */}
      <div className="mt-6 bg-ivory-50 rounded-2xl p-5 border border-rose-gold-100">
        <h4 className="text-sm font-medium text-rose-gold-700 mb-2">支付说明</h4>
        <ul className="text-xs text-fog-500 space-y-1">
          <li>• 定金支付后订单正式生效，档期锁定</li>
          <li>• 中期款需在婚礼前 30 天内支付，逾期将暂停服务</li>
          <li>• 尾款在婚礼结束后 7 日内结清</li>
          <li>• 所有支付均支持支付宝、微信、银行卡等方式</li>
        </ul>
      </div>
    </div>
  );
}
