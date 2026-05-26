# Техническое задание для frontend-разработчика

## Проект: «Сила Слова» / «City of Broken Words»

### Этап 1 — Продающий сайт + воронка регистрации (RU/UA + EN)

**Версия:** 4.0 (final synthesis)
**Дата:** 28.04.2026
**Заказчик:** Iurii Novoselov
**Контакт:** iurii.novoselov@gmail.com

---

## 0. Краткое резюме

«Сила Слова» — интерактивная образовательная драма для детей 8–12 лет. 40 эпизодов, 13 уроков критического мышления в форме сюжетного триллера. Сама игра живёт в **мобильном приложении** + **ботах в мессенджерах** (WhatsApp / Telegram / Viber) + email.

**Сайт — только маркетинговая воронка до момента регистрации.**

После регистрации всё ведёт **внешняя CRM**: она хранит профиль лида, триггерит **бот-сценарии продажи**, управляет рассылками во всех каналах. Менеджеров-людей в воронке нет — бот продаёт автоматически до момента подписки.

> **Сайт ловит лида и передаёт его в CRM. Дальше — не наша зона.**

---

## 1. Архитектура потока (High-Level)

```
┌──────────────┐    ┌─────────────┐    ┌──────────┐    ┌──────────────┐
│  Реклама     │ →  │   САЙТ      │ →  │   CRM    │ →  │     БОТ      │
│  (Meta/TT/   │    │  (воронка)  │    │ (хранит  │    │  (продаёт    │
│   YouTube)   │    │             │    │  лида,   │    │   автоматом) │
│              │    │             │    │  триггер)│    │              │
│  Telegram    │    │             │    │          │    │ WhatsApp /   │
│  посты       │    │             │    │          │    │ Telegram /   │
│              │    │             │    │          │    │ Viber /      │
│  WA посты    │    │             │    │          │    │ Email / SMS  │
└──────────────┘    └─────────────┘    └──────────┘    └──────────────┘
                                                              ↓
                                                       ┌──────────────┐
                                                       │  ПРИЛОЖЕНИЕ  │
                                                       │  (iOS/Android│
                                                       │   — главный  │
                                                       │   endpoint)  │
                                                       └──────────────┘
```

**Что делает сайт:**

1. Принимает трафик и сегментирует через лендинги
2. Даёт ребёнку/родителю короткий интерактивный опыт (демо или квиз)
3. Регистрирует лида (минимально-болезненно)
4. Отправляет лида + контекст в CRM через webhook
5. Перенаправляет в выбранный канал (deep link или промо app)

**Чего сайт НЕ делает:**

- Не хранит профиль юзера дольше сессии (только дедупликация)
- Не отправляет писем / сообщений в мессенджеры (это делает CRM)
- Не управляет ботами
- Не имеет своей админки заявок (CRM = админка)
- Не содержит платежей и личного кабинета

---

## 2. Целевые рынки и языки

- **Английский** — приоритет №1 (US/UK/CA/AU). На этих рынках доминирует **WhatsApp**.
- **Русский** — рынок СНГ-эмиграции. Доминирует **Telegram**.
- **Украинский** — на финальной локализации.

Мультиязычность с первого дня: **i18n routing** (`/en`, `/ru`, `/uk`). Дефолт — по `Accept-Language`, переключатель в шапке.

---

## 3. Целевые метрики

| Метрика                                                 | Цель    |
| ------------------------------------------------------- | ------- |
| Conversion landing → demo/quiz started                  | ≥ 40%   |
| Conversion demo/quiz → registration                     | ≥ 15%   |
| Conversion registration → channel activated             | ≥ 80%   |
| Conversion registration → app install (push в /welcome) | ≥ 25%   |
| LCP (mobile, 4G)                                        | ≤ 1.5s  |
| INP                                                     | ≤ 200ms |
| CLS                                                     | ≤ 0.05  |
| Lighthouse SEO/Performance/A11y                         | ≥ 90    |

---

## 4. Карта сайта

