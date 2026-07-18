import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './components/Signup';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to /auth/onboarding */}
        <Route path="/" element={<Navigate to="/auth/onboarding" replace />} />
        
        {/* Signup Route */}
        <Route path="/auth/onboarding" element={<Signup />} />
        
        {/* Placeholder routes for navigation */}
        <Route 
          path="/login" 
          element={
            <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
              <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm text-center max-w-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Login Page Placeholder</h3>
                <p className="text-slate-500 text-sm mb-4">Login route is currently mapped to this placeholder.</p>
                <a href="/auth/onboarding" className="text-violet-600 font-semibold hover:underline">Go to Sign Up</a>
              </div>
            </div>
          } 
        />
        
        <Route 
          path="/dashboard" 
          element={
            <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
              <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm text-center max-w-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Welcome to your Dashboard!</h3>
                <p className="text-slate-500 text-sm mb-4">You have successfully registered and logged in.</p>
                <button 
                  onClick={() => {
                    localStorage.clear();
                    window.location.href = '/auth/onboarding';
                  }}
                  className="text-red-600 font-semibold hover:underline"
                >
                  Log Out
                </button>
              </div>
            </div>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
