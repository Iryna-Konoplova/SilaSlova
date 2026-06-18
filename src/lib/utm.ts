// UTM persistence — spec §6.5
// On first hit with UTM in URL, persist them to localStorage + cookie (30d).
// On subsequent navigation, the values stick even if URL no longer has them.

const KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

export type UtmParams = Partial<Record<(typeof KEYS)[number], string>>;

const STORAGE_KEY = "ss_utm";
const COOKIE_DAYS = 30;

function readUtmFromUrl(): UtmParams {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const out: UtmParams = {};
  for (const k of KEYS) {
    const v = params.get(k);
    if (v) out[k] = v;
  }
  return out;
}

function setCookie(name: string, value: string, days: number) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 86400e3).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  for (const part of document.cookie.split("; ")) {
    const eq = part.indexOf("=");
    if (eq > -1 && part.slice(0, eq) === name) {
      return decodeURIComponent(part.slice(eq + 1));
    }
  }
  return null;
}

/**
 * Reads URL UTM params (if any) and stores them. Idempotent: only overwrites when URL carries fresh UTM,
 * so a return visit via a direct link doesn't wipe the original attribution.
 */
export function captureUtm(): UtmParams {
  if (typeof window === "undefined") return {};
  const fromUrl = readUtmFromUrl();
  if (Object.keys(fromUrl).length > 0) {
    const serialized = JSON.stringify(fromUrl);
    localStorage.setItem(STORAGE_KEY, serialized);
    setCookie(STORAGE_KEY, serialized, COOKIE_DAYS);
    return fromUrl;
  }
  return getStoredUtm();
}

export function getStoredUtm(): UtmParams {
  if (typeof window === "undefined") return {};
  // localStorage — основной носитель, cookie — fallback: если localStorage очищен,
  // но cookie (30д) жив, исходная UTM-атрибуция не теряется.
  const raw = localStorage.getItem(STORAGE_KEY) ?? getCookie(STORAGE_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as UtmParams;
  } catch {
    return {};
  }
}
