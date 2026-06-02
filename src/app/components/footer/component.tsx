"use client";

import { motion } from "framer-motion";
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const footerLinks = [
  { title: "Home", href: "/" },
  { title: "About Us", href: "/about" },
  { title: "Investment Packages", href: "/our-packages" },
  { title: "Contact Us", href: "/contact-us" },
];

const socialLinks = [
  { icon: Facebook, href: "https://facebook.com", color: "hover:text-[#1877F2] hover:bg-[#1877F2]/10" },
  { icon: Instagram, href: "https://instagram.com", color: "hover:text-[#E4405F] hover:bg-[#E4405F]/10" },
  { icon: Twitter, href: "https://twitter.com", color: "hover:text-[#1DA1F2] hover:bg-[#1DA1F2]/10" },
];

export default function Footer() {
  return (
    <footer className="relative bg-slate-950 border-t border-white/5 overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute -bottom-48 -right-48 w-96 h-96 rounded-full bg-glow-emerald pointer-events-none opacity-40" />
      <div className="absolute -top-48 -left-48 w-96 h-96 rounded-full bg-glow-gold pointer-events-none opacity-20" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-20 grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
        {/* Brand Column */}
        <div className="space-y-4 md:pr-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/25">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Al Ashraf Holdings
            </span>
          </Link>
          <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
            Leading-edge ethical, halal investment solutions backed by real assets and transparent performance metrics. Grow your wealth with confidence.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-5">Quick Links</h4>
          <ul className="space-y-3">
            {footerLinks.map((link) => (
              <li key={link.title}>
                <Link
                  href={link.href}
                  className="group flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
                >
                  <span>{link.title}</span>
                  <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-5">Contact Us</h4>
          <ul className="space-y-3.5 text-sm text-muted-foreground">
            <li className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-primary shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <a href="mailto:support@alashrafholdings.com" className="hover:text-foreground transition-colors duration-300">
                support@alashrafholdings.com
              </a>
            </li>
            <li className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-primary shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <a href="tel:+9221111123456" className="hover:text-foreground transition-colors duration-300">
                +92 21 111-123-456
              </a>
            </li>
            <li className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-primary shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <span>Karachi, Pakistan</span>
            </li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-5">Follow Us</h4>
          <div className="flex gap-3">
            {socialLinks.map(({ icon: Icon, href, color }, i) => (
              <motion.a
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                className={`h-9 w-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all duration-300 ${color}`}
              >
                <Icon className="w-4 h-4" />
              </motion.a>
            ))}
          </div>
          <div className="mt-6 bg-white/5 p-4 rounded-xl border border-white/5">
            <p className="text-[11px] font-semibold text-accent uppercase tracking-wider mb-1 text-glow-gold">Halal Certified</p>
            <p className="text-[11px] text-muted-foreground leading-normal">
              Our investments adhere strictly to sharia principles and ethical standards.
            </p>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="relative z-10 border-t border-white/5 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Al Ashraf Holdings. All rights reserved. Made for premium growth.
      </div>
    </footer>
  );
}
