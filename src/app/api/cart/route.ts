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

import { NextResponse, NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

// ✅ GET: Fetch cart items for a user
export async function GET(req: NextRequest) {
  const { db } = await connectToDatabase();

  try {
    const userId = req.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json([], { status: 200 });
    }

    const cartItems = await db.collection("cart").find({ userId }).toArray();

    const formattedItems = cartItems.map((item) => ({
      _id: item._id.toString(),
      name: item.name,
      price: item.price,
      qty: item.qty,
      image: item.image,
      medicineId: item.medicineId,
    }));

    return NextResponse.json(formattedItems, { status: 200 });
  } catch (error) {
    console.error("GET /cart error:", error);
    return NextResponse.json([], { status: 500 });
  }
}

// ✅ POST: Always add a new item to cart (no merging)
export async function POST(req: NextRequest) {
  const { db } = await connectToDatabase();

  try {
    const body = await req.json();
    const { userId, medicineId, name, price, image } = body;

    if (!userId || !medicineId) {
      return NextResponse.json(
        { error: "Missing userId or medicineId" },
        { status: 400 }
      );
    }

    // Always insert a new document
    await db.collection("cart").insertOne({
      userId,
      medicineId,
      name,
      price,
      image,
      qty: 1,
      createdAt: new Date(),
    });

    // Return updated cart for this user
    const updatedCart = await db.collection("cart").find({ userId }).toArray();

    const formattedItems = updatedCart.map((item) => ({
      _id: item._id.toString(),
      name: item.name,
      price: item.price,
      qty: item.qty,
      image: item.image,
      medicineId: item.medicineId,
    }));

    return NextResponse.json(formattedItems, { status: 201 });
  } catch (error) {
    console.error("POST /cart error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
