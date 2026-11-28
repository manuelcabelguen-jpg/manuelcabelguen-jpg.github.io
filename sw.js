/**
 * CARTOGRAFFECT — Service Worker (PWA & Offline Scientific Archive)
 * Version: v3.0.0-r1
 * License: AGPL-3.0-or-later
 */

const CACHE_NAME = 'cartograffect-v3.0.0-r1';

const PRECACHE_ASSETS = [
  './',
  './index.html',
  './article.html',
  './scholar_drive.html',
  './moteur-predictif.html',
  './noyau-affectif.html',
  './matrice-affective.html',
  './taxonomie-affective.html',
  './mentions-legales.html',
  './voyage.html',
  './emotions.html',
  './assets/styles.min.css',
  './style.css',
  './script.js',
  './js/compendium_payload.js',
  './js/i18n.js',
  './cartograffect_model.js',
  './cartograffect_theory.js',
  './dynamic_cartograffect.js',
  './octahedral_navigator.js',
  './hero_octahedron.js',
  './command_palette.js',
  './bilingual_modal.js',
  './corpus_system.js',
  './data/site-payload.json',
  './manifest.webmanifest'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(
        PRECACHE_ASSETS.map((url) =>
          cache.add(url).catch(() => null)
        )
      );
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name.startsWith('cartograffect-') && name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (url.pathname.endsWith('site-payload.json') || req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
          return res;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        if (res && res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
        }
        return res;
      });
    })
  );
});
