export type MembershipStatus = 'none' | 'trial' | 'trial_completed' | 'monthly' | 'not_continued';

export interface NutriPackage {
  id: string;
  name: string;
  items: string[];
  quantity: string;
  dailyPrice: number;
  trialDays: number;
  trialPrice: number;
  monthlyDays: number;
  monthlyPrice: number;
  icon: string;
  color: string;
  description: string;
  isPopular?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  rollOrEmpId: string;
  department: string;
  role: 'customer' | 'admin';
  avatar?: string;
  currentPackageId?: string;
  currentPackageName?: string;
  currentPackageQuantity?: string;
  membershipStatus: MembershipStatus;
  trialDay: number; // 1 to 7
  trialStartDate?: string;
  trialEndDate?: string;
  monthlyStartDate?: string;
  remainingServiceDays: number;
  paymentStatus: 'paid' | 'pending';
}

export interface Delivery {
  id: string;
  userId: string;
  userName: string;
  userRollOrEmpId: string;
  department: string;
  packageId: string;
  packageName: string;
  quantity: string;
  date: string; // YYYY-MM-DD
  status: 'received' | 'pending' | 'not_received' | 'absent';
  receivedAt?: string;
  notes?: string;
}

export interface AbsenceRequest {
  id: string;
  userId: string;
  userName: string;
  originalPackage: string;
  originalQuantity: string;
  absenceDate: string; // YYYY-MM-DD
  replacementItem: string;
  replacementQuantity: string;
  requestDate: string;
  status: 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
}

export interface PaymentRecord {
  id: string;
  userId: string;
  userName: string;
  packageId: string;
  packageName: string;
  planType: 'trial' | 'monthly';
  amount: number;
  date: string;
  status: 'paid' | 'pending';
  paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'Cash';
  transactionRef?: string;
}

export interface FeedbackItem {
  id: string;
  userId: string;
  userName: string;
  date: string;
  packageId: string;
  packageName: string;
  rating: number; // 1 to 5
  categories: string[];
  comment: string;
}
