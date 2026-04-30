"use client";

import { useEffect, useState } from "react";
import DashboardNav from "@/components/dashboard/DashboardNav";

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);

useEffect(() => {
  async function loadAnalytics() {
    const res = await fetch("/api/analytics");
    const data = await res.json();
    setAnalytics(data);
  }

  loadAnalytics();

  const interval = setInterval(() => {
    loadAnalytics();
  }, 10000);

  return () => clearInterval(interval);
}, []);

  return (
    <main className="min-h-screen bg-gray-100">
      <DashboardNav role="admin" />

      <section className="p-6">
        <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
        <p className="text-gray-600 mt-1">
          Overview of leads, agents, and CRM performance.
        </p>

        <div className="grid md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white p-5 rounded-xl shadow">
            <p className="text-gray-500 text-sm">Total Leads</p>
            <h3 className="text-3xl font-bold mt-2">
              {analytics?.totalLeads ?? 0}
            </h3>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <p className="text-gray-500 text-sm">Agents</p>
            <h3 className="text-3xl font-bold mt-2">
              {analytics?.agentsCount ?? 0}
            </h3>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <p className="text-gray-500 text-sm">High Priority</p>
            <h3 className="text-3xl font-bold mt-2">
              {analytics?.priorityDistribution?.find((p) => p._id === "High")
                ?.count ?? 0}
            </h3>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <p className="text-gray-500 text-sm">Closed Leads</p>
            <h3 className="text-3xl font-bold mt-2">
              {analytics?.statusDistribution?.find((s) => s._id === "Closed")
                ?.count ?? 0}
            </h3>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white p-5 rounded-xl shadow">
            <h3 className="font-bold text-lg">Status Distribution</h3>
            <div className="mt-4 space-y-2">
              {analytics?.statusDistribution?.map((item) => (
                <div key={item._id} className="flex justify-between border-b pb-2">
                  <span>{item._id}</span>
                  <strong>{item.count}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <h3 className="font-bold text-lg">Priority Distribution</h3>
            <div className="mt-4 space-y-2">
              {analytics?.priorityDistribution?.map((item) => (
                <div key={item._id} className="flex justify-between border-b pb-2">
                  <span>{item._id}</span>
                  <strong>{item.count}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow mt-6">
          <h3 className="font-bold text-lg">Agent Performance</h3>

          <div className="overflow-x-auto mt-4">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left bg-gray-100">
                  <th className="p-3">Agent</th>
                  <th className="p-3">Assigned</th>
                  <th className="p-3">In Progress</th>
                  <th className="p-3">Closed</th>
                </tr>
              </thead>
              <tbody>
                {analytics?.agentPerformance?.map((agent) => (
                  <tr key={agent._id} className="border-b">
                    <td className="p-3">{agent.agentName}</td>
                    <td className="p-3">{agent.totalAssigned}</td>
                    <td className="p-3">{agent.inProgressLeads}</td>
                    <td className="p-3">{agent.closedLeads}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}