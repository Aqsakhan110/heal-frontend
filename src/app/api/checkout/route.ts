import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: Request) {
  try {
    const { items, shipping, tax } = await req.json();

    // Build line items: products + shipping + tax
    const lineItems = [
      // Products
      ...items.map((item: { name: string; price: number; quantity: number }) => ({
        price_data: {
          currency: "pkr", // ⚠️ Use "usd" in test mode if PKR not enabled
          product_data: { name: item.name },
          unit_amount: item.price, // ✅ already in minor units (paisa) from frontend
        },
        quantity: item.quantity,
      })),

      // Shipping Fee
      {
        price_data: {
          currency: "pkr",
          product_data: { name: "Shipping Fee" },
          unit_amount: shipping, // ✅ already minor units
        },
        quantity: 1,
      },

      // Tax
      {
        price_data: {
          currency: "pkr",
          product_data: { name: "GST (5%)" },
          unit_amount: tax, // ✅ already minor units
        },
        quantity: 1,
      },
    ];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe session error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
