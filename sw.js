// Cartograffect Service Worker for offline capability & PWA caching
const CACHE_NAME = 'cartograffect-v4.0-unified';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './moteur-predictif.html',
  './noyau-affectif.html',
  './matrice-affective.html',
  './taxonomie-affective.html',
  './article.html',
  './scholar_drive.html',
  './voyage.html',
  './voyage.css',
  './voyage.js',
  './emotions.html',
  './mentions-legales.html',
  './maintenance.html',
  './404.html',
  './maintenance_guard.js',
  './cartograffect_model.js',
  './cartograffect_theory.js',
  './corpus_system.js',
  './command_palette.js',
  './octahedral_navigator.js',
  './dynamic_cartograffect.js',
  './bilingual_modal.js',
  './script.js',
  './manifest.json',
  './style.css',
  './assets/tailwind.config.js',
  './assets/logo.png',
  './assets/logo-96.png',
  './assets/logo-192.png',
  './assets/logo-icon.svg',
  './assets/favicon.svg',
  './assets/favicon-32.png',
  './assets/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(err => {
        console.warn('SW Precache failed for some assets:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  const isLocalhost = url.hostname === 'localhost' || url.hostname === '127.0.0.1';

  // On localhost, bypass cache entirely so development edits are always 100% fresh
  if (isLocalhost) {
    event.respondWith(fetch(event.request));
    return;
  }

  const isHtml = event.request.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname === '/';
  if (isHtml) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match(event.request).then((cached) => {
            return cached || caches.match('./index.html');
          });
        })
    );
    return;
  }

  // Stale-while-revalidate for static assets (images, fonts, css)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
          }
        }).catch(() => {});
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});
