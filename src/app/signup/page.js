"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "agent",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      setError(data.message || "Signup failed");
      return;
    }

    if (data.user.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/agent");
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full"
      >
        <h1 className="text-2xl font-bold text-gray-900">Signup</h1>
        <p className="text-gray-600 mt-2">Create a CRM user account.</p>

        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded-lg mt-4">{error}</p>
        )}

        <label className="block mt-6 text-sm font-medium">Name</label>
        <input
          className="w-full border rounded-lg px-4 py-3 mt-1"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <label className="block mt-4 text-sm font-medium">Email</label>
        <input
          className="w-full border rounded-lg px-4 py-3 mt-1"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <label className="block mt-4 text-sm font-medium">Password</label>
        <input
          className="w-full border rounded-lg px-4 py-3 mt-1"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <label className="block mt-4 text-sm font-medium">Role</label>
        <select
          className="w-full border rounded-lg px-4 py-3 mt-1"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="agent">Agent</option>
          <option value="admin">Admin</option>
        </select>

        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white rounded-lg py-3 mt-6 hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Signup"}
        </button>

        <p className="text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link className="text-blue-600 font-medium" href="/login">
            Login
          </Link>
        </p>
      </form>
    </main>
  );
}