"use client";

import { useCart } from "../context/CartContext";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaMoneyBillAlt, FaCreditCard } from "react-icons/fa";
import { useState } from "react";

const inputStyle =
  "border border-gray-300 rounded-lg p-3 focus:ring-emerald-500 focus:border-emerald-500 transition duration-150";

// ------------------------------
// ZOD VALIDATION SCHEMA
// ------------------------------
const checkoutSchema = z.object({
  fullName: z
    .string()
    .min(3, "Full name is required")
    .regex(/^[A-Za-z ]+$/, "Only letters allowed"),

  email: z.string().email("Invalid email format"),

  phoneCode: z.string(),

  phoneNumber: z
    .string()
    .min(7, "Phone number is too short")
    .regex(/^\d+$/, "Only digits allowed"),

  address: z
    .string()
    .min(5, "Address is required")
    // realistic address → allows letters, digits, commas, hyphens, spaces, #
    .regex(/^[A-Za-z0-9 ,\-#]+$/, "Invalid characters in address"),

  city: z
    .string()
    .min(2, "City is required")
    .regex(/^[A-Za-z ]+$/, "City must contain only letters"),

  postalCode: z
    .string()
    .min(3, "Postal code is too short")
    .regex(/^\d+$/, "Postal code must be numbers only"),

  country: z.string().min(1, "Please select a country"),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { user } = useUser();
  const { cartItems, total } = useCart();

  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "cod">("stripe");

  // ------------------------------
  // React Hook Form Setup
  // ------------------------------
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      email: user?.primaryEmailAddress?.emailAddress || "",
      phoneCode: "+92",
      phoneNumber: "",
      address: "",
      city: "",
      postalCode: "",
      country: "PK",
    },
  });

  // SHIPPING, TAX AND TOTAL
  const shipping = cartItems.length > 0 ? 250 : 0;
  const tax = Math.round(total * 0.05);
  const grandTotal = total + shipping + tax;

  // ------------------------------
  // SUBMIT HANDLER
  // ------------------------------
  const placeOrder = async (data: CheckoutForm) => {
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
          shippingDetails: data,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result?.error || "Order failed.");
        return;
      }

      if (paymentMethod === "stripe") {
        // Create Stripe session
        const stripeRes = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: cartItems.map((item) => ({
              name: item.name,
              price: Math.round(item.price * 100),
              quantity: item.quantity,
            })),
            shipping: shipping * 100,
            tax: tax * 100,
          }),
        });

        const { url } = await stripeRes.json();

        if (!url) return toast.error("Stripe payment failed.");

        window.location.href = url;
      } else {
        // COD
        await fetch("/api/send-cod-email", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: data.email,    // buyer's email
    name: data.fullName,  // buyer's name
    total: grandTotal,    // order total
  }),
});


        toast.success("Order placed successfully!");
        window.location.href = "/success";
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    }
  };

  return (
    <main className="min-h-screen pt-20 pb-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-emerald-800 mb-8 text-center">
          Finalize Your Order
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* LEFT COLUMN */}
          <section className="md:col-span-2 bg-white shadow-xl rounded-xl p-4 sm:p-8 border border-emerald-100">
            <h2 className="text-2xl font-bold text-emerald-700 mb-6 border-b pb-3">
              Shipping & Payment Details
            </h2>

            <form onSubmit={handleSubmit(placeOrder)} className="space-y-6">

              {/* SHIPPING INFO */}
              <div className="space-y-4">

                {/* Full Name */}
                <label className="block text-sm font-medium text-gray-700">
                  Full Name <span className="text-red-500">*</span>
                  <input
                    {...register("fullName")}
                    className={`${inputStyle} w-full`}
                  />
                  {errors.fullName && (
                    <p className="text-red-600 text-sm">
                      {errors.fullName.message}
                    </p>
                  )}
                </label>

                {/* Email */}
                <label className="block text-sm font-medium text-gray-700">
                  Email <span className="text-red-500">*</span>
                  <input
                    {...register("email")}
                    type="email"
                    className={`${inputStyle} w-full`}
                  />
                  {errors.email && (
                    <p className="text-red-600 text-sm">{errors.email.message}</p>
                  )}
                </label>

                {/* Phone */}
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number <span className="text-red-500">*</span>
                  <div className="flex gap-2">
                    <select
                      {...register("phoneCode")}
                      className={`${inputStyle} w-[5.5rem]`}
                    >
                      <option value="+92">🇵🇰 +92</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+91">🇮🇳 +91</option>
                      <option value="+971">🇦🇪 +971</option>
                      <option value="+61">🇦🇺 +61</option>
                    </select>

                    <input
                      {...register("phoneNumber")}
                      className={`${inputStyle} flex-grow`}
                      inputMode="numeric"
                    />
                  </div>
                  {errors.phoneNumber && (
                    <p className="text-red-600 text-sm">
                      {errors.phoneNumber.message}
                    </p>
                  )}
                </label>

                {/* Address */}
                <label className="block text-sm font-medium text-gray-700">
                  Address <span className="text-red-500">*</span>
                  <input
                    {...register("address")}
                    className={`${inputStyle} w-full`}
                  />
                  {errors.address && (
                    <p className="text-red-600 text-sm">{errors.address.message}</p>
                  )}
                </label>

                {/* City + Postal */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  {/* City */}
                  <label className="block text-sm font-medium text-gray-700">
                    City *
                    <input
                      {...register("city")}
                      className={`${inputStyle} w-full`}
                    />
                    {errors.city && (
                      <p className="text-red-600 text-sm">{errors.city.message}</p>
                    )}
                  </label>

                  {/* Postal Code */}
                  <label className="block text-sm font-medium text-gray-700">
                    Postal Code *
                    <input
                      {...register("postalCode")}
                      className={`${inputStyle} w-full`}
                      inputMode="numeric"
                    />
                    {errors.postalCode && (
                      <p className="text-red-600 text-sm">
                        {errors.postalCode.message}
                      </p>
                    )}
                  </label>
                </div>

                {/* Country */}
                <label className="block text-sm font-medium text-gray-700">
                  Country *
                  <select {...register("country")} className={`${inputStyle} w-full`}>
                    <option value="">Select Country</option>
                    <option value="PK">Pakistan</option>
                    <option value="US">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="IN">India</option>
                    <option value="AE">United Arab Emirates</option>
                  </select>
                  {errors.country && (
                    <p className="text-red-600 text-sm">{errors.country.message}</p>
                  )}
                </label>
              </div>

              {/* PAYMENT METHOD */}
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-700">
                  2. Payment Method
                </h3>

                <div className="flex flex-col sm:flex-row gap-4">

                  {/* Stripe */}
                  <label
                    className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition w-full sm:w-1/2 ${
                      paymentMethod === "stripe"
                        ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500"
                        : "border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        value="stripe"
                        checked={paymentMethod === "stripe"}
                        onChange={() => setPaymentMethod("stripe")}
                      />
                      Pay with Card (Stripe)
                    </div>
                    <FaCreditCard className="text-emerald-600 text-xl" />
                  </label>

                  {/* COD */}
                  <label
                    className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition w-full sm:w-1/2 ${
                      paymentMethod === "cod"
                        ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500"
                        : "border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        value="cod"
                        checked={paymentMethod === "cod"}
                        onChange={() => setPaymentMethod("cod")}
                      />
                      Cash on Delivery
                    </div>
                    <FaMoneyBillAlt className="text-emerald-600 text-xl" />
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-emerald-700 transition"
              >
                {paymentMethod === "stripe"
                  ? `Proceed to Payment (PKR ${grandTotal.toFixed(0)})`
                  : `Place Order`}
              </button>
            </form>
          </section>

          {/* RIGHT COLUMN — CART SUMMARY */}
          <section className="md:col-span-1 bg-gray-100 shadow-xl rounded-xl p-4 sm:p-6 h-fit sticky top-24 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-3">
              Your Cart Items
            </h2>

            <div className="overflow-y-auto max-h-[50vh] pr-2">
              <ul className="divide-y divide-gray-200">
                {cartItems.length === 0 ? (
                  <p className="text-gray-500 text-sm">No items in cart.</p>
                ) : (
                  cartItems.map((item, i) => (
                    <li key={i} className="flex justify-between py-2 text-sm">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image || "/placeholder.png"}
                          alt={item.name}
                          className="w-10 h-10 rounded object-cover"
                        />
                        <span>
                          {item.name}{" "}
                          <span className="text-emerald-600">×{item.quantity}</span>
                        </span>
                      </div>
                      <strong>
                        PKR {(item.price * item.quantity).toFixed(0)}
                      </strong>
                    </li>
                  ))
                )}
              </ul>
            </div>

            <div className="space-y-3 text-sm pt-4 border-t mt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>PKR {total.toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-emerald-600">
                  PKR {shipping.toFixed(0)}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span>Tax (5%)</span>
                <span>PKR {tax.toFixed(0)}</span>
              </div>
            </div>

            <div className="flex justify-between text-xl font-bold pt-3">
              <span>Total</span>
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
