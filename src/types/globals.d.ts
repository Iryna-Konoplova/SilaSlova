export {};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    ttq?: {
      load: (id: string) => void;
      page: () => void;
      track: (event: string, props?: Record<string, unknown>) => void;
    };
    posthog?: {
      init: (key: string, opts: Record<string, unknown>) => void;
      capture: (event: string, props?: Record<string, unknown>) => void;
    };
  }
}
