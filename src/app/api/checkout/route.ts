import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-11-17.clover",
});

export async function POST(req: Request) {
  try {
    const { items } = await req.json();
    console.log("Incoming items:", items); // ✅ log payload
    console.log("Stripe secret key exists:", !!process.env.STRIPE_SECRET_KEY);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items.map((item: any) => ({
        price_data: {
          currency: "pkr", // or "usd" in test mode
          product_data: { name: item.name },
          unit_amount: item.price, // must be in paisa/cents
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
    });

    console.log("Stripe session created:", session.url); // ✅ log session URL

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe session error:", err); // ✅ log full error
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
