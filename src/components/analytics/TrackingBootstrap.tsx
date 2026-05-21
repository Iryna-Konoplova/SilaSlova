"use client";

import { useEffect } from "react";
import { captureUtm } from "@/lib/utm";
import { getAnonymousId } from "@/lib/anonymous-id";

// Runs once on mount: captures UTM params from the landing URL into localStorage + cookie,
// and ensures every visitor has an anonymous_id (UUID) that survives across visits.
// First-party storage only — no third-party tracking, so it runs before cookie consent.
export function TrackingBootstrap() {
  useEffect(() => {
    captureUtm();
    getAnonymousId();
  }, []);
  return null;
}
