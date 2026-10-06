const CACHE = 'molkky-score-v7';
const STATIC = ['./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install', event => { self.skipWaiting(); event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(STATIC))); });
self.addEventListener('activate', event => { event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())); });
self.addEventListener('message', event => { if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting(); });
self.addEventListener('fetch', event => {
  const req=event.request; if(req.method!=='GET') return;
  if(req.mode==='navigate'){
    event.respondWith(fetch(req,{cache:'no-store'}).then(res=>{const copy=res.clone();caches.open(CACHE).then(cache=>cache.put('./index.html',copy));return res;}).catch(async()=> (await caches.match('./index.html')) || (await caches.match('./')) || Response.error())); return;
  }
  const url=new URL(req.url);
  if(url.origin===self.location.origin){ event.respondWith(caches.match(req).then(cached=>cached||fetch(req).then(res=>{const copy=res.clone();caches.open(CACHE).then(cache=>cache.put(req,copy));return res;}))); }
});
