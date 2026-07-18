import React from 'react';
import { CreditCard } from 'lucide-react';

export default function PaymentMethodsBreakdown({ expenses = [] }) {
  const methodSummary = {};
  expenses
    .filter(e => e.type === 'expense')
    .forEach(e => {
      methodSummary[e.paymentMethod] = (methodSummary[e.paymentMethod] || 0) + e.amount;
    });

  const totalExpenseSum = Object.values(methodSummary).reduce((a, b) => a + b, 0);

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-5">
      <div>
        <h3 className="text-lg font-bold text-slate-900">Payment Channels</h3>
        <p className="text-xs text-slate-500 mt-0.5">Expenses by payment method</p>
      </div>
      
      {Object.keys(methodSummary).length === 0 ? (
        <div className="py-10 text-center text-slate-400 text-sm">
          No payment logs to analyze
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(methodSummary)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([method, amount]) => {
              const percentage = totalExpenseSum > 0 ? (amount / totalExpenseSum) * 100 : 0;
              return (
                <div key={method} className="space-y-1.5">
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="text-slate-700 flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                      {method}
                    </span>
                    <span className="text-slate-900">₹{amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
