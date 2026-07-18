import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import KpiCards from './KpiCards';
import RecentTransactions from './RecentTransactions';
import TransactionModal from './TransactionModal';
import { Plus, Tag, Loader2, RefreshCw } from 'lucide-react';

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal controllers
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

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

    // Refresh expenses
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

  // Calculate Category breakdown for visual indicator list
  const categorySummary = {};
  expenses
    .filter(e => e.type === 'expense')
    .forEach(e => {
      categorySummary[e.category] = (categorySummary[e.category] || 0) + e.amount;
    });

  const totalExpenseSum = Object.values(categorySummary).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Overview</h1>
            <p className="text-sm text-slate-500 mt-1">Real-time status of your capital distribution</p>
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

        {/* Loading / Error States */}
        {isLoading && expenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
            <span className="text-sm text-slate-500 font-medium">Fetching financials...</span>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl flex items-center gap-2 text-sm">
            <span>{error}</span>
          </div>
        ) : (
          <>
            {/* KPI Cards */}
            <KpiCards expenses={expenses} />

            {/* Content Details Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
              
              {/* Transactions Table (Left Col) */}
              <div className="xl:col-span-2">
                <RecentTransactions
                  expenses={expenses}
                  onEdit={openEditModal}
                  onDelete={handleDelete}
                />
              </div>

              {/* Category Breakdown (Right Col) */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-5">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Spending Category</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Top expense channels</p>
                </div>
                
                {Object.keys(categorySummary).length === 0 ? (
                  <div className="py-10 text-center text-slate-400 text-sm">
                    No expense logs to analyze
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(categorySummary)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 5)
                      .map(([category, amount]) => {
                        const percentage = totalExpenseSum > 0 ? (amount / totalExpenseSum) * 100 : 0;
                        return (
                          <div key={category} className="space-y-1.5">
                            <div className="flex justify-between text-sm font-semibold">
                              <span className="text-slate-700 flex items-center gap-1.5">
                                <Tag className="w-3.5 h-3.5 text-slate-400" />
                                {category}
                              </span>
                              <span className="text-slate-900">₹{amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-violet-600 to-indigo-500 h-full rounded-full transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>

            </div>
          </>
        )}

        {/* Modal */}
        <TransactionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddOrEdit}
          editingExpense={editingExpense}
        />

      </main>
    </div>
  );
}
