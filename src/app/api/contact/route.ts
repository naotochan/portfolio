import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // For now, log the contact form submission
    // Replace with Resend or other email service when ready
    console.log("Contact form submission:", { name, email, subject, message });

    // TODO: Integrate with email service
    // Example with Resend:
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'portfolio@yourdomain.com',
    //   to: 'your@email.com',
    //   subject: `[Portfolio] ${subject}: ${name}`,
    //   text: `From: ${name} (${email})\n\n${message}`,
    // });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
