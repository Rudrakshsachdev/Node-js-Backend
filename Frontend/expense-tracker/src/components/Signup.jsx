import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Password complexity checks
  const isMinLength = formData.password.length >= 7;
  const isMatch = formData.password && formData.password === formData.confirmPassword;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) return "Full name is required";
    if (!formData.email.trim()) return "Email address is required";
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return "Please enter a valid email address";
    
    if (!isMinLength) {
      return "Password must be at least 7 characters";
    }
    
    if (!isMatch) {
      return "Passwords do not match";
    }
    
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/v1/auth/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setSuccess('Account created successfully! Preparing your dashboard...');
      
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (err) {
      setError(err.message || 'Failed to connect to the server. Please ensure the backend is running.');
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

      {/* Main Container */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        {/* Brand/Logo */}
        <div className="flex justify-center items-center gap-2.5 mb-6">
          <div className="p-2 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-xl shadow-md shadow-violet-500/10">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-1.957-.659-1.171-.879-1.171-2.303 0-3.182 1.172-.879 3.07-.879 4.242 0L15 8.818M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">ApexExpense</span>
        </div>

        <h2 className="text-center text-3xl font-extrabold tracking-tight text-slate-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Start tracking, optimizing, and growing your wealth
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-100/60 rounded-3xl border border-slate-200/60 sm:px-10">
          
          {/* Notification Alerts */}
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
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Full Name
              </label>
              <div className="mt-1.5 relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-600 transition-colors duration-150">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  disabled={isLoading}
                  className="block w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-600 focus:ring-1 focus:ring-violet-600 focus:bg-white transition-all duration-200"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Email Address
              </label>
              <div className="mt-1.5 relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-600 transition-colors duration-150">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  disabled={isLoading}
                  className="block w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-600 focus:ring-1 focus:ring-violet-600 focus:bg-white transition-all duration-200"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Password
              </label>
              <div className="mt-1.5 relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-600 transition-colors duration-150">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  disabled={isLoading}
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
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  disabled={isLoading}
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

            {/* Realtime Checklist */}
            {formData.password && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${isMinLength ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  <span className={isMinLength ? 'text-emerald-700 font-medium' : 'text-slate-500'}>
                    At least 7 characters
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${isMatch ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  <span className={isMatch ? 'text-emerald-700 font-medium' : 'text-slate-500'}>
                    Passwords match
                  </span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-violet-500/10 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-all duration-150 disabled:opacity-75 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Free Account
                    <ArrowRight className="w-4.5 h-4.5" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Alternative Auth Option */}
          <div className="mt-6 text-center text-sm border-t border-slate-100 pt-6">
            <span className="text-slate-500">Already have an account?</span>{' '}
            <Link to="/login" className="font-semibold text-violet-600 hover:text-violet-500 transition-colors">
              Log in
            </Link>
          </div>

        </div>

        {/* Form Trust footer */}
        <div className="mt-6 flex justify-center items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4.5 h-4.5 text-slate-400" />
          <span>SSL Secure & Encrypted Registration</span>
        </div>
      </div>
    </div>
  );
}
