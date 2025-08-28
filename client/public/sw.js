const CACHE_NAME = 'dictionary-app-v1';
const urlsToCache = [
  '/ME-Dictionary/',
  '/ME-Dictionary/manifest.json',
  '/ME-Dictionary/icon-192.png',
  '/ME-Dictionary/icon-512.png',
  // Add other static assets as needed
];

// Install event - cache essential resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Claim all clients immediately
  self.clients.claim();
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        
        // Clone the request for fetch
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then(response => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone the response for caching
          const responseToCache = response.clone();
          
          // Cache the new response
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        }).catch(() => {
          // Return offline page for navigation requests
          if (event.request.destination === 'document') {
            return caches.match('/ME-Dictionary/');
          }
        });
      })
  );
});

// Background sync for prayer notifications
self.addEventListener('sync', event => {
  if (event.tag === 'prayer-sync') {
    event.waitUntil(handlePrayerSync());
  }
});

// Handle prayer time synchronization
async function handlePrayerSync() {
  try {
    // Get prayer settings from IndexedDB or local storage
    const prayerSettings = await getPrayerSettings();
    
    if (prayerSettings && prayerSettings.enabled) {
      // Schedule next prayer notification
      await scheduleNextPrayer(prayerSettings);
    }
  } catch (error) {
    console.error('Prayer sync failed:', error);
  }
}

// Get prayer settings from storage
function getPrayerSettings() {
  return new Promise((resolve) => {
    // Try to get from client storage
    const settings = JSON.parse(localStorage.getItem('prayerSettings') || 'null');
    resolve(settings);
  });
}

// Schedule prayer notification
async function scheduleNextPrayer(settings) {
  const now = new Date();
  const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  
  // Find next prayer time
  let nextPrayer = null;
  let nextTime = null;
  
  for (const prayer of prayers) {
    const prayerTime = new Date(settings[prayer.toLowerCase()]);
    if (prayerTime > now) {
      nextPrayer = prayer;
      nextTime = prayerTime;
      break;
    }
  }
  
  // If no prayer today, schedule for tomorrow's Fajr
  if (!nextPrayer) {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    nextTime = new Date(settings.fajr);
    nextTime.setDate(tomorrow.getDate());
    nextPrayer = 'Fajr';
  }
  
  // Schedule notification
  if (nextTime && nextPrayer) {
    const delay = nextTime.getTime() - now.getTime();
    setTimeout(() => {
      showPrayerNotification(nextPrayer);
    }, delay);
  }
}

// Show prayer notification
function showPrayerNotification(prayerName) {
  const options = {
    body: `${prayerName} prayer time has begun. Device set to silent mode.`,
    icon: '/ME-Dictionary/icon-192.png',
    badge: '/ME-Dictionary/icon-192.png',
    tag: 'prayer-notification',
    silent: true,
    actions: [
      {
        action: 'acknowledge',
        title: 'Understood'
      }
    ],
    data: {
      prayer: prayerName,
      timestamp: Date.now()
    }
  };
  
  self.registration.showNotification(`${prayerName} Prayer Time`, options);
}

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'acknowledge') {
    // Handle acknowledge action
    console.log('Prayer notification acknowledged');
  }
  
  // Open or focus the app
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      for (let client of clientList) {
        if (client.url.includes('/ME-Dictionary/') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/ME-Dictionary/');
      }
    })
  );
});

// Handle messages from the main thread
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SILENT_MODE') {
    // Handle silent mode changes
    console.log('Silent mode changed:', event.data.enabled);
    
    // Store silent mode state
    self.silentMode = event.data.enabled;
    
    // Could integrate with device APIs here if available
  }
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Periodic background sync for prayer times
self.addEventListener('periodicsync', event => {
  if (event.tag === 'prayer-check') {
    event.waitUntil(handlePrayerSync());
  }
});

// Handle push notifications if needed
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    
    if (data.type === 'prayer') {
      showPrayerNotification(data.prayer);
    }
  }
});