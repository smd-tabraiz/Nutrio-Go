'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Leaf, Shield, Heart, Clock, HelpCircle, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#19331B] text-[#DCE7DC] pt-14 pb-20 md:pb-12 border-t border-[#294B2C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 pb-12 border-b border-[#294B2C]/70">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-white p-0.5">
                <Image
                  src="/nutrigo-logo.png"
                  alt="NutriGo Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <span className="text-xl font-bold text-white tracking-tight">NutriGo</span>
                <p className="text-xs text-[#95B297]">Small choices. Better health.</p>
              </div>
            </div>
            <p className="text-xs text-[#B5CAB8] leading-relaxed">
              Fresh, healthy, and convenient food portions made for your everyday college & workplace routine.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#A1BFA3]">
              <Leaf className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Farm Fresh & Pure Ingredients</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase">Explore</h4>
            <ul className="space-y-2 text-xs text-[#B5CAB8]">
              <li>
                <Link href="/" className="hover:text-white transition">Home</Link>
              </li>
              <li>
                <Link href="/packages" className="hover:text-white transition">View All Packages</Link>
              </li>
              <li>
                <Link href="/packages" className="hover:text-white transition">Start 7-Day Trial</Link>
              </li>
              <li>
                <Link href="/my-nutrigo" className="hover:text-white transition">My NutriGo Dashboard</Link>
              </li>
              <li>
                <Link href="/feedback" className="hover:text-white transition">Share Today&apos;s Feedback</Link>
              </li>
            </ul>
          </div>

          {/* Important Information */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase">Subscription Rules</h4>
            <div className="text-xs text-[#B5CAB8] space-y-2.5">
              <p className="flex items-start gap-1.5 leading-relaxed">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong>26 Service Days:</strong> Monthly plans reflect actual active delivery days, excluding continuous college/work holidays.</span>
              </p>
              <p className="flex items-start gap-1.5 leading-relaxed">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong>Absence Replacement:</strong> Notify 1 day in advance to receive an extra fruit or vegetable portion on your selected day.</span>
              </p>
              <p className="flex items-start gap-1.5 leading-relaxed">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong>No Auto-Debit:</strong> Trial never converts automatically. You decide whether to continue.</span>
              </p>
            </div>
          </div>

          {/* Support & Admin */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase">Contact & Operations</h4>
            <ul className="space-y-2 text-xs text-[#B5CAB8]">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>+91 80000 12345 (9 AM - 6 PM)</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>care@nutrigo.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 mt-0.5" />
                <span>NutriGo Central Kiosk & Kitchen Hub, University Campus</span>
              </li>
              <li className="pt-2">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 text-xs text-emerald-300 hover:text-white bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-800 transition"
                >
                  <Shield className="w-3 h-3" />
                  <span>Admin Operations Login</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8EAB90] gap-4">
          <p>© {new Date().getFullYear()} NutriGo. All rights reserved. Built with calm & care for daily wellness.</p>
          <div className="flex items-center gap-4">
            <span>Fresh. Affordable. Convenient. Daily Nutrition.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
