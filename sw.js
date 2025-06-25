// Service Worker for 生词本 PWA
const CACHE_NAME = 'vocabulary-app-v1';
const BASE_PATH = '/wordList';

// 需要缓存的资源
const STATIC_CACHE_URLS = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/index.html`,
  `${BASE_PATH}/manifest.json`,
  `${BASE_PATH}/icons/icon.svg`,
  `${BASE_PATH}/icons/icon-192x192.png`,
  `${BASE_PATH}/icons/icon-512x512.png`
];

// 安装事件 - 缓存静态资源
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static files');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        console.log('Service Worker: Installation complete');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Installation failed', error);
      })
  );
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activation complete');
        return self.clients.claim();
      })
  );
});

// 拦截网络请求
self.addEventListener('fetch', (event) => {
  // 只处理同源请求
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // 对于 Supabase API 请求，使用网络优先策略
  if (event.request.url.includes('supabase.co')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // 如果网络失败，返回离线页面或错误信息
          return new Response(
            JSON.stringify({ error: 'Network unavailable' }),
            { 
              headers: { 'Content-Type': 'application/json' },
              status: 503
            }
          );
        })
    );
    return;
  }

  // 对于静态资源，使用缓存优先策略
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          console.log('Service Worker: Serving from cache', event.request.url);
          return cachedResponse;
        }

        // 如果缓存中没有，尝试从网络获取
        return fetch(event.request)
          .then((response) => {
            // 检查响应是否有效
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // 克隆响应，因为响应流只能使用一次
            const responseToCache = response.clone();

            // 将新资源添加到缓存
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // 网络失败时的回退策略
            if (event.request.destination === 'document') {
              return caches.match(`${BASE_PATH}/index.html`);
            }
            
            // 对于其他资源，返回离线提示
            return new Response('Offline', { 
              status: 503,
              statusText: 'Service Unavailable'
            });
          });
      })
  );
});

// 处理消息事件
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// 后台同步（如果支持）
if ('sync' in self.registration) {
  self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync') {
      console.log('Service Worker: Background sync triggered');
      // 这里可以添加后台同步逻辑
    }
  });
}

// 推送通知（如果需要）
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: `${BASE_PATH}/icons/icon-192x192.png`,
      badge: `${BASE_PATH}/icons/icon-72x72.png`,
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey
      },
      actions: [
        {
          action: 'explore',
          title: '查看',
          icon: `${BASE_PATH}/icons/icon-192x192.png`
        },
        {
          action: 'close',
          title: '关闭',
          icon: `${BASE_PATH}/icons/icon-192x192.png`
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// 通知点击事件
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow(`${BASE_PATH}/`)
    );
  }
});

console.log('Service Worker: Script loaded');
