// Base partagée des fiches du club (Supabase).
// CLUB_URL et CLUB_CLE viennent de Supabase > Project Settings > API (clé « publishable » ou « anon » : publique par conception).
// Laisser vide pour désactiver : le site marche alors comme avant, fiches gardées dans le navigateur.
const CLUB_URL='https://bkebcwjkorqdpckcqtwq.supabase.co',CLUB_CLE='sb_publishable_x_SzQDiP3WP28PGi8Y1OPw_-eKd9HQq';
window.CLUBF=[];
const clubOn=()=>!!(CLUB_URL&&CLUB_CLE);
function clubH(){const h={apikey:CLUB_CLE,'Content-Type':'application/json'};if(!CLUB_CLE.startsWith('sb_'))h.Authorization='Bearer '+CLUB_CLE;return h}
const clubEtat=(t,btn)=>{const s=document.getElementById('clubetat');if(!s)return;s.textContent=t+' ';boutonEnvoi();if(btn){const b=document.createElement('button');b.textContent='Saisir le code club';b.onclick=()=>{const c=(prompt('Code club :')||'').trim();if(c){lsS('codeclub',c);clubCharger()}};s.appendChild(b)}};
const lsG=k=>{try{return localStorage.getItem(k)||''}catch(e){return''}},lsS=(k,v)=>{try{v?localStorage.setItem(k,v):localStorage.removeItem(k)}catch(e){}};
async function clubCharger(){if(!clubOn())return;
 const code=lsG('codeclub')||(window.EXERCICES.length?'':clubCode());if(!code){clubEtat('Fiches du club verrouillées.',1);boutonEnvoi();return}
 window.clubOk=false;const maj=d=>{CLUBF=d.map(x=>({...x.data,club:true,auteur:nomAut(x.auteur),maj:x.maj}));majE()};
 // Démarrage immédiat avec la copie gardée sur l'appareil, puis mise à jour par le réseau.
 let vu='';if(!CLUBF.length&&lsG('codeclub')==code){const c=await idbGet('copie_lire_fiches');if(c&&c.d){vu=JSON.stringify(c.d);maj(c.d);clubEtat(CLUBF.length+' fiches du club · mise à jour…')}}
 if(!vu)clubEtat('Chargement des fiches du club…');
 const r=await clubLire('lire_fiches',code);
 if(r.refus){lsS('codeclub','');if(vu){CLUBF=[];majE()}clubEtat('Code club incorrect.',1);return}
 if(r.err){clubEtat('Fiches du club indisponibles pour le moment (connexion ?)');return}
 if(!r.copie){lsS('codeclub',code);window.clubOk=true}
 if(JSON.stringify(r.d)!=vu)maj(r.d);
 clubEtat(CLUBF.length+' fiche'+(CLUBF.length>1?'s':'')+' du club'+(r.copie?copieTxt(r.copie):''));boutonEnvoi()}
// Lecture avec copie de secours sur l'appareil : au stade sans réseau, on retrouve les dernières données reçues.
// La copie n'est rendue que si le code club a déjà été validé sur cet appareil.
async function clubLire(fn,code){let r=null;try{r=await fetch(CLUB_URL+'/rest/v1/rpc/'+fn,{method:'POST',headers:clubH(),body:JSON.stringify({code}),...(window.AbortSignal&&AbortSignal.timeout?{signal:AbortSignal.timeout(12000)}:{})})}catch(e){}
 if(r&&r.ok){const d=await r.json();idbSet('copie_'+fn,{t:Date.now(),d});return{d}}
 if(r){let t='';try{t=await r.text()}catch(e){}if(t.includes('code club')){idbSet('copie_'+fn,null);return{refus:true}}}
 const c=lsG('codeclub')==code?await idbGet('copie_'+fn):null;return c&&c.d?{d:c.d,copie:c.t}:{err:true}}
