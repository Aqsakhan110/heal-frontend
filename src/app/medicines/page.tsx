




"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useUser, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import { motion, Variants } from "framer-motion";
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

// --- Framer Motion Variants (Only for main container) ---

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.1, 
        },
    },
};

// --- Skeleton Loader Component ---

const SkeletonCard = () => (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-2 sm:p-4 flex flex-col text-center h-full animate-pulse">
        <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gray-300 mb-3 rounded-md mx-auto"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto mb-2"></div>
        <div className="text-xs text-gray-500 mb-2 line-clamp-2 flex-grow min-h-[2.5rem] space-y-1">
            <div className="h-2 bg-gray-200 rounded w-full"></div>
            <div className="h-2 bg-gray-200 rounded w-3/5 mx-auto"></div>
        </div>
        <div className="h-3 bg-gray-300 rounded w-1/3 mx-auto mb-3"></div>
        <div className="h-8 bg-gray-300 rounded-lg w-full mt-auto"></div>
    </div>
);


// --- Component ---

function MedicinesPageContent() {
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [loading, setLoading] = useState(true); // New loading state
    const [visibleCount, setVisibleCount] = useState(8);
    const { user } = useUser();
    const { addItem } = useCart();
    const searchParams = useSearchParams();
    const search = searchParams.get("search") || "";

    useEffect(() => {
        const fetchMedicines = async () => {
            setLoading(true); // Set loading true before fetch
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
                            // 📌 FIX 1: Updated the Brufen (index 1) description 
                            // 📌 FIX 2: Removed menstrual information
                            description: idx === 1 
                                ? "Anti-inflammatory and pain reliever, used for fever, muscle pain relief, and effective for general aches and headaches." 
                                : m.description,
                        };
                    }
                );
                setMedicines(withStock);
            } catch (e) {
                console.error("Failed to load medicines", e);
                setMedicines([]);
            } finally {
                setLoading(false); // Set loading false after fetch
            }
        };
        fetchMedicines();
    }, []);

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

        addItem({
            id: medicine._id,
            name: medicine.name,
            price: medicine.price,
            quantity: 1,
            image: medicine.image,
        });

        toast.success(`${medicine.name} added to cart!`);
    };

    // Determine content to render: Skeletons or Actual Cards
    const cardsToRender = loading ? Array(8).fill(0) : filteredMedicines.slice(0, visibleCount);

    return (
        <>
            <SignedIn>
                <motion.div className="pt-8 sm:pt-10 lg:pt-12 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Heading */}
                    <motion.h1 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-emerald-700 text-center"
                    >
                        Your Trusted Online Pharmacy 💊
                    </motion.h1>
                    <p className="mt-3 text-center text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
                        Browse authentic health products and medicines. Always in stock (mostly!).
                    </p>
                    
                    {search.trim().length > 0 && (
                        <p className="mt-6 text-center text-gray-500 font-medium text-sm">
                            Showing results for: **"{search}"**
                        </p>
                    )}

                    {/* Responsive Grid Container */}
                    <motion.div 
                        className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 items-stretch"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {cardsToRender.map((data, index) => (
                            loading ? (
                                <SkeletonCard key={index} /> // Show skeleton while loading
                            ) : (
                                <div
                                    key={(data as Medicine)._id}
                                    className="bg-white border border-emerald-100 rounded-xl shadow-md p-2 sm:p-4 flex flex-col text-center h-full transition-transform duration-300 hover:scale-[1.03] hover:shadow-lg"
                                >
                                    <img
                                        src={(data as Medicine).image}
                                        alt={(data as Medicine).name}
                                        className="w-24 h-24 sm:w-28 sm:h-28 object-contain mb-3 rounded-md mx-auto border border-gray-100"
                                        loading="lazy"
                                    />
                                    
                                    <h2 className="text-sm sm:text-base font-semibold text-emerald-700">
                                        {(data as Medicine).name}
                                    </h2>
                                    
                                    {/* 📌 FIX 2: Removed line-clamp-2 to show full description */}
                                    <p className="text-xs text-gray-500 mb-2 flex-grow min-h-[2.5rem]"> 
                                        {(data as Medicine).description}
                                    </p>

                                    {/* Stock Badge */}
                                    {(data as Medicine).stock && (data as Medicine).stock! > 0 ? (
                                        <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-semibold px-2 py-1 rounded-full mb-2 mx-auto">
                                            In Stock ({(data as Medicine).stock})
                                        </span>
                                    ) : (
                                        <span className="inline-block bg-gray-200 text-gray-600 text-xs font-semibold px-2 py-1 rounded-full mb-2 mx-auto">
                                            Out of Stock
                                        </span>
                                    )}

                                    {/* Price */}
                                    <p className="text-emerald-700 font-bold mb-3 text-sm sm:text-lg">Rs {(data as Medicine).price}</p>

                                    {/* Button */}
                                    <button
                                        onClick={() => addToCart(data as Medicine)}
                                        disabled={!(data as Medicine).stock || (data as Medicine).stock! <= 0}
                                        className={`px-3 py-1 sm:py-2.5 rounded-lg text-xs sm:text-sm mt-auto transition font-semibold w-full ${
                                            (data as Medicine).stock && (data as Medicine).stock! > 0
                                                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        }`}
                                    >
                                        {(data as Medicine).stock && (data as Medicine).stock! > 0 ? "Add to Cart" : "Unavailable"}
                                    </button>
                                </div>
                            )
                        ))}
                    </motion.div>

                    {/* Load More/Less Buttons */}
                    <div className="flex justify-center mt-10 gap-4 pb-16">
                        {visibleCount < filteredMedicines.length && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setVisibleCount((prev) => prev + 4)}
                                className="bg-emerald-600 text-white px-5 py-2.5 rounded-full shadow-lg hover:bg-emerald-700 transition font-semibold text-sm"
                            >
                                Load More
                            </motion.button>
                        )}
                        {visibleCount > 8 && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setVisibleCount(8)}
                                className="bg-gray-300 text-gray-800 px-5 py-2.5 rounded-full shadow-md hover:bg-gray-400 transition font-semibold text-sm"
                            >
                                Show Less
                            </motion.button>
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

// Suspense wrapper
export default function MedicinesPage() {
    return (
        <Suspense fallback={<div>Loading pharmacy...</div>}>
            <MedicinesPageContent />
        </Suspense>
    );
}