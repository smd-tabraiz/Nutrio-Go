'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Delivery, AbsenceRequest, PaymentRecord, FeedbackItem, NutriPackage } from '@/types';
import { NUTRI_PACKAGES } from '@/data/packages';
import { INITIAL_USERS, INITIAL_DELIVERIES, INITIAL_ABSENCES, INITIAL_PAYMENTS, INITIAL_FEEDBACK } from '@/data/seedData';

interface NutriGoContextType {
  currentUser: User | null;
  users: User[];
  deliveries: Delivery[];
  absences: AbsenceRequest[];
  payments: PaymentRecord[];
  feedback: FeedbackItem[];
  packages: NutriPackage[];
  simulatedToday: string;
  // Auth
  login: (identifier: string, pass?: string) => { success: boolean; message?: string; user?: User };
  loginAs: (userId: string) => void;
  register: (data: Partial<User>) => { success: boolean; message?: string; user?: User };
  logout: () => void;
  // Customer actions
  startTrial: (packageId: string, paymentMethod?: PaymentRecord['paymentMethod']) => Promise<boolean>;
  startMonthlyDirect: (packageId: string, paymentMethod?: PaymentRecord['paymentMethod']) => Promise<boolean>;
  respondToTrialCompletion: (continueMonthly: boolean) => Promise<boolean>;
  markPackageReceived: (deliveryId?: string) => Promise<boolean>;
  submitAbsence: (absenceDate: string, replacementItem: string) => Promise<{ success: boolean; message: string }>;
  submitFeedback: (rating: number, categories: string[], comment: string) => Promise<boolean>;
  // Admin actions
  updateDeliveryStatus: (deliveryId: string, status: Delivery['status']) => void;
  markPaymentStatus: (paymentId: string, status: 'paid' | 'pending') => void;
  advanceSimulatedDay: () => void;
  resetAllData: () => void;
}

const NutriGoContext = createContext<NutriGoContextType | undefined>(undefined);

const STORAGE_PREFIX = 'nutrigo_db_v1_';

