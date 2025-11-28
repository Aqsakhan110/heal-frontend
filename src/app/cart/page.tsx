// 

"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import { FaTrashAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";

// --- Type Definitions (Must be accurate) ---

type CartItemFromDB = {
    _id: string; // From DB
    name: string;
    price: number;
    qty: number; // From DB
    image: string;
    medicineId: string;
};

// Assuming this type is used by your CartContext
type CartItem = {
    id: string; // For Context/Frontend
    name: string;
    price: number;
    quantity: number; // For Context/Frontend
    image: string;
};

// --- Conversion Function ---
// Helper to explicitly convert the DB type to the Context type
const convertToContextItem = (dbItem: CartItemFromDB): CartItem => ({
    id: dbItem._id,
    name: dbItem.name,
    price: dbItem.price,
    quantity: dbItem.qty,
    image: dbItem.image,
});


export default function CartPage() {
    const { user } = useUser();
    const { removeItem, setCartItemsFromDB } = useCart(); 
    const [items, setItems] = useState<CartItemFromDB[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Fetch cart items
    useEffect(() => {
        const fetchCart = async () => {
            try {
                if (!user?.id) return;
                const res = await fetch(`/api/cart?userId=${user.id}`);
                const data = await res.json();
                if (Array.isArray(data)) {
                    const dbItems: CartItemFromDB[] = data;
                    setItems(dbItems);
                    
                    // 📌 FIX 1: Map the array explicitly before setting context state
                    setCartItemsFromDB(dbItems.map(convertToContextItem)); 
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

    // DELETE item
    const deleteItem = async (id: string) => {
        try {
            if (!user?.id) return;

            const res = await fetch(`/api/cart?_id=${id}&userId=${user.id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setItems((prev: CartItemFromDB[]) => prev.filter(item => item._id !== id));
                removeItem(id);
                toast.success("Item removed from cart.");
            } else {
                toast.error("❌ Failed to delete item.");
            }
        } catch {
            toast.error("Something went wrong.");
        }
    };

    // PATCH quantity
    const updateQuantity = async (id: string, newQty: number) => {
        if (newQty < 1) return;
        try {
            if (!user?.id) return;

            const res = await fetch(`/api/cart`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ _id: id, qty: newQty, userId: user.id }),
            });

            if (res.ok) {
                // 1. Update the local DB state (items on the screen)
                const newLocalItems = items.map(item =>
                    item._id === id ? { ...item, qty: newQty } : item
                );
                setItems(newLocalItems);

                // 2. Update the Context state for the header cart count
                // 📌 FIX 2: Create a mapped array (CartItem[]) from the updated local state (CartItemFromDB[]) 
                // and pass it directly to the context setter.
                const updatedContextItems = newLocalItems.map(convertToContextItem);
                
                // This resolves the remaining 'Argument of type...' error
                setCartItemsFromDB(updatedContextItems); 
                
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
    const shipping = items.length > 0 ? 250 : 0; 
    
    const tax = Math.round(subtotal * 0.05);
    const grandTotal = subtotal + shipping + tax;

    if (loading) return <p className="pt-24 text-center">Loading cart...</p>;

    return (
        <motion.div 
            className="pt-16 sm:pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.6 }}
        >
            <h1 className="text-2xl sm:text-3xl font-bold text-emerald-700 mb-6 sm:mb-8 text-center sm:text-left">
                Shopping Cart
            </h1>

            <div className="flex flex-col lg:flex-row gap-6">
                
                {/* Cart Items List */}
                <div className="lg:w-2/3 bg-white shadow-md rounded-lg p-4 sm:p-6">
                    <h2 className="text-xl font-semibold mb-4 hidden sm:block">Cart Items</h2>
                    
                    {items.length === 0 ? (
                        <p className="text-gray-600">Your cart is empty. <button onClick={() => router.push("/medicines")} className="text-emerald-600 hover:text-emerald-800 font-medium">Browse medicines?</button></p>
                    ) : (
                        items.map(item => (
                            <div key={item._id} 
                                className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b last:border-b-0 py-4 sm:py-6 gap-3 sm:gap-6"
                            >
                                {/* Item Details (Image, Name, Qty) - Left Side */}
                                <div className="flex items-center gap-3 w-full sm:w-auto">
                                    <img 
                                        src={item.image || "/placeholder.jpg"} 
                                        alt={item.name} 
                                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg flex-shrink-0" 
                                        onError={e => (e.currentTarget.src = "/placeholder.jpg")} 
                                    />
                                    <div className="flex flex-col justify-center">
                                        <p className="font-medium text-sm sm:text-base">{item.name}</p>
                                        <p className="text-emerald-700 font-bold text-base sm:hidden">PKR {item.price}</p>
                                        
                                        {/* Quantity Controls */}
                                        <div className="flex items-center gap-2 mt-2 sm:mt-1">
                                            <button onClick={() => updateQuantity(item._id, item.qty - 1)} 
                                                className="px-2 py-0.5 bg-gray-200 rounded text-sm hover:bg-gray-300 transition" disabled={item.qty <= 1}>
                                                -
                                            </button>
                                            <span className="px-1 text-sm">{item.qty}</span>
                                            <button onClick={() => updateQuantity(item._id, item.qty + 1)} 
                                                className="px-2 py-0.5 bg-gray-200 rounded text-sm hover:bg-gray-300 transition">
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Price and Delete Button - Right Side */}
                                <div 
                                    className="flex items-center justify-end gap-4 w-full sm:w-auto"
                                >
                                    {/* Desktop Price */}
                                    <div className="text-right hidden sm:block">
                                        <p className="text-emerald-700 font-bold text-lg">PKR {item.price}</p>
                                        <p className="text-gray-600 text-xs mt-0.5">Subtotal: PKR {(item.price || 0) * (item.qty || 0)}</p>
                                    </div>
                                    
                                    {/* Delete Button */}
                                    <FaTrashAlt 
                                        className="text-red-500 cursor-pointer hover:text-red-700 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" 
                                        onClick={() => deleteItem(item._id)} 
                                        title="Delete item" 
                                    />
                                </div>
                                
                            </div>
                        ))
                    )}
                </div>

                {/* Summary Card */}
                {items.length > 0 && (
                    <div 
                        className="lg:w-1/3 bg-white shadow-xl rounded-lg p-5 sm:p-6 h-fit sticky top-24 border border-emerald-100 mt-4 lg:mt-0"
                    >
                        <h2 className="text-xl font-semibold mb-4 border-b pb-3">Order Summary</h2>
                        
                        {/* Summary Details */}
                        <div className="text-sm space-y-3">
                            <div className="flex justify-between"><span>Subtotal</span><span className="font-medium">PKR {subtotal}</span></div>
                            <div className="flex justify-between"><span>Estimate Shipping</span><span className="font-medium text-emerald-600">PKR {shipping}</span></div>
                            <div className="flex justify-between border-b pb-3"><span>Tax (5% GST)</span><span className="font-medium">PKR {tax}</span></div>
                        </div>

                        {/* Grand Total */}
                        <div className="flex justify-between font-bold text-lg pt-4">
                            <span>Total Payable</span>
                            <span className="text-emerald-700">PKR {grandTotal}</span>
                        </div>

                        {/* Checkout Button */}
                        <button 
                            onClick={() => router.push("/checkout")} 
                            className="mt-6 w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition shadow-md"
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                )}
            </div>
            
        </motion.div>
    );
}