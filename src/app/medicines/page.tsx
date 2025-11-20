"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useUser, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import Fuse from "fuse.js";
import { useSearchParams } from "next/navigation";

type Medicine = {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  stock?: number;
};

// ✅ Child component with useSearchParams
function MedicinesPageContent() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [visibleCount, setVisibleCount] = useState(8);
  const { user } = useUser();
  const { addItem } = useCart();
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";

  // Fetch medicines
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const res = await fetch("/api/medicines");
        const data = await res.json();

        const withStock = (Array.isArray(data) ? data : []).map(
          (m: Medicine, idx: number) => {
            const position = idx + 1;
            const unavailable = [4, 6, 12];
            return {
              ...m,
              stock: unavailable.includes(position) ? 0 : 10,
            };
          }
        );

        setMedicines(withStock);
      } catch (e) {
        console.error("Failed to load medicines", e);
        setMedicines([]);
      }
    };
    fetchMedicines();
  }, []);

  // Fuse.js fuzzy search
  const fuse = useMemo(() => {
    return new Fuse(medicines, {
      keys: ["name", "description"],
      threshold: 0.3,
      ignoreLocation: true,
      minMatchCharLength: 2,
    });
  }, [medicines]);

  const filteredMedicines =
    search.trim().length === 0
      ? medicines
      : fuse.search(search).map((r) => r.item);

  const addToCart = async (medicine: Medicine) => {
    if (!medicine.stock || medicine.stock <= 0) {
      toast.error(`${medicine.name} is out of stock`);
      return;
    }

    await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user?.id,
        medicineId: medicine._id,
        name: medicine.name,
        price: medicine.price,
        image: medicine.image,
      }),
    });

    // ✅ Pass proper CartItem object
    addItem({
      id: medicine._id,
      name: medicine.name,
      price: medicine.price,
      quantity: 1,
      image: medicine.image,
    });

    toast.success(`${medicine.name} added to cart!`);
  };

  return (
    <>
      <SignedIn>
        <motion.div className="pt-6 sm:pt-8 lg:pt-10 max-w-7xl mx-auto px-4">
          <motion.h1 className="text-3xl sm:text-4xl font-extrabold text-emerald-700 text-center">
            Shop Trusted Medicines Online
          </motion.h1>
          <br></br>
          <p className="mt-2 text-center text-gray-600 max-w-2xl mx-auto">
            Browse authentic medicines from trusted pharmacies. Add to cart if available.
          </p>

          <motion.div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8 items-stretch">
            {filteredMedicines.slice(0, visibleCount).map((medicine: Medicine) => (
              <motion.div
                key={medicine._id}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-lg shadow-md p-4 flex flex-col text-center h-full transition-transform duration-300 hover:shadow-xl"
              >
                <img
                  src={medicine.image}
                  alt={medicine.name}
                  className="w-28 h-28 sm:w-32 sm:h-32 object-cover mb-3 rounded-md mx-auto"
                />
                <h2 className="text-base sm:text-lg font-semibold text-emerald-700">
                  {medicine.name}
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2 flex-grow">
                  {medicine.description}
                </p>

                {medicine.stock && medicine.stock > 0 ? (
                  <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-semibold px-2 py-1 rounded-full mb-2">
                    In Stock
                  </span>
                ) : (
                  <span className="inline-block bg-gray-200 text-gray-600 text-xs font-semibold px-2 py-1 rounded-full mb-2">
                    Out of Stock
                  </span>
                )}

                <p className="text-emerald-700 font-bold mb-3">Rs {medicine.price}</p>

                <button
                  onClick={() => addToCart(medicine)}
                  disabled={!medicine.stock || medicine.stock <= 0}
                  className={`px-3 py-1.5 rounded-md text-sm mt-auto transition font-semibold ${
                    medicine.stock && medicine.stock > 0
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {medicine.stock && medicine.stock > 0 ? "Add to Cart" : "Unavailable"}
                </button>
              </motion.div>
            ))}
          </motion.div>

          <div className="flex justify-center mt-8 gap-4 pb-14">
            {visibleCount < filteredMedicines.length && (
              <button
                onClick={() => setVisibleCount((prev) => prev + 4)}
                className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition"
              >
                Load More
              </button>
            )}
            {visibleCount > 8 && (
              <button
                onClick={() => setVisibleCount(8)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition"
              >
                Load Less
              </button>
            )}
          </div>
        </motion.div>
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn redirectUrl="/medicines" />
      </SignedOut>
    </>
  );
}

// ✅ Suspense wrapper
export default function MedicinesPage() {
  return (
    <Suspense fallback={<div>Loading medicines...</div>}>
      <MedicinesPageContent />
    </Suspense>
  );
}
