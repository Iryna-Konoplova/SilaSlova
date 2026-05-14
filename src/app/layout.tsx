import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getLocale } from "next-intl/server";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sila-slova.vercel.app";

export const metadata: Metadata = {
  title: "Сила Слова / Syla Slova",
  description:
    "Interactive educational thriller for children 10–12. 13 lessons on critical thinking, media literacy and manipulation recognition.",
  metadataBase: new URL(siteUrl),
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        {/* Отключаем браузерное восстановление скрола — страница всегда открывается сверху */}
        <script dangerouslySetInnerHTML={{ __html: "history.scrollRestoration='manual'" }} />
        <ThemeProvider>{children}</ThemeProvider>
        <AnalyticsProvider />
      </body>
    </html>
  );
}
