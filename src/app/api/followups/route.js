import { NextResponse } from "next/server";
import FollowUp from "@/models/FollowUp";
import Lead from "@/models/Lead";
import Activity from "@/models/Activity";
import { connectDB } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request) {
  try {
    await connectDB();

    const user = await getCurrentUser(request);

    if (!user) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    const query = {};

    if (user.role === "agent") {
      query.agent = user._id;
    }

    const followUps = await FollowUp.find(query)
      .populate("lead", "name phone propertyInterest status score")
      .populate("agent", "name email role")
      .sort({ followUpDate: 1 });

    return NextResponse.json({ followUps });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch follow-ups", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();

    const user = await getCurrentUser(request);

    if (!user) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    const { leadId, followUpDate, note } = await request.json();

    if (!leadId || !followUpDate) {
      return NextResponse.json(
        { message: "Lead and follow-up date are required" },
        { status: 400 }
      );
    }

    const lead = await Lead.findById(leadId);

    if (!lead) {
      return NextResponse.json({ message: "Lead not found" }, { status: 404 });
    }

    if (
      user.role === "agent" &&
      (!lead.assignedTo || lead.assignedTo.toString() !== user._id.toString())
    ) {
      return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    const agentId = lead.assignedTo || user._id;

    const followUp = await FollowUp.create({
      lead: leadId,
      agent: agentId,
      followUpDate,
      note: note || "",
    });

    lead.followUpDate = followUpDate;
    lead.lastActivityAt = new Date();
    await lead.save();

    await Activity.create({
      lead: lead._id,
      user: user._id,
      action: "Follow-up Scheduled",
      details: `${user.name} scheduled a follow-up for ${new Date(
        followUpDate
      ).toLocaleDateString()}`,
    });

    return NextResponse.json(
      { message: "Follow-up scheduled successfully", followUp },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to schedule follow-up", error: error.message },
      { status: 500 }
    );
  }
}