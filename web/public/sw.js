// Service Worker per PWA - Versione 1.1.0
const CACHE_NAME = 'cantieri-app-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/vite.svg',
  '/logo-general-beton.svg',
  '/general-beton.png'
];

// Installazione Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Cache aperta');
      return cache.addAll(urlsToCache).catch((err) => {
        console.warn('Alcune risorse non sono state memorizzate:', err);
      });
    })
  );
  // Forza attivazione immediata
  self.skipWaiting();
});

// Attivazione Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Eliminazione cache vecchia:', cacheName);
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
  // Ignora le richieste non GET (es. POST, PUT, DELETE)
  if (request.method !== 'GET') {
    // Per le richieste non GET, passa direttamente alla rete senza cache
    event.respondWith(fetch(request));
    return;
  }

  // Gestione strategia Cache First con fallback alla rete
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      // Se la risorsa è in cache, restituiscila
      if (cachedResponse) {
        return cachedResponse;
      }

      // Altrimenti, recupera dalla rete
      return fetch(request).then((networkResponse) => {
        // Controlla se la risposta è valida per la cache
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          networkResponse.type === 'basic'
        ) {
          // Clona la risposta per memorizzarla in cache
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache).catch((err) => {
              console.warn('Impossibile memorizzare in cache:', request.url, err);
            });
          });
        }
        return networkResponse;
      }).catch(() => {
        // Se la rete fallisce e non abbiamo la risorsa in cache,
        // possiamo restituire una pagina di fallback (opzionale)
        // Per ora restituiamo undefined (che causa errore)
        return new Response('Risorsa non disponibile offline', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: new Headers({ 'Content-Type': 'text/plain' })
        });
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