const copieTxt=t=>{const d=new Date(t);return' · hors connexion, copie du '+d.toLocaleDateString('fr-FR',{day:'numeric',month:'numeric'})+' à '+d.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})};
async function clubRpc(fn,body){const r=await fetch(CLUB_URL+'/rest/v1/rpc/'+fn,{method:'POST',headers:clubH(),body:JSON.stringify(body)});
 if(r.ok)return true;const t=await r.text();if(t.includes('code club')){lsS('codeclub','');alert('Code club incorrect.')}else alert('Envoi impossible ('+r.status+'). Réessaie plus tard ou exporte la fiche.');return false}
const clubCode=()=>(lsG('codeclub')||prompt('Code club :')||'').trim();
// Par défaut, toute fiche enregistrée est aussitôt ajoutée au club (si le code club est déjà mémorisé sur cet appareil).
const clubAuto=()=>clubOn()&&!!lsG('codeclub');
async function partager(id,auto){const f=E.find(x=>x.id==id);if(!f)return;const code=auto?lsG('codeclub'):clubCode();if(!code)return;
 let nom=nomAut(lsG('nomeduc'));if(!nom&&auto)nom='Commun';if(!nom){nom=(prompt('Ton nom, affiché sur la fiche :')||'').trim().slice(0,40);lsS('nomeduc',nom)}
 const o=propre(f);
 if(!await clubRpc('publier_fiche',{code,fiche:o,auteur:f.auteur||nom}))return;
 savePerso(chargePerso().filter(x=>x.id!=id));await clubCharger();if(!auto)alert('Fiche partagée : tous les éducateurs la voient maintenant.')}
async function retirer(id){if(!confirm('Retirer cette fiche du club ? Elle est seulement masquée et reste récupérable.'))return;const code=clubCode();if(!code)return;
 if(!await clubRpc('retirer_fiche',{code,fid:id}))return;lsS('codeclub',code);await clubCharger()}
const THEMES=['échauffement','physique','technique','tactique','jeu réduit','tir','gardien','retour au calme'];
function deplacer(id){const f=E.find(x=>x.id==id);if(!f)return;let d=document.getElementById('dpd');if(d)d.remove();d=document.createElement('dialog');d.id='dpd';d.style.cssText='max-width:420px;width:92vw;border:0;border-radius:10px;padding:16px';
 const th=[...new Set(THEMES.concat(E.map(e=>e.theme)))];
 d.innerHTML='<h3 style="margin:0 0 8px">Déplacer la fiche</h3><p style="margin:0 0 8px"><b>'+esc(f.titre)+'</b><br><small>Thème actuel : '+esc(f.theme)+'</small></p><select id="dps" style="width:100%;padding:8px">'+th.map(t=>'<option'+(t==f.theme?' selected':'')+'>'+esc(t)+'</option>').join('')+'</select><div style="margin-top:12px;text-align:right"><button id="dpx">Annuler</button> <button class="add" id="dpo">Déplacer</button></div>';
 document.body.appendChild(d);d.querySelector('#dpx').onclick=()=>d.close();
 d.querySelector('#dpo').onclick=async()=>{const t=d.querySelector('#dps').value;if(t==f.theme){d.close();return}
  if(f.perso){savePerso(chargePerso().map(x=>x.id==id?{...x,theme:t}:x));d.close();majE();return}
  const code=clubCode();if(!code)return;const o=propre(f);o.theme=t;
  if(!await clubRpc('publier_fiche',{code,fiche:o,auteur:f.auteur||'Commun'}))return;lsS('codeclub',code);d.close();await clubCharger()};d.showModal()}
