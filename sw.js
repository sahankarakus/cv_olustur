// CVZirve Service Worker - Çevrimdışı Çalışma & Hızlı Önbellekleme
const CACHE_NAME = 'cvzirve-cache-v3';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './css/main.css',
  './css/editor.css',
  './css/preview.css',
  './css/templates.css',
  './css/gallery.css',
  './css/print.css',
  './js/sample-data.js',
  './js/templates.js',
  './js/export.js',
  './js/app.js',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
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
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request).then((response) => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy)).catch(() => {});
      return response;
    }).catch(() => {
      return caches.match(event.request).then((cached) => cached || caches.match('./index.html'));
    })
  );
});
