import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-11-17.clover", // use stable API version
});

export async function POST(req: Request) {
  try {
    const { items } = await req.json(); // items come from MongoDB/cart

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items.map(
        (item: { name: string; price: number; quantity: number }) => ({
          price_data: {
            currency: "usd",
            product_data: { name: item.name },
            unit_amount: item.price, // amount in cents
          },
          quantity: item.quantity,
        })
      ),
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
    });

    return NextResponse.json({ id: session.id });
  } catch (err: any) {
    console.error("Stripe session error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