function boutonsClub(e){if(!clubOn())return'';const dep=`<button onclick="deplacer('${e.id}')">⇄ Déplacer</button>`;return e.perso?`<button class="add" onclick="partager('${e.id}')">Partager au club</button>`+dep:e.club?dep+`<button onclick="retirer('${e.id}')">Retirer du club</button>`:''}
function boutonEnvoi(){const s=document.getElementById('clubetat');if(!s||!clubOn()||document.getElementById('cenvoi'))return;
 const sy=document.createElement('button');sy.className='fo';sy.style.marginLeft='8px';sy.textContent='🔄 Synchroniser mon dossier';sy.onclick=()=>synchroDossier();s.appendChild(sy);const sc=document.createElement('button');sc.className='fo';sc.style.marginLeft='4px';sc.textContent='Changer de dossier';sc.onclick=()=>synchroDossier(true);s.appendChild(sc);
 const l=document.createElement('label');l.id='cenvoi';l.className='fo';l.style.cssText='display:inline-block;cursor:pointer;margin-left:8px';l.textContent='Importer des fiches (.json) ';
 const i=document.createElement('input');i.type='file';i.accept='.json';i.multiple=true;i.style.display='none';i.onchange=()=>importerFichiers(i.files);l.appendChild(i);s.appendChild(l);
 const l2=document.createElement('label');l2.className='fo';l2.style.cssText='display:inline-block;cursor:pointer;margin-left:8px';l2.textContent='Envoyer un dossier de fiches ';
 const i2=document.createElement('input');i2.type='file';i2.setAttribute('webkitdirectory','');i2.style.display='none';i2.onchange=()=>importerFichiers([...i2.files].filter(f=>/\.json$/i.test(f.name)));l2.appendChild(i2);s.appendChild(l2);
}
// ---- Synchronisation d'un dossier mémorisé (nouvelles fiches seulement) ----
const idbOpen=()=>new Promise((ok,ko)=>{const r=indexedDB.open('atelier',1);r.onupgradeneeded=()=>r.result.createObjectStore('kv');r.onsuccess=()=>ok(r.result);r.onerror=()=>ko(r.error)});
const idbGet=async k=>{try{const d=await idbOpen();return await new Promise(ok=>{const r=d.transaction('kv').objectStore('kv').get(k);r.onsuccess=()=>ok(r.result);r.onerror=()=>ok(null)})}catch(e){return null}};
const idbSet=async(k,v)=>{try{const d=await idbOpen();await new Promise(ok=>{const t=d.transaction('kv','readwrite');t.objectStore('kv').put(v,k);t.oncomplete=()=>ok();t.onerror=()=>ok()})}catch(e){}};
async function* jsonDuDossier(dir){for await(const [n,h] of dir.entries()){if(h.kind=='directory')yield* jsonDuDossier(h);else if(/\.json$/i.test(n))yield h}}
async function synchroDossier(changer){
 if(!window.showDirectoryPicker){alert('Ce navigateur ne peut pas retenir le dossier : utilise Chrome ou Edge, ou « Envoyer un dossier de fiches ».');return}
 let dir=changer?null:await idbGet('dossier');
 try{if(dir&&await dir.queryPermission({mode:'read'})!='granted'&&await dir.requestPermission({mode:'read'})!='granted')dir=null}catch(e){dir=null}
 if(!dir){try{dir=await showDirectoryPicker({id:'fichesclub',mode:'read'})}catch(e){return}await idbSet('dossier',dir)}
 const code=clubCode();if(!code)return;
 await clubCharger();if(!window.clubOk){alert('Fiches du club non chargées : rien envoyé, pour ne rien écraser. Réessaie dans un instant.');return}
 const stock=new Set(),vus=new Set();CLUBF.forEach(f=>vus.add(f.id));
 let n=0,ign=0,bad=0;
 for await(const h of jsonDuDossier(dir)){let d;try{d=JSON.parse(await(await h.getFile()).text())}catch(e){bad++;continue}
  for(const f of Array.isArray(d)?d:[d]){if(!f||!f.id||!f.titre)continue;
   if(vus.has(f.id)){ign++;continue}
   if(!await clubRpc('publier_fiche',{code,fiche:propre(f),auteur:f.auteur||'Commun'}))return;
   vus.add(f.id);stock.add(f.id);n++;clubEtat('Synchro… '+n+' nouvelle(s)')}}
 lsS('codeclub',code);await clubCharger();
 alert(n+' nouvelle(s) fiche(s) envoyée(s), '+ign+' déjà présente(s) ; le club en compte maintenant '+CLUBF.length+' (affichées)'+(bad?', '+bad+' fichier(s) illisible(s)':'')+'.')}
