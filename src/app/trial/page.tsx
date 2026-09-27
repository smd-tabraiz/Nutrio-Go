'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useNutriGo } from '@/context/NutriGoContext';
import { NUTRI_PACKAGES } from '@/data/packages';
import {
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  CreditCard,
  QrCode,
  Smartphone,
  Info,
  Calendar,
  Layers,
  Clock,
  HeartHandshake,
} from 'lucide-react';
import confetti from 'canvas-confetti';

function TrialCheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const packageParam = searchParams.get('package') || 'sprouts';
  const planParam = searchParams.get('plan') || 'trial';

  const { currentUser, startTrial, startMonthlyDirect, simulatedToday } = useNutriGo();

  const [selectedPkgId, setSelectedPkgId] = useState(packageParam);
  const [selectedPlan, setSelectedPlan] = useState<'trial' | 'monthly'>(
    planParam === 'monthly' ? 'monthly' : 'trial'
  );
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'NetBanking'>('UPI');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const currentPkg = NUTRI_PACKAGES.find((p) => p.id === selectedPkgId) || NUTRI_PACKAGES[0];
  const isTrial = selectedPlan === 'trial';
  const totalAmount = isTrial ? currentPkg.trialPrice : currentPkg.monthlyPrice;

  const handleStartPlan = async () => {
    setIsProcessing(true);
    try {
      // Simulate real payment delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (isTrial) {
        await startTrial(currentPkg.id, paymentMethod);
      } else {
        await startMonthlyDirect(currentPkg.id, paymentMethod);
      }

      setIsSuccess(true);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#2D5A27', '#4A7C59', '#8FAF85', '#D4A373'],
        });
      } catch (e) {
        console.error(e);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl p-8 border border-emerald-200 shadow-card text-center space-y-6 animate-in zoom-in-95">
          <div className="w-16 h-16 bg-[#EBF3E8] rounded-full flex items-center justify-center mx-auto text-3xl">
            🎉
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1E3F20]">
              {isTrial ? 'Trial Started 🎉' : 'Monthly Subscription Active 🎉'}
            </h2>
            <p className="text-sm text-[#5C675E]">
              Welcome to the NutriGo community! Your daily portion is confirmed for morning delivery.
            </p>
          </div>

          {/* Status & Package Details Box */}
          <div className="bg-[#FAF9F5] p-5 rounded-2xl border border-[#E5EBE3] space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-[#EAEFE8] pb-3">
              <span className="text-xs text-[#5C675E]">Membership Status</span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#EBF3E8] text-[#2D5A27] border border-emerald-200">
                {isTrial ? '🟡 7-Day Trial' : '🟢 Monthly Subscription'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-[#5C675E]">Selected Portion</span>
              <span className="text-sm font-bold text-[#1E3F20]">
                {currentPkg.icon} {currentPkg.name} ({currentPkg.quantity})
              </span>
            </div>

            {isTrial ? (
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs">
                  <span className="text-[#5C675E]">Trial Progress</span>
                  <span className="font-semibold text-[#2D5A27]">Day 1 of 7</span>
                </div>
                {/* Visual Progress Bar */}
                <div className="w-full bg-[#E2EBE0] h-2.5 rounded-full overflow-hidden">
                  <div className="bg-[#2D5A27] h-full rounded-full w-[14.2%] transition-all"></div>
                </div>
                <p className="text-[11px] text-[#5C675E] pt-1">
                  • 6 more service days remaining before decision
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-[#5C675E]">Service Days</span>
                <span className="text-xs font-bold text-[#1E3F20]">26 Active Service Days</span>
              </div>
            )}

            <div className="flex items-center justify-between border-t border-[#EAEFE8] pt-3 text-xs text-[#5C675E]">
              <span>Amount Paid</span>
              <span className="font-bold text-[#1E3F20]">₹{totalAmount} via {paymentMethod}</span>
            </div>
          </div>

          <div className="p-3.5 bg-[#F3F8F1] rounded-2xl border border-emerald-200 text-xs text-[#2D5A27] space-y-1">
            <p className="font-semibold">✓ No Auto-Renewal Guarantee</p>
            <p className="text-[11px] text-[#465849]">
              After completing day 7, you explicitly choose whether to continue. No automatic card debits.
            </p>
          </div>

          <Link
            href="/my-nutrigo"
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#2D5A27] hover:bg-[#21431D] text-white text-sm font-semibold shadow-soft transition"
          >
            <span>Go to My NutriGo Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF3E8] border border-emerald-200 text-xs font-semibold text-[#2D5A27]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Transparent 7-Day Trial Experience</span>
        </div>
        <h1 className="text-3xl font-bold text-[#1E3F20]">
          Try NutriGo for 7 Service Days
        </h1>
        <p className="text-sm text-[#5C675E] max-w-lg mx-auto">
          Try your selected NutriGo package for 7 service days before deciding on a monthly subscription.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Package & Plan Selection */}
        <div className="lg:col-span-7 space-y-6">
          {/* Plan Choice Toggle */}
          <div className="bg-white rounded-2xl p-2 border border-[#E5EBE3] grid grid-cols-2 gap-2 shadow-2xs">
            <button
              onClick={() => setSelectedPlan('trial')}
              className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition flex flex-col items-center gap-0.5 ${
                selectedPlan === 'trial'
                  ? 'bg-[#2D5A27] text-white shadow-xs'
                  : 'text-[#5C675E] hover:bg-[#FAF9F5]'
              }`}
            >
              <span>7-Day Trial</span>
              <span className={`text-[10px] ${selectedPlan === 'trial' ? 'text-emerald-200' : 'text-[#5C675E]'}`}>
                Zero Commitment
              </span>
            </button>

            <button
              onClick={() => setSelectedPlan('monthly')}
              className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition flex flex-col items-center gap-0.5 ${
                selectedPlan === 'monthly'
                  ? 'bg-[#2D5A27] text-white shadow-xs'
                  : 'text-[#5C675E] hover:bg-[#FAF9F5]'
              }`}
            >
              <span>26-Day Monthly</span>
              <span className={`text-[10px] ${selectedPlan === 'monthly' ? 'text-emerald-200' : 'text-[#5C675E]'}`}>
                Full Month Habit
              </span>
            </button>
          </div>

          {/* Package Selector */}
          <div className="bg-white rounded-3xl p-6 border border-[#E5EBE3] shadow-soft space-y-4">
            <h3 className="text-sm font-bold text-[#1E3F20] uppercase tracking-wider">
              1. Choose Your Daily Portion
            </h3>

            <div className="grid grid-cols-1 gap-2.5 max-h-96 overflow-y-auto pr-1">
              {NUTRI_PACKAGES.map((pkg) => {
                const isSelected = pkg.id === selectedPkgId;
                return (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPkgId(pkg.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                      isSelected
                        ? 'border-[#2D5A27] bg-[#F3F8F1] ring-1 ring-[#2D5A27]'
                        : 'border-[#E5EBE3] hover:border-emerald-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{pkg.icon}</span>
                      <div>
                        <p className="text-sm font-bold text-[#1E3F20]">{pkg.name}</p>
                        <p className="text-xs text-[#5C675E]">{pkg.quantity}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-bold text-[#1E3F20]">
                        ₹{isTrial ? pkg.trialPrice : pkg.monthlyPrice}
                      </span>
                      <span className="text-[10px] text-[#5C675E] block">
                        {isTrial ? '7 days total' : '26 service days'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Customer Info Card */}
          <div className="bg-white rounded-3xl p-6 border border-[#E5EBE3] shadow-soft space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#1E3F20] uppercase tracking-wider">
                2. Customer Details
              </h3>
              <Link href="/profile" className="text-xs font-medium text-[#2D5A27] hover:underline">
                Edit profile
              </Link>
            </div>

            {currentUser ? (
              <div className="bg-[#FAF9F5] p-3.5 rounded-2xl border border-[#EDF3EC] text-xs space-y-1">
                <p className="font-semibold text-[#1E3F20]">{currentUser.name}</p>
                <p className="text-[#5C675E]">ID: {currentUser.rollOrEmpId} • Dept: {currentUser.department}</p>
                <p className="text-[#5C675E]">Phone: {currentUser.phone}</p>
              </div>
            ) : (
              <div className="text-xs text-[#5C675E]">
                Quick registration will be associated with this session.
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Exact Calculation & Payment Breakdown */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E5EBE3] shadow-card space-y-5 sticky top-28">
            <h3 className="text-base font-bold text-[#1E3F20] pb-2 border-b border-[#F0F4EE]">
              Summary & Payment
            </h3>

            {/* Selected Package Details */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#5C675E]">Selected package:</span>
                <span className="text-xs font-bold text-[#1E3F20]">
                  {currentPkg.icon} {currentPkg.name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#5C675E]">Quantity:</span>
                <span className="text-xs font-semibold text-[#2D5A27]">{currentPkg.quantity}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#5C675E]">Daily price:</span>
                <span className="text-xs font-semibold text-[#1E3F20]">₹{currentPkg.dailyPrice}/day</span>
              </div>

              {/* Exact Formula Breakdown */}
              <div className="p-3 bg-[#FAF9F5] rounded-xl border border-[#EDF3EC] text-xs">
                {isTrial ? (
                  <div className="flex items-center justify-between font-medium text-[#2D5A27]">
                    <span>Calculation:</span>
                    <span className="font-bold">₹{currentPkg.dailyPrice} × 7 days = ₹{currentPkg.trialPrice}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between font-medium text-[#2D5A27]">
                    <span>Calculation:</span>
                    <span className="font-bold">₹{currentPkg.dailyPrice} × 26 days = ₹{currentPkg.monthlyPrice}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Total Due */}
            <div className="border-t border-b border-[#F0F4EE] py-4 flex items-baseline justify-between">
              <div>
                <span className="text-sm font-bold text-[#1E3F20] block">Total Amount Due</span>
                <span className="text-[11px] text-[#5C675E]">All inclusive. No extra taxes.</span>
              </div>
              <span className="text-3xl font-extrabold text-[#2D5A27]">
                ₹{totalAmount}
              </span>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-[#334139] block">
                Select Payment Mode:
              </span>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition ${
                    paymentMethod === 'UPI'
                      ? 'border-[#2D5A27] bg-[#F3F8F1] text-[#2D5A27] font-bold'
                      : 'border-[#E5EBE3] text-[#5C675E]'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>UPI / GPay</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('Card')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition ${
                    paymentMethod === 'Card'
                      ? 'border-[#2D5A27] bg-[#F3F8F1] text-[#2D5A27] font-bold'
                      : 'border-[#E5EBE3] text-[#5C675E]'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Debit / Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('NetBanking')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition ${
                    paymentMethod === 'NetBanking'
                      ? 'border-[#2D5A27] bg-[#F3F8F1] text-[#2D5A27] font-bold'
                      : 'border-[#E5EBE3] text-[#5C675E]'
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  <span>NetBanking</span>
                </button>
              </div>
            </div>

            {/* Supporting Text */}
            <p className="text-xs text-[#5C675E] leading-relaxed bg-[#FAF9F5] p-3 rounded-xl border border-[#EDF3EC]">
              {isTrial
                ? '“Try your selected NutriGo package for 7 service days before deciding on a monthly subscription.”'
                : '“Enjoy 26 active service days of uninterrupted fresh nutrition with easy 1-day prior absence swapping.”'}
            </p>

            {/* Submit Action Button */}
            <button
              onClick={handleStartPlan}
              disabled={isProcessing}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#2D5A27] hover:bg-[#21431D] text-white text-sm font-semibold shadow-soft hover:shadow-md transition disabled:opacity-60"
            >
              {isProcessing ? (
                <span>Confirming Order...</span>
              ) : (
                <>
                  <span>{isTrial ? 'Start 7-Day Trial' : 'Subscribe for Monthly Plan'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#5C675E]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Razorpay & UPI Secure Payment Ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TrialPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-emerald-800">Loading trial portal...</div>}>
      <TrialCheckoutContent />
    </Suspense>
  );
}
