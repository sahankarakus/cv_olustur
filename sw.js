// CVZirve Service Worker - Çevrimdışı Çalışma & Hızlı Önbellekleme
const CACHE_NAME = 'cvzirve-cache-v2';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './css/main.css',
  './css/editor.css',
  './css/preview.css',
  './css/templates.css',
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
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    }).catch(() => {
      return caches.match('./index.html');
    })
  );
});
