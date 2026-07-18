import React from 'react';
import { Edit2, Trash2, ArrowUpRight, ArrowDownRight, Tag, CreditCard } from 'lucide-react';

const CATEGORY_COLORS = {
  Food: 'bg-amber-50 text-amber-700 border-amber-100',
  Transportation: 'bg-blue-50 text-blue-700 border-blue-100',
  Shopping: 'bg-purple-50 text-purple-700 border-purple-100',
  Bills: 'bg-rose-50 text-rose-700 border-rose-100',
  Healthcare: 'bg-teal-50 text-teal-700 border-teal-100',
  Entertainment: 'bg-pink-50 text-pink-700 border-pink-100',
  Education: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  Travel: 'bg-cyan-50 text-cyan-700 border-cyan-100',
  Salary: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  Investment: 'bg-sky-50 text-sky-700 border-sky-100',
  Other: 'bg-slate-50 text-slate-700 border-slate-100',
};

export default function RecentTransactions({ expenses = [], onEdit, onDelete }) {
  const latestExpenses = expenses.slice(0, 5); // display latest 5 transactions

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Recent Transactions</h3>
          <p className="text-xs text-slate-500 mt-0.5">Your latest financial logs</p>
        </div>
      </div>

      {latestExpenses.length === 0 ? (
        <div className="py-12 text-center text-slate-400 text-sm">
          No transactions logged yet. Add your first transaction above!
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <th className="pb-3 pl-2">Details</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Payment</th>
                <th className="pb-3">Date</th>
                <th className="pb-3 text-right pr-2">Amount</th>
                <th className="pb-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {latestExpenses.map((expense) => {
                const colorClass = CATEGORY_COLORS[expense.category] || 'bg-slate-50 text-slate-700 border-slate-100';
                const isIncome = expense.type === 'income';

                return (
                  <tr key={expense._id} className="hover:bg-slate-50/50 group transition-colors duration-150">
                    {/* Title */}
                    <td className="py-4 pl-2">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl border ${
                          isIncome
                            ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                            : 'bg-rose-50 border-rose-100 text-rose-600'
                        }`}>
                          {isIncome ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900 text-sm block">
                            {expense.title}
                          </span>
                          {expense.description && (
                            <span className="text-xs text-slate-500 truncate max-w-xs block">
                              {expense.description}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${colorClass}`}>
                        <Tag className="w-3 h-3" />
                        {expense.category}
                      </span>
                    </td>

                    {/* Payment Method */}
                    <td className="py-4">
                      <span className="text-sm text-slate-600 flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                        {expense.paymentMethod}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-4">
                      <span className="text-sm text-slate-600 font-medium">
                        {formatDate(expense.date)}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="py-4 text-right pr-2">
                      <span className={`font-bold text-sm ${isIncome ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {isIncome ? '+' : '-'}₹{expense.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 text-center">
                      <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                        <button
                          onClick={() => onEdit(expense)}
                          className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDelete(expense._id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
