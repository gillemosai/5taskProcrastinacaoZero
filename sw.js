
const CACHE_NAME = '5task-quantum-v76-stable';
const GITHUB_ASSETS = 'https://raw.githubusercontent.com/gillemosai/5TASK/main/assets/';

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.tailwindcss.com',
  `${GITHUB_ASSETS}5task-logo.png`,
  `${GITHUB_ASSETS}einstein-happy.png`,
  `${GITHUB_ASSETS}einstein-skeptical.png`,
  `${GITHUB_ASSETS}einstein-ecstatic.png`,
  `${GITHUB_ASSETS}einstein-worried.png`
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((networkResponse) => {
        if (networkResponse.status === 200) {
          const cacheCopy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cacheCopy));
        }
        return networkResponse;
      });
    }).catch(() => caches.match('./index.html'))
  );
});
