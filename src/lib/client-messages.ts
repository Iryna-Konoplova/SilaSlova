/**
 * Отбирает только указанные верхнеуровневые разделы из полного словаря сообщений.
 *
 * Назначение: в браузер (через `NextIntlClientProvider`) нужно отдавать лишь те
 * разделы, которые реально используют КЛИЕНТСКИЕ компоненты (`useTranslations`).
 * Серверные компоненты переводятся на сервере (`getTranslations`) и не требуют
 * словаря в клиенте — поэтому полный словарь в RSC/HTML payload не тащим.
 *
 * ВАЖНО: вложенный `NextIntlClientProvider` с пропом `messages` ЗАМЕНЯЕТ словарь
 * родителя (use-intl: `messages === undefined ? parent : messages`), а не сливает.
 * Поэтому каждый вложенный провайдер должен содержать ВСЕ разделы, которые
 * использует его поддерево.
 */
export function pickMessages<T extends Record<string, unknown>>(
  messages: T,
  namespaces: readonly string[]
): T {
  const out: Record<string, unknown> = {};
  for (const ns of namespaces) {
    if (ns in messages) out[ns] = messages[ns];
  }
  return out as T;
}
