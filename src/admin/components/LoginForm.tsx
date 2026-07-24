'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Lock, User, Eye, EyeOff, AlertCircle, Loader2, ShieldCheck } from 'lucide-react';

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    document.title = 'Admin Panel';
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || data.errors?.[0] || 'Invalid credentials. Please try again.');
        setLoading(false);
        return;
      }

      // Success - Redirect to Admin Dashboard
      router.push('/admin');
      router.refresh();
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA] px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Soft YFA Brand Mesh Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[60%] rounded-full bg-[#002B49]/10 blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[60%] rounded-full bg-[#00A79D]/10 blur-[130px]" />
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Card Container with YFA Navy & Gold accents */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-8 md:p-10 shadow-2xl shadow-slate-300/40 space-y-8">
          
          {/* YFA Branding & Logo Header */}
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="flex items-center gap-3 py-1">
              <div className="relative h-14 w-16 shrink-0">
                <Image
                  src="/logo.png"
                  alt="YF Advisors"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col justify-center leading-none select-none text-[#002B49]">
                <span className="font-serif text-[12px] font-bold tracking-[0.2em] uppercase mb-1">
                  Yours Faithfully
                </span>
                <div className="w-full h-[2px] bg-[#FDB913] rounded-full" />
                <span className="font-serif text-[12px] font-bold tracking-[0.2em] uppercase mt-1 text-center">
                  Advisors
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl font-bold font-serif text-[#002B49] tracking-tight">
                Admin Portal Login
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Enter your administrative credentials to continue
              </p>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
              <div className="flex-1">{error}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username / Admin ID */}
            <div className="space-y-1.5">
              <label htmlFor="username" className="block text-xs font-bold text-[#002B49] uppercase tracking-wider">
                Username / Admin ID
              </label>
              <div className="relative rounded-2xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter admin ID"
                  className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#002B49]/30 focus:border-[#002B49] focus:bg-white transition-all font-medium"
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-xs font-bold text-[#002B49] uppercase tracking-wider">
                Password
              </label>
              <div className="relative rounded-2xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full pl-10 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#002B49]/30 focus:border-[#002B49] focus:bg-white transition-all font-medium"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 transition-colors focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Sign In Button with YFA Navy #002B49 & Gold #FDB913 / Teal #00A79D hover */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-[#002B49] hover:bg-[#00A79D] text-white font-bold text-sm tracking-wide rounded-full shadow-lg shadow-[#002B49]/20 focus:outline-none focus:ring-2 focus:ring-[#002B49] focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-3"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#FDB913]" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="pt-2 text-center text-[11px] font-medium text-slate-400 tracking-wider uppercase">
            Protected Admin Portal • Yours Faithfully Advisors
          </div>

        </div>
      </div>
    </div>
  );
}
