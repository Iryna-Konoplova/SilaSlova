@AGENTS.md

# Сила Слова — Project Rules

## Source of Truth

**`docs/SPECIFICATION.md` is the single source of truth for this project.**

Before implementing any feature, route, component, or data structure:
1. Open `docs/SPECIFICATION.md` and find the relevant section
2. Check for contradictions with existing code
3. If something is unclear, ambiguous, or contradicts — **stop and ask the user before writing code**


## Tech Stack (actual installed versions)

| Layer | Package | Version |
|---|---|---|
| Framework | next | 16.2.4 |
| Language | typescript | ^5 |
| Styles | tailwindcss | ^4 |
| Animation | framer-motion | ^12 |
| State (demo) | zustand | ^5 |
| Auth | @clerk/nextjs | ^7 |
| Validation | zod | ^4 |
| Forms | react-hook-form | ^7 |
| i18n | next-intl | ^4.9.2 |
| Analytics | posthog-js | ^1 |

## Architecture Rules

- **Site = marketing funnel only.** No user profile DB, no email/SMS sending, no bot management.
- **CRM is the source of truth for leads.** Site sends webhooks; CRM owns everything after.
- **Demo and quiz require NO registration** (spec section 8.1, 7.1). Never gate them.
- **UTM params must survive** the entire path: ad → landing → demo/quiz → sign-up → channel (spec section 6.5).
- **anonymous_id** is generated on first visit, stored in localStorage + cookie, merged with user_id on registration (spec section 11.6).
- **Locale prefix is always shown** (`/en/...`, `/ru/...`, `/uk/...`). Default detected from `Accept-Language`.

## Content Rules

- All landing content lives in `src/content/landings/{locale}/{slug}.json`
- All scene content lives in `src/content/demo/*.json`
- All quiz content lives in `src/content/quiz/*.json`
- **Zod validates all JSON content at build time** — build must fail on invalid content (spec section 13.1)
- Adding a new language = add to `locales` array in `src/lib/i18n.ts` + add `src/content/strings/{lang}.json`

### Landing generation workflow

- **Each topic = its own landing with a unique slug**, even if it partially overlaps with an existing one. "straw-man" and "thought-substitution" are different angles on the same phenomenon — different pain framing, different examples, different quote.
- **Do NOT stop or ask about overlap with existing landings.** When the user gives a new topic, generate a new slug + fresh content (different headline, different examples, different social_proof quote/author).
- **Keep slugs compact** — 2–3 words max, kebab-case. Prefer `not-said` over `i-didnt-mean-that`.
- Always create all 4 locale files at once: `uk`, `ru`, `en`, `ro`.

## Performance Rules (spec section 17)

- LCP ≤ 1.5s on mobile 4G
- JS bundle for landing pages ≤ 220 KB gzip (revised 2026-05 — see `docs/PERF_PLAN.md`; the original 80 KB is below the Next 16 + React 19 + next-intl framework floor. Keep route-specific client JS minimal: heavy deps via `next/dynamic` and after consent)
- JS bundle for demo engine ≤ 200 KB gzip
- Demo engine must be **dynamically imported** — never included in landing bundle
- Hero video ≤ 1 MB WebM + poster JPEG
- All landings and quiz must be **statically generated (SSG)**
- Main page uses **ISR** (revalidate: 3600)

## When to Ask the User

Ask before proceeding if:
- A feature is not described in `docs/SPECIFICATION.md`
- Two parts of the spec contradict each other
- A third-party integration requires credentials not yet provided (CRM webhook URL/secret is TBD per spec section 24)
- The chosen implementation approach has a meaningful tradeoff not obvious from the spec

## Sprint Plan

- **Sprint 1:** scaffold + home page + i18n + analytics + cookie banner (Cookiebot or Iubenda)
- **Sprint 2:** landing template + 8 landings × 2 langs + quiz + demo engine
- **Sprint 3:** Clerk auth + sign-up + welcome + CRM webhook client
- **Sprint 4:** remaining landings + audio + Lighthouse optimization + a11y audit

## Forbidden (not in scope — spec section 23)

- No payment system on site
- No personal dashboard / user cabinet
- No email/SMS/messenger sending from site (CRM handles this)
- No direct Twilio / Resend / Bot API integrations on site
- No headless CMS (JSON in repo is enough for Stage 1)
- No blog
- No referral program
- No admin panel for leads (CRM = admin panel)
- Supported languages in Stage 1: EN, RU, UK, RO (Romanian added per explicit user decision)

## Analytics & Cookie Rules

- Pixels (Meta Pixel, TikTok Pixel, GA4) must NOT load before user gives cookie consent
- Use a CMP solution (Cookiebot or Iubenda) — NOT a custom cookie banner
- PostHog also loads only after consent
- Email and phone must be SHA-256 hashed before sending to ad pixels (spec section 19)

## CRM Webhook Rules

- CRM is TBD (spec section 24) — webhook client must be universal
- All events from spec section 11.3 must be implemented
- Never store lead profiles in site DB — only pass to CRM
- Always include anonymous_id + utm params in every webhook call
