import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { getCurrentUser, requireRole } from "@/lib/auth";

export async function POST(request) {
  try {
    const user = await getCurrentUser(request);

    if (!user) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    if (!requireRole(user, ["admin"])) {
      return NextResponse.json(
        { message: "Only admin can send notifications" },
        { status: 403 }
      );
    }

    const { to, subject, html } = await request.json();

    if (!to || !subject || !html) {
      return NextResponse.json(
        { message: "Email recipient, subject, and body are required" },
        { status: 400 }
      );
    }

    await sendEmail({ to, subject, html });

    return NextResponse.json({ message: "Email notification sent successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to send email", error: error.message },
      { status: 500 }
    );
  }
}