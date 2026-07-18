import React, { useState, useEffect } from 'react';
import { LineChart, Sparkles, TrendingDown, TrendingUp, Loader2 } from 'lucide-react';

export default function ForecastCard() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const response = await fetch(`${apiUrl}/api/v1/expenses/forecast`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const resData = await response.json();
        if (!response.ok) {
          throw new Error(resData.message || 'Failed to fetch forecast');
        }

        setData(resData.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchForecast();
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
        Forecast insights unavailable
      </div>
    );
  }

  const { incomeSoFar, forecastedExpenses, dailyRate } = data;
  const projectedNet = incomeSoFar - forecastedExpenses;

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <LineChart className="w-5 h-5 text-violet-600" />
            Financial Forecast
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">End-of-month budget projections</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Projected Spend</span>
          <span className="text-base font-bold text-slate-900 mt-1 block">
            ₹{forecastedExpenses.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Projected Net</span>
          <span className={`text-base font-bold mt-1 block ${projectedNet >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            ₹{projectedNet.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1.5 font-medium">
          {projectedNet >= 0 ? (
            <>
              <TrendingUp className="w-4 h-4 text-emerald-500 shrink-0" />
              On track to save this month
            </>
          ) : (
            <>
              <TrendingDown className="w-4 h-4 text-rose-500 shrink-0" />
              Spending exceeds income rate
            </>
          )}
        </span>
      </div>
    </div>
  );
}
