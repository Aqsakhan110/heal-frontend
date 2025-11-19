// "use client";

// import { useEffect, useState } from "react";
// import { useAuth } from "@clerk/nextjs";

// type Medicine = {
//   id: string;
//   name: string;
//   price: number;
// };

// export default function MedicinesPage() {
//   const { getToken } = useAuth();
//   const [medicines, setMedicines] = useState<Medicine[]>([]);

//   useEffect(() => {
//     const fetchMedicines = async () => {
//       const token = await getToken({ template: "default" });
//       const res = await fetch("/api/products", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data: Medicine[] = await res.json();
//       setMedicines(data);
//     };
//     fetchMedicines();
//   }, []);

//   return (
//     <div className="max-w-3xl mx-auto mt-12 px-4">
//       <h1 className="text-2xl font-bold text-slate-900">Available Medicines</h1>
//       <ul className="mt-6 space-y-3">
//         {medicines.map((m) => (
//           <li key={m.id} className="rounded-lg border p-4">
//             <p className="font-semibold">{m.name}</p>
//             <p className="text-sm text-slate-600">Price: Rs {m.price}</p>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }




"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

type Medicine = {
  id: string;
  name: string;
  price: number;
};

export default function MedicinesPage() {
  const { getToken } = useAuth();
  const { addItem } = useCart();
  const [medicines, setMedicines] = useState<Medicine[]>([]);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const token = await getToken({ template: "default" });
        const res = await fetch("/api/products", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data: Medicine[] = await res.json();
        setMedicines(data);
      } catch {
        toast.error("Failed to load medicines.");
      }
    };
    fetchMedicines();
  }, [getToken]);

  return (
    <div className="max-w-3xl mx-auto mt-12 px-4">
      <h1 className="text-2xl font-bold text-slate-900">Available Medicines</h1>
      <ul className="mt-6 space-y-3">
        {medicines.map((m) => (
          <li key={m.id} className="rounded-lg border p-4 flex justify-between items-center">
            <div>
              <p className="font-semibold">{m.name}</p>
              <p className="text-sm text-slate-600">Price: Rs {m.price}</p>
            </div>
            <button
              onClick={() => {
                addItem({ id: m.id, name: m.name, price: m.price, quantity: 1 });
                toast.success(`${m.name} added to cart`);
              }}
              className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
            >
              Add to Cart
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

