This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Локальный запуск

### Разработка (правишь код)

```bash
npm run dev
```

Открыть [http://localhost:3000](http://localhost:3000). Страница сама обновляется при правках кода.

⚠️ **Dev-сервер ощущается медленным — это нормально, не баг и не «деградация».** Next компилирует каждый маршрут в момент первого клика на него, поэтому переход «кликнул → подождал секунду → открылось». Повторный заход уже быстрый. По скорости dev-сервера **нельзя** судить о реальной скорости сайта.

Если в браузере вылезает `Failed to load chunk …` — это устаревший кэш HMR. Лечение:
1. Жёсткое обновление вкладки: `Ctrl+Shift+R`.
2. Если не помогло — остановить dev (`Ctrl+C`), затем:
   ```bash
   rm -rf .next && npm run dev
   ```

### Проверка реальной скорости (как у пользователей)

Чтобы оценить, как сайт работает в продакшене (статика + префетч, переходы почти мгновенные):

```bash
npm run build && npx next start -p 3137
```

Открыть [http://localhost:3137](http://localhost:3137) и кликать по меню / менять язык. Порт `3137` взят, чтобы не конфликтовать с dev на `3000` — можно держать оба запущенными. Это и есть честный замер скорости.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
