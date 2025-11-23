
// File: src/app/api/appointments/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/mongodb";
import nodemailer from "nodemailer";

const clinicEmail = "aqsakhan984@gmail.com";
const clinicPhone = "+92-341-0233773";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { patientName, email, phone, doctor, specialty, date, time } = body;

    // ✅ Validate required fields
    if (!patientName || !email || !phone || !doctor || !date || !time) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ✅ Save appointment in MongoDB
    const { db } = await connectToDatabase();
    const result = await db.collection("appointments").insertOne({
      patientName,
      email,
      phone,
      doctor,
      specialty,
      date,
      time,
      createdAt: new Date(),
    });

    console.log("✅ Appointment saved:", result.insertedId);

    // ✅ Send confirmation email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"HealSync" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Appointment Confirmation - HealSync",
      html: `
        <h2 style="color:#059669;">Thank you for booking with HealSync</h2>
        <p>Dear ${patientName},</p>
        <p>Your appointment with <strong>${doctor}</strong> (${specialty}) 
        on <strong>${date}</strong> at <strong>${time}</strong> has been successfully booked.</p>
        <p>Contact us for payment or queries:</p>
        <ul>
          <li>Email: ${clinicEmail}</li>
          <li>Phone: ${clinicPhone}</li>
        </ul>
        <br/>
        <p style="color:#059669;">— HealSync Team</p>
      `,
    });

    console.log("📧 Confirmation email sent to:", email);

    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (err: any) {
    console.error("❌ Error booking appointment:", err.message, err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
