var CACHE_VERSION = 1;
var CURRENT_CACHES = {
  'post-message': 'post-message-cache-v' + CACHE_VERSION
};

self.addEventListener('activate', function(event) {
  var expectedCacheNames = Object.keys(CURRENT_CACHES).map(function(key) {
    return CURRENT_CACHES[key];
  });

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (expectedCacheNames.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(function() {
      return clients.claim();
    }).then(function() {
      return self.clients.matchAll().then(function(clients) {
        return Promise.all(clients.map(function(client) {
          return client.postMessage('The service worker has activated and ' +
            'taken control.');
        }));
      });
    })
  );
});


self.addEventListener('message', function(event) {
  var p = caches.open(CURRENT_CACHES['post-message']).then(function(cache) {
    let [first_number, second_number, algorithm] = event.data
    let result = 0
    switch (algorithm) {
      case 'add':
        result = first_number + second_number
        break
      case 'subtract':
        result = first_number - second_number
        break
      case 'multiply':
        result = first_number * second_number
        break
      case 'divide':
        result = first_number / second_number
        break
    }
    event.ports[0].postMessage(result)
  })

  if ('waitUntil' in event) {
    event.waitUntil(p);
  }
});