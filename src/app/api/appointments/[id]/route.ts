import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";

// GET → fetch appointment by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase();
    const appointment = await db.collection("appointments").findOne({ _id: new ObjectId(params.id) });

    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    return NextResponse.json(appointment);
  } catch (err: any) {
    console.error("❌ Error fetching appointment:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE → remove appointment by ID
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase();
    const result = await db.collection("appointments").deleteOne({ _id: new ObjectId(params.id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("❌ Error deleting appointment:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
