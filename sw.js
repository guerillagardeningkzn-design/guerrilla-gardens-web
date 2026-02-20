const CACHE_NAME = 'ggardens-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/main.css',
  '/js/auth.js',
  '/js/main.js',
  '/manifest.webmanifest'
  // add more files here as you create them
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
      .catch(() => caches.match('/index.html'))  // fallback
  );
});
