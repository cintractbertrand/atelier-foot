// Site utilisable hors connexion : réseau d'abord (3 s maximum), puis copie en mémoire.
const C='atelier-foot-v2',DELAI=3000;
self.addEventListener('install',e=>{self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
const copie=async r=>(await caches.match(r))||(await caches.match(r,{ignoreSearch:true}))||(await caches.match('./'));
self.addEventListener('fetch',e=>{const r=e.request,u=new URL(r.url);
 if(r.method!='GET'||u.origin!=location.origin)return;
 e.respondWith((async()=>{
  const ct=new AbortController(),t=setTimeout(()=>ct.abort(),DELAI);
  try{const res=await fetch(r,{signal:ct.signal});clearTimeout(t);if(res.ok){const c=res.clone();e.waitUntil(caches.open(C).then(k=>k.put(r,c)))}return res}
  catch(x){clearTimeout(t);return (await copie(r))||fetch(r).catch(()=>Response.error())}
 })())});
