import { NextResponse } from "next/server";
import User from "@/models/User";
import { connectDB } from "@/lib/db";
import { getCurrentUser, requireRole } from "@/lib/auth";

export async function GET(request) {
  try {
    await connectDB();

    const user = await getCurrentUser(request);

    if (!user) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    if (!requireRole(user, ["admin"])) {
      return NextResponse.json(
        { message: "Only admin can view agents" },
        { status: 403 }
      );
    }

    const agents = await User.find({ role: "agent" })
      .select("-password")
      .sort({ name: 1 });

    return NextResponse.json({ agents });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch agents", error: error.message },
      { status: 500 }
    );
  }
}