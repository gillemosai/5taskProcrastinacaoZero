
// 5Task Service Worker - v4.2.0
// Mudar o nome do CACHE força o navegador a instalar o novo SW e limpar o cache antigo.
const CACHE = "5task-quantum-v4-2-0-offline";
const offlineFallbackPage = "index.html";

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './manifest.webmanifest',
  'https://cdn.tailwindcss.com',
  'https://raw.githubusercontent.com/gillemosai/5taskProcrastinacaoZero/main/assets/5task-logo-192x192.png',
  'https://raw.githubusercontent.com/gillemosai/5taskProcrastinacaoZero/main/assets/5task-logo.png',
  'https://raw.githubusercontent.com/gillemosai/5taskProcrastinacaoZero/main/assets/einstein-happy.png',
  'https://raw.githubusercontent.com/gillemosai/5taskProcrastinacaoZero/main/assets/einstein-skeptical.png',
  'https://raw.githubusercontent.com/gillemosai/5taskProcrastinacaoZero/main/assets/einstein-ecstatic.png',
  'https://raw.githubusercontent.com/gillemosai/5taskProcrastinacaoZero/main/assets/einstein-worried.png'
];

// Escuta mensagem do app para pular a espera e ativar imediatamente
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener('install', (event) => {
  // Pré-cacheia os assets e ativa imediatamente (sem esperar o SW anterior fechar)
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Remove todos os caches antigos
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(k => k !== CACHE).map(k => {
          console.log('[SW] Removendo cache antigo:', k);
          return caches.delete(k);
        })
      );
    })
  );
  // Assume controle de todas as abas imediatamente
  self.clients.claim();
});

// Background Sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-tasks') {
    console.log('[SW] Syncing tasks...');
  }
});

// Push Notifications
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : { title: '5task', body: 'Novas atualizações!' };
  const options = {
    body: data.body,
    icon: 'https://raw.githubusercontent.com/gillemosai/5taskProcrastinacaoZero/main/assets/5task-logo-192x192.png',
    badge: 'https://raw.githubusercontent.com/gillemosai/5taskProcrastinacaoZero/main/assets/5task-logo-192x192.png'
  };
  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    // Para navegação: sempre tenta a rede primeiro (garante página atualizada)
    event.respondWith((async () => {
      try {
        const networkResp = await fetch(event.request);
        return networkResp;
      } catch (error) {
        // Offline: usa fallback do cache
        const cache = await caches.open(CACHE);
        const cachedResp = await cache.match(offlineFallbackPage);
        return cachedResp;
      }
    })());
  } else {
    // Para assets: Stale-While-Revalidate (retorna cache mas atualiza em background)
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const cacheCopy = networkResponse.clone();
            caches.open(CACHE).then((cache) => cache.put(event.request, cacheCopy));
          }
          return networkResponse;
        }).catch(() => {
          // Ignora erros de rede na revalidação
        });

        return cachedResponse || fetchPromise;
      })
    );
  }
});
