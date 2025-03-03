const CACHE_NAME = 'feelog-app-cache-v1';

const ALLOWED_CONTENT_TYPES = [
  'text/html',
  'text/css',
  'text/javascript',
  'text/plain',
  'application/xml',
  'application/javascript',
  'font/otf',
  'font/ttf',
  'font/woff',
  'font/woff2',
  'image/svg+xml',
];

const ALLOWED_CASHED_DOMAIN_LIST = [
  'https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.js',
];

const ALLOWED_CASHED_ORIGIN_PATH_LIST = ['/media', '/static', '/assets'];

self.addEventListener('install', (event) => {
  // 설치 단계에서 초기 캐싱 (필요한 정적 파일만 캐싱)
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/', // 홈 페이지
        '/index.html', // HTML 파일,
        '/manifest.json',
        '/robots.txt',
        '/sitemap.xml',
      ]);
    }),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (
    ALLOWED_CASHED_DOMAIN_LIST.some((v) => request.url.startsWith(v)) ||
    ALLOWED_CASHED_ORIGIN_PATH_LIST.some((v) => {
      try {
        const url = new URL(request.url);
        return url.pathname.startsWith(v);
      } catch (e) {
        return false;
      }
    })
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(request).then((networkResponse) => {
          // return caches.open(CACHE_NAME).then((cache) => {
          //   cache.put(request, networkResponse.clone());
          //   return networkResponse;
          // });
          // 응답의 Content-Type 확인 후 캐싱
          // const contentType = networkResponse.headers.get('Content-Type');

          try {
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, networkResponse.clone());
              return networkResponse;
            });
          } catch (e) {
            return networkResponse;
          }
        });
      }),
    );
  }
});

self.addEventListener('activate', (event) => {
  // 오래된 캐시 제거
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            // console.log('Removing old cache:', key);
            return caches.delete(key);
          }
        }),
      ),
    ),
  );
});
