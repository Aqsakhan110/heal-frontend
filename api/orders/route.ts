import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server"; // ✅ Add this

export async function GET(req: NextRequest) {
  const { userId } = getAuth(req); // ✅ No need to await

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = [
    {
      id: "ord_1",
      userId,
      product: "Amoxicillin 500mg",
      quantity: 2,
      createdAt: new Date().toISOString(),
    },
    {
      id: "ord_2",
      userId,
      product: "Vitamin D3 2000 IU",
      quantity: 1,
      createdAt: new Date().toISOString(),
    },
  ];

  return NextResponse.json(orders);
}
