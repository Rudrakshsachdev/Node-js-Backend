import React from 'react';
import { ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const COLORS = {
  Cash: '#10b981',
  'Credit Card': '#f43f5e',
  'Debit Card': '#f59e0b',
  UPI: '#8b5cf6',
  'Net Banking': '#3b82f6',
  Wallet: '#ec4899',
};

export default function PaymentMethodUsage({ expenses = [] }) {
  const methodTotals = {};

  expenses
    .filter((e) => e.type === 'expense')
    .forEach((e) => {
      methodTotals[e.paymentMethod] = (methodTotals[e.paymentMethod] || 0) + e.amount;
    });

  const chartData = Object.entries(methodTotals).map(([name, value]) => ({
    name,
    value,
  })).sort((a, b) => b.value - a.value);

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-4">
      <div>
        <h3 className="text-lg font-bold text-slate-900">Payment Channel Share</h3>
        <p className="text-xs text-slate-500 mt-0.5">Expense breakdown by payment method</p>
      </div>

      <div className="h-80 w-full pt-4">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-400 text-sm">
            No payment channel logs available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '12px' }}
                formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Total Spent']}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#6366f1'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
