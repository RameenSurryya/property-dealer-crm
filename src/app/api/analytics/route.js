import { NextResponse } from "next/server";
import Lead from "@/models/Lead";
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
        { message: "Only admin can view analytics" },
        { status: 403 }
      );
    }

    const totalLeads = await Lead.countDocuments();

    const statusDistribution = await Lead.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const priorityDistribution = await Lead.aggregate([
      {
        $group: {
          _id: "$score",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const agentPerformance = await Lead.aggregate([
      {
        $match: {
          assignedTo: { $ne: null },
        },
      },
      {
        $group: {
          _id: "$assignedTo",
          totalAssigned: { $sum: 1 },
          closedLeads: {
            $sum: {
              $cond: [{ $eq: ["$status", "Closed"] }, 1, 0],
            },
          },
          inProgressLeads: {
            $sum: {
              $cond: [{ $eq: ["$status", "In Progress"] }, 1, 0],
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "agent",
        },
      },
      {
        $unwind: "$agent",
      },
      {
        $project: {
          _id: 1,
          agentName: "$agent.name",
          agentEmail: "$agent.email",
          totalAssigned: 1,
          closedLeads: 1,
          inProgressLeads: 1,
        },
      },
    ]);

    const agentsCount = await User.countDocuments({ role: "agent" });

    return NextResponse.json({
      totalLeads,
      agentsCount,
      statusDistribution,
      priorityDistribution,
      agentPerformance,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch analytics", error: error.message },
      { status: 500 }
    );
  }
}