import { NextResponse } from "next/server";
import Lead from "@/models/Lead";
import Activity from "@/models/Activity";
import { connectDB } from "@/lib/db";
import { getCurrentUser, requireRole } from "@/lib/auth";
import { rateLimit } from "@/middleware/rateLimit";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const user = await getCurrentUser(request);

    if (!user) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    const rateLimitResponse = rateLimit(request, user);

    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const { id } = await params;

    const lead = await Lead.findById(id).populate("assignedTo", "name email role");

    if (!lead) {
      return NextResponse.json({ message: "Lead not found" }, { status: 404 });
    }

    if (
      user.role === "agent" &&
      (!lead.assignedTo || lead.assignedTo._id.toString() !== user._id.toString())
    ) {
      return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    return NextResponse.json({ lead });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch lead", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();

    const user = await getCurrentUser(request);

    if (!user) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    const rateLimitResponse = rateLimit(request, user);

    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const { id } = await params;
    const body = await request.json();

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

    const previousAssignedTo = lead.assignedTo?.toString();
    const previousStatus = lead.status;

    lead.name = body.name ?? lead.name;
    lead.email = body.email ?? lead.email;
    lead.phone = body.phone ?? lead.phone;
    lead.propertyInterest = body.propertyInterest ?? lead.propertyInterest;
    lead.budget = body.budget ? Number(body.budget) : lead.budget;
    lead.status = body.status ?? lead.status;
    lead.notes = body.notes ?? lead.notes;
    lead.assignedTo = body.assignedTo ?? lead.assignedTo;
    lead.source = body.source ?? lead.source;
    lead.followUpDate = body.followUpDate ?? lead.followUpDate;
    lead.lastActivityAt = new Date();

    await lead.save();

    let action = "Lead Updated";
    let details = `${user.name} updated lead ${lead.name}`;

    if (body.assignedTo && body.assignedTo !== previousAssignedTo) {
      action = "Lead Assigned";
      details = `${user.name} assigned or reassigned lead ${lead.name}`;
    } else if (body.status && body.status !== previousStatus) {
      action = "Status Updated";
      details = `${user.name} changed status from ${previousStatus} to ${lead.status}`;
    }

    await Activity.create({
      lead: lead._id,
      user: user._id,
      action,
      details,
    });

    return NextResponse.json({ message: "Lead updated successfully", lead });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update lead", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const user = await getCurrentUser(request);

    if (!user) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    if (!requireRole(user, ["admin"])) {
      return NextResponse.json(
        { message: "Only admin can delete leads" },
        { status: 403 }
      );
    }

    const { id } = await params;

    const lead = await Lead.findByIdAndDelete(id);

    if (!lead) {
      return NextResponse.json({ message: "Lead not found" }, { status: 404 });
    }

    await Activity.deleteMany({ lead: id });

    return NextResponse.json({ message: "Lead deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete lead", error: error.message },
      { status: 500 }
    );
  }
}