// // // import { NextResponse } from "next/server";
// // // import { connectToDatabase } from "../../../lib/mongodb";

// // // // GET → fetch all appointments
// // // export async function GET() {
// // //   try {
// // //     const { db } = await connectToDatabase();
// // //     const appointments = await db.collection("appointments").find().toArray();

// // //     console.log("📤 Returning appointments:", appointments); // debug log
// // //     return NextResponse.json(appointments);
// // //   } catch (err) {
// // //     console.error("❌ Error fetching appointments:", err);
// // //     return NextResponse.json({ error: "Server error" }, { status: 500 });
// // //   }
// // // }

// // // // POST → create new appointment
// // // export async function POST(req: Request) {
// // //   try {
// // //     const body = await req.json();
// // //     console.log("📥 Received appointment:", body); // debug log

// // //     const { patientName, email, doctor, doctorId, specialty, date, time } = body;

// // //     // Validation
// // //     if (!patientName || !email || !doctorId || !date || !time) {
// // //       return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
// // //     }

// // //     const { db } = await connectToDatabase();
// // //     const result = await db.collection("appointments").insertOne({
// // //       patientName,
// // //       email,
// // //       doctor,
// // //       doctorId,
// // //       specialty,
// // //       date,
// // //       time,
// // //       createdAt: new Date(),
// // //     });

// // //     console.log("✅ Inserted appointment with ID:", result.insertedId);

// // //     return NextResponse.json({ success: true, id: result.insertedId });
// // //   } catch (err) {
// // //     console.error("❌ Error creating appointment:", err);
// // //     return NextResponse.json({ error: "Server error" }, { status: 500 });
// // //   }
// // // }
// // import { NextResponse } from "next/server";
// // import { connectToDatabase } from "../../../lib/mongodb";

// // export async function GET() {
// //   try {
// //     const { db } = await connectToDatabase();
// //     const appointments = await db.collection("appointments").find().toArray();
// //     return NextResponse.json(appointments);
// //   } catch (err) {
// //     console.error("❌ Error fetching appointments:", err);
// //     return NextResponse.json({ error: "Server error" }, { status: 500 });
// //   }
// // }

// // export async function POST(req: Request) {
// //   try {
// //     const body = await req.json();
// //     const { db } = await connectToDatabase();
// //     const result = await db.collection("appointments").insertOne(body);
// //     return NextResponse.json({ success: true, id: result.insertedId });
// //   } catch (err) {
// //     console.error("❌ Error creating appointment:", err);
// //     return NextResponse.json({ error: "Server error" }, { status: 500 });
// //   }
// // }
// import { NextResponse } from "next/server";
// import { connectToDatabase } from "../../../lib/mongodb";
// import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY);

// // ✅ Clinic contact info (shared with all patients)
// const clinicEmail = "aqsakhan984@gmail.co";   // replace with your real clinic email
// const clinicPhone = "+92-341-0233773";       // replace with your real clinic phone

// // GET → fetch all appointments
// export async function GET() {
//   try {
//     const { db } = await connectToDatabase();
//     const appointments = await db.collection("appointments").find().toArray();
//     return NextResponse.json(appointments);
//   } catch (err) {
//     console.error("❌ Error fetching appointments:", err);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }

// // POST → create new appointment + send confirmation email
// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { patientName, email, doctor, specialty, date, time } = body;

//     // ✅ Validation
//     if (!patientName || !email || !doctor || !date || !time) {
//       return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
//     }

//     const { db } = await connectToDatabase();
//     const result = await db.collection("appointments").insertOne({
//       patientName,
//       email,
//       doctor,
//       specialty,
//       date,
//       time,

//       createdAt: new Date(),
//     });

//     console.log("✅ Inserted appointment with ID:", result.insertedId);

//     // ✅ Send confirmation email to patient with clinic contact info
//     const response = await resend.emails.send({
//       from: "onboarding@resend.dev", // sandbox sender (replace with verified domain later)
//       to: email,
//       subject: "Appointment Confirmation - HealSync",
//       html: `
//         <h2 style="color:#059669;">Thank you for booking with HealSync</h2>
//         <p>Dear ${patientName},</p>
//         <p>Your appointment with <strong>${doctor}</strong> 
//         (${specialty}) on <strong>${date}</strong> at <strong>${time}</strong> 
//         has been successfully booked.</p>
//         <p>You can contact us for payment or queries:</p>
//         <ul>
//           <li>Email: ${clinicEmail}</li>
//           <li>Phone: ${clinicPhone}</li>
//         </ul>
//         <br/>
//         <p style="color:#059669;">— HealSync Team</p>
//       `,
//     });

//     console.log("📧 Resend response:", response);

//     return NextResponse.json({ success: true, id: result.insertedId });
//   } catch (err) {
//     console.error("❌ Error creating appointment:", err);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }
import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/mongodb";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// ✅ Clinic contact info (shared with all patients)
const clinicEmail = "aqsakhan984@gmail.com";   // replace with your real clinic email
const clinicPhone = "+92-341-0233773";         // replace with your real clinic phone

// GET → fetch all appointments
export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const appointments = await db.collection("appointments").find().toArray();
    return NextResponse.json(appointments);
  } catch (err) {
    console.error("❌ Error fetching appointments:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST → create new appointment + send confirmation email
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { patientName, email, phone, doctor, specialty, date, time } = body;

    // ✅ Validation
    if (!patientName || !email || !phone || !doctor || !date || !time) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const result = await db.collection("appointments").insertOne({
      patientName,
      email,
      phone,          // ✅ save patient phone number
      doctor,
      specialty,
      date,
      time,
      createdAt: new Date(),
    });

    console.log("✅ Inserted appointment with ID:", result.insertedId);

    // ✅ Send confirmation email to patient with clinic contact info
    const response = await resend.emails.send({
      from: "onboarding@resend.dev", // sandbox sender (replace with verified domain later)
      to: email,
      subject: "Appointment Confirmation - HealSync",
      html: `
        <h2 style="color:#059669;">Thank you for booking with HealSync</h2>
        <p>Dear ${patientName},</p>
        <p>Your appointment with <strong>${doctor}</strong> 
        (${specialty}) on <strong>${date}</strong> at <strong>${time}</strong> 
        has been successfully booked.</p>
        <p>You can contact us for payment or queries:</p>
        <ul>
          <li>Email: ${clinicEmail}</li>
          <li>Phone: ${clinicPhone}</li>
        </ul>
        <br/>
        <p style="color:#059669;">— HealSync Team</p>
      `,
    });

    console.log("📧 Resend response:", response);

    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (err) {
    console.error("❌ Error creating appointment:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
