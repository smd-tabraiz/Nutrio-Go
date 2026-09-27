import React, { createContext, useContext, useState, useEffect } from 'react';
import { NUTRI_PACKAGES } from '../data/packages';

const NutriGoContext = createContext();

const STORAGE_KEY = 'nutrigo_mern_state_v1';

const INITIAL_USERS = [
  {
    id: 'user_1',
    name: 'Prabhashini Sharma',
    email: 'prabhashini@nutrigo.com',
    phone: '+91 98765 43210',
    rollOrEmpId: 'CS2024-042',
    department: 'Computer Science & Engg',
    role: 'customer',
    currentPackageId: 'sprouts',
    currentPackageName: 'Sprouts',
    currentPackageQuantity: '150 g',
    membershipStatus: 'trial',
    trialDay: 4,
    trialStartDate: '2026-09-24',
    trialEndDate: '2026-09-30',
    remainingServiceDays: 0,
    paymentStatus: 'paid',
  },
  {
    id: 'user_2',
    name: 'Aarav Patel',
    email: 'aarav.patel@nutrigo.com',
    phone: '+91 98123 45678',
    rollOrEmpId: 'MECH2023-112',
    department: 'Mechanical Engineering',
    role: 'customer',
    currentPackageId: 'fruits',
    currentPackageName: 'Fruits',
    currentPackageQuantity: '200 g',
    membershipStatus: 'trial',
    trialDay: 7,
    trialStartDate: '2026-09-21',
    trialEndDate: '2026-09-27',
    remainingServiceDays: 0,
    paymentStatus: 'paid',
  },
  {
    id: 'user_3',
    name: 'Ananya Deshmukh',
    email: 'ananya.d@nutrigo.com',
    phone: '+91 97654 32190',
    rollOrEmpId: 'FAC-BIO-108',
    department: 'Biotechnology Dept (Faculty)',
    role: 'customer',
    currentPackageId: 'sprouts-fruits-vegetables',
    currentPackageName: 'Sprouts + Fruits + Vegetables',
    currentPackageQuantity: '150 g Sprouts + 200 g Fruits + 200 g Vegetables',
    membershipStatus: 'monthly',
    trialDay: 7,
    monthlyStartDate: '2026-09-01',
    remainingServiceDays: 18,
    paymentStatus: 'paid',
  },
  {
    id: 'user_4',
    name: 'Rohan Verma',
    email: 'rohan.v@nutrigo.com',
    phone: '+91 98450 11223',
    rollOrEmpId: 'EC2024-089',
    department: 'Electronics & Communication',
    role: 'customer',
    currentPackageId: 'vegetables',
    currentPackageName: 'Vegetables',
    currentPackageQuantity: '200 g',
    membershipStatus: 'monthly',
    trialDay: 7,
    monthlyStartDate: '2026-09-10',
    remainingServiceDays: 14,
    paymentStatus: 'paid',
  },
  {
    id: 'admin_1',
    name: 'NutriGo Admin Ops',
    email: 'admin@nutrigo.com',
    phone: '+91 80000 12345',
    rollOrEmpId: 'NUTRIGO-ADMIN-01',
    department: 'NutriGo Kitchen & Operations Hub',
    role: 'admin',
    membershipStatus: 'none',
    trialDay: 0,
    remainingServiceDays: 0,
    paymentStatus: 'paid',
  },
];

const INITIAL_DELIVERIES = [
  {
    id: 'del_101',
    userId: 'user_1',
    userName: 'Prabhashini Sharma',
    userRollOrEmpId: 'CS2024-042',
    department: 'Computer Science & Engg',
    packageId: 'sprouts',
    packageName: 'Sprouts',
    quantity: '150 g',
    date: '2026-09-28',
    status: 'pending',
  },
  {
    id: 'del_102',
    userId: 'user_2',
    userName: 'Aarav Patel',
    userRollOrEmpId: 'MECH2023-112',
    department: 'Mechanical Engineering',
    packageId: 'fruits',
    packageName: 'Fruits',
    quantity: '200 g',
    date: '2026-09-28',
    status: 'received',
    receivedAt: '2026-09-28 09:15 AM',
  },
  {
    id: 'del_103',
    userId: 'user_3',
    userName: 'Ananya Deshmukh',
    userRollOrEmpId: 'FAC-BIO-108',
    department: 'Biotechnology Dept (Faculty)',
    packageId: 'sprouts-fruits-vegetables',
    packageName: 'Sprouts + Fruits + Vegetables',
    quantity: '150 g Sprouts + 200 g Fruits + 200 g Vegetables',
    date: '2026-09-28',
    status: 'received',
    receivedAt: '2026-09-28 08:45 AM',
  },
  {
    id: 'del_104',
    userId: 'user_4',
    userName: 'Rohan Verma',
    userRollOrEmpId: 'EC2024-089',
    department: 'Electronics & Communication',
    packageId: 'vegetables',
    packageName: 'Vegetables',
    quantity: '200 g',
    date: '2026-09-28',
    status: 'not_received',
  },
  {
    id: 'del_099',
    userId: 'user_1',
    userName: 'Prabhashini Sharma',
    userRollOrEmpId: 'CS2024-042',
    department: 'Computer Science & Engg',
    packageId: 'sprouts',
    packageName: 'Sprouts',
    quantity: '150 g',
    date: '2026-09-27',
    status: 'received',
    receivedAt: '2026-09-27 09:20 AM',
  },
];

