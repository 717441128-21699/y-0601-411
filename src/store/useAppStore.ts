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
} from '@/data/mockData';

interface AppState {
  currentRole: UserRole | null;
  setCurrentRole: (role: UserRole | null) => void;

  couple: Couple;
  updateCouplePreference: (budget: number, style: string, preferences: string[]) => void;

  companies: WeddingCompany[];
  vendors: Vendor[];

  plans: WeddingPlan[];
  addPlan: (plan: WeddingPlan) => void;
  updatePlan: (id: string, updates: Partial<WeddingPlan>) => void;

  contracts: Contract[];
  signContract: (contractId: string, role: 'couple' | 'company') => void;

  tasks: Task[];
  updateTaskStatus: (taskId: string, status: Task['status']) => void;

  payments: Payment[];
  makePayment: (paymentId: string) => void;

  reviews: Review[];
  addReview: (review: Review) => void;

  files: FileItem[];
  addFile: (file: FileItem) => void;

  notifications: Notification[];
  markNotificationRead: (id: string) => void;

  financeStats: FinanceStats;

  recommendationResult: RecommendationResult | null;
  generateRecommendation: (budget: number, style: string, preferences: string[]) => void;

  checkScheduleConflict: (vendorIds: string[], date: string) => { hasConflict: boolean; conflicts: string[] };

  selectedPlanId: string | null;
  setSelectedPlanId: (id: string | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentRole: null,
      setCurrentRole: (role) => set({ currentRole: role }),

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

      checkScheduleConflict: (vendorIds, date) => {
        const { vendors } = get();
        const conflicts: string[] = [];

        vendorIds.forEach((id) => {
          const vendor = vendors.find((v) => v.id === id);
          if (vendor && !vendor.schedule.includes(date)) {
            conflicts.push(vendor.name);
          }
        });

        return { hasConflict: conflicts.length > 0, conflicts };
      },

      selectedPlanId: 'plan-001',
      setSelectedPlanId: (id) => set({ selectedPlanId: id }),
    }),
    {
      name: 'wedding-platform-storage',
      partialize: (state) => ({
        currentRole: state.currentRole,
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
      }),
    }
  )
);
