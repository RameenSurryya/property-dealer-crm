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

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [status, setStatus] = useState("");
  const [score, setScore] = useState("");

  async function loadLeads() {
    const params = new URLSearchParams();

    if (status) params.append("status", status);
    if (score) params.append("score", score);

    const res = await fetch(`/api/leads?${params.toString()}`);
    const data = await res.json();

    setLeads(data.leads || []);
  }

useEffect(() => {
  loadLeads();

  const interval = setInterval(() => {
    loadLeads();
  }, 10000);

  return () => clearInterval(interval);
}, [status, score]);

  async function deleteLead(id) {
    const confirmDelete = confirm("Are you sure you want to delete this lead?");
    if (!confirmDelete) return;

    const res = await fetch(`/api/leads/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      loadLeads();
    }
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <DashboardNav role="admin" />

      <section className="p-6">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Leads</h2>
            <p className="text-gray-600 mt-1">
              Manage, filter, assign, and track property leads.
            </p>
          </div>

          <Link
            href="/leads/new"
            className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
          >
            Add New Lead
          </Link>
        </div>

        <div className="bg-white p-4 rounded-xl shadow mt-6 flex flex-wrap gap-4">
          <select
            className="border rounded-lg px-4 py-2"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="New">New</option>
            <option value="Assigned">Assigned</option>
            <option value="Contacted">Contacted</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
            <option value="Lost">Lost</option>
          </select>

          <select
            className="border rounded-lg px-4 py-2"
            value={score}
            onChange={(e) => setScore(e.target.value)}
          >
            <option value="">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <button
            onClick={() => {
              setStatus("");
              setScore("");
            }}
            className="border px-4 py-2 rounded-lg"
          >
            Clear Filters
          </button>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5 mt-6">
          {leads.map((lead) => (
            <div key={lead._id} className="bg-white rounded-xl shadow p-5">
              <div className="flex justify-between gap-3">
                <h3 className="font-bold text-lg">{lead.name}</h3>
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

              <div className="text-sm mt-4 space-y-1">
                <p>
                  <strong>Phone:</strong> {lead.phone}
                </p>
                <p>
                  <strong>Budget:</strong> {formatCurrency(lead.budget)}
                </p>
                <p>
                  <strong>Status:</strong> {lead.status}
                </p>
                <p>
                  <strong>Source:</strong> {lead.source}
                </p>
                <p>
                  <strong>Assigned To:</strong>{" "}
                  {lead.assignedTo?.name || "Not assigned"}
                </p>
                <p>
                  <strong>Follow-up:</strong> {formatDate(lead.followUpDate)}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mt-5">
                <Link
                  href={`/leads/${lead._id}`}
                  className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm"
                >
                  Details
                </Link>

                <Link
                  href={`/leads/${lead._id}/edit`}
                  className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm"
                >
                  Edit
                </Link>

                <a
                  href={createWhatsAppLink(
                    lead.phone,
                    `Hello ${lead.name}, I am contacting you regarding your property inquiry.`
                  )}
                  target="_blank"
                  className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm"
                >
                  WhatsApp
                </a>

                <button
                  onClick={() => deleteLead(lead._id)}
                  className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}