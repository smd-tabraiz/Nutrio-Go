import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useNutriGo } from '../context/NutriGoContext';
import {
  Home,
  Package,
  HeartHandshake,
  MessageSquareHeart,
  User as UserIcon,
  Shield,
  Menu,
  X,
  LogOut,
  LogIn,
} from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const { currentUser, logout } = useNutriGo();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const customerNavItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Packages', href: '/packages', icon: Package },
    { name: 'My NutriGo', href: '/my-nutrigo', icon: HeartHandshake },
    { name: 'Feedback', href: '/feedback', icon: MessageSquareHeart },
    { name: 'Profile', href: '/profile', icon: UserIcon },
  ];

  const isAdmin = currentUser?.role === 'admin';

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-[#E5EBE3] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Identity */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none">
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-white shadow-xs border border-emerald-100 flex-shrink-0 group-hover:scale-105 transition duration-200">
              <img
                src="/nutrigo-logo.png"
                alt="NutriGo Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-bold tracking-tight text-[#1E3F20] font-sans">
                  NutriGo
                </span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              </div>
              <span className="text-xs text-[#5C675E] font-medium tracking-wide">
                Small choices. Better health.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {customerNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#2D5A27] text-white shadow-xs'
                      : 'text-[#334139] hover:text-[#1E3F20] hover:bg-[#EBF3E8]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-200' : 'text-[#4A7C59]'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User Status / Auth / Admin Quick CTA */}
          <div className="hidden md:flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3">
                {currentUser.role === 'admin' ? (
                  <Link
                    to="/admin"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-900 text-emerald-100 hover:bg-emerald-800 transition"
                  >
                    <Shield className="w-3.5 h-3.5 text-emerald-300" />
                    Admin Portal
                  </Link>
                ) : (
                  <Link
                    to="/my-nutrigo"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-emerald-200 bg-[#F3F8F1] text-[#2D5A27] hover:bg-[#E5EFE2] transition"
                  >
                    {currentUser.membershipStatus === 'trial' ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                        <span>Trial: Day {currentUser.trialDay}/7</span>
                      </>
                    ) : currentUser.membershipStatus === 'trial_completed' ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        <span>Trial Complete 🎉</span>
                      </>
                    ) : currentUser.membershipStatus === 'monthly' ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                        <span>Monthly ({currentUser.remainingServiceDays} days)</span>
                      </>
                    ) : (
                      <>
                        <span className="w-2 h-2 rounded-full bg-stone-400"></span>
                        <span>No Active Plan</span>
                      </>
                    )}
                  </Link>
                )}

                <Link
                  to="/profile"
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[#EBF3E8] transition text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-[#2D5A27] text-white flex items-center justify-center font-bold text-xs">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="hidden lg:block text-xs">
                    <p className="font-semibold text-[#1E3F20] leading-tight truncate max-w-[110px]">
                      {currentUser.name.split(' ')[0]}
                    </p>
                    <p className="text-[#5C675E] text-[10px] truncate max-w-[110px]">
                      {currentUser.rollOrEmpId}
                    </p>
                  </div>
                </Link>

                <button
                  onClick={logout}
                  title="Log out"
                  className="p-2 text-[#5C675E] hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-[#2D5A27] hover:bg-[#EBF3E8] rounded-xl transition"
                >
                  Log In
                </Link>
                <Link
                  to="/packages"
                  className="px-4 py-2 text-sm font-medium text-white bg-[#2D5A27] hover:bg-[#21431D] rounded-xl shadow-xs transition"
                >
                  Start 7-Day Trial
                </Link>
              </div>
            )}

            {!isAdmin && (
              <Link
                to="/admin"
                className="p-2 rounded-lg text-emerald-800 hover:bg-emerald-100 transition text-xs font-medium flex items-center gap-1"
                title="Open Admin Portal"
              >
                <Shield className="w-4 h-4 text-emerald-700" />
                <span className="hidden xl:inline text-[11px]">Admin</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            {currentUser && (
              <Link
                to="/profile"
                className="w-8 h-8 rounded-full bg-[#2D5A27] text-white flex items-center justify-center font-bold text-xs"
              >
                {currentUser.name.charAt(0)}
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#1E3F20] hover:bg-[#EBF3E8] focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF9F5] border-b border-[#E5EBE3] px-4 pt-2 pb-6 space-y-2 shadow-lg">
          {currentUser && (
            <div className="bg-[#F3F8F1] border border-emerald-200 rounded-xl p-3 mb-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm text-[#1E3F20]">{currentUser.name}</p>
                  <p className="text-xs text-[#5C675E]">{currentUser.rollOrEmpId} • {currentUser.department}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-white text-[#2D5A27] border border-emerald-200">
                  {currentUser.membershipStatus === 'trial'
                    ? `🟡 Trial (Day ${currentUser.trialDay}/7)`
                    : currentUser.membershipStatus === 'trial_completed'
                    ? '🎉 Trial Completed'
                    : currentUser.membershipStatus === 'monthly'
                    ? `🟢 Monthly (${currentUser.remainingServiceDays}d)`
                    : '⚪ No Active Plan'}
                </span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-1">
            {customerNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-base font-medium transition ${
                    isActive
                      ? 'bg-[#2D5A27] text-white'
                      : 'text-[#334139] hover:bg-[#EBF3E8]'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-200' : 'text-[#4A7C59]'}`} />
                  {item.name}
                </Link>
              );
            })}

            <div className="pt-2 border-t border-[#E5EBE3] mt-2 flex flex-col gap-2">
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-base font-medium text-emerald-900 bg-emerald-100 hover:bg-emerald-200 transition"
              >
                <Shield className="w-5 h-5 text-emerald-700" />
                Admin Dashboard Portal
              </Link>

              {currentUser ? (
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-base font-medium text-red-700 hover:bg-red-50 transition text-left"
                >
                  <LogOut className="w-5 h-5" />
                  Log Out
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl font-medium bg-[#2D5A27] text-white"
                >
                  <LogIn className="w-4 h-4" />
                  Log In / Register
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
