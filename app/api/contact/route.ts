import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Alle Felder sind erforderlich" },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const supportEmail = process.env.CONTACT_EMAIL || process.env.SMTP_USER;
    if (!supportEmail) {
      return NextResponse.json(
        { error: "Support-E-Mail ist nicht konfiguriert" },
        { status: 500 }
      );
    }

    await transporter.sendMail({
      from: `"Website Support" <${process.env.SMTP_USER || supportEmail}>`,
      to: supportEmail,
      replyTo: email,
      subject: `Neue Support-Anfrage von ${name}`,
      text: `Name: ${name}\nE-Mail: ${email}\n\nNachricht:\n${message}`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "E-Mail konnte nicht gesendet werden" },
      { status: 500 }
    );
  }
}
