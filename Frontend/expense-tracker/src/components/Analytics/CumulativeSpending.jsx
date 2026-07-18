import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export default function CumulativeSpending({ expenses = [] }) {
  // Filter only expenses and sort chronologically
  const expenseLogs = expenses
    .filter((e) => e.type === 'expense')
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // Build daily cumulative totals
  let runningTotal = 0;
  const cumulativeData = [];

  expenseLogs.forEach((e) => {
    runningTotal += e.amount;
    const dateStr = new Date(e.date).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
    
    // If the same date already exists, update it to the latest running total
    const existingIndex = cumulativeData.findIndex((item) => item.date === dateStr);
    if (existingIndex !== -1) {
      cumulativeData[existingIndex].Cumulative = runningTotal;
    } else {
      cumulativeData.push({ date: dateStr, Cumulative: runningTotal });
    }
  });

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-4">
      <div>
        <h3 className="text-lg font-bold text-slate-900">Cumulative Spend Buildup</h3>
        <p className="text-xs text-slate-500 mt-0.5">Continuous trajectory of total spending</p>
      </div>

      <div className="h-80 w-full pt-4">
        {cumulativeData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-400 text-sm">
            No expense history available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={cumulativeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '12px' }}
                formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Cumulative Spend']}
              />
              <Area type="monotone" dataKey="Cumulative" stroke="#a855f7" fillOpacity={1} fill="url(#colorCumulative)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
