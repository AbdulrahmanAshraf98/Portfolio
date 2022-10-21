const cacheName = "cache-v15";
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
	// check if request is made by chrome extensions or web page
	// if request is made for web page url must contains http.
	if (!(fetchEvent.request.url.indexOf("http") === 0)) return; // skip the request. if request is not made with http protocol
	fetchEvent.respondWith(
		caches.match(fetchEvent.request).then((cacheResponse) => {
			return (
				cacheResponse ||
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
