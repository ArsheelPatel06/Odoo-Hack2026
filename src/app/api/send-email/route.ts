import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { to, subject, html } = await req.json();

    if (!to || !subject || !html) {
      return NextResponse.json(
        { error: 'Missing required fields (to, subject, html)' },
        { status: 400 }
      );
    }

    // Check if credentials are provided in .env
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!user || !pass) {
      // If no credentials, just simulate a successful send for the hackathon
      console.warn("No SMTP_USER or SMTP_PASS found in .env. Simulating email send.");
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network latency
      return NextResponse.json({ success: true, simulated: true });
    }

    // Create a Nodemailer transporter using SMTP
    // Defaulting to Gmail for ease of use, but works with any standard SMTP provider
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user,
        pass,
      },
    });

    // Send the email
    const info = await transporter.sendMail({
      from: `"TransitOps Platform" <${user}>`,
      to,
      subject,
      html,
    });

    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error: any) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send email' },
      { status: 500 }
    );
  }
}
