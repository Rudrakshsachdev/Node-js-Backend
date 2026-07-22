import React from 'react';
import { Plus, RefreshCw } from 'lucide-react';

export default function DashboardHeader({ onRefresh, onAddTransaction }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Overview</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Real-time status of your capital distribution</p>
      </div>
      
      <div className="flex items-center gap-2.5">
        <button
          onClick={onRefresh}
          className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-all active:scale-95 shrink-0"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
        <button
          onClick={onAddTransaction}
          className="flex-1 sm:flex-none justify-center bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm rounded-xl py-2.5 px-4 shadow-lg shadow-violet-500/10 flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0 transition-all"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>Add Transaction</span>
        </button>
      </div>
    </div>
  );
}
