'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useNutriGo } from '@/context/NutriGoContext';
import { NUTRI_PACKAGES } from '@/data/packages';
import {
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  CalendarX,
  Star,
  Layers,
  ChefHat,
  TrendingUp,
  Filter,
  Search,
  Check,
  XCircle,
  Plus,
  ArrowRight,
  Shield,
  Activity,
  BarChart3,
  Sparkles,
  RefreshCw,
  Box,
} from 'lucide-react';

type AdminTab =
  | 'overview'
  | 'operations'
  | 'deliveries'
  | 'trials'
  | 'monthly'
  | 'payments'
  | 'absences'
  | 'feedback'
  | 'analytics';

export default function AdminDashboardPage() {
  const {
    currentUser,
    users,
    deliveries,
    absences,
    payments,
    feedback,
    packages,
    simulatedToday,
    updateDeliveryStatus,
    markPaymentStatus,
    advanceSimulatedDay,
  } = useNutriGo();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Filters
  const [deliveryFilter, setDeliveryFilter] = useState<'all' | 'received' | 'pending' | 'not_received' | 'absent'>('all');
  const [trialPkgFilter, setTrialPkgFilter] = useState<string>('all');
  const [paymentTab, setPaymentTab] = useState<'all' | 'paid' | 'pending'>('all');
  const [feedbackPkgFilter, setFeedbackPkgFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 10. Admin Overview Calculations
  const customerUsers = users.filter((u) => u.role === 'customer');
  const totalCustomers = customerUsers.length;
  const trialCustomers = customerUsers.filter(
    (u) => u.membershipStatus === 'trial' || u.membershipStatus === 'trial_completed'
  );
  const monthlySubscribers = customerUsers.filter((u) => u.membershipStatus === 'monthly');
  const paidCustomersCount = customerUsers.filter((u) => u.paymentStatus === 'paid').length;
  const pendingPaymentsCount = payments.filter((p) => p.status === 'pending').length;

  const todayDeliveriesList = deliveries.filter((d) => d.date === simulatedToday);
  const todayReceivedCount = todayDeliveriesList.filter((d) => d.status === 'received').length;
  const todayNotReceivedCount = todayDeliveriesList.filter((d) => d.status === 'not_received').length;
  const todayPendingCount = todayDeliveriesList.filter((d) => d.status === 'pending').length;
  const todayAbsencesList = absences.filter((a) => a.absenceDate === simulatedToday || a.requestDate === simulatedToday);

  // 19. Daily Operational Kitchen Counts
  const kitchenPreparationCounts = packages.map((pkg) => {
    // Deliveries scheduled for today with this package
    const count = todayDeliveriesList.filter(
      (d) => d.packageId === pkg.id && d.status !== 'absent'
    ).length;
    return {
      pkg,
      count,
    };
  });
  const totalPortionsToPrepToday = kitchenPreparationCounts.reduce((acc, curr) => acc + curr.count, 0);

  // 18. Trial -> Monthly Conversion calculations
  const totalTrialsStarted = 24; // realistic baseline + active
  const trialsCompleted = 18;
  const continuedMonthly = 13;
  const didNotContinue = 5;
  const conversionRate = Math.round((continuedMonthly / trialsCompleted) * 100);

  // Deliveries filtered list
  const filteredDeliveries = todayDeliveriesList.filter((d) => {
    if (deliveryFilter !== 'all' && d.status !== deliveryFilter) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        d.userName.toLowerCase().includes(q) ||
        d.userRollOrEmpId.toLowerCase().includes(q) ||
        d.packageName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Admin Branding Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E5EBE3] shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative w-14 h-14 rounded-full overflow-hidden bg-[#FAF9F5] border border-emerald-100 shadow-2xs flex-shrink-0">
            <Image
              src="/nutrigo-logo.png"
              alt="NutriGo Logo"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-[#1E3F20]">NutriGo Operations Hub</h1>
              <span className="bg-emerald-950 text-emerald-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                Admin Console
              </span>
            </div>
            <p className="text-xs text-[#5C675E]">
              Campus Daily Fresh Distribution & Member Lifecycle Management • Simulated Date: <strong>{simulatedToday}</strong>
            </p>
          </div>
        </div>

        {/* Quick Day Simulation & Customer Switch button */}
        <div className="flex items-center gap-2">
          <button
            onClick={advanceSimulatedDay}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2D5A27] hover:bg-[#21431D] text-white text-xs font-semibold shadow-xs transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Advance 1 Day (+1)</span>
          </button>
          <Link
            href="/my-nutrigo"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FAF9F5] hover:bg-[#EBF3E8] text-[#2D5A27] border border-[#D5E2D2] text-xs font-semibold transition"
          >
            <span>Customer View</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 22. ADMIN NAVIGATION TABS */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs font-semibold border-b border-[#E5EBE3]">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3.5 py-2.5 rounded-t-xl transition whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'overview'
              ? 'bg-[#2D5A27] text-white shadow-xs'
              : 'text-[#5C675E] hover:text-[#1E3F20] hover:bg-[#EBF3E8]'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Dashboard Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('deliveries')}
          className={`px-3.5 py-2.5 rounded-t-xl transition whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'deliveries'
              ? 'bg-[#2D5A27] text-white shadow-xs'
              : 'text-[#5C675E] hover:text-[#1E3F20] hover:bg-[#EBF3E8]'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Today&apos;s Deliveries ({todayDeliveriesList.length})</span>
          {todayNotReceivedCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('operations')}
          className={`px-3.5 py-2.5 rounded-t-xl transition whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'operations'
              ? 'bg-[#2D5A27] text-white shadow-xs'
              : 'text-[#5C675E] hover:text-[#1E3F20] hover:bg-[#EBF3E8]'
          }`}
        >
          <ChefHat className="w-3.5 h-3.5" />
          <span>Kitchen Prep View</span>
        </button>

        <button
          onClick={() => setActiveTab('trials')}
          className={`px-3.5 py-2.5 rounded-t-xl transition whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'trials'
              ? 'bg-[#2D5A27] text-white shadow-xs'
              : 'text-[#5C675E] hover:text-[#1E3F20] hover:bg-[#EBF3E8]'
          }`}
        >
          <span>🟡 Trial Customers ({trialCustomers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('monthly')}
          className={`px-3.5 py-2.5 rounded-t-xl transition whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'monthly'
              ? 'bg-[#2D5A27] text-white shadow-xs'
              : 'text-[#5C675E] hover:text-[#1E3F20] hover:bg-[#EBF3E8]'
          }`}
        >
          <span>🟢 Monthly Subscribers ({monthlySubscribers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className={`px-3.5 py-2.5 rounded-t-xl transition whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'payments'
              ? 'bg-[#2D5A27] text-white shadow-xs'
              : 'text-[#5C675E] hover:text-[#1E3F20] hover:bg-[#EBF3E8]'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Payments ({payments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('absences')}
          className={`px-3.5 py-2.5 rounded-t-xl transition whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'absences'
              ? 'bg-[#2D5A27] text-white shadow-xs'
              : 'text-[#5C675E] hover:text-[#1E3F20] hover:bg-[#EBF3E8]'
          }`}
        >
          <CalendarX className="w-3.5 h-3.5" />
          <span>Absence Requests ({absences.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('feedback')}
          className={`px-3.5 py-2.5 rounded-t-xl transition whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'feedback'
              ? 'bg-[#2D5A27] text-white shadow-xs'
              : 'text-[#5C675E] hover:text-[#1E3F20] hover:bg-[#EBF3E8]'
          }`}
        >
          <Star className="w-3.5 h-3.5" />
          <span>Feedback ({feedback.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-3.5 py-2.5 rounded-t-xl transition whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'analytics'
              ? 'bg-[#2D5A27] text-white shadow-xs'
              : 'text-[#5C675E] hover:text-[#1E3F20] hover:bg-[#EBF3E8]'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Conversion & Summary</span>
        </button>
      </div>

      {/* 10. TAB: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in-50">
          {/* Top 8 Statistics Cards (Section 10) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-[#E5EBE3] shadow-soft space-y-1">
              <span className="text-[11px] font-semibold text-[#5C675E] uppercase tracking-wider block">
                Total Customers
              </span>
              <p className="text-2xl font-extrabold text-[#1E3F20]">{totalCustomers}</p>
              <span className="text-[10px] text-emerald-700">Active campus accounts</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E5EBE3] shadow-soft space-y-1">
              <span className="text-[11px] font-semibold text-[#5C675E] uppercase tracking-wider block">
                🟡 Trial Customers
              </span>
              <p className="text-2xl font-extrabold text-amber-700">{trialCustomers.length}</p>
              <span className="text-[10px] text-[#5C675E]">Active 7-day trials</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E5EBE3] shadow-soft space-y-1">
              <span className="text-[11px] font-semibold text-[#5C675E] uppercase tracking-wider block">
                🟢 Monthly Subscribers
              </span>
              <p className="text-2xl font-extrabold text-emerald-800">{monthlySubscribers.length}</p>
              <span className="text-[10px] text-[#5C675E]">26 service day plans</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E5EBE3] shadow-soft space-y-1">
              <span className="text-[11px] font-semibold text-[#5C675E] uppercase tracking-wider block">
                Paid Customers
              </span>
              <p className="text-2xl font-extrabold text-[#1E3F20]">{paidCustomersCount}</p>
              <span className="text-[10px] text-emerald-700">Verified receipts</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E5EBE3] shadow-soft space-y-1">
              <span className="text-[11px] font-semibold text-[#5C675E] uppercase tracking-wider block">
                🟠 Pending Payments
              </span>
              <p className="text-2xl font-extrabold text-amber-600">{pendingPaymentsCount}</p>
              <span className="text-[10px] text-amber-700">Awaiting UPI settlement</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E5EBE3] shadow-soft space-y-1">
              <span className="text-[11px] font-semibold text-[#5C675E] uppercase tracking-wider block">
                Today&apos;s Deliveries
              </span>
              <p className="text-2xl font-extrabold text-[#1E3F20]">{todayDeliveriesList.length}</p>
              <span className="text-[10px] text-emerald-700">{todayReceivedCount} Received ✓</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E5EBE3] shadow-soft space-y-1">
              <span className="text-[11px] font-semibold text-[#5C675E] uppercase tracking-wider block">
                🔴 Not Received
              </span>
              <p className="text-2xl font-extrabold text-red-600">{todayNotReceivedCount}</p>
              <span className="text-[10px] text-red-700">Needs counter check</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E5EBE3] shadow-soft space-y-1">
              <span className="text-[11px] font-semibold text-[#5C675E] uppercase tracking-wider block">
                🟣 Absence Requests
              </span>
              <p className="text-2xl font-extrabold text-purple-700">{absences.length}</p>
              <span className="text-[10px] text-purple-700">Swaps recorded</span>
            </div>
          </div>

          {/* Quick Dual View: Today's Operations Snapshot & Trial Conversion Snapshot */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Kitchen Prep Card */}
            <div className="bg-white rounded-3xl p-6 border border-[#E5EBE3] shadow-soft space-y-4">
              <div className="flex items-center justify-between border-b border-[#F0F4EE] pb-3">
                <div className="flex items-center gap-2">
                  <ChefHat className="w-5 h-5 text-emerald-700" />
                  <h3 className="font-bold text-[#1E3F20]">Morning Kitchen Preparation</h3>
                </div>
                <span className="text-xs font-bold text-[#2D5A27] bg-[#EBF3E8] px-2.5 py-1 rounded-full">
                  Total: {totalPortionsToPrepToday} Boxes
                </span>
              </div>

              <div className="space-y-2">
                {kitchenPreparationCounts.map(({ pkg, count }) => (
                  <div
                    key={pkg.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF9F5] border border-[#EDF3EC] text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span>{pkg.icon}</span>
                      <span className="font-semibold text-[#1E3F20]">{pkg.name}</span>
                      <span className="text-[#5C675E]">({pkg.quantity})</span>
                    </div>
                    <span className="font-bold text-[#2D5A27] text-sm">{count} packages</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trial to Monthly Conversion Metrics */}
            <div className="bg-white rounded-3xl p-6 border border-[#E5EBE3] shadow-soft space-y-4">
              <div className="flex items-center justify-between border-b border-[#F0F4EE] pb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-700" />
                  <h3 className="font-bold text-[#1E3F20]">Trial → Monthly Conversion</h3>
                </div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                  {conversionRate}% Conversion Rate
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#FAF9F5] border border-[#EDF3EC]">
                  <span className="text-[#5C675E] block">Total Trials Started</span>
                  <span className="text-lg font-bold text-[#1E3F20]">{totalTrialsStarted}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#FAF9F5] border border-[#EDF3EC]">
                  <span className="text-[#5C675E] block">Trials Completed</span>
                  <span className="text-lg font-bold text-[#1E3F20]">{trialsCompleted}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#EBF3E8] border border-emerald-200">
                  <span className="text-[#2D5A27] block font-medium">Continued Monthly</span>
                  <span className="text-lg font-bold text-[#2D5A27]">{continuedMonthly}</span>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                  <span className="text-[#5C675E] block">Did Not Continue</span>
                  <span className="text-lg font-bold text-[#5C675E]">{didNotContinue}</span>
                </div>
              </div>

              {/* Progress Visual Bar */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-[11px] text-[#5C675E]">
                  <span>Retention Percentage</span>
                  <span className="font-bold text-[#2D5A27]">{conversionRate}% continued</span>
                </div>
                <div className="w-full bg-[#E2EBE0] h-3 rounded-full overflow-hidden flex">
                  <div
                    className="bg-[#2D5A27] h-full"
                    style={{ width: `${conversionRate}%` }}
                  ></div>
                  <div
                    className="bg-gray-300 h-full"
                    style={{ width: `${100 - conversionRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 14. TAB: TODAY'S DELIVERY MANAGEMENT */}
      {activeTab === 'deliveries' && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E5EBE3] shadow-soft space-y-6 animate-in fade-in-50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F0F4EE] pb-4">
            <div>
              <h2 className="text-xl font-bold text-[#1E3F20]">
                Today&apos;s Deliveries — {simulatedToday}
              </h2>
              <p className="text-xs text-[#5C675E]">
                Track morning portion pickups across campus kiosks and departments.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              {(['all', 'received', 'pending', 'not_received', 'absent'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setDeliveryFilter(st)}
                  className={`px-3 py-1.5 rounded-xl border transition ${
                    deliveryFilter === st
                      ? 'bg-[#2D5A27] text-white border-[#2D5A27] font-semibold'
                      : 'bg-[#FAF9F5] text-[#5C675E] border-[#D5E2D2] hover:bg-[#F3F8F1]'
                  }`}
                >
                  {st === 'all'
                    ? `All (${todayDeliveriesList.length})`
                    : st === 'received'
                    ? `✅ Received (${todayReceivedCount})`
                    : st === 'pending'
                    ? `⏳ Pending (${todayPendingCount})`
                    : st === 'not_received'
                    ? `❌ Not Received (${todayNotReceivedCount})`
                    : `🟣 Absent`}
                </button>
              ))}
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by customer name, roll number, or package..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#D5E2D2] text-xs bg-[#FAF9F5] focus:outline-none focus:ring-1 focus:ring-[#2D5A27]"
            />
            <Search className="w-4 h-4 text-[#8C978E] absolute left-3 top-2.5" />
          </div>

          {/* Deliveries Table / Mobile Responsive Cards */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E5EBE3] text-[#5C675E] font-semibold bg-[#FAF9F5]">
                  <th className="p-3 rounded-l-xl">Customer</th>
                  <th className="p-3">Department / ID</th>
                  <th className="p-3">Package & Quantity</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3 rounded-r-xl text-right">Admin Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F4EE]">
                {filteredDeliveries.map((del) => (
                  <tr
                    key={del.id}
                    className={`hover:bg-[#FAF9F5] transition ${
                      del.status === 'not_received' ? 'bg-red-50/40' : ''
                    }`}
                  >
                    <td className="p-3 font-semibold text-[#1E3F20]">{del.userName}</td>
                    <td className="p-3 text-[#5C675E]">
                      {del.userRollOrEmpId} <br />
                      <span className="text-[10px]">{del.department}</span>
                    </td>
                    <td className="p-3">
                      <span className="font-semibold text-[#1E3F20]">{del.packageName}</span>
                      <span className="block text-[11px] text-[#4A7C59]">{del.quantity}</span>
                    </td>
                    <td className="p-3">
                      {del.status === 'received' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#EBF3E8] text-[#2D5A27]">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Received
                        </span>
                      ) : del.status === 'pending' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                          <Clock className="w-3 h-3 text-amber-600" />
                          Pending
                        </span>
                      ) : del.status === 'not_received' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-100 text-red-800 border border-red-200">
                          <XCircle className="w-3 h-3 text-red-600" />
                          Not Received
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                          🟣 Absent
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-[#5C675E] text-[11px]">
                      {del.receivedAt || '—'}
                    </td>
                    <td className="p-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => updateDeliveryStatus(del.id, 'received')}
                          title="Mark Received"
                          className="p-1 rounded bg-[#EBF3E8] text-[#2D5A27] hover:bg-emerald-200 text-[10px] font-medium"
                        >
                          ✓ Receive
                        </button>
                        <button
                          onClick={() => updateDeliveryStatus(del.id, 'not_received')}
                          title="Mark Not Received"
                          className="p-1 rounded bg-red-50 text-red-700 hover:bg-red-100 text-[10px] font-medium"
                        >
                          ✗ Not Rcvd
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 19. TAB: DAILY OPERATIONAL KITCHEN PREPARATION VIEW */}
      {activeTab === 'operations' && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E5EBE3] shadow-soft space-y-6 animate-in fade-in-50">
          <div className="flex items-center justify-between border-b border-[#F0F4EE] pb-4">
            <div>
              <h2 className="text-xl font-bold text-[#1E3F20]">Daily Kitchen Preparation Sheet</h2>
              <p className="text-xs text-[#5C675E]">
                Exact portions to prepare for morning campus dispatch.
              </p>
            </div>
            <span className="text-xs font-bold text-white bg-[#2D5A27] px-3 py-1.5 rounded-full shadow-xs">
              {totalPortionsToPrepToday} Total Portions
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {kitchenPreparationCounts.map(({ pkg, count }) => (
              <div
                key={pkg.id}
                className="p-5 rounded-2xl bg-[#FAF9F5] border border-[#EDF3EC] flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{pkg.icon}</span>
                    <span className="text-xl font-extrabold text-[#2D5A27]">{count} pkgs</span>
                  </div>
                  <h3 className="font-bold text-sm text-[#1E3F20]">{pkg.name}</h3>
                  <p className="text-xs font-semibold text-[#4A7C59]">{pkg.quantity}</p>
                </div>

                <div className="pt-2 border-t border-[#EDF3EC] text-[11px] text-[#5C675E] space-y-1">
                  <p>• Items: {pkg.items.join(', ')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 11. TAB: TRIAL CUSTOMERS */}
      {activeTab === 'trials' && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E5EBE3] shadow-soft space-y-6 animate-in fade-in-50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F0F4EE] pb-4">
            <div>
              <h2 className="text-xl font-bold text-[#1E3F20]">Trial Customers Management</h2>
              <p className="text-xs text-[#5C675E]">
                Customers currently on their 7 service days trial portion.
              </p>
            </div>

            {/* Package Filter */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#5C675E]">Filter Package:</span>
              <select
                value={trialPkgFilter}
                onChange={(e) => setTrialPkgFilter(e.target.value)}
                className="p-2 rounded-xl border border-[#D5E2D2] bg-white text-xs font-medium"
              >
                <option value="all">All Packages</option>
                {packages.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Package-wise Trial Counts (Section 11) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {packages.map((pkg) => {
              const count = trialCustomers.filter(
                (u) => u.currentPackageId === pkg.id
              ).length;
              return (
                <div
                  key={pkg.id}
                  className="p-3 rounded-xl bg-[#FAF9F5] border border-[#EDF3EC] flex items-center justify-between"
                >
                  <span className="text-[#1E3F20] font-medium">{pkg.icon} {pkg.name}</span>
                  <span className="font-bold text-[#2D5A27]">{count}</span>
                </div>
              );
            })}
          </div>

          {/* Trial Customers Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E5EBE3] text-[#5C675E] font-semibold bg-[#FAF9F5]">
                  <th className="p-3 rounded-l-xl">Customer</th>
                  <th className="p-3">Package</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Current Day</th>
                  <th className="p-3">Start Date</th>
                  <th className="p-3">Payment</th>
                  <th className="p-3 rounded-r-xl">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F4EE]">
                {trialCustomers
                  .filter(
                    (u) =>
                      trialPkgFilter === 'all' || u.currentPackageId === trialPkgFilter
                  )
                  .map((u) => (
                    <tr key={u.id} className="hover:bg-[#FAF9F5]">
                      <td className="p-3">
                        <strong className="text-[#1E3F20] block">{u.name}</strong>
                        <span className="text-[10px] text-[#5C675E]">{u.rollOrEmpId}</span>
                      </td>
                      <td className="p-3 font-medium text-[#1E3F20]">{u.currentPackageName}</td>
                      <td className="p-3 text-[#4A7C59]">{u.currentPackageQuantity}</td>
                      <td className="p-3 font-bold text-[#2D5A27]">{u.trialDay} / 7</td>
                      <td className="p-3 text-[#5C675E]">{u.trialStartDate || '2026-09-24'}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                          {u.paymentStatus.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          🟡 Active Trial
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 12. TAB: MONTHLY SUBSCRIBERS */}
      {activeTab === 'monthly' && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E5EBE3] shadow-soft space-y-6 animate-in fade-in-50">
          <div className="flex items-center justify-between border-b border-[#F0F4EE] pb-4">
            <div>
              <h2 className="text-xl font-bold text-[#1E3F20]">Monthly Subscribers (26 Service Days)</h2>
              <p className="text-xs text-[#5C675E]">
                Regular monthly subscribers receiving daily morning portions.
              </p>
            </div>
            <span className="text-xs font-bold text-[#2D5A27] bg-[#EBF3E8] px-3 py-1.5 rounded-full">
              {monthlySubscribers.length} Subscribers
            </span>
          </div>

          {/* Package-wise Monthly Counts (Section 12) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {packages.map((pkg) => {
              const count = monthlySubscribers.filter(
                (u) => u.currentPackageId === pkg.id
              ).length;
              return (
                <div
                  key={pkg.id}
                  className="p-3 rounded-xl bg-[#FAF9F5] border border-[#EDF3EC] flex items-center justify-between"
                >
                  <span className="text-[#1E3F20] font-medium">{pkg.icon} {pkg.name}</span>
                  <span className="font-bold text-[#2D5A27]">{count}</span>
                </div>
              );
            })}
          </div>

          {/* Monthly Subscribers Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E5EBE3] text-[#5C675E] font-semibold bg-[#FAF9F5]">
                  <th className="p-3 rounded-l-xl">Customer</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Package & Quantity</th>
                  <th className="p-3">Remaining Days</th>
                  <th className="p-3">Payment</th>
                  <th className="p-3 rounded-r-xl">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F4EE]">
                {monthlySubscribers.map((u) => (
                  <tr key={u.id} className="hover:bg-[#FAF9F5]">
                    <td className="p-3">
                      <strong className="text-[#1E3F20] block">{u.name}</strong>
                      <span className="text-[10px] text-[#5C675E]">{u.rollOrEmpId}</span>
                    </td>
                    <td className="p-3 text-[#5C675E]">{u.department}</td>
                    <td className="p-3">
                      <span className="font-semibold text-[#1E3F20]">{u.currentPackageName}</span>
                      <span className="block text-[10px] text-[#4A7C59]">{u.currentPackageQuantity}</span>
                    </td>
                    <td className="p-3 font-bold text-[#2D5A27]">
                      {u.remainingServiceDays} / 26 days
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          u.paymentStatus === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {u.paymentStatus.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        🟢 Active Monthly
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 13. TAB: PAYMENT MANAGEMENT */}
      {activeTab === 'payments' && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E5EBE3] shadow-soft space-y-6 animate-in fade-in-50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F0F4EE] pb-4">
            <div>
              <h2 className="text-xl font-bold text-[#1E3F20]">Payment Management</h2>
              <p className="text-xs text-[#5C675E]">
                Reconcile trial & monthly subscription payments cleanly without sensitive exposure.
              </p>
            </div>

            {/* Paid vs Pending Filter */}
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() => setPaymentTab('all')}
                className={`px-3 py-1.5 rounded-xl border transition ${
                  paymentTab === 'all'
                    ? 'bg-[#2D5A27] text-white'
                    : 'bg-[#FAF9F5] text-[#5C675E] border-[#D5E2D2]'
                }`}
              >
                All ({payments.length})
              </button>
              <button
                onClick={() => setPaymentTab('paid')}
                className={`px-3 py-1.5 rounded-xl border transition ${
                  paymentTab === 'paid'
                    ? 'bg-[#2D5A27] text-white'
                    : 'bg-[#FAF9F5] text-[#5C675E] border-[#D5E2D2]'
                }`}
              >
                Paid ({payments.filter((p) => p.status === 'paid').length})
              </button>
              <button
                onClick={() => setPaymentTab('pending')}
                className={`px-3 py-1.5 rounded-xl border transition ${
                  paymentTab === 'pending'
                    ? 'bg-[#2D5A27] text-white'
                    : 'bg-[#FAF9F5] text-[#5C675E] border-[#D5E2D2]'
                }`}
              >
                🟠 Pending ({pendingPaymentsCount})
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E5EBE3] text-[#5C675E] font-semibold bg-[#FAF9F5]">
                  <th className="p-3 rounded-l-xl">Customer</th>
                  <th className="p-3">Package / Plan</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Method / Ref</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 rounded-r-xl text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F4EE]">
                {payments
                  .filter((p) => paymentTab === 'all' || p.status === paymentTab)
                  .map((p) => (
                    <tr key={p.id} className="hover:bg-[#FAF9F5]">
                      <td className="p-3 font-semibold text-[#1E3F20]">{p.userName}</td>
                      <td className="p-3">
                        <span className="font-semibold text-[#1E3F20]">{p.packageName}</span>
                        <span className="block text-[10px] text-[#4A7C59]">
                          {p.planType === 'trial' ? '7-Day Trial' : '26-Day Monthly'}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-sm text-[#2D5A27]">₹{p.amount}</td>
                      <td className="p-3 text-[#5C675E]">{p.date}</td>
                      <td className="p-3 text-[11px] text-[#5C675E]">
                        {p.paymentMethod} {p.transactionRef && `• ${p.transactionRef}`}
                      </td>
                      <td className="p-3">
                        {p.status === 'paid' ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            ✓ PAID
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                            ⏳ PENDING
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        {p.status === 'pending' ? (
                          <button
                            onClick={() => markPaymentStatus(p.id, 'paid')}
                            className="px-2.5 py-1 rounded bg-[#2D5A27] text-white text-[10px] font-semibold hover:bg-[#21431D]"
                          >
                            Mark Paid
                          </button>
                        ) : (
                          <span className="text-[11px] text-emerald-700">Settled</span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 15. TAB: ABSENCE MANAGEMENT */}
      {activeTab === 'absences' && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E5EBE3] shadow-soft space-y-6 animate-in fade-in-50">
          <div className="border-b border-[#F0F4EE] pb-4">
            <h2 className="text-xl font-bold text-[#1E3F20]">Upcoming Absence & Replacement Requests</h2>
            <p className="text-xs text-[#5C675E]">
              1-day advance notifications received with customer-selected replacement fruit or vegetable items.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E5EBE3] text-[#5C675E] font-semibold bg-[#FAF9F5]">
                  <th className="p-3 rounded-l-xl">Customer</th>
                  <th className="p-3">Original Package</th>
                  <th className="p-3">Absence Date</th>
                  <th className="p-3">Replacement Item</th>
                  <th className="p-3">Requested On</th>
                  <th className="p-3 rounded-r-xl">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F4EE]">
                {absences.map((ab) => (
                  <tr key={ab.id} className="hover:bg-[#FAF9F5]">
                    <td className="p-3 font-semibold text-[#1E3F20]">{ab.userName}</td>
                    <td className="p-3 text-[#5C675E]">{ab.originalPackage}</td>
                    <td className="p-3 font-bold text-purple-900">{ab.absenceDate}</td>
                    <td className="p-3 font-bold text-[#2D5A27]">{ab.replacementItem}</td>
                    <td className="p-3 text-[#5C675E]">{ab.requestDate}</td>
                    <td className="p-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                        ✓ Confirmed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 16. TAB: FEEDBACK MANAGEMENT */}
      {activeTab === 'feedback' && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E5EBE3] shadow-soft space-y-6 animate-in fade-in-50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F0F4EE] pb-4">
            <div>
              <h2 className="text-xl font-bold text-[#1E3F20]">Feedback & Quality Ratings</h2>
              <p className="text-xs text-[#5C675E]">
                Campus feedback on portion freshness, taste, packaging, and delivery.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#5C675E]">Filter:</span>
              <select
                value={feedbackPkgFilter}
                onChange={(e) => setFeedbackPkgFilter(e.target.value)}
                className="p-2 rounded-xl border border-[#D5E2D2] bg-white text-xs font-medium"
              >
                <option value="all">All Packages</option>
                {packages.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {feedback
              .filter(
                (f) =>
                  feedbackPkgFilter === 'all' ||
                  f.packageName.toLowerCase().includes(feedbackPkgFilter.toLowerCase())
              )
              .map((fb) => (
                <div
                  key={fb.id}
                  className="p-5 rounded-2xl bg-[#FAF9F5] border border-[#EDF3EC] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-[#1E3F20]">{fb.userName}</h4>
                      <p className="text-[11px] text-[#4A7C59]">{fb.packageName}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-0.5 justify-end">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= fb.rating
                                ? 'text-amber-500 fill-amber-500'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-[#5C675E]">{fb.date}</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#334139] leading-relaxed bg-white p-3 rounded-xl border border-[#EDF3EC]">
                    &ldquo;{fb.comment}&rdquo;
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {fb.categories.map((c, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-[#EBF3E8] text-[#2D5A27] text-[10px] font-semibold"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 17. TAB: PACKAGE-WISE BUSINESS SUMMARY & CONVERSION ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-8 animate-in fade-in-50">
          {/* 17. Package-Wise Business Summary Table */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E5EBE3] shadow-soft space-y-4">
            <div className="border-b border-[#F0F4EE] pb-3">
              <h2 className="text-xl font-bold text-[#1E3F20]">
                Package-Wise Business Summary
              </h2>
              <p className="text-xs text-[#5C675E]">
                Performance metrics, subscriber totals, and payment distributions across all 7 packages.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#E5EBE3] text-[#5C675E] font-semibold bg-[#FAF9F5]">
                    <th className="p-3 rounded-l-xl">Package & Quantity</th>
                    <th className="p-3">Daily Rate</th>
                    <th className="p-3">Trial Customers</th>
                    <th className="p-3">Monthly Subscribers</th>
                    <th className="p-3">Total Active</th>
                    <th className="p-3">Paid Status</th>
                    <th className="p-3 rounded-r-xl">Pending Payments</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0F4EE]">
                  {packages.map((pkg) => {
                    const trials = trialCustomers.filter((u) => u.currentPackageId === pkg.id).length;
                    const monthlies = monthlySubscribers.filter((u) => u.currentPackageId === pkg.id).length;
                    const total = trials + monthlies;
                    const pending = payments.filter((p) => p.packageId === pkg.id && p.status === 'pending').length;
                    const paid = total - pending;

                    return (
                      <tr key={pkg.id} className="hover:bg-[#FAF9F5]">
                        <td className="p-3">
                          <strong className="text-[#1E3F20] block">
                            {pkg.icon} {pkg.name}
                          </strong>
                          <span className="text-[10px] text-[#4A7C59]">{pkg.quantity}</span>
                        </td>
                        <td className="p-3 font-semibold text-[#1E3F20]">₹{pkg.dailyPrice}/day</td>
                        <td className="p-3 font-bold text-amber-700">{trials}</td>
                        <td className="p-3 font-bold text-emerald-700">{monthlies}</td>
                        <td className="p-3 font-extrabold text-[#1E3F20]">{total}</td>
                        <td className="p-3 text-emerald-800 font-semibold">{Math.max(0, paid)} Paid</td>
                        <td className="p-3 text-amber-700 font-semibold">
                          {pending > 0 ? `${pending} Pending` : '0'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 18. Trial -> Monthly Conversion Visual Breakdown */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E5EBE3] shadow-soft space-y-6">
            <div className="border-b border-[#F0F4EE] pb-3">
              <h2 className="text-xl font-bold text-[#1E3F20]">
                Trial → Monthly Conversion Funnel
              </h2>
              <p className="text-xs text-[#5C675E]">
                Clean funnel tracking how 7-day trials seamlessly transition to full 26-service-day monthly habits.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
              <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#EDF3EC] space-y-1">
                <span className="text-[11px] text-[#5C675E] block">1. Trials Started</span>
                <span className="text-2xl font-bold text-[#1E3F20]">{totalTrialsStarted}</span>
                <span className="text-[10px] text-[#5C675E]">100% of trial cohort</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#EDF3EC] space-y-1">
                <span className="text-[11px] text-[#5C675E] block">2. Trials Completed</span>
                <span className="text-2xl font-bold text-[#1E3F20]">{trialsCompleted}</span>
                <span className="text-[10px] text-emerald-700">75% completed 7 days</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#EBF3E8] border border-emerald-200 space-y-1">
                <span className="text-[11px] text-[#2D5A27] font-semibold block">3. Continued Monthly</span>
                <span className="text-2xl font-extrabold text-[#2D5A27]">{continuedMonthly}</span>
                <span className="text-[10px] text-[#2D5A27] font-bold">72% of completed</span>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-1">
                <span className="text-[11px] text-[#5C675E] block">4. Did Not Continue</span>
                <span className="text-2xl font-bold text-[#5C675E]">{didNotContinue}</span>
                <span className="text-[10px] text-[#5C675E]">Zero auto-charges</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
