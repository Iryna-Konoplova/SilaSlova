import { z } from "zod";

const CtaTarget = z.enum(["/demo", "/quiz", "/sign-up"]);

export const LandingSchema = z.object({
  slug: z.string().min(1),
  audience: z.enum(["parent", "kid", "mixed"]),
  locale: z.enum(["en", "ru", "uk", "ro"]),
  meta: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    // Единая og-картинка (`/og/og-default.jpg`) на всех лендингах — это СОЗНАТЕЛЬНОЕ
    // решение, а не недоработка. Подпись превью (заголовок/описание) у каждого лендинга
    // своя — её берёт Telegram/Google из <title>/<meta description>. Картинку при желании
    // можно сделать пер-лендинговой позже (контентная задача), но это не обязательно.
    og_image: z.string().min(1),
  }),
  hero: z.object({
    headline: z.string().min(1),
    subheadline: z.string().min(1),
    cta_primary: z.object({ text: z.string().min(1), target: CtaTarget }),
    cta_secondary: z
      .object({ text: z.string().min(1), target: z.string().min(1) })
      .optional(),
    media: z.object({
      type: z.enum(["video", "image", "lottie"]),
      src: z.string().min(1),
      alt: z.string().optional(),
      poster: z.string().optional(),
    }),
  }),
  pain: z.object({
    title: z.string().min(1),
    body: z.string().min(1),
  }),
  solution: z.object({
    title: z.string().min(1),
    body: z.string().optional(),
    bullets: z.array(z.string().min(1)).min(1),
    screenshots: z.array(z.string()).optional(),
  }),
  inline_interaction: z
    .object({
      type: z.enum(["quiz_teaser", "scene_teaser"]).nullable(),
      content_id: z.string().optional(),
    })
    .optional(),
  social_proof: z
    .object({
      quote: z.string().optional(),
      author: z.string().optional(),
      stats: z
        .array(z.object({ label: z.string(), value: z.string() }))
        .optional(),
    })
    .optional(),
  faq: z.array(z.object({ q: z.string().min(1), a: z.string().min(1) })).min(1),
  faq_label: z.string().optional(),
  faq_title: z.string().optional(),
  final_cta: z.object({
    headline: z.string().min(1),
    subheadline: z.string().optional(),
    cta_text: z.string().min(1),
  }),
  tracking: z.object({
    fb_pixel_event: z.string().optional(),
    tt_pixel_event: z.string().optional(),
    ga_event: z.string().optional(),
  }),
});

export type Landing = z.infer<typeof LandingSchema>;
