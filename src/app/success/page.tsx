"use client";

import { useEffect, useRef } from "react";
import { useCart } from "../context/CartContext";
import { useUser } from "@clerk/nextjs";
import Link from "next/link"; // ✅ import Link for navigation

export default function SuccessPage() {
  const { clearCart } = useCart();
  const { user } = useUser();
  const cleared = useRef(false);

  useEffect(() => {
    if (!cleared.current) {
      clearCart(); // ✅ clear cart safely after render
      cleared.current = true;
    }
  }, [clearCart]);

  return (
    <main className="bg-white min-h-screen text-gray-800 px-6">
      {/* ✅ Push content a little below navbar */}
      <div className="max-w-lg mx-auto mt-20 text-center shadow-lg rounded-xl p-10 border border-gray-200">
        <h1 className="text-3xl font-extrabold text-emerald-700 mb-4">
          Order Successful 🎉
        </h1>

        <p className="mt-2 text-gray-700">
          Thank you {user?.username || user?.firstName || "Customer"} for purchasing!
        </p>
        <p className="mt-2 text-gray-700">
          Your user ID is: <span className="font-semibold">{user?.id}</span>
        </p>

        <p className="mt-6 text-sm text-gray-500">
          You can continue browsing medicines or check your orders anytime.
        </p>

        {/* ✅ Track Order Link */}
        <div className="mt-6">
          <Link
            href="/track-order"
            className="inline-block bg-emerald-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition duration-200"
          >
            Track Your Order
          </Link>
        </div>
      </div>
    </main>
  );
}
