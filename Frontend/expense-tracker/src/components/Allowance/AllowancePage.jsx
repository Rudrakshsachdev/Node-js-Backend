import React, { useState, useEffect } from 'react';
import Sidebar from '../Dashboard/Sidebar';
import Footer from '../Dashboard/Footer';
import {
  PiggyBank,
  CalendarRange,
  Sparkles,
  Loader2,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Settings,
  Clock,
  ArrowUpRight,
  TrendingDown,
  TrendingUp,
  Receipt,
  Edit2
} from 'lucide-react';

export default function AllowancePage() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Allowance target configuration
  const [monthlyBudget, setMonthlyBudget] = useState(() => {
    const saved = localStorage.getItem('monthly_allowance_budget');
    return saved ? parseFloat(saved) : 15000;
  });
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [tempBudget, setTempBudget] = useState('');

  const fetchAllowance = async () => {
    setIsLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/auth/login';
        return;
      }

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/v1/expenses/allowance`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.message || 'Failed to fetch allowance stats');
      }

      setData(resData.data);
    } catch (err) {
      setError(err.message || 'Connection to the API failed.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllowance();
  }, []);

  const handleSaveBudget = (e) => {
    e.preventDefault();
    const val = parseFloat(tempBudget);
    if (!isNaN(val) && val >= 0) {
      setMonthlyBudget(val);
      localStorage.setItem('monthly_allowance_budget', val.toString());
      setIsEditingBudget(false);
    }
  };

  const formatCurrency = (val) => {
    return `₹${(val || 0).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const spentThisMonth = data?.spentThisMonth || 0;
  const spentToday = data?.spentToday || 0;
  const elapsedDays = data?.elapsedDays || 1;
  const remainingDays = data?.remainingDays || 1;
  const totalDays = data?.totalDays || 30;
  const todayExpenses = data?.todayExpenses || [];

  // Computed metrics
  const remainingAllowance = monthlyBudget - spentThisMonth;
  const recommendedDailyPace = remainingDays > 0 ? Math.max(0, remainingAllowance / remainingDays) : 0;
  const usedPercentage = Math.min(Math.round((spentThisMonth / monthlyBudget) * 100), 100);
  const isOverBudget = remainingAllowance < 0;
  const isTodayPaceExceeded = spentToday > recommendedDailyPace;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8 overflow-y-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
              <PiggyBank className="w-7 h-7 text-violet-600" />
              Allowance & Pocket Money Manager
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Set monthly allowance budgets, monitor daily pace limits, and keep track of today's spending
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setTempBudget(monthlyBudget.toString());
                setIsEditingBudget(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-violet-50 text-violet-700 border border-violet-200 font-semibold text-sm rounded-xl hover:bg-violet-100 transition-all shadow-sm"
            >
              <Settings className="w-4 h-4 text-violet-600" />
              Set Budget Limit
            </button>

            <button
              onClick={fetchAllowance}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold text-sm rounded-xl hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-violet-600' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Budget Setting Modal / Inline Form */}
        {isEditingBudget && (
          <div className="p-5 bg-white border border-violet-200 rounded-3xl shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-violet-600" />
                Configure Monthly Allowance Budget
              </h3>
              <button
                onClick={() => setIsEditingBudget(false)}
                className="text-xs text-slate-400 hover:text-slate-600 font-medium"
              >
                Cancel
              </button>
            </div>
            <form onSubmit={handleSaveBudget} className="flex gap-3">
              <div className="relative flex-1">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">₹</span>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={tempBudget}
                  onChange={(e) => setTempBudget(e.target.value)}
                  placeholder="Enter monthly allowance amount"
                  className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm"
              >
                Save Limit
              </button>
            </form>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[380px] bg-white rounded-3xl border border-slate-200/80 shadow-sm">
            <Loader2 className="w-8 h-8 text-violet-600 animate-spin mb-3" />
            <p className="text-sm font-medium text-slate-500">Loading allowance & daily pace stats...</p>
          </div>
        ) : (
          <>
            {/* Top Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Monthly Allowance */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Monthly Allowance</span>
                  <div className="p-2.5 bg-violet-50 rounded-2xl text-violet-600 border border-violet-100">
                    <PiggyBank className="w-5 h-5" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-slate-900">{formatCurrency(monthlyBudget)}</h2>
                <p className="text-xs text-slate-500 mt-2">
                  Configured monthly allowance limit
                </p>
              </div>

              {/* Remaining Allowance */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Remaining Balance</span>
                  <div className={`p-2.5 rounded-2xl border ${!isOverBudget ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                    {!isOverBudget ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                  </div>
                </div>
                <h2 className={`text-2xl font-bold ${!isOverBudget ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {formatCurrency(remainingAllowance)}
                </h2>
                <p className="text-xs text-slate-500 mt-2">
                  {isOverBudget ? 'Over budget by ' + formatCurrency(Math.abs(remainingAllowance)) : `${usedPercentage}% of budget utilized`}
                </p>
              </div>

              {/* Recommended Daily Pace */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Recommended Daily Pace</span>
                  <div className="p-2.5 bg-blue-50 rounded-2xl text-blue-600 border border-blue-100">
                    <Clock className="w-5 h-5" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-slate-900">{formatCurrency(recommendedDailyPace)}/day</h2>
                <p className="text-xs text-slate-500 mt-2">
                  Allowed spend per remaining day ({remainingDays} left)
                </p>
              </div>

              {/* Spent Today */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Spent Today</span>
                  <div className={`p-2.5 rounded-2xl border ${!isTodayPaceExceeded ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                    <Receipt className="w-5 h-5" />
                  </div>
                </div>
                <h2 className={`text-2xl font-bold ${!isTodayPaceExceeded ? 'text-slate-900' : 'text-amber-600'}`}>
                  {formatCurrency(spentToday)}
                </h2>
                <p className="text-xs text-slate-500 mt-2">
                  {isTodayPaceExceeded ? 'Exceeds recommended daily pace' : 'Within daily recommended pace'}
                </p>
              </div>
            </div>

            {/* Allowance Progress & Today's Logs */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Allowance Progress Detail */}
              <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <CalendarRange className="w-5 h-5 text-violet-600" />
                    Monthly Allowance Pace & Utilization
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Track your current spending against monthly allowance budget
                  </p>
                </div>

                {/* Progress bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-600">
                    <span>Spent: {formatCurrency(spentThisMonth)}</span>
                    <span>Budget: {formatCurrency(monthlyBudget)} ({usedPercentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        usedPercentage > 90
                          ? 'bg-rose-500'
                          : usedPercentage > 75
                          ? 'bg-amber-500'
                          : 'bg-gradient-to-r from-violet-600 to-indigo-600'
                      }`}
                      style={{ width: `${Math.min(usedPercentage, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-xs text-slate-400 font-semibold uppercase">Elapsed Month Progress</span>
                    <p className="text-base font-bold text-slate-800">{elapsedDays} of {totalDays} Days ({Math.round((elapsedDays/totalDays)*100)}%)</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-xs text-slate-400 font-semibold uppercase">Average Daily Spend</span>
                    <p className="text-base font-bold text-slate-800">{formatCurrency(elapsedDays > 0 ? spentThisMonth / elapsedDays : 0)}/day</p>
                  </div>
                </div>

                {/* Today's Expense List */}
                <div className="pt-4 border-t border-slate-100 space-y-4">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center justify-between">
                    <span>Today's Transactions</span>
                    <span className="text-xs font-semibold text-slate-400">{todayExpenses.length} items</span>
                  </h4>

                  {todayExpenses.length === 0 ? (
                    <div className="p-6 bg-slate-50/50 rounded-2xl text-center border border-dashed border-slate-200">
                      <p className="text-xs text-slate-400 font-medium">No expenses logged for today yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {todayExpenses.map((tx) => (
                        <div key={tx.id} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center font-bold text-xs">
                              {tx.category ? tx.category.charAt(0).toUpperCase() : 'E'}
                            </div>
                            <div>
                              <h5 className="text-xs font-bold text-slate-800">{tx.title}</h5>
                              <p className="text-[10px] text-slate-400 capitalize">{tx.category || 'General'} • {tx.paymentMethod || 'Cash'}</p>
                            </div>
                          </div>
                          <span className="text-sm font-bold text-slate-900">
                            - {formatCurrency(tx.amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Daily Allowance Smart Tips */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-5">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  Allowance Guidance
                </h3>

                <div className="space-y-4 text-xs text-slate-600">
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                    <span className="font-bold text-slate-800 block text-xs">Daily Pace Limit</span>
                    <p className="text-slate-600">
                      To avoid running out of pocket money, limit your remaining daily expenses to{' '}
                      <strong className="text-slate-900">{formatCurrency(recommendedDailyPace)}</strong>.
                    </p>
                  </div>

                  <div className={`p-3.5 rounded-2xl border space-y-1 ${!isTodayPaceExceeded ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' : 'bg-amber-50/70 border-amber-200 text-amber-900'}`}>
                    <span className="font-bold block text-xs">
                      {!isTodayPaceExceeded ? 'Within Budget Pace' : 'Above Daily Target'}
                    </span>
                    <p>
                      {!isTodayPaceExceeded
                        ? `Great job! Today's spending (${formatCurrency(spentToday)}) is well within your daily recommended pace.`
                        : `You have spent ${formatCurrency(spentToday)} today, which is over your target daily pace of ${formatCurrency(recommendedDailyPace)}.`}
                    </p>
                  </div>

                  <div className="p-3.5 bg-violet-50/50 rounded-2xl border border-violet-100 space-y-1">
                    <span className="font-bold text-violet-900 block text-xs">Customizing Allowance</span>
                    <p className="text-violet-700">
                      You can click "Set Budget Limit" anytime to adjust your monthly pocket money allowance target.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
