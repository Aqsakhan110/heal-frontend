"use client";

import { useCart } from "../context/CartContext";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import { useState } from "react";

export default function CheckoutPage() {
  const { user } = useUser();
  const { cartItems, total } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "cod">("stripe");

  const shipping = cartItems.length > 0 ? 500 : 0;
  const tax = Math.round(total * 0.05);
  const grandTotal = total + shipping + tax;

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          items: cartItems,
          total: grandTotal,
          method: paymentMethod,
        }),
      });

      const orderData = await res.json();
      if (!res.ok) {
        toast.error(orderData?.error || "Failed to place order.");
        return;
      }

      if (paymentMethod === "stripe") {
        const checkoutRes = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: cartItems.map(item => ({
              name: item.name,
              price: item.price * 100,
              quantity: item.quantity,
            })),
          }),
        });

        const { url } = await checkoutRes.json();
        if (!url) {
          toast.error("Stripe session creation failed.");
          return;
        }
        window.location.href = url;
      } else {
        const emailRes = await fetch("/api/send-cod-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user?.primaryEmailAddress?.emailAddress,
            name: user?.fullName || "Customer",
            total: grandTotal,
          }),
        });

        if (emailRes.ok) {
          toast.success("Order placed with Cash on Delivery! Confirmation email sent.");
          window.location.href = "/success";
        } else {
          toast.error("Order placed but failed to send email.");
        }
      }
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error("Something went wrong.");
    }
  };

  return (
    <main className="max-w-6xl mx-auto py-12 px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Left: Shipping Info */}
      <section className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
        <form onSubmit={placeOrder} className="space-y-4">
          {/* Name + Email */}
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              Full Name <span className="text-red-500">*</span>
              <input type="text" className="w-full border rounded p-2" required />
            </label>
            <label className="block">
              Email <span className="text-red-500">*</span>
              <input type="email" className="w-full border rounded p-2" required />
            </label>
          </div>

          {/* Phone with country code */}
          <label className="block">
            Phone Number <span className="text-red-500">*</span>
            <div className="flex gap-2">
              <select className="border rounded p-2 w-28" required>
                <option value="+92">🇵🇰 +92</option>
                <option value="+1">🇺🇸 +1</option>
                <option value="+44">🇬🇧 +44</option>
                <option value="+91">🇮🇳 +91</option>
                <option value="+61">🇦🇺 +61</option>
                <option value="+81">🇯🇵 +81</option>
                <option value="+49">🇩🇪 +49</option>
                <option value="+33">🇫🇷 +33</option>
                <option value="+971">🇦🇪 +971</option>
                <option value="+55">🇧🇷 +55</option>
                <option value="+27">🇿🇦 +27</option>
                {/* add more codes as needed */}
              </select>
              <input
                type="tel"
                placeholder="3001234567"
                className="flex-1 border rounded p-2"
                required
              />
            </div>
          </label>

          {/* Address */}
          <label className="block">
            Address <span className="text-red-500">*</span>
            <input type="text" className="w-full border rounded p-2" required />
          </label>

          {/* City + Postal */}
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              City <span className="text-red-500">*</span>
              <input type="text" className="w-full border rounded p-2" required />
            </label>
            <label className="block">
              Postal Code <span className="text-red-500">*</span>
              <input type="text" className="w-full border rounded p-2" required />
            </label>
          </div>

          {/* Country */}
          <label className="block">
            Country <span className="text-red-500">*</span>
            <select className="w-full border rounded p-2" required>
              <option value="">Select Country</option>
              <option value="PK">Pakistan</option>
              <option value="US">United States</option>
              <option value="UK">United Kingdom</option>
              <option value="IN">India</option>
              <option value="CA">Canada</option>
              <option value="AU">Australia</option>
              <option value="DE">Germany</option>
              <option value="FR">France</option>
              <option value="IT">Italy</option>
              <option value="JP">Japan</option>
              <option value="CN">China</option>
              <option value="SA">Saudi Arabia</option>
              <option value="AE">United Arab Emirates</option>
              <option value="BD">Bangladesh</option>
              <option value="NP">Nepal</option>
              <option value="LK">Sri Lanka</option>
              <option value="ZA">South Africa</option>
              <option value="BR">Brazil</option>
              <option value="RU">Russia</option>
              <option value="ES">Spain</option>
              <option value="MX">Mexico</option>
              {/* … add full list if needed */}
            </select>
          </label>

          {/* Payment Method */}
          <div className="space-y-2">
            <label className="block font-medium">Payment Method <span className="text-red-500">*</span></label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="stripe"
                  checked={paymentMethod === "stripe"}
                  onChange={() => setPaymentMethod("stripe")}
                />
                Stripe (Test)
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                />
                Cash on Delivery
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition"
          >
            Place Order
          </button>
        </form>
      </section>

      {/* Right: Order Summary */}
      <section className="bg-gray-50 shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <ul className="divide-y divide-gray-200 mb-4">
          {cartItems.map((item, idx) => (
            <li key={idx} className="flex items-center justify-between py-3">
              <div className="flex items-center space-x-3">
                <img
                  src={item.image || "/placeholder.png"}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded"
                />
                <span>{item.name} × {item.quantity}</span>
              </div>
              <span className="font-medium">PKR {item.price * item.quantity}</span>
            </li>
          ))}
        </ul>
               <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>PKR {total}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>PKR {shipping}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax (5%)</span>
            <span>PKR {tax}</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>PKR {grandTotal}</span>
          </div>
        </div>
      </section>
    </main>
  );
}

