import { z } from "zod";

// Серверный контракт заявки в CRM. Состав полей ДОЛЖЕН совпадать с тем, что
// строит EnrollForm.tsx — это и есть формат, который ожидает CRM-вебхук.
// Схема ничего не переименовывает и не удаляет из валидных полей: только
// тримит, ограничивает длину и отбрасывает неизвестные ключи (allowlist).
// Цель — закрыть открытый прокси: бот не сможет подмешать произвольные поля
// или прислать гигантские/мусорные значения. См. docs ревью §1 (open proxy).

export const ENROLL_LIMITS = {
  title: 120,
  phone: 40,
  source: 80,
  city: 120,
  comment: 2_000,
  source_information: 2_000,
  utm: 512,
} as const;

const requiredText = (max: number) => z.string().trim().min(1).max(max);
const optionalText = (max: number) => z.string().trim().max(max).optional();

// Телефон приходит уже отформатированным маской (@react-input/mask), напр.
// "+380 (50) 123 45 67" или международный "+1 234 567 89 01". Зеркалим контракт
// клиента (≥7 цифр) и дополнительно держим allowlist символов, чтобы заблокировать
// инъекцию произвольного текста/скриптов. Сам формат CRM получает как есть.
const phone = z
  .string()
  .trim()
  .min(1)
  .max(ENROLL_LIMITS.phone)
  .regex(/^[0-9+\-\s()]+$/, { message: "Invalid phone characters" })
  .refine((v) => v.replace(/\D/g, "").length >= 7, {
    message: "Phone must contain at least 7 digits",
  });

export const enrollPayloadSchema = z
  .object({
    title: requiredText(ENROLL_LIMITS.title),
    phones: z.array(phone).length(1),
    source: requiredText(ENROLL_LIMITS.source),
    city: requiredText(ENROLL_LIMITS.city),
    comment: optionalText(ENROLL_LIMITS.comment),
    source_information: optionalText(ENROLL_LIMITS.source_information),
    utm_source: optionalText(ENROLL_LIMITS.utm),
    utm_medium: optionalText(ENROLL_LIMITS.utm),
    utm_campaign: optionalText(ENROLL_LIMITS.utm),
    utm_content: optionalText(ENROLL_LIMITS.utm),
    utm_term: optionalText(ENROLL_LIMITS.utm),
  })
  // .strip() — для публичного прокси это строгий allowlist на выходе: в CRM
  // уйдут ТОЛЬКО перечисленные поля, любые лишние ключи молча отбрасываются
  // (в отличие от .strict(), который ронял бы запрос в 400 на любом лишнем
  // поле — лишняя хрупкость для формы).
  .strip();

export type EnrollPayload = z.infer<typeof enrollPayloadSchema>;
