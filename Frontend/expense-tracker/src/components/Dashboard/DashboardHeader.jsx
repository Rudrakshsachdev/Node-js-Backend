import React from 'react';
import { Plus, RefreshCw } from 'lucide-react';

export default function DashboardHeader({ onRefresh, onAddTransaction }) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Overview</h1>
        <p className="text-sm text-slate-500 mt-1">Real-time status of your capital distribution</p>
      </div>
      
      <div className="flex items-center gap-3">
        <button
          onClick={onRefresh}
          className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-all active:scale-95"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
        <button
          onClick={onAddTransaction}
          className="bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl py-3 px-5 shadow-lg shadow-violet-500/10 flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Transaction
        </button>
      </div>
    </div>
  );
}
