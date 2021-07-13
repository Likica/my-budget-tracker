// const FILES_TO_CACHE = [
//     '/',
//     './js/index.js',
//     './js/idb.js',
//     '/css/styles.css',
//     'manifest.json'
// ];
// const PRECACHE = 'precache-v1';
// const RUNTIME = 'runtime';
// self.addEventListener('install', (event) => {
//     event.waitUntil(
//         caches
//             .open(PRECACHE)
//             .then((cache) => cache.addAll(FILES_TO_CACHE))
//             .then(self.skipWaiting())
//     );
// });
// // The activate handler takes care of cleaning up old caches.
// self.addEventListener('activate', (event) => {
//     const currentCaches = [PRECACHE, RUNTIME];
//     event.waitUntil(
//         caches
//             .keys()
//             .then((cacheNames) => {
//                 return cacheNames.filter((cacheName) => !currentCaches.includes(cacheName));
//             })
//             .then((cachesToDelete) => {
//                 return Promise.all(
//                     cachesToDelete.map((cacheToDelete) => {
//                         return caches.delete(cacheToDelete);
//                     })
//                 );
//             })
//             .then(() => self.clients.claim())
//     );
// });
// self.addEventListener('fetch', (event) => {
//     if (event.request.url.startsWith(self.location.origin)) {
//         event.respondWith(
//             caches.match(event.request).then((cachedResponse) => {
//                 if (cachedResponse) {
//                     return cachedResponse;
//                 }
//                 return caches.open(RUNTIME).then((cache) => {
//                     return fetch(event.request).then((response) => {
//                         return cache.put(event.request, response.clone()).then(() => {
//                             return response;
//                         });
//                     });
//                 });
//             })
//         );
//     }
// });


var CACHE_NAME = "my-site-cache-v1";
const DATA_CACHE_NAME = "data-cache-v1";
var urlsToCache = [
    "/",
    "/js/idb.js",
    "/js/index.js",
    "/manifest.json",
    "/css/styles.css",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png"
];
self.addEventListener("install", function (event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            console.log("Opened cache");
            return cache.addAll(urlsToCache);
        })
    );
});
self.addEventListener("fetch", function (event) {
    // cache all get requests to /api routes
    if (event.request.url.includes("/api/")) {
        event.respondWith(
            caches.open(DATA_CACHE_NAME).then(cache => {
                return fetch(event.request)
                    .then(response => {
                        // If the response was good, clone it and store it in the cache.
                        if (response.status === 200) {
                            cache.put(event.request.url, response.clone());
                        }
                        return response;
                    })
                    .catch(err => {
                        // Network request failed, try to get it from the cache.
                        return cache.match(event.request);
                    });
            }).catch(err => console.log(err))
        );
        return;
    }
    event.respondWith(
        fetch(event.request).catch(function () {
            return caches.match(event.request).then(function (response) {
                if (response) {
                    return response;
                } else if (event.request.headers.get("accept").includes("text/html")) {
                    // return the cached home page for all requests for html pages
                    return caches.match("/");
                }
            });
        })
    );
});