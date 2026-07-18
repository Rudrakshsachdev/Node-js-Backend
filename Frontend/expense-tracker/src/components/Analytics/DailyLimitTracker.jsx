import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';

export default function DailyLimitTracker({ expenses = [] }) {
  const [dailyLimit, setDailyLimit] = useState(1666.66); // default based on 50000 limit

  useEffect(() => {
    const savedBudget = localStorage.getItem('monthlyBudget');
    if (savedBudget) {
      setDailyLimit(Number(savedBudget) / 30);
    }
  }, []);

  const dailyTotals = {};

  // Gather daily expense totals (excluding income)
  expenses
    .filter((e) => e.type === 'expense')
    .forEach((tx) => {
      const dateStr = new Date(tx.date).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      });
      
      dailyTotals[dateStr] = (dailyTotals[dateStr] || 0) + tx.amount;
    });

  const chartData = Object.entries(dailyTotals).map(([date, Spent]) => ({
    date,
    Spent,
  })).sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Daily Limit Tracker</h3>
          <p className="text-xs text-slate-500 mt-0.5">Daily expenses vs. calculated daily budget threshold</p>
        </div>
        <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 rounded-lg px-2 py-0.5 uppercase tracking-wider">
          Limit: ₹{dailyLimit.toFixed(0)}/day
        </span>
      </div>

      <div className="h-80 w-full pt-4">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-400 text-sm">
            No expense history available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '12px' }}
                formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Spent']}
              />
              <ReferenceLine y={dailyLimit} stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" label={{ value: 'Daily Limit', fill: '#ef4444', fontSize: 10, position: 'top' }} />
              <Bar dataKey="Spent" radius={[4, 4, 0, 0]} fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
