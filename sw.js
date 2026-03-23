const CACHE_NAME = "hollow-v1"
const OFFLINE_URLS = [
    "/",
    "/index.html",
    "/style.css",
    "/script.js",
    "/functions.js",
    "/history.js",
    "/windowDrag.js",
    "/base64.js",
    "/manifest.webmanifest",
    "/favicon.ico",
    "/assets/icon-any.svg",
    "/assets/icon-maskable.svg",
    "/assets/geo.png",
    "/assets/rosary.png",
    "/assets/hornet.png",
    "/assets/theknight.png"
]

self.addEventListener("install", (event) => {
    event.waitUntil((async () => {
        const cache = await caches.open(CACHE_NAME)
        await cache.addAll(OFFLINE_URLS)
        await self.skipWaiting()
    })())
})

self.addEventListener("activate", (event) => {
    event.waitUntil((async () => {
        const keys = await caches.keys()
        await Promise.all(keys.map((key) => {
            if (key !== CACHE_NAME) {
                return caches.delete(key)
            }
            return Promise.resolve()
        }))
        await self.clients.claim()
    })())
})

self.addEventListener("fetch", (event) => {
    if (event.request.method !== "GET") {
        return
    }

    event.respondWith((async () => {
        const request = event.request

        try {
            const networkResponse = await fetch(request)
            const cache = await caches.open(CACHE_NAME)
            cache.put(request, networkResponse.clone())
            return networkResponse
        } catch (_error) {
            const cached = await caches.match(request)
            if (cached) {
                return cached
            }

            if (request.mode === "navigate") {
                const fallback = await caches.match("/index.html")
                if (fallback) {
                    return fallback
                }
            }

            throw _error
        }
    })())
})
