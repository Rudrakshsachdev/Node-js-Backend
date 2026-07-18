import React from 'react';
import { IndianRupee, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';

export default function KpiCards({ expenses = [] }) {
  // Calculations
  const totalIncome = expenses
    .filter((e) => e.type === 'income')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalExpense = expenses
    .filter((e) => e.type === 'expense')
    .reduce((sum, e) => sum + e.amount, 0);

  const netBalance = totalIncome - totalExpense;
  const transactionCount = expenses.length;

  const cardData = [
    {
      title: 'Net Balance',
      value: `₹${netBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: IndianRupee,
      color: netBalance >= 0 ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-rose-600 bg-rose-50 border-rose-100',
      description: 'Available capital status',
    },
    {
      title: 'Total Income',
      value: `₹${totalIncome.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: ArrowUpRight,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
      description: 'Incoming cash flow',
    },
    {
      title: 'Total Expenses',
      value: `₹${totalExpense.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: ArrowDownRight,
      color: 'text-rose-600 bg-rose-50 border-rose-100',
      description: 'Outgoing spendings',
    },
    {
      title: 'Transactions',
      value: transactionCount.toString(),
      icon: Activity,
      color: 'text-violet-600 bg-violet-50 border-violet-100',
      description: 'Total logged operations',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {cardData.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  {card.title}
                </span>
                <span className="text-2xl font-bold text-slate-900 tracking-tight block">
                  {card.value}
                </span>
              </div>
              <div className={`p-2.5 rounded-2xl border ${card.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
              {card.description}
            </div>
          </div>
        );
      })}
    </div>
  );
}
