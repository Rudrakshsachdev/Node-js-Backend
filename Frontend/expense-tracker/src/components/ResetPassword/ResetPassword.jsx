import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, Loader2, ArrowRight, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Retrieve resetToken from sessionStorage
  useEffect(() => {
    const savedToken = sessionStorage.getItem('resetToken');
    if (savedToken) {
      setResetToken(savedToken);
    } else {
      setError('Session missing or expired. Please restart the password reset process.');
    }
  }, []);

  const validateForm = () => {
    if (newPassword.length < 7) {
      return "Password must be at least 7 characters long";
    }
    if (newPassword !== confirmPassword) {
      return "Passwords do not match";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!resetToken) {
      setError('Session expired. Please request a new OTP.');
      return;
    }

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/v1/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resetToken,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }

      setSuccess('Your password has been successfully reset! Redirecting to login...');
      
      // Clean up session parameters
      sessionStorage.removeItem('resetEmail');
      sessionStorage.removeItem('resetToken');

      setTimeout(() => {
        navigate('/auth/login');
      }, 1500);

    } catch (err) {
      setError(err.message || 'Something went wrong. Please request a new OTP and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 opacity-30 pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[400px] h-[400px] rounded-full bg-violet-300 blur-[80px]" />
        <div className="absolute top-[-5%] right-[20%] w-[350px] h-[350px] rounded-full bg-emerald-200 blur-[80px]" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        {/* Brand Logo/Icon */}
        <div className="flex justify-center items-center gap-2.5 mb-6">
          <div className="p-2.5 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-xl shadow-md shadow-violet-500/10">
            <Lock className="w-5.5 h-5.5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">ApexExpense</span>
        </div>

        <h2 className="text-center text-3xl font-extrabold tracking-tight text-slate-900">
          New Password
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Please enter your secure new password below
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-100/60 rounded-3xl border border-slate-200/60 sm:px-10">
          
          {error && (
            <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl text-sm animate-in fade-in duration-200">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 flex items-start gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-sm animate-in fade-in duration-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* New Password */}
            <div>
              <label htmlFor="newPassword" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                New Password
              </label>
              <div className="mt-1.5 relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-600 transition-colors duration-150">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="newPassword"
                  name="newPassword"
                  type={showPassword ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value); setError(''); }}
                  placeholder="Min. 7 characters"
                  disabled={isLoading || !resetToken}
                  className="block w-full pl-11 pr-10 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-600 focus:ring-1 focus:ring-violet-600 focus:bg-white transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Confirm Password
              </label>
              <div className="mt-1.5 relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-600 transition-colors duration-150">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                  placeholder="••••••••"
                  disabled={isLoading || !resetToken}
                  className="block w-full pl-11 pr-10 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-600 focus:ring-1 focus:ring-violet-600 focus:bg-white transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading || !resetToken}
                className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-violet-500/10 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-all duration-150 disabled:opacity-75 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Resetting password...
                  </>
                ) : (
                  <>
                    Update Password
                    <ArrowRight className="w-4.5 h-4.5" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Navigation Links */}
          <div className="mt-6 text-center text-sm border-t border-slate-100 pt-6">
            <Link to="/auth/forgot-password" className="inline-flex items-center gap-2 font-semibold text-slate-600 hover:text-violet-600 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Request new OTP
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
