// 
import { NextResponse, NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// ✅ DELETE: Remove item from cart by _id and userId
export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  const { db } = await connectToDatabase();
  const { id } = context.params;
  const userId = req.nextUrl.searchParams.get("userId");

  try {
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid cart item id" }, { status: 400 });
    }
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const result = await db.collection("cart").deleteOne({
      _id: new ObjectId(id),
      userId,
    });

    if (result.deletedCount === 1) {
      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("DELETE /cart error:", error);
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}

// ✅ PATCH: Update quantity
export async function PATCH(req: NextRequest, context: { params: { id: string } }) {
  const { db } = await connectToDatabase();
  const { id } = context.params;
  const userId = req.nextUrl.searchParams.get("userId");

  try {
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const { qty } = await req.json();

    const result = await db.collection("cart").updateOne(
      { _id: new ObjectId(id), userId },
      { $set: { qty } }
    );

    if (result.modifiedCount === 1) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("PATCH /cart error:", error);
    return NextResponse.json({ error: "Failed to update quantity" }, { status: 500 });
  }
}

// ✅ Optional: Support PUT as alias for PATCH
export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  return PATCH(req, context);
}
