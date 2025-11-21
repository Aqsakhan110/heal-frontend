"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ShoppingCartIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { useCart } from "../context/CartContext";
import Fuse from "fuse.js";

const navItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/#about" },
  { name: "Doc", href: "/doctors" },
  { name: "Medicines", href: "/medicines" },
  { name: "Contact", href: "/#contact" },
   
];

export default function Header() {
  const { user } = useUser();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [medicines, setMedicines] = useState<any[]>([]);

  // Fetch medicines once for suggestions
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const res = await fetch("/api/medicines");
        const data = await res.json();
        setMedicines(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Failed to load medicines", e);
      }
    };
    fetchMedicines();
  }, []);

  // Fuse.js fuzzy search
  const fuse = useMemo(() => {
    return new Fuse(medicines, {
      keys: ["name", "description"],
      threshold: 0.3,
      ignoreLocation: true,
      minMatchCharLength: 2,
    });
  }, [medicines]);

  const suggestions =
    search.trim().length === 0
      ? []
      : fuse.search(search).map((r) => r.item);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/medicines?search=${encodeURIComponent(search)}`);
      setSearch("");
      setMenuOpen(false);
    }
  };

  return (
    <header className="bg-gradient-to-r from-emerald-700 via-teal-600 to-sky-600 text-white shadow-lg sticky top-0 w-full z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-2xl font-extrabold tracking-wide cursor-pointer hover:text-emerald-200 transition-colors"
          >
            HealSync
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          {navItems.map((item, idx) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
            >
              <Link
                href={item.href}
                className="font-medium hover:text-emerald-200 transition-colors duration-300"
              >
                {item.name}
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-5">
          {/* Desktop Search with suggestions */}
          <form onSubmit={handleSubmit} className="hidden md:block relative">
            <input
              type="text"
              placeholder="Search medicines..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-1.5 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />
            {search.trim() && (
              <ul className="absolute left-0 right-0 bg-white border rounded-lg mt-2 shadow-lg z-50 max-h-56 overflow-y-auto">
                {suggestions.slice(0, 6).map((m: any) => (
                  <li
                    key={m._id}
                    onClick={() => {
                      router.push(`/medicines?search=${encodeURIComponent(m.name)}`);
                      setSearch("");
                    }}
                    className="px-3 py-2 hover:bg-emerald-50 cursor-pointer text-black"
                  >
                    {m.name}
                  </li>
                ))}
                {suggestions.length === 0 && (
                  <li className="px-3 py-2 text-slate-500">No matches found</li>
                )}
              </ul>
            )}
          </form>

          {/* Cart Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative cursor-pointer hover:text-emerald-200 transition"
          >
            <Link href="/cart">
              <ShoppingCartIcon className="w-7 h-7" />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5 shadow-md">
                  {count}
                </span>
              )}
            </Link>
          </motion.div>

          {/* Auth */}
          <SignedIn>
            <div className="hidden md:flex items-center gap-4">
              <span className="font-medium">
                Hi, {user?.fullName || user?.primaryEmailAddress?.emailAddress}
              </span>
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>

          <SignedOut>
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/auth/login"
                className="hover:text-emerald-200 transition font-medium"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="bg-white text-emerald-700 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition font-semibold"
              >
                Signup
              </Link>
            </div>
          </SignedOut>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <XMarkIcon className="w-7 h-7" />
            ) : (
              <Bars3Icon className="w-7 h-7" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-emerald-800 px-6 py-6 space-y-4 rounded-b-lg shadow-lg">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="block text-white hover:text-emerald-200 font-medium"
              onClick={() => setMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}

          {/* Mobile Search with suggestions */}
          <form onSubmit={handleSubmit} className="relative mt-4">
            <input
              type="text"
              placeholder="Search medicines..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />
            {search.trim() && (
              <ul className="absolute left-0 right-0 bg-white border rounded-lg mt-2 shadow-lg z-50 max-h-56 overflow-y-auto">
                {suggestions.slice(0, 6).map((m: any) => (
                  <li
                    key={m._id}
                    onClick={() => {
                      router.push(`/medicines?search=${encodeURIComponent(m.name)}`);
                      setSearch("");
                      setMenuOpen(false);
                    }}
                    className="px-3 py-2 hover:bg-emerald-50 cursor-pointer text-black"
                  >
                    {m.name}
                  </li>
                ))}
                {suggestions.length === 0 && (
                  <li className="px-3 py-2 text-slate-500">No matches found</li>
                )}
              </ul>
            )}
          </form>

                    {/* Mobile Auth */}
          <SignedIn>
            <div className="mt-4 flex items-center gap-4">
              <span className="font-medium text-white">
                Hi, {user?.fullName || user?.primaryEmailAddress?.emailAddress}
              </span>
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>

          <SignedOut>
            <div className="mt-4 flex items-center gap-3">
              <Link
                href="/auth/login"
                className="hover:text-emerald-200 transition font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="bg-white text-emerald-700 px-3 py-2 rounded-lg hover:bg-gray-100 transition font-semibold"
                onClick={() => setMenuOpen(false)}
              >
                Signup
              </Link>
            </div>
          </SignedOut>
        </div>
      )}
    </header>
  );
}
