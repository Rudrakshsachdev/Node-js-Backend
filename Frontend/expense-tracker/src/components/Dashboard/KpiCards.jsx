import React, { useState, useEffect } from 'react';
import { IndianRupee, ArrowUpRight, ArrowDownRight, Activity, Wallet, X, Loader2 } from 'lucide-react';

export default function KpiCards({ expenses = [] }) {
  const [budget, setBudget] = useState(50000);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [tempBudget, setTempBudget] = useState('50000');

  // Load budget from localStorage on mount
  useEffect(() => {
    const savedBudget = localStorage.getItem('monthlyBudget');
    if (savedBudget) {
      setBudget(Number(savedBudget));
      setTempBudget(savedBudget);
    }
  }, []);

  const handleSaveBudget = (e) => {
    e.preventDefault();
    const newBudget = Number(tempBudget);
    if (!isNaN(newBudget) && newBudget >= 0) {
      setBudget(newBudget);
      localStorage.setItem('monthlyBudget', newBudget.toString());
      setIsEditingBudget(false);
    }
  };

  // Calculations
  const totalIncome = expenses
    .filter((e) => e.type === 'income')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalExpense = expenses
    .filter((e) => e.type === 'expense')
    .reduce((sum, e) => sum + e.amount, 0);

  const netBalance = totalIncome - totalExpense;
  const transactionCount = expenses.length;
  const remainingBudget = budget - totalExpense;
  const budgetUsagePercent = budget > 0 ? (totalExpense / budget) * 100 : 0;

  return (
    <div className="space-y-6">
      
      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
        
        {/* Monthly Budget Card (Interactive) */}
        <div
          onClick={() => {
            setTempBudget(budget.toString());
            setIsEditingBudget(true);
          }}
          className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-violet-300 transition-all duration-200 cursor-pointer group"
        >
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Monthly Budget
              </span>
              <span className="text-2xl font-bold text-slate-900 tracking-tight block group-hover:text-violet-600 transition-colors">
                ₹{budget.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="p-2.5 rounded-2xl border text-violet-600 bg-violet-50 border-violet-100 group-hover:bg-violet-600 group-hover:text-white transition-all">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
            {remainingBudget >= 0 
              ? `₹${remainingBudget.toLocaleString('en-IN', { maximumFractionDigits: 2 })} left this month` 
              : `₹${Math.abs(remainingBudget).toLocaleString('en-IN', { maximumFractionDigits: 2 })} over budget!`
            }
          </div>
        </div>

        {/* Net Balance Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow duration-200">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Net Balance
              </span>
              <span className="text-2xl font-bold text-slate-900 tracking-tight block">
                ₹{netBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className={`p-2.5 rounded-2xl border ${netBalance >= 0 ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-rose-600 bg-rose-50 border-rose-100'}`}>
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
            Available capital status
          </div>
        </div>

        {/* Total Income Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow duration-200">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Total Income
              </span>
              <span className="text-2xl font-bold text-slate-900 tracking-tight block">
                ₹{totalIncome.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="p-2.5 rounded-2xl border text-emerald-600 bg-emerald-50 border-emerald-100">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
            Incoming cash flow
          </div>
        </div>

        {/* Total Expenses Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow duration-200">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Total Expenses
              </span>
              <span className="text-2xl font-bold text-slate-900 tracking-tight block">
                ₹{totalExpense.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="p-2.5 rounded-2xl border text-rose-600 bg-rose-50 border-rose-100">
              <ArrowDownRight className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
            Outgoing spendings
          </div>
        </div>

        {/* Transactions Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow duration-200">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Transactions
              </span>
              <span className="text-2xl font-bold text-slate-900 tracking-tight block">
                {transactionCount.toString()}
              </span>
            </div>
            <div className="p-2.5 rounded-2xl border text-violet-600 bg-violet-50 border-violet-100">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
            Total logged operations
          </div>
        </div>

      </div>

      {/* Budget Edit Modal */}
      {isEditingBudget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Set Monthly Budget</h3>
              <button 
                onClick={() => setIsEditingBudget(false)} 
                className="p-1 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveBudget} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Budget Limit (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={tempBudget}
                  onChange={(e) => setTempBudget(e.target.value)}
                  placeholder="e.g. 50000"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-sm text-slate-900 focus:outline-none focus:border-violet-600 focus:ring-1 focus:ring-violet-600 focus:bg-white transition-all duration-150"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditingBudget(false)}
                  className="py-2 px-4 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl py-2 px-5 shadow-lg shadow-violet-500/10 transition-all"
                >
                  Save Budget
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
