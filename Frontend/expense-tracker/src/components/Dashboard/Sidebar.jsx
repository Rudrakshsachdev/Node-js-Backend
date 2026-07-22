import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutGrid, ArrowLeftRight, PieChart, LineChart, PiggyBank, LogOut, IndianRupee, User, Menu, X, Briefcase } from 'lucide-react';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : { name: 'User', email: 'user@example.com' };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutGrid },
    { name: 'Transactions', path: '/dashboard/transactions', icon: ArrowLeftRight },
    { name: 'Analytics', path: '/dashboard/analytics', icon: PieChart },
    { name: 'Forecast', path: '/dashboard/forecast', icon: LineChart },
    { name: 'Allowance', path: '/dashboard/allowance', icon: PiggyBank },
    { name: 'Freelance Projects', path: '/dashboard/freelance', icon: Briefcase },
  ];

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/auth/login';
  };

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Top Header / Navigation Toggle Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200/80 px-4 flex items-center justify-between z-40">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-xl shadow-md shadow-violet-500/10">
            <IndianRupee className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-base font-bold tracking-tight text-slate-900">
            ApexExpense
          </span>
        </div>

        <button
          onClick={toggleSidebar}
          aria-label="Toggle Navigation Menu"
          className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors focus:outline-none"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-white text-slate-700 flex flex-col border-r border-slate-200/80 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand area */}
        <div className="p-6 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-xl shadow-md shadow-violet-500/10">
              <IndianRupee className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">
              ApexExpense
            </span>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === '/dashboard'}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 border ${
                    isActive
                      ? 'bg-violet-50/50 border-violet-100/60 text-violet-600'
                      : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  }`
                }
              >
                <Icon className="w-4.5 h-4.5" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* User profile / Footer */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 p-2 rounded-2xl bg-slate-50 mb-3 border border-slate-100">
            <div className="w-9 h-9 rounded-full bg-violet-100 border border-violet-200/50 flex items-center justify-center shrink-0">
              <User className="w-4.5 h-4.5 text-violet-600" />
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold text-slate-800 truncate">{user.name}</h4>
              <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-4.5 h-4.5" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
