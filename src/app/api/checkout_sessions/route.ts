


      import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-11-17.clover", // optional, remove if causing errors
});

export async function POST(req: Request) {
  try {
    const { items } = await req.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items.map(
        (item: { name: string; price: number; quantity: number }) => ({
          price_data: {
            currency: "usd", // ✅ Stripe test mode supports USD
            product_data: { name: item.name },
            unit_amount: item.price , // cents
          },
          quantity: item.quantity,
        })
      ),
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
    });

    // ✅ Return the session URL (new Stripe.js requirement)
    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe session error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
