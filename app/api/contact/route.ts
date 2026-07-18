import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const name = String(payload.name ?? "").trim();
    const email = String(payload.email ?? "").trim();
    const subject = String(payload.subject ?? "").trim();
    const phone = String(payload.phone ?? "").trim();
    const message = String(payload.message ?? "").trim();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Alle Felder sind erforderlich" },
        { status: 400 }
      );
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json(
        { error: "Bitte gib eine gültige E-Mail-Adresse ein" },
        { status: 400 }
      );
    }

    // Zeilenumbrüche dürfen nicht in E-Mail-Header gelangen.
    const safeSubject = subject.replace(/[\r\n]+/g, " ").slice(0, 150);
    const safeName = name.replace(/[\r\n]+/g, " ").slice(0, 100);

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
      subject: `Kontaktanfrage: ${safeSubject}`,
      text: `Betreff: ${safeSubject}\nName: ${safeName}\nE-Mail: ${email}${phone ? `\nTelefon: ${phone}` : ""}\n\nNachricht:\n${message}`,
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
