"use client";

// Переводим браузерное восстановление скрола в "manual", чтобы страница всегда
// открывалась сверху, а не на прежней позиции скрола.
//
// Делаем это императивно (не тегом <script>), потому что [locale]/layout
// перерисовывается при смене языка, и React 19 ругается на исполняемый <script>
// внутри компонента при клиентской навигации ("script tag while rendering").
// Присваивание на уровне модуля выполняется один раз при загрузке клиентского
// бандла — максимально рано из доступного клиентского кода.
if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

export function ScrollRestoration() {
  return null;
}
