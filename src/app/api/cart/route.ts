// import { NextResponse } from "next/server";
// import { connectToDatabase } from "@/lib/mongodb";

// // GET: Fetch cart items
// export async function GET(req: Request) {
//   const { db } = await connectToDatabase();

//   try {
//     const url = new URL(req.url);
//     const userId = url.searchParams.get("userId");

//     if (!userId) {
//       return NextResponse.json([], { status: 200 });
//     }

//     const cartItems = await db.collection("cart").find({ userId }).toArray();

//     // ✅ Ensure image URL is returned
//     const formattedItems = cartItems.map(item => ({
//       _id: item._id,
//       name: item.name,
//       price: item.price,
//       qty: item.qty,
//       image: item.image, // full URL from DB
//     }));

//     return NextResponse.json(formattedItems, { status: 200 });
//   } catch (error) {
//     return NextResponse.json([], { status: 500 });
//   }
// }

// // POST: Add item to cart
// export async function POST(req: Request) {
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
//         image, // ✅ save full URL
//         qty: 1,
//       });
//     }

//     const updatedCart = await db.collection("cart").find({ userId }).toArray();
//     return NextResponse.json(updatedCart, { status: 201 });
//   } catch (error) {
//     return NextResponse.json([], { status: 500 });
//   }
// }
// import { NextResponse } from "next/server";
// import { connectToDatabase } from "@/lib/mongodb";

// // GET: Fetch cart items
// export async function GET(req: Request) {
//   const { db } = await connectToDatabase();

//   try {
//     const url = new URL(req.url);
//     const userId = url.searchParams.get("userId");

//     if (!userId) {
//       return NextResponse.json([], { status: 200 });
//     }

//     const cartItems = await db.collection("cart").find({ userId }).toArray();

//     const formattedItems = cartItems.map(item => ({
//       _id: item._id,
//       name: item.name,
//       price: item.price,
//       qty: item.qty,
//       image: item.image,
//     }));

//     return NextResponse.json(formattedItems, { status: 200 });
//   } catch (error) {
//     return NextResponse.json([], { status: 500 });
//   }
// }

// // POST: Add item to cart
// export async function POST(req: Request) {
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
//     return NextResponse.json(updatedCart, { status: 201 });
//   } catch (error) {
//     return NextResponse.json([], { status: 500 });
//   }
// }

// // DELETE: Remove item from cart
// export async function DELETE(req: Request) {
//   const { db } = await connectToDatabase();

//   try {
//     const body = await req.json();
//     const { userId, medicineId } = body;

//     if (!userId || !medicineId) {
//       return NextResponse.json({ error: "Missing userId or medicineId" }, { status: 400 });
//     }

//     await db.collection("cart").deleteOne({ userId, medicineId });

//     const updatedCart = await db.collection("cart").find({ userId }).toArray();
//     return NextResponse.json(updatedCart, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
//   }
// }



// import { NextResponse } from "next/server";
// import { connectToDatabase } from "@/lib/mongodb";
// import { ObjectId } from "mongodb";

// // GET: Fetch cart items
// export async function GET(req: Request) {
//   const { db } = await connectToDatabase();

//   try {
//     const url = new URL(req.url);
//     const userId = url.searchParams.get("userId");

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

// // POST: Add item to cart
// export async function POST(req: Request) {
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

// // DELETE: Remove item from cart
// export async function DELETE(req: Request) {
//   const { db } = await connectToDatabase();

//   try {
//     const body = await req.json();
//     const { userId, medicineId } = body;

//     if (!userId || !medicineId) {
//       return NextResponse.json({ error: "Missing userId or medicineId" }, { status: 400 });
//     }

//     await db.collection("cart").deleteOne({ userId, medicineId });

//     const updatedCart = await db.collection("cart").find({ userId }).toArray();

//     const formattedItems = updatedCart.map((item) => ({
//       _id: item._id.toString(),
//       name: item.name,
//       price: item.price,
//       qty: item.qty,
//       image: item.image,
//     }));

//     return NextResponse.json(formattedItems, { status: 200 });
//   } catch (error) {
//     console.error("DELETE /cart error:", error);
//     return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
//   }
// }
// import { NextResponse } from "next/server";
// import { connectToDatabase } from "@/lib/mongodb";
// import { ObjectId } from "mongodb";

// // GET: Fetch cart items
// export async function GET(req: Request) {
//   const { db } = await connectToDatabase();

//   try {
//     const url = new URL(req.url);
//     const userId = url.searchParams.get("userId");

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

// // POST: Add item to cart
// export async function POST(req: Request) {
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

// // DELETE: Remove item from cart by _id
// export async function DELETE(req: Request) {
//   const { db } = await connectToDatabase();

//   try {
//     const url = new URL(req.url);
//     const id = url.pathname.split("/").pop(); // ✅ extract id from URL

//     if (!id) {
//       return NextResponse.json({ error: "Missing cart item id" }, { status: 400 });
//     }

//     await db.collection("cart").deleteOne({ _id: new ObjectId(id) });

//     return NextResponse.json({ success: true }, { status: 200 });
//   } catch (error) {
//     console.error("DELETE /cart error:", error);
//     return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
//   }
// }
import { NextResponse, NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// GET: Fetch cart items
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
    }));

    return NextResponse.json(formattedItems, { status: 200 });
  } catch (error) {
    console.error("GET /cart error:", error);
    return NextResponse.json([], { status: 500 });
  }
}

// POST: Add item to cart
export async function POST(req: NextRequest) {
  const { db } = await connectToDatabase();

  try {
    const body = await req.json();
    const { userId, medicineId, name, price, image } = body;

    const existingItem = await db.collection("cart").findOne({ userId, medicineId });

    if (existingItem) {
      await db.collection("cart").updateOne(
        { _id: existingItem._id },
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
      });
    }

    const updatedCart = await db.collection("cart").find({ userId }).toArray();

    const formattedItems = updatedCart.map((item) => ({
      _id: item._id.toString(),
      name: item.name,
      price: item.price,
      qty: item.qty,
      image: item.image,
    }));

    return NextResponse.json(formattedItems, { status: 201 });
  } catch (error) {
    console.error("POST /cart error:", error);
    return NextResponse.json([], { status: 500 });
  }
}

// DELETE: Remove item from cart by _id
export async function DELETE(req: NextRequest) {
  const { db } = await connectToDatabase();

  try {
    const id = req.nextUrl.pathname.split("/").pop();

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid cart item id" }, { status: 400 });
    }

    await db.collection("cart").deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("DELETE /cart error:", error);
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}
