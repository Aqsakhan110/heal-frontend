// "use client";

// import { useCart } from "../context/CartContext";
// import { useUser } from "@clerk/nextjs";
// import toast from "react-hot-toast";

// export default function CheckoutPage() {
//   const { user } = useUser();
//   const { cartItems, total } = useCart();

//   const shipping = cartItems.length > 0 ? 500 : 0;
//   const tax = Math.round(total * 0.05);
//   const grandTotal = total + shipping + tax;

//   const placeOrder = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (cartItems.length === 0) {
//       toast.error("Your cart is empty.");
//       return;
//     }

//     try {
//       // ✅ Save order in your DB
//       const res = await fetch("/api/orders", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           userId: user?.id,
//           items: cartItems,
//           total: grandTotal,
//           method: "stripe-test",
//         }),
//       });

//       const orderData = await res.json();
//       console.log("Order response:", orderData);

//       if (!res.ok) {
//         toast.error(orderData?.error || "Failed to place order.");
//         return;
//       }

//       // ✅ Create Stripe Checkout Session
//       const checkoutRes = await fetch("/api/checkout_sessions", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ items: cartItems }),
//       });

//       const { url } = await checkoutRes.json();
//       console.log("Stripe session URL:", url);

//       if (!url) {
//         toast.error("Stripe session creation failed.");
//         return;
//       }

//       // ✅ Redirect using session URL (new Stripe.js requirement)
//       window.location.href = url;
//     } catch (err) {
//       console.error("Checkout error:", err);
//       toast.error("Something went wrong.");
//     }
//   };

//   return (
//     <main className="max-w-6xl mx-auto py-12 px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
//       {/* Left: Shipping Info */}
//       <section className="bg-white shadow-md rounded-lg p-6">
//         <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
//         <form onSubmit={placeOrder} className="space-y-4">
//           <input type="text" placeholder="Full Name" className="w-full border rounded p-2" required />
//           <input type="email" placeholder="Email" className="w-full border rounded p-2" required />
//           <input type="text" placeholder="Phone Number" className="w-full border rounded p-2" required />
//           <input type="text" placeholder="Address" className="w-full border rounded p-2" required />
//           <div className="grid grid-cols-2 gap-4">
//             <input type="text" placeholder="City" className="border rounded p-2" required />
//             <input type="text" placeholder="Postal Code" className="border rounded p-2" required />
//           </div>
//           <select className="w-full border rounded p-2" required>
//             <option value="">Select Country</option>
//             <option value="PK">Pakistan</option>
//             <option value="US">United States</option>
//             <option value="UK">United Kingdom</option>
//           </select>

//           <button
//             type="submit"
//             className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition"
//           >
//             Pay with Stripe (Test)
//           </button>
//         </form>
//       </section>

