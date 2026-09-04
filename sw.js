const CACHE_NAME = "overtime-calc-v2"; // 버전 문자열을 바꿀 때마다 예전 캐시가 자동으로 정리됩니다.
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
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

// 네트워크 우선: 온라인이면 항상 최신 파일을 받아오고, 오프라인일 때만 캐시를 사용합니다.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, res.clone()));
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});
