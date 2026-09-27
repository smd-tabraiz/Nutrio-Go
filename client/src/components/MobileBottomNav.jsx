import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Package, HeartHandshake, MessageSquareHeart, User as UserIcon } from 'lucide-react';
import { useNutriGo } from '../context/NutriGoContext';

export default function MobileBottomNav() {
  const location = useLocation();
  const { currentUser } = useNutriGo();

  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const items = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Packages', href: '/packages', icon: Package },
    {
      name: 'My NutriGo',
      href: '/my-nutrigo',
      icon: HeartHandshake,
      badge:
        currentUser?.membershipStatus === 'trial'
          ? `Day ${currentUser.trialDay}`
          : currentUser?.membershipStatus === 'monthly'
          ? 'Active'
          : undefined,
    },
    { name: 'Feedback', href: '/feedback', icon: MessageSquareHeart },
    { name: 'Profile', href: '/profile', icon: UserIcon },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF9F5]/95 backdrop-blur-md border-t border-[#E5EBE3] px-2 py-1.5 shadow-lg">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;

          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition relative ${
                isActive ? 'text-[#2D5A27] font-bold' : 'text-[#5C675E] hover:text-[#1E3F20]'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-[#2D5A27]' : ''}`} />
                {item.badge && (
                  <span className="absolute -top-1 -right-2 text-[9px] px-1 py-0.2 bg-emerald-600 text-white rounded-full font-bold">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