const INITIAL_ABSENCES = [
  {
    id: 'abs_001',
    userId: 'user_1',
    userName: 'Prabhashini Sharma',
    originalPackage: 'Sprouts — 150 g',
    originalQuantity: '150 g',
    absenceDate: '2026-09-29',
    replacementItem: '🍎 Fruits — 200 g',
    replacementQuantity: '200 g',
    requestDate: '2026-09-28',
    status: 'confirmed',
  },
];

const INITIAL_PAYMENTS = [
  {
    id: 'pay_001',
    userId: 'user_1',
    userName: 'Prabhashini Sharma',
    packageId: 'sprouts',
    packageName: 'Sprouts — 150 g',
    planType: 'trial',
    amount: 133,
    date: '2026-09-24',
    status: 'paid',
    paymentMethod: 'UPI',
    transactionRef: 'UPI/NUTRIGO/9482914801',
  },
  {
    id: 'pay_002',
    userId: 'user_2',
    userName: 'Aarav Patel',
    packageId: 'fruits',
    packageName: 'Fruits — 200 g',
    planType: 'trial',
    amount: 203,
    date: '2026-09-21',
    status: 'paid',
    paymentMethod: 'UPI',
    transactionRef: 'UPI/NUTRIGO/8193819283',
  },
  {
    id: 'pay_003',
    userId: 'user_3',
    userName: 'Ananya Deshmukh',
    packageId: 'sprouts-fruits-vegetables',
    packageName: 'Sprouts + Fruits + Vegetables — 550 g',
    planType: 'monthly',
    amount: 1430,
    date: '2026-09-01',
    status: 'paid',
    paymentMethod: 'NetBanking',
    transactionRef: 'HDFC/NET/559281749',
  },
];

const INITIAL_FEEDBACK = [
  {
    id: 'fb_001',
    userId: 'user_1',
    userName: 'Prabhashini Sharma',
    date: '2026-09-27',
    packageId: 'sprouts',
    packageName: 'Sprouts (150 g)',
    rating: 5,
    categories: ['Freshness', 'Taste', 'Packaging'],
    comment: 'The sprouted moong and chana were wonderfully crisp and fresh! Perfectly portioned for morning breakfast.',
  },
  {
    id: 'fb_002',
    userId: 'user_3',
    userName: 'Ananya Deshmukh',
    date: '2026-09-28',
    packageId: 'sprouts-fruits-vegetables',
    packageName: 'Sprouts + Fruits + Vegetables (550 g)',
    rating: 5,
    categories: ['Freshness', 'Quantity', 'Overall experience'],
    comment: 'Consistent quality every single morning. The pomegranate seeds and cucumber slices keep me fueled.',
  },
];

