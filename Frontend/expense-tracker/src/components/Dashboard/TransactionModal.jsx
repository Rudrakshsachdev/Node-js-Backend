import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';

const CATEGORIES = [
  'Food', 'Transportation', 'Shopping', 'Bills', 'Healthcare',
  'Entertainment', 'Education', 'Travel', 'Salary', 'Investment', 'Other'
];

const PAYMENT_METHODS = [
  'Cash', 'Credit Card', 'Debit Card', 'UPI', 'Net Banking', 'Wallet'
];

export default function TransactionModal({ isOpen, onClose, onSubmit, editingExpense = null }) {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: 'expense',
    category: 'Food',
    paymentMethod: 'Cash',
    date: new Date().toISOString().split('T')[0],
    description: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Load existing expense for editing mode
  useEffect(() => {
    if (editingExpense) {
      setFormData({
        title: editingExpense.title,
        amount: editingExpense.amount,
        type: editingExpense.type,
        category: editingExpense.category,
        paymentMethod: editingExpense.paymentMethod,
        date: new Date(editingExpense.date).toISOString().split('T')[0],
        description: editingExpense.description || '',
      });
    } else {
      setFormData({
        title: '',
        amount: '',
        type: 'expense',
        category: 'Food',
        paymentMethod: 'Cash',
        date: new Date().toISOString().split('T')[0],
        description: '',
      });
    }
    setError('');
  }, [editingExpense, isOpen]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!formData.amount || isNaN(formData.amount) || Number(formData.amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setIsLoading(true);

    try {
      await onSubmit({
        ...formData,
        amount: Number(formData.amount),
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit transaction');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">
            {editingExpense ? 'Edit Transaction' : 'New Transaction'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error alert */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-800 text-sm rounded-xl">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Weekly Groceries"
              className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-600 focus:ring-1 focus:ring-violet-600 focus:bg-white transition-all duration-150"
              disabled={isLoading}
              required
            />
          </div>

          {/* Type Selector (Income / Expense) */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Transaction Type
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'expense' })}
                className={`py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                  formData.type === 'expense'
                    ? 'bg-rose-50 border-rose-200 text-rose-700 ring-1 ring-rose-500/20'
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'income' })}
                className={`py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                  formData.type === 'income'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700 ring-1 ring-emerald-500/20'
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                Income
              </button>
            </div>
          </div>

          {/* Amount & Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Amount (₹)
              </label>
              <input
                type="number"
                name="amount"
                step="0.01"
                min="0.01"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-600 focus:ring-1 focus:ring-violet-600 focus:bg-white transition-all duration-150"
                disabled={isLoading}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-sm text-slate-900 focus:outline-none focus:border-violet-600 focus:ring-1 focus:ring-violet-600 focus:bg-white transition-all duration-150"
                disabled={isLoading}
                required
              />
            </div>
          </div>

          {/* Category & Payment Method */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-sm text-slate-900 focus:outline-none focus:border-violet-600 focus:ring-1 focus:ring-violet-600 focus:bg-white transition-all duration-150"
                disabled={isLoading}
              >
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Payment Method
              </label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-sm text-slate-900 focus:outline-none focus:border-violet-600 focus:ring-1 focus:ring-violet-600 focus:bg-white transition-all duration-150"
                disabled={isLoading}
              >
                {PAYMENT_METHODS.map(pm => <option key={pm} value={pm}>{pm}</option>)}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={2}
              placeholder="Optional notes..."
              className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-2 px-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-600 focus:ring-1 focus:ring-violet-600 focus:bg-white transition-all duration-150 resize-none"
              disabled={isLoading}
            />
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl py-2.5 px-5 shadow-lg shadow-violet-500/10 flex items-center gap-2 transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Transaction'
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
