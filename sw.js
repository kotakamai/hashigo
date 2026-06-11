// HashiGO PWA Service Worker — ネットワーク優先（デモ更新を即反映）、オフライン時のみキャッシュ
const CACHE = "hashigo-v1";

self.addEventListener("install", e => {
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(clients.claim());
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request)
      .then(res => {
        if (res.ok && new URL(e.request.url).origin === location.origin) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
