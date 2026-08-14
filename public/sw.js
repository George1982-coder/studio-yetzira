/* Minimal service worker — required by Chrome for reliable PWA install. */
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  // Network-first: keep site working offline-capable enough for install criteria
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request)),
  );
});