```
/[locale]/                        Главная — общий вход
/[locale]/lp/[slug]               Универсальный лендинг (10–20 шт)
/[locale]/parents                 Лендинг для родителей (общий)
/[locale]/kids                    Лендинг для детей (общий)
/[locale]/demo                    Демо-эпизод (3–5 сцен, без регистрации)
/[locale]/quiz                    Мини-квиз (3 вопроса, без регистрации)
/[locale]/sign-up                 Регистрация после демо/квиза
/[locale]/welcome                 Выбор канала + промо приложения
/[locale]/app                     Страница приложения (App Store / Google Play)
/[locale]/about                   О проекте
/[locale]/faq                     Частые вопросы
/[locale]/privacy                 Политика
/[locale]/terms                   Условия
/api/webhook/clerk                Прокси Clerk → CRM
/api/track                        События → CRM webhook
/api/leads                        Регистрация и форма заявки → CRM webhook
/api/og                           Динамические OG-картинки
```

`[locale]` ∈ `{en, ru, uk}`.

---

## 5. Главная страница `/[locale]/`

### 5.1. Above the fold

- **EN headline:** "In this city, people disappear — and no one notices"
- **RU headline:** «В этом городе исчезают люди — и никто этого не замечает»
- **Подзаголовок:** «Интерактивная драма для детей 10–12 лет. Учит думать, а не верить.»
- **Главная кнопка:** «Play demo» / «Играть демо» → `/demo`
- **Доп. кнопка:** «I'm a parent» / «Я родитель» → `/parents`
- **Hero:** silent WebM ≤ 1 МБ + poster JPEG

### 5.2. Below the fold

1. 3 преимущества (иконка + 1 строка)
2. Скриншоты приложения + бейджи App Store / Google Play
3. Социальное доказательство (на старте — заглушки)
4. Финальный CTA

### 5.3. Sticky-bar

На мобиле — закреплённая кнопка «Play demo» снизу. **Критично для конверсии.**

---

## 6. Шаблон лендинга `/[locale]/lp/[slug]`

### 6.1. Двухформатный шаблон

Поле `audience` в JSON определяет рендер:

| audience | Главный CTA                                   | Что после клика                    |
| -------- | --------------------------------------------- | ---------------------------------- |
| `parent` | «Get free trial» / «Записать на пробный урок» | Мини-квиз `/quiz` или форма заявки |
| `kid`    | «Play demo» / «Играть демо»                   | Демо-эпизод `/demo`                |
| `mixed`  | Два CTA рядом                                 | Выбор юзера                        |

### 6.2. Фиксированная структура

1. **Hero** — заголовок + подзаголовок + CTA + визуал
2. **Pain** — 2–3 эмоциональных строки про боль
3. **Solution** — что внутри игры, 3–4 буллета + скриншоты бота/приложения
4. **Mini-quiz / demo-teaser** (опционально, in-page) — 1 короткое взаимодействие
5. **Social proof** — отзыв или цифры
6. **FAQ** — 3–5 закрытых возражений
7. **Final CTA** — повторение

### 6.3. JSON-схема

```typescript
type Landing = {
  slug: string; // "fear-tiktok"
  audience: "parent" | "kid" | "mixed";
  locale: "en" | "ru" | "uk";
  meta: {
    title: string;
    description: string;
    og_image: string;
  };
  hero: {
    headline: string;
    subheadline: string;
    cta_primary: { text: string; target: "/demo" | "/quiz" | "/sign-up" };
    cta_secondary?: { text: string; target: string };
    media: { type: "video" | "image" | "lottie"; src: string; poster?: string };
  };
  pain: { title: string; body: string };
  solution: {
    title: string;
    bullets: string[];
    screenshots?: string[];
  };
  inline_interaction?: {
    type: "quiz_teaser" | "scene_teaser" | null;
    content_id?: string;
  };
  social_proof?: {
    quote?: string;
    author?: string;
    stats?: Array<{ label: string; value: string }>;
  };
  faq: Array<{ q: string; a: string }>;
  final_cta: { headline: string; cta_text: string };
  tracking: {
    fb_pixel_event?: string;
    tt_pixel_event?: string;
    ga_event?: string;
  };
};
```

### 6.4. Стартовый пул (минимум 8 хуков × 2 языка = 16 лендингов)

