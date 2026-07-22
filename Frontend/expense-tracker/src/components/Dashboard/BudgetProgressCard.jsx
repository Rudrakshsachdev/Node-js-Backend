import React, { useState, useEffect } from 'react';
import { Target, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function BudgetProgressCard({ expenses = [] }) {
  const [budget, setBudget] = useState(50000);

  useEffect(() => {
    const savedBudget = localStorage.getItem('monthlyBudget');
    if (savedBudget) {
      setBudget(Number(savedBudget));
    }
  }, [expenses]); // reload when expenses load/change

  const totalExpense = expenses
    .filter((e) => e.type === 'expense')
    .reduce((sum, e) => sum + e.amount, 0);

  const percentUsed = budget > 0 ? (totalExpense / budget) * 100 : 0;
  const remaining = budget - totalExpense;

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-4 flex flex-col justify-between min-h-[180px]">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Budget Progress</h3>
          <p className="text-xs text-slate-500 mt-0.5">Monthly budget utilization status</p>
        </div>
        <span className="text-[10px] font-bold text-violet-700 bg-violet-50 border border-violet-100 rounded-lg px-2.5 py-1 uppercase tracking-wider flex items-center gap-1">
          <Target className="w-3.5 h-3.5" /> Monthly
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-end">
          <span className="text-2xl font-black text-slate-900">
            ₹{totalExpense.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            <span className="text-slate-400 text-xs font-semibold"> / ₹{budget.toLocaleString('en-IN', { maximumFractionDigits: 0 })} budget</span>
          </span>
          <span className={`text-xs font-bold ${percentUsed > 100 ? 'text-rose-600' : 'text-slate-500'}`}>
            {percentUsed.toFixed(1)}% Used
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
                : 'bg-emerald-500'
            }`}
            style={{ width: `${Math.min(percentUsed, 100)}%` }}
          />
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center text-xs">
        {remaining >= 0 ? (
          <span className="text-emerald-700 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            ₹{remaining.toLocaleString('en-IN', { maximumFractionDigits: 2 })} under budget limits
          </span>
        ) : (
          <span className="text-rose-700 font-semibold flex items-center gap-1">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            Over budget by ₹{Math.abs(remaining).toLocaleString('en-IN', { maximumFractionDigits: 2 })}!
          </span>
        )}
      </div>
    </div>
  );
}
