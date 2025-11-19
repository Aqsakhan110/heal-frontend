

import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

// GET → fetch all medicines
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

// POST → add new medicine (admin only)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, price, image } = body;

    if (!name || !price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const result = await db.collection("medicines").insertOne({
      name,
      description,
      price,
      image,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (err) {
    console.error("❌ Error adding medicine:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// DELETE → remove medicine by _id
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { _id } = body;

    if (!_id) {
      return NextResponse.json({ error: "Missing _id" }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    await db.collection("medicines").deleteOne({ _id: new ObjectId(_id) });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Error deleting medicine:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// PUT → update medicine image by _id
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { _id, newImage } = body;

    if (!_id || !newImage) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    await db.collection("medicines").updateOne(
      { _id: new ObjectId(_id) },
      { $set: { image: newImage } }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Error updating medicine:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
// import { NextResponse } from "next/server";
// import { connectToDatabase } from "../../../lib/mongodb";
// import { ObjectId } from "mongodb";

// // GET → fetch medicines with pagination
// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const page = parseInt(searchParams.get("page") || "1", 10); // default page 1
//     const limit = 9; // ✅ always return 9 per page
//     const skip = (page - 1) * limit;

//     const { db } = await connectToDatabase();
//     const medicines = await db
//       .collection("medicines")
//       .find({})
//       .skip(skip)
//       .limit(limit)
//       .toArray();

//     const total = await db.collection("medicines").countDocuments();

//     return NextResponse.json({
//       medicines,
//       total,
//       page,
//       totalPages: Math.ceil(total / limit),
//     });
//   } catch (err) {
//     console.error("❌ Error fetching medicines:", err);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }

// // POST → add new medicine
// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { name, description, price, image } = body;

//     if (!name || !price) {
//       return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
//     }

//     const { db } = await connectToDatabase();
//     const result = await db.collection("medicines").insertOne({
//       name,
//       description,
//       price,
//       image,
//       createdAt: new Date(),
//     });

//     return NextResponse.json({ success: true, id: result.insertedId });
//   } catch (err) {
//     console.error("❌ Error adding medicine:", err);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }

// // DELETE → remove medicine by _id
// export async function DELETE(req: Request) {
//   try {
//     const body = await req.json();
//     const { _id } = body;

//     if (!_id) {
//       return NextResponse.json({ error: "Missing _id" }, { status: 400 });
//     }

//     const { db } = await connectToDatabase();
//     await db.collection("medicines").deleteOne({ _id: new ObjectId(_id) });

//     return NextResponse.json({ success: true });
//   } catch (err) {
//     console.error("❌ Error deleting medicine:", err);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }

// // PUT → update medicine (image or other fields) by _id
// export async function PUT(req: Request) {
//   try {
//     const body = await req.json();
//     const { _id, name, description, price, image } = body;

//     if (!_id) {
//       return NextResponse.json({ error: "Missing _id" }, { status: 400 });
//     }

//     const updateFields: any = {};
//     if (name) updateFields.name = name;
//     if (description) updateFields.description = description;
//     if (price) updateFields.price = price;
//     if (image) updateFields.image = image;

//     const { db } = await connectToDatabase();
//     await db.collection("medicines").updateOne(
//       { _id: new ObjectId(_id) },
//       { $set: updateFields }
//     );

//     return NextResponse.json({ success: true });
//   } catch (err) {
//     console.error("❌ Error updating medicine:", err);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }
