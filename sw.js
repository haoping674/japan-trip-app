const CACHE_NAME = "osaka-travel-v29";
const APP_SHELL = ["./", "./index.html", "./styles.css?v=16", "./app.js?v=19", "./redesign.js?v=1", "./editing.js?v=3", "./members.js?v=3", "./vendor/fontawesome/css/all.min.css", "./vendor/fontawesome/webfonts/fa-solid-900.woff2", "./vendor/fontawesome/webfonts/fa-regular-400.woff2", "./vendor/fontawesome/webfonts/fa-brands-400.woff2", "./manifest.webmanifest", "./icons/icon-192.png", "./icons/icon-512.png"];

self.addEventListener("install", (event) => event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())));
self.addEventListener("activate", (event) => event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET" || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => { const copy = response.clone(); caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy)); return response; }).catch(() => caches.match("./index.html"))));
});