export function NutriGoProvider({ children }) {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState(INITIAL_USERS[0]);
  const [deliveries, setDeliveries] = useState(INITIAL_DELIVERIES);
  const [absences, setAbsences] = useState(INITIAL_ABSENCES);
  const [payments, setPayments] = useState(INITIAL_PAYMENTS);
  const [feedback, setFeedback] = useState(INITIAL_FEEDBACK);
  const [simulatedToday, setSimulatedToday] = useState('2026-09-28');

  // Load saved state
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.users) setUsers(parsed.users);
        if (parsed.currentUser) setCurrentUser(parsed.currentUser);
        if (parsed.deliveries) setDeliveries(parsed.deliveries);
        if (parsed.absences) setAbsences(parsed.absences);
        if (parsed.payments) setPayments(parsed.payments);
        if (parsed.feedback) setFeedback(parsed.feedback);
        if (parsed.simulatedToday) setSimulatedToday(parsed.simulatedToday);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Save state
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          users,
          currentUser,
          deliveries,
          absences,
          payments,
          feedback,
          simulatedToday,
        })
      );
    } catch (e) {
      console.error(e);
    }
  }, [users, currentUser, deliveries, absences, payments, feedback, simulatedToday]);

  const login = (identifier) => {
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
    return { success: false, message: 'Invalid credentials. Try quick demo accounts.' };
  };

  const loginAs = (userId) => {
    const found = users.find((u) => u.id === userId);
    if (found) setCurrentUser(found);
  };

  const register = (data) => {
    const newId = `user_${Date.now()}`;
    const newUser = {
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

  const startTrial = async (packageId, paymentMethod = 'UPI') => {
    if (!currentUser) return false;
    const pkg = NUTRI_PACKAGES.find((p) => p.id === packageId);
    if (!pkg) return false;

    const startDate = simulatedToday;
    const endDateObj = new Date(startDate);
    endDateObj.setDate(endDateObj.getDate() + 7);
    const endDate = endDateObj.toISOString().split('T')[0];

    const updatedUser = {
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

    const newPayment = {
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

    const newDelivery = {
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

  const startMonthlyDirect = async (packageId, paymentMethod = 'UPI') => {
    if (!currentUser) return false;
    const pkg = NUTRI_PACKAGES.find((p) => p.id === packageId);
    if (!pkg) return false;

    const updatedUser = {
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

    const newPayment = {
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

    const newDelivery = {
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

  const respondToTrialCompletion = async (continueMonthly) => {
    if (!currentUser || !currentUser.currentPackageId) return false;
    const pkg = NUTRI_PACKAGES.find((p) => p.id === currentUser.currentPackageId);
    if (!pkg) return false;

    if (continueMonthly) {
      const updatedUser = {
        ...currentUser,
        membershipStatus: 'monthly',
        monthlyStartDate: simulatedToday,
        remainingServiceDays: 26,
        paymentStatus: 'paid',
      };

      const newPayment = {
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
      const updatedUser = {
        ...currentUser,
        membershipStatus: 'not_continued',
        remainingServiceDays: 0,
      };
      setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));
      setCurrentUser(updatedUser);
    }
    return true;
  };

  const markPackageReceived = async (deliveryId) => {
    if (!currentUser) return false;
    const timeStr = `${simulatedToday} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    let targetDel = deliveries.find(
      (d) => (deliveryId && d.id === deliveryId) || (d.userId === currentUser.id && d.date === simulatedToday)
    );

    if (targetDel) {
      setDeliveries((prev) =>
        prev.map((d) => (d.id === targetDel.id ? { ...d, status: 'received', receivedAt: timeStr } : d))
      );
    } else {
      const newDel = {
        id: `del_${Date.now()}`,
        userId: currentUser.id,
        userName: currentUser.name,
        userRollOrEmpId: currentUser.rollOrEmpId,
        department: currentUser.department,
        packageId: currentUser.currentPackageId || 'sprouts',
        packageName: currentUser.currentPackageName || 'Sprouts',
        quantity: currentUser.currentPackageQuantity || '150 g',
        date: simulatedToday,
        status: 'received',
        receivedAt: timeStr,
      };
      setDeliveries((prev) => [newDel, ...prev]);
    }
    return true;
  };

  const submitAbsence = async (absenceDate, replacementItem) => {
    if (!currentUser) return { success: false, message: 'Please login first' };
    const todayDate = new Date(simulatedToday);
    const targetDate = new Date(absenceDate);
    const diffDays = Math.ceil((targetDate.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 1) {
      return { success: false, message: 'Absence must be informed at least 1 day before the service day.' };
    }

    const pkgName = currentUser.currentPackageName || 'Sprouts';
    const pkgQty = currentUser.currentPackageQuantity || '150 g';

    const newAbsence = {
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
    };

    setAbsences((prev) => [newAbsence, ...prev]);
    return { success: true, message: 'Absence Successfully Recorded ✓' };
  };

  const submitFeedback = async (rating, categories, comment) => {
    if (!currentUser) return false;
    const newFb = {
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

  const updateDeliveryStatus = (deliveryId, status) => {
    setDeliveries((prev) => prev.map((d) => (d.id === deliveryId ? { ...d, status } : d)));
  };

  const markPaymentStatus = (paymentId, status) => {
    setPayments((prev) => prev.map((p) => (p.id === paymentId ? { ...p, status } : p)));
  };

  const advanceSimulatedDay = () => {
    const current = new Date(simulatedToday);
    current.setDate(current.getDate() + 1);
    const nextDateStr = current.toISOString().split('T')[0];
    setSimulatedToday(nextDateStr);

    setUsers((prev) =>
      prev.map((u) => {
        if (u.membershipStatus === 'trial') {
          if (u.trialDay < 7) {
            return { ...u, trialDay: u.trialDay + 1 };
          } else {
            return { ...u, membershipStatus: 'trial_completed' };
          }
        }
        if (u.membershipStatus === 'monthly' && u.remainingServiceDays > 0) {
          return { ...u, remainingServiceDays: u.remainingServiceDays - 1 };
        }
        return u;
      })
    );

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
    localStorage.removeItem(STORAGE_KEY);
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
  if (!context) throw new Error('useNutriGo must be used within NutriGoProvider');
  return context;
}
