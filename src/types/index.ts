export type UserRole = 'couple' | 'company' | 'supplier' | 'finance';

export type VendorType = 'photography' | 'makeup' | 'host' | 'venue' | 'flower' | 'catering';

export type PlanStatus = 'draft' | 'pending' | 'confirmed' | 'completed';

export type TaskType = 'makeup_test' | 'rehearsal' | 'wedding' | 'delivery' | 'meeting';

export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export type PaymentStage = 'deposit' | 'middle' | 'final';

export type PaymentStatus = 'pending' | 'paid' | 'overdue';

export type FileType = 'requirement' | 'delivery' | 'contract';

export interface Couple {
  id: string;
  name: string;
  avatar: string;
  partnerName: string;
  budget: number;
  style: string;
  preferences: string[];
  weddingDate?: string;
}

export interface WeddingCompany {
  id: string;
  name: string;
  logo: string;
  rating: number;
  caseCount: number;
  priceRange: [number, number];
  description: string;
  tags: string[];
}

export interface Vendor {
  id: string;
  name: string;
  type: VendorType;
  avatar: string;
  rating: number;
  reviewCount: number;
  price: number;
  schedule: string[];
  description: string;
  tags: string[];
}

export interface WeddingPlan {
  id: string;
  coupleId: string;
  coupleName: string;
  companyId: string;
  companyName: string;
  venueId: string;
  venueName: string;
  weddingDate: string;
  vendors: string[];
  vendorNames: Record<string, string>;
  status: PlanStatus;
  totalPrice: number;
  createdAt: string;
  guestCount?: number;
}

export interface Contract {
  id: string;
  planId: string;
  planName: string;
  content: string;
  signedByCouple: boolean;
  signedByCompany: boolean;
  signedAt: string | null;
  totalPrice: number;
}

export interface Task {
  id: string;
  planId: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  location?: string;
  type: TaskType;
  status: TaskStatus;
  assignee: string;
  assigneeRole: UserRole;
  remindDays: number;
}

export interface Payment {
  id: string;
  planId: string;
  stage: PaymentStage;
  stageName: string;
  amount: number;
  status: PaymentStatus;
  dueDate: string;
  milestone: string;
  paidAt?: string;
}

export interface Review {
  id: string;
  coupleId: string;
  coupleName: string;
  vendorId: string;
  vendorName: string;
  vendorType: VendorType;
  rating: number;
  tags: string[];
  comment: string;
  createdAt: string;
}

export interface FileItem {
  id: string;
  planId: string;
  name: string;
  type: FileType;
  url: string;
  uploadedBy: string;
  uploadedByRole: UserRole;
  uploadedAt: string;
  size: string;
  category: string;
}

export interface RecommendationResult {
  companies: Array<{
    company: WeddingCompany;
    matchScore: number;
    reasons: string[];
  }>;
  vendorCombos: Array<{
    vendors: Record<VendorType, Vendor>;
    totalPrice: number;
    matchScore: number;
    reasons: string[];
  }>;
}

export interface FinanceStats {
  totalRevenue: number;
  totalOrders: number;
  completionRate: number;
  disputeRate: number;
  monthlyRevenue: { month: string; revenue: number }[];
  topVendors: Array<{
    id: string;
    name: string;
    type: VendorType;
    orderCount: number;
    revenue: number;
    rating: number;
  }>;
}

export interface Notification {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'error';
  targetRole: UserRole[];
  createdAt: string;
  read: boolean;
  link?: string;
}

export type QuoteStatus = 'pending' | 'quoted' | 'accepted' | 'rejected';

export interface Quote {
  id: string;
  orderId: string;
  orderTitle: string;
  coupleName: string;
  vendorId: string;
  vendorName: string;
  vendorType: VendorType;
  weddingDate: string;
  price: number;
  description: string;
  status: QuoteStatus;
  submittedAt: string;
}
