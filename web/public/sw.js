// Service Worker per PWA - Versione 1.8.0
const CACHE_NAME = 'cantieri-app-v8';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/vite.svg',
  '/betoniera.png',
  '/icon-192.png',
  '/icon-512.png'
];

// Installazione Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker v1.8.0');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Cache aperta');
      return cache.addAll(urlsToCache).catch((err) => {
        console.warn('[SW] Alcune risorse non sono state memorizzate:', err);
      });
    })
  );
  // Forza attivazione immediata
  self.skipWaiting();
});

// Attivazione Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker v1.8.0');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Eliminazione cache vecchia:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Prendi controllo immediato di tutte le pagine
  return self.clients.claim();
});

// Intercetta richieste di rete
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignora le richieste non GET (es. POST, PUT, DELETE)
  if (request.method !== 'GET') {
    event.respondWith(fetch(request));
    return;
  }

  // Ignora Firebase e richieste esterne
  if (url.origin !== location.origin) {
    event.respondWith(fetch(request));
    return;
  }

  // NETWORK FIRST per HTML, JS, CSS (file critici che cambiano spesso)
  const isDocument = request.destination === 'document';
  const isScript = request.destination === 'script';
  const isStyle = request.destination === 'style';
  const isHtml = url.pathname === '/' || url.pathname === '/index.html';

  if (isDocument || isScript || isStyle || isHtml) {
    // Strategia NETWORK FIRST - prova prima la rete
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          // Se la rete funziona, salva in cache e ritorna
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Se la rete fallisce, usa la cache come fallback
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              console.log('[SW] Serving from cache (offline):', request.url);
              return cachedResponse;
            }
            // Nessuna cache disponibile
            return new Response('Risorsa non disponibile offline', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({ 'Content-Type': 'text/plain' })
            });
          });
        })
    );
    return;
  }

  // CACHE FIRST per immagini e static assets (cambiano raramente)
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Ritorna dalla cache ma aggiorna in background
        fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, networkResponse);
            });
          }
        }).catch(() => {
          // Ignora errori di rete per assets
        });
        return cachedResponse;
      }

      // Non in cache, recupera dalla rete
      return fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return networkResponse;
      });
    })
  );
});

// Ascolta messaggi dall'app per aggiornamenti
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
