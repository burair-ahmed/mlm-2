"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User as UserIcon, LogOut, Wallet, CheckCircle, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../../../../context/AuthContext";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Investment Packages", href: "/our-packages" },
  { name: "Contact Us", href: "/contact-us" },
];

export default function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getKycBadge = (status?: string) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/25">
            <CheckCircle className="h-3 w-3" /> Verified
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/25">
            <Clock className="h-3 w-3" /> Pending
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-red-500/10 text-red-400 px-2 py-0.5 rounded-full border border-red-500/25">
            <AlertCircle className="h-3 w-3" /> Unverified
          </span>
        );
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-slate-950/70 border-b border-white/5 backdrop-blur-xl shadow-lg" 
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-12 h-16 md:h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/25 transition-transform duration-300 group-hover:scale-105">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Al Ashraf Holdings
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative text-sm font-medium transition-colors duration-300 py-1 ${
                  isActive ? "text-primary text-glow-emerald" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.name}
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-primary-foreground rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions / Profile */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-2xl py-1.5 pl-3 pr-4 transition-all duration-300 focus:outline-none"
              >
                <div className="h-8 w-8 rounded-xl overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center shrink-0">
                  {user.profilePicture ? (
                    <img src={user.profilePicture} alt="User Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <span className="text-sm font-semibold text-foreground max-w-[120px] truncate">
                  {user.fullName || "Account"}
                </span>
              </button>

              {/* Profile Dropdown Popover */}
              <AnimatePresence>
                {isDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 15, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-72 rounded-2xl border border-white/10 glass-panel shadow-2xl p-4 z-50 space-y-4"
                    >
                      {/* Dropdown Header */}
                      <div className="flex items-center gap-3 pb-3 border-b border-white/5">
                        <div className="h-10 w-10 rounded-xl overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center shrink-0">
                          {user.profilePicture ? (
                            <img src={user.profilePicture} alt="User Avatar" className="h-full w-full object-cover" />
                          ) : (
                            <UserIcon className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate text-foreground">{user.fullName}</p>
                          <p className="text-xs text-muted-foreground truncate mb-1">{user.email}</p>
                          {getKycBadge(user.kyc?.status)}
                        </div>
                      </div>

                      {/* Balances */}
                      <div className="grid grid-cols-2 gap-2 bg-white/5 p-3 rounded-xl border border-white/5">
                        <div className="space-y-0.5">
                          <p className="text-[10px] font-medium text-muted-foreground uppercase">Balance</p>
                          <p className="text-sm font-bold text-emerald-400">${user.balance?.toLocaleString()}</p>
                        </div>
                        <div className="space-y-0.5 border-l border-white/5 pl-3">
                          <p className="text-[10px] font-medium text-muted-foreground uppercase">Equity Units</p>
                          <p className="text-sm font-bold text-accent text-glow-gold">{user.equityUnits?.toLocaleString()}</p>
                        </div>
                      </div>

                      {/* Links */}
                      <div className="space-y-1">
                        <Link
                          href="/user"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground transition-all duration-300"
                        >
                          <Wallet className="h-4 w-4" /> Dashboard
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            setIsDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all duration-300 text-left"
                        >
                          <LogOut className="h-4 w-4" /> Log Out
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link 
                href="/login" 
                className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-primary hover:opacity-90 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-102"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden flex items-center gap-4">
          {user && (
            <Link 
              href="/user" 
              className="h-8 w-8 rounded-xl overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center"
            >
              {user.profilePicture ? (
                <img src={user.profilePicture} alt="User Avatar" className="h-full w-full object-cover" />
              ) : (
                <UserIcon className="h-4 w-4 text-muted-foreground" />
              )}
            </Link>
          )}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-xl bg-white/5 border border-white/5 text-foreground focus:outline-none"
            aria-label="Toggle Menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 top-16 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed top-16 left-0 right-0 glass-panel border-b border-white/5 shadow-2xl z-50 md:hidden overflow-hidden"
            >
              <div className="px-6 py-6 space-y-4">
                <nav className="flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className={`px-3 py-2 rounded-xl text-base font-semibold transition-all duration-200 ${
                        pathname === link.href 
                          ? "bg-primary/10 text-primary" 
                          : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>
                <div className="h-px bg-white/5" />
                {user ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center shrink-0">
                        {user.profilePicture ? (
                          <img src={user.profilePicture} alt="User Avatar" className="h-full w-full object-cover" />
                        ) : (
                          <UserIcon className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{user.fullName}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 bg-white/5 p-3 rounded-xl border border-white/5">
                      <div>
                        <p className="text-[10px] font-medium text-muted-foreground uppercase">Balance</p>
                        <p className="text-sm font-bold text-emerald-400">${user.balance}</p>
                      </div>
                      <div className="border-l border-white/5 pl-3">
                        <p className="text-[10px] font-medium text-muted-foreground uppercase">Equity Units</p>
                        <p className="text-sm font-bold text-accent">${user.equityUnits}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href="/user"
                        onClick={() => setMenuOpen(false)}
                        className="flex-1 bg-white/5 hover:bg-white/10 text-center py-2.5 rounded-xl text-sm font-semibold border border-white/5 transition-all duration-300"
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setMenuOpen(false);
                        }}
                        className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 py-2.5 rounded-xl text-sm font-semibold border border-red-500/15 transition-all duration-300"
                      >
                        Log Out
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/login"
                      onClick={() => setMenuOpen(false)}
                      className="w-full text-center py-2.5 border border-white/5 rounded-xl text-sm font-semibold text-muted-foreground hover:text-foreground transition-all duration-300"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMenuOpen(false)}
                      className="w-full text-center py-2.5 bg-primary hover:opacity-90 rounded-xl text-sm font-semibold text-white transition-all duration-300"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
