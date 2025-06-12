'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [userName, setUsername] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    if (refCode) {
      setReferralCode(refCode.toUpperCase());
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName, userName, referralCode }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed');
      }

      await login(email, password);
      router.push('/user');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#a69080]">
      <div className="max-w-md w-full space-y-8 p-8 bg-[#3e362e] rounded-2xl shadow-2xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Create new account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-[#ac8968]">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-[#865d36] rounded-md bg-[#a69080] text-[#3e362e] placeholder-[#93785b] focus:outline-none focus:ring-2 focus:ring-[#ac8968] focus:border-[#ac8968] sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-[#ac8968]">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={userName}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-[#865d36] rounded-md bg-[#a69080] text-[#3e362e] placeholder-[#93785b] focus:outline-none focus:ring-2 focus:ring-[#ac8968] focus:border-[#ac8968] sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#ac8968]">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-[#865d36] rounded-md bg-[#a69080] text-[#3e362e] placeholder-[#93785b] focus:outline-none focus:ring-2 focus:ring-[#ac8968] focus:border-[#ac8968] sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#ac8968]">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-[#865d36] rounded-md bg-[#a69080] text-[#3e362e] placeholder-[#93785b] focus:outline-none focus:ring-2 focus:ring-[#ac8968] focus:border-[#ac8968] sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="referralCode" className="block text-sm font-medium text-[#ac8968]">
                Referral Code (optional)
              </label>
              <input
                id="referralCode"
                name="referralCode"
                type="text"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                className="mt-1 block w-full px-4 py-2 border border-[#865d36] rounded-md bg-[#a69080] text-[#3e362e] placeholder-[#93785b] focus:outline-none focus:ring-2 focus:ring-[#ac8968] focus:border-[#ac8968] sm:text-sm"
                maxLength={8}
                pattern="[A-Z0-9]{8}"
              />
            </div>
          </div>

          {error && <div className="text-[#ac8968] text-sm text-center">{error}</div>}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 rounded-md text-sm font-medium text-white bg-[#865d36] hover:bg-[#ac8968] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ac8968] disabled:opacity-50 transition-all duration-300"
            >
              {loading ? 'Registering...' : 'Create Account'}
            </button>
          </div>
        </form>

        <div className="text-center text-sm mt-4">
          <span className="text-[#a69080]">Already have an account? </span>
          <Link 
            href="/login"
            className="font-medium text-[#ac8968] hover:text-white transition-colors duration-200"
          >
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
}
