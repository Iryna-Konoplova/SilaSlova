export function trackEvent(name: string, properties?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.posthog?.capture(name, properties);
  window.gtag?.("event", name, properties);
}

// SHA-256 hash for PII before sending to ad pixels (spec §19).
// Только Web Crypto — это модуль клиентской аналитики (tracking.ts используется
// лишь в EnrollButton/EnrollForm). Node-крипту НЕ импортируем: статический
// `import "crypto"` тянул в браузер полифилл buffer+crypto (~128 КБ gzip).
// Если Web Crypto недоступен (старый браузер / не-secure context) — не хешируем
// и не отправляем PII (возвращаем undefined).
// КОНТРАКТ ДЛЯ ВЫЗЫВАЮЩИХ: результат `string | undefined`. Никогда не отправляйте
// в рекламные пиксели сырое значение как фолбэк при undefined — это нарушит §19.
// Передавайте undefined как есть (пиксель просто опустит поле).
export async function hashPii(value: string): Promise<string | undefined> {
  if (typeof window === "undefined" || !window.crypto?.subtle) return undefined;
  const normalized = value.trim().toLowerCase();
  const buf = await window.crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(normalized)
  );
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function trackLead(email?: string, phone?: string) {
  if (typeof window === "undefined") return;
  // PostHog `signup_completed` шлёт ТОЛЬКО trackEvent (с {source}) — здесь не дублируем,
  // иначе событие считается дважды (M1). trackLead отвечает лишь за рекламные пиксели + GA lead.

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
