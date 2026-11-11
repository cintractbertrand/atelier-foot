// Base partagée des fiches du club (Supabase).
// CLUB_URL et CLUB_CLE viennent de Supabase > Project Settings > API (clé « publishable » ou « anon » : publique par conception).
// Laisser vide pour désactiver : le site marche alors comme avant, fiches gardées dans le navigateur.
const CLUB_URL='https://bkebcwjkorqdpckcqtwq.supabase.co',CLUB_CLE='sb_publishable_x_SzQDiP3WP28PGi8Y1OPw_-eKd9HQq';
window.CLUBF=[];
const clubOn=()=>!!(CLUB_URL&&CLUB_CLE);
function clubH(){const h={apikey:CLUB_CLE,'Content-Type':'application/json'};if(!CLUB_CLE.startsWith('sb_'))h.Authorization='Bearer '+CLUB_CLE;return h}
const clubEtat=(t,btn)=>{const s=document.getElementById('clubetat');if(!s)return;s.textContent=t+' ';if(btn){const b=document.createElement('button');b.textContent='Saisir le code club';b.onclick=()=>{const c=(prompt('Code club :')||'').trim();if(c){lsS('codeclub',c);clubCharger()}};s.appendChild(b)}};
const lsG=k=>{try{return localStorage.getItem(k)||''}catch(e){return''}},lsS=(k,v)=>{try{v?localStorage.setItem(k,v):localStorage.removeItem(k)}catch(e){}};
async function clubCharger(){if(!clubOn())return;
 const code=lsG('codeclub')||(window.EXERCICES.length?'':clubCode());if(!code){clubEtat('Fiches du club verrouillées.',1);return}
 clubEtat('Chargement des fiches du club…');
 try{const r=await fetch(CLUB_URL+'/rest/v1/rpc/lire_fiches',{method:'POST',headers:clubH(),body:JSON.stringify({code})});
  if(!r.ok){const t=await r.text();if(t.includes('code club')){lsS('codeclub','');clubEtat('Code club incorrect.',1);return}throw new Error(r.status)}
  lsS('codeclub',code);CLUBF=(await r.json()).map(x=>({...x.data,club:true,auteur:x.auteur||'',maj:x.maj}));majE();clubEtat(CLUBF.length+' fiche'+(CLUBF.length>1?'s':'')+' du club')}
 catch(e){clubEtat('Fiches du club indisponibles pour le moment (connexion ?)')}}
async function clubRpc(fn,body){const r=await fetch(CLUB_URL+'/rest/v1/rpc/'+fn,{method:'POST',headers:clubH(),body:JSON.stringify(body)});
 if(r.ok)return true;const t=await r.text();if(t.includes('code club')){lsS('codeclub','');alert('Code club incorrect.')}else alert('Envoi impossible ('+r.status+'). Réessaie plus tard ou exporte la fiche.');return false}
const clubCode=()=>(lsG('codeclub')||prompt('Code club :')||'').trim();
async function partager(id){const f=E.find(x=>x.id==id);if(!f)return;const code=clubCode();if(!code)return;
 let nom=lsG('nomeduc');if(!nom){nom=(prompt('Ton nom, affiché sur la fiche :')||'').trim().slice(0,40);lsS('nomeduc',nom)}
 const o={...f};['perso','club','auteur','maj','schema_svg'].forEach(k=>delete o[k]);
 if(!await clubRpc('publier_fiche',{code,fiche:o,auteur:f.auteur||nom}))return;
 savePerso(chargePerso().filter(x=>x.id!=id));await clubCharger();alert('Fiche partagée : tous les éducateurs la voient maintenant.')}
async function retirer(id){if(!confirm('Retirer cette fiche du club ? Elle est seulement masquée et reste récupérable.'))return;const code=clubCode();if(!code)return;
 if(!await clubRpc('retirer_fiche',{code,fid:id}))return;lsS('codeclub',code);await clubCharger()}
function boutonsClub(e){if(!clubOn())return'';return e.perso?`<button class="add" onclick="partager('${e.id}')">Partager au club</button>`:e.club?`<button onclick="retirer('${e.id}')">Retirer du club</button>`:''}
clubCharger();