| slug           | audience | Хук                                         |
| -------------- | -------- | ------------------------------------------- |
| `tiktok-trust` | parent   | "Your kid believes TikTok more than you?"   |
| `manipulators` | parent   | "Manipulators talk to your child every day" |
| `school-gap`   | parent   | "Schools don't teach how to spot a lie"     |
| `gift-smart`   | parent   | "A gift that makes your child think"        |
| `mystery`      | kid      | "In this city people disappear…"            |
| `detective`    | kid      | "Become a detective. Find your sister."     |
| `not-school`   | kid      | "It's a game, not a class"                  |
| `voice-boss`   | kid      | "In the finale you speak — or you lose"     |

### 6.5. UTM

UTM-параметры в URL → читаются → передаются во все события и в CRM webhook на регистрации. На всех redirect-ах сохраняются через cookie (`utm_*`, 30 дней).

---

## 7. Мини-квиз `/[locale]/quiz` (родительский путь)

### 7.1. Концепция

3 вопроса в стиле «Факт / мнение / манипуляция?». После каждого — короткое объяснение. В конце — CTA на форму заявки.

### 7.2. Пример вопроса

> «Учёные доказали, что эта игра делает детей умнее»
>
> 1. Факт
> 2. Мнение
> 3. Манипуляция (ложная авторитетность)

После ответа — короткое объяснение (2–3 строки) + переход.

### 7.3. JSON-схема

```typescript
type Quiz = {
  id: string; // "parent_pain_quiz_v1"
  locale: "en" | "ru" | "uk";
  questions: Array<{
    id: string;
    text: string;
    options: Array<{ id: string; text: string; correct?: boolean }>;
    explanation: string;
  }>;
  result: {
    headline: string;
    body: string;
    cta_text: string;
    cta_target: "/sign-up?from=quiz";
  };
};
```

### 7.4. Технически

- Чистый React, без отдельного движка
- localStorage для прогресса (если юзер ушёл — не теряем)
- Каждый ответ → событие `quiz_answer` → webhook в CRM

---

## 8. Демо-эпизод `/[locale]/demo` (детский путь)

### 8.1. Принцип

**Никакой регистрации перед демо.** Кликнул → играешь.

3–5 сцен из Эпизода 1 «Утро без сестры». Финал — клиффхэнгер + CTA на регистрацию.

### 8.2. UI (chat-style)

- Тёмный фон с лёгким шумом
- Сообщения с typing-индикатором и задержкой
- Аудио-кнопка у реплик (опционально)
- 2–4 кнопки выбора внизу
- Кнопка «📱 Take out phone» (icon, опционально)

### 8.3. JSON-схема сцены

```typescript
type Scene = {
  id: string; // "ep1_demo_s01"
  background?: string; // R2 URL
  ambient_audio?: string;
  messages: Array<{
    id: string;
    speaker: "narrator" | "sofa" | "marko" | string;
    text: string;
    audio?: string;
    delay_ms?: number;
    emotion?: "neutral" | "tense" | "cold" | "panic";
  }>;
  choices: Array<{
    id: string;
    text: string;
    next_scene_id: string;
  }>;
  is_cliffhanger?: boolean;
};
```

### 8.4. Pseudo-branching

Сюжет линейный. Все игроки приходят в один и тот же клиффхэнгер. Выборы влияют на следующую реплику (косметика). **Дерево решений строить не надо.**

### 8.5. Прогресс

В localStorage (анонимный юзер). После регистрации передаётся в CRM с пометкой «прошёл демо».

### 8.6. Финал

- Cliffhanger-карточка с эмоциональным текстом
- Кнопка «Continue the story →» / «Узнать, что дальше →»
- Ведёт на `/sign-up?from=demo`

---

## 9. Регистрация `/[locale]/sign-up`

### 9.1. Цель

Минимальное трение. **Любой барьер = -10% конверсии.**

### 9.2. Опции регистрации (порядок)

1. **Continue with Google** (OAuth)
2. **Continue with Apple** (OAuth) — обязательно для iOS-аудитории EN-рынка
3. **Continue with Facebook** (OAuth)
4. **Continue with Email** (magic link или email + код)
5. **Continue with Phone** (телефон + SMS-код)

### 9.3. Auth-провайдер

