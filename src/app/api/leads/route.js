import { NextResponse } from "next/server";
import Lead from "@/models/Lead";
import Activity from "@/models/Activity";
import { connectDB } from "@/lib/db";
import { getCurrentUser, requireRole } from "@/lib/auth";
import { validateLeadData } from "@/middleware/validate";
import { rateLimit } from "@/middleware/rateLimit";

export async function GET(request) {
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

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const score = searchParams.get("score");

    const query = {};

    if (user.role === "agent") {
      query.assignedTo = user._id;
    }

    if (status) {
      query.status = status;
    }

    if (score) {
      query.score = score;
    }

    const leads = await Lead.find(query)
      .populate("assignedTo", "name email role")
      .sort({ createdAt: -1 });

    return NextResponse.json({ leads });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch leads", error: error.message },
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

    const rateLimitResponse = rateLimit(request, user);

    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const body = await request.json();

    const validation = validateLeadData(body);

    if (!validation.isValid) {
      return validation.response;
    }

    const lead = await Lead.create({
      name: body.name,
      email: body.email,
      phone: body.phone,
      propertyInterest: body.propertyInterest,
      budget: Number(body.budget),
      status: body.status || "New",
      notes: body.notes || "",
      assignedTo: body.assignedTo || null,
      source: body.source || "Other",
      followUpDate: body.followUpDate || null,
    });

    await Activity.create({
      lead: lead._id,
      user: user._id,
      action: "Lead Created",
      details: `${user.name} created a new lead for ${lead.name}`,
    });

    return NextResponse.json(
      { message: "Lead created successfully", lead },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create lead", error: error.message },
      { status: 500 }
    );
  }
}