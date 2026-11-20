// Rattacher la séance préparée à un entraînement du club (console ESGA, dépôt veille-esga-).
// Le champ date de la séance ouvre un calendrier où les entraînements de l'équipe sont en couleur :
// toucher un jour d'entraînement y place la séance, qui apparaît alors dans la console (accueil, calendrier, appel).
// Le prochain entraînement est proposé, mais n'importe lequel convient. Les deux sites sont sur la même
// origine (github.io) : ils partagent le stockage du navigateur.
(function(){
const P=new URLSearchParams(location.search),POUR=P.get('pour')||'',EQ=P.get('equipe')||'';
const clubSrc=new URL('/veille-esga-/commun/club.js',location.origin).href;
const lg=k=>{try{return localStorage.getItem(k)||''}catch(e){return''}},ls=(k,v)=>{try{v?localStorage.setItem(k,v):localStorage.removeItem(k)}catch(e){}};
let charge=null;
function club(){if(window.CLUB)return CLUB.pret;if(charge)return charge;
 charge=new Promise((ok,ko)=>{const s=document.createElement('script');s.src=clubSrc+'?v=2026-11-20i';s.onload=()=>window.CLUB?CLUB.pret.then(ok):ko();s.onerror=ko;document.head.appendChild(s)});return charge}
const fmt=d=>new Date(d+'T12:00').toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'});
const hh=h=>(h||'').replace(':','h');
const iso=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
function mesEquipes(C){const p=C.profil();if(p&&p.role=='coach'){const s=C.staff().find(x=>x.id==p.staff);if(s&&s.equipes.length)return s.equipes}return C.equipes().map(e=>e.id)}
function resume(){const mat={};const ex=S.map(s=>{const e=E.find(x=>x.id==s.id);if(e&&typeof matListe=='function')matListe(e).forEach(m=>{const k=m.cle||m.nom;mat[k]=Math.max(mat[k]||0,m.quantite)});
  return{titre:e?e.titre:'Exercice',theme:e?e.theme:'',duree:+s.duree||0,variante:s.variante||'',note:s.note||''}});
 const p=window.CLUB&&CLUB.profil(),st=p&&p.role=='coach'&&CLUB.staff().find(x=>x.id==p.staff);
 return{nom:nom.value.trim()||'Séance',duree:ex.reduce((a,x)=>a+x.duree,0),exercices:ex,materiel:Object.entries(mat).map(([k,v])=>v+' '+(typeof nomMat=='function'?nomMat(k,v):k)).join(', '),lien:lienSeance(),auteur:st?st.prenom+' '+st.nom:lg('nomeduc')}}
// L'entraînement auquel la séance en préparation est reliée (gardé sur l'appareil)
const lie=()=>lg('seance_evt');
function relier(C,e){const avant=lie();if(avant&&avant!=e.id){const s=C.seance(avant);if(s&&s.nom==(nom.value.trim()||'Séance'))C.setSeance(avant,null)}
 C.setSeance(e.id,resume());ls('seance_evt',e.id);ls('esga_equipe_seance',e.equipe);dat.value=e.date;ls('dateseance',e.date);majBadge()}
function delier(C){const id=lie();if(id&&C.seance(id))C.setSeance(id,null);ls('seance_evt','');majBadge()}

let MOIS=null;
async function calendrier(){
 try{await club()}catch(e){alert('Calendrier du club indisponible pour le moment (connexion ?).');return}
 const C=window.CLUB,eqs=mesEquipes(C),A=C.outils.auj();
 const evL=lie()&&C.evenement(lie());
 let eq=(evL&&evL.equipe)||(POUR&&(C.evenement(POUR)||{}).equipe)||EQ||lg('esga_equipe_seance')||eqs[0];if(!eqs.includes(eq))eq=eqs[0];
 const base=dat.value||(evL&&evL.date)||(POUR&&(C.evenement(POUR)||{}).date)||A;MOIS=MOIS||base.slice(0,7);
 let d=document.getElementById('pvd');if(d)d.remove();d=document.createElement('dialog');d.id='pvd';d.style.cssText='max-width:480px;width:94vw;border:0;border-radius:12px;padding:14px';document.body.appendChild(d);
 const rendre=()=>{const [y,m]=MOIS.split('-').map(Number),d0=new Date(y,m-1,1),fin=new Date(y,m,0),deb=new Date(d0);deb.setDate(1-((d0.getDay()+6)%7));
  const evs=C.evenements({equipe:eq,du:iso(deb),au:iso(new Date(fin.getFullYear(),fin.getMonth(),fin.getDate()+6))}).filter(e=>e.statut!='annule'&&e.equipe==eq);
  const parJour={};evs.forEach(e=>(parJour[e.date]=parJour[e.date]||[]).push(e));
  const prochain=(C.prochainsEntrainements(eq,1)[0]||{}).id,cours=lie();
  let cases='';for(let k=0;k<42;k++){const x=new Date(deb);x.setDate(deb.getDate()+k);const j=iso(x),L=parJour[j]||[],ent=L.find(e=>e.type=='entrainement'),mat=L.find(e=>e.type=='match'||e.type=='amical');
   if(k>=35&&x.getMonth()!=m-1)break;
   const s=ent&&C.seance(ent.id),cls=['cj',x.getMonth()!=m-1?'hors':'',j==A?'auj':'',j<A?'passe':'',ent?(ent.id==cours?'lie':s?'pris':'ent'):'',mat?'mat':''].join(' ');
   cases+='<button type="button" class="'+cls+'" data-j="'+j+'"'+(ent?' data-e="'+esc(ent.id)+'"':'')+' title="'+esc(ent?'Entraînement '+hh(ent.heure)+(s?' · '+s.nom:''):mat?mat.titre:'')+'"><b>'+x.getDate()+'</b>'+(ent?'<small>'+(ent.id==cours?'✓ cette séance':s?'📋 '+esc(s.nom):ent.id==prochain?'le prochain':hh(ent.heure))+'</small>':mat?'<small>⚽ match</small>':'')+'</button>'}
  d.innerHTML='<style>#pvd .cal{display:grid;grid-template-columns:repeat(7,1fr);gap:3px}#pvd .cal>span{font-size:11px;text-align:center;color:#667;font-weight:700}#pvd .cj{min-height:52px;border:1px solid #dde2ec;border-radius:8px;background:#fff;padding:3px;display:flex;flex-direction:column;align-items:center;gap:1px;cursor:pointer;font:inherit;color:#121826}#pvd .cj small{font-size:9.5px;line-height:1.1;text-align:center;overflow:hidden;max-height:22px}#pvd .cj.hors{opacity:.35}#pvd .cj.passe{opacity:.55}#pvd .cj.auj{outline:2px solid #0b2a6f}#pvd .cj.ent{background:#d6f0d9;border-color:#16935f}#pvd .cj.pris{background:#fbe9b0;border-color:#b88a00}#pvd .cj.lie{background:#0b2a6f;color:#fff;border-color:#0b2a6f}#pvd .cj.mat:not(.ent):not(.pris):not(.lie){background:#e8eefc;border-color:#1d4ed8}#pvd .lg{display:flex;gap:10px;flex-wrap:wrap;font-size:12px;margin:8px 0 0;color:#445}#pvd .lg i{display:inline-block;width:12px;height:12px;border-radius:3px;vertical-align:-2px;margin-right:4px;border:1px solid #0002}</style>'
   +'<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px"><h3 style="margin:0;flex:1">📅 Jour de la séance</h3>'+(eqs.length>1?'<select id="pveq" style="padding:5px">'+eqs.map(x=>'<option value="'+esc(x)+'"'+(x==eq?' selected':'')+'>'+esc(C.nomEquipe(x))+'</option>').join('')+'</select>':'<b>'+esc(C.nomEquipe(eq))+'</b>')+'</div>'
   +'<p style="margin:0 0 8px;color:#555;font-size:13px">Touche un jour d\'entraînement <b style="color:#16935f">en vert</b> : la séance y est placée et apparaît dans la console du club (accueil, calendrier, appel).</p>'
   +'<div style="display:flex;align-items:center;gap:6px;margin-bottom:6px"><button type="button" id="pvp">◀</button><b style="flex:1;text-align:center;text-transform:capitalize">'+d0.toLocaleDateString('fr-FR',{month:'long',year:'numeric'})+'</b><button type="button" id="pvn">▶</button></div>'
   +'<div class="cal">'+['lun','mar','mer','jeu','ven','sam','dim'].map(x=>'<span>'+x+'</span>').join('')+cases+'</div>'
   +'<p class="lg"><span><i style="background:#d6f0d9"></i>Entraînement libre</span><span><i style="background:#fbe9b0"></i>Séance déjà prévue</span><span><i style="background:#0b2a6f"></i>Cette séance</span><span><i style="background:#e8eefc"></i>Match</span></p>'
   +'<div style="margin-top:10px;display:flex;gap:6px;justify-content:flex-end;flex-wrap:wrap">'+(cours?'<button type="button" id="pvd0">Détacher de l\'entraînement</button>':'')+'<button type="button" id="pvx">Fermer</button></div>';
  d.querySelector('#pvx').onclick=()=>d.close();const q=d.querySelector('#pveq');if(q)q.onchange=()=>{eq=q.value;rendre()};
  d.querySelector('#pvp').onclick=()=>{MOIS=iso(new Date(y,m-2,1)).slice(0,7);rendre()};d.querySelector('#pvn').onclick=()=>{MOIS=iso(new Date(y,m,1)).slice(0,7);rendre()};
  const z=d.querySelector('#pvd0');if(z)z.onclick=()=>{delier(C);rendre()};
  d.querySelectorAll('.cj').forEach(b=>b.onclick=()=>{const j=b.dataset.j,id=b.dataset.e;
   if(!id){if(!confirm('Pas d\'entraînement de '+C.nomEquipe(eq)+' ce jour-là. Mettre seulement la date ('+fmt(j)+') sans lien avec le club ?'))return;if(lie())delier(C);dat.value=j;ls('dateseance',j);d.close();return}
   const e=C.evenement(id);if(!S.length){dat.value=e.date;ls('dateseance',e.date);ls('seance_evt',e.id);ls('esga_equipe_seance',e.equipe);majBadge();d.close();alert('Date choisie : '+fmt(e.date)+'.\nAjoute des exercices : la séance sera placée sur cet entraînement dès qu\'elle aura du contenu.');return}
   const s=C.seance(id);if(s&&id!=lie()&&!confirm('Une séance est déjà prévue ce jour-là (« '+s.nom+' »). La remplacer ?'))return;
   relier(C,e);d.close();alert('Séance placée sur l\'entraînement du '+fmt(e.date)+' à '+hh(e.heure)+' ('+C.nomEquipe(eq)+').\nTu la retrouves dans la console du club : accueil, calendrier et appel.')})};
 rendre();d.showModal()}

// Le champ date ouvre le calendrier du club
dat.readOnly=true;dat.style.cursor='pointer';dat.title='Choisir le jour : les entraînements de ton équipe sont en couleur';
const ouvrir=e=>{e.preventDefault();calendrier()};dat.addEventListener('click',ouvrir);dat.addEventListener('keydown',e=>{if(e.key=='Enter'||e.key==' ')ouvrir(e)});
// Petit repère à côté de la date : à quel entraînement la séance est reliée
const badge=document.createElement('button');badge.id='pvb';badge.type='button';badge.onclick=calendrier;dat.after(badge);
function majBadge(){const id=lie();if(!id){badge.className='';badge.textContent='📅 Placer sur un entraînement';badge.title='Rattacher cette séance à un entraînement de ton équipe (console du club)';return}
 club().then(C=>{const e=C.evenement(id);badge.className='add';badge.textContent=e?'✓ Entraînement du '+new Date(e.date+'T12:00').toLocaleDateString('fr-FR',{weekday:'short',day:'numeric',month:'short'})+' · '+C.nomEquipe(e.equipe):'📅 Placer sur un entraînement'}).catch(()=>{})}
majBadge();
// Toute modification de la séance met à jour l'entraînement relié (exercices, durées, nom)
let attente=0;const seance0=window.seance;
if(typeof seance0=='function')window.seance=function(){const r=seance0.apply(this,arguments);clearTimeout(attente);attente=setTimeout(()=>{const id=lie();if(!id||!window.CLUB||!S.length)return;const e=CLUB.evenement(id);if(e)CLUB.setSeance(id,resume())},800);return r};
nom.addEventListener('change',()=>{if(lie()&&window.CLUB&&S.length)CLUB.setSeance(lie(),resume())});
// « Vider » et « Nouvelle séance » : la nouvelle séance n'est plus reliée
['raz','cln'].forEach(k=>{const b=document.getElementById(k);if(b)b.addEventListener('click',()=>setTimeout(()=>{if(!S.length||k=='cln'){ls('seance_evt','');majBadge()}},50))});
// Arrivée depuis la console (« Préparer la séance ») : la séance sera placée sur cet entraînement
if(POUR)club().then(C=>{const e=C.evenement(POUR);if(!e)return;if(lie()!=POUR){ls('seance_evt',POUR);ls('esga_equipe_seance',e.equipe);dat.value=e.date;ls("dateseance",e.date)}majBadge();MOIS=e.date.slice(0,7);
 const n=document.createElement('p');n.className='noprint';n.style.cssText='margin:0 0 8px;padding:8px 10px;background:#fff7d6;border-left:4px solid #e8b923;border-radius:6px';
 n.innerHTML='📅 Séance pour <b>'+esc(C.nomEquipe(e.equipe))+'</b>, entraînement du <b>'+fmt(e.date)+'</b> à '+hh(e.heure)+'. Compose-la : elle est mise à jour dans la console à chaque modification.';const a=document.querySelector('#seance .actions');if(a)a.before(n)}).catch(()=>{});
window.prevoirEntrainement=calendrier;
})();
