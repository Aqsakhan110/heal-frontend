"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const { user } = useUser();

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await fetch("/api/orders?userId=" + user?.id);
      const data = await res.json();
      setOrders(data);
    };
    if (user) fetchOrders();
  }, [user]);

  return (
    <div className="pt-24 max-w-4xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6 text-emerald-700">My Orders</h1>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="border rounded p-4">
              <p className="font-semibold">Order ID: {order._id}</p>
              <p>Date: {new Date(order.createdAt).toLocaleString()}</p>
              <ul className="list-disc pl-5">
                {order.items.map((item: any) => (
                  <li key={item._id}>
                    {item.name} — Rs {item.price}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
