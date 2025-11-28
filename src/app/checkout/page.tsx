"use client";

import { useCart } from "../context/CartContext";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import { useState } from "react";
import { FaMoneyBillAlt, FaCreditCard } from "react-icons/fa";

const inputStyle =
  "border border-gray-300 rounded-lg p-3 focus:ring-emerald-500 focus:border-emerald-500 transition duration-150";

export default function CheckoutPage() {
  const { user } = useUser();
  const { cartItems, total } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "cod">("stripe");

  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.primaryEmailAddress?.emailAddress || "",
    phoneCode: "+92",
    phoneNumber: "",
    address: "",
    city: "",
    postalCode: "",
    country: "PK",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Shipping fee set to 250 PKR if cart has items
  const shipping = cartItems.length > 0 ? 250 : 0;
  const tax = Math.round(total * 0.05);
  const grandTotal = total + shipping + tax;

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    if (!formData.fullName || !formData.address || !formData.city || !formData.country) {
      toast.error("Please fill in all required shipping fields.");
      return;
    }

    try {
      // Save order in DB
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          items: cartItems,
          total: grandTotal,
          method: paymentMethod,
          shippingDetails: formData,
        }),
      });

      const orderData = await res.json();
      if (!res.ok) {
        toast.error(orderData?.error || "Failed to place order.");
        return;
      }

      if (paymentMethod === "stripe") {
        // Stripe Checkout
        const checkoutRes = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: cartItems.map(item => ({
              name: item.name,
              price: Math.round(item.price * 100), // PKR → paisa
              quantity: item.quantity,
            })),
            shipping: shipping * 100, // PKR → paisa
            tax: tax * 100,           // PKR → paisa
          }),
        });

        const { url } = await checkoutRes.json();
        if (!url) {
          toast.error("Stripe session creation failed.");
          return;
        }
        window.location.href = url;
      } else {
        // COD flow
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
          toast.success(
            "Order placed with Cash on Delivery! Confirmation email sent."
          );
          window.location.href = "/success";
        } else {
          toast.error("Order placed but failed to send email.");
        }
      }
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error("Something went wrong during checkout.");
    }
  };

  return (
    <main className="min-h-screen pt-20 pb-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-emerald-800 mb-8 text-center">
          Finalize Your Order
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Shipping & Payment */}
          <section className="md:col-span-2 bg-white shadow-xl rounded-xl p-4 sm:p-8 border border-emerald-100">
            <h2 className="text-2xl font-bold text-emerald-700 mb-6 border-b pb-3">
              Shipping & Payment Details
            </h2>

            <form onSubmit={placeOrder} className="space-y-6">
              {/* Shipping Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  1. Shipping Information
                </h3>

                {/* Name + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name <span className="text-red-500">*</span>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`${inputStyle} w-full`}
                      required
                    />
                  </label>
                  <label className="block text-sm font-medium text-gray-700">
                    Email <span className="text-red-500">*</span>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`${inputStyle} w-full`}
                      required
                    />
                  </label>
                </div>

                {/* Phone */}
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number <span className="text-red-500">*</span>
                  <div className="flex gap-2">
                    <select
                      name="phoneCode"
                      value={formData.phoneCode}
                      onChange={handleInputChange}
                      className={`${inputStyle} w-[5.5rem] flex-shrink-0 p-3`}
                      required
                    >
                      <option value="+92">🇵🇰 +92</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+91">🇮🇳 +91</option>
                      <option value="+971">🇦🇪 +971</option>
                      <option value="+61">🇦🇺 +61</option>
                    </select>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="e.g., 3001234567"
                      className={`${inputStyle} flex-grow`}
                      required
                    />
                  </div>
                </label>

                {/* Address */}
                <label className="block text-sm font-medium text-gray-700">
                  Address <span className="text-red-500">*</span>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`${inputStyle} w-full`}
                    required
                  />
                </label>

                {/* City + Postal */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="block text-sm font-medium text-gray-700">
                    City <span className="text-red-500">*</span>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`${inputStyle} w-full`}
                      required
                    />
                  </label>
                  <label className="block text-sm font-medium text-gray-700">
                    Postal Code <span className="text-red-500">*</span>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className={`${inputStyle} w-full`}
                      required
                    />
                  </label>
                </div>

                {/* Country */}
                <label className="block text-sm font-medium text-gray-700">
                  Country <span className="text-red-500">*</span>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className={`${inputStyle} w-full`}
                    required
                  >
                    <option value="">Select Country</option>
                    <option value="PK">Pakistan</option>
                    <option value="US">United States</option>
                    <option value="UK">United Kingdom</option>
                                        <option value="UK">United Kingdom</option>
                    <option value="IN">India</option>
                    <option value="AE">United Arab Emirates</option>
                  </select>
                </label>
              </div>

              {/* Payment Method */}
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-700">
                  2. Payment Method
                </h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Stripe Card */}
                  <label
                    className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition w-full sm:w-1/2 ${
                      paymentMethod === "stripe"
                        ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500"
                        : "border-gray-300 bg-white hover:border-gray-400"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        value="stripe"
                        checked={paymentMethod === "stripe"}
                        onChange={() => setPaymentMethod("stripe")}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="font-medium">Pay with Card (Stripe)</span>
                    </div>
                    <FaCreditCard className="text-emerald-600 text-xl" />
                  </label>

                  {/* COD Card */}
                  <label
                    className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition w-full sm:w-1/2 ${
                      paymentMethod === "cod"
                        ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500"
                        : "border-gray-300 bg-white hover:border-gray-400"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        value="cod"
                        checked={paymentMethod === "cod"}
                        onChange={() => setPaymentMethod("cod")}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="font-medium">Cash on Delivery</span>
                    </div>
                    <FaMoneyBillAlt className="text-emerald-600 text-xl" />
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-emerald-700 transition duration-200 shadow-lg mt-6"
                disabled={cartItems.length === 0}
              >
                {paymentMethod === "stripe"
                  ? `Proceed to Payment (PKR ${grandTotal.toFixed(0)})`
                  : `Place Your Order`}
              </button>
            </form>
          </section>

          {/* Right Column: Order Summary */}
          <section className="md:col-span-1 bg-gray-100 shadow-xl rounded-xl p-4 sm:p-6 h-fit sticky top-24 border border-gray-200 order-first md:order-last">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-3">
              Your Cart Items
            </h2>

            <div className="max-h-60 overflow-y-auto mb-4 pr-2">
              <ul className="divide-y divide-gray-200">
                {cartItems.length === 0 ? (
                  <p className="text-gray-500 text-sm py-2">No items in cart.</p>
                ) : (
                  cartItems.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start justify-between py-2 text-sm"
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.image || "/placeholder.png"}
                          alt={item.name}
                          className="w-10 h-10 object-cover rounded flex-shrink-0"
                        />
                        <span className="text-gray-700 leading-tight">
                          {item.name}{" "}
                          <span className="font-medium text-emerald-600">
                            × {item.quantity}
                          </span>
                        </span>
                      </div>
                      <span className="font-semibold text-gray-800 flex-shrink-0 ml-4">
                        PKR {(item.price * item.quantity).toFixed(0)}
                      </span>
                    </li>
                  ))
                )}
              </ul>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 text-sm pt-4 border-t border-gray-300">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium">PKR {total.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping Fee</span>
                <span className="font-medium text-emerald-600">
                  PKR {shipping.toFixed(0)}
                </span>
              </div>
              <div className="flex justify-between text-gray-600 border-b border-gray-300 pb-3">
                <span>Tax (5% GST)</span>
                <span className="font-medium">PKR {tax.toFixed(0)}</span>
              </div>
            </div>

            {/* Grand Total */}
            <div className="flex justify-between font-bold text-xl pt-3">
              <span>Grand Total</span>
              <span className="text-emerald-700">
                PKR {grandTotal.toFixed(0)}
              </span>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
