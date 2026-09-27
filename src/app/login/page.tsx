'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useNutriGo } from '@/context/NutriGoContext';
import {
  LogIn,
  UserPlus,
  Shield,
  CheckCircle2,
  Lock,
  Mail,
  User as UserIcon,
  Phone,
  Building,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, register, loginAs, users } = useNutriGo();

  const [tab, setTab] = useState<'customer' | 'admin' | 'register'>('customer');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Registration state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regRoll, setRegRoll] = useState('');
  const [regDept, setRegDept] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const res = login(identifier, password);
    if (!res.success) {
      setErrorMsg(res.message || 'Login failed. Please check credentials or use Quick Demo buttons.');
    } else {
      if (res.user?.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/my-nutrigo');
      }
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const res = register({
      name: regName,
      email: regEmail,
      phone: regPhone,
      rollOrEmpId: regRoll,
      department: regDept,
    });
    if (res.success) {
      router.push('/packages');
    }
  };

  const handleQuickLogin = (userId: string, targetRole: 'customer' | 'admin') => {
    loginAs(userId);
    if (targetRole === 'admin') {
      router.push('/admin');
    } else {
      router.push('/my-nutrigo');
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 sm:py-14 space-y-8">
      {/* Brand Header */}
      <div className="text-center space-y-3">
        <div className="relative w-20 h-20 rounded-full overflow-hidden bg-white mx-auto shadow-card border border-emerald-100">
          <Image
            src="/nutrigo-logo.png"
            alt="NutriGo Logo"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-[#1E3F20]">NutriGo</h1>
          <p className="text-xs text-[#5C675E] font-medium tracking-wide">
            Small choices. Better health.
          </p>
        </div>
      </div>

      {/* Main Auth Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5EBE3] shadow-card space-y-6">
        {/* Navigation Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-[#FAF9F5] p-1.5 rounded-2xl border border-[#EDF3EC]">
          <button
            type="button"
            onClick={() => {
              setTab('customer');
              setErrorMsg('');
            }}
            className={`py-2 rounded-xl text-xs font-semibold transition ${
              tab === 'customer'
                ? 'bg-[#2D5A27] text-white shadow-xs'
                : 'text-[#5C675E] hover:text-[#1E3F20]'
            }`}
          >
            Customer Login
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('admin');
              setErrorMsg('');
            }}
            className={`py-2 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1 ${
              tab === 'admin'
                ? 'bg-emerald-950 text-white shadow-xs'
                : 'text-[#5C675E] hover:text-[#1E3F20]'
            }`}
          >
            <Shield className="w-3 h-3" />
            Admin Login
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('register');
              setErrorMsg('');
            }}
            className={`py-2 rounded-xl text-xs font-semibold transition ${
              tab === 'register'
                ? 'bg-[#2D5A27] text-white shadow-xs'
                : 'text-[#5C675E] hover:text-[#1E3F20]'
            }`}
          >
            New Register
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Customer / Admin Login Form */}
        {tab !== 'register' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#334139] block">
                {tab === 'admin' ? 'Admin Email / Username' : 'Email / Roll Number / Phone'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={
                    tab === 'admin' ? 'admin@nutrigo.com' : 'e.g., CS2024-042 or prabhashini@nutrigo.com'
                  }
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#D5E2D2] text-xs bg-[#FAF9F5] focus:outline-none focus:ring-1 focus:ring-[#2D5A27]"
                />
                <Mail className="w-4 h-4 text-[#8C978E] absolute left-3 top-3" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#334139] block">Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#D5E2D2] text-xs bg-[#FAF9F5] focus:outline-none focus:ring-1 focus:ring-[#2D5A27]"
                />
                <Lock className="w-4 h-4 text-[#8C978E] absolute left-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-3 rounded-xl text-white text-xs font-semibold shadow-soft transition flex items-center justify-center gap-2 ${
                tab === 'admin'
                  ? 'bg-emerald-950 hover:bg-emerald-900'
                  : 'bg-[#2D5A27] hover:bg-[#21431D]'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>{tab === 'admin' ? 'Enter Admin Operations Hub' : 'Log In to My NutriGo'}</span>
            </button>
          </form>
        )}

        {/* Register Form */}
        {tab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#334139] block">Full Name</label>
              <input
                type="text"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="e.g., Deepika Ramesh"
                required
                className="w-full px-3 py-2 rounded-xl border border-[#D5E2D2] text-xs bg-[#FAF9F5] focus:outline-none focus:ring-1 focus:ring-[#2D5A27]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#334139] block">Roll / Employee ID</label>
                <input
                  type="text"
                  value={regRoll}
                  onChange={(e) => setRegRoll(e.target.value)}
                  placeholder="e.g., CS2025-099"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-[#D5E2D2] text-xs bg-[#FAF9F5] focus:outline-none focus:ring-1 focus:ring-[#2D5A27]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#334139] block">Department</label>
                <input
                  type="text"
                  value={regDept}
                  onChange={(e) => setRegDept(e.target.value)}
                  placeholder="e.g., Computer Science"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-[#D5E2D2] text-xs bg-[#FAF9F5] focus:outline-none focus:ring-1 focus:ring-[#2D5A27]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#334139] block">Email</label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="user@college.edu"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-[#D5E2D2] text-xs bg-[#FAF9F5] focus:outline-none focus:ring-1 focus:ring-[#2D5A27]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#334139] block">Phone</label>
                <input
                  type="tel"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="+91 98000 00000"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-[#D5E2D2] text-xs bg-[#FAF9F5] focus:outline-none focus:ring-1 focus:ring-[#2D5A27]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 mt-2 rounded-xl bg-[#2D5A27] hover:bg-[#21431D] text-white text-xs font-semibold shadow-soft transition flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create Account & Choose Package</span>
            </button>
          </form>
        )}

        {/* Quick Demo Logins Container */}
        <div className="pt-4 border-t border-[#F0F4EE] space-y-2">
          <span className="text-[11px] font-bold text-[#5C675E] uppercase tracking-wider block text-center">
            ⚡ Quick 1-Click Demo Accounts
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickLogin('user_1', 'customer')}
              className="p-2.5 rounded-xl bg-[#FAF9F5] hover:bg-[#EBF3E8] border border-[#EDF3EC] text-left transition flex items-center gap-2"
            >
              <span className="text-base">🌱</span>
              <div>
                <p className="font-bold text-[#1E3F20]">Prabhashini Sharma</p>
                <p className="text-[10px] text-[#4A7C59]">Trial Customer (Day 4/7)</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('user_2', 'customer')}
              className="p-2.5 rounded-xl bg-[#FAF9F5] hover:bg-[#EBF3E8] border border-[#EDF3EC] text-left transition flex items-center gap-2"
            >
              <span className="text-base">🍎</span>
              <div>
                <p className="font-bold text-[#1E3F20]">Aarav Patel</p>
                <p className="text-[10px] text-blue-700">Trial Day 7 (Completion Ready)</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('user_3', 'customer')}
              className="p-2.5 rounded-xl bg-[#FAF9F5] hover:bg-[#EBF3E8] border border-[#EDF3EC] text-left transition flex items-center gap-2"
            >
              <span className="text-base">🥗</span>
              <div>
                <p className="font-bold text-[#1E3F20]">Ananya Deshmukh</p>
                <p className="text-[10px] text-[#2D5A27]">Monthly Subscriber (18d left)</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('admin_1', 'admin')}
              className="p-2.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-white border border-emerald-900 text-left transition flex items-center gap-2"
            >
              <Shield className="w-4 h-4 text-emerald-400" />
              <div>
                <p className="font-bold">NutriGo Admin Ops</p>
                <p className="text-[10px] text-emerald-300">Kitchen & Full Dashboard</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
