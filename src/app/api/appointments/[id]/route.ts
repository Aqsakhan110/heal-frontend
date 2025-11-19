// import { NextResponse } from "next/server";
// import { connectToDatabase } from "../../../../lib/mongodb";
// import { ObjectId } from "mongodb";

// // GET one appointment by ID
// export async function GET(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const { db } = await connectToDatabase();
//     const appointment = await db
//       .collection("appointments")
//       .findOne({ _id: new ObjectId(params.id) });

//     if (!appointment) {
//       return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
//     }

//     return NextResponse.json(appointment);
//   } catch (err) {
//     console.error("❌ Error fetching appointment:", err);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }

// // DELETE one appointment by ID
// export async function DELETE(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const { db } = await connectToDatabase();
//     const result = await db
//       .collection("appointments")
//       .deleteOne({ _id: new ObjectId(params.id) });

//     if (result.deletedCount === 0) {
//       return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
//     }

//     return NextResponse.json({ success: true });
//   } catch (err) {
//     console.error("❌ Error deleting appointment:", err);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }
import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";

// GET one appointment by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase();
    const appointment = await db
      .collection("appointments")
      .findOne({ _id: new ObjectId(params.id) });

    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    return NextResponse.json(appointment);
  } catch (err) {
    console.error("❌ Error fetching appointment:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// DELETE one appointment by ID
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase();
    const result = await db
      .collection("appointments")
      .deleteOne({ _id: new ObjectId(params.id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Error deleting appointment:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
