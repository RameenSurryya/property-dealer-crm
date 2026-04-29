import { NextResponse } from "next/server";
import Lead from "@/models/Lead";
import Activity from "@/models/Activity";
import { connectDB } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const user = await getCurrentUser(request);

    if (!user) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    const { id } = await params;

    const lead = await Lead.findById(id);

    if (!lead) {
      return NextResponse.json({ message: "Lead not found" }, { status: 404 });
    }

    if (
      user.role === "agent" &&
      (!lead.assignedTo || lead.assignedTo.toString() !== user._id.toString())
    ) {
      return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    const activities = await Activity.find({ lead: id })
      .populate("user", "name email role")
      .sort({ createdAt: -1 });

    return NextResponse.json({ activities });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch activity timeline", error: error.message },
      { status: 500 }
    );
  }
}