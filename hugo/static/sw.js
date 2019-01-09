importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.1/workbox-sw.js');

if (workbox) {
  workbox.setConfig({ debug: false });
  workbox.core.setLogLevel(workbox.core.LOG_LEVELS.warn);

  workbox.routing.setDefaultHandler(workbox.strategies.networkFirst({
    cacheName: 'fallback',
  }));
  
  workbox.routing.registerRoute(
    new RegExp(/.*\.(?:js|css)/g),
    workbox.strategies.networkFirst()
  );

  workbox.routing.registerRoute(
      new RegExp(/.*\.(?:png|jpg|jpeg|svg|gif)/g),
      workbox.strategies.cacheFirst()
  );
} else {
  console.log(`No workbox on this browser 😬`);
}

