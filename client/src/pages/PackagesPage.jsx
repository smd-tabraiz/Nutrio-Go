import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { NUTRI_PACKAGES } from '../data/packages';
import {
  Sparkles,
  Info,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export default function PackagesPage() {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredPackages = NUTRI_PACKAGES.filter((pkg) => {
    if (activeFilter === 'single') return !pkg.id.includes('-');
    if (activeFilter === 'combos') return pkg.id.includes('-');
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF3E8] border border-emerald-200 text-xs font-semibold text-[#2D5A27]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Transparent Portions & Direct Pricing</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#1E3F20] tracking-tight">
          NutriGo Daily Packages
        </h1>
        <p className="text-sm sm:text-base text-[#5C675E] leading-relaxed">
          Clean, measured portions prepared every morning. No guesswork. What you see is exactly what you get.
        </p>

        <div className="mt-4 p-3.5 bg-[#FAF9F5] border border-[#DCE7DC] rounded-2xl inline-flex items-center gap-2.5 text-xs text-[#354B38] text-left">
          <Info className="w-4 h-4 text-emerald-700 flex-shrink-0" />
          <span>
            <strong>Note on 26 Service Days:</strong> Monthly plans calculate actual active service days after excluding official campus/continuous holidays.
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-center gap-2 pt-2">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
            activeFilter === 'all'
              ? 'bg-[#2D5A27] text-white shadow-xs'
              : 'bg-white text-[#5C675E] border border-[#E5EBE3] hover:bg-[#F3F8F1]'
          }`}
        >
          All Packages ({NUTRI_PACKAGES.length})
        </button>
        <button
          onClick={() => setActiveFilter('single')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
            activeFilter === 'single'
              ? 'bg-[#2D5A27] text-white shadow-xs'
              : 'bg-white text-[#5C675E] border border-[#E5EBE3] hover:bg-[#F3F8F1]'
          }`}
        >
          Single Portions (3)
        </button>
        <button
          onClick={() => setActiveFilter('combos')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
            activeFilter === 'combos'
              ? 'bg-[#2D5A27] text-white shadow-xs'
              : 'bg-white text-[#5C675E] border border-[#E5EBE3] hover:bg-[#F3F8F1]'
          }`}
        >
          Combinations (4)
        </button>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {filteredPackages.map((pkg) => (
          <div
            key={pkg.id}
            className={`bg-white rounded-3xl p-6 border transition flex flex-col justify-between relative shadow-soft hover:shadow-md ${
              pkg.isPopular ? 'border-emerald-300 ring-1 ring-emerald-200' : 'border-[#E5EBE3]'
            }`}
          >
            {pkg.isPopular && (
              <div className="absolute -top-3 right-6 bg-[#2D5A27] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
                Popular Choice
              </div>
            )}

            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl p-2 bg-[#FAF9F5] rounded-2xl border border-[#EDF3EC]">
                  {pkg.icon}
                </span>
                <div>
                  <h3 className="text-xl font-bold text-[#1E3F20]">{pkg.name}</h3>
                  <div className="inline-block px-2.5 py-0.5 mt-0.5 rounded-md bg-[#EBF3E8] text-[#2D5A27] font-semibold text-xs border border-emerald-100">
                    {pkg.quantity}
                  </div>
                </div>
              </div>

              <div className="my-4 space-y-1.5 bg-[#FAF9F5] p-3 rounded-2xl border border-[#EDF3EC]">
                <p className="text-[11px] font-bold text-[#4A7C59] uppercase tracking-wider">
                  What You Get:
                </p>
                <ul className="space-y-1">
                  {pkg.items.map((item, idx) => (
                    <li key={idx} className="text-xs text-[#2B3A2E] flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-xs text-[#5C675E] leading-relaxed mb-4">
                {pkg.description}
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-[#F0F4EE]">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-[#5C675E] font-medium">Daily Rate</span>
                <span className="text-2xl font-bold text-[#1E3F20]">
                  ₹{pkg.dailyPrice}
                  <span className="text-xs font-normal text-[#5C675E]"> / day</span>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-[#F3F8F1] border border-emerald-200/70 text-center">
                  <span className="text-[11px] text-[#4A7C59] font-medium block">7-Day Trial</span>
                  <span className="text-base font-bold text-[#2D5A27]">₹{pkg.trialPrice}</span>
                  <span className="text-[10px] text-[#5C675E] block">₹{pkg.dailyPrice} × 7 days</span>
                </div>

                <div className="p-3 rounded-xl bg-[#FAF9F5] border border-[#E5EBE3] text-center">
                  <span className="text-[11px] text-[#5C675E] font-medium block">26 Service Days</span>
                  <span className="text-base font-bold text-[#1E3F20]">₹{pkg.monthlyPrice}</span>
                  <span className="text-[10px] text-[#5C675E] block">Monthly Plan</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <Link
                  to={`/trial?package=${pkg.id}`}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#2D5A27] hover:bg-[#21431D] text-white text-xs font-semibold shadow-xs transition"
                >
                  <span>Start 7-Day Trial</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  to={`/trial?package=${pkg.id}&plan=monthly`}
                  className="w-full inline-flex items-center justify-center gap-1 py-2.5 px-3 rounded-xl bg-white hover:bg-[#F3F8F1] text-[#2D5A27] border border-[#D5E2D2] text-xs font-semibold transition"
                >
                  <span>Monthly Plan</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