export function NutriGoProvider({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User | null>(INITIAL_USERS[0]); // Default to Prabhashini (Trial customer)
  const [deliveries, setDeliveries] = useState<Delivery[]>(INITIAL_DELIVERIES);
  const [absences, setAbsences] = useState<AbsenceRequest[]>(INITIAL_ABSENCES);
  const [payments, setPayments] = useState<PaymentRecord[]>(INITIAL_PAYMENTS);
  const [feedback, setFeedback] = useState<FeedbackItem[]>(INITIAL_FEEDBACK);
  const [simulatedToday, setSimulatedToday] = useState<string>('2026-09-28');

  // Load from localStorage on client mount
  useEffect(() => {
    setIsClient(true);
    try {
      const savedUsers = localStorage.getItem(STORAGE_PREFIX + 'users');
      const savedCurrentUser = localStorage.getItem(STORAGE_PREFIX + 'currentUser');
      const savedDeliveries = localStorage.getItem(STORAGE_PREFIX + 'deliveries');
      const savedAbsences = localStorage.getItem(STORAGE_PREFIX + 'absences');
      const savedPayments = localStorage.getItem(STORAGE_PREFIX + 'payments');
      const savedFeedback = localStorage.getItem(STORAGE_PREFIX + 'feedback');
      const savedDate = localStorage.getItem(STORAGE_PREFIX + 'simulatedToday');

      if (savedUsers) setUsers(JSON.parse(savedUsers));
      if (savedCurrentUser) setCurrentUser(JSON.parse(savedCurrentUser));
      if (savedDeliveries) setDeliveries(JSON.parse(savedDeliveries));
      if (savedAbsences) setAbsences(JSON.parse(savedAbsences));
      if (savedPayments) setPayments(JSON.parse(savedPayments));
      if (savedFeedback) setFeedback(JSON.parse(savedFeedback));
      if (savedDate) setSimulatedToday(savedDate);
    } catch (e) {
      console.error('Error loading data from localStorage', e);
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (!isClient) return;
    try {
      localStorage.setItem(STORAGE_PREFIX + 'users', JSON.stringify(users));
      localStorage.setItem(STORAGE_PREFIX + 'currentUser', JSON.stringify(currentUser));
      localStorage.setItem(STORAGE_PREFIX + 'deliveries', JSON.stringify(deliveries));
      localStorage.setItem(STORAGE_PREFIX + 'absences', JSON.stringify(absences));
      localStorage.setItem(STORAGE_PREFIX + 'payments', JSON.stringify(payments));
      localStorage.setItem(STORAGE_PREFIX + 'feedback', JSON.stringify(feedback));
      localStorage.setItem(STORAGE_PREFIX + 'simulatedToday', simulatedToday);
    } catch (e) {
      console.error('Error saving data to localStorage', e);
    }
  }, [users, currentUser, deliveries, absences, payments, feedback, simulatedToday, isClient]);

  // Auth actions
  const login = (identifier: string, pass?: string) => {
    const trimmed = identifier.trim().toLowerCase();
    const user = users.find(
      (u) =>
        u.email.toLowerCase() === trimmed ||
        u.rollOrEmpId.toLowerCase() === trimmed ||
        u.phone.replace(/\s+/g, '') === trimmed.replace(/\s+/g, '')
    );

    if (user) {
      setCurrentUser(user);
      return { success: true, user };
    }
    return { success: false, message: 'Invalid credentials. Try demo credentials or quick login.' };
  };

  const loginAs = (userId: string) => {
    const found = users.find((u) => u.id === userId);
    if (found) {
      setCurrentUser(found);
    }
  };

  const register = (data: Partial<User>) => {
    const newId = `user_${Date.now()}`;
    const newUser: User = {
      id: newId,
      name: data.name || 'New Customer',
      email: data.email || `customer_${Date.now()}@nutrigo.com`,
      phone: data.phone || '+91 99999 00000',
      rollOrEmpId: data.rollOrEmpId || `STU-${Math.floor(1000 + Math.random() * 9000)}`,
      department: data.department || 'General Studies',
      role: 'customer',
      membershipStatus: 'none',
      trialDay: 0,
      remainingServiceDays: 0,
      paymentStatus: 'paid',
    };

    setUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);
    return { success: true, user: newUser };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // Start 7-day trial flow
  const startTrial = async (packageId: string, paymentMethod: PaymentRecord['paymentMethod'] = 'UPI') => {
    if (!currentUser) return false;
    const pkg = NUTRI_PACKAGES.find((p) => p.id === packageId);
    if (!pkg) return false;

    const startDate = simulatedToday;
    const endDateObj = new Date(startDate);
    endDateObj.setDate(endDateObj.getDate() + 7);
    const endDate = endDateObj.toISOString().split('T')[0];

    const updatedUser: User = {
      ...currentUser,
      currentPackageId: pkg.id,
      currentPackageName: pkg.name,
      currentPackageQuantity: pkg.quantity,
      membershipStatus: 'trial',
      trialDay: 1,
      trialStartDate: startDate,
      trialEndDate: endDate,
      remainingServiceDays: 0,
      paymentStatus: 'paid',
    };

    // Add payment record
    const newPayment: PaymentRecord = {
      id: `pay_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      packageId: pkg.id,
      packageName: `${pkg.name} — ${pkg.quantity}`,
      planType: 'trial',
      amount: pkg.trialPrice,
      date: simulatedToday,
      status: 'paid',
      paymentMethod,
      transactionRef: `UPI/NUTRIGO/${Math.floor(1000000000 + Math.random() * 9000000000)}`,
    };

    // Ensure delivery for today exists
    const newDelivery: Delivery = {
      id: `del_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userRollOrEmpId: currentUser.rollOrEmpId,
      department: currentUser.department,
      packageId: pkg.id,
      packageName: pkg.name,
      quantity: pkg.quantity,
      date: simulatedToday,
      status: 'pending',
    };

    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));
    setCurrentUser(updatedUser);
    setPayments((prev) => [newPayment, ...prev]);
    setDeliveries((prev) => [
      newDelivery,
      ...prev.filter((d) => !(d.userId === currentUser.id && d.date === simulatedToday)),
    ]);

    return true;
  };

  // Start Monthly Subscription directly
  const startMonthlyDirect = async (packageId: string, paymentMethod: PaymentRecord['paymentMethod'] = 'UPI') => {
    if (!currentUser) return false;
    const pkg = NUTRI_PACKAGES.find((p) => p.id === packageId);
    if (!pkg) return false;

    const updatedUser: User = {
      ...currentUser,
      currentPackageId: pkg.id,
      currentPackageName: pkg.name,
      currentPackageQuantity: pkg.quantity,
      membershipStatus: 'monthly',
      trialDay: 7,
      monthlyStartDate: simulatedToday,
      remainingServiceDays: 26,
      paymentStatus: 'paid',
    };

    const newPayment: PaymentRecord = {
      id: `pay_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      packageId: pkg.id,
      packageName: `${pkg.name} — ${pkg.quantity}`,
      planType: 'monthly',
      amount: pkg.monthlyPrice,
      date: simulatedToday,
      status: 'paid',
      paymentMethod,
      transactionRef: `NET/NUTRIGO/${Math.floor(1000000000 + Math.random() * 9000000000)}`,
    };

    const newDelivery: Delivery = {
      id: `del_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userRollOrEmpId: currentUser.rollOrEmpId,
      department: currentUser.department,
      packageId: pkg.id,
      packageName: pkg.name,
      quantity: pkg.quantity,
      date: simulatedToday,
      status: 'pending',
    };

    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));
    setCurrentUser(updatedUser);
    setPayments((prev) => [newPayment, ...prev]);
    setDeliveries((prev) => [
      newDelivery,
      ...prev.filter((d) => !(d.userId === currentUser.id && d.date === simulatedToday)),
    ]);

    return true;
  };

  // Trial completion decision (explicit customer choice)
  const respondToTrialCompletion = async (continueMonthly: boolean) => {
    if (!currentUser || !currentUser.currentPackageId) return false;
    const pkg = NUTRI_PACKAGES.find((p) => p.id === currentUser.currentPackageId);
    if (!pkg) return false;

    if (continueMonthly) {
      const updatedUser: User = {
        ...currentUser,
        membershipStatus: 'monthly',
        monthlyStartDate: simulatedToday,
        remainingServiceDays: 26,
        paymentStatus: 'paid',
      };

      const newPayment: PaymentRecord = {
        id: `pay_${Date.now()}`,
        userId: currentUser.id,
        userName: currentUser.name,
        packageId: pkg.id,
        packageName: `${pkg.name} — ${pkg.quantity}`,
        planType: 'monthly',
        amount: pkg.monthlyPrice,
        date: simulatedToday,
        status: 'paid',
        paymentMethod: 'UPI',
        transactionRef: `UPI/MONTHLY/${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      };

      setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));
      setCurrentUser(updatedUser);
      setPayments((prev) => [newPayment, ...prev]);
    } else {
      const updatedUser: User = {
        ...currentUser,
        membershipStatus: 'not_continued',
        remainingServiceDays: 0,
      };
      setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));
      setCurrentUser(updatedUser);
    }

    return true;
  };

  // Mark package received
  const markPackageReceived = async (deliveryId?: string) => {
    if (!currentUser) return false;

    const timeStr = `${simulatedToday} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    let targetDel = deliveries.find(
      (d) =>
        (deliveryId && d.id === deliveryId) ||
        (d.userId === currentUser.id && d.date === simulatedToday)
    );

    if (targetDel) {
      setDeliveries((prev) =>
        prev.map((d) =>
          d.id === targetDel!.id
            ? { ...d, status: 'received', receivedAt: timeStr }
            : d
        )
      );
    } else {
      // Create and mark received
      const pkgName = currentUser.currentPackageName || 'Sprouts';
      const pkgQty = currentUser.currentPackageQuantity || '150 g';
      const newDel: Delivery = {
        id: `del_${Date.now()}`,
        userId: currentUser.id,
        userName: currentUser.name,
        userRollOrEmpId: currentUser.rollOrEmpId,
        department: currentUser.department,
        packageId: currentUser.currentPackageId || 'sprouts',
        packageName: pkgName,
        quantity: pkgQty,
        date: simulatedToday,
        status: 'received',
        receivedAt: timeStr,
      };
      setDeliveries((prev) => [newDel, ...prev]);
    }

    return true;
  };

  // Submit Absence
  const submitAbsence = async (absenceDate: string, replacementItem: string) => {
    if (!currentUser) return { success: false, message: 'Please login first' };

    // Validation: Absence must be informed at least 1 day before
    const todayDate = new Date(simulatedToday);
    const targetAbsenceDate = new Date(absenceDate);
    const diffTime = targetAbsenceDate.getTime() - todayDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 1) {
      return {
        success: false,
        message: 'Absence must be informed at least one day before the service day.',
      };
    }

    const pkgName = currentUser.currentPackageName || 'Sprouts';
    const pkgQty = currentUser.currentPackageQuantity || '150 g';

    const newAbsence: AbsenceRequest = {
      id: `abs_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      originalPackage: `${pkgName} — ${pkgQty}`,
      originalQuantity: pkgQty,
      absenceDate,
      replacementItem,
      replacementQuantity: '200 g',
      requestDate: simulatedToday,
      status: 'confirmed',
      notes: 'Submitted 1-day prior. Replacement item scheduled.',
    };

    setAbsences((prev) => [newAbsence, ...prev]);

    // Also update any scheduled delivery for that day to absent
    setDeliveries((prev) => {
      const existing = prev.find((d) => d.userId === currentUser.id && d.date === absenceDate);
      if (existing) {
        return prev.map((d) =>
          d.id === existing.id
            ? { ...d, status: 'absent', notes: `Absence recorded. Replacement: ${replacementItem}` }
            : d
        );
      } else {
        return [
          {
            id: `del_abs_${Date.now()}`,
            userId: currentUser.id,
            userName: currentUser.name,
            userRollOrEmpId: currentUser.rollOrEmpId,
            department: currentUser.department,
            packageId: currentUser.currentPackageId || 'sprouts',
            packageName: pkgName,
            quantity: pkgQty,
            date: absenceDate,
            status: 'absent',
            notes: `Absence recorded. Replacement: ${replacementItem}`,
          },
          ...prev,
        ];
      }
    });

    return { success: true, message: 'Absence Successfully Recorded ✓' };
  };

  // Submit Feedback
  const submitFeedback = async (rating: number, categories: string[], comment: string) => {
    if (!currentUser) return false;

    const newFb: FeedbackItem = {
      id: `fb_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      date: simulatedToday,
      packageId: currentUser.currentPackageId || 'general',
      packageName: currentUser.currentPackageName
        ? `${currentUser.currentPackageName} (${currentUser.currentPackageQuantity})`
        : 'NutriGo Daily Portion',
      rating,
      categories,
      comment,
    };

    setFeedback((prev) => [newFb, ...prev]);
    return true;
  };

  // Admin actions
  const updateDeliveryStatus = (deliveryId: string, status: Delivery['status']) => {
    setDeliveries((prev) =>
      prev.map((d) => (d.id === deliveryId ? { ...d, status } : d))
    );
  };

  const markPaymentStatus = (paymentId: string, status: 'paid' | 'pending') => {
    setPayments((prev) =>
      prev.map((p) => (p.id === paymentId ? { ...p, status } : p))
    );
  };

  const advanceSimulatedDay = () => {
    const current = new Date(simulatedToday);
    current.setDate(current.getDate() + 1);
    const nextDateStr = current.toISOString().split('T')[0];
    setSimulatedToday(nextDateStr);

    // Increment trial days for active trial users
    setUsers((prev) =>
      prev.map((u) => {
        if (u.membershipStatus === 'trial') {
          if (u.trialDay < 7) {
            return { ...u, trialDay: u.trialDay + 1 };
          } else {
            // Day 7 reached! Marked as completed
            return { ...u, membershipStatus: 'trial_completed' };
          }
        }
        if (u.membershipStatus === 'monthly' && u.remainingServiceDays > 0) {
          return { ...u, remainingServiceDays: u.remainingServiceDays - 1 };
        }
        return u;
      })
    );

    // Update currentUser as well
    if (currentUser) {
      if (currentUser.membershipStatus === 'trial') {
        if (currentUser.trialDay < 7) {
          setCurrentUser({ ...currentUser, trialDay: currentUser.trialDay + 1 });
        } else {
          setCurrentUser({ ...currentUser, membershipStatus: 'trial_completed' });
        }
      } else if (currentUser.membershipStatus === 'monthly' && currentUser.remainingServiceDays > 0) {
        setCurrentUser({ ...currentUser, remainingServiceDays: currentUser.remainingServiceDays - 1 });
      }
    }
  };

  const resetAllData = () => {
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    setDeliveries(INITIAL_DELIVERIES);
    setAbsences(INITIAL_ABSENCES);
    setPayments(INITIAL_PAYMENTS);
    setFeedback(INITIAL_FEEDBACK);
    setSimulatedToday('2026-09-28');
    try {
      localStorage.clear();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <NutriGoContext.Provider
      value={{
        currentUser,
        users,
        deliveries,
        absences,
        payments,
        feedback,
        packages: NUTRI_PACKAGES,
        simulatedToday,
        login,
        loginAs,
        register,
        logout,
        startTrial,
        startMonthlyDirect,
        respondToTrialCompletion,
        markPackageReceived,
        submitAbsence,
        submitFeedback,
        updateDeliveryStatus,
        markPaymentStatus,
        advanceSimulatedDay,
        resetAllData,
      }}
    >
      {children}
    </NutriGoContext.Provider>
  );
}

export function useNutriGo() {
  const context = useContext(NutriGoContext);
  if (!context) {
    throw new Error('useNutriGo must be used within a NutriGoProvider');
  }
  return context;
}
