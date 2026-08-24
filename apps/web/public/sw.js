const cacheName = "cache-v-platform-1";
self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== cacheName).map((key) => caches.delete(key))),
    ),
  );
});
self.addEventListener("fetch", (event) => {
  if (!String(event.request.url).startsWith("http")) return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return (
        cached ||
        fetch(event.request).then((response) => {
          const copy = response.clone();
          caches.open(cacheName).then((cache) => cache.put(event.request, copy));
          return response;
        })
      );
    }),
  );
});
