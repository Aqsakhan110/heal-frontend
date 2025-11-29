import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Make sure you have these in your .env file
// GMAIL_USER=yourstore@gmail.com
// GMAIL_APP_PASS=your_app_password

export async function POST(req: Request) {
  try {
    const { email, name, total } = await req.json();

    if (!email || !name || !total) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 1️⃣ Create Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASS,
      },
    });

    // 2️⃣ Email content
    const mailOptions = {
      from: `"Healsycn Store" <${process.env.GMAIL_USER}>`,
      to: email, // dynamically sends to the buyer
      subject: "Order Confirmation - Healsycn",
      html: `
        <h2>Thank you, ${name}!</h2>
        <p>Your order has been received.</p>
        <p><strong>Total:</strong> PKR ${total}</p>
        <p>Please reply with <strong>CONFIRM</strong> to confirm your order.</p>
        <p>We appreciate your business!</p>
      `,
    };

    // 3️⃣ Send email
    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent:", info.messageId, "to", email);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Email error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
