"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardNav from "@/components/dashboard/DashboardNav";

export default function EditLeadPage({ params }) {
  const router = useRouter();
  const [agents, setAgents] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    propertyInterest: "",
    budget: "",
    status: "New",
    source: "Other",
    notes: "",
    assignedTo: "",
    followUpDate: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      const leadRes = await fetch(`/api/leads/${params.id}`);
      const leadData = await leadRes.json();

      if (leadData.lead) {
        setForm({
          name: leadData.lead.name || "",
          email: leadData.lead.email || "",
          phone: leadData.lead.phone || "",
          propertyInterest: leadData.lead.propertyInterest || "",
          budget: leadData.lead.budget || "",
          status: leadData.lead.status || "New",
          source: leadData.lead.source || "Other",
          notes: leadData.lead.notes || "",
          assignedTo: leadData.lead.assignedTo?._id || "",
          followUpDate: leadData.lead.followUpDate
            ? leadData.lead.followUpDate.slice(0, 10)
            : "",
        });
      }

      const agentsRes = await fetch("/api/users/agents");
      const agentsData = await agentsRes.json();
      setAgents(agentsData.agents || []);
    }

    loadData();
  }, [params.id]);

  function updateField(field, value) {
    setForm({ ...form, [field]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = {
      ...form,
      assignedTo: form.assignedTo || null,
      followUpDate: form.followUpDate || null,
    };

    const res = await fetch(`/api/leads/${params.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.message || "Failed to update lead");
      return;
    }

    router.push(`/leads/${params.id}`);
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <DashboardNav role="admin" />

      <section className="p-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900">Edit Lead</h2>
        <p className="text-gray-600 mt-1">
          Update lead details, status, assignment, and follow-up date.
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow p-6 mt-6 space-y-4"
        >
          {error && (
            <p className="bg-red-100 text-red-700 p-3 rounded-lg">{error}</p>
          )}

          <div>
            <label className="block text-sm font-medium">Client Name</label>
            <input
              className="w-full border rounded-lg px-4 py-3 mt-1"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              className="w-full border rounded-lg px-4 py-3 mt-1"
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Phone</label>
            <input
              className="w-full border rounded-lg px-4 py-3 mt-1"
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Property Interest
            </label>
            <input
              className="w-full border rounded-lg px-4 py-3 mt-1"
              value={form.propertyInterest}
              onChange={(e) => updateField("propertyInterest", e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Budget</label>
            <input
              className="w-full border rounded-lg px-4 py-3 mt-1"
              type="number"
              value={form.budget}
              onChange={(e) => updateField("budget", e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Assign to Agent</label>
            <select
              className="w-full border rounded-lg px-4 py-3 mt-1"
              value={form.assignedTo}
              onChange={(e) => updateField("assignedTo", e.target.value)}
            >
              <option value="">Not assigned</option>
              {agents.map((agent) => (
                <option key={agent._id} value={agent._id}>
                  {agent.name} - {agent.email}
                </option>
              ))}
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Status</label>
              <select
                className="w-full border rounded-lg px-4 py-3 mt-1"
                value={form.status}
                onChange={(e) => updateField("status", e.target.value)}
              >
                <option value="New">New</option>
                <option value="Assigned">Assigned</option>
                <option value="Contacted">Contacted</option>
                <option value="In Progress">In Progress</option>
                <option value="Closed">Closed</option>
                <option value="Lost">Lost</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">Source</label>
              <select
                className="w-full border rounded-lg px-4 py-3 mt-1"
                value={form.source}
                onChange={(e) => updateField("source", e.target.value)}
              >
                <option value="Facebook Ads">Facebook Ads</option>
                <option value="Walk-in Client">Walk-in Client</option>
                <option value="Website Inquiry">Website Inquiry</option>
                <option value="Referral">Referral</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Follow-up Date</label>
            <input
              className="w-full border rounded-lg px-4 py-3 mt-1"
              type="date"
              value={form.followUpDate}
              onChange={(e) => updateField("followUpDate", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Notes</label>
            <textarea
              className="w-full border rounded-lg px-4 py-3 mt-1"
              rows="4"
              value={form.notes}
              onChange={(e) => updateField("notes", e.target.value)}
            />
          </div>

          <button
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </section>
    </main>
  );
}