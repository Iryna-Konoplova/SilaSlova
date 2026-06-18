import { NextRequest, NextResponse } from "next/server";
import { enrollPayloadSchema } from "@/lib/schemas/enroll";
import { getClientIp, isRateLimited } from "@/lib/rate-limit";

const CRM_TIMEOUT_MS = 8_000;
// Заявка с максимально заполненными полями (кириллица = 2 байта) укладывается
// в ~14 КБ; 32 КБ — запас от ложных 413 при защите от гигантских тел.
const MAX_BODY_BYTES = 32 * 1024;

function getCrmWebhookUrl(): string | null {
  const raw = process.env.CRM_WEBHOOK_URL?.trim();
  if (!raw) return null;
  try {
    const url = new URL(raw);
    // Токен CRM зашит в сам URL (capability-URL) — по сети его можно слать ТОЛЬКО
    // через https. http допускаем лишь для loopback (локальный мок CRM в dev),
    // чтобы случайная http-конфигурация на реальный хост не утекла секрет.
    const isHttps = url.protocol === "https:";
    const isLoopbackHttp =
      url.protocol === "http:" &&
      (url.hostname === "localhost" ||
        url.hostname === "127.0.0.1" ||
        url.hostname === "[::1]");
    if (!isHttps && !isLoopbackHttp) return null;
    return url.toString();
  } catch {
    return null;
  }
}

function isBodyTooLarge(req: NextRequest): boolean {
  const header = req.headers.get("content-length");
  if (!header) return false;
  const length = Number(header);
  return !Number.isFinite(length) || length > MAX_BODY_BYTES;
}

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === "AbortError";
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { success: false, error: "rate_limited" },
      { status: 429 }
    );
  }

  if (isBodyTooLarge(req)) {
    return NextResponse.json(
      { success: false, error: "payload_too_large" },
      { status: 413 }
    );
  }

  // Конфиг проверяем до парсинга тела: при отсутствии валидного URL отдаём
  // контролируемый 500 вместо runtime-краша на fetch(undefined).
  const crmWebhookUrl = getCrmWebhookUrl();
  if (!crmWebhookUrl) {
    console.error("[api/enroll] CRM_WEBHOOK_URL is missing or invalid");
    return NextResponse.json(
      { success: false, error: "server_misconfigured" },
      { status: 500 }
    );
  }

  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "invalid_json" },
      { status: 400 }
    );
  }

  // Серверная валидация + allowlist: в CRM уходят ТОЛЬКО разрешённые поля,
  // обрезанные по длине. Клиентская валидация остаётся для UX, но больше
  // не является границей доверия.
  const parsed = enrollPayloadSchema.safeParse(rawBody);
  if (!parsed.success) {
    console.warn("[api/enroll] Invalid enroll payload", {
      issues: parsed.error.issues.map((i) => ({
        path: i.path.join("."),
        code: i.code,
      })),
    });
    return NextResponse.json(
      { success: false, error: "invalid_payload" },
      { status: 400 }
    );
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CRM_TIMEOUT_MS);

  try {
    const headers = new Headers({ "Content-Type": "application/json" });
    // Текущая CRM (crm.soroban.ua) авторизует вебхук секретным токеном, зашитым
    // в сам CRM_WEBHOOK_URL (capability-URL) — отдельный заголовок ей НЕ нужен.
    // Bearer ниже отправляется только если задан CRM_WEBHOOK_SECRET: это задел
    // на случай, если CRM позже перейдёт на header-аутентификацию (ТЗ §11.4).
    const secret = process.env.CRM_WEBHOOK_SECRET?.trim();
    if (secret) headers.set("Authorization", `Bearer ${secret}`);

    const crmResponse = await fetch(crmWebhookUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({ payload: parsed.data }),
      signal: controller.signal,
    });

    if (!crmResponse.ok) {
      // Сырой ответ CRM логируем на сервере, но НЕ отдаём наружу (мог бы
      // утечь внутренний detail/PII). Клиенту — generic.
      const crmErrorText = await crmResponse.text().catch(() => "");
      console.error("[api/enroll] CRM webhook returned non-OK response", {
        status: crmResponse.status,
        body: crmErrorText.slice(0, 1_000),
      });
      return NextResponse.json(
        { success: false, error: "crm_error" },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (isAbortError(error)) {
      console.error("[api/enroll] CRM webhook request timed out");
      return NextResponse.json(
        { success: false, error: "crm_timeout" },
        { status: 504 }
      );
    }
    console.error("[api/enroll] CRM webhook request failed", { error });
    return NextResponse.json(
      { success: false, error: "crm_unavailable" },
      { status: 502 }
    );
  } finally {
    clearTimeout(timeoutId);
  }
}
