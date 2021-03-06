var VERSION = 'v2';

// 缓存
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(VERSION).then(function(cache) {
            return cache.addAll([]);
        })
    );
});

// 缓存更新
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    console.log(cacheName,VERSION);
                    // 如果当前版本和缓存版本不一致
                    if (cacheName !== VERSION) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// 捕获请求并返回缓存数据
self.addEventListener('fetch', function(event) {
    event.respondWith(caches.match(event.request).catch(function() {
        return fetch(event.request);
    }).then(function(response) {
        var responseCache = response.clone();
        caches.open(VERSION).then(function(cache) {
            cache.put(event.request, responseCache);
        });
        return response
    }).catch(function() {
        return fetch(event.request)
    }));
});