"use client";

import { useEffect, useRef } from "react";
import { useCart } from "../context/CartContext";
import { useUser } from "@clerk/nextjs";

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
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold text-emerald-700">Order Successful 🎉</h1>
      <p className="mt-2 text-gray-600">
        Thank you {user?.username || user?.firstName || "Customer"} for purchasing!
      </p>
      <p className="mt-2 text-gray-600">
        Your Clerk user ID is: {user?.id}
      </p>
      <p className="mt-4 text-sm text-gray-500">
        You can continue browsing medicines or check your orders.
      </p>
    </div>
  );
}
