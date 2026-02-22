
// This is the "Offline page" service worker
importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

const CACHE = "5task-quantum-v77-offline";
const offlineFallbackPage = "index.html";

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.tailwindcss.com',
  'https://raw.githubusercontent.com/gillemosai/5TASK/main/assets/5task-logo.png',
  'https://raw.githubusercontent.com/gillemosai/5TASK/main/assets/einstein-happy.png',
  'https://raw.githubusercontent.com/gillemosai/5TASK/main/assets/einstein-skeptical.png',
  'https://raw.githubusercontent.com/gillemosai/5TASK/main/assets/einstein-ecstatic.png',
  'https://raw.githubusercontent.com/gillemosai/5TASK/main/assets/einstein-worried.png'
];

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    })
  );
  self.clients.claim();
});

if (workbox.navigationPreload.isSupported()) {
  workbox.navigationPreload.enable();
}

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const preloadResp = await event.preloadResponse;
        if (preloadResp) return preloadResp;
        const networkResp = await fetch(event.request);
        return networkResp;
      } catch (error) {
        const cache = await caches.open(CACHE);
        const cachedResp = await cache.match(offlineFallbackPage);
        return cachedResp;
      }
    })());
  } else {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request).then((networkResponse) => {
          if (networkResponse.status === 200) {
            const cacheCopy = networkResponse.clone();
            caches.open(CACHE).then((cache) => cache.put(event.request, cacheCopy));
          }
          return networkResponse;
        });
      })
    );
  }
});