//       {/* Right: Order Summary */}
//       <section className="bg-gray-50 shadow-md rounded-lg p-6">
//         <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
//         <ul className="divide-y divide-gray-200 mb-4">
//           {cartItems.map((item, idx) => (
//             <li key={idx} className="flex items-center justify-between py-3">
//               {/* Thumbnail */}
//               <div className="flex items-center space-x-3">
//                 <img
//                   src={item.image || "/placeholder.png"} // ✅ expects item.image in cart context
//                   alt={item.name}
//                   className="w-12 h-12 object-cover rounded"
//                 />
//                 <span>{item.name} × {item.quantity}</span>
//               </div>
//               <span className="font-medium">PKR {item.price * item.quantity}</span>
//             </li>
//           ))}
//         </ul>
//         <div className="space-y-2 text-sm">
//           <div className="flex justify-between">
//             <span>Subtotal</span>
//             <span>PKR {total}</span>
//           </div>
//           <div className="flex justify-between">
//             <span>Shipping</span>
//             <span>PKR {shipping}</span>
//           </div>
//           <div className="flex justify-between">
//             <span>Tax (5%)</span>
//             <span>PKR {tax}</span>
//           </div>
//           <div className="flex justify-between font-bold text-lg">
//             <span>Total</span>
//             <span>PKR {grandTotal}</span>
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// }



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
      // ✅ Save order in your DB
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
        // ✅ Create Stripe Checkout session
        const checkoutRes = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: cartItems.map(item => ({
              name: item.name,
              price: item.price * 100, // PKR → paisa
              quantity: item.quantity,
            })),
          }),
        });

        const { url } = await checkoutRes.json();
        if (!url) {
          toast.error("Stripe session creation failed.");
          return;
        }

        window.location.href = url; // ✅ works on mobile + desktop
      } else {
        // ✅ COD flow → send email
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
          <input type="text" placeholder="Full Name" className="w-full border rounded p-2" required />
          <input type="email" placeholder="Email" className="w-full border rounded p-2" required />
          <input type="text" placeholder="Phone Number" className="w-full border rounded p-2" required />
          <input type="text" placeholder="Address" className="w-full border rounded p-2" required />
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="City" className="border rounded p-2" required />
            <input type="text" placeholder="Postal Code" className="border rounded p-2" required />
          </div>
          <select className="w-full border rounded p-2" required>
            <option value="">Select Country</option>
            <option value="PK">Pakistan</option>
            <option value="US">United States</option>
            <option value="UK">United Kingdom</option>
          </select>

          {/* ✅ Payment Method Selector */}
          <div className="space-y-2">
            <label className="block font-medium">Payment Method</label>
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

// "use client";

// import { useCart } from "../context/CartContext";
// import { useUser } from "@clerk/nextjs";
// import toast from "react-hot-toast";
// import { useState } from "react";

// export default function CheckoutPage() {
//   const { user } = useUser();
//   const { cartItems, total } = useCart();
//   const [paymentMethod, setPaymentMethod] = useState<"stripe" | "cod">("stripe");

//   const shipping = cartItems.length > 0 ? 500 : 0;
//   const tax = Math.round(total * 0.05);
//   const grandTotal = total + shipping + tax;

//   const placeOrder = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (cartItems.length === 0) {
//       toast.error("Your cart is empty.");
//       return;
//     }

//     try {
//       // ✅ Save order in your DB
//       const res = await fetch("/api/orders", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           userId: user?.id,
//           items: cartItems,
//           total: grandTotal,
//           method: paymentMethod,
//         }),
//       });

//       const orderData = await res.json();
//       console.log("Order response:", orderData);

//       if (!res.ok) {
//         toast.error(orderData?.error || "Failed to place order.");
//         return;
//       }

//       if (paymentMethod === "stripe") {
//         // ✅ Stripe Checkout Session
//         const checkoutRes = await fetch("/api/checkout_sessions", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ items: cartItems }),
//         });

//         const { url } = await checkoutRes.json();
//         console.log("Stripe session URL:", url);

//         if (!url) {
//           toast.error("Stripe session creation failed.");
//           return;
//         }

//         window.location.href = url;
//       } else {
//         // ✅ COD flow → send email via Resend
//         const emailRes = await fetch("/api/send-cod-email", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             email: user?.primaryEmailAddress?.emailAddress,
//             name: user?.fullName || "Customer",
//             total: grandTotal,
//           }),
//         });

//         if (emailRes.ok) {
//           toast.success("Order placed with Cash on Delivery! Confirmation email sent.");
//           window.location.href = "/success";
//         } else {
//           toast.error("Order placed but failed to send email.");
//         }
//       }
//     } catch (err) {
//       console.error("Checkout error:", err);
//       toast.error("Something went wrong.");
//     }
//   };

//   return (
//     <main className="max-w-6xl mx-auto py-12 px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
//       {/* Left: Shipping Info */}
//       <section className="bg-white shadow-md rounded-lg p-6">
//         <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
//         <form onSubmit={placeOrder} className="space-y-4">
//           <input type="text" placeholder="Full Name" className="w-full border rounded p-2" required />
//           <input type="email" placeholder="Email" className="w-full border rounded p-2" required />
//           <input type="text" placeholder="Phone Number" className="w-full border rounded p-2" required />
//           <input type="text" placeholder="Address" className="w-full border rounded p-2" required />
//           <div className="grid grid-cols-2 gap-4">
//             <input type="text" placeholder="City" className="border rounded p-2" required />
//             <input type="text" placeholder="Postal Code" className="border rounded p-2" required />
//           </div>
//           <select className="w-full border rounded p-2" required>
//             <option value="">Select Country</option>
//             <option value="PK">Pakistan</option>
//             <option value="US">United States</option>
//             <option value="UK">United Kingdom</option>
//           </select>

//           {/* ✅ Payment Method Selector */}
//           <div className="space-y-2">
//             <label className="block font-medium">Payment Method</label>
//             <div className="flex gap-4">
//               <label className="flex items-center gap-2">
//                 <input
//                   type="radio"
//                   value="stripe"
//                   checked={paymentMethod === "stripe"}
//                   onChange={() => setPaymentMethod("stripe")}
//                 />
//                 Stripe (Test)
//               </label>
//               <label className="flex items-center gap-2">
//                 <input
//                   type="radio"
//                   value="cod"
//                   checked={paymentMethod === "cod"}
//                   onChange={() => setPaymentMethod("cod")}
//                 />
//                 Cash on Delivery
//               </label>
//             </div>
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition"
//           >
//             Place Order
//           </button>
//         </form>
//       </section>

//       {/* Right: Order Summary */}
//       <section className="bg-gray-50 shadow-md rounded-lg p-6">
//         <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
//         <ul className="divide-y divide-gray-200 mb-4">
//           {cartItems.map((item, idx) => (
//             <li key={idx} className="flex items-center justify-between py-3">
//               <div className="flex items-center space-x-3">
//                 <img
//                   src={item.image || "/placeholder.png"}
//                   alt={item.name}
//                   className="w-12 h-12 object-cover rounded"
//                 />
//                 <span>{item.name} × {item.quantity}</span>
//               </div>
//               <span className="font-medium">PKR {item.price * item.quantity}</span>
//             </li>
//           ))}
//         </ul>
//         <div className="space-y-2 text-sm">
//           <div className="flex justify-between">
//             <span>Subtotal</span>
//             <span>PKR {total}</span>
//           </div>
//           <div className="flex justify-between">
//             <span>Shipping</span>
//             <span>PKR {shipping}</span>
//           </div>
//           <div className="flex justify-between">
//             <span>Tax (5%)</span>
//             <span>PKR {tax}</span>
//           </div>
//           <div className="flex justify-between font-bold text-lg">
//             <span>Total</span>
//             <span>PKR {grandTotal}</span>
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// }
