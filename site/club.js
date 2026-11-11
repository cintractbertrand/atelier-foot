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
 clubEtat('Chargement des fiches du club…');
 try{const r=await fetch(CLUB_URL+'/rest/v1/rpc/lire_fiches',{method:'POST',headers:clubH(),body:JSON.stringify({code})});
  if(!r.ok){const t=await r.text();if(t.includes('code club')){lsS('codeclub','');clubEtat('Code club incorrect.',1);return}throw new Error(r.status)}
  lsS('codeclub',code);CLUBF=(await r.json()).map(x=>({...x.data,club:true,auteur:x.auteur||'',maj:x.maj}));majE();clubEtat(CLUBF.length+' fiche'+(CLUBF.length>1?'s':'')+' du club');boutonEnvoi()}
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
function boutonEnvoi(){const s=document.getElementById('clubetat');if(!s||!clubOn()||document.getElementById('cenvoi'))return;
 const l=document.createElement('label');l.id='cenvoi';l.className='fo';l.style.cssText='display:inline-block;cursor:pointer;margin-left:8px';l.textContent='Importer des fiches (.json) ';
 const i=document.createElement('input');i.type='file';i.accept='.json';i.multiple=true;i.style.display='none';i.onchange=()=>importerFichiers(i.files);l.appendChild(i);s.appendChild(l);
 const l2=document.createElement('label');l2.className='fo';l2.style.cssText='display:inline-block;cursor:pointer;margin-left:8px';l2.textContent='Envoyer un dossier de fiches ';
 const i2=document.createElement('input');i2.type='file';i2.setAttribute('webkitdirectory','');i2.style.display='none';i2.onchange=()=>importerFichiers([...i2.files].filter(f=>/\.json$/i.test(f.name)));l2.appendChild(i2);s.appendChild(l2);
 const r=document.createElement('button');r.id='cretire';r.className='fo';r.style.marginLeft='8px';r.textContent='Retirer les fiches affichées';r.onclick=retirerAffichees;s.appendChild(r)}
async function retirerAffichees(){const L=(window.AFF||[]).filter(e=>e.club);if(!L.length){alert('Aucune fiche du club affichée.');return}
 if(!confirm('Retirer '+L.length+' fiche(s) du club ? Elles sont seulement masquées et récupérables.'))return;const code=clubCode();if(!code)return;let n=0;
 for(const e of L){clubEtat('Retrait… '+n+'/'+L.length);if(!await clubRpc('retirer_fiche',{code,fid:e.id}))return;n++}
 lsS('codeclub',code);await clubCharger();alert(n+' fiche(s) retirée(s).')}
async function importerFichiers(fs){fs=[...fs];if(!fs.length)return;const code=clubCode();if(!code)return;let n=0;
 for(const fi of fs){let d;try{d=JSON.parse(await fi.text())}catch(e){alert('Fichier illisible : '+fi.name);return}
  for(const f of Array.isArray(d)?d:[d]){const o={...f};['perso','club','auteur','maj','schema_svg'].forEach(k=>delete o[k]);
   if(!o.id||!o.titre){alert('Fiche invalide dans '+fi.name);return}
   if(!await clubRpc('publier_fiche',{code,fiche:o,auteur:f.auteur||lsG('nomeduc')||'ESGA'}))return;n++;clubEtat('Import… '+n+' fiche(s)')}}
 lsS('codeclub',code);await clubCharger();alert(n+' fiche(s) importée(s) au club.')}
