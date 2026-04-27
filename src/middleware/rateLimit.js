import { NextResponse } from "next/server";

const requestStore = new Map();

export function rateLimit(request, user) {
  if (!user || user.role === "admin") {
    return null;
  }

  const ip =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const key = `${user._id}-${ip}`;
  const now = Date.now();
  const oneMinute = 60 * 1000;
  const maxRequests = 50;

  const current = requestStore.get(key) || {
    count: 0,
    startTime: now,
  };

  if (now - current.startTime > oneMinute) {
    requestStore.set(key, {
      count: 1,
      startTime: now,
    });

    return null;
  }

  current.count += 1;
  requestStore.set(key, current);

  if (current.count > maxRequests) {
    return NextResponse.json(
      { message: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  return null;
}