**Clerk** (рекомендация) — все соц-логины + email + phone из коробки, готовые компоненты UI.

Альтернатива — **NextAuth.js** + Twilio для SMS (бесплатно, но +неделя разработки).

### 9.4. Дополнительные поля (один экран, можно скипнуть)

- Имя родителя
- Имя ребёнка (опц.)
- Возраст ребёнка (dropdown 7–14, опц.)
- Город / страна (опц., автоопределение по IP)
- **Удобный мессенджер** (radio: WhatsApp / Telegram / Viber / Email — пред-выбор по региону)
- Согласие на обработку (обязательно)

### 9.5. После регистрации

1. Webhook в CRM с полным контекстом (см. раздел 11)
2. Редирект на `/welcome`

---

## 10. Welcome-экран `/[locale]/welcome`

### 10.1. Цель

**Сразу дать пользователю активное действие**, не оставлять «жди письма».

### 10.2. Экран

**Заголовок:** «Где удобнее получать историю?» / "Where do you want to play?"

### 10.3. Опции (порядок зависит от региона)

| EN-рынок (US/UK/CA/AU)            | RU-рынок (СНГ)                    |
| --------------------------------- | --------------------------------- |
| 1. **Get the App** ⭐ Recommended | 1. **Get the App** ⭐ Рекомендуем |
| 2. **WhatsApp**                   | 2. **Telegram**                   |
| 3. **Email**                      | 3. **WhatsApp**                   |
| 4. SMS                            | 4. **Viber**                      |
| 5. Telegram                       | 5. Email                          |

### 10.4. Что происходит при выборе

| Выбор        | Действие фронта                                                                                                                         |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| **App**      | Редирект на `/app` со store-бейджами + smart banner                                                                                     |
| **WhatsApp** | Webhook в CRM `channel: whatsapp` → CRM запускает бота через WA Cloud API → юзер видит экран «Откройте WhatsApp — вам пришло сообщение» |
| **Telegram** | Webhook в CRM + редирект на `t.me/<bot>?start=user_<id>_<lang>`                                                                         |
| **Viber**    | Webhook + редирект на `viber://pa?chatURI=<uri>&context=user_<id>`                                                                      |
| **SMS**      | Webhook → CRM шлёт SMS через Twilio                                                                                                     |
| **Email**    | Webhook → CRM шлёт email                                                                                                                |

**Важно:** во всех каналах **первое сообщение отправляет CRM/бот**, не сайт. Сайт только говорит CRM-у «активируй канал X для юзера Y».

Можно выбрать несколько каналов одновременно (мульти-чекбокс).

### 10.5. Дополнительный блок

После выбора → промо «А ещё есть приложение!» с бейджами + small print «вы можете изменить канал в любой момент через бота».

---

## 11. CRM-интеграция

### 11.1. Принцип

- CRM = источник истины. Сайт **не хранит** профиль юзера в своей БД.
- Все значимые события идут в CRM через **webhook**.
- CRM сама управляет дальше: рассылки, бот-сценарии, статусы лидов.

### 11.2. Какая CRM

**TBD** (будет выбрана отдельно). Возможные кандидаты:

- HubSpot
- Pipedrive
- ActiveCampaign
- AmoCRM (СНГ)
- Customer.io (особенно подходит для product-led + bot automation)
- Sendpulse / Manychat (чат-бот ориентированные)

**Требование к фронту:** webhook-клиент должен быть универсальным (один интерфейс, конфиг под конкретную CRM в env).

### 11.3. События, которые передаём в CRM

| Событие                 | Когда                              | Полезная нагрузка                                                                     |
| ----------------------- | ---------------------------------- | ------------------------------------------------------------------------------------- |
| `lead.identified`       | Юзер зарегистрировался             | email, phone, name, child*age, locale, region, source(utm*\*, landing_slug, audience) |
| `lead.channel_chosen`   | Выбрал канал доставки              | user_id, channels[], child_age, locale                                                |
| `funnel.demo_completed` | Прошёл демо до клиффхэнгера        | user_id (если есть) или anonymous_id, choices_path, time_total                        |
| `funnel.quiz_completed` | Прошёл квиз                        | anonymous_id или user_id, score, answers                                              |
| `funnel.app_clicked`    | Кликнул на App Store / Google Play | user_id, store, locale                                                                |
| `funnel.demo_started`   | Начал демо                         | anonymous_id, locale, source                                                          |
| `funnel.demo_abandoned` | Ушёл из демо                       | anonymous_id, last_scene_id, time_on_demo                                             |

