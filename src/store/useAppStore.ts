import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  UserRole,
  Couple,
  WeddingCompany,
  Vendor,
  WeddingPlan,
  Contract,
  Task,
  Payment,
  Review,
  FileItem,
  Notification,
  FinanceStats,
  RecommendationResult,
  Quote,
} from '@/types';
import {
  mockCouple,
  mockCompanies,
  mockVendors,
  mockPlans,
  mockContracts,
  mockTasks,
  mockPayments,
  mockReviews,
  mockFiles,
  mockNotifications,
  mockFinanceStats,
  mockQuotes,
} from '@/data/mockData';

interface ConflictDetail {
  type: 'venue' | 'vendor';
  id: string;
  name: string;
  conflictWith: string;
  conflictPlanId: string;
}

interface AppState {
  currentRole: UserRole | null;
  setCurrentRole: (role: UserRole | null) => void;

  currentVendorId: string;
  setCurrentVendorId: (id: string) => void;

  couple: Couple;
  updateCouplePreference: (budget: number, style: string, preferences: string[]) => void;

  companies: WeddingCompany[];
  vendors: Vendor[];

  plans: WeddingPlan[];
  addPlan: (plan: WeddingPlan) => void;
  updatePlan: (id: string, updates: Partial<WeddingPlan>) => void;

  contracts: Contract[];
  addContract: (contract: Contract) => void;
  signContract: (contractId: string, role: 'couple' | 'company') => void;

  tasks: Task[];
  updateTaskStatus: (taskId: string, status: Task['status']) => void;

  payments: Payment[];
  makePayment: (paymentId: string) => void;

  reviews: Review[];
  addReview: (review: Review) => void;
  updateVendorRating: (vendorId: string, newRating: number) => void;

  files: FileItem[];
  addFile: (file: FileItem) => void;

  notifications: Notification[];
  markNotificationRead: (id: string) => void;

  financeStats: FinanceStats;

  recommendationResult: RecommendationResult | null;
  generateRecommendation: (budget: number, style: string, preferences: string[]) => void;

  checkScheduleConflict: (
    venueId: string,
    vendorIds: string[],
    date: string,
    excludePlanId?: string
  ) => { hasConflict: boolean; conflicts: ConflictDetail[] };

  selectedPlanId: string | null;
  setSelectedPlanId: (id: string | null) => void;

