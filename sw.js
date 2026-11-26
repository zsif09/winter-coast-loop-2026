const V='loop-v16', CORE=['./'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET'||new URL(r.url).origin!==location.origin) return;
  const isImg=/\/img\/.+\.webp$/.test(r.url);
  if(isImg){ // images never change under the same name: cache first
    e.respondWith(caches.match(r).then(h=>h||fetch(r).then(n=>{const c=n.clone(); caches.open(V).then(x=>x.put(r,c)); return n;})));
  } else { // page: newest copy first, saved copy only when offline
    e.respondWith(fetch(r).then(n=>{const c=n.clone(); caches.open(V).then(x=>x.put(r,c)); return n;}).catch(()=>caches.match(r)));
  }
});
