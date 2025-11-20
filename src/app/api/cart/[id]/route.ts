import { NextResponse, NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// ✅ Delete item
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { db } = await connectToDatabase();

  try {
    const { id } = context.params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    await db.collection("cart").deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

// ✅ Update quantity
export async function PATCH(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { db } = await connectToDatabase();
  const { id } = context.params;

  try {
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const { qty } = await req.json();

    const result = await db.collection("cart").updateOne(
      { _id: new ObjectId(id) },
      { $set: { qty } }
    );

    if (result.modifiedCount === 1) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false }, { status: 400 });
    }
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
