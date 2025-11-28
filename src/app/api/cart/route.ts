// import { NextResponse, NextRequest } from "next/server";
// import { connectToDatabase } from "@/lib/mongodb";
// import { ObjectId } from "mongodb";

// // ✅ GET: Fetch cart items for a user
// export async function GET(req: NextRequest) {
//   const { db } = await connectToDatabase();

//   try {
//     const userId = req.nextUrl.searchParams.get("userId");

//     if (!userId) {
//       return NextResponse.json([], { status: 200 });
//     }

//     const cartItems = await db.collection("cart").find({ userId }).toArray();

//     const formattedItems = cartItems.map((item) => ({
//       _id: item._id.toString(),
//       name: item.name,
//       price: item.price,
//       qty: item.qty,
//       image: item.image,
//     }));

//     return NextResponse.json(formattedItems, { status: 200 });
//   } catch (error) {
//     console.error("GET /cart error:", error);
//     return NextResponse.json([], { status: 500 });
//   }
// }

// // ✅ POST: Add item to cart
// export async function POST(req: NextRequest) {
//   const { db } = await connectToDatabase();

//   try {
//     const body = await req.json();
//     const { userId, medicineId, name, price, image } = body;

//     const existingItem = await db.collection("cart").findOne({ userId, medicineId });

//     if (existingItem) {
//       await db.collection("cart").updateOne(
//         { _id: existingItem._id },
//         { $inc: { qty: 1 } }
//       );
//     } else {
//       await db.collection("cart").insertOne({
//         userId,
//         medicineId,
//         name,
//         price,
//         image,
//         qty: 1,
//       });
//     }

//     const updatedCart = await db.collection("cart").find({ userId }).toArray();

//     const formattedItems = updatedCart.map((item) => ({
//       _id: item._id.toString(),
//       name: item.name,
//       price: item.price,
//       qty: item.qty,
//       image: item.image,
//     }));

//     return NextResponse.json(formattedItems, { status: 201 });
//   } catch (error) {
//     console.error("POST /cart error:", error);
//     return NextResponse.json([], { status: 500 });
//   }
// }

export const runtime = "nodejs";
import { NextResponse, NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// GET — fetch cart items for a user
export async function GET(req: NextRequest) {
  try {
    const db  = await connectToDatabase();
    const userId = req.nextUrl.searchParams.get("userId");

    if (!userId) return NextResponse.json([], { status: 200 });

    const cartItems = await db.collection("cart").find({ userId }).toArray();

    return NextResponse.json(
      cartItems.map((item: any) => ({
        _id: item._id.toString(),
        name: item.name,
        price: item.price,
        qty: item.qty,
        image: item.image,
        medicineId: item.medicineId,
      })),
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /cart error:", error);
    return NextResponse.json([], { status: 500 });
  }
}

// POST — add new item
export async function POST(req: NextRequest) {
  try {
    const db  = await connectToDatabase();
    const body = await req.json();
    const { userId, medicineId, name, price, image } = body;

    if (!userId || !medicineId) {
      return NextResponse.json({ error: "Missing userId or medicineId" }, { status: 400 });
    }

    // Check if item already exists
    const existing = await db.collection("cart").findOne({ userId, medicineId });
    if (existing) {
      await db.collection("cart").updateOne(
        { _id: existing._id },
        { $inc: { qty: 1 } }
      );
    } else {
      await db.collection("cart").insertOne({
        userId,
        medicineId,
        name,
        price,
        image,
        qty: 1,
        createdAt: new Date(),
      });
    }

    const updatedCart = await db.collection("cart").find({ userId }).toArray();

    return NextResponse.json(
      updatedCart.map((item: any) => ({
        _id: item._id.toString(),
        name: item.name,
        price: item.price,
        qty: item.qty,
        image: item.image,
        medicineId: item.medicineId,
      })),
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /cart error:", error);
    return NextResponse.json([], { status: 500 });
  }
}

// PATCH — update quantity
export async function PATCH(req: NextRequest) {
  try {
    const db  = await connectToDatabase();
    const body = await req.json();
    const { _id, qty, userId } = body;

    if (!_id || qty === undefined || !userId) {
      return NextResponse.json({ error: "Missing _id, qty, or userId" }, { status: 400 });
    }

    const result = await db.collection("cart").updateOne(
      { _id: new ObjectId(_id) },
      { $set: { qty } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: "Update failed" }, { status: 404 });
    }

    const updatedCart = await db.collection("cart").find({ userId }).toArray();

    return NextResponse.json(
      updatedCart.map((item: any) => ({
        _id: item._id.toString(),
        name: item.name,
        price: item.price,
        qty: item.qty,
        image: item.image,
        medicineId: item.medicineId,
      })),
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH /cart error:", error);
    return NextResponse.json([], { status: 500 });
  }
}

// DELETE — remove item
export async function DELETE(req: NextRequest) {
  try {
    const db  = await connectToDatabase();
    const { searchParams } = req.nextUrl;
    const _id = searchParams.get("_id");
    const userId = searchParams.get("userId");

    if (!_id || !userId) {
      return NextResponse.json({ error: "Missing _id or userId" }, { status: 400 });
    }

    await db.collection("cart").deleteOne({ _id: new ObjectId(_id) });

    const updatedCart = await db.collection("cart").find({ userId }).toArray();

    return NextResponse.json(
      updatedCart.map((item: any) => ({
        _id: item._id.toString(),
        name: item.name,
        price: item.price,
        qty: item.qty,
        image: item.image,
        medicineId: item.medicineId,
      })),
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /cart error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
