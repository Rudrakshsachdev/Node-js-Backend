import React, { useState, useEffect } from 'react';
import Sidebar from '../Dashboard/Sidebar';
import {
  LineChart,
  TrendingUp,
  TrendingDown,
  Calendar,
  IndianRupee,
  Loader2,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Zap,
  DollarSign,
  PieChart,
  Activity
} from 'lucide-react';

export default function ForecastPage() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchForecast = async () => {
    setIsLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/auth/login';
        return;
      }

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/v1/expenses/forecast`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.message || 'Failed to fetch forecast details');
      }

      setData(resData.data);
    } catch (err) {
      setError(err.message || 'Connection to the API failed.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchForecast();
  }, []);

  const formatCurrency = (val) => {
    return `₹${(val || 0).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const spentSoFar = data?.spentSoFar || 0;
  const incomeSoFar = data?.incomeSoFar || 0;
  const dailyRate = data?.dailyRate || 0;
  const elapsedDays = data?.elapsedDays || 0;
  const remainingDays = data?.remainingDays || 0;
  const totalDays = data?.totalDays || 30;
  const projectedRemaining = data?.projectedRemaining || 0;
  const forecastedExpenses = data?.forecastedExpenses || 0;
  const projectedNet = incomeSoFar - forecastedExpenses;

  const monthProgressPct = Math.min(Math.round((elapsedDays / totalDays) * 100), 100);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
              <LineChart className="w-7 h-7 text-violet-600" />
              Financial Forecast & Velocity
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Projected end-of-month financial trajectory based on current spending velocity
            </p>
          </div>

          <button
            onClick={fetchForecast}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold text-sm rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm self-start md:self-auto disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-violet-600' : ''}`} />
            Refresh Data
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-3xl border border-slate-200/80 shadow-sm">
            <Loader2 className="w-8 h-8 text-violet-600 animate-spin mb-3" />
            <p className="text-sm font-medium text-slate-500">Calculating spending velocity & projections...</p>
          </div>
        ) : (
          <>
            {/* Metric Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Spent So Far */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Spent So Far</span>
                  <div className="p-2.5 bg-amber-50 rounded-2xl text-amber-600 border border-amber-100">
                    <IndianRupee className="w-5 h-5" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-slate-900">{formatCurrency(spentSoFar)}</h2>
                <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {elapsedDays} days recorded this month
                </p>
              </div>

              {/* Daily Velocity */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Daily Run-Rate</span>
                  <div className="p-2.5 bg-blue-50 rounded-2xl text-blue-600 border border-blue-100">
                    <Zap className="w-5 h-5" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-slate-900">{formatCurrency(dailyRate)}/day</h2>
                <p className="text-xs text-slate-500 mt-2">
                  Average spending per elapsed day
                </p>
              </div>

              {/* Projected Month-End Spend */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Projected Spend</span>
                  <div className="p-2.5 bg-violet-50 rounded-2xl text-violet-600 border border-violet-100">
                    <Activity className="w-5 h-5" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-violet-600">{formatCurrency(forecastedExpenses)}</h2>
                <p className="text-xs text-slate-500 mt-2">
                  Estimated total expense by day {totalDays}
                </p>
              </div>

              {/* Projected Net Balance */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Projected Savings</span>
                  <div className={`p-2.5 rounded-2xl border ${projectedNet >= 0 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                    {projectedNet >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                  </div>
                </div>
                <h2 className={`text-2xl font-bold ${projectedNet >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {formatCurrency(projectedNet)}
                </h2>
                <p className="text-xs text-slate-500 mt-2">
                  Income ({formatCurrency(incomeSoFar)}) minus projected spend
                </p>
              </div>
            </div>

            {/* Month Timeline Progress & Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Progress Card */}
              <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-violet-600" />
                    Month Timeline & Trajectory
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Visualizing elapsed vs remaining days and projected costs
                  </p>
                </div>

                {/* Progress bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-600">
                    <span>Elapsed: {elapsedDays} Days ({monthProgressPct}%)</span>
                    <span>Remaining: {remainingDays} Days</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
                    <div
                      className="bg-gradient-to-r from-violet-600 to-indigo-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${monthProgressPct}%` }}
                    />
                  </div>
                </div>

                {/* Breakdown table / metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-xs text-slate-400 font-semibold uppercase">Current Spent</span>
                    <p className="text-lg font-bold text-slate-800">{formatCurrency(spentSoFar)}</p>
                    <span className="text-[11px] text-slate-500 block">Accumulated over {elapsedDays} days</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="text-xs text-slate-400 font-semibold uppercase">Projected Remaining Spend</span>
                    <p className="text-lg font-bold text-slate-800">{formatCurrency(projectedRemaining)}</p>
                    <span className="text-[11px] text-slate-500 block">Calculated for remaining {remainingDays} days</span>
                  </div>
                </div>

                {/* Status banner */}
                <div className={`p-4 rounded-2xl border flex items-start gap-3 ${projectedNet >= 0 ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' : 'bg-rose-50/70 border-rose-200 text-rose-900'}`}>
                  {projectedNet >= 0 ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div className="text-xs leading-relaxed">
                    <span className="font-bold block text-sm mb-0.5">
                      {projectedNet >= 0 ? 'Healthy Financial Pace' : 'High Velocity Alert'}
                    </span>
                    {projectedNet >= 0
                      ? `At your current velocity of ${formatCurrency(dailyRate)}/day, you are projected to end the month with a surplus savings of ${formatCurrency(projectedNet)}.`
                      : `At your current velocity of ${formatCurrency(dailyRate)}/day, your projected expenses (${formatCurrency(forecastedExpenses)}) will exceed your recorded month income (${formatCurrency(incomeSoFar)}).`}
                  </div>
                </div>
              </div>

              {/* Insights & Recommendations */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-5">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" />
                  Velocity Insights
                </h3>

                <div className="space-y-4 text-xs text-slate-600">
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                    <span className="font-bold text-slate-800 block text-xs">Daily Budget Target</span>
                    <p className="text-slate-600">
                      To end the month with neutral balance, target keeping daily expenses below{' '}
                      <strong className="text-slate-900">
                        {formatCurrency(remainingDays > 0 ? (incomeSoFar - spentSoFar) / remainingDays : 0)}
                      </strong>.
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                    <span className="font-bold text-slate-800 block text-xs">Income Coverage</span>
                    <p className="text-slate-600">
                      Total income logged for current month:{' '}
                      <strong className="text-slate-900">{formatCurrency(incomeSoFar)}</strong>.
                    </p>
                  </div>

                  <div className="p-3.5 bg-violet-50/50 rounded-2xl border border-violet-100 space-y-1">
                    <span className="font-bold text-violet-900 block text-xs">Pro Tip</span>
                    <p className="text-violet-700">
                      Updating expenses consistently every day ensures higher accuracy in your daily velocity run-rate calculations.
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
