import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/mongodb";

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const medicines = await db.collection("medicines").find().toArray();
    return NextResponse.json(medicines);
  } catch (err) {
    console.error("❌ Error fetching medicines:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
