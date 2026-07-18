import React from 'react';
import { X, Calendar, Tag, CreditCard, Clock, Info, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function TransactionDetailModal({ isOpen, onClose, expense }) {
  if (!isOpen || !expense) return null;

  const isIncome = expense.type === 'income';

  const formatFullDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Info className="w-5 h-5 text-violet-600" />
            Transaction Details
          </h3>
          <button onClick={onClose} className="p-1 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          
          {/* Main Stat Block */}
          <div className="text-center py-4 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              {expense.title}
            </span>
            <span className={`text-3xl font-extrabold mt-1 block tracking-tight ${isIncome ? 'text-emerald-600' : 'text-rose-600'}`}>
              {isIncome ? '+' : '-'}₹{expense.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className={`inline-flex items-center gap-1 mt-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
              isIncome 
                ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                : 'bg-rose-50 border-rose-100 text-rose-700'
            }`}>
              {isIncome ? 'Income' : 'Expense'}
            </span>
          </div>

          {/* Metadata Grid */}
          <div className="space-y-4 text-sm text-slate-600">
            
            {/* Category */}
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-400 font-medium flex items-center gap-2">
                <Tag className="w-4 h-4" /> Category
              </span>
              <span className="font-semibold text-slate-800 bg-slate-50 px-2.5 py-0.5 rounded-lg border border-slate-100">
                {expense.category}
              </span>
            </div>

            {/* Payment Method */}
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-400 font-medium flex items-center gap-2">
                <CreditCard className="w-4 h-4" /> Payment Method
              </span>
              <span className="font-semibold text-slate-800">
                {expense.paymentMethod}
              </span>
            </div>

            {/* Date */}
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-400 font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Date
              </span>
              <span className="font-semibold text-slate-800">
                {formatFullDate(expense.date)}
              </span>
            </div>

            {/* Created At */}
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-400 font-medium flex items-center gap-2">
                <Clock className="w-4 h-4" /> Logged On
              </span>
              <span className="font-semibold text-slate-800">
                {formatTimestamp(expense.createdAt)}
              </span>
            </div>

          </div>

          {/* Description Block */}
          {expense.description && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Description / Notes</label>
              <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl text-sm text-slate-700 leading-relaxed font-normal whitespace-pre-wrap">
                {expense.description}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 bg-slate-50 border-t border-slate-100">
          <button
            onClick={onClose}
            className="py-2 px-5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl transition-all active:scale-98"
          >
            Close Details
          </button>
        </div>

      </div>
    </div>
  );
}
