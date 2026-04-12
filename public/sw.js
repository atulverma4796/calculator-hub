// CalcHub Service Worker — Offline Support
const CACHE_NAME = "calchub-v1";
const OFFLINE_URL = "/";

// Pre-cache the app shell
const PRECACHE_URLS = [
  "/",
  "/about",
  "/privacy",
  "/terms",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Skip non-GET and external requests
  if (request.method !== "GET") return;
  if (!request.url.startsWith(self.location.origin)) return;

  // Skip API routes
  if (request.url.includes("/api/")) return;

  event.respondWith(
    caches.match(request).then((cached) => {
      // Network-first for navigation, cache-first for assets
      if (request.mode === "navigate") {
        return fetch(request)
          .then((response) => {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            return response;
          })
          .catch(() => cached || caches.match(OFFLINE_URL));
      }

      // Cache-first for static assets
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response.ok && (request.url.includes("/_next/static/") || request.url.includes("/favicon"))) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      });
    })
  );
});
