const CACHE_NAME = 'spa-cache-v1';
const urlsToCache = [
  '/',                // Página inicial
  '/index.html',      // HTML principal
  '/logoLowQuality.png',        // Ícono de la app
  '/assets/index.css',      // Archivo CSS
  '/main.jsx',         // Código principal JS
  '/offline.html',    // Página para cuando no haya conexión
];

// Fase de instalación: Cacha los archivos esenciales
self.addEventListener('install', (event) => {
  console.log('Service Worker: Instalado');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Archivos en caché');
      return cache.addAll(urlsToCache);
    })
  );
});

// Fase de activación: Limpia cachés antiguos
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME]; // Mantén solo el caché actual
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('Eliminando caché antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Intercepta las solicitudes (fetch) y responde desde la caché o la red
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Devuelve la respuesta de caché si está disponible
      return (
        response ||
        fetch(event.request).catch(() => {
          // Si la solicitud falla (por ejemplo, no hay red), devuelve la página offline
          return caches.match('/offline.html');
        })
      );
    })
  );
});