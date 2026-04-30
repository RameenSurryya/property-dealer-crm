"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardNav from "@/components/dashboard/DashboardNav";

export default function NewLeadPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    propertyInterest: "",
    budget: "",
    status: "New",
    source: "Facebook Ads",
    notes: "",
    followUpDate: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.message || "Failed to create lead");
      return;
    }

    router.push("/leads");
  }

  function updateField(field, value) {
    setForm({ ...form, [field]: value });
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <DashboardNav role="admin" />

      <section className="p-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900">Add New Lead</h2>
        <p className="text-gray-600 mt-1">
          Create a new property inquiry lead.
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
            <label className="block text-sm font-medium">
              Phone Number
            </label>
            <input
              className="w-full border rounded-lg px-4 py-3 mt-1"
              placeholder="923001234567"
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Use international format without + sign, e.g. 923001234567.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium">
              Property Interest
            </label>
            <input
              className="w-full border rounded-lg px-4 py-3 mt-1"
              placeholder="10 Marla House in Bahria Town"
              value={form.propertyInterest}
              onChange={(e) =>
                updateField("propertyInterest", e.target.value)
              }
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Budget</label>
            <input
              className="w-full border rounded-lg px-4 py-3 mt-1"
              type="number"
              placeholder="25000000"
              value={form.budget}
              onChange={(e) => updateField("budget", e.target.value)}
              required
            />
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
            <label className="block text-sm font-medium">
              Follow-up Date
            </label>
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
            {loading ? "Creating..." : "Create Lead"}
          </button>
        </form>
      </section>
    </main>
  );
}