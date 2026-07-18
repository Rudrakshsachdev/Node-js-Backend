import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function SavingsTrend({ expenses = [] }) {
  const dailySavings = {};

  expenses.forEach((tx) => {
    const dateStr = new Date(tx.date).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });

    if (!dailySavings[dateStr]) {
      dailySavings[dateStr] = { date: dateStr, Savings: 0 };
    }

    if (tx.type === 'income') {
      dailySavings[dateStr].Savings += tx.amount;
    } else {
      dailySavings[dateStr].Savings -= tx.amount;
    }
  });

  const chartData = Object.values(dailySavings).sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-4">
      <div>
        <h3 className="text-lg font-bold text-slate-900">Savings Rate Trend</h3>
        <p className="text-xs text-slate-500 mt-0.5">Track your net daily savings (Income - Expenses)</p>
      </div>

      <div className="h-80 w-full pt-4">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-400 text-sm">
            No savings trend logs available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '12px' }}
                formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Savings']}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              <Line type="monotone" dataKey="Savings" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 3, fill: '#6366f1' }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
