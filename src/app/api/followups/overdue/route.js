import { NextResponse } from "next/server";
import FollowUp from "@/models/FollowUp";
import Lead from "@/models/Lead";
import { connectDB } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request) {
  try {
    await connectDB();

    const user = await getCurrentUser(request);

    if (!user) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    const now = new Date();
    const staleDate = new Date();
    staleDate.setDate(staleDate.getDate() - 7);

    const followUpQuery = {
      followUpDate: { $lt: now },
      completed: false,
    };

    const staleLeadQuery = {
      lastActivityAt: { $lt: staleDate },
      status: { $nin: ["Closed", "Lost"] },
    };

    if (user.role === "agent") {
      followUpQuery.agent = user._id;
      staleLeadQuery.assignedTo = user._id;
    }

    const overdueFollowUps = await FollowUp.find(followUpQuery)
      .populate("lead", "name phone propertyInterest status score")
      .populate("agent", "name email role")
      .sort({ followUpDate: 1 });

    const staleLeads = await Lead.find(staleLeadQuery)
      .populate("assignedTo", "name email role")
      .sort({ lastActivityAt: 1 });

    return NextResponse.json({
      overdueFollowUps,
      staleLeads,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch overdue follow-ups", error: error.message },
      { status: 500 }
    );
  }
}