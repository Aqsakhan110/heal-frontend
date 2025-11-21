"use client";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";

export default function TrackOrderPage() {
  const { user } = useUser();
  const [orderId, setOrderId] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch all orders for logged-in user
  const fetchOrders = async () => {
    if (!user?.id) {
      alert("You must be signed in to view orders.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/orders?userId=${user.id}`);
      const data = await res.json();
      if (res.ok) {
        setOrders(data);
      } else {
        alert(data.error || "Failed to fetch orders");
      }
    } catch (err) {
      console.error("Fetch orders error:", err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch single order by ID
  const fetchOrderById = async () => {
    if (!orderId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      const data = await res.json();
      if (res.ok) {
        setOrders([data]); // show only this order
      } else {
        alert(data.error || "Order not found");
      }
    } catch (err) {
      console.error("Track order error:", err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto py-16 px-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-extrabold text-emerald-700 mb-8 text-center"
      >
        Track Your Orders
      </motion.h1>

      {/* Search by Order ID */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="flex gap-2 mb-6"
      >
        <input
          type="text"
          placeholder="Enter Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="flex-1 border rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-emerald-500"
        />
        <button
          onClick={fetchOrderById}
          disabled={loading}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </motion.div>

      {/* Fetch all orders for logged-in user */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        onClick={fetchOrders}
        disabled={loading}
        className="mb-8 bg-sky-100 text-emerald-700 px-6 py-3 rounded-lg font-medium hover:bg-sky-200 transition disabled:opacity-50"
      >
        {loading ? "Loading..." : "View All My Orders"}
      </motion.button>

      {/* Orders list */}
      {orders.length > 0 ? (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
          }}
          className="space-y-6"
        >
          {orders.map((order) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white shadow-lg rounded-xl p-6 border border-emerald-100 hover:shadow-xl transition"
            >
              <h2 className="text-lg font-semibold text-emerald-700 mb-2">
                Order #{order._id}
              </h2>
              <p className="text-gray-700"><b>Status:</b> {order.status}</p>
              <p className="text-gray-700"><b>Payment Method:</b> {order.method}</p>
              <p className="text-gray-700"><b>Total:</b> PKR {order.total}</p>
              <p className="text-gray-700"><b>Placed On:</b> {new Date(order.createdAt).toLocaleString()}</p>

              <h3 className="mt-4 font-semibold text-emerald-600">Items:</h3>
              <ul className="list-disc pl-6 text-gray-700">
                {order.items.map((item: any, idx: number) => (
                  <li key={idx}>
                    {item.name} × {item.quantity || item.qty} — PKR {(item.price || 0) * (item.quantity || item.qty || 1)}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-gray-600 text-center"
        >
          No orders found.
        </motion.p>
      )}
    </main>
  );
}
