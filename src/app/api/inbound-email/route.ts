import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("resend-signature") || "";
    const secret = process.env.RESEND_SIGNING_SECRET || "";

    // ✅ Verify Resend signature
    const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
    if (signature !== expected) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const emailBody = payload.text || payload.html || "";
    const fromEmail = payload.from?.address;

    console.log("Inbound email received:", { fromEmail, emailBody });

    // ✅ Check if reply contains CONFIRM
    if (emailBody.toLowerCase().includes("confirm")) {
      const { db } = await connectToDatabase();

      const order = await db.collection("orders").findOne({
        email: fromEmail,
        status: "pending",
      });

      if (order) {
        await db.collection("orders").updateOne(
          { _id: order._id },
          { $set: { status: "confirmed", confirmedAt: new Date() } }
        );

        return NextResponse.json({ success: true, message: "Order confirmed" });
      }
    }

    return NextResponse.json({ success: false, message: "No CONFIRM found" });
  } catch (err: any) {
    console.error("Inbound error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
