import React, { useState } from 'react';
import { useNutriGo } from '../context/NutriGoContext';
import { Calendar, UserCheck, RefreshCw, Sparkles } from 'lucide-react';

export default function DemoBar() {
  const { currentUser, users, loginAs, simulatedToday, advanceSimulatedDay, resetAllData } = useNutriGo();
  const [advanceMsg, setAdvanceMsg] = useState(false);

  const handleAdvance = () => {
    advanceSimulatedDay();
    setAdvanceMsg(true);
    setTimeout(() => setAdvanceMsg(false), 2000);
  };

  return (
    <div className="bg-[#1E3F20] text-emerald-50 text-xs py-1.5 px-3 border-b border-emerald-900/40 relative z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 font-medium bg-emerald-800/60 px-2 py-0.5 rounded-full text-[11px] border border-emerald-700/50">
            <Sparkles className="w-3 h-3 text-emerald-300" />
            Interactive Demo Mode
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 text-emerald-200">
            <Calendar className="w-3 h-3 text-emerald-300" />
            Simulated Date: <strong className="text-white ml-0.5">{simulatedToday}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Profile Switcher */}
          <div className="flex items-center gap-1.5">
            <UserCheck className="w-3 h-3 text-emerald-300 hidden md:inline" />
            <span className="hidden md:inline text-emerald-200">Acting as:</span>
            <select
              value={currentUser?.id || ''}
              onChange={(e) => loginAs(e.target.value)}
              className="bg-emerald-900/80 text-white border border-emerald-700/70 rounded px-2 py-0.5 text-[11px] focus:outline-none focus:ring-1 focus:ring-emerald-400"
            >
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.role === 'admin' ? '🛡️ [Admin] ' : '🌱 [User] '}
                  {u.name} (
                  {u.membershipStatus === 'trial'
                    ? `Trial Day ${u.trialDay}/7`
                    : u.membershipStatus === 'trial_completed'
                    ? 'Trial Completed'
                    : u.membershipStatus === 'monthly'
                    ? `${u.remainingServiceDays} Days Left`
                    : u.role === 'admin'
                    ? 'Admin Portal'
                    : 'No Active Plan'}
                  )
                </option>
              ))}
            </select>
          </div>

          {/* Advance Day Button */}
          <button
            onClick={handleAdvance}
            className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-2.5 py-0.5 rounded text-[11px] transition shadow-xs"
            title="Advance simulated clock by 1 day to test trial progression & daily deliveries"
          >
            <Calendar className="w-3 h-3" />
            <span>Next Day +1</span>
          </button>

          {/* Reset Button */}
          <button
            onClick={resetAllData}
            className="flex items-center gap-1 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 px-2 py-0.5 rounded text-[11px] transition border border-emerald-800/60"
            title="Reset data to initial state"
          >
            <RefreshCw className="w-2.5 h-2.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {advanceMsg && (
        <div className="text-center py-0.5 text-emerald-200 text-[11px] animate-pulse">
          ✓ Advanced to next service day! Trial days & status updated.
        </div>
      )}
    </div>
  );
}
