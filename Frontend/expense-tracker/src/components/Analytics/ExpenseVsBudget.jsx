import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export default function ExpenseVsBudget({ expenses = [] }) {
  const [budget, setBudget] = useState(50000);

  useEffect(() => {
    const savedBudget = localStorage.getItem('monthlyBudget');
    if (savedBudget) {
      setBudget(Number(savedBudget));
    }
  }, []);

  const totalExpense = expenses
    .filter((e) => e.type === 'expense')
    .reduce((sum, e) => sum + e.amount, 0);

  const chartData = [
    { name: 'Budget Limit', Amount: budget, color: '#6366f1' },
    { name: 'Actual Expenses', Amount: totalExpense, color: totalExpense > budget ? '#ef4444' : '#10b981' },
  ];

  const utilizationPercent = budget > 0 ? (totalExpense / budget) * 100 : 0;

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Expenses vs. Budget</h3>
          <p className="text-xs text-slate-500 mt-0.5">Budget limit utilization analysis</p>
        </div>
        <span className={`text-[10px] font-bold rounded-lg px-2 py-0.5 uppercase tracking-wider ${
          utilizationPercent > 100 
            ? 'bg-rose-50 border border-rose-100 text-rose-600' 
            : 'bg-emerald-50 border border-emerald-100 text-emerald-600'
        }`}>
          {utilizationPercent.toFixed(1)}% Used
        </span>
      </div>

      <div className="h-80 w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '12px' }}
              formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Amount']}
            />
            <Bar dataKey="Amount" radius={[8, 8, 0, 0]} maxBarSize={60}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
