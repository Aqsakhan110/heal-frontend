"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FaFacebook, FaTwitter, FaInstagram, FaEnvelope, FaPhone } from "react-icons/fa";
import { useState } from "react";
import toast from "react-hot-toast";

const footerLinks = [
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms of Service", href: "/terms" },
  { name: "Support", href: "/support" },
];

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      toast.success("Thanks for subscribing to HealSync! You’ll be notified with all updates.");
      setEmail("");
    } else {
      toast.error("Please enter a valid email.");
    }
  };

  return (
    <footer className="bg-gradient-to-r from-emerald-700 via-teal-700 to-sky-700 text-white">
      <div className="max-w-7xl mx-auto px-8 py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">

        {/* Brand / Logo */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center md:items-start text-center md:text-left"
        >
          <Link href="/" className="flex items-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl font-extrabold tracking-wide cursor-pointer"
            >
              HealSync
            </motion.div>
          </Link>
          <p className="mt-3 text-base text-emerald-100 max-w-xs sm:max-w-sm md:max-w-md">
            Care made simple, accessible, and secure.  
            Empowering healthcare across Pakistan.
          </p>
        </motion.div>

        {/* Footer Links */}
        <motion.nav
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex flex-col items-center md:items-start space-y-3 md:space-y-4 text-center md:text-left"
        >
          <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
          {footerLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="hover:text-sky-300 transition-colors text-base font-medium"
            >
              {link.name}
            </Link>
          ))}
        </motion.nav>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex flex-col items-center md:items-start space-y-3 text-center md:text-left"
        >
          <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
          <Link
            href="https://mail.google.com/mail/?view=cm&fs=1&to=support@healsync.com"
            target="_blank"
            className="flex items-center gap-2 text-emerald-100 hover:text-sky-300"
          >
            <FaEnvelope /> support@healsync.com
          </Link>

          <Link
            href="https://wa.me/923410233773"
            target="_blank"
            className="flex items-center gap-2 text-emerald-100 hover:text-sky-300"
          >
            <FaPhone /> +92 341 0233773
          </Link>
          <p className="text-emerald-100">Karachi, Pakistan</p>
        </motion.div>

        {/* Newsletter + Social */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex flex-col items-center md:items-start space-y-4 text-center md:text-left"
        >
          <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
          <form onSubmit={handleSubscribe} className="flex w-full max-w-sm">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-l-lg text-gray-900 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-sky-400 hover:bg-sky-500 text-gray-900 px-4 py-2 rounded-r-lg font-semibold transition"
            >
              Subscribe
            </button>
          </form>

          {/* Social Icons */}
          <div className="flex space-x-6 mt-4">
            <Link href="https://facebook.com" target="_blank">
              <FaFacebook className="w-7 h-7 hover:text-sky-300 transition-transform transform hover:scale-110" />
            </Link>
            <Link href="https://twitter.com" target="_blank">
              <FaTwitter className="w-7 h-7 hover:text-sky-300 transition-transform transform hover:scale-110" />
            </Link>
            <Link href="https://instagram.com" target="_blank">
              <FaInstagram className="w-7 h-7 hover:text-sky-300 transition-transform transform hover:scale-110" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Bottom Line */}
      <div className="text-center py-6 border-t border-teal-400/40 text-base text-emerald-100">
        © {new Date().getFullYear()} HealSync. All rights reserved.
      </div>
    </footer>
  );
}
