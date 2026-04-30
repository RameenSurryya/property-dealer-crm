"use client";

import { useEffect, useState } from "react";
import DashboardNav from "@/components/dashboard/DashboardNav";
import { formatDate, getLeadPriorityColor } from "@/lib/utils";
import Link from "next/link";

export default function FollowUpsPage() {
  const [data, setData] = useState({
    overdueFollowUps: [],
    staleLeads: [],
  });

  useEffect(() => {
    async function loadFollowUps() {
      const res = await fetch("/api/followups/overdue");
      const result = await res.json();

      setData({
        overdueFollowUps: result.overdueFollowUps || [],
        staleLeads: result.staleLeads || [],
      });
    }

    loadFollowUps();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100">
      <DashboardNav role="admin" />

      <section className="p-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Follow-up Reminders
        </h2>
        <p className="text-gray-600 mt-1">
          Track overdue follow-ups and leads with no recent activity.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="font-bold text-lg">Overdue Follow-ups</h3>

            <div className="mt-4 space-y-4">
              {data.overdueFollowUps.length === 0 && (
                <p className="text-gray-500">No overdue follow-ups.</p>
              )}

              {data.overdueFollowUps.map((followUp) => (
                <div key={followUp._id} className="border rounded-xl p-4">
                  <div className="flex justify-between gap-3">
                    <h4 className="font-bold">{followUp.lead?.name}</h4>
                    <span
                      className={`text-xs px-2 py-1 rounded-full border ${getLeadPriorityColor(
                        followUp.lead?.score
                      )}`}
                    >
                      {followUp.lead?.score}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mt-2">
                    {followUp.lead?.propertyInterest}
                  </p>

                  <p className="text-sm mt-2">
                    <strong>Due:</strong> {formatDate(followUp.followUpDate)}
                  </p>

                  <p className="text-sm mt-1">
                    <strong>Agent:</strong> {followUp.agent?.name || "N/A"}
                  </p>

                  <Link
                    href={`/leads/${followUp.lead?._id}`}
                    className="inline-block bg-blue-600 text-white px-3 py-2 rounded-lg text-sm mt-3"
                  >
                    View Lead
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="font-bold text-lg">Stale Leads</h3>

            <div className="mt-4 space-y-4">
              {data.staleLeads.length === 0 && (
                <p className="text-gray-500">No stale leads.</p>
              )}

              {data.staleLeads.map((lead) => (
                <div key={lead._id} className="border rounded-xl p-4">
                  <div className="flex justify-between gap-3">
                    <h4 className="font-bold">{lead.name}</h4>
                    <span
                      className={`text-xs px-2 py-1 rounded-full border ${getLeadPriorityColor(
                        lead.score
                      )}`}
                    >
                      {lead.score}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mt-2">
                    {lead.propertyInterest}
                  </p>

                  <p className="text-sm mt-2">
                    <strong>Status:</strong> {lead.status}
                  </p>

                  <p className="text-sm mt-1">
                    <strong>Last Activity:</strong>{" "}
                    {formatDate(lead.lastActivityAt)}
                  </p>

                  <Link
                    href={`/leads/${lead._id}`}
                    className="inline-block bg-blue-600 text-white px-3 py-2 rounded-lg text-sm mt-3"
                  >
                    View Lead
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}