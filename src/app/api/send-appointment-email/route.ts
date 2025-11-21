// app/api/send-appointment-email/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, name, doctor, date } = await req.json();

    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Your HealSync Appointment Confirmation",
      html: `
        <h2>Appointment Confirmed 🎉</h2>
        <p>Dear ${name},</p>
        <p>Your appointment has been booked successfully.</p>
        <p><b>Doctor:</b> ${doctor}</p>
        <p><b>Date:</b> ${date}</p>
        <p>Please reply <strong>CONFIRM</strong> to finalize your booking.</p>
        <p>Thank you for choosing HealSync!</p>
      `,
    });

    console.log("Resend response:", response);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Appointment email error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
