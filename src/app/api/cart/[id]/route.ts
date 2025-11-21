import { NextResponse, NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// DELETE cart item
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase();
    const { id } = params;
    const userId = req.nextUrl.searchParams.get("userId");

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
    }

    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  } catch (error) {
    console.error("DELETE /cart error:", error);
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}

// PATCH update quantity
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase();
    const { id } = params;
    const userId = req.nextUrl.searchParams.get("userId");

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
      return NextResponse.json({ success: true }, { status: 200 });
    }

    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  } catch (error) {
    console.error("PATCH /cart error:", error);
    return NextResponse.json({ error: "Failed to update quantity" }, { status: 500 });
  }
}

// PUT = PATCH alias
export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  return PATCH(req, context);
}
