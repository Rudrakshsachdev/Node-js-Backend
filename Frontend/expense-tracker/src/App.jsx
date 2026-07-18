import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './components/Signup/Signup';
import Login from './components/Login/Login';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import VerifyOtp from './components/VerifyOtp/VerifyOtp';
import ResetPassword from './components/ResetPassword/ResetPassword';
import Dashboard from './components/Dashboard/Dashboard';
import TransactionsList from './components/Dashboard/TransactionsList';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to /auth/onboarding */}
        <Route path="/" element={<Navigate to="/auth/onboarding" replace />} />
        
        {/* Auth Routes */}
        <Route path="/auth/onboarding" element={<Signup />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/verify-otp" element={<VerifyOtp />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />
        
        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/transactions" element={<TransactionsList />} />
        
        {/* Fallback navigation redirects to onboarding */}
        <Route path="*" element={<Navigate to="/auth/onboarding" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
