"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import type { ConsentState } from "@/lib/cookie-consent";
import { getConsent } from "@/lib/cookie-consent";

const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID;
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const TIKTOK_PIXEL_ID = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;
const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://app.posthog.com";

// Аналитика грузится ТОЛЬКО после согласия (spec §19 + правила CLAUDE.md):
// до согласия ни posthog, ни GA4, ни пиксели не загружаются вообще.
// Скрипты рендерятся условно по состоянию consent; posthog — через ленивый модуль.
export function AnalyticsProvider() {
  const [consent, setConsent] = useState<ConsentState | null>(null);

  useEffect(() => {
    // Вернувшийся посетитель — согласие уже в cookie
    const existing = getConsent();
    if (existing) setConsent(existing);

    // Обновление согласия из нашего CookieBanner
    function onConsentUpdated(e: Event) {
      setConsent((e as CustomEvent<ConsentState>).detail);
    }
    window.addEventListener("consentUpdated", onConsentUpdated);
    return () => window.removeEventListener("consentUpdated", onConsentUpdated);
  }, []);

  const statistics = consent?.statistics ?? false;
  const marketing = consent?.marketing ?? false;

  // PostHog — отдельный чанк, грузится лениво и только после согласия на статистику
  useEffect(() => {
    if (statistics && POSTHOG_KEY) {
      import("@/lib/analytics/posthog-client").then(({ initPostHog }) =>
        initPostHog(POSTHOG_KEY, POSTHOG_HOST)
      );
    }
  }, [statistics]);

  return (
    <>
      {/* GA4 — загружается только после согласия на статистику */}
      {statistics && GA4_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA4_ID}');
          `}</Script>
        </>
      )}

      {/* Meta Pixel — загружается только после согласия на маркетинг */}
      {marketing && META_PIXEL_ID && (
        <Script id="meta-pixel" strategy="afterInteractive">{`
          !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){
          n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window,document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${META_PIXEL_ID}');
          fbq('track', 'PageView');
        `}</Script>
      )}

      {/* TikTok Pixel — загружается только после согласия на маркетинг */}
      {marketing && TIKTOK_PIXEL_ID && (
        <Script id="tiktok-pixel" strategy="afterInteractive">{`
          !function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];
          ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],
          ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
          for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
          ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},
          ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js";
          ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._p=ttq._p||[],ttq._p.push([e,n]);
          var a=document.createElement("script");a.type="text/javascript",a.async=!0,a.src=r+"?sdkid="+e+"&lib="+t;
          var u=document.getElementsByTagName("script")[0];u.parentNode.insertBefore(a,u)};
          ttq.load('${TIKTOK_PIXEL_ID}');
          ttq.page();
          }(window,document,'ttq');
        `}</Script>
      )}
    </>
  );
}
