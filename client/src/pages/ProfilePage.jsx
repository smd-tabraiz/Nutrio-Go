import React from 'react';
import { Link } from 'react-router-dom';
import { useNutriGo } from '../context/NutriGoContext';
import {
  User as UserIcon,
  Phone,
  Mail,
  Building,
  CreditCard,
  MessageSquareHeart,
  Package,
  Calendar,
  Sparkles,
  ShieldCheck,
  Star,
} from 'lucide-react';

export default function ProfilePage() {
  const { currentUser, feedback, payments } = useNutriGo();

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-[#1E3F20]">Profile</h2>
        <p className="text-sm text-[#5C675E]">Please sign in to view your profile.</p>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-[#2D5A27] text-white font-semibold"
        >
          Sign In
        </Link>
      </div>
    );
  }

  const userFeedback = feedback.filter((f) => f.userId === currentUser.id);
  const userPayments = payments.filter((p) => p.userId === currentUser.id);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5EBE3] shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#2D5A27] text-white flex items-center justify-center text-2xl font-bold border-2 border-emerald-100 shadow-xs">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-[#1E3F20]">{currentUser.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EBF3E8] text-[#2D5A27] border border-emerald-200">
                {currentUser.role === 'admin' ? 'Admin' : 'Customer'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#5C675E] mt-0.5">
              Roll/Emp ID: <strong className="text-[#1E3F20]">{currentUser.rollOrEmpId}</strong> • {currentUser.department}
            </p>
          </div>
        </div>

        <div className="bg-[#FAF9F5] p-3.5 rounded-2xl border border-[#EDF3EC] text-right text-xs">
          <span className="text-[#5C675E] block">Current Membership</span>
          <span className="font-bold text-sm text-[#2D5A27] block">
            {currentUser.membershipStatus === 'trial'
              ? `🟡 7-Day Trial (Day ${currentUser.trialDay}/7)`
              : currentUser.membershipStatus === 'trial_completed'
              ? '🎉 7-Day Trial Completed'
              : currentUser.membershipStatus === 'monthly'
              ? `🟢 Monthly Subscription (${currentUser.remainingServiceDays} Days Left)`
              : '⚪ No Active Plan'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Details */}
        <div className="bg-white rounded-3xl p-6 border border-[#E5EBE3] shadow-soft space-y-4">
          <h3 className="text-sm font-bold text-[#1E3F20] uppercase tracking-wider border-b border-[#F0F4EE] pb-2">
            Personal & Campus Details
          </h3>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#5C675E] flex items-center gap-2">
                <UserIcon className="w-3.5 h-3.5 text-emerald-700" /> Full Name
              </span>
              <span className="font-semibold text-[#1E3F20]">{currentUser.name}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#5C675E] flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" /> Roll / Employee ID
              </span>
              <span className="font-semibold text-[#1E3F20]">{currentUser.rollOrEmpId}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#5C675E] flex items-center gap-2">
                <Building className="w-3.5 h-3.5 text-emerald-700" /> Department
              </span>
              <span className="font-semibold text-[#1E3F20]">{currentUser.department}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#5C675E] flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-700" /> Email Address
              </span>
              <span className="font-semibold text-[#1E3F20]">{currentUser.email}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#5C675E] flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-700" /> Phone Number
              </span>
              <span className="font-semibold text-[#1E3F20]">{currentUser.phone}</span>
            </div>
          </div>
        </div>

        {/* Plan Information */}
        <div className="bg-white rounded-3xl p-6 border border-[#E5EBE3] shadow-soft space-y-4">
          <h3 className="text-sm font-bold text-[#1E3F20] uppercase tracking-wider border-b border-[#F0F4EE] pb-2">
            Plan & Package Information
          </h3>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#5C675E] flex items-center gap-2">
                <Package className="w-3.5 h-3.5 text-emerald-700" /> Current Package
              </span>
              <span className="font-bold text-[#1E3F20]">
                {currentUser.currentPackageName || 'Sprouts'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#5C675E] flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" /> Package Quantity
              </span>
              <span className="font-semibold text-[#2D5A27]">
                {currentUser.currentPackageQuantity || '150 g'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#5C675E] flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-emerald-700" /> Trial Start Date
              </span>
              <span className="font-semibold text-[#1E3F20]">
                {currentUser.trialStartDate || '2026-09-24'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#5C675E] flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-emerald-700" /> Subscription Start Date
              </span>
              <span className="font-semibold text-[#1E3F20]">
                {currentUser.monthlyStartDate || 'N/A (On Trial)'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#5C675E] flex items-center gap-2">
                <CreditCard className="w-3.5 h-3.5 text-emerald-700" /> Payment Status
              </span>
              <span
                className={`font-bold px-2 py-0.5 rounded-full ${
                  currentUser.paymentStatus === 'paid'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {currentUser.paymentStatus === 'paid' ? 'Paid ✓' : 'Payment Pending ⏳'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Payments History */}
      <div className="bg-white rounded-3xl p-6 border border-[#E5EBE3] shadow-soft space-y-4">
        <div className="flex items-center justify-between border-b border-[#F0F4EE] pb-3">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[#4A7C59]" />
            <h3 className="text-base font-bold text-[#1E3F20]">Payment History</h3>
          </div>
          <span className="text-xs text-[#5C675E]">{userPayments.length} transactions</span>
        </div>

        <div className="space-y-2">
          {userPayments.length > 0 ? (
            userPayments.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#EDF3EC] text-xs"
              >
                <div>
                  <p className="font-bold text-[#1E3F20]">{p.packageName}</p>
                  <p className="text-[11px] text-[#5C675E]">
                    {p.date} • Method: {p.paymentMethod} {p.transactionRef && `• ${p.transactionRef}`}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-[#2D5A27]">₹{p.amount}</span>
                  <span className="block text-[10px] text-emerald-700 font-semibold">
                    {p.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-[#5C675E] p-4 text-center">No payment transactions yet.</p>
          )}
        </div>
      </div>

      {/* Feedback History */}
      <div className="bg-white rounded-3xl p-6 border border-[#E5EBE3] shadow-soft space-y-4">
        <div className="flex items-center justify-between border-b border-[#F0F4EE] pb-3">
          <div className="flex items-center gap-2">
            <MessageSquareHeart className="w-4 h-4 text-[#4A7C59]" />
            <h3 className="text-base font-bold text-[#1E3F20]">Feedback Given</h3>
          </div>
          <span className="text-xs text-[#5C675E]">{userFeedback.length} submissions</span>
        </div>

        <div className="space-y-3">
          {userFeedback.length > 0 ? (
            userFeedback.map((fb) => (
              <div
                key={fb.id}
                className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#EDF3EC] space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
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
                    <span className="ml-1 font-bold text-[#1E3F20]">{fb.packageName}</span>
                  </div>
                  <span className="text-[11px] text-[#5C675E]">{fb.date}</span>
                </div>

                <p className="text-[#334139] leading-relaxed italic">
                  &ldquo;{fb.comment}&rdquo;
                </p>

                <div className="flex flex-wrap gap-1">
                  {fb.categories.map((c, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-[#EBF3E8] text-[#2D5A27] text-[10px] font-medium"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-[#5C675E] p-4 text-center">No feedback submitted yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
