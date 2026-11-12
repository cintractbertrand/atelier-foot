// Site utilisable hors connexion : on garde en mémoire les fichiers du site (réseau d'abord, copie en secours).
const C='atelier-foot-v1';
self.addEventListener('install',e=>{self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request,u=new URL(r.url);
 if(r.method!='GET'||u.origin!=location.origin)return;
 e.respondWith(fetch(r).then(res=>{if(res.ok){const c=res.clone();caches.open(C).then(k=>k.put(r,c))}return res})
  .catch(async()=>(await caches.match(r))||(await caches.match(r,{ignoreSearch:true}))||(await caches.match('./'))||Response.error()))});
