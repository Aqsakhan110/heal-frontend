import { NextResponse, NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// ✅ GET → fetch orders for a user
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    const { db } = await connectToDatabase();
    const orders = await db.collection("orders").find({ userId }).toArray();

    // ✅ format _id to string for frontend
    const formattedOrders = orders.map((order) => ({
      _id: order._id instanceof ObjectId ? order._id.toString() : order._id,
      userId: order.userId,
      items: order.items,
      total: order.total,
      status: order.status,
      method: order.method,
      createdAt: order.createdAt,
    }));

    return NextResponse.json(formattedOrders, { status: 200 });
  } catch (err) {
    console.error("❌ Error fetching orders:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ✅ POST → place new order
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, items, total, method = "payfast" } = body;

    if (!userId || !items || items.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    // ✅ Save order with full schema
    const result = await db.collection("orders").insertOne({
      userId,
      items,
      total,
      method, // e.g. "payfast"
      status: "pending", // default until webhook confirms
      createdAt: new Date(),
    });

    // ✅ Clear cart after checkout
    await db.collection("cart").deleteMany({ userId });

    return NextResponse.json({ success: true, id: result.insertedId.toString() });
  } catch (err) {
    console.error("❌ Error placing order:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
