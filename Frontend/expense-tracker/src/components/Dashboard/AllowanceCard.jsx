import React, { useState, useEffect } from 'react';
import { PiggyBank, CalendarRange, Sparkles, Loader2 } from 'lucide-react';

export default function AllowanceCard() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAllowance = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const response = await fetch(`${apiUrl}/api/v1/expenses/allowance`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const resData = await response.json();
        if (!response.ok) {
          throw new Error(resData.message || 'Failed to fetch allowance');
        }

        setData(resData.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllowance();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex items-center justify-center min-h-[180px]">
        <Loader2 className="w-6 h-6 text-violet-600 animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm min-h-[180px] flex items-center justify-center text-slate-400 text-sm">
        Allowance stats unavailable
      </div>
    );
  }

  const { spentThisMonth, spentToday, elapsedDays, remainingDays } = data;
  const avgDailySpend = elapsedDays > 0 ? spentThisMonth / elapsedDays : 0;

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <PiggyBank className="w-5 h-5 text-violet-600" />
            Allowance Summary
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Month-to-date allowance logs</p>
        </div>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-violet-50 text-violet-700 border border-violet-100 uppercase tracking-wider">
          <CalendarRange className="w-3 h-3" /> {remainingDays} Days Left
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Spent Today</span>
          <span className="text-base font-bold text-slate-900 mt-1 block">
            ₹{spentToday.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
        </div>

        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Daily Average</span>
          <span className="text-base font-bold text-slate-900 mt-1 block">
            ₹{avgDailySpend.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1.5 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          MTD spend: ₹{spentThisMonth.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </span>
      </div>
    </div>
  );
}
