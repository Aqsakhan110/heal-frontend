import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import nodemailer from "nodemailer";

const clinicEmail = "aqsakhan9849@gmail.com";
const clinicPhone = "+92-341-0233773";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { patientName, email, phone, doctor, specialty, date, time } = body;

    // Validate fields
    if (!patientName || !email || !phone || !doctor || !date || !time) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ Save to MongoDB
    const db = await connectToDatabase();
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

    // ✅ Send Email via Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER, // your Gmail
        pass: process.env.SMTP_PASS, // app password
      },
    });

    await transporter.sendMail({
      from: `"HealSync" <${process.env.SMTP_USER}>`,
      to: email, // patient email
      subject: "Your HealSync Appointment Request",
      html: `
        <h2>Appointment Request Received 🩺</h2>
        <p>Dear ${patientName},</p>
        <p>Your appointment request with <b>${doctor}</b> (${specialty}) has been received.</p>
        <p><b>Date:</b> ${date}</p>
        <p><b>Time:</b> ${time}</p>
        <p>We are processing your request and will inform you shortly.</p>
        <hr/>
        <p>For payment and queries, please contact:</p>
        <p>Email: <a href="mailto:${clinicEmail}">${clinicEmail}</a></p>
        <p>Phone: ${clinicPhone}</p>
        <br/>
        <p>Thank you for choosing HealSync!</p>
      `,
    });

    console.log("📧 Email sent to:", email);

    return NextResponse.json({
      success: true,
      id: result.insertedId,
    });
  } catch (err: any) {
    console.error("❌ Error booking appointment:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