clubCharger();
// ---- Séances du club (liste, enregistrement, consultation sur téléphone) ----
window.SEANCES=[];
const dateFr=d=>d?d.split('-').reverse().join('/'):'';
async function seancesCharger(){if(!clubOn())return;const code=lsG('codeclub');if(!code){seancesAff('Saisis d\'abord le code club (onglet Base).');return}
 seancesAff('Chargement des séances…');
 try{const r=await fetch(CLUB_URL+'/rest/v1/rpc/lire_seances',{method:'POST',headers:clubH(),body:JSON.stringify({code})});
  if(!r.ok)throw new Error(r.status);SEANCES=(await r.json()).map(x=>({...x.data,id:x.id,auteur:x.auteur||'',date:x.date_seance||'',maj:x.maj}));seancesAff()}
 catch(e){seancesAff('Séances indisponibles pour le moment (le script SQL séances est-il lancé ? connexion ?)')}}
function seancesAff(msg){const L=document.getElementById('sle');if(!L)return;
 const sa=document.getElementById('sa'),cur=sa.value,au=[...new Set(SEANCES.map(x=>x.auteur).filter(Boolean))].sort();
 sa.innerHTML='<option value="">Tous les entraîneurs</option>'+au.map(a=>`<option${a==cur?' selected':''}>${esc(a)}</option>`).join('');sa.onchange=()=>seancesAff();document.getElementById('sq').oninput=()=>seancesAff();
 const q=document.getElementById('sq').value.toLowerCase(),a=sa.value;
 const r=SEANCES.filter(x=>(!a||x.auteur==a)&&(!q||(x.nom||'').toLowerCase().includes(q))).sort((x,y)=>(y.date||'').localeCompare(x.date||''));
 L.innerHTML=(msg?`<p class="vide">${esc(msg)}</p>`:'')+(r.length?r.map(x=>{const n=(x.exercices||[]),d=n.reduce((t,e)=>t+ +e.duree,0);
  return `<div class="sitem"><h3>${esc(x.nom||'Séance')}</h3><small>${dateFr(x.date)}${x.auteur?' · '+esc(x.auteur):''} · ${n.length} exercice${n.length>1?'s':''} · ${d} min</small>
  <div class="actions"><button class="add" onclick="ouvrirSeance('${esc(x.id)}',1)">📱 Consulter</button><button onclick="ouvrirSeance('${esc(x.id)}',0)">Modifier</button><button onclick="retirerSeance('${esc(x.id)}')">Retirer</button></div></div>`}).join(''):(msg?'':'<p class="vide">Aucune séance enregistrée.</p>'))}
function ouvrirSeance(id,terrain){const x=SEANCES.find(s=>s.id==id);if(!x)return;
 S=(x.exercices||[]).map(e=>({...e}));nom.value=x.nom||'';dat.value=x.date||'';lsS('nomseance',nom.value);lsS('dateseance',dat.value);lsS('seanceid',x.id);TERRAIN=!!terrain;save();show('s')}
async function enregistrerSeance(){if(!S.length){alert('La séance est vide.');return}if(!nom.value.trim()){alert('Donne un nom à la séance.');nom.focus();return}
 if(!dat.value){alert('Choisis la date de la séance.');dat.focus();return}
 const code=clubCode();if(!code)return;let au=lsG('nomeduc');if(!au){au=(prompt('Ton nom, affiché sur la séance :')||'').trim().slice(0,40);lsS('nomeduc',au)}
 const id=lsG('seanceid')||('s'+Date.now().toString(36));
 if(!await clubRpc('publier_seance',{code,sid:id,seance:{nom:nom.value.trim(),exercices:S},auteur:au,datej:dat.value}))return;
 lsS('codeclub',code);lsS('seanceid',id);await seancesCharger();alert('Séance enregistrée : visible par tous les éducateurs, sur téléphone.')}
async function retirerSeance(id){if(!confirm('Retirer cette séance du club ? Elle est seulement masquée.'))return;const code=clubCode();if(!code)return;
 if(!await clubRpc('retirer_seance',{code,sid:id}))return;if(lsG('seanceid')==id)lsS('seanceid','');await seancesCharger()}
document.getElementById('sv').onclick=enregistrerSeance;
if(clubOn())seancesCharger();else document.getElementById('sv').classList.add('hide');
