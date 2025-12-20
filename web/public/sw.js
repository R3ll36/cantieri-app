// Service Worker per PWA - Versione 1.0.0
const CACHE_NAME = 'cantieri-app-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
];

// Installazione Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Cache aperta');
      return cache.addAll(urlsToCache);
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
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Se la risposta è valida, cachala
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Se offline, prova a servire dalla cache
        return caches.match(event.request);
      })
  );
});

// Ascolta messaggi dall'app per aggiornamenti
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
