export type ConsentState = {
  necessary: true;
  statistics: boolean;
  marketing: boolean;
  version: "1";
};

const COOKIE_NAME = "sila_consent";
const COOKIE_DAYS = 365;

export function getConsent(): ConsentState | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`)
  );
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match[1])) as ConsentState;
  } catch {
    return null;
  }
}

export function saveConsent(
  prefs: Pick<ConsentState, "statistics" | "marketing">
): ConsentState {
  const consent: ConsentState = {
    necessary: true,
    statistics: prefs.statistics,
    marketing: prefs.marketing,
    version: "1",
  };
  const maxAge = COOKIE_DAYS * 24 * 60 * 60;
  document.cookie = [
    `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(consent))}`,
    `max-age=${maxAge}`,
    `path=/`,
    `SameSite=Lax`,
  ].join("; ");

  window.dispatchEvent(new CustomEvent("consentUpdated", { detail: consent }));
  return consent;
}

export function acceptAll(): ConsentState {
  return saveConsent({ statistics: true, marketing: true });
}

export function acceptNecessaryOnly(): ConsentState {
  return saveConsent({ statistics: false, marketing: false });
}

export function hasConsented(): boolean {
  return getConsent() !== null;
}
