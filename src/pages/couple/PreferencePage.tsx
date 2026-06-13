import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { weddingStyles, preferenceOptions } from '@/data/mockData';

export default function PreferencePage() {
  const navigate = useNavigate();
  const { couple, updateCouplePreference, generateRecommendation } = useAppStore();
  const [step, setStep] = useState(1);
  const [budget, setBudget] = useState(couple.budget);
  const [selectedStyle, setSelectedStyle] = useState(couple.style);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>(couple.preferences);

  const handleTogglePreference = (id: string) => {
    setSelectedPreferences((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    const styleName = weddingStyles.find((s) => s.id === selectedStyle)?.name || '';
    const prefNames = selectedPreferences.map((p) => preferenceOptions.find((o) => o.id === p)?.name || p);
    updateCouplePreference(budget, styleName, prefNames);
    generateRecommendation(budget, styleName, prefNames);
    navigate('/couple/recommendation');
  };

  const formatBudget = (value: number) => {
    if (value >= 10000) {
      return `${(value / 10000).toFixed(0)}万`;
    }
    return value.toLocaleString();
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in-up">
      {/* 步骤指示器 */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-2xl font-bold text-rose-gold-800">设置婚礼需求</h2>
          <span className="text-sm text-fog-400">第 {step} / 3 步</span>
        </div>
        <div className="flex gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                s <= step ? 'bg-rose-gold-500' : 'bg-rose-gold-100'
              }`}
            />
          ))}
        </div>
      </div>

      {/* 步骤内容 */}
      <div className="bg-white rounded-2xl p-8 border border-rose-gold-100 shadow-soft">
        {/* 步骤1：预算 */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="font-serif text-xl font-bold text-rose-gold-800 mb-2">您的婚礼预算</h3>
              <p className="text-sm text-fog-400">告诉我们您的预算范围，我们将为您匹配最合适的方案</p>
            </div>

            <div className="py-8">
              <div className="text-center mb-8">
                <span className="font-serif text-5xl font-bold text-rose-gold-600">
                  ¥{formatBudget(budget)}
                </span>
              </div>
              <input
                type="range"
                min="30000"
                max="500000"
                step="10000"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full h-2 bg-rose-gold-100 rounded-lg appearance-none cursor-pointer accent-rose-gold-500"
              />
              <div className="flex justify-between mt-2 text-xs text-fog-300">
                <span>3万</span>
                <span>10万</span>
                <span>20万</span>
                <span>30万</span>
                <span>50万+</span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {[50000, 100000, 150000, 200000].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setBudget(amount)}
                  className={`py-3 rounded-xl text-sm font-medium transition-all ${
                    budget === amount
                      ? 'bg-rose-gold-500 text-white shadow-md'
                      : 'bg-rose-gold-50 text-rose-gold-600 hover:bg-rose-gold-100'
                  }`}
                >
                  {formatBudget(amount)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 步骤2：风格 */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="font-serif text-xl font-bold text-rose-gold-800 mb-2">您喜欢的婚礼风格</h3>
              <p className="text-sm text-fog-400">选择一种最吸引您的风格，我们将据此推荐合适的方案</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {weddingStyles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={`p-5 rounded-2xl text-left transition-all ${
                    selectedStyle === style.id
                      ? 'bg-rose-gold-500 text-white shadow-lg scale-105'
                      : 'bg-rose-gold-50 text-rose-gold-700 hover:bg-rose-gold-100 hover:scale-102'
                  }`}
                >
                  <span className="text-4xl mb-3 block">{style.icon}</span>
                  <h4 className="font-serif text-lg font-bold mb-1">{style.name}</h4>
                  <p className={`text-xs ${selectedStyle === style.id ? 'text-rose-gold-100' : 'text-fog-400'}`}>
                    {style.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 步骤3：偏好 */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="font-serif text-xl font-bold text-rose-gold-800 mb-2">您的婚礼偏好</h3>
              <p className="text-sm text-fog-400">可多选，帮助我们更精准地匹配您的需求</p>
            </div>

            <div className="grid grid-cols-5 gap-3">
              {preferenceOptions.map((option) => {
                const isSelected = selectedPreferences.includes(option.id);
                return (
                  <button
                    key={option.id}
                    onClick={() => handleTogglePreference(option.id)}
                    className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-all ${
                      isSelected
                        ? 'bg-rose-gold-500 text-white shadow-md'
                        : 'bg-rose-gold-50 text-rose-gold-600 hover:bg-rose-gold-100'
                    }`}
                  >
                    <span className="text-2xl">{option.icon}</span>
                    <span className="text-sm font-medium">{option.name}</span>
                  </button>
                );
              })}
            </div>

            <div className="bg-blush-50 rounded-xl p-4 border border-blush-100">
              <p className="text-sm text-burgundy-500">
                已选择 <span className="font-bold">{selectedPreferences.length}</span> 个偏好标签
              </p>
            </div>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex justify-between mt-10 pt-6 border-t border-rose-gold-100">
          <button
            onClick={() => (step > 1 ? setStep(step - 1) : navigate('/couple'))}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-rose-gold-600 hover:bg-rose-gold-50 transition-colors"
          >
            <ChevronLeft size={18} />
            {step > 1 ? '上一步' : '返回'}
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
              onClick={handleSubmit}
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-burgundy-500 text-white hover:bg-burgundy-600 transition-colors shadow-md"
            >
              <Sparkles size={18} />
              生成推荐报告
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
