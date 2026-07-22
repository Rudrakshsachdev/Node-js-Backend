import React from 'react';
import { Link } from 'react-router-dom';
import { IndianRupee, ShieldCheck, Heart, Globe, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white text-slate-600 mt-16 rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-100">
        {/* Brand & Mission */}
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-xl shadow-md shadow-violet-500/10">
              <IndianRupee className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">
              ApexExpense
            </span>
          </div>

          <p className="text-xs leading-relaxed text-slate-500 max-w-sm">
            Empowering students and professionals to master their financial growth through intelligent velocity analytics, pocket money allowance tracking, and automated forecasts.
          </p>

          <div className="flex items-center gap-2 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full w-fit">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Secure Financial Workspace
          </div>
        </div>

        {/* Navigation */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Navigation</h4>
          <ul className="space-y-2 text-xs font-medium text-slate-500">
            <li>
              <Link to="/dashboard" className="hover:text-violet-600 transition-colors">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/dashboard/transactions" className="hover:text-violet-600 transition-colors">
                Transactions
              </Link>
            </li>
            <li>
              <Link to="/dashboard/analytics" className="hover:text-violet-600 transition-colors">
                Analytics
              </Link>
            </li>
            <li>
              <Link to="/dashboard/forecast" className="hover:text-violet-600 transition-colors">
                Forecast Projections
              </Link>
            </li>
            <li>
              <Link to="/dashboard/allowance" className="hover:text-violet-600 transition-colors">
                Allowance Manager
              </Link>
            </li>
          </ul>
        </div>

        {/* Resources & Support */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Connect & Legal</h4>
          <ul className="space-y-2 text-xs font-medium text-slate-500">
            <li>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-violet-600 transition-colors inline-flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-slate-400" /> GitHub Repository <ArrowUpRight className="w-3 h-3 text-slate-400" />
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-violet-600 transition-colors">Privacy Policy</a>
            </li>
            <li>
              <a href="#" className="hover:text-violet-600 transition-colors">Terms of Service</a>
            </li>
            <li>
              <a href="#" className="hover:text-violet-600 transition-colors">Security Overview</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <p className="flex items-center gap-1">
          Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> for smart financial tracking.
        </p>

        <p>© {currentYear} ApexExpense Inc. All rights reserved.</p>
      </div>
    </footer>
  );
}
