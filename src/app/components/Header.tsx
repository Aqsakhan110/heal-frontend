"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ShoppingCartIcon,
  Bars3Icon,
  XMarkIcon,
  UserIcon,
  MagnifyingGlassIcon,
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { useCart } from "../context/CartContext"; 
import Fuse, { FuseResult } from "fuse.js"; 

interface Medicine {
  _id: string;
  name: string;
  description: string;
}

const navItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/#about" },
  { name: "Doctors", href: "/doctors" },
  { name: "Medicines", href: "/medicines" },
  { name: "Contact us", href: "/#contact" },
];

export default function Header() {
  const { user } = useUser();
  const router = useRouter();
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll listener for sticky header
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch medicines
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const res = await fetch("/api/medicines");
        const data: Medicine[] = await res.json();
        setMedicines(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Failed to load medicines", e);
      }
    };
    fetchMedicines();
  }, []);

  // Fuse.js search
  const fuse = useMemo(() => {
    return new Fuse(medicines, {
      keys: ["name", "description"],
      threshold: 0.3,
      ignoreLocation: true,
      minMatchCharLength: 2,
    });
  }, [medicines]);

  const suggestions = useMemo(() => {
    if (search.trim().length === 0) return [];
    const results = fuse.search(search) as FuseResult<Medicine>[];
    return results.map((r) => r.item);
  }, [search, fuse]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/medicines?search=${encodeURIComponent(search)}`);
      setSearch("");
      setSearchOpen(false);
      setMenuOpen(false);
    }
  };

  const headerClasses = `sticky top-0 w-full z-50 transition-all duration-300 ${
    isScrolled ? "bg-teal-800/95 shadow-xl backdrop-blur-md" : "bg-teal-700 shadow-lg"
  } text-white`;

  const linkClass = "font-medium hover:text-emerald-300 transition-colors duration-300";

  return (
    <motion.header
      className={headerClasses}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-3xl font-extrabold tracking-wide cursor-pointer text-emerald-300 hover:text-white transition-colors"
          >
            HealSync
          </motion.div>
        </Link>

        {/* --- Desktop Navigation --- */}
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex space-x-8">
            {navItems.map((item, idx) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
                whileHover={{ scale: 1.1, color: "#a7f3d0" }}
              >
                <Link href={item.href} className={linkClass}>{item.name}</Link>
              </motion.div>
            ))}
          </nav>

          {/* Desktop Search */}
          <div className="relative">
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Search medicines..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-3 py-1.5 rounded-full text-gray-900 border border-teal-500 focus:outline-none focus:ring-2 focus:ring-emerald-300 w-48 transition-all duration-300"
              />
            </form>
            {search.trim() && (
              <ul className="absolute left-0 right-0 bg-white border border-teal-200 rounded-lg mt-2 shadow-xl z-50 max-h-56 overflow-y-auto">
                {suggestions.slice(0, 6).map((m) => (
                  <li
                    key={m._id}
                    onClick={() => {
                      router.push(`/medicines?search=${encodeURIComponent(m.name)}`);
                      setSearch("");
                    }}
                    className="px-4 py-2 hover:bg-teal-50 cursor-pointer text-gray-800 transition-colors"
                  >
                    {m.name}
                  </li>
                ))}
                {suggestions.length === 0 && <li className="px-4 py-2 text-slate-500">No matches found</li>}
              </ul>
            )}
          </div>

          {/* Cart */}
          <motion.div whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.9 }} className="relative cursor-pointer hover:text-emerald-300 transition">
            <Link href="/cart">
              <ShoppingCartIcon className="w-7 h-7" />
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5 shadow-md"
                >
                  {count}
                </motion.span>
              )}
            </Link>
          </motion.div>

          {/* Auth */}
          <SignedIn>
            <div className="flex items-center gap-4">
              <span className="font-light text-sm">Hi, {user?.firstName || "User"}</span>
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>
          <SignedOut>
            <div className="flex items-center gap-4 text-sm font-medium">
              <Link href="/auth/login" className="text-white hover:text-emerald-300 transition">Login</Link>
              <span className="text-teal-400">|</span>
              <Link href="/auth/register" className="text-white hover:text-emerald-300 transition">Signup</Link>
            </div>
          </SignedOut>
        </div>

        {/* --- Mobile Icons --- */}
        <div className="flex items-center gap-4 md:hidden">
          {/* Search Icon */}
          <button onClick={() => setSearchOpen(!searchOpen)} className="hover:text-emerald-300 transition">
            <MagnifyingGlassIcon className="w-6 h-6" />
          </button>

          {/* Cart Icon */}
          <Link href="/cart" className="relative hover:text-emerald-300 transition">
            <ShoppingCartIcon className="w-6 h-6" />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 shadow-md">{count}</span>
            )}
          </Link>

          {/* Hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="hover:text-emerald-300 transition">
            {menuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* --- Mobile Search Bar --- */}
      {searchOpen && (
        <div className="md:hidden px-6 pb-3 relative">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Search medicines..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 rounded-full text-gray-900 border border-teal-500 focus:outline-none focus:ring-2 focus:ring-emerald-300 transition-all duration-300"
            />
          </form>
          {search.trim() && (
            <ul className="absolute left-0 right-0 bg-white border border-teal-200 rounded-lg mt-2 shadow-xl z-50 max-h-56 overflow-y-auto">
              {suggestions.slice(0, 5).map((m) => (
                <li
                  key={m._id}
                  onClick={() => {
                    router.push(`/medicines?search=${encodeURIComponent(m.name)}`);
                    setSearch("");
                    setSearchOpen(false);
                    setMenuOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-teal-50 cursor-pointer text-gray-800 transition-colors"
                >
                  {m.name}
                </li>
              ))}
              {suggestions.length === 0 && (
                <li className="px-4 py-2 text-slate-500">No matches found</li>
              )}
            </ul>
          )}
        </div>
      )}

      {/* --- Mobile Menu --- */}
      {menuOpen && (
        <motion.div
          className="md:hidden bg-teal-800 p-6"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "tween", duration: 0.3 }}
        >
          <nav className="flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-white hover:text-emerald-300 font-medium py-2 px-2 rounded transition-colors text-lg"
                onClick={() => setMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="mt-6 flex flex-col gap-4">
            <SignedOut>
              <Link href="/auth/login" className="flex items-center justify-center gap-2 w-full bg-emerald-500 text-white px-3 py-3 rounded-lg hover:bg-emerald-600 transition font-semibold text-base shadow-md" onClick={() => setMenuOpen(false)}>
                <ArrowRightStartOnRectangleIcon className="w-5 h-5" /> Login
              </Link>
              <Link href="/auth/register" className="flex items-center justify-center gap-2 w-full bg-teal-600 text-white px-3 py-3 rounded-lg hover:bg-teal-700 transition font-semibold text-base shadow-md" onClick={() => setMenuOpen(false)}>
                <UserIcon className="w-5 h-5" /> Create Account
              </Link>
            </SignedOut>
            <SignedIn>
              <div className="flex items-center justify-between pt-4 border-t border-teal-700">
                <div className="flex items-center gap-3">
                  <UserButton afterSignOutUrl="/" />
                  <span className="font-medium text-white text-lg">Hi, {user?.firstName || "User"}</span>
                </div>
              </div>
            </SignedIn>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