### 11.4. Структура webhook-запроса

```typescript
POST /api/webhook  (на стороне CRM)
Headers:
  Authorization: Bearer <CRM_WEBHOOK_SECRET>
  Content-Type: application/json
Body:
{
  event: "lead.identified",
  timestamp: "2026-04-28T15:30:00Z",
  user: {
    external_id: "clerk_user_xxx",  // если есть
    anonymous_id: "abc-123",         // если нет регистрации
    email?: string,
    phone?: string,
    name?: string,
    child_name?: string,
    child_age?: number,
    locale: "en",
    region: "US",
  },
  source: {
    landing_slug?: string,
    audience?: "parent" | "kid",
    utm_source?: string,
    utm_medium?: string,
    utm_campaign?: string,
    utm_content?: string,
    referrer?: string,
  },
  funnel_state: {
    demo_completed: boolean,
    demo_choices?: string[],
    quiz_score?: number,
    visited_landings: string[],
  },
  payload: { /* event-specific data */ }
}
```

### 11.5. Что CRM делает после `lead.channel_chosen`

(Для понимания, не наша зона разработки)

1. Сохраняет лида с тегами (audience, channel, language)
2. Триггерит автоматическую кампанию-сценарий бота
3. Бот шлёт первое сообщение в выбранный канал через нативные API:
   - Telegram Bot API
   - WhatsApp Cloud API
   - Viber Public Account API
   - Email (через CRM)
   - SMS (через CRM)
4. Дальше бот ведёт пользователя через сценарий продажи до подписки
5. CRM статус лида двигается автоматически: `new → engaged → trial → paid`

### 11.6. Идентификация анонимного юзера до регистрации

- При первом заходе генерируем `anonymous_id` (UUID), кладём в localStorage и cookie
- Все события до регистрации идут с этим ID
- При регистрации в CRM передаём оба: `anonymous_id` + `external_id` → CRM их сшивает (мерж лидов)

---

## 12. Промо приложения `/[locale]/app`

### 12.1. Содержимое

- Hero: «The full story lives in the app» + 3 скриншота
- Бейджи **App Store** и **Google Play** (на старте — заглушки + «Get notified at launch» с email-формой → webhook `lead.app_waitlist`)
- 5–7 фич приложения (бейджи: «10–12 yo», «no ads», «offline play», «parent dashboard»)
- QR-код на десктопе

### 12.2. Smart App Banner

Поддержка `<meta name="apple-itunes-app">` для нативной плашки на iOS Safari.

---

## 13. Архитектура контента

### 13.1. Принцип

Контент = JSON в репо. Валидация через **Zod** при билде. Билд падает, если контент сломан.

### 13.2. Структура

```
/content
  /landings/
    en/fear-tiktok.json
    en/mystery.json
    ru/fear-tiktok.json
    ...
  /demo/
    ep1_demo.json
  /quiz/
    parent_pain_v1.json
    parent_pain_v2.json
  /strings/
    en.json
    ru.json
    uk.json
```

### 13.3. Этап 2 — миграция в headless CMS

Когда лендингов станет > 30 или маркетолог захочет редактировать без PR — переезд в Sanity / Strapi. Архитектура контента к этому готова.

---

## 14. Аналитика

### 14.1. Стек

- **PostHog** — продуктовая аналитика, воронка, retention
- **GA4** — стандартная веб-аналитика
- **Meta Pixel** — для рекламы
- **TikTok Pixel** — для рекламы
- **Microsoft Clarity** или **Hotjar** — записи сессий первых 1000 юзеров

### 14.2. События (повторение для полноты)

