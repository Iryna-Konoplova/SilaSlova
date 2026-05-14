import { createHash } from "crypto";

export function trackEvent(name: string, properties?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.posthog?.capture(name, properties);
  window.gtag?.("event", name, properties);
}

// SHA-256 hash for PII before sending to ad pixels (spec §19)
export async function hashPii(value: string): Promise<string> {
  const normalized = value.trim().toLowerCase();
  // Browser
  if (typeof window !== "undefined" && window.crypto?.subtle) {
    const buf = await window.crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(normalized)
    );
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }
  // Server (Node)
  return createHash("sha256").update(normalized).digest("hex");
}

export function trackLead(email?: string, phone?: string) {
  if (typeof window === "undefined") return;
  // PostHog — raw values ok (no ad network)
  window.posthog?.capture("signup_completed");

  Promise.all([
    email ? hashPii(email) : Promise.resolve(undefined),
    phone ? hashPii(phone) : Promise.resolve(undefined),
  ]).then(([hashedEmail, hashedPhone]) => {
    // Meta Pixel — hashed PII required
    window.fbq?.("track", "Lead", {
      em: hashedEmail,
      ph: hashedPhone,
    });
    // TikTok Pixel — hashed PII required
    window.ttq?.track("CompleteRegistration", {
      email: hashedEmail,
      phone_number: hashedPhone,
    });
    // GA4
    window.gtag?.("event", "generate_lead");
  });
}
