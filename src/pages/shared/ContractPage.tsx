import { useParams, useNavigate } from 'react-router-dom';
import { Download, Share2, CheckCircle, Clock, FileText, Shield } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export default function ContractPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { contracts, signContract, currentRole } = useAppStore();

  const contract = contracts.find((c) => c.id === id);

  if (!contract) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">📄</div>
        <h3 className="text-xl font-medium text-rose-gold-700 mb-2">合同不存在</h3>
        <p className="text-fog-400">请返回首页查看有效合同</p>
      </div>
    );
  }

  const canSign =
    (currentRole === 'couple' && !contract.signedByCouple) ||
    (currentRole === 'company' && !contract.signedByCompany);

  const handleSign = () => {
    if (currentRole === 'couple') {
      signContract(contract.id, 'couple');
    } else if (currentRole === 'company') {
      signContract(contract.id, 'company');
    }
  };

  const allSigned = contract.signedByCouple && contract.signedByCompany;

  return (
    <div className="max-w-3xl mx-auto animate-fade-in-up">
      {/* 合同状态条 */}
      <div className={`rounded-2xl p-6 mb-6 ${
        allSigned
          ? 'bg-gradient-to-r from-emerald-500 to-emerald-600'
          : 'bg-gradient-to-r from-rose-gold-500 to-rose-gold-600'
      } text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <FileText size={28} />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold">{contract.planName}</h2>
              <p className="text-sm opacity-90">合同编号：{contract.id.toUpperCase()}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2">
              {allSigned ? (
                <CheckCircle size={20} />
              ) : (
                <Clock size={20} />
              )}
              <span className="font-medium">
                {allSigned ? '已签署' : '待签署'}
              </span>
            </div>
            {allSigned && contract.signedAt && (
              <p className="text-sm opacity-90 mt-1">签署日期：{contract.signedAt}</p>
            )}
          </div>
        </div>

        {/* 签署进度 */}
        <div className="mt-5 pt-5 border-t border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                contract.signedByCouple ? 'bg-white text-emerald-600' : 'bg-white/30'
              }`}>
                {contract.signedByCouple ? <CheckCircle size={18} /> : '1'}
              </div>
              <span className="text-sm">新人签署</span>
            </div>
            <div className={`flex-1 h-1 mx-4 rounded-full ${
              contract.signedByCouple ? 'bg-white' : 'bg-white/30'
            }`} />
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                contract.signedByCompany ? 'bg-white text-emerald-600' : 'bg-white/30'
              }`}>
                {contract.signedByCompany ? <CheckCircle size={18} /> : '2'}
              </div>
              <span className="text-sm">婚庆公司签署</span>
            </div>
          </div>
        </div>
      </div>

      {/* 合同正文 */}
      <div className="bg-white rounded-2xl border border-rose-gold-100 shadow-soft overflow-hidden">
        {/* 纸张质感 */}
        <div
          className="p-10 min-h-[600px] relative"
          style={{
            backgroundImage: 'linear-gradient(to bottom, #FFFBF7, #FFF9F5)',
          }}
        >
          {/* 装饰线条 */}
          <div className="absolute top-6 left-6 right-6 h-px bg-gradient-to-r from-transparent via-rose-gold-300 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 h-px bg-gradient-to-r from-transparent via-rose-gold-300 to-transparent" />

          {/* 标题 */}
          <div className="text-center mb-10">
            <h1 className="font-serif text-3xl font-bold text-rose-gold-800 mb-2">
              婚礼策划服务合同
            </h1>
            <p className="text-sm text-fog-400">Wedding Planning Service Contract</p>
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-rose-gold-400 to-transparent mx-auto mt-4" />
          </div>

          {/* 合同内容 */}
          <div className="space-y-6 text-rose-gold-900 leading-relaxed">
            <div>
              <h3 className="font-serif text-lg font-bold text-rose-gold-700 mb-3">
                一、合同双方
              </h3>
              <p className="text-sm">
                <span className="font-medium">甲方（新人）：</span>林小雨 & 张明远
              </p>
              <p className="text-sm mt-1">
                <span className="font-medium">乙方（婚庆公司）：</span>良缘婚庆策划有限公司
              </p>
            </div>

            <div>
              <h3 className="font-serif text-lg font-bold text-rose-gold-700 mb-3">
                二、服务内容
              </h3>
              <ul className="text-sm space-y-2">
                <li>1. 婚礼整体策划与统筹服务，包括方案设计、流程规划</li>
                <li>2. 场地布置与花艺设计，含迎宾区、仪式区、宴会区</li>
                <li>3. 供应商协调服务：摄影、化妆、主持、花艺等</li>
                <li>4. 婚礼当天全程执行与督导服务</li>
                <li>5. 婚前彩排与相关咨询服务</li>
              </ul>
            </div>

            <div>
              <h3 className="font-serif text-lg font-bold text-rose-gold-700 mb-3">
                三、婚礼信息
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <p><span className="font-medium">婚礼日期：</span>2026年10月18日</p>
                <p><span className="font-medium">婚礼场地：</span>海景花园酒店</p>
                <p><span className="font-medium">预计宾客：</span>200人（20桌）</p>
                <p><span className="font-medium">婚礼风格：</span>浪漫唯美</p>
              </div>
            </div>

            <div>
              <h3 className="font-serif text-lg font-bold text-rose-gold-700 mb-3">
                四、服务费用
              </h3>
              <div className="bg-rose-gold-50 rounded-xl p-4 border border-rose-gold-100">
                <p className="text-lg font-bold text-rose-gold-700">
                  总费用：人民币 ¥{contract.totalPrice.toLocaleString()} 元整
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-serif text-lg font-bold text-rose-gold-700 mb-3">
                五、付款方式
              </h3>
              <ul className="text-sm space-y-2">
                <li>1. <span className="font-medium">定金（30%）：</span>合同签署后3日内支付 ¥{(contract.totalPrice * 0.3).toLocaleString()} 元</li>
                <li>2. <span className="font-medium">中期款（50%）：</span>婚礼前30天支付 ¥{(contract.totalPrice * 0.5).toLocaleString()} 元</li>
                <li>3. <span className="font-medium">尾款（20%）：</span>婚礼结束后7日内支付 ¥{(contract.totalPrice * 0.2).toLocaleString()} 元</li>
              </ul>
            </div>

            <div>
              <h3 className="font-serif text-lg font-bold text-rose-gold-700 mb-3">
                六、双方权利与义务
              </h3>
              <p className="text-sm mb-2"><span className="font-medium">甲方权利义务：</span></p>
              <ul className="text-sm space-y-1 pl-4">
                <li>• 有权要求乙方按合同约定提供婚礼服务</li>
                <li>• 应按时支付各阶段款项</li>
                <li>• 应配合乙方提供婚礼相关信息和资料</li>
              </ul>
              <p className="text-sm mb-2 mt-3"><span className="font-medium">乙方权利义务：</span></p>
              <ul className="text-sm space-y-1 pl-4">
                <li>• 应按合同约定提供专业婚礼策划服务</li>
                <li>• 有权收取服务费用</li>
                <li>• 应保证服务质量和人员到位</li>
              </ul>
            </div>

            <div>
              <h3 className="font-serif text-lg font-bold text-rose-gold-700 mb-3">
                七、违约责任
              </h3>
              <p className="text-sm">
                （详细违约责任条款见合同附件...）
              </p>
            </div>
          </div>

          {/* 签署区域 */}
          <div className="mt-12 pt-8 border-t border-rose-gold-200">
            <div className="grid grid-cols-2 gap-10">
              {/* 甲方签署 */}
              <div>
                <p className="text-sm font-medium text-rose-gold-700 mb-2">甲方（新人）签署</p>
                {contract.signedByCouple ? (
                  <div className="h-20 border-2 border-emerald-300 rounded-xl bg-emerald-50 flex items-center justify-center gap-2">
                    <CheckCircle size={20} className="text-emerald-600" />
                    <span className="text-emerald-700 font-medium">已签署</span>
                  </div>
                ) : (
                  <div className="h-20 border-2 border-dashed border-rose-gold-300 rounded-xl flex items-center justify-center">
                    <span className="text-fog-300 text-sm">待签署</span>
                  </div>
                )}
                {contract.signedAt && contract.signedByCouple && (
                  <p className="text-xs text-fog-400 mt-2 text-center">签署日期：{contract.signedAt}</p>
                )}
              </div>

              {/* 乙方签署 */}
              <div>
                <p className="text-sm font-medium text-rose-gold-700 mb-2">乙方（公司）签署</p>
                {contract.signedByCompany ? (
                  <div className="h-20 border-2 border-emerald-300 rounded-xl bg-emerald-50 flex items-center justify-center gap-2 relative">
                    <div className="absolute right-2 bottom-2 text-4xl opacity-60">
                      良缘婚庆
                    </div>
                    <CheckCircle size={20} className="text-emerald-600" />
                    <span className="text-emerald-700 font-medium">已签署（公司印章）</span>
                  </div>
                ) : (
                  <div className="h-20 border-2 border-dashed border-rose-gold-300 rounded-xl flex items-center justify-center">
                    <span className="text-fog-300 text-sm">待签署</span>
                  </div>
                )}
                {contract.signedAt && contract.signedByCompany && (
                  <p className="text-xs text-fog-400 mt-2 text-center">签署日期：{contract.signedAt}</p>
                )}
              </div>
            </div>
          </div>

          {/* 安全提示 */}
          <div className="mt-8 flex items-center gap-2 text-xs text-fog-400">
            <Shield size={14} />
            <span>本合同采用电子签名技术，具有法律效力，请仔细阅读后签署</span>
          </div>
        </div>
      </div>

      {/* 底部操作栏 */}
      <div className="mt-6 flex items-center justify-between bg-white rounded-2xl p-5 border border-rose-gold-100 shadow-soft">
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-rose-gold-600 bg-rose-gold-50 hover:bg-rose-gold-100 transition-colors text-sm">
            <Download size={18} />
            下载合同
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-rose-gold-600 bg-rose-gold-50 hover:bg-rose-gold-100 transition-colors text-sm">
            <Share2 size={18} />
            分享合同
          </button>
        </div>

        {canSign ? (
          <button
            onClick={handleSign}
            className="px-8 py-3 bg-burgundy-500 text-white rounded-xl font-medium hover:bg-burgundy-600 transition-colors shadow-md flex items-center gap-2"
          >
            <Shield size={18} />
            确认签署合同
          </button>
        ) : (
          <div className="flex items-center gap-2 text-emerald-600">
            <CheckCircle size={20} />
            <span className="font-medium">
              {allSigned ? '合同已全部签署' : '您已签署，等待对方签署'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
