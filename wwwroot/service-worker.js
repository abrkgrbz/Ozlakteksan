/**
 * Service Worker for Özlasteksan PWA
 * Handles offline functionality, caching, and background sync
 */

const CACHE_NAME = 'ozlasteksan-v1.0.0';
const RUNTIME_CACHE = 'ozlasteksan-runtime';

// Files to cache during install
const STATIC_CACHE_URLS = [
    '/',
    '/Home/About',
    '/Products',
    '/Home/Contact',
    '/Home/Quote',
    '/css/site.css',
    '/js/site.js',
    '/js/ui-enhancements.js',
    '/js/quick-view.js',
    '/js/favorites.js',
    '/js/product-comparison.js',
    '/js/gallery-lightbox.js',
    '/js/products.js',
    '/js/simple-toast.js',
    '/lib/bootstrap/dist/css/bootstrap.min.css',
    '/lib/bootstrap/dist/js/bootstrap.bundle.min.js',
    '/lib/jquery/dist/jquery.min.js',
    '/manifest.json',
    '/offline.html'
];

// Install event - cache static resources
self.addEventListener('install', event => {
    console.log('Service Worker: Installing...');

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: Caching static files');
                return cache.addAll(STATIC_CACHE_URLS);
            })
            .then(() => {
                console.log('Service Worker: Install complete');
                return self.skipWaiting();
            })
            .catch(err => {
                console.error('Service Worker: Install failed:', err);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('Service Worker: Activating...');

    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(cacheName => {
                        return cacheName.startsWith('ozlasteksan-') &&
                               cacheName !== CACHE_NAME &&
                               cacheName !== RUNTIME_CACHE;
                    })
                    .map(cacheName => {
                        console.log('Service Worker: Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    })
            );
        }).then(() => {
            console.log('Service Worker: Activate complete');
            return self.clients.claim();
        })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Skip chrome extension requests
    if (url.protocol === 'chrome-extension:') {
        return;
    }

    // For navigation requests, try network first (for fresh content)
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then(response => {
                    // Cache the new response
                    return caches.open(RUNTIME_CACHE).then(cache => {
                        cache.put(request, response.clone());
                        return response;
                    });
                })
                .catch(() => {
                    // If network fails, try cache
                    return caches.match(request)
                        .then(response => response || caches.match('/offline.html'));
                })
        );
        return;
    }

    // For static assets, use cache-first strategy
    if (isStaticAsset(url)) {
        event.respondWith(
            caches.match(request)
                .then(response => {
                    if (response) {
                        // Update cache in background
                        fetchAndUpdateCache(request);
                        return response;
                    }
                    return fetchAndUpdateCache(request);
                })
        );
        return;
    }

    // For API calls and dynamic content, use network-first strategy
    event.respondWith(
        fetch(request)
            .then(response => {
                // Don't cache non-successful responses
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }

                // Cache successful responses
                return caches.open(RUNTIME_CACHE).then(cache => {
                    cache.put(request, response.clone());
                    return response;
                });
            })
            .catch(() => {
                // Try to get from cache
                return caches.match(request);
            })
    );
});

// Helper function to check if URL is a static asset
function isStaticAsset(url) {
    const staticExtensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.woff', '.woff2', '.ttf', '.eot'];
    return staticExtensions.some(ext => url.pathname.endsWith(ext));
}

// Helper function to fetch and update cache
function fetchAndUpdateCache(request) {
    return fetch(request).then(response => {
        // Don't cache non-successful responses
        if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
        }

        return caches.open(RUNTIME_CACHE).then(cache => {
            cache.put(request, response.clone());
            return response;
        });
    });
}

// Background sync for form submissions
self.addEventListener('sync', event => {
    if (event.tag === 'sync-forms') {
        event.waitUntil(syncFormData());
    }
});

// Sync form data when connection is restored
async function syncFormData() {
    try {
        const cache = await caches.open('form-data');
        const requests = await cache.keys();

        const promises = requests.map(async request => {
            const response = await fetch(request.clone());
            if (response.ok) {
                await cache.delete(request);
            }
        });

        await Promise.all(promises);
    } catch (error) {
        console.error('Background sync failed:', error);
    }
}

// Push notifications
self.addEventListener('push', event => {
    const options = {
        body: event.data ? event.data.text() : 'Yeni bildirim',
        icon: '/images/icons/icon-192x192.png',
        badge: '/images/icons/icon-72x72.png',
        vibrate: [200, 100, 200],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Görüntüle',
                icon: '/images/icons/checkmark.png'
            },
            {
                action: 'close',
                title: 'Kapat',
                icon: '/images/icons/xmark.png'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('Özlasteksan', options)
    );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
    event.notification.close();

    if (event.action === 'explore') {
        // Open the app
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Message handler for skipWaiting
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});