| Событие                                                                            | Где                                                     |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------- |
| `landing_view`                                                                     | PostHog + GA4 + Pixels (`PageView`)                     |
| `cta_click`                                                                        | PostHog + Pixels (`ViewContent`)                        |
| `quiz_started`, `quiz_answer`, `quiz_completed`                                    | PostHog + CRM webhook                                   |
| `demo_started`, `scene_entered`, `choice_made`, `demo_completed`, `demo_abandoned` | PostHog + CRM webhook                                   |
| `signup_started`, `signup_completed`                                               | PostHog + Pixels (`Lead`) + CRM webhook                 |
| `channel_selected`                                                                 | PostHog + Pixels (`CompleteRegistration`) + CRM webhook |
| `app_link_clicked`                                                                 | PostHog + Pixels                                        |
| `exit_intent`                                                                      | PostHog                                                 |

---

## 15. A/B-тесты

### 15.1. Что тестируем

- Заголовки лендингов (фактор №1)
- Тексты CTA («Play demo» vs «Start the story» vs «Find Sofia»)
- Hero-визуал (видео vs Lottie vs статика)
- Порядок каналов на `/welcome`
- Длина квиза (3 vs 5 вопросов)

### 15.2. Как

- Через query `?v=a|b|c` + cookie на сохранение
- Vercel Edge Middleware распределяет
- В аналитике сегментация по `variant_id`
- В CRM webhook поле `ab_variant`

---

## 16. Локализация

- **next-intl** для строк
- Тексты лендингов и сцен — отдельные JSON по локалям
- `hreflang` теги
- Переключатель языка в шапке (всегда виден)
- Дефолтный — по `Accept-Language` + сохранение в cookie

---

## 17. Производительность

| Метрика           | Цель           |
| ----------------- | -------------- |
| LCP (mobile, 4G)  | ≤ 1.5s         |
| INP               | ≤ 200ms        |
| CLS               | ≤ 0.05         |
| JS bundle landing | ≤ 220 KB gz \* |
| JS bundle demo    | ≤ 200 KB gz    |

\* **Пересмотрено 2026-05 (см. `docs/PERF_PLAN.md`).** Исходный таргет ≤ 80 КБ
недостижим на Next 16 App Router + React 19 + next-intl при наличии клиентского
интерактива (кнопка заявки, переключатель темы/языка, cookie-баннер): сам
фреймворк-пол ≈ 200 КБ gz (react-dom ~69, рантайм Next ~133, next-intl ~12).
После оптимизации лендинг = 214 КБ (было 459, −53%): framer, движок формы,
posthog и Node-полифилл crypto вынесены из первой загрузки. Реалистичный
ориентир — **держать route-specific клиентский JS минимальным** (тяжёлое —
через `next/dynamic` и после consent), не превышая фреймворк-пол.

**Меры:**

- SSG для всех лендингов и квиза
- ISR для главной (revalidate 1h)
- Динамический импорт демо-движка только на `/demo`
- Hero-видео ≤ 1 МБ WebM + poster JPEG
- Шрифты self-hosted, max 2 файла, `font-display: swap`
- `next/image` с AVIF/WebP

---

## 18. SEO

- Уникальные `<title>` и `<meta description>` на каждом роуте
- Open Graph + Twitter Card
- OG-картинки динамические через `@vercel/og`
- `sitemap.xml`, `robots.txt`, `hreflang`
- JSON-LD `Course` или `Game` на главной

---

## 19. Доступность и приватность

- a11y: контраст 4.5:1, клавиатурная навигация, ARIA на демо-сценах (`aria-live`)
- `prefers-reduced-motion` отключает анимации hero
- HTTPS, HSTS, CSP-заголовки
- **Cookie banner** (GDPR + CCPA для US)
- **COPPA для US:** если регистрируется ребёнок <13 — родительское согласие. Дефолт-флоу — «Я родитель, регистрирую ребёнка».
- Email и телефон лидов хешируются (SHA-256) перед отправкой в рекламные пиксели

---

## 20. Технический стек

