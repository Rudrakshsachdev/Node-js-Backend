import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function IncomeExpenseTrend({ expenses = [] }) {
  // Process daily income and expenses
  const dailyTotals = {};

  expenses.forEach((tx) => {
    const dateStr = new Date(tx.date).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
    
    if (!dailyTotals[dateStr]) {
      dailyTotals[dateStr] = { date: dateStr, Income: 0, Expense: 0 };
    }

    if (tx.type === 'income') {
      dailyTotals[dateStr].Income += tx.amount;
    } else {
      dailyTotals[dateStr].Expense += tx.amount;
    }
  });

  // Convert to sorted array
  const chartData = Object.values(dailyTotals).sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-4">
      <div>
        <h3 className="text-lg font-bold text-slate-900">Income vs. Expense Trend</h3>
        <p className="text-xs text-slate-500 mt-0.5">Comparison of capital inflow and outflows over time</p>
      </div>

      <div className="h-80 w-full pt-4">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-400 text-sm">
            No transaction history available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '12px' }}
                formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, '']}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              <Area type="monotone" dataKey="Income" stroke="#10b981" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={2} />
              <Area type="monotone" dataKey="Expense" stroke="#f43f5e" fillOpacity={1} fill="url(#colorExpense)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
