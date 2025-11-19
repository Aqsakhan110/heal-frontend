
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// ✅ Delete item
export async function DELETE(
  req: Request,
 { params }: { params: { id: string } }

) {
  const { db } = await connectToDatabase();

  try {
    await db.collection("cart").deleteOne({ _id: new ObjectId(params.id) });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

// ✅ Update quantity
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { db } = await connectToDatabase();
  const { qty } = await req.json();

  try {
    const result = await db.collection("cart").updateOne(
      { _id: new ObjectId(params.id) },
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
