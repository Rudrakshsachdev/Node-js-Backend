import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Loader2, ArrowRight, CheckCircle2, AlertCircle, ShieldCheck, ArrowLeft } from 'lucide-react';

export default function VerifyOtp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Retrieve email from sessionStorage
  useEffect(() => {
    const savedEmail = sessionStorage.getItem('resetEmail');
    if (savedEmail) {
      setEmail(savedEmail);
    } else {
      setError('Session missing. Please request a new OTP first.');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim()) {
      setError('Email address is missing. Please restart recovery process.');
      return;
    }
    if (!otp.trim()) {
      setError('Please enter the OTP verification code.');
      return;
    }

    setIsLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/v1/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          otp: otp.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'OTP verification failed');
      }

      setSuccess('Verification successful! Proceeding to password reset...');
      
      // Store the resetToken to verify password change authority in next step
      if (data.resetToken) {
        sessionStorage.setItem('resetToken', data.resetToken);
      }

      setTimeout(() => {
        navigate('/auth/reset-password');
      }, 1500);

    } catch (err) {
      setError(err.message || 'Verification failed. Please verify the code and try again.');
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
            <ShieldCheck className="w-5.5 h-5.5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">ApexExpense</span>
        </div>

        <h2 className="text-center text-3xl font-extrabold tracking-tight text-slate-900">
          Verify OTP
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Enter the secure verification code sent to <span className="font-semibold text-slate-900">{email || 'your email'}</span>
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
            {/* OTP Code */}
            <div>
              <label htmlFor="otp" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Verification Code (OTP)
              </label>
              <div className="mt-1.5 relative group">
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => { setOtp(e.target.value); setError(''); }}
                  placeholder="e.g. 123456"
                  disabled={isLoading || !email}
                  className="block w-full text-center tracking-[0.25em] font-mono py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-lg text-slate-900 placeholder-slate-300 focus:outline-none focus:border-violet-600 focus:ring-1 focus:ring-violet-600 focus:bg-white transition-all duration-200"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading || !email}
                className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-violet-500/10 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-all duration-150 disabled:opacity-75 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Verifying OTP...
                  </>
                ) : (
                  <>
                    Verify OTP
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
              Resend OTP
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
