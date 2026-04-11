import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { name, type, message } = await req.json();

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"CalcHub Feedback" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: `[CalcHub ${type || "Feedback"}] from ${name || "Anonymous"}`,
      text: `Type: ${type}\nName: ${name || "Anonymous"}\n\n${message}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px;">
          <h2 style="color: #6366f1;">CalcHub Feedback</h2>
          <table style="border-collapse: collapse; width: 100%;">
            <tr><td style="padding: 8px; font-weight: bold; color: #374151;">Type</td><td style="padding: 8px;">${type || "Feedback"}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold; color: #374151;">Name</td><td style="padding: 8px;">${name || "Anonymous"}</td></tr>
          </table>
          <div style="margin-top: 16px; padding: 16px; background: #f9fafb; border-radius: 8px;">
            <p style="color: #374151; white-space: pre-wrap;">${message}</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Feedback email error:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
