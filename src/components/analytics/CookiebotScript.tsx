import Script from "next/script";

export function CookiebotScript() {
  const cbid = process.env.NEXT_PUBLIC_COOKIEBOT_CBID ?? "YOUR_COOKIEBOT_CBID";
  return (
    <Script
      id="cookiebot"
      src="https://consent.cookiebot.com/uc.js"
      data-cbid={cbid}
      data-blockingmode="auto"
      strategy="beforeInteractive"
    />
  );
}
