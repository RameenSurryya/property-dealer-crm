import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-xl w-full text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Property Dealer CRM
        </h1>
        <p className="text-gray-600 mt-3">
          Manage leads, assign agents, track follow-ups, and view analytics.
        </p>

        <div className="flex gap-4 justify-center mt-8">
          <Link
            href="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Login
          </Link>

          <Link
            href="/signup"
            className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50"
          >
            Signup
          </Link>
        </div>
      </div>
    </main>
  );
}