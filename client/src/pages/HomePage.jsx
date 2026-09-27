import React from 'react';
import { Link } from 'react-router-dom';
import { NUTRI_PACKAGES } from '../data/packages';
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Leaf,
  ChevronRight,
  CalendarCheck,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-16 sm:space-y-24 pb-12">
      {/* 1. HERO SECTION */}
      <section className="relative pt-8 sm:pt-14 pb-10 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF3E8] border border-emerald-200/80 text-xs font-semibold text-[#2D5A27]">
              <Leaf className="w-3.5 h-3.5 text-emerald-600" />
              <span>Campus & Workplace Daily Nutrition</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1E3F20] font-sans leading-[1.15]">
                NutriGo
              </h1>
              <p className="text-2xl sm:text-3xl font-medium text-[#4A7C59] tracking-tight">
                Small choices. Better health.
              </p>
            </div>

            <p className="text-base sm:text-lg text-[#5C675E] max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Fresh, healthy and convenient food portions made for your everyday routine. Starting from just ₹19/day.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Link
                to="/packages"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#2D5A27] hover:bg-[#21431D] text-white text-base font-semibold shadow-soft hover:shadow-md transition"
              >
                <span>Start Your 7-Day Trial</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/packages"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-[#F3F8F1] text-[#2D5A27] border border-[#D5E2D2] text-base font-semibold transition"
              >
                <span>View Packages</span>
              </Link>
            </div>

            <div className="pt-2 flex items-center justify-center lg:justify-start gap-4 text-xs text-[#5C675E]">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                No auto-deductions
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                7 Service Days Trial
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Flexible Absence swap
              </span>
            </div>
          </div>

          {/* Right Hero Visual Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-[#E5EBE3] shadow-card">
              <div className="flex items-center justify-between border-b border-[#F0F4EE] pb-4 mb-5">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border border-emerald-100">
                    <img
                      src="/nutrigo-logo.png"
                      alt="NutriGo Logo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#1E3F20]">Daily Fresh Box</h3>
                    <p className="text-[11px] text-[#5C675E]">Prepared 7:00 AM Today</p>
                  </div>
                </div>
                <span className="bg-[#EBF3E8] text-[#2D5A27] text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-200">
                  100% Pure
                </span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F8FAF7] border border-[#EDF3EC]">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🌱</span>
                    <div>
                      <p className="text-sm font-semibold text-[#1E3F20]">Sprouts Portion</p>
                      <p className="text-xs text-[#5C675E]">Moong, Chana & Seed Mix (150 g)</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#2D5A27]">₹19/day</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F8FAF7] border border-[#EDF3EC]">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🍎</span>
                    <div>
                      <p className="text-sm font-semibold text-[#1E3F20]">Seasonal Fruits</p>
                      <p className="text-xs text-[#5C675E]">Apple, Papaya, Pomegranate (200 g)</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#2D5A27]">₹29/day</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F8FAF7] border border-[#EDF3EC]">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🥕</span>
                    <div>
                      <p className="text-sm font-semibold text-[#1E3F20]">Salad Veggies</p>
                      <p className="text-xs text-[#5C675E]">Carrot, Cucumber, Beetroot (200 g)</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#2D5A27]">₹26/day</span>
                </div>
              </div>

              <div className="p-3 bg-[#FAF9F5] rounded-2xl border border-dashed border-[#CFDCCB] text-center">
                <p className="text-xs text-[#3D5240] font-medium">
                  Try for <strong className="text-[#1E3F20]">7 Days</strong> from <strong className="text-[#2D5A27]">₹133</strong> • Zero commitment
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FOUR SIMPLE BENEFITS SECTION */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1E3F20]">
            Simple. Honest. Wholesome.
          </h2>
          <p className="text-sm sm:text-base text-[#5C675E]">
            Everything designed around your daily campus schedule without fuss or junk.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-2xl p-6 border border-[#E5EBE3] shadow-soft">
            <div className="w-12 h-12 rounded-xl bg-[#EBF3E8] flex items-center justify-center text-2xl mb-4">
              🌱
            </div>
            <h3 className="text-lg font-bold text-[#1E3F20] mb-1.5">Fresh & Healthy</h3>
            <p className="text-xs sm:text-sm text-[#5C675E] leading-relaxed">
              Organic sprouts, fresh crisp fruits and nutrient-dense vegetables washed with mineral purification.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#E5EBE3] shadow-soft">
            <div className="w-12 h-12 rounded-xl bg-[#FFF7ED] flex items-center justify-center text-2xl mb-4">
              💰
            </div>
            <h3 className="text-lg font-bold text-[#1E3F20] mb-1.5">Affordable</h3>
            <p className="text-xs sm:text-sm text-[#5C675E] leading-relaxed">
              Pocket-friendly student pricing from ₹19/day. Transparent 7-day trials with zero hidden fees.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#E5EBE3] shadow-soft">
            <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] flex items-center justify-center text-2xl mb-4">
              ⏰
            </div>
            <h3 className="text-lg font-bold text-[#1E3F20] mb-1.5">Convenient</h3>
            <p className="text-xs sm:text-sm text-[#5C675E] leading-relaxed">
              Ready-to-eat eco portions dropped at your kiosk, library, or department every morning.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#E5EBE3] shadow-soft">
            <div className="w-12 h-12 rounded-xl bg-[#FDF2F8] flex items-center justify-center text-2xl mb-4">
              🥗
            </div>
            <h3 className="text-lg font-bold text-[#1E3F20] mb-1.5">Daily Nutrition</h3>
            <p className="text-xs sm:text-sm text-[#5C675E] leading-relaxed">
              Exact weighed portions (150 g - 550 g) to satisfy daily micronutrients and sustained focus.
            </p>
          </div>
        </div>
      </section>

      {/* 3. FEATURED PACKAGES PREVIEW */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2D5A27] uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Transparent Menu</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1E3F20]">
              Featured NutriGo Portions
            </h2>
          </div>
          <Link
            to="/packages"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2D5A27] hover:text-[#1E3F20] group"
          >
            <span>View all 7 packages</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {NUTRI_PACKAGES.slice(0, 3).map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-3xl p-6 border border-[#E5EBE3] shadow-soft flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">{pkg.icon}</span>
                  {pkg.isPopular && (
                    <span className="text-[11px] font-bold uppercase tracking-wider bg-[#EBF3E8] text-[#2D5A27] px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Popular
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-[#1E3F20]">{pkg.name}</h3>
                <p className="text-xs font-semibold text-[#4A7C59] mt-0.5">{pkg.quantity}</p>
                <p className="text-xs text-[#5C675E] mt-2 line-clamp-2">{pkg.description}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#F0F4EE] space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-[#5C675E]">Daily Price</span>
                  <span className="text-lg font-bold text-[#1E3F20]">₹{pkg.dailyPrice}<span className="text-xs font-normal text-[#5C675E]">/day</span></span>
                </div>
                <div className="flex items-center justify-between text-xs bg-[#FAF9F5] p-2.5 rounded-xl border border-[#EDF3EC]">
                  <span className="text-[#334139] font-medium">7-Day Trial</span>
                  <span className="font-bold text-[#2D5A27]">₹{pkg.trialPrice}</span>
                </div>
                <Link
                  to={`/trial?package=${pkg.id}`}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#2D5A27] hover:bg-[#21431D] text-white text-xs font-semibold transition"
                >
                  <span>Start 7-Day Trial</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. TRANSPARENCY & ABSENCE PROMISE */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-[#F3F8F1] rounded-3xl p-6 sm:p-10 border border-[#D5E2D2]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2D5A27]">
                <CalendarCheck className="w-4 h-4" />
                <span>The NutriGo Promise</span>
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#1E3F20]">
                26 Service Days & Free Absence Item Swaps
              </h3>
              <p className="text-xs sm:text-sm text-[#465849] leading-relaxed">
                We know campus and work schedules have holidays. That&apos;s why our <strong>26 Service Days</strong> monthly package counts only real active days. If you can&apos;t receive your package tomorrow, simply inform us 1 day prior through your dashboard and pick a replacement 🍎 Fruit or 🥕 Veggie portion!
              </p>
            </div>
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
              <Link
                to="/packages"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-[#2D5A27] text-white text-sm font-semibold hover:bg-[#21431D] transition"
              >
                <span>Browse All Plans</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/my-nutrigo"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-white text-[#2D5A27] border border-[#D5E2D2] text-sm font-semibold hover:bg-[#FAF9F5] transition"
              >
                <span>Check My NutriGo</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
