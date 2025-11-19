
// import "./globals.css";
// import Header from "./components/Header";
// import Footer from "./components/Footer";
// import WhatsAppButton from "./components/WhatsAppButton";
// import { ClerkProvider } from "@clerk/nextjs";
// import { Toaster } from "react-hot-toast";
// import { CartProvider } from "./context/CartContext"; // ✅ import cart context

// export const metadata = {
//   title: "PharmaCare",
//   description: "Pharmacy & Doctor Appointment Platform",
// };

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en">
//       <body className="bg-gray-50 text-gray-900 relative">
//         <ClerkProvider>
//           <CartProvider>
//             <Header />
//             <main className="min-h-screen">{children}</main>
//             <Footer />
//             <WhatsAppButton />
//             {/* Toast notifications available globally */}
//             <Toaster position="top-center" reverseOrder={false} />
//           </CartProvider>
//         </ClerkProvider>
//       </body>
//     </html>
//   );
// }
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "./context/CartContext"; // ✅ import cart context

export const metadata = {
  title: "PharmaCare",
  description: "Pharmacy & Doctor Appointment Platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gray-50 text-gray-900 relative">
        <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
          <CartProvider>
            <Header />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <WhatsAppButton />
            {/* Toast notifications available globally */}
            <Toaster position="top-center" reverseOrder={false} />
          </CartProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