async function retirerAffichees(){const L=(window.AFF||[]).filter(e=>e.club);if(!L.length){alert('Aucune fiche du club affichée.');return}
 if(!confirm('Retirer '+L.length+' fiche(s) du club ? Elles sont seulement masquées et récupérables.'))return;const code=clubCode();if(!code)return;let n=0;
 for(const e of L){clubEtat('Retrait… '+n+'/'+L.length);if(!await clubRpc('retirer_fiche',{code,fid:e.id}))return;n++}
 lsS('codeclub',code);await clubCharger();alert(n+' fiche(s) retirée(s).')}
async function importerFichiers(fs){fs=[...fs];if(!fs.length)return;const code=clubCode();if(!code)return;let n=0;
 for(const fi of fs){let d;try{d=JSON.parse(await fi.text())}catch(e){alert('Fichier illisible : '+fi.name);return}
  for(const f of Array.isArray(d)?d:[d]){const o=propre(f);
   if(!o.id||!o.titre){alert('Fiche invalide dans '+fi.name);return}
   if(!await clubRpc('publier_fiche',{code,fiche:o,auteur:f.auteur||'Commun'}))return;n++;clubEtat('Import… '+n+' fiche(s)')}}
 lsS('codeclub',code);await clubCharger();alert(n+' fiche(s) importée(s) au club.')}
clubCharger();
// ---- Séances du club (liste, enregistrement, consultation sur téléphone) ----
window.SEANCES=[];
const dateFr=d=>d?d.split('-').reverse().join('/'):'';
async function seancesCharger(){if(!clubOn())return;const code=lsG('codeclub');if(!code){seancesAff('Saisis d\'abord le code club (onglet Base).');return}
 const maj=d=>{SEANCES=d.map(x=>({...x.data,id:x.id,auteur:nomAut(x.auteur),date:x.date_seance||'',maj:x.maj}))};
 if(!SEANCES.length){const c=await idbGet('copie_lire_seances');if(c&&c.d){maj(c.d);seancesAff()}else seancesAff('Chargement des séances…')}
 const r=await clubLire('lire_seances',code);
 if(r.refus){SEANCES=[];seancesAff('Code club incorrect.');return}
 if(r.err){seancesAff('Séances indisponibles pour le moment (le script SQL séances est-il lancé ? connexion ?)');return}
 maj(r.d);SE_COPIE=r.copie?'Hors connexion : séances gardées sur cet appareil'+copieTxt(r.copie).replace(' · hors connexion, copie',''):'';seancesAff();if(window.prochaineSeance)prochaineSeance()}
let SE_COPIE='';
function seancesAff(msg){const L=document.getElementById('sle');if(!L)return;msg=msg||SE_COPIE;
 const sa=document.getElementById('sa'),cur=sa.value,au=[...new Set(SEANCES.map(x=>x.auteur).filter(Boolean))].sort();
 sa.innerHTML='<option value="">Tous les entraîneurs</option>'+au.map(a=>`<option${a==cur?' selected':''}>${esc(a)}</option>`).join('');sa.onchange=()=>seancesAff();document.getElementById('sq').oninput=()=>seancesAff();
 const q=document.getElementById('sq').value.toLowerCase(),a=sa.value;
 const r=SEANCES.filter(x=>(!a||x.auteur==a)&&(!q||(x.nom||'').toLowerCase().includes(q))).sort((x,y)=>(y.date||'').localeCompare(x.date||''));
 L.innerHTML=(msg?`<p class="vide">${esc(msg)}</p>`:'')+(r.length?r.map(x=>{const n=(x.exercices||[]),d=n.reduce((t,e)=>t+ +e.duree,0);
  return `<div class="sitem"><h3>${esc(x.nom||'Séance')}</h3><small>${dateFr(x.date)}${x.auteur?' · '+esc(x.auteur):''} · ${n.length} exercice${n.length>1?'s':''} · ${d} min</small>
  <ol class="srec" style="margin:6px 0 4px;padding-left:20px;font-size:14px">${n.map(e=>{const f=(window.EXERCICES||[]).concat(window.CLUBF||[]).find(y=>y.id==e.id);return `<li>${esc(f?f.titre:e.id)} <small style="color:#888">${f?'('+esc(f.theme)+') · ':''}${e.duree} min${e.variante?' · '+esc(e.variante):''}</small></li>`}).join('')}</ol>
  <div class="actions"><button class="add" onclick="ouvrirSeance('${esc(x.id)}',1)">📱 Consulter</button><button onclick="ouvrirSeance('${esc(x.id)}',0)">Modifier</button><button onclick="cloner('${esc(x.id)}')">⧉ Cloner</button><button onclick="retirerSeance('${esc(x.id)}')">Retirer</button></div></div>`}).join(''):(msg?'':'<p class="vide">Aucune séance enregistrée.</p>'))}
