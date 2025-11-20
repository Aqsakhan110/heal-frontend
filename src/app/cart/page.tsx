// 


"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import { FaTrashAlt } from "react-icons/fa";
import { startCheckout } from "@/lib/checkout";

type CartItemFromDB = {
  _id: string;
  name: string;
  price: number; // PKR (whole rupees) in your DB
  qty: number;
  image: string;
};

export default function CartPage() {
  const { user } = useUser();
  const { removeItem, setCartItemsFromDB } = useCart();
  const [items, setItems] = useState<CartItemFromDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        if (!user?.id) return;
        const res = await fetch(`/api/cart?userId=${user.id}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setItems(data);
          setCartItemsFromDB(
            data.map((item: CartItemFromDB) => ({
              id: item._id || "",
              name: item.name || "Unnamed",
              price: item.price || 0,
              quantity: item.qty || 1,
              image: item.image || "/placeholder.jpg",
            }))
          );
        } else {
          setItems([]);
        }
      } catch {
        toast.error("Failed to load cart.");
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [user?.id, setCartItemsFromDB]);

  const deleteItem = async (id: string) => {
    try {
      const res = await fetch(`/api/cart/${id}`, { method: "DELETE" });
      if (res.ok) {
        setItems(prev => prev.filter(item => item._id !== id));
        removeItem(id);
        toast.success("Item removed from cart.");
      } else {
        toast.error("❌ Failed to delete item.");
      }
    } catch {
      toast.error("Something went wrong.");
    }
  };

  const updateQuantity = async (id: string, newQty: number) => {
    if (newQty < 1) return;
    try {
      const res = await fetch(`/api/cart/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qty: newQty }),
      });
      if (res.ok) {
        setItems(prev =>
          prev.map(item =>
            item._id === id ? { ...item, qty: newQty } : item
          )
        );
        toast.success("Quantity updated.");
      } else {
        toast.error("❌ Failed to update quantity.");
      }
    } catch {
      toast.error("Something went wrong.");
    }
  };

  const subtotal = items.reduce(
    (sum, item) => sum + (item.price || 0) * (item.qty || 0),
    0
  );
  const shipping = items.length > 0 ? 500 : 0;
  const tax = Math.round(subtotal * 0.05);
  const grandTotal = subtotal + shipping + tax;

  const handleCheckout = async () => {
    try {
      if (!user?.id) {
        toast.error("Please sign in to checkout.");
        return;
      }
      if (items.length === 0) {
        toast.error("Your cart is empty.");
        return;
      }
      setCheckingOut(true);

      // If using USD test mode: convert PKR totals to USD cents (example rate).
      // For now we pass per-item values. If your backend expects cents: multiply by 100.
      await startCheckout(
        items.map(item => ({
          name: item.name,
          // If currency is USD in backend: cents = PKR to USD (optional) then *100.
          // If you keep prices as PKR but still use USD in test, use a mock conversion to avoid $500 charges.
          // Simplest dev approach: treat `price` as cents in USD test mode:
          price: item.price, // if your backend expects cents, change to item.price * 100
          quantity: item.qty,
        }))
      );
    } catch (e: any) {
      toast.error(e.message || "Checkout failed.");
      setCheckingOut(false);
    }
  };

  if (loading) return <p className="pt-24 text-center">Loading cart...</p>;

  return (
    <motion.div
      className="pt-24 max-w-7xl mx-auto px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-3xl font-bold text-emerald-700 mb-8">Shopping Cart</h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Cart Items</h2>
        {items.length === 0 ? (
          <p className="text-gray-600">Your cart is empty.</p>
        ) : (
          items.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between border-b py-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image || "/placeholder.jpg"}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
                  onError={(e) => (e.currentTarget.src = "/placeholder.jpg")}
                />
                <div>
                  <p className="font-medium">{item.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={() => updateQuantity(item._id, item.qty - 1)}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      disabled={item.qty <= 1}
                    >
                      -
                    </button>
                    <span className="px-2">{item.qty}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.qty + 1)}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-emerald-700 font-bold">PKR {item.price}</p>
                  <p className="text-gray-600 text-sm">
                    Subtotal: PKR {(item.price || 0) * (item.qty || 0)}
                  </p>
                </div>
                <FaTrashAlt
                  className="text-red-500 cursor-pointer hover:text-red-700"
                  onClick={() => deleteItem(item._id)}
                  title="Delete item"
                />
              </div>
            </div>
          ))
        )}
      </div>

      {items.length > 0 && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Summary</h2>
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>PKR {subtotal}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Estimate Shipping</span>
            <span>PKR {shipping}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Tax (5%)</span>
            <span>PKR {tax}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total</span>
            <span>PKR {grandTotal}</span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={checkingOut}
            className="mt-6 w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {checkingOut ? "Redirecting to Stripe..." : "Proceed to Checkout"}
          </button>
        </div>
      )}
    </motion.div>
  );
}
