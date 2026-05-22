import { NextRequest, NextResponse } from "next/server";
import { getClientIp, isRateLimited } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { success: false, error: "rate_limited" },
      { status: 429 }
    );
  }

  // Form already builds the CRM-shaped payload (title, phones[], city, comment, source,
  // source_information, utm_*). We just wrap it and forward — what you see in DevTools
  // on /api/enroll is exactly what reaches the CRM webhook.
  const body = await req.json();

  const res = await fetch(process.env.CRM_WEBHOOK_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ payload: body }),
  });

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json({ error: text }, { status: res.status });
  }

  return NextResponse.json({ ok: true });
}
