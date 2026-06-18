// Anonymous visitor identifier — spec §11.6
// Generated on first visit, persisted in localStorage + cookie, sent with every CRM event
// so the CRM can merge anonymous activity with the user record after sign-up.

const STORAGE_KEY = "ss_anon_id";
const COOKIE_DAYS = 365;

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

function uuid(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return "anon-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function getAnonymousId(): string {
  if (typeof window === "undefined") return "";
  // localStorage — основной носитель, cookie — fallback (и канал для сервера).
  // Если localStorage очищен, но cookie жив — восстанавливаем ТОТ ЖЕ id, иначе
  // атрибуция и будущий merge с user_id (§11.6) порвутся новым случайным id.
  const id = localStorage.getItem(STORAGE_KEY) ?? getCookie(STORAGE_KEY) ?? uuid();
  // Идемпотентно синхронизируем оба носителя.
  localStorage.setItem(STORAGE_KEY, id);
  setCookie(STORAGE_KEY, id, COOKIE_DAYS);
  return id;
}
