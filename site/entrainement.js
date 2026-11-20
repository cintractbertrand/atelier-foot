// Rattacher la séance préparée à un entraînement du club (console ESGA, dépôt veille-esga-).
// Le coach choisit l'entraînement : le prochain est proposé, mais n'importe lequel des semaines à venir convient.
// Les deux sites sont sur la même origine (github.io) : ils partagent le stockage du navigateur.
(function(){
const P=new URLSearchParams(location.search),POUR=P.get('pour')||'',EQ=P.get('equipe')||'';
const clubSrc=new URL('/veille-esga-/commun/club.js',location.origin).href;
let charge=null;
function club(){if(window.CLUB)return CLUB.pret;if(charge)return charge;
 charge=new Promise((ok,ko)=>{const s=document.createElement('script');s.src=clubSrc+'?v=2026-11-20h';s.onload=()=>window.CLUB?CLUB.pret.then(ok):ko();s.onerror=ko;document.head.appendChild(s)});return charge}
const fmt=d=>new Date(d+'T12:00').toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'});
const hh=h=>(h||'').replace(':','h');
function mesEquipes(C){const p=C.profil();if(p&&p.role=='coach'){const s=C.staff().find(x=>x.id==p.staff);if(s&&s.equipes.length)return s.equipes}return C.equipes().map(e=>e.id)}
function resume(){const mat={};const ex=S.map(s=>{const e=E.find(x=>x.id==s.id);if(e&&typeof matListe=='function')matListe(e).forEach(m=>{const k=m.cle||m.nom;mat[k]=Math.max(mat[k]||0,m.quantite)});
  return{titre:e?e.titre:'Exercice',theme:e?e.theme:'',duree:+s.duree||0,variante:s.variante||'',note:s.note||''}});
 const p=window.CLUB&&CLUB.profil(),st=p&&p.role=='coach'&&CLUB.staff().find(x=>x.id==p.staff);
 return{nom:nom.value.trim()||'Séance',duree:ex.reduce((a,x)=>a+x.duree,0),exercices:ex,materiel:Object.entries(mat).map(([k,v])=>v+' '+(typeof nomMat=='function'?nomMat(k,v):k)).join(', '),lien:lienSeance(),auteur:st?st.prenom+' '+st.nom:(localStorage.getItem('nomeduc')||'')}}
async function prevoir(){if(!S.length){alert('La séance est vide : ajoute d\'abord des exercices.');return}
 try{await club()}catch(e){alert('Calendrier du club indisponible pour le moment (connexion ?).');return}
 const C=window.CLUB,eqs=mesEquipes(C);let eq=(POUR&&(C.evenement(POUR)||{}).equipe)||EQ||localStorage.getItem('esga_equipe_seance')||eqs[0];if(!eqs.includes(eq))eq=eqs[0];
 let d=document.getElementById('pvd');if(d)d.remove();d=document.createElement('dialog');d.id='pvd';d.style.cssText='max-width:460px;width:92vw;border:0;border-radius:10px;padding:16px';
 document.body.appendChild(d);
 const rendre=()=>{const L=C.evenements({equipe:eq,du:C.outils.auj(),au:C.outils.ajout(C.outils.auj(),42),types:['entrainement']}).filter(e=>e.statut!='annule');
  const choix=L.some(e=>e.id==POUR)?POUR:(L[0]||{}).id;
  d.innerHTML='<h3 style="margin:0 0 4px">📅 Pour quel entraînement ?</h3><p style="margin:0 0 10px;color:#555;font-size:14px">La séance « '+esc(nom.value.trim()||'Séance')+' » apparaîtra dans la console du club, sur l\'entraînement choisi et pendant l\'appel.</p>'
   +(eqs.length>1?'<label style="display:block;margin-bottom:8px">Équipe <select id="pveq" style="padding:6px">'+eqs.map(x=>'<option value="'+esc(x)+'"'+(x==eq?' selected':'')+'>'+esc(C.nomEquipe(x))+'</option>').join('')+'</select></label>':'<p style="margin:0 0 8px"><b>'+esc(C.nomEquipe(eq))+'</b></p>')
   +(L.length?'<div style="max-height:46vh;overflow:auto;display:flex;flex-direction:column;gap:4px">'+L.map((e,i)=>{const s=C.seance(e.id);return'<label style="display:flex;gap:8px;align-items:center;padding:8px;border:1px solid #ccd;border-radius:8px;cursor:pointer"><input type="radio" name="pve" value="'+esc(e.id)+'"'+(e.id==choix?' checked':'')+'><span><b>'+fmt(e.date)+'</b> · '+hh(e.heure)+(i==0?' <small style="color:#2e8b57">(le prochain)</small>':'')+'<br><small>'+esc(e.lieu||'')+(s?' · <span style="color:#b88a00">déjà prévue : '+esc(s.nom)+' (sera remplacée)</span>':'')+'</small></span></label>'}).join('')+'</div>':'<p class="vide">Aucun entraînement dans les 6 semaines (vacances ?).</p>')
   +'<div style="margin-top:12px;text-align:right"><button id="pvx">Annuler</button> '+(L.length?'<button class="add" id="pvo">Prévoir la séance</button>':'')+'</div>';
  d.querySelector('#pvx').onclick=()=>d.close();const q=d.querySelector('#pveq');if(q)q.onchange=()=>{eq=q.value;rendre()};
  const o=d.querySelector('#pvo');if(o)o.onclick=()=>{const r=d.querySelector('input[name=pve]:checked');if(!r)return;const e=L.find(x=>x.id==r.value);
   C.setSeance(e.id,resume());localStorage.setItem('esga_equipe_seance',eq);if(!dat.value){dat.value=e.date;try{localStorage.setItem('dateseance',e.date)}catch(x){}}
   d.close();alert('Séance prévue pour l\'entraînement du '+fmt(e.date)+' ('+C.nomEquipe(eq)+').\nTu la retrouves dans la console du club : accueil, calendrier et appel.')}};
 rendre();d.showModal()}
const b=document.createElement('button');b.id='pvb';b.className='add';b.textContent=POUR?'📅 Prévoir pour cet entraînement':'📅 Prévoir pour un entraînement';b.title='Rattacher cette séance à un entraînement de ton équipe (console du club)';b.onclick=prevoir;
const sv=document.getElementById('sv');if(sv)sv.after(b);
// Arrivée depuis la console (« Préparer la séance ») : on ouvre la séance en préparation et on le rappelle
if(POUR)club().then(C=>{const e=C.evenement(POUR);if(!e)return;const n=document.createElement('p');n.className='noprint';n.style.cssText='margin:0 0 8px;padding:8px 10px;background:#fff7d6;border-left:4px solid #e8b923;border-radius:6px';
 n.innerHTML='📅 Séance pour <b>'+esc(C.nomEquipe(e.equipe))+'</b>, entraînement du <b>'+fmt(e.date)+'</b> à '+hh(e.heure)+'. Compose-la, puis touche « Prévoir pour cet entraînement ».';const a=document.querySelector('#seance .actions');if(a)a.before(n)}).catch(()=>{});
window.prevoirEntrainement=prevoir;
})();
