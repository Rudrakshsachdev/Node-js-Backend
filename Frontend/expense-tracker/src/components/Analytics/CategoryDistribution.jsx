import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = {
  Food: '#f59e0b',
  Transportation: '#3b82f6',
  Shopping: '#a855f7',
  Bills: '#f43f5e',
  Healthcare: '#14b8a6',
  Entertainment: '#ec4899',
  Education: '#6366f1',
  Travel: '#06b6d4',
  Salary: '#10b981',
  Investment: '#0ea5e9',
  Other: '#64748b',
};

export default function CategoryDistribution({ expenses = [] }) {
  const categoryTotals = {};

  expenses
    .filter((e) => e.type === 'expense')
    .forEach((e) => {
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
    });

  const chartData = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value,
  })).sort((a, b) => b.value - a.value);

  const totalSpend = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-4">
      <div>
        <h3 className="text-lg font-bold text-slate-900">Category Distribution</h3>
        <p className="text-xs text-slate-500 mt-0.5">Donut breakdown of expense channels</p>
      </div>

      <div className="h-80 w-full flex items-center justify-center pt-4">
        {chartData.length === 0 ? (
          <div className="text-slate-400 text-sm">No expenses to analyze</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#64748b'} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '12px' }}
                formatter={(value) => [`₹${value.toLocaleString('en-IN')} (${((value / totalSpend) * 100).toFixed(1)}%)`, '']}
              />
              <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
