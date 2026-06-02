"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import Link from "next/link";
import { Lock, Mail, Eye, EyeOff, TrendingUp } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/user");
    }
  }, [user, router]);

  if (user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(email, password);
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 relative overflow-hidden px-6">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-glow-emerald pointer-events-none opacity-30" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-glow-gold pointer-events-none opacity-20" />

      {/* Main card */}
      <div className="max-w-md w-full z-10 glass-panel rounded-3xl border border-white/10 p-8 shadow-2xl space-y-8">
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex items-center gap-2 group mx-auto">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/25">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Al Ashraf Holdings
            </span>
          </Link>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-foreground">Welcome Back</h2>
            <p className="text-xs text-muted-foreground">Sign in to manage your asset portfolios and referrals.</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-4 py-3 rounded-xl text-center">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Email input */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-bold text-muted-foreground uppercase">
              Email Address
            </label>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all duration-300"
              />
              <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="text-xs font-bold text-muted-foreground uppercase">
                Password
              </label>
            </div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all duration-300"
              />
              <Lock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground focus:outline-none"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-primary to-emerald-600 text-white font-bold text-sm rounded-xl transition-all duration-300 shadow-lg shadow-primary/25 hover:opacity-90 disabled:opacity-50 hover:scale-[1.01]"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="text-center text-xs text-muted-foreground pt-2">
          <span>Do not have an account? </span>
          <Link
            href="/register"
            className="font-bold text-primary hover:underline text-glow-emerald"
          >
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
}
