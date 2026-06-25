// Демо-игра живёт на отдельном внешнем ресурсе. Play-кнопка на /demo ведёт туда и
// прокидывает anonymous_id + UTM в query — чтобы игра/CRM позже сшили анонимный
// заход с регистрацией (spec §11.6) и сохранили атрибуцию рекламы.
//
// URL игры берётся из окружения (12-factor, без хардкода): NEXT_PUBLIC_DEMO_URL —
// единственное место правки адреса (.env.local локально, переменные Vercel в проде).
// Доступность игры — временный флаг DEMO_ENABLED ниже: короткоживущий тумблер на
// период теста, поэтому живёт в коде (виден в diff/ревью, легко убрать), а не в env.
import { getAnonymousId } from "./anonymous-id";
import { getStoredUtm } from "./utm";

export const DEMO_URL = process.env.NEXT_PUBLIC_DEMO_URL ?? "";

// ⏸️ Временный feature-флаг доступности игры. Игра ещё не оттестирована → переход
// выключен. Когда тест пройдёт — поставить true. Позже флаг можно убрать совсем
// (тогда кнопка всегда будет ссылкой). Тип boolean — чтобы при false не появлялась
// «недостижимая ветка» у вызывающих.
const DEMO_ENABLED: boolean = false;

// Игра доступна, только если включена флагом И задан URL (страховка от пустого URL).
export const isDemoEnabled = DEMO_ENABLED && DEMO_URL.length > 0;

// Строит URL демо-игры с подстановкой anonymous_id + UTM. Читает localStorage,
// поэтому работает только на клиенте; на сервере (или без URL) возвращает базовый
// URL без меток (после монтирования клиент пересчитает href с метками).
export function buildDemoUrl(): string {
  if (!DEMO_URL || typeof window === "undefined") return DEMO_URL;
  const url = new URL(DEMO_URL);
  const anon = getAnonymousId();
  if (anon) url.searchParams.set("anonymous_id", anon);
  for (const [key, value] of Object.entries(getStoredUtm())) {
    if (value) url.searchParams.set(key, value);
  }
  return url.toString();
}
