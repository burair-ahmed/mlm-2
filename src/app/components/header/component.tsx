'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, User } from 'lucide-react';
import Link from 'next/link';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Packages', href: '/packages' },
  { name: 'Referrals', href: '/referrals' },
  { name: 'Contact', href: '/contact-us' },
];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#3e362e]/95 shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-12 py-4 text-[#a69080]">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-[#ac8968]">
          Al Ashraf Holdings
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 text-sm">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="hover:text-white transition-colors duration-300"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right-side icons */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/user"
            className="px-4 py-2 rounded-xl bg-[#865d36] hover:bg-[#ac8968] transition text-white text-sm"
          >
            Dashboard
          </Link>
          <User className="w-5 h-5 hover:text-white transition" />
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle Menu">
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: 'auto' }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-[#3e362e] px-6 py-4 text-[#a69080]"
        >
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/user"
              className="mt-3 inline-block px-4 py-2 rounded-xl bg-[#865d36] hover:bg-[#ac8968] text-white text-sm"
            >
              Dashboard
            </Link>
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Header;
