// "use client";

// import { createContext, useContext, useState } from "react";

// export type CartItem = {
//   id: string;
//   name: string;
//   price: number;
//   quantity: number;
//   image?: string;
// };

// type CartContextType = {
//   cartItems: CartItem[];
//   total: number;
//   count: number; // ✅ total quantity of items in cart
//   addItem: (item: CartItem) => void;
//   removeItem: (id: string) => void;
//   clearCart: () => void;
//   setCartItemsFromDB: (items: CartItem[]) => void;
// };

// const CartContext = createContext<CartContextType | undefined>(undefined);

// export function CartProvider({ children }: { children: React.ReactNode }) {
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);

//   // ✅ calculate total price
//   const total = cartItems.reduce(
//     (sum, item) => sum + (item?.price || 0) * (item?.quantity || 0),
//     0
//   );

//   // ✅ calculate total quantity
//   const count = cartItems.reduce((sum, item) => sum + (item?.quantity || 0), 0);

//   const addItem = (newItem: CartItem) => {
//     if (!newItem?.id) {
//       console.warn("Cart item missing id:", newItem);
//       return;
//     }

//     setCartItems((prev) => {
//       const existing = prev.find((item) => item.id === newItem.id);
//       if (existing) {
//         return prev.map((item) =>
//           item.id === newItem.id
//             ? { ...item, quantity: item.quantity + (newItem.quantity || 1) }
//             : item
//         );
//       }
//       return [...prev, { ...newItem, quantity: newItem.quantity || 1 }];
//     });
//   };

//   const removeItem = (id: string) => {
//     setCartItems((prev) => prev.filter((item) => item.id !== id));
//   };

//   const clearCart = () => setCartItems([]);

//   const setCartItemsFromDB = (items: CartItem[]) => {
//     setCartItems(items || []);
//   };

//   return (
//     <CartContext.Provider
//       value={{
//         cartItems,
//         total,
//         count, // ✅ now available in context
//         addItem,
//         removeItem,
//         clearCart,
//         setCartItemsFromDB,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// }

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) throw new Error("useCart must be used within CartProvider");
//   return context;
// };

"use client";

import { createContext, useContext, useState } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

type CartContextType = {
  cartItems: CartItem[];
  total: number;
  count: number; // ✅ total quantity of items in cart
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  setCartItemsFromDB: (items: CartItem[]) => void;
  updateItemQuantity: (id: string, quantity: number) => void; // ✅ new
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // ✅ calculate total price
  const total = cartItems.reduce(
    (sum, item) => sum + (item?.price || 0) * (item?.quantity || 0),
    0
  );

  // ✅ calculate total quantity
  const count = cartItems.reduce((sum, item) => sum + (item?.quantity || 0), 0);

  const addItem = (newItem: CartItem) => {
    if (!newItem?.id) {
      console.warn("Cart item missing id:", newItem);
      return;
    }

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === newItem.id);
      if (existing) {
        return prev.map((item) =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + (newItem.quantity || 1) }
            : item
        );
      }
      return [...prev, { ...newItem, quantity: newItem.quantity || 1 }];
    });
  };

  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setCartItems([]);

  const setCartItemsFromDB = (items: CartItem[]) => {
    setCartItems(items || []);
  };

  // ✅ update quantity directly
  const updateItemQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return; // prevent going below 1
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        total,
        count,
        addItem,
        removeItem,
        clearCart,
        setCartItemsFromDB,
        updateItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
