import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, name, total } = await req.json();

    const response = await resend.emails.send({
      from: "onboarding@resend.dev", // ✅ use default domain
      to: email,
      subject: "Confirm Your Healsycn Order",
      html: `
        <p>Thank you, ${name}, for choosing Healsycn.</p>
        <p>Your total bill is PKR ${total}.</p>
        <p>Please reply with <strong>CONFIRM</strong> to confirm your order.</p>
      `,
    });

    console.log("Resend response:", response);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Email error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
