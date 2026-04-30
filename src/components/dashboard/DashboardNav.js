"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardNav({ role = "admin" }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    router.push("/login");
  }

  return (
    <nav className="bg-white border-b px-6 py-4 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Property Dealer CRM</h1>
        <p className="text-sm text-gray-500 capitalize">{role} dashboard</p>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <Link className="text-gray-700 hover:text-blue-600" href={`/${role}`}>
          Dashboard
        </Link>

        <Link className="text-gray-700 hover:text-blue-600" href="/leads">
          Leads
        </Link>

        <Link className="text-gray-700 hover:text-blue-600" href="/followups">
          Follow-ups
        </Link>

        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}