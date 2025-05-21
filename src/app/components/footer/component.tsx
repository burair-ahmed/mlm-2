'use client';

import { motion } from 'framer-motion';
import { Facebook, Instagram, Twitter, Mail, MapPin } from 'lucide-react';
import Link from 'next/link';

const footerLinks = [
  { title: 'About Us', href: '/about' },
  { title: 'Packages', href: '/packages' },
  { title: 'Referrals', href: '/referrals' },
  { title: 'Contact', href: '/contact-us' },
];

const socialLinks = [
  { icon: Facebook, href: 'https://facebook.com' },
  { icon: Instagram, href: 'https://instagram.com' },
  { icon: Twitter, href: 'https://twitter.com' },
];

const Footer = () => {
  return (
    <footer className="bg-[#3e362e] text-[#a69080] px-6 md:px-20 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand Section */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-[#ac8968]">Al Ashraf Holdings</h2>
          <p className="text-sm leading-relaxed text-[#a69080]">
            Trusted investment solutions in real estate and rental income. Empowering you to grow wealth with ease.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold text-[#ac8968] mb-3">Quick Links</h4>
          <ul className="space-y-2">
            {footerLinks.map((link) => (
              <li key={link.title}>
                <Link href={link.href} className="hover:text-[#ac8968] transition-colors duration-300">
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-lg font-semibold text-[#ac8968] mb-3">Contact Us</h4>
          <div className="space-y-2 text-sm">
            <p className="flex items-center gap-2"><Mail className="w-4 h-4" /> support@alashrafholdings.com</p>
            <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Karachi, Pakistan</p>
          </div>
        </div>

        {/* Social Links */}
        <div>
          <h4 className="text-lg font-semibold text-[#ac8968] mb-3">Follow Us</h4>
          <div className="flex gap-4">
            {socialLinks.map(({ icon: Icon, href }, i) => (
              <motion.a
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2 }}
                className="text-[#ac8968] hover:text-white transition"
              >
                <Icon className="w-5 h-5" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-12 border-t border-[#865d36]/30 pt-6 text-center text-sm text-[#93785b]">
        © {new Date().getFullYear()} Al Ashraf Holdings. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
