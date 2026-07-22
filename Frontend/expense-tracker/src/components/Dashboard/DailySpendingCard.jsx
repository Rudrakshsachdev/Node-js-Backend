import React, { useState, useEffect } from 'react';
import { Calendar, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function DailySpendingCard({ expenses = [] }) {
  const [budget, setBudget] = useState(50000);

  useEffect(() => {
    const savedBudget = localStorage.getItem('monthlyBudget');
    if (savedBudget) {
      setBudget(Number(savedBudget));
    }
  }, [expenses]);

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  // Define today's time boundaries
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  // 1. Calculate remaining days in the month (including today)
  const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
  const elapsedDays = today.getDate();
  const remainingDays = totalDays - elapsedDays + 1;

  // 2. Calculate expenses in the current month BEFORE today
  const spentBeforeTodayThisMonth = expenses
    .filter((e) => {
      const d = new Date(e.date);
      return (
        e.type === 'expense' &&
        d.getMonth() === currentMonth &&
        d.getFullYear() === currentYear &&
        d < todayStart // strictly before today
      );
    })
    .reduce((sum, e) => sum + e.amount, 0);

  // 3. Calculate budget pool left starting today (inherently accounts for previous days' over/underspending)
  const budgetAtStartOfToday = Math.max(0, budget - spentBeforeTodayThisMonth);

  // 4. Calculate today's starting daily limit
  const dailyLimit = remainingDays > 0 ? budgetAtStartOfToday / remainingDays : 0;

  // 5. Calculate spent today
  const spentToday = expenses
    .filter((e) => {
      const d = new Date(e.date);
      return e.type === 'expense' && d >= todayStart && d <= todayEnd;
    })
    .reduce((sum, e) => sum + e.amount, 0);

  const percentUsed = dailyLimit > 0 ? (spentToday / dailyLimit) * 100 : 0;
  const remainingToday = dailyLimit - spentToday;

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-4 flex flex-col justify-between min-h-[180px]">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Daily Spending</h3>
          <p className="text-xs text-slate-500 mt-0.5">Adjusted daily limit accounting for past spends</p>
        </div>
        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 rounded-lg px-2.5 py-1 uppercase tracking-wider flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" /> {remainingDays} Days Left
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-end">
          <span className="text-2xl font-black text-slate-900">
            ₹{spentToday.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            <span className="text-slate-400 text-xs font-semibold"> / ₹{dailyLimit.toLocaleString('en-IN', { maximumFractionDigits: 0 })} limit</span>
          </span>
          <span className={`text-xs font-bold ${percentUsed > 100 ? 'text-rose-600' : 'text-slate-500'}`}>
            {percentUsed.toFixed(0)}% Used
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              percentUsed > 100 
                ? 'bg-rose-500' 
                : percentUsed > 80 
                ? 'bg-amber-500' 
                : 'bg-violet-600'
            }`}
            style={{ width: `${Math.min(percentUsed, 100)}%` }}
          />
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center text-xs">
        {remainingToday >= 0 ? (
          <span className="text-emerald-700 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            ₹{remainingToday.toLocaleString('en-IN', { maximumFractionDigits: 2 })} remaining for today
          </span>
        ) : (
          <span className="text-rose-700 font-semibold flex items-center gap-1">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            Daily limit exceeded by ₹{Math.abs(remainingToday).toLocaleString('en-IN', { maximumFractionDigits: 2 })}!
          </span>
        )}
      </div>
    </div>
  );
}
