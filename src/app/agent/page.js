"use client";

import { useEffect, useState } from "react";
import DashboardNav from "@/components/dashboard/DashboardNav";
import { getLeadPriorityColor, formatDate } from "@/lib/utils";

export default function AgentDashboard() {
  const [leads, setLeads] = useState([]);
  const [followups, setFollowups] = useState(null);

  useEffect(() => {
    async function loadData() {
      const leadsRes = await fetch("/api/leads");
      const leadsData = await leadsRes.json();
      setLeads(leadsData.leads || []);

      const followRes = await fetch("/api/followups/overdue");
      const followData = await followRes.json();
      setFollowups(followData);
    }

    loadData();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100">
      <DashboardNav role="agent" />

      <section className="p-6">
        <h2 className="text-2xl font-bold text-gray-900">Agent Dashboard</h2>
        <p className="text-gray-600 mt-1">
          View assigned leads and pending follow-ups.
        </p>

        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white p-5 rounded-xl shadow">
            <p className="text-gray-500 text-sm">Assigned Leads</p>
            <h3 className="text-3xl font-bold mt-2">{leads.length}</h3>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <p className="text-gray-500 text-sm">Overdue Follow-ups</p>
            <h3 className="text-3xl font-bold mt-2">
              {followups?.overdueFollowUps?.length ?? 0}
            </h3>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <p className="text-gray-500 text-sm">Stale Leads</p>
            <h3 className="text-3xl font-bold mt-2">
              {followups?.staleLeads?.length ?? 0}
            </h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow mt-6">
          <h3 className="font-bold text-lg">My Leads</h3>

          <div className="grid md:grid-cols-2 gap-4 mt-4">
            {leads.map((lead) => (
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
                <p className="text-sm mt-1">Status: {lead.status}</p>
                <p className="text-sm mt-1">
                  Follow-up: {formatDate(lead.followUpDate)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}