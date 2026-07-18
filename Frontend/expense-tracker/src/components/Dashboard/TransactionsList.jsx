import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import TransactionModal from './TransactionModal';
import TransactionDetailModal from './TransactionDetailModal';
import { Search, SlidersHorizontal, Tag, CreditCard, Calendar, Plus, Edit2, Trash2, ArrowUpRight, ArrowDownRight, RefreshCw, Loader2 } from 'lucide-react';

const CATEGORIES = [
  'Food', 'Transportation', 'Shopping', 'Bills', 'Healthcare',
  'Entertainment', 'Education', 'Travel', 'Salary', 'Investment', 'Other'
];

const PAYMENT_METHODS = [
  'Cash', 'Credit Card', 'Debit Card', 'UPI', 'Net Banking', 'Wallet'
];

export default function TransactionsList() {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters and search states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPayment, setFilterPayment] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');

  // Modal controls
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [detailedExpense, setDetailedExpense] = useState(null);

  const fetchExpenses = async () => {
    setIsLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/auth/login';
        return;
      }

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/v1/expenses`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch expenses');
      }

      setExpenses(data.expenses || []);
    } catch (err) {
      setError(err.message || 'Connection to the API failed.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleAddOrEdit = async (formData) => {
    const token = localStorage.getItem('token');
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    const url = editingExpense 
      ? `${apiUrl}/api/v1/expenses/${editingExpense._id}`
      : `${apiUrl}/api/v1/expenses`;
    
    const method = editingExpense ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Action failed');
    }

    fetchExpenses();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

      const response = await fetch(`${apiUrl}/api/v1/expenses/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Deletion failed');
      }

      fetchExpenses();
    } catch (err) {
      alert(err.message);
    }
  };

  const openAddModal = () => {
    setEditingExpense(null);
    setIsModalOpen(true);
  };

  const openEditModal = (expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  // Filter & Sort computation
  const filteredExpenses = expenses
    .filter((e) => {
      const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (e.description && e.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesType = filterType === 'all' || e.type === filterType;
      const matchesCategory = filterCategory === 'all' || e.category === filterCategory;
      const matchesPayment = filterPayment === 'all' || e.paymentMethod === filterPayment;

      return matchesSearch && matchesType && matchesCategory && matchesPayment;
    })
    .sort((a, b) => {
      if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date);
      if (sortBy === 'amount-desc') return b.amount - a.amount;
      if (sortBy === 'amount-asc') return a.amount - b.amount;
      return 0;
    });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 p-8 overflow-y-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Transactions</h1>
            <p className="text-sm text-slate-500 mt-1">Detailed ledger of your earnings and spendings</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={fetchExpenses}
              className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-all active:scale-95"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button
              onClick={openAddModal}
              className="bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl py-3 px-5 shadow-lg shadow-violet-500/10 flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0 transition-all"
            >
              <Plus className="w-5 h-5" />
              Add Transaction
            </button>
          </div>
        </div>

        {/* Filter bar card */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <SlidersHorizontal className="w-4 h-4 text-slate-500" />
            <span>Search & Filters</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-600 focus:ring-1 focus:ring-violet-600 focus:bg-white transition-all"
              />
            </div>

            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm text-slate-700 focus:outline-none focus:border-violet-600 focus:ring-1 focus:ring-violet-600 focus:bg-white transition-all"
            >
              <option value="all">All Types</option>
              <option value="expense">Expenses Only</option>
              <option value="income">Income Only</option>
            </select>

            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm text-slate-700 focus:outline-none focus:border-violet-600 focus:ring-1 focus:ring-violet-600 focus:bg-white transition-all"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>

            {/* Payment Method Filter */}
            <select
              value={filterPayment}
              onChange={(e) => setFilterPayment(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm text-slate-700 focus:outline-none focus:border-violet-600 focus:ring-1 focus:ring-violet-600 focus:bg-white transition-all"
            >
              <option value="all">All Payments</option>
              {PAYMENT_METHODS.map(pm => <option key={pm} value={pm}>{pm}</option>)}
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm text-slate-700 focus:outline-none focus:border-violet-600 focus:ring-1 focus:ring-violet-600 focus:bg-white transition-all"
            >
              <option value="date-desc">Newest Date</option>
              <option value="date-asc">Oldest Date</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="amount-asc">Lowest Amount</option>
            </select>

          </div>
        </div>

        {/* Detailed Ledger List */}
        {isLoading && expenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
            <span className="text-sm text-slate-500 font-medium">Loading ledger...</span>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl text-sm">
            {error}
          </div>
        ) : (
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
            {filteredExpenses.length === 0 ? (
              <div className="py-16 text-center text-slate-400 text-sm">
                No matching transactions found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                      <th className="pb-3 pl-2">Title / Note</th>
                      <th className="pb-3">Category</th>
                      <th className="pb-3">Payment</th>
                      <th className="pb-3">Date</th>
                      <th className="pb-3 text-right pr-2">Amount</th>
                      <th className="pb-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredExpenses.map((expense) => {
                      const isIncome = expense.type === 'income';

                      return (
                        <tr 
                          key={expense._id} 
                          className="hover:bg-slate-50/50 group transition-colors duration-150 cursor-pointer"
                        >
                          {/* Title & Description */}
                          <td className="py-4 pl-2" onClick={() => setDetailedExpense(expense)}>
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
                                  <span className="text-xs text-slate-500 truncate max-w-sm block">
                                    {expense.description}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-4" onClick={() => setDetailedExpense(expense)}>
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border bg-slate-50 text-slate-700 border-slate-200/60">
                              <Tag className="w-3.5 h-3.5 text-slate-400" />
                              {expense.category}
                            </span>
                          </td>

                          {/* Payment Method */}
                          <td className="py-4" onClick={() => setDetailedExpense(expense)}>
                            <span className="text-sm text-slate-600 flex items-center gap-1.5">
                              <CreditCard className="w-4 h-4 text-slate-400" />
                              {expense.paymentMethod}
                            </span>
                          </td>

                          {/* Date */}
                          <td className="py-4" onClick={() => setDetailedExpense(expense)}>
                            <span className="text-sm text-slate-600 font-medium flex items-center gap-1.5">
                              <Calendar className="w-4 h-4 text-slate-400" />
                              {formatDate(expense.date)}
                            </span>
                          </td>

                          {/* Amount */}
                          <td className="py-4 text-right pr-2" onClick={() => setDetailedExpense(expense)}>
                            <span className={`font-extrabold text-sm ${isIncome ? 'text-emerald-600' : 'text-rose-600'}`}>
                              {isIncome ? '+' : '-'}₹{expense.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-4 text-center">
                            <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openEditModal(expense);
                                }}
                                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all"
                              >
                               <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(expense._id);
                                }}
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
        )}

        {/* Modal */}
        <TransactionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddOrEdit}
          editingExpense={editingExpense}
        />

        {/* Detail Modal component */}
        <TransactionDetailModal
          isOpen={!!detailedExpense}
          onClose={() => setDetailedExpense(null)}
          expense={detailedExpense}
        />

      </main>
    </div>
  );
}
