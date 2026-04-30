"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardNav from "@/components/dashboard/DashboardNav";
import {
  createWhatsAppLink,
  formatCurrency,
  formatDate,
  getLeadPriorityColor,
} from "@/lib/utils";

export default function LeadDetailsPage({ params }) {
  const [lead, setLead] = useState(null);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    async function loadData() {
      const leadRes = await fetch(`/api/leads/${params.id}`);
      const leadData = await leadRes.json();
      setLead(leadData.lead);

      const activityRes = await fetch(`/api/activities/lead/${params.id}`);
      const activityData = await activityRes.json();
      setActivities(activityData.activities || []);
    }

    loadData();
  }, [params.id]);

  if (!lead) {
    return (
      <main className="min-h-screen bg-gray-100">
        <DashboardNav role="admin" />
        <section className="p-6">Loading lead details...</section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <DashboardNav role="admin" />

      <section className="p-6 max-w-5xl mx-auto">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{lead.name}</h2>
            <p className="text-gray-600 mt-1">{lead.propertyInterest}</p>
          </div>

          <div className="flex gap-2">
            <Link
              href={`/leads/${lead._id}/edit`}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Edit
            </Link>

            <a
              href={createWhatsAppLink(
                lead.phone,
                `Hello ${lead.name}, I am contacting you regarding your property inquiry.`
              )}
              target="_blank"
              className="bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              WhatsApp
            </a>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="font-bold text-lg">Lead Information</h3>

            <div className="mt-4 space-y-2 text-sm">
              <p><strong>Email:</strong> {lead.email || "N/A"}</p>
              <p><strong>Phone:</strong> {lead.phone}</p>
              <p><strong>Budget:</strong> {formatCurrency(lead.budget)}</p>
              <p><strong>Status:</strong> {lead.status}</p>
              <p><strong>Source:</strong> {lead.source}</p>
              <p>
                <strong>Priority:</strong>{" "}
                <span
                  className={`text-xs px-2 py-1 rounded-full border ${getLeadPriorityColor(
                    lead.score
                  )}`}
                >
                  {lead.score}
                </span>
              </p>
              <p>
                <strong>Assigned To:</strong>{" "}
                {lead.assignedTo?.name || "Not assigned"}
              </p>
              <p><strong>Follow-up:</strong> {formatDate(lead.followUpDate)}</p>
              <p><strong>Created:</strong> {formatDate(lead.createdAt)}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="font-bold text-lg">Notes</h3>
            <p className="text-gray-700 mt-4 whitespace-pre-wrap">
              {lead.notes || "No notes added."}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-5 mt-6">
          <h3 className="font-bold text-lg">Activity Timeline</h3>

          <div className="mt-4 space-y-4">
            {activities.length === 0 && (
              <p className="text-gray-500">No activities recorded yet.</p>
            )}

            {activities.map((activity) => (
              <div key={activity._id} className="border-l-4 border-blue-600 pl-4 py-2">
                <p className="font-semibold">{activity.action}</p>
                <p className="text-sm text-gray-600">{activity.details}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {formatDate(activity.createdAt)} by{" "}
                  {activity.user?.name || "System"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}