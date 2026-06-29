"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "../../../../context/AuthContext";
import Link from "next/link";
import { Lock, Mail, Eye, EyeOff, TrendingUp, ArrowRight, Star, ShieldCheck, Sparkles, Users, User as UserIcon, Key } from "lucide-react";

interface AuthPageContentProps {
  initialMode: "login" | "register";
}

export default function AuthPageContent({ initialMode }: AuthPageContentProps) {
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [isFading, setIsFading] = useState(false);

  // Login states
  const [loginEmail, setLoginEmail] = useState("Burair@example.com");
  const [loginPassword, setLoginPassword] = useState("password123");

  // Register states
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerFullName, setRegisterFullName] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerReferralCode, setRegisterReferralCode] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { user, login } = useAuth();
  const router = useRouter();

  // Handle direct navigation mode change
  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  // Load referral code from URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const refCode = urlParams.get("ref");
      if (refCode) {
        setRegisterReferralCode(refCode.toUpperCase());
      }
    }
  }, []);

  // Redirect if logged in
  useEffect(() => {
    if (user) {
      router.push("/user");
    }
  }, [user, router]);

  if (user) {
    return null;
  }

  const handleModeToggle = (targetMode: "login" | "register") => {
    setIsFading(true);
    setTimeout(() => {
      setMode(targetMode);
      setError("");
      // Update browser URL query or state silently if desired
      if (typeof window !== "undefined") {
        const newPath = targetMode === "login" ? "/login" : "/register";
        window.history.pushState(null, "", newPath + window.location.search);
      }
      setIsFading(false);
    }, 200);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(loginEmail, loginPassword);
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: registerEmail,
          password: registerPassword,
          fullName: registerFullName,
          userName: registerUsername,
          referralCode: registerReferralCode,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Registration failed");
      }

      await login(registerEmail, registerPassword);
      router.push("/user");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col lg:flex-row overflow-hidden relative font-sans">
      {/* Left Column - Showcase */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[40%] flex-col justify-between p-12 bg-slate-950 border-r border-white/5 relative overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-80" />
        
        {/* Glowing gradients */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-amber-500/5 blur-[100px] pointer-events-none" />

        {/* Branding header */}
        <Link href="/" className="flex items-center gap-2.5 group relative z-10">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-amber-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 transition-transform duration-300 group-hover:scale-105">
            <TrendingUp className="h-5.5 w-5.5 text-slate-950 stroke-[2.5]" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-amber-400 bg-clip-text text-transparent tracking-wide">
            Al Ashraf Holdings
          </span>
        </Link>

        {/* Showcase Center Content */}
        <div className="relative z-10 my-auto space-y-12">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
              <Sparkles className="h-3.5 w-3.5" />
              Secure Portfolio Management
            </div>
            <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight tracking-tight">
              Invest with <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-400 bg-clip-text text-transparent">
                Absolute Confidence
              </span>
            </h1>
            <p className="text-slate-400 text-sm xl:text-base leading-relaxed max-w-sm">
              Manage your assets, track high-yield packages, and grow your wealth through our dual-commission affiliate hierarchy.
            </p>
          </div>

          {/* Interactive Mock Dashboard Preview */}
          <div className="relative">
            {/* Main glass card */}
            <div className="w-[340px] xl:w-[380px] bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl relative z-10 transition-all duration-500 hover:border-emerald-500/20">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-xs text-slate-400">Total Portfolio Value</span>
                  <h3 className="text-2xl font-bold text-white mt-1">$48,259.40</h3>
                </div>
                <span className="bg-emerald-500/10 text-emerald-400 text-xs font-semibold px-2 py-1 rounded-lg flex items-center gap-1 border border-emerald-500/20">
                  +14.2% <ArrowRight className="h-3 w-3 -rotate-45" />
                </span>
              </div>

              {/* Graphic/Chart Wave representation */}
              <div className="h-16 w-full mb-6 relative">
                <svg viewBox="0 0 300 80" className="w-full h-full text-emerald-500" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(16, 185, 129, 0.25)" />
                      <stop offset="100%" stopColor="rgba(16, 185, 129, 0)" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0 60 Q 30 50, 60 55 T 120 40 T 180 48 T 240 25 T 300 15"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_6px_rgba(16,185,129,0.5)]"
                  />
                  <path
                    d="M0 60 Q 30 50, 60 55 T 120 40 T 180 48 T 240 25 T 300 15 L 300 80 L 0 80 Z"
                    fill="url(#chartGradient)"
                  />
                </svg>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5 text-xs">
                <div>
                  <span className="text-slate-500 block mb-1">Direct Referrals</span>
                  <span className="text-white font-semibold flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-emerald-400" /> 18 Active
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-1">Weekly Payout</span>
                  <span className="text-white font-semibold flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-amber-400" /> Fully Secured
                  </span>
                </div>
              </div>
            </div>

            {/* Overlapping secondary card */}
            <div className="absolute -bottom-6 -right-6 bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-xl z-20 w-[180px] hidden xl:block transition-all duration-500 hover:border-amber-500/20">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Commission Earned</span>
              <span className="text-lg font-bold text-amber-400 mt-1 flex items-center gap-1">
                +$854.20
              </span>
              <div className="w-full bg-white/5 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-amber-400 h-full w-[70%] rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer info/ratings */}
        <div className="relative z-10 space-y-4">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <p className="text-xs text-slate-400 leading-relaxed italic max-w-xs">
            {"\"A seamless investment and tracking platform. Al Ashraf Holdings is our primary partner in securing yields.\""}
          </p>
          <div className="text-[10px] text-slate-500 font-semibold tracking-widest uppercase">
            ESTABLISHED IN 2024
          </div>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-12 relative bg-slate-950">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-70 pointer-events-none" />
        
        {/* Glowing effects */}
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md space-y-8 z-10">
          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl space-y-6 relative overflow-hidden">
            {/* Highlight line on top border */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />
            
            <div className="text-center space-y-2">
              {/* Mobile-only logo */}
              <div className="lg:hidden flex justify-center mb-4">
                <Link href="/" className="inline-flex items-center gap-2 group">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-amber-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                    <TrendingUp className="h-5.5 w-5.5 text-slate-950 stroke-[2.5]" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-amber-400 bg-clip-text text-transparent">
                    Al Ashraf Holdings
                  </span>
                </Link>
              </div>
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs px-4 py-3.5 rounded-xl text-center flex items-center justify-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping" />
                {error}
              </div>
            )}

            {/* Fade Animation Container */}
            <div className={`transition-all duration-200 ease-out ${isFading ? "opacity-0 scale-[0.97]" : "opacity-100 scale-100"}`}>
              {mode === "login" ? (
                /* LOGIN FORM */
                <div className="space-y-6">
                  <div className="text-center space-y-1">
                    <h2 className="text-3xl font-extrabold text-white tracking-tight">Welcome Back</h2>
                    <p className="text-xs text-slate-400">Sign in to manage your asset portfolios and referrals</p>
                  </div>

                  <form className="space-y-5" onSubmit={handleLoginSubmit}>
                    {/* Email */}
                    <div className="space-y-1.5">
                      <label htmlFor="loginEmail" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Email Address
                      </label>
                      <div className="relative flex items-center">
                        <input
                          id="loginEmail"
                          type="email"
                          required
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder="email@example.com"
                          className="peer w-full bg-slate-950/60 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all duration-300"
                        />
                        <Mail className="absolute left-4 h-4.5 w-4.5 text-slate-500 peer-focus:text-emerald-400 transition-colors duration-300" />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                      <label htmlFor="loginPassword" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Password
                      </label>
                      <div className="relative flex items-center">
                        <input
                          id="loginPassword"
                          type={showPassword ? "text" : "password"}
                          required
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="••••••••"
                          className="peer w-full bg-slate-950/60 border border-white/10 rounded-xl pl-11 pr-10 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all duration-300"
                        />
                        <Lock className="absolute left-4 h-4.5 w-4.5 text-slate-500 peer-focus:text-emerald-400 transition-colors duration-300" />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 text-slate-500 hover:text-slate-300 transition-colors duration-200 focus:outline-none"
                        >
                          {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Keep me signed in */}
                    <div className="flex items-center justify-between text-xs pt-1">
                      <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-300 select-none">
                        <input
                          type="checkbox"
                          className="accent-emerald-500 rounded border-white/10 bg-slate-950/60"
                        />
                        Keep me signed in
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full relative group overflow-hidden py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold text-sm rounded-xl transition-all duration-300 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/25 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
                    >
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-emerald-400 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <span className="relative flex items-center justify-center gap-2 text-slate-950 font-extrabold tracking-wide uppercase">
                        {loading ? (
                          <>
                            <svg className="animate-spin h-5 w-5 text-slate-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Signing in...
                          </>
                        ) : (
                          <>
                            Sign In <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                          </>
                        )}
                      </span>
                    </button>
                  </form>

                  <div className="text-center text-xs text-slate-400 pt-2 border-t border-white/5">
                    <span>Do not have an account? </span>
                    <button
                      type="button"
                      onClick={() => handleModeToggle("register")}
                      className="font-bold text-emerald-400 hover:text-emerald-300 transition-colors duration-200 text-glow-emerald focus:outline-none"
                    >
                      Register Here
                    </button>
                  </div>
                </div>
              ) : (
                /* REGISTER FORM */
                <div className="space-y-6">
                  <div className="text-center space-y-1">
                    <h2 className="text-3xl font-extrabold text-white tracking-tight">Create Account</h2>
                    <p className="text-xs text-slate-400">Join thousands of partners growing asset-backed wealth</p>
                  </div>

                  <form className="space-y-4" onSubmit={handleRegisterSubmit}>
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label htmlFor="fullName" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Full Name
                      </label>
                      <div className="relative flex items-center">
                        <input
                          id="fullName"
                          type="text"
                          required
                          value={registerFullName}
                          onChange={(e) => setRegisterFullName(e.target.value)}
                          placeholder="John Doe"
                          className="peer w-full bg-slate-950/60 border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all duration-300"
                        />
                        <UserIcon className="absolute left-4 h-4.5 w-4.5 text-slate-500 peer-focus:text-emerald-400 transition-colors duration-300" />
                      </div>
                    </div>

                    {/* Username */}
                    <div className="space-y-1.5">
                      <label htmlFor="username" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Username
                      </label>
                      <div className="relative flex items-center">
                        <input
                          id="username"
                          type="text"
                          required
                          value={registerUsername}
                          onChange={(e) => setRegisterUsername(e.target.value)}
                          placeholder="johndoe12"
                          className="peer w-full bg-slate-950/60 border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all duration-300"
                        />
                        <UserIcon className="absolute left-4 h-4.5 w-4.5 text-slate-500 peer-focus:text-emerald-400 transition-colors duration-300" />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label htmlFor="registerEmail" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Email Address
                      </label>
                      <div className="relative flex items-center">
                        <input
                          id="registerEmail"
                          type="email"
                          required
                          value={registerEmail}
                          onChange={(e) => setRegisterEmail(e.target.value)}
                          placeholder="email@example.com"
                          className="peer w-full bg-slate-950/60 border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all duration-300"
                        />
                        <Mail className="absolute left-4 h-4.5 w-4.5 text-slate-500 peer-focus:text-emerald-400 transition-colors duration-300" />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                      <label htmlFor="registerPassword" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Password
                      </label>
                      <div className="relative flex items-center">
                        <input
                          id="registerPassword"
                          type={showPassword ? "text" : "password"}
                          required
                          value={registerPassword}
                          onChange={(e) => setRegisterPassword(e.target.value)}
                          placeholder="••••••••"
                          className="peer w-full bg-slate-950/60 border border-white/10 rounded-xl pl-11 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all duration-300"
                        />
                        <Lock className="absolute left-4 h-4.5 w-4.5 text-slate-500 peer-focus:text-emerald-400 transition-colors duration-300" />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 text-slate-500 hover:text-slate-300 transition-colors duration-200 focus:outline-none"
                        >
                          {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Referral Code */}
                    <div className="space-y-1.5">
                      <label htmlFor="referralCode" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Referral Code (Optional)
                      </label>
                      <div className="relative flex items-center">
                        <input
                          id="referralCode"
                          type="text"
                          value={registerReferralCode}
                          onChange={(e) => setRegisterReferralCode(e.target.value.toUpperCase())}
                          placeholder="REF12345"
                          maxLength={8}
                          pattern="[A-Z0-9]{8}"
                          className="peer w-full bg-slate-950/60 border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all duration-300"
                        />
                        <Key className="absolute left-4 h-4.5 w-4.5 text-slate-500 peer-focus:text-emerald-400 transition-colors duration-300" />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full relative group overflow-hidden py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold text-sm rounded-xl transition-all duration-300 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/25 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
                    >
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-emerald-400 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <span className="relative flex items-center justify-center gap-2 text-slate-950 font-extrabold tracking-wide uppercase">
                        {loading ? (
                          <>
                            <svg className="animate-spin h-5 w-5 text-slate-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Registering...
                          </>
                        ) : (
                          <>
                            Create Account <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                          </>
                        )}
                      </span>
                    </button>
                  </form>

                  <div className="text-center text-xs text-slate-400 pt-2 border-t border-white/5">
                    <span>Already have an account? </span>
                    <button
                      type="button"
                      onClick={() => handleModeToggle("login")}
                      className="font-bold text-emerald-400 hover:text-emerald-300 transition-colors duration-200 text-glow-emerald focus:outline-none"
                    >
                      Login Here
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
