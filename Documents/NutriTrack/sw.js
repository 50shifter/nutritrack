/**
 * NutriTrack — Service Worker для PWA
 * Стратегия: Cache-First для статики, Network-First для динамических данных
 */

const CACHE_NAME = 'nutritrack-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/css/main.css',
  '/css/responsive.css',
  '/js/app.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Статика (CSS, JS): Cache First
  if (['/css/', '/js/'].some((p) => url.pathname.startsWith(p))) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) {
          fetch(request).then((r) => {
            if (r && r.status === 200) {
              const clone = r.clone();
              caches.open(CACHE_NAME).then((c) => c.put(request, clone));
            }
          });
          return cached;
        }
        return fetch(request);
      })
    );
    return;
  }

  // Главная страница: Network First
  if (request.destination === 'document') {
    event.respondWith(
      fetch(request)
        .then((r) => {
          const clone = r.clone();
          caches.open(CACHE_NAME).then((c) => c.put(request, clone));
          return r;
        })
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Всё остальное: Cache First
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request).catch(() => cached))
  );
});

// Регистрация Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then((reg) => console.log('✅ SW зарегистрирован', reg.scope))
    .catch((err) => console.warn('❌ SW ошибка', err));
}