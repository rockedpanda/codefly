const VERSION = "V1.0.1";
const CACHE_NAME = 'codeFly'+VERSION;

const CACHE_URLS = [ //缓存列表,列表中的文件不会更新,永远从缓存读取,直到本文件更新版本.
    './css/hightlignt.agate.css',
    './css/hightlignt.min.css',
    './js/hightlignt.min.js',
    './js/vue-router.js',
    './js/pizzip.min.js',
    './js/vue.min.js',
    'pwa.html'
];

// 准备缓存列表
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
          .then(cache => cache.addAll(CACHE_URLS))
  );
});

// 缓存更新
self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cache) {//得到cache的各个key
                    // 如果当前版本和缓存版本不一致
                    if (cache !== CACHE_NAME) { //清理掉不对应的(旧的)
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// 捕获请求并返回缓存数据
/*self.addEventListener('fetch', function (event) {
    event.respondWith(caches.match(event.request).then(function(){
        return caches.match(event.request);
    },function () {
        return fetch(event.request); //如果未命中,则直接进行请求.
    }).then(function (response) {
        caches.open(CACHE_NAME).then(function (cache) {
            cache.put(event.request, response);
        });
        return response.clone();//注意这里的clone,因为response准备发往缓存,所以给浏览器的响应需要clone出来
    }));
});*/

self.addEventListener('fetch', function (event) {
    console.log('Fetch event ' + CACHE_NAME + ' :', event.request.url);
    event.respondWith(
        caches.match(event.request).then(function(response){
            if(response != null){
                //找到缓存数据,直接返回前端
                console.log('Using cache for:', event.request.url);
                return response;
            }
            console.log('从服务器请求: Fallback to fetch:', event.request.url);
            return fetch(event.request);
        })
    );
    /*event.respondWith(caches.match(event.request).catch(function () {
        return fetch(event.request);
    }).then(function (response) {
        caches.open(CACHE_NAME).then(function (cache) {
            cache.put(event.request, response);
        });
        return response.clone();
    }).catch(function () {
        return caches.match('./index.html');
    }));*/
});