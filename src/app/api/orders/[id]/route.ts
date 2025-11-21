import { NextResponse, NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// ✅ GET → fetch single order by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
  }

  try {
    const { db } = await connectToDatabase();
    const order = await db.collection("orders").findOne({ _id: new ObjectId(id) });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({
      _id: order._id.toString(),
      userId: order.userId,
      items: order.items,
      total: order.total,
      status: order.status || "pending",
      method: order.method,
      createdAt: order.createdAt,
    });
  } catch (err) {
    console.error("❌ Error fetching order:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