function cloner(id){ouvrirSeance(id,0,1)}
function ouvrirSeance(id,terrain,clone){const x=SEANCES.find(s=>s.id==id);if(!x)return;
 S=(x.exercices||[]).map(e=>({...e}));nom.value=x.nom||'';dat.value=x.date||'';lsS('nomseance',nom.value);lsS('dateseance',dat.value);lsS('seanceid',clone?'':x.id);if(clone){nom.value='Copie de '+(x.nom||'séance').replace(/^Copie de /,'');dat.value='';lsS('nomseance',nom.value);lsS('dateseance','')}TERRAIN=!!terrain||(!clone&&matchMedia('(max-width:700px)').matches);TM={};save();show('s')}
async function enregistrerSeance(){if(!S.length){alert('La séance est vide.');return}if(!nom.value.trim()){alert('Donne un nom à la séance.');nom.focus();return}
 if(!dat.value){alert('Choisis la date de la séance.');dat.focus();return}
 const code=clubCode();if(!code)return;let au=nomAut(lsG('nomeduc'));if(!au){au=(prompt('Ton nom, affiché sur la séance :')||'').trim().slice(0,40);lsS('nomeduc',au)}
 const id=lsG('seanceid')||('s'+Date.now().toString(36));
 if(!await clubRpc('publier_seance',{code,sid:id,seance:{nom:nom.value.trim(),exercices:S},auteur:au,datej:dat.value}))return;
 lsS('codeclub',code);lsS('seanceid',id);await seancesCharger();alert('Séance enregistrée : visible par tous les éducateurs, sur téléphone.')}
async function retirerSeance(id){if(!confirm('Retirer cette séance du club ? Elle est seulement masquée.'))return;const code=clubCode();if(!code)return;
 if(!await clubRpc('retirer_seance',{code,sid:id}))return;if(lsG('seanceid')==id)lsS('seanceid','');await seancesCharger()}
document.getElementById('sv').onclick=enregistrerSeance;
if(clubOn())seancesCharger();else document.getElementById('sv').classList.add('hide');
async function importerSeances(fs){fs=[...fs];if(!fs.length)return;const code=clubCode();if(!code)return;let n=0;
 for(const fi of fs){let d;try{d=JSON.parse(await fi.text())}catch(e){alert('Fichier illisible : '+fi.name);return}
  const m=(d.nom||'').match(/(\d{2})\/(\d{2})\/(\d{4})/)||fi.name.match(/_(\d{2})(\d{2})(\d{4})\.json$/);
  const dt=m?m[3]+'-'+m[2]+'-'+m[1]:null,id='imp-'+fi.name.replace(/\.json$/i,'').toLowerCase().replace(/[^a-z0-9_-]/g,'');
  if(!await clubRpc('publier_seance',{code,sid:id,seance:{nom:d.nom||fi.name,exercices:d.exercices||[]},auteur:nomAut(d.auteur)||'Nicolas Rouseau',datej:dt}))return;n++}
 lsS('codeclub',code);await seancesCharger();alert(n+' séance(s) importée(s).')}