| Слой        | Решение                                         |
| ----------- | ----------------------------------------------- |
| Framework   | **Next.js 16.2.4 (App Router) + TypeScript strict** |
| Стили       | **Tailwind CSS**                                |
| Анимации    | **Framer Motion**                               |
| Демо-движок | **Zustand** для state, чистый React UI          |
| Auth        | **Clerk**                                       |
| Валидация   | **Zod**                                         |
| Формы       | **React Hook Form**                             |
| i18n        | **next-intl**                                   |
| Аналитика   | **PostHog**, GA4, Meta Pixel, TikTok Pixel      |
| Хостинг     | **Vercel**                                      |
| Медиа CDN   | **Cloudflare R2**                               |
| CRM         | **TBD** (внешняя), интеграция через webhook     |

### Чего НЕТ в стеке

- Своей БД (опционально — лёгкий KV типа Upstash для дедупликации событий)
- Бэкенда для рассылок (это в CRM)
- Twilio / Resend / Bot APIs на сайте (это в CRM)
- Своей админки

---

## 21. Структура репозитория

```
/app
  /[locale]/
    /page.tsx                       # главная
    /lp/[slug]/page.tsx             # шаблон лендинга
    /parents/page.tsx
    /kids/page.tsx
    /demo/page.tsx
    /quiz/page.tsx
    /sign-up/page.tsx
    /welcome/page.tsx
    /app/page.tsx
    /about, /faq, /privacy, /terms
  /api/
    /webhook/clerk/route.ts         # Clerk → forward в CRM
    /track/route.ts                 # серверный трекинг → CRM webhook
    /leads/route.ts                 # форма заявки → CRM webhook
    /og/route.tsx                   # @vercel/og
/components
  /landing/                         # Hero, Pain, Solution, Quiz, FAQ, CTA
  /demo/                            # SceneEngine, ChatBubble, ChoiceButtons
  /quiz/                            # QuizEngine, Question, Result
  /auth/                            # обёртки Clerk
  /ui/                              # кнопки, формы, базовые
/content
  /landings/{en,ru,uk}/*.json
  /demo/*.json
  /quiz/*.json
  /strings/{en,ru,uk}.json
/lib
  /tracking.ts                      # PostHog + Pixels
  /crm-webhook.ts                   # универсальный клиент
  /delivery-links.ts                # WA/TG/Viber deep links
  /anonymous-id.ts                  # генерация и сохранение
  /i18n.ts
/public
  favicon, OG defaults
```

---

## 22. MVP-чеклист (что должно быть в Этапе 1)

- [ ] Главная `/[locale]/` на 2 языках (EN + RU) с двумя CTA
- [ ] Шаблон лендинга `/lp/[slug]` (двухформатный: parent + kid)
- [ ] Минимум 8 лендингов × 2 языка = 16 страниц
- [ ] Мини-квиз `/quiz` (родительский путь)
- [ ] Демо-эпизод `/demo` (5 сцен, без регистрации, детский путь)
- [ ] Регистрация через Clerk (Google, Apple, Facebook, Email, Phone)
- [ ] Welcome-экран с регион-зависимым выбором канала
- [ ] Промо приложения `/app` со store-бейджами
- [ ] Webhook-клиент в CRM (универсальный)
- [ ] Аналитика: PostHog + GA4 + Meta Pixel + TikTok Pixel
- [ ] A/B механика через query + cookie
- [ ] Cookie banner (GDPR + CCPA)
- [ ] Privacy / Terms / FAQ / About
- [ ] Lighthouse Performance / SEO / A11y ≥ 90 на мобиле
- [ ] Деплой на Vercel + кастомный домен

---

## 23. Что НЕ делаем на Этапе 1

- Свою БД для профилей юзеров (всё в CRM)
- Свою админку заявок (CRM = админка)
- Полный курс из 40 эпизодов (только 1 демо)
- Платежи на сайте (всё в приложении и через бота)
- Личный кабинет с прогрессом курса
- Отправку email/SMS/мессенджер-сообщений с сайта (это делает CRM)
- Прямые интеграции с Twilio / Resend / Bot APIs
- Headless CMS (JSON в репо хватит на старте)
- Сложные ветвления сюжета в демо
- Конструктор сцен / квизов в админке
- Реферальную программу
- Блог
- Языки кроме EN/RU/UK

---

## 24. Что нужно от заказчика для старта

