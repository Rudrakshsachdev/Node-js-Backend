import React, { useState, useEffect } from 'react';
import Sidebar from '../Dashboard/Sidebar';
import IncomeExpenseTrend from './IncomeExpenseTrend';
import CategoryDistribution from './CategoryDistribution';
import SavingsTrend from './SavingsTrend';
import PaymentMethodUsage from './PaymentMethodUsage';
import CumulativeSpending from './CumulativeSpending';
import DailyLimitTracker from './DailyLimitTracker';
import ExpenseVsBudget from './ExpenseVsBudget';
import { Loader2, RefreshCw, BarChart3 } from 'lucide-react';

export default function AnalyticsPage() {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

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

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8 overflow-y-auto space-y-6 sm:space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <BarChart3 className="w-8 h-8 text-violet-600" />
              Financial Analytics
            </h1>
            <p className="text-sm text-slate-500 mt-1">Detailed statistical insights into your spending habits and capital savings</p>
          </div>
          
          <button
            onClick={fetchExpenses}
            className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-all active:scale-95"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* Loading / Error States */}
        {isLoading && expenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
            <span className="text-sm text-slate-500 font-medium">Compiling financial metrics...</span>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl text-sm">
            <span>{error}</span>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Row 1: Trend & Donut Share */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <IncomeExpenseTrend expenses={expenses} />
              </div>
              <div>
                <CategoryDistribution expenses={expenses} />
              </div>
            </div>

            {/* Row 2: Daily Limit Tracker & Expenses vs Budget */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <DailyLimitTracker expenses={expenses} />
              <ExpenseVsBudget expenses={expenses} />
            </div>

            {/* Row 3: Savings & Payment share */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <SavingsTrend expenses={expenses} />
              <PaymentMethodUsage expenses={expenses} />
            </div>

            {/* Row 4: Cumulative Spend (Full width) */}
            <CumulativeSpending expenses={expenses} />

          </div>
        )}

      </main>
    </div>
  );
}
