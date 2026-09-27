'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useNutriGo } from '@/context/NutriGoContext';
import { NUTRI_PACKAGES } from '@/data/packages';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  Calendar,
  AlertCircle,
  CalendarX,
  Star,
  ArrowRight,
  Package,
  Check,
  History,
  Info,
  PhoneCall,
  ChevronRight,
  Heart,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function MyNutriGoPage() {
  const {
    currentUser,
    deliveries,
    absences,
    markPackageReceived,
    submitAbsence,
    submitFeedback,
    respondToTrialCompletion,
    simulatedToday,
  } = useNutriGo();

  // Modals & UI states
  const [showAbsenceModal, setShowAbsenceModal] = useState(false);
  const [absenceDate, setAbsenceDate] = useState(() => {
    // Tomorrow by default
    const d = new Date(simulatedToday || '2026-09-28');
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [replacementItem, setReplacementItem] = useState('🍎 Fruits — 200 g');
  const [absenceError, setAbsenceError] = useState('');
  const [absenceSuccessMsg, setAbsenceSuccessMsg] = useState('');

  // Feedback State
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [fbRating, setFbRating] = useState(5);
  const [fbCategories, setFbCategories] = useState<string[]>(['Freshness', 'Taste']);
  const [fbComment, setFbComment] = useState('');
  const [fbSubmitted, setFbSubmitted] = useState(false);

  // Mark received loading
  const [isMarking, setIsMarking] = useState(false);

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 bg-[#EBF3E8] rounded-full flex items-center justify-center mx-auto text-3xl">
          🌱
        </div>
        <h2 className="text-2xl font-bold text-[#1E3F20]">Welcome to NutriGo</h2>
        <p className="text-sm text-[#5C675E]">
          Please log in to view your daily portion status, report absences, and confirm delivery.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-[#2D5A27] text-white font-semibold shadow-xs"
        >
          <span>Log In to My NutriGo</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  // Today's delivery for current user
  const todayDelivery = deliveries.find(
    (d) => d.userId === currentUser.id && d.date === simulatedToday
  );
  const isReceived = todayDelivery?.status === 'received';
  const isAbsentToday = todayDelivery?.status === 'absent';

  // Current package object
  const pkg =
    NUTRI_PACKAGES.find((p) => p.id === currentUser.currentPackageId) || NUTRI_PACKAGES[0];

  // User's delivery history
  const userDeliveries = deliveries.filter((d) => d.userId === currentUser.id);
  const userAbsences = absences.filter((a) => a.userId === currentUser.id);

  const handleReceive = async () => {
    setIsMarking(true);
    await markPackageReceived(todayDelivery?.id);
    setIsMarking(false);
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#2D5A27', '#4A7C59', '#8FAF85'],
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleConfirmAbsence = async (e: React.FormEvent) => {
    e.preventDefault();
    setAbsenceError('');
    const res = await submitAbsence(absenceDate, replacementItem);
    if (!res.success) {
      setAbsenceError(res.message);
    } else {
      setAbsenceSuccessMsg(res.message);
      setTimeout(() => {
        setAbsenceSuccessMsg('');
        setShowAbsenceModal(false);
      }, 1500);
    }
  };

  const handleCategoryToggle = (cat: string) => {
    if (fbCategories.includes(cat)) {
      setFbCategories(fbCategories.filter((c) => c !== cat));
    } else {
      setFbCategories([...fbCategories, cat]);
    }
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitFeedback(fbRating, fbCategories, fbComment);
    setFbSubmitted(true);
    setTimeout(() => {
      setFbSubmitted(false);
      setShowFeedbackModal(false);
      setFbComment('');
    }, 1500);
  };

  const isTrial = currentUser.membershipStatus === 'trial';
  const isTrialCompleted =
    currentUser.membershipStatus === 'trial_completed' ||
    (isTrial && currentUser.trialDay >= 7);
  const isMonthly = currentUser.membershipStatus === 'monthly';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* 1. GREETING & STATUS BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-[#E5EBE3] shadow-soft">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4A7C59]">
            <span>Today is {simulatedToday}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1E3F20]">
            Good morning, {currentUser.name.split(' ')[0]} 🌱
          </h1>
          <p className="text-xs sm:text-sm text-[#5C675E]">
            {currentUser.rollOrEmpId} • {currentUser.department}
          </p>
        </div>

        {/* Membership Status Badge */}
        <div className="flex sm:flex-col items-end justify-between sm:justify-center">
          <span className="text-[11px] text-[#5C675E] uppercase tracking-wider block mb-1">
            Membership Status
          </span>
          {isTrial ? (
            <div className="flex items-center gap-2 bg-[#FEF3C7] text-[#92400E] border border-amber-300 px-3.5 py-1.5 rounded-full text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              <span>🟡 7-Day Trial</span>
            </div>
          ) : isTrialCompleted ? (
            <div className="flex items-center gap-2 bg-[#DBEAFE] text-[#1E40AF] border border-blue-300 px-3.5 py-1.5 rounded-full text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span>⚪ Trial Complete</span>
            </div>
          ) : isMonthly ? (
            <div className="flex items-center gap-2 bg-[#EBF3E8] text-[#2D5A27] border border-emerald-300 px-3.5 py-1.5 rounded-full text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span>🟢 Monthly Subscription</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-[#F3F4F6] text-[#4B5563] border border-gray-300 px-3.5 py-1.5 rounded-full text-xs font-bold">
              <span>⚪ No Active Plan</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. TRIAL COMPLETION MODAL / PROMPT (SECTION 4) */}
      {isTrialCompleted && (
        <div className="bg-gradient-to-br from-[#F3F8F1] to-[#FAF9F5] rounded-3xl p-6 sm:p-8 border-2 border-[#2D5A27] shadow-card space-y-6 animate-in zoom-in-95">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎉</span>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1E3F20]">
                Your 7-Day Trial is Complete 🎉
              </h2>
              <p className="text-xs sm:text-sm text-[#465849]">
                You have completed all 7 trial service days. We hope you enjoyed your fresh daily portion!
              </p>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-emerald-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-[#5C675E] block">Selected Package:</span>
              <strong className="text-sm text-[#1E3F20]">
                {pkg.icon} {currentUser.currentPackageName || pkg.name}
              </strong>
            </div>
            <div>
              <span className="text-[#5C675E] block">Portion Quantity:</span>
              <strong className="text-sm text-[#2D5A27]">
                {currentUser.currentPackageQuantity || pkg.quantity}
              </strong>
            </div>
            <div>
              <span className="text-[#5C675E] block">Monthly Subscription (26 Days):</span>
              <strong className="text-sm text-[#1E3F20]">
                ₹{pkg.monthlyPrice}{' '}
                <span className="text-[11px] font-normal text-[#5C675E]">
                  (₹{pkg.dailyPrice}/day)
                </span>
              </strong>
            </div>
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
            <Info className="w-4 h-4 flex-shrink-0 text-amber-700" />
            <span>
              <strong>Zero Automatic Charges:</strong> You must explicitly choose whether to continue. We never auto-debit cards or bank accounts.
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => respondToTrialCompletion(true)}
              className="flex-1 py-3 px-4 rounded-xl bg-[#2D5A27] hover:bg-[#21431D] text-white font-semibold text-sm shadow-xs transition flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Continue with Monthly Subscription (₹{pkg.monthlyPrice})</span>
            </button>

            <button
              onClick={() => respondToTrialCompletion(false)}
              className="py-3 px-5 rounded-xl bg-white hover:bg-gray-100 text-[#5C675E] border border-gray-300 font-medium text-sm transition"
            >
              I Don&apos;t Want to Continue
            </button>
          </div>
        </div>
      )}

      {/* 3. MAIN DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 Cols): Current Package & Today's Delivery */}
        <div className="lg:col-span-8 space-y-6">
          {/* A. Current Package & Progress Card */}
          <div className="bg-white rounded-3xl p-6 border border-[#E5EBE3] shadow-soft space-y-4">
            <div className="flex items-center justify-between border-b border-[#F0F4EE] pb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl p-2 bg-[#FAF9F5] rounded-2xl border border-[#EDF3EC]">
                  {pkg.icon}
                </span>
                <div>
                  <span className="text-[11px] font-semibold text-[#5C675E] uppercase tracking-wider block">
                    Current Package
                  </span>
                  <h3 className="text-lg font-bold text-[#1E3F20]">
                    {currentUser.currentPackageName || pkg.name}
                  </h3>
                  <span className="text-xs font-semibold text-[#2D5A27]">
                    {currentUser.currentPackageQuantity || pkg.quantity}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-[#5C675E] block">Daily Rate</span>
                <span className="text-base font-bold text-[#1E3F20]">₹{pkg.dailyPrice}/day</span>
              </div>
            </div>

            {/* Trial or Monthly Progress Bar */}
            {isTrial ? (
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#1E3F20]">
                    Trial Day {currentUser.trialDay} / 7
                  </span>
                  <span className="text-[#5C675E]">
                    {7 - currentUser.trialDay} service days remaining
                  </span>
                </div>

                <div className="w-full bg-[#E5EFE2] h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-[#2D5A27] h-full rounded-full transition-all duration-500"
                    style={{ width: `${(currentUser.trialDay / 7) * 100}%` }}
                  ></div>
                </div>
              </div>
            ) : isMonthly ? (
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#1E3F20]">
                    Monthly Subscription Active
                  </span>
                  <span className="font-bold text-[#2D5A27]">
                    {currentUser.remainingServiceDays} Service Days Remaining
                  </span>
                </div>

                <div className="w-full bg-[#E5EFE2] h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-[#2D5A27] h-full rounded-full transition-all duration-500"
                    style={{ width: `${(currentUser.remainingServiceDays / 26) * 100}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              <div className="pt-2">
                <Link
                  href="/packages"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2D5A27] hover:underline"
                >
                  <span>Select a package to start</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>

          {/* B. Today's Delivery Card (Section 6) */}
          <div className="bg-white rounded-3xl p-6 border border-[#E5EBE3] shadow-soft space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-[#5C675E] uppercase tracking-wider block">
                  Today&apos;s NutriGo
                </span>
                <h3 className="text-xl font-bold text-[#1E3F20]">
                  {currentUser.currentPackageName || pkg.name} —{' '}
                  <span className="text-[#2D5A27]">
                    {currentUser.currentPackageQuantity || pkg.quantity}
                  </span>
                </h3>
              </div>

              {/* Status Indicator */}
              <div>
                {isReceived ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#EBF3E8] text-[#2D5A27] border border-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Package Received ✓
                  </span>
                ) : isAbsentToday ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-purple-50 text-purple-800 border border-purple-200">
                    🟣 Absence Recorded
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#FFFBEB] text-[#B45309] border border-amber-200">
                    <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                    Waiting for confirmation
                  </span>
                )}
              </div>
            </div>

            {/* Confirmation CTA button */}
            {isReceived ? (
              <div className="bg-[#FAF9F5] p-4 rounded-2xl border border-[#EDF3EC] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-[#2D5A27]">
                  <Check className="w-4 h-4 font-bold" />
                  <span>
                    Recorded pickup today at{' '}
                    <strong>
                      {todayDelivery?.receivedAt || `${simulatedToday} morning`}
                    </strong>
                  </span>
                </div>

                <button
                  onClick={() => setShowFeedbackModal(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#D5E2D2] text-[#2D5A27] hover:bg-[#F3F8F1] font-semibold transition"
                >
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>⭐ Today&apos;s Feedback</span>
                </button>
              </div>
            ) : isAbsentToday ? (
              <div className="bg-purple-50/70 p-4 rounded-2xl border border-purple-200 text-xs text-purple-900 space-y-1">
                <p className="font-semibold">Absence in effect for today.</p>
                <p className="text-[11px] text-purple-700">
                  Your replacement fruit/veg item has been credited per policy.
                </p>
              </div>
            ) : (
              <div className="space-y-3 pt-2">
                <p className="text-xs text-[#5C675E]">
                  Has your fresh daily portion arrived at your campus kiosk or department desk?
                </p>
                <button
                  onClick={handleReceive}
                  disabled={isMarking}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#2D5A27] hover:bg-[#21431D] text-white font-semibold text-sm shadow-soft transition"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>✅ I Received My Package</span>
                </button>
              </div>
            )}
          </div>

          {/* C. Delivery History Log */}
          <div className="bg-white rounded-3xl p-6 border border-[#E5EBE3] shadow-soft space-y-4">
            <div className="flex items-center justify-between border-b border-[#F0F4EE] pb-3">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-[#4A7C59]" />
                <h3 className="text-base font-bold text-[#1E3F20]">Delivery History</h3>
              </div>
              <span className="text-xs text-[#5C675E]">{userDeliveries.length} records</span>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {userDeliveries.map((d) => (
                <div
                  key={d.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF9F5] border border-[#EDF3EC] text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-[#1E3F20]">{d.date}</span>
                    <span className="text-[#5C675E]">{d.packageName}</span>
                  </div>

                  <div>
                    {d.status === 'received' ? (
                      <span className="text-emerald-700 font-medium">✓ Received</span>
                    ) : d.status === 'absent' ? (
                      <span className="text-purple-700 font-medium">🟣 Absent</span>
                    ) : d.status === 'not_received' ? (
                      <span className="text-red-600 font-medium">❌ Not Received</span>
                    ) : (
                      <span className="text-amber-600 font-medium">⏳ Pending</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 Cols): Absence & Quick Actions */}
        <div className="lg:col-span-4 space-y-6">
          {/* Absence Feature Card (Section 7) */}
          <div className="bg-white rounded-3xl p-6 border border-[#E5EBE3] shadow-soft space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-[#EBF3E8] flex items-center justify-center text-xl">
              🗓️
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#1E3F20]">
                Can&apos;t receive your package tomorrow?
              </h3>
              <p className="text-xs text-[#5C675E] leading-relaxed">
                If you inform NutriGo 1 day prior, you can choose an extra fruit or vegetable item for the applicable service day.
              </p>
            </div>

            <button
              onClick={() => setShowAbsenceModal(true)}
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-[#FAF9F5] hover:bg-[#F3F8F1] text-[#2D5A27] border border-[#D5E2D2] text-xs font-semibold transition"
            >
              <CalendarX className="w-4 h-4 text-[#2D5A27]" />
              <span>Inform Absence</span>
            </button>

            {userAbsences.length > 0 && (
              <div className="pt-2 border-t border-[#F0F4EE] space-y-2">
                <span className="text-[11px] font-bold text-[#5C675E] uppercase tracking-wider block">
                  Upcoming Recorded Absences
                </span>
                {userAbsences.map((ab) => (
                  <div
                    key={ab.id}
                    className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-200 text-xs text-purple-900 space-y-0.5"
                  >
                    <div className="flex justify-between font-semibold">
                      <span>{ab.absenceDate}</span>
                      <span className="text-purple-700">✓ Confirmed</span>
                    </div>
                    <p className="text-[11px] text-purple-800">
                      Replacement: {ab.replacementItem}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Feedback Trigger Card */}
          <div className="bg-white rounded-3xl p-6 border border-[#E5EBE3] shadow-soft space-y-3">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              <h3 className="text-base font-bold text-[#1E3F20]">Today&apos;s Feedback</h3>
            </div>
            <p className="text-xs text-[#5C675E] leading-relaxed">
              Help us maintain pure quality. Rate today&apos;s freshness, portion, and packaging.
            </p>
            <button
              onClick={() => setShowFeedbackModal(true)}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#2D5A27] hover:bg-[#21431D] text-white text-xs font-semibold shadow-xs transition"
            >
              <span>⭐ Today&apos;s Feedback</span>
            </button>
          </div>

          {/* Extended Absence Notice */}
          <div className="p-4 bg-[#FAF9F5] rounded-2xl border border-[#EDF3EC] text-xs text-[#5C675E] space-y-2">
            <p className="font-semibold text-[#1E3F20]">For longer absences (3+ days):</p>
            <p className="text-[11px] leading-relaxed">
              Please contact the NutriGo operations desk directly so we can pause and extend your active service days calendar.
            </p>
            <a
              href="tel:+918000012345"
              className="inline-flex items-center gap-1.5 text-[#2D5A27] font-semibold hover:underline"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call +91 80000 12345</span>
            </a>
          </div>
        </div>
      </div>

      {/* 4. ABSENCE MODAL (SECTION 7) */}
      {showAbsenceModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#E5EBE3] shadow-card space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#F0F4EE] pb-3">
              <h3 className="text-lg font-bold text-[#1E3F20]">Inform Absence</h3>
              <button
                onClick={() => setShowAbsenceModal(false)}
                className="text-[#5C675E] hover:text-[#1E3F20] text-sm"
              >
                ✕
              </button>
            </div>

            {absenceSuccessMsg ? (
              <div className="p-6 bg-[#EBF3E8] rounded-2xl text-center space-y-2">
                <span className="text-3xl">✓</span>
                <h4 className="text-base font-bold text-[#2D5A27]">
                  Absence Successfully Recorded ✓
                </h4>
                <p className="text-xs text-[#465849]">
                  Replacement item scheduled: <strong>{replacementItem}</strong>
                </p>
              </div>
            ) : (
              <form onSubmit={handleConfirmAbsence} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#334139] block">
                    Absence Date (Must be at least 1 day prior):
                  </label>
                  <input
                    type="date"
                    value={absenceDate}
                    onChange={(e) => setAbsenceDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#D5E2D2] text-xs bg-[#FAF9F5] focus:outline-none focus:ring-1 focus:ring-[#2D5A27]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#334139] block">
                    Choose your replacement item:
                  </label>
                  <div className="space-y-2">
                    <label
                      className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer text-xs transition ${
                        replacementItem === '🍎 Fruits — 200 g'
                          ? 'border-[#2D5A27] bg-[#F3F8F1] font-semibold text-[#1E3F20]'
                          : 'border-[#E5EBE3] bg-white text-[#5C675E]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="replacement"
                        value="🍎 Fruits — 200 g"
                        checked={replacementItem === '🍎 Fruits — 200 g'}
                        onChange={(e) => setReplacementItem(e.target.value)}
                        className="text-[#2D5A27] focus:ring-0"
                      />
                      <span>○ 🍎 Fruits — 200 g</span>
                    </label>

                    <label
                      className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer text-xs transition ${
                        replacementItem === '🥕 Vegetables — 200 g'
                          ? 'border-[#2D5A27] bg-[#F3F8F1] font-semibold text-[#1E3F20]'
                          : 'border-[#E5EBE3] bg-white text-[#5C675E]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="replacement"
                        value="🥕 Vegetables — 200 g"
                        checked={replacementItem === '🥕 Vegetables — 200 g'}
                        onChange={(e) => setReplacementItem(e.target.value)}
                        className="text-[#2D5A27] focus:ring-0"
                      />
                      <span>○ 🥕 Vegetables — 200 g</span>
                    </label>
                  </div>
                </div>

                <p className="text-[11px] text-[#5C675E] bg-[#FAF9F5] p-3 rounded-xl border border-[#EDF3EC] leading-relaxed">
                  “If you inform us one day before your absence, you can choose an extra fruit or vegetable item for the applicable service day.”
                </p>

                {absenceError && (
                  <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{absenceError}</span>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-[#2D5A27] hover:bg-[#21431D] text-white text-xs font-semibold shadow-xs transition"
                  >
                    Confirm Absence
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAbsenceModal(false)}
                    className="py-3 px-4 rounded-xl border border-[#D5E2D2] text-xs text-[#5C675E] hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 5. FEEDBACK MODAL (SECTION 8) */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#E5EBE3] shadow-card space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#F0F4EE] pb-3">
              <h3 className="text-lg font-bold text-[#1E3F20]">How was today&apos;s NutriGo?</h3>
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="text-[#5C675E] hover:text-[#1E3F20] text-sm"
              >
                ✕
              </button>
            </div>

            {fbSubmitted ? (
              <div className="p-6 bg-[#EBF3E8] rounded-2xl text-center space-y-2">
                <span className="text-3xl">🌿</span>
                <h4 className="text-base font-bold text-[#2D5A27]">
                  Thank You for Your Feedback!
                </h4>
                <p className="text-xs text-[#465849]">
                  We read every response to keep our portions fresh and wholesome.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitFeedback} className="space-y-4">
                {/* Star rating */}
                <div className="space-y-1 text-center py-2">
                  <span className="text-xs text-[#5C675E] block">Rating</span>
                  <div className="flex items-center justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFbRating(star)}
                        className="text-2xl transition hover:scale-110 focus:outline-none"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= fbRating
                              ? 'text-amber-500 fill-amber-500'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Optional Categories */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#334139] block">
                    Optional Categories:
                  </label>
                  <div className="flex flex-wrap gap-1.5 text-xs">
                    {[
                      'Freshness',
                      'Taste',
                      'Quantity',
                      'Packaging',
                      'Delivery',
                      'Overall experience',
                    ].map((cat) => {
                      const isSel = fbCategories.includes(cat);
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => handleCategoryToggle(cat)}
                          className={`px-3 py-1.5 rounded-full border transition ${
                            isSel
                              ? 'bg-[#2D5A27] text-white border-[#2D5A27]'
                              : 'bg-[#FAF9F5] text-[#5C675E] border-[#D5E2D2] hover:bg-[#F3F8F1]'
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Comment box */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#334139] block">
                    Tell us more... (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={fbComment}
                    onChange={(e) => setFbComment(e.target.value)}
                    placeholder="E.g., sprouts were very fresh and crisp! Delivery was on time."
                    className="w-full p-3 rounded-xl border border-[#D5E2D2] text-xs bg-[#FAF9F5] focus:outline-none focus:ring-1 focus:ring-[#2D5A27]"
                  ></textarea>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-[#2D5A27] hover:bg-[#21431D] text-white text-xs font-semibold shadow-xs transition"
                  >
                    Submit Feedback
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowFeedbackModal(false)}
                    className="py-3 px-4 rounded-xl border border-[#D5E2D2] text-xs text-[#5C675E] hover:bg-gray-50"
                  >
                    Close
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
