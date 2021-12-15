const CACHE ='cache-1';
const CACHE_DINAMICO ='dinamico-1';

self.addEventListener('install', evento=>{

    const promesa =caches.open(CACHE)
        .then(cache=>{
            return cache.addAll([
                '/',
                '/index.html',
                '/offline.html',
                'css/estilos.css',
                'css/fontello.css',
                'img/cars1.jpg',
                'img/cars2.jpg',
                'img/cars3.jpg',
                'img/cars4.jpg',
                'img/cars5.jpg',
                'img/cars6.jpg',
                'img/cars7.jpg',
                'img/cars8.jpg',
                'js/app.js'
            ]);
        });

    evento.waitUntil(Promise.all([promesa]));
});

self.addEventListener('fetch', evento =>{

    const respuesta=caches.match(evento.request)
        .then(res=>{
            if (res) return res;
            console.log('No existe', evento.request.url);
            return fetch(evento.request)
                .then(resWeb=>{
                    caches.open(CACHE_DINAMICO)
                        .then(cache=>{
                            cache.put(evento.request,resWeb);
                            limpiarCache(CACHE_DINAMICO,50);
                        })
                    return resWeb.clone();
                });
        })
        .catch(err => {
            if(evento.request.headers.get('accept').includes('text/html')){
                return caches.match('/offline.html');
            }
        });
     evento.respondWith(respuesta);
});

function limpiarCache(nombreCache, numeroItems){
    caches.open(nombreCache)
       .then(cache=>{
            return cache.keys()
                .then(keys=>{
                    if (keys.length>numeroItems){
                        cache.delete(keys[0])
                            .then(limpiarCache(nombreCache, numeroItems));
                        }
                    });
        });
}   