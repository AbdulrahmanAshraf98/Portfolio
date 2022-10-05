const cacheName = "cache-v6";
self.addEventListener("activate", (activateEvent) => {
	activateEvent.waitUntil(
		caches.keys().then((keys) => {
			return Promise.all(
				keys
					.filter((key) => key !== cacheName)
					.map((key) => caches.delete(key)),
			);
		}),
	);
});
self.addEventListener("fetch", (fetchEvent) => {
	fetchEvent.respondWith(
		caches.match(fetchEvent.request).then((response) => {
			return (
				response ||
				fetch(fetchEvent.request).then((fetchedRes) => {
					return caches.open(cacheName).then((cache) => {
						cache.put(fetchEvent.request, fetchedRes.clone());
						return fetchedRes;
					});
				})
			);
		}),
	);
});
