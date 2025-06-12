'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/user');
    }
  }, [user, router]);

  if (user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
    } catch (_err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#a69080]">
      <div className="max-w-md w-full space-y-8 p-8 bg-[#3e362e] rounded-2xl shadow-2xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
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
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-[#865d36] rounded-md bg-[#a69080] text-[#3e362e] placeholder-[#93785b] focus:outline-none focus:ring-2 focus:ring-[#ac8968] focus:border-[#ac8968] sm:text-sm"
              />
            </div>
          </div>

          {error && (
            <div className="text-[#ac8968] text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#865d36] hover:bg-[#ac8968] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ac8968] disabled:opacity-50 transition-all duration-300"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>

        <div className="text-center text-sm mt-4">
          <span className="text-[#a69080]">Don&apos;t have an account? </span>
          <Link 
            href="/register"
            className="font-medium text-[#ac8968] hover:text-white transition-colors duration-200"
          >
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
