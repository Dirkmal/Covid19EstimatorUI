var CACHE_NAME = 'c19e-sw-v1';
var urls_to_cache = [
	'./',
	'./index.html',
	'./styles.css',
	'./estimator.min.js',
	'./assets/favicon-128.png',
	'./manifest.json'
];
self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME)
		.then(cache => {
			return cache.addAll(urls_to_cache);
		})
	)
})

self.addEventListener('fetch', function(event) {
	event.respondWith(
		caches.match(event.request)
			.then(function(response) {
			// Cache hit - return response
			if (response) {
				return response;
			}
  
		  	return fetch(event.request).then(
				function(response) {
				// Check if we received a valid response
				if(!response || response.status !== 200 || response.type !== 'basic') {
					return response;
				}
	
				// IMPORTANT: Clone the response. A response is a stream
				// and because we want the browser to consume the response
				// as well as the cache consuming the response, we need
				// to clone it so we have two streams.
				var responseToCache = response.clone();
  
			 	caches.open(CACHE_NAME)
				.then(function(cache) {
				  cache.put(event.request, responseToCache);
				});
  
			  	return response;
			});
		})
	);
});