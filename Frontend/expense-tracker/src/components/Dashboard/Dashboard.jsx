import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';
import KpiCards from './KpiCards';
import DailySpendingCard from './DailySpendingCard';
import BudgetProgressCard from './BudgetProgressCard';
import RecentTransactions from './RecentTransactions';
import CategoryBreakdown from './CategoryBreakdown';
import PaymentMethodsBreakdown from './PaymentMethodsBreakdown';
import TransactionModal from './TransactionModal';
import Footer from './Footer';
import { Loader2 } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8 overflow-y-auto space-y-6 sm:space-y-8">
        
        {/* Header Component */}
        <DashboardHeader
          onRefresh={fetchExpenses}
          onAddTransaction={openAddModal}
        />

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
            {/* KPI Cards Component */}
            <KpiCards expenses={expenses} />

            {/* Sub-KPI insights (Daily Spending & Budget Progress side-by-side) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DailySpendingCard expenses={expenses} />
              <BudgetProgressCard expenses={expenses} />
            </div>

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

              {/* breakdowns (Right Col) */}
              <div className="space-y-6">
                <CategoryBreakdown expenses={expenses} />
                <PaymentMethodsBreakdown expenses={expenses} />
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

        {/* Footer */}
        <Footer />

      </main>
    </div>
  );
}
