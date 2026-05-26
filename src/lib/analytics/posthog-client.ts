// Грузится лениво ТОЛЬКО после согласия на статистику.
//
// Второй уровень индирекции: сам `import("posthog-js")` живёт здесь, а не в
// AnalyticsProvider (который всегда в дереве layout). Так бандлер не преподгружает
// тяжёлый чанк posthog-js (~141 КБ) в стартовую загрузку — он обнаруживается только
// при выполнении этого модуля, т.е. уже после согласия.
export async function initPostHog(key: string, host: string) {
  if (typeof window === "undefined" || window.posthog) return;
  const { default: posthog } = await import("posthog-js");
  posthog.init(key, { api_host: host, capture_pageview: true });
  window.posthog = posthog as unknown as Window["posthog"];
}
