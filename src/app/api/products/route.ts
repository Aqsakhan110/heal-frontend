import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { userId } = getAuth(req);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Example medicines list
  const medicines = [
    { id: "med_1", name: "Paracetamol 500mg", price: 50 },
    { id: "med_2", name: "Ibuprofen 200mg", price: 80 },
    { id: "med_3", name: "Vitamin C 1000mg", price: 120 },
  ];

  return NextResponse.json(medicines);
}