| #   | Что                                                                                                                     | Когда        |
| --- | ----------------------------------------------------------------------------------------------------------------------- | ------------ |
| 1   | **Выбор CRM** + доступы + webhook URL + secret                                                                          | До спринта 3 |
| 2   | Тексты лендингов на EN и RU (16 наборов)                                                                                | Спринт 2     |
| 3   | Тексты сцен демо-эпизода (есть в `КНИГА/ЭП_01.md`, нужна адаптация на EN)                                               | Спринт 2     |
| 4   | Аудио для сцен демо (EN + RU)                                                                                           | Спринт 2     |
| 5   | Hero-видео (10 сек, моушн-дизайнер)                                                                                     | Спринт 1     |
| 6   | Скриншоты приложения / экранов бота                                                                                     | Спринт 3     |
| 7   | Логотип, фавикон, OG-дефолты                                                                                            | Спринт 1     |
| 8   | Доменное имя + DNS                                                                                                      | Спринт 1     |
| 9   | Аккаунты: Vercel, Cloudflare R2, Clerk, PostHog, Meta Business, TikTok Ads, GA4, App Store Connect, Google Play Console | Спринт 1     |
| 10  | Privacy Policy + Terms (юрист)                                                                                          | Спринт 4     |

---

## 25. Этапы и сроки

### Спринт 1 (1 неделя) — Каркас

- Next.js + TS + Tailwind + Framer + i18n (EN + RU)
- Главная `/[locale]/` со sticky-CTA
- Аналитика и пиксели подключены
- Cookie banner, заглушки privacy/terms
- Деплой на Vercel
- **Результат:** работающая главная на 2 языках

### Спринт 2 (1.5 недели) — Лендинги, квиз, демо

- Шаблон `/lp/[slug]` (двухформатный)
- 4 лендинга × 2 языка = 8 страниц
- Мини-квиз с 1 готовым набором вопросов
- Демо-движок + 1 эпизод (5 сцен, без аудио — текст и анимации)
- **Результат:** трафик можно лить, лендинги конвертируют в квиз/демо

### Спринт 3 (1 неделя) — Регистрация и CRM

- Clerk auth
- `/sign-up` и `/welcome`
- Webhook-клиент в CRM
- Все события идут в CRM
- Deep links в мессенджеры
- `/app` со store-бейджами
- **Результат:** end-to-end воронка: реклама → регистрация → CRM активирует бота

### Спринт 4 (1 неделя) — Полировка

- Ещё 4 лендинга × 2 языка = 8 страниц
- Аудио в демо-сцены (когда придёт)
- Lighthouse-оптимизация
- a11y-аудит
- QA на iOS Safari + Android Chrome + десктопе
- A/B-эксперименты включены

**Общий срок: 4 недели (3.5–4.5 в зависимости от готовности контента и CRM).**

---

## 26. Главные принципы (повторяю — критично)

1. **Сайт = воронка до регистрации, не больше.** Всё после — в CRM и боте.
2. **Демо/квиз без регистрации.** Это главный фактор конверсии.
3. **Регистрация максимально простая** — соц-логин в один клик.
4. **Welcome-экран ведёт к активному действию**, не к «жди письма».
5. **Мобильное приложение — приоритетный канал** на `/welcome`.
6. **Регион определяет порядок каналов** (US → WhatsApp first, RU → Telegram first).
7. **Мульти-канал:** юзер может выбрать несколько каналов одновременно.
8. **Контент = JSON-данные.** Новый лендинг = новый файл, без программиста.
9. **i18n с первого дня** (EN + RU).
10. **UTM не теряются** на всём пути ad → landing → demo/quiz → signup → channel.
11. **Скорость на мобиле** — приоритет (LCP ≤ 1.5s).
12. **CRM = источник истины.** Сайт ничего не хранит долгосрочно, кроме сессионных данных.

---

## 27. Контакты

- **Заказчик:** Iurii Novoselov, iurii.novoselov@gmail.com
- **Репозиторий:** TBD (GitHub private)
- **Дизайнер:** TBD
- **Тексты:** Iurii (на основе `КНИГА/`)
- **CRM-выбор:** TBD до спринта 3
- **Стендапы:** 2 раза в неделю
- **Демо-показ:** в конце каждого спринта

---

_Документ живой. Изменения — через PR._
