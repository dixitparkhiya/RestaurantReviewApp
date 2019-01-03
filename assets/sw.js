var urlTocache = [
    '/',
    'css/styles.css',
    'js/main.js',
    'js/idb.js',
    'js/idb_mws.js',
    'js/dbhelper.js',
    'js/restaurant_info.js',
    'data/restaurants.json',
    'restaurant.html',
    'img/1.jpg',
    'img/2.jpg',
    'img/3.jpg',
    'img/4.jpg',
    'img/5.jpg',
    'img/6.jpg',
    'img/7.jpg',
    'img/8.jpg',
    'img/9.jpg',
    'img/10.jpg',
];
var cacheRecent = 'mws-stage-cache-3';
var Imagecache = 'mws-stage-img-cache';
var allCache = [
    cacheRecent,Imagecache
];


self.addEventListener('install',function(event){
    event.waitUntil(
    caches.open(cacheRecent).then(function(cache){
        return cache.addAll(urlTocache);
    })
    );
});


self.addEventListener('activate',function(event){
    event.waitUntil(
    caches.keys().then(function(cacheName){
        return Promise.all(
        cacheName.filter(function(cacheName){
            return cacheName.startsWith('mws-stage-cache') && !allCache.includes(cacheName)
        }).map(function(cacheName){
            caches.delete(cacheName);
        })
        );
    })
    );
});


self.addEventListener('fetch',function(event){
    event.respondWith(
    caches.match(event.request,{ignoreSearch:'true'}).then(function(response){
        if(response) return response;
        return fetch(event.request);
    })
    );
})

self.addEventListener('sync',function(event){
    
})