  quotes: Quote[];
  submitQuote: (quote: Omit<Quote, 'id' | 'status' | 'submittedAt'>) => void;
  submitQuoteForOrder: (quoteId: string, price: number, description: string) => void;
  acceptQuote: (quoteId: string) => void;
  rejectQuote: (quoteId: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentRole: null,
      setCurrentRole: (role) => set({ currentRole: role }),

      currentVendorId: 'photo-001',
      setCurrentVendorId: (id) => set({ currentVendorId: id }),

      couple: mockCouple,
      updateCouplePreference: (budget, style, preferences) =>
        set((state) => ({
          couple: { ...state.couple, budget, style, preferences },
        })),

      companies: mockCompanies,
      vendors: mockVendors,

      plans: mockPlans,
      addPlan: (plan) => set((state) => ({ plans: [...state.plans, plan] })),
      updatePlan: (id, updates) =>
        set((state) => ({
          plans: state.plans.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        })),

      contracts: mockContracts,
      addContract: (contract) => set((state) => ({ contracts: [...state.contracts, contract] })),
      signContract: (contractId, role) =>
        set((state) => ({
          contracts: state.contracts.map((c) =>
            c.id === contractId
              ? {
                  ...c,
                  signedByCouple: role === 'couple' ? true : c.signedByCouple,
                  signedByCompany: role === 'company' ? true : c.signedByCompany,
                  signedAt:
                    (role === 'couple' && c.signedByCompany) || (role === 'company' && c.signedByCouple)
                      ? new Date().toISOString().split('T')[0]
                      : c.signedAt,
                }
              : c
          ),
        })),

      tasks: mockTasks,
      updateTaskStatus: (taskId, status) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, status } : t)),
        })),

      payments: mockPayments,
      makePayment: (paymentId) =>
        set((state) => ({
          payments: state.payments.map((p) =>
            p.id === paymentId ? { ...p, status: 'paid', paidAt: new Date().toISOString().split('T')[0] } : p
          ),
        })),

      reviews: mockReviews,
      addReview: (review) => set((state) => ({ reviews: [review, ...state.reviews] })),
      updateVendorRating: (vendorId, newRating) =>
        set((state) => {
          const vendor = state.vendors.find((v) => v.id === vendorId);
          if (!vendor) return state;
          const oldRating = vendor.rating;
          const reviewCount = vendor.reviewCount;
          const updatedRating = Math.round(((oldRating * reviewCount + newRating) / (reviewCount + 1)) * 10) / 10;
          return {
            vendors: state.vendors.map((v) =>
              v.id === vendorId
                ? { ...v, rating: updatedRating, reviewCount: reviewCount + 1 }
                : v
            ),
          };
        }),

      files: mockFiles,
      addFile: (file) => set((state) => ({ files: [...state.files, file] })),

      notifications: mockNotifications,
      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        })),

      financeStats: mockFinanceStats,

      recommendationResult: null,
      generateRecommendation: (budget, style, preferences) => {
        const { companies, vendors } = get();

        const scoredCompanies = companies.map((company) => {
          let score = company.rating * 20;
          const [minPrice, maxPrice] = company.priceRange;
          if (budget >= minPrice && budget <= maxPrice) {
            score += 30;
          } else if (budget > maxPrice) {
            score += 20;
          }
          if (company.tags.some((t) => preferences.includes(t))) {
            score += 15;
          }
          const reasons: string[] = [];
          reasons.push(`评分 ${company.rating} 分，共 ${company.caseCount} 个案例`);
          if (budget >= minPrice && budget <= maxPrice) {
            reasons.push('预算匹配度高');
          }
          if (company.tags.some((t) => preferences.includes(t))) {
            reasons.push('风格偏好匹配');
          }
          return { company, matchScore: Math.round(score), reasons };
        });

        scoredCompanies.sort((a, b) => b.matchScore - a.matchScore);

        const vendorTypes = ['photography', 'makeup', 'host', 'venue', 'flower', 'catering'] as const;
        const vendorGroups: Record<string, Vendor[]> = {};
        vendorTypes.forEach((type) => {
          vendorGroups[type] = vendors.filter((v) => v.type === type);
        });

        const topVendors: Record<string, Vendor> = {};
        vendorTypes.forEach((type) => {
          const sorted = [...vendorGroups[type]].sort((a, b) => b.rating - a.rating);
          if (sorted[0]) topVendors[type] = sorted[0];
        });

        const totalPrice = Object.values(topVendors).reduce((sum, v) => sum + v.price, 0) + 50000;

        const comboReasons: string[] = [];
        comboReasons.push('组合评分高达 4.9 分');
        comboReasons.push(`总价约 ¥${totalPrice.toLocaleString()}，${totalPrice <= budget ? '在预算内' : '略超预算'}`);
        comboReasons.push('所有供应商档期可用');

        set({
          recommendationResult: {
            companies: scoredCompanies,
            vendorCombos: [
              {
                vendors: topVendors as unknown as Record<string, Vendor>,
                totalPrice,
                matchScore: 92,
                reasons: comboReasons,
              },
            ],
          },
        });
      },

      checkScheduleConflict: (venueId, vendorIds, date, excludePlanId) => {
        const { plans, vendors } = get();
        const conflicts: ConflictDetail[] = [];

        // 检测场地冲突 - 同一天同一场地不能有两个方案
        const venueConflictPlan = plans.find(
          (p) =>
            p.venueId === venueId &&
            p.weddingDate === date &&
            p.id !== excludePlanId &&
            p.status !== 'completed'
        );
        if (venueConflictPlan) {
          const venue = vendors.find((v) => v.id === venueId);
          conflicts.push({
            type: 'venue',
            id: venueId,
            name: venue?.name || '场地',
            conflictWith: venueConflictPlan.coupleName,
            conflictPlanId: venueConflictPlan.id,
          });
        }

        // 检测供应商冲突 - 同一天同一个供应商不能有两个方案
        vendorIds.forEach((vendorId) => {
          const vendorConflictPlan = plans.find(
            (p) =>
              p.vendors.includes(vendorId) &&
              p.weddingDate === date &&
              p.id !== excludePlanId &&
              p.status !== 'completed'
          );
          if (vendorConflictPlan) {
            const vendor = vendors.find((v) => v.id === vendorId);
            conflicts.push({
              type: 'vendor',
              id: vendorId,
              name: vendor?.name || '供应商',
              conflictWith: vendorConflictPlan.coupleName,
              conflictPlanId: vendorConflictPlan.id,
            });
          }
        });

        // 同时也检测供应商自身的档期
        vendorIds.forEach((id) => {
          const vendor = vendors.find((v) => v.id === id);
          if (vendor && !vendor.schedule.includes(date)) {
            const existingConflict = conflicts.find((c) => c.id === id);
            if (!existingConflict) {
              conflicts.push({
                type: 'vendor',
                id,
                name: vendor.name,
                conflictWith: '供应商本身档期不可用',
                conflictPlanId: '',
              });
            }
          }
        });

        return { hasConflict: conflicts.length > 0, conflicts };
      },

      selectedPlanId: 'plan-001',
      setSelectedPlanId: (id) => set({ selectedPlanId: id }),

      quotes: mockQuotes,
      submitQuote: (quoteData) =>
        set((state) => ({
          quotes: [
            ...state.quotes,
            {
              ...quoteData,
              id: `quote-${Date.now()}`,
              status: 'quoted',
              submittedAt: new Date().toISOString().split('T')[0],
            },
          ],
          notifications: [
            {
              id: `notif-${Date.now()}`,
              title: '新报价提交',
              content: `${quoteData.vendorName} 对订单「${quoteData.orderTitle}」提交了报价：¥${quoteData.price.toLocaleString()}`,
              type: 'info',
              targetRole: ['couple', 'company'],
              createdAt: new Date().toLocaleString('zh-CN'),
              read: false,
              link: '/supplier/quotes',
            },
            ...state.notifications,
          ],
        })),
      submitQuoteForOrder: (quoteId, price, description) =>
        set((state) => {
          const quote = state.quotes.find((q) => q.id === quoteId);
          if (!quote) return state;
          return {
            quotes: state.quotes.map((q) =>
              q.id === quoteId
                ? { ...q, price, description, status: 'quoted' as const, submittedAt: new Date().toISOString().split('T')[0] }
                : q
            ),
            notifications: [
              {
                id: `notif-${Date.now()}`,
                title: '供应商已报价',
                content: `${quote.vendorName} 对订单「${quote.orderTitle}」提交了报价：¥${price.toLocaleString()}`,
                type: 'info',
                targetRole: ['couple', 'company'],
                createdAt: new Date().toLocaleString('zh-CN'),
                read: false,
                link: '/company',
              },
              ...state.notifications,
            ],
          };
        }),
      acceptQuote: (quoteId) =>
        set((state) => ({
          quotes: state.quotes.map((q) => (q.id === quoteId ? { ...q, status: 'accepted' as const } : q)),
        })),
      rejectQuote: (quoteId) =>
        set((state) => ({
          quotes: state.quotes.map((q) => (q.id === quoteId ? { ...q, status: 'rejected' as const } : q)),
        })),
    }),
    {
      name: 'wedding-platform-storage',
      partialize: (state) => ({
        currentRole: state.currentRole,
        currentVendorId: state.currentVendorId,
        couple: state.couple,
        plans: state.plans,
        contracts: state.contracts,
        tasks: state.tasks,
        payments: state.payments,
        reviews: state.reviews,
        files: state.files,
        notifications: state.notifications,
        recommendationResult: state.recommendationResult,
        selectedPlanId: state.selectedPlanId,
        quotes: state.quotes,
      }),
    }
  )
);
