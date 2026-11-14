// Planificateur de saison : thèmes par période (partagés au club) + séances placées par date.
window.PERIODES=[];
const SA_MOIS=['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
const SA_CATS=['U7','U8','U9','U10','U11','U12','U13','U14','U15','U16','U17','U18','Seniors'];
// Grands thèmes de la saison (couleur fixe), d'après les phases du jeu et les progressions FFF.
const GRANDS=[['Conduite et dribbles','#d6f0d9','conduite|dribble'],['Conservation et passes','#dce8f8','conservation|possession|passe'],['Jeu sans ballon / démarquage','#e3dcf6','démarquage|appel|sans ballon|placement'],['Duels 1 contre 1','#fde0c8','1 contre 1|1c1|duel'],['Sortie de balle','#c9e8f2','sortie de balle|relance'],['Transitions','#fbe9b0','transition|contre-pressing|repli'],['Pressing et défense collective','#f6d6e0','pressing|défense|défendre'],['Finition et jeu devant le but','#ffd0a8','finition|tir|frappe'],['Coups de pied arrêtés','#e0e0c8','coup franc|corner|coup de pied arrêté|touche'],['Physique et appuis','#e6e6e6','physique|appuis|vitesse|coordination'],['Gardien','#d4e8d0','gardien'],['Jeu libre et matchs','#f0e0f6','match|jeu réduit|opposition']];
// Sous-thèmes proposés dans « Faire une séance » (mots-clés cherchés dans la fiche, l'un ou l'autre).
const SUBS={'Conduite et dribbles':[['Slalom','slalom|zigzag'],['Changements de direction','direction|feinte'],['Dribble','dribble'],['Tête haute','tête haute|lever la tête']],
'Conservation et passes':[['Rondos','rondo|taureau'],['Jeu à thème','thème|joker'],['Supériorité numérique','supériorité|3 contre 1|4 contre 2|5 contre 2'],['Possession par zones','zone|possession']],
'Jeu sans ballon / démarquage':[['Appels de balle','appel'],['Démarquage','démarquage'],['Se placer','placement|se placer'],['Triangles','triangle']],
'Duels 1 contre 1':[['Défendre','défen'],['Attaquer','dribble|attaqu'],['Avec buts','but'],['Appuis','appuis']],
'Sortie de balle':[['Relance du gardien','gardien'],['Défenseurs','défenseur'],['Construire derrière','relance|2-1-2'],['Passes longues','longue']],
'Transitions':[['Contre-pressing','contre-pressing'],['Récupération → attaque','récupération|contre-attaque'],['Perte → repli','repli|perte'],['Jeu à 4 buts','transition']],
'Pressing et défense collective':[['Pressing','pressing'],['Bloc / collectif','bloc|collectif'],['Infériorité','infériorité'],['Fermer l\'axe','axe']],
'Finition et jeu devant le but':[['Frappes','frappe|tir'],['1 contre 1 devant le but','1 contre 1'],['Centres','centre'],['2 contre 1 / 3 contre 2','2 contre 1|3 contre 2']],
'Coups de pied arrêtés':[['Corners','corner'],['Coups francs','coup franc'],['Touches','touche'],['Penalty','penalty']],
'Physique et appuis':[['Appuis','appuis'],['Vitesse','vitesse'],['Coordination','coordination'],['Gainage / force','gainage|force']],
'Gardien':[['Prise de balle','prise de balle'],['Plongeon','plongeon'],['Jeu au pied','pied'],['Duel 1 contre 1','1 contre 1']],
'Jeu libre et matchs':[['Match à thème','thème'],['Jeu réduit','jeu réduit'],['Opposition','opposition'],['Match libre','match']]};
// Filtre la Base sur un thème de la saison (mots-clés du grand thème, ou le nom du thème tel quel).
function filtrerTheme(t,cat){const g=GRANDS.find(x=>x[0]==t),q=g?g[2]:t.toLowerCase();
 F={theme:'',cat:cat||'',duree:'',niveau:'',auteur:'',source:'',liste:'',joueurs:'',sans:[]};
 const qi=document.getElementById('q');if(qi)qi.value=q;majFiltres();base();show('b')}
const THEMES_SAISON=GRANDS.map(g=>g[0]);
let THEME_ACTIF='';
const SA_COUL=['#dce8f8','#fbe9b0','#d6f0d9','#f6d6e0','#e3dcf6','#fde0c8'];
const saIso=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const coulTheme=t=>{const g=GRANDS.find(x=>x[0]==t);if(g)return g[1];let h=0;for(const c of t||'')h=(h*31+c.charCodeAt(0))%SA_COUL.length;return SA_COUL[h]};
let SAISON_AN=(()=>{const n=new Date();return n.getMonth()>=6?n.getFullYear():n.getFullYear()-1})();
const saisonPourStock=()=>{try{return JSON.parse(lsG('periodes')||'[]')}catch(e){return[]}};
async function saisonCharger(msg){
 if(!clubOn()){PERIODES=saisonPourStock();saisonAff(msg);return}
 const code=lsG('codeclub');if(!code){saisonAff('Saisis d\'abord le code club (onglet Base).');return}
 const r=await clubLire('lire_periodes',code);
 if(r.refus){saisonAff('Code club incorrect.');return}
 if(r.err){saisonAff('Planning indisponible pour le moment (le script SQL « saison » est-il lancé ? connexion ?)');return}
 PERIODES=r.d.map(x=>({...x.data,id:x.id,auteur:nomAut(x.auteur)}));saisonAff(r.copie?'Hors connexion : planning gardé sur cet appareil'+copieTxt(r.copie).replace(' · hors connexion, copie',''):msg)}
const LH=30;
const saD=s=>{const [y,m,d]=s.split('-');return new Date(+y,m-1,+d)};
const saLundi=d=>{const x=new Date(d);x.setDate(x.getDate()-((x.getDay()+6)%7));return x};
const saAdd=(d,n)=>{const x=new Date(d);x.setDate(x.getDate()+n);return x};
async function periodeSauver(id,o){const pid=id||('p'+Date.now().toString(36)+Math.random().toString(36).slice(2,5));
 if(clubOn()){const code=clubCode();if(!code)return false;let au=nomAut(lsG('nomeduc'));if(!au){au=(prompt('Ton nom, affiché sur le thème :')||'').trim().slice(0,40);lsS('nomeduc',au)}
  if(!await clubRpc('publier_periode',{code,pid,periode:o,auteur:au}))return false;lsS('codeclub',code)}
 else{const l=saisonPourStock().filter(x=>x.id!=pid);l.push({...o,id:pid});lsS('periodes',JSON.stringify(l))}return true}
function themesEnCours(){const e=document.getElementById('thencours');if(!e)return;const auj=saIso(new Date());
 const l=PERIODES.filter(p=>p.debut<=auj&&p.fin>=auj);
 e.innerHTML=(window.prochHtml?prochHtml():'')+l.map(p=>`<button onclick="filtrerTheme('${esc(p.theme).replace(/'/g,'’')}','${p.cat||''}')" title="Voir les exercices de ce thème (en cours jusqu'au ${dateFr(p.fin)})">🎯 ${esc(p.theme)}${p.cat?' · '+esc(p.cat):''}</button>`).join('')}
let SEL_SEANCE='',SEL_PER='',SA_G=null;
function saisonSel(id){SEL_SEANCE=SEL_SEANCE==id?'':id;SEL_PER='';saisonAff()}
function perSel(id){SEL_PER=id;SEL_SEANCE='';saisonAff()}
async function periodeRetirer(id,sans){if(!sans&&!confirm('Retirer ce thème du planning ? Il est seulement masqué.'))return false;
 if(clubOn()){const code=clubCode();if(!code)return false;if(!await clubRpc('retirer_periode',{code,pid:id}))return false}
 else{const l=saisonPourStock().filter(x=>x.id!=id);lsS('periodes',JSON.stringify(l))}
 if(SEL_PER==id)SEL_PER='';saisonCharger();return true}
async function periodeDecaler(id,da,db){const p=PERIODES.find(x=>x.id==id);if(!p)return;const {_a,_b,_l,id:_i,auteur,...o}=p;
 const f=(s,n)=>saIso(saAdd(saD(s),n*7));o.debut=f(p.debut,da);o.fin=f(p.fin,db);if(o.fin<o.debut)return;
 if(await periodeSauver(id,o))saisonCharger();else saisonAff()}
async function saisonRetirerSeance(id){await retirerSeance(id);SEL_SEANCE='';saisonAff()}
document.addEventListener('keydown',e=>{const sec=document.getElementById('saison');if(!(SEL_SEANCE||SEL_PER)||!sec||sec.classList.contains('hide'))return;
 if(/INPUT|TEXTAREA|SELECT/.test((e.target.tagName||'')))return;if(e.key=='Escape'){SEL_PER=SEL_SEANCE='';saisonAff();return}if(e.key=='Delete'||e.key=='Backspace'){e.preventDefault();if(SEL_SEANCE)saisonRetirerSeance(SEL_SEANCE);else periodeRetirer(SEL_PER)}}); // géométrie courante du calendrier
function saisonResume(){const e=document.getElementById('sares');if(!e)return;const cat=document.getElementById('scat').value,auj=saIso(new Date()),ok=p=>!cat||!p.cat||p.cat==cat;
 const b=p=>`<button style="background:${coulTheme(p.theme)}" onclick="filtrerTheme('${esc(p.theme).replace(/'/g,'’')}','${p.cat||''}')" title="Voir les exercices de ce thème"><b>${esc(p.theme)}</b>${p.cat?' · '+esc(p.cat):''}<br><small>du ${dateFr(p.debut).slice(0,5)} au ${dateFr(p.fin).slice(0,5)}${p.note?' · '+esc(p.note):''}</small></button>`;
 const en=PERIODES.filter(p=>ok(p)&&p.debut<=auj&&p.fin>=auj),av=PERIODES.filter(p=>ok(p)&&p.debut>auj).sort((x,y)=>x.debut.localeCompare(y.debut)).slice(0,3);
 e.innerHTML=(en.length?'<h4>🎯 En ce moment</h4>'+en.map(b).join(''):'')+(av.length?'<h4>Ensuite</h4>'+av.map(b).join(''):'')}
function saisonAff(msg){themesEnCours();saisonResume();const L=document.getElementById('saisonc');if(!L)return;
 const an=SAISON_AN,cat=document.getElementById('scat').value;document.getElementById('san').textContent='Saison '+an+'-'+(an+1)+' (août → juin)';
 const d0=saLundi(new Date(an,7,1)),W=Math.floor((new Date(an+1,5,30)-d0)/6048e5)+1;
 const idx=s=>Math.floor((saD(s)-d0)/6048e5);
 const wid=(L.clientWidth||1000)-4,nrows=wid<700?6:wid>=1500?3:4,RW=Math.ceil(W/nrows),CW=Math.max(24,Math.floor(wid/RW));
 const per=PERIODES.filter(p=>idx(p.fin)>=0&&idx(p.debut)<W&&(!cat||!p.cat||p.cat==cat)).sort((x,y)=>x.debut.localeCompare(y.debut));
 const lanes=[];per.forEach(p=>{p._a=Math.max(0,idx(p.debut));p._b=Math.min(W-1,idx(p.fin));let l=lanes.findIndex(e=>e<p._a);if(l<0){l=lanes.length;lanes.push(-1)}lanes[l]=p._b;p._l=l});
 const H=Math.max(lanes.length+1,2)*LH+6;
 const sea=(window.SEANCES||[]).filter(s=>s.date&&idx(s.date)>=0&&idx(s.date)<W);
 const grid='repeating-linear-gradient(90deg,#d5deea 0 1px,transparent 1px '+CW+'px)';
 SA_G={d0,W,RW,CW,H,nrows,per};
 let h='';
 for(let r=0;r<nrows;r++){const r0=r*RW,r1=Math.min(W-1,r0+RW-1);if(r0>=W)break;
  let mh='',wh='',sh='',mx=0;
  for(let i=r0;i<=r1;i++){const d=saAdd(d0,i*7),x=(i-r0)*CW;wh+=`<div style="position:absolute;left:${x}px;width:${CW}px;text-align:center;font-size:10px;color:#777">${d.getDate()}/${d.getMonth()+1}</div>`;
   if(i==r0||saAdd(d,6).getMonth()!=saAdd(d0,(i-1)*7+6).getMonth()){mh+=`<div style="position:absolute;left:${x}px;font-weight:700;font-size:13px;color:var(--o);padding-left:4px;border-left:2px solid var(--or)">${SA_MOIS[saAdd(d,6).getMonth()]}</div>`}
   const ss=sea.filter(s=>idx(s.date)==i);mx=Math.max(mx,ss.length);
   sh+=`<div class="swk" style="position:absolute;left:${x}px;width:${CW}px;top:0;bottom:0" onclick="saisonNouvelleSeance('${saIso(d)}')" title="Planifier une séance cette semaine">${ss.map(s=>`<div class="ssea${SEL_SEANCE==s.id?' sel':''}" onclick="event.stopPropagation();saisonSel('${esc(s.id)}')" ondblclick="ouvrirSeance('${esc(s.id)}',0)" title="${esc((s.nom||'Séance')+' · '+dateFr(s.date)+(s.auteur?' · '+s.auteur:''))}">${dateFr(s.date).slice(0,5)}</div>`).join('')}</div>`}
  h+=`<div class="srow" style="width:${(r1-r0+1)*CW}px"><div style="position:relative;height:20px">${mh}</div><div style="position:relative;height:16px">${wh}</div>
  <div class="slanes" data-r="${r}" style="position:relative;height:${H}px;background:${grid}"></div>
  <div style="position:relative;height:${Math.max(30,mx*20+8)}px;background:${grid};border-top:2px solid var(--or)">${sh}</div></div>`}
 L.innerHTML=(msg?`<p class="vide">${esc(msg)}</p>`:'')+`<p class="hint noprint">Tire sur une ligne vide pour créer un thème (ou choisis d'abord un grand thème), tire un thème pour le déplacer, tire ses bords pour l'allonger. Clique un thème pour le sélectionner et agir dessus (modifier, décaler, retirer avec Suppr) ; double-clic pour le modifier. Clique une semaine du bas pour planifier une séance ; clique une séance pour la sélectionner (Suppr pour la retirer, double-clic pour l'ouvrir).</p>${(()=>{const x=(window.SEANCES||[]).find(q=>q.id==SEL_SEANCE);return x?`<div class="tot noprint" style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">Séance sélectionnée : <b>${esc(x.nom||'Séance')}</b> <small>${dateFr(x.date)}${x.auteur?' · '+esc(x.auteur):''}</small> <button class="add" onclick="ouvrirSeance('${esc(x.id)}',0)">Ouvrir</button><button class="del" onclick="saisonRetirerSeance('${esc(x.id)}')">Retirer (Suppr)</button></div>`:''})()}${(()=>{const p=PERIODES.find(q=>q.id==SEL_PER);if(!p)return'';const b=(t,f,c)=>`<button${c?` class="${c}"`:''} onclick="${f}">${t}</button>`,i=`'${esc(p.id)}'`;return `<div class="tot noprint" style="display:flex;gap:6px;align-items:center;flex-wrap:wrap"><span style="width:14px;height:14px;border-radius:3px;background:${coulTheme(p.theme)}"></span><b>${esc(p.theme)}</b> <small>${p.cat?esc(p.cat)+' · ':''}${dateFr(p.debut)} → ${dateFr(p.fin)}${p.note?' · '+esc(p.note):''}</small> ${b('✎ Modifier',`periodeEditer(${i})`,'add')}${b('◀ Semaine avant',`periodeDecaler(${i},-1,-1)`)}${b('Semaine après ▶',`periodeDecaler(${i},1,1)`)}${b('＋ 1 semaine',`periodeDecaler(${i},0,1)`)}${b('－ 1 semaine',`periodeDecaler(${i},0,-1)`)}${b('🔍 Voir les exercices',`filtrerTheme('${esc(p.theme).replace(/'/g,'’')}','${p.cat||''}')`)}${b('Retirer (Suppr)',`periodeRetirer(${i})`,'del')}${b('✕',"SEL_PER='';saisonAff()")}</div>`})()}<div id="scal" style="background:#fff;border-radius:8px;padding:6px 2px">${h}</div>`;
 per.forEach(p=>saSegs(p.id,p._a,p._b,p._l,p));
 saisonDrag()}
// Dessine (ou redessine) les morceaux d'un thème sur chaque ligne du calendrier.
function saSegs(id,a,b,lane,p){const G=SA_G;document.querySelectorAll('.pbar[data-id="'+id+'"]').forEach(e=>e.remove());
 const col=p.theme?coulTheme(p.theme):'#e8b92399';
 document.querySelectorAll('.slanes').forEach(el=>{const r=+el.dataset.r,r0=r*G.RW,r1=Math.min(G.W-1,r0+G.RW-1);if(b<r0||a>r1)return;
  const s=Math.max(a,r0),e=Math.min(b,r1),d=document.createElement('div');d.className='pbar'+(SEL_PER==id?' sel':'');d.dataset.id=id;
  d.style.cssText=`left:${(s-r0)*G.CW+1}px;width:${(e-s+1)*G.CW-2}px;top:${lane*LH+3}px;background:${col}`;
  d.title=p.theme?p.theme+' · '+dateFr(p.debut)+' → '+dateFr(p.fin)+(p.cat?' · '+p.cat:'')+(p.note?' · '+p.note:''):'';
  d.innerHTML=(s==a?'<i class="gh gl"></i><i class="ged" title="Modifier">✎</i>':'')+'<span>'+esc(p.theme||'')+(p.cat?' · '+esc(p.cat):'')+'</span>'+(e==b?'<i class="gh gr"></i>':'');
  el.appendChild(d)})}
function saisonDrag(){const cal=document.getElementById('scal');if(!cal)return;const G=SA_G,per=G.per;
 const rows=()=>[...cal.querySelectorAll('.slanes')];
 const pt=e=>{const rs=rows();let r=0;rs.forEach((el,i)=>{if(e.clientY>=el.getBoundingClientRect().top-30)r=i});const bb=rs[r].getBoundingClientRect(),r0=r*G.RW,r1=Math.min(G.W-1,r0+G.RW-1);
  return {i:Math.max(r0,Math.min(r1,r0+Math.floor((e.clientX-bb.left)/G.CW))),lane:Math.max(0,Math.min(Math.floor((e.clientY-bb.top)/LH),Math.floor(G.H/LH)-1))}};
 const dIso=(i,fin)=>saIso(saAdd(G.d0,i*7+(fin?6:0)));
 let m=null;
 cal.onpointerdown=e=>{if(e.button||!e.target.closest('.slanes'))return;const bar=e.target.closest('.pbar'),q=pt(e);
  if(!bar){m={t:'new',a:q.i,b:q.i,lane:q.lane,mv:0};saSegs('__g',q.i,q.i,q.lane,{});cal.setPointerCapture(e.pointerId);return}
  const p=per.find(x=>x.id==bar.dataset.id);if(!p)return;const t=e.target.classList.contains('gl')?'l':e.target.classList.contains('gr')?'r':'m';
  m={t,p,edit:e.target.classList.contains('ged'),i0:q.i,a:p._a,b:p._b,a0:p._a,b0:p._b,mv:0};cal.setPointerCapture(e.pointerId);e.preventDefault()};
 cal.onpointermove=e=>{if(!m)return;const q=pt(e);
  if(m.t=='new'){m.b=q.i;m.mv=1;saSegs('__g',Math.min(m.a,m.b),Math.max(m.a,m.b),m.lane,{});return}
  const dl=q.i-m.i0;if(dl)m.mv=1;let a=m.a0,b=m.b0;
  if(m.t=='m'){a=m.a0+dl;b=m.b0+dl;if(a<0){b-=a;a=0}if(b>G.W-1){a-=b-(G.W-1);b=G.W-1}}
  else if(m.t=='l')a=Math.min(m.b0,m.a0+dl);else b=Math.max(m.a0,m.b0+dl);
  m.a=a;m.b=b;saSegs(m.p.id,a,b,m.p._l,m.p)};
 cal.onpointerup=async e=>{if(!m)return;const q=m;m=null;document.querySelectorAll('.pbar[data-id="__g"]').forEach(x=>x.remove());
  if(q.t=='new'){const a=Math.min(q.a,q.b),b=Math.max(q.a,q.b);if(THEME_ACTIF){const c=document.getElementById('scat').value;if(await periodeSauver('',{theme:THEME_ACTIF,cat:c,debut:dIso(a),fin:dIso(b,1),note:''}))saisonCharger();else saisonAff();return}periodeEditer('',dIso(a),dIso(b,1));return}
  if(!q.mv){if(q.edit)periodeEditer(q.p.id);else if(SEL_PER!=q.p.id)perSel(q.p.id);return}
  const {_a,_b,_l,id,auteur,...o}=q.p;o.debut=dIso(q.a);o.fin=dIso(q.b,1);
  if(await periodeSauver(q.p.id,o))saisonCharger();else saisonAff()};
 cal.ondblclick=e=>{const bar=e.target.closest('.pbar');if(bar&&bar.dataset.id!='__g')periodeEditer(bar.dataset.id)};
 cal.onpointercancel=()=>{m=null;saisonAff()}}
window.addEventListener('resize',()=>{const s=document.getElementById('saison');if(s&&!s.classList.contains('hide'))saisonAff()});
function saisonNouvelleSeance(mois){let d=document.getElementById('pld');if(d)d.remove();d=document.createElement('dialog');d.id='pld';d.style.cssText='max-width:420px;width:92vw;padding:16px';
 const auj=saIso(new Date()),def=auj.startsWith(mois)?auj:mois+'-01';
 d.innerHTML='<h3 style="margin:0 0 8px">Planifier une séance</h3><label>Date<br><input type="date" id="pd" value="'+def+'" style="width:100%"></label><br><br><label>Nom (catégorie, thème…)<br><input id="pn" placeholder="Ex. U11 – sortie de balle" style="width:100%"></label><div style="margin-top:12px;text-align:right"><button id="px">Annuler</button> <button class="add" id="po">Composer la séance</button></div>';
 document.body.appendChild(d);d.querySelector('#px').onclick=()=>d.close();
 d.querySelector('#po').onclick=()=>{const dt=d.querySelector('#pd').value;if(!dt){alert('Choisis une date.');return}
  S=[];nom.value=d.querySelector('#pn').value.trim();dat.value=dt;lsS('nomseance',nom.value);lsS('dateseance',dt);lsS('seanceid','');TERRAIN=false;TM={};save();d.close();show('s')};d.showModal()}
function periodeEditer(id,debut,fin){const p=PERIODES.find(x=>x.id==id)||{theme:'',cat:'',debut:debut||SAISON_AN+'-09-01',fin:fin||debut||SAISON_AN+'-10-15',note:''};
 let d=document.getElementById('ped');if(d)d.remove();d=document.createElement('dialog');d.id='ped';d.style.cssText='max-width:440px;width:92vw;padding:16px';
 d.innerHTML='<h3 style="margin:0 0 8px">'+(id?'Modifier le thème':'Thème de période')+'</h3><label>Thème<br><input id="et" list="etl" value="'+esc(p.theme)+'" style="width:100%"></label><datalist id="etl">'+THEMES_SAISON.map(t=>'<option>'+t+'</option>').join('')+'</datalist><br><br><label>Catégorie<br><select id="ec" style="width:100%"><option value="">Toutes</option>'+SA_CATS.map(c=>'<option'+(c==p.cat?' selected':'')+'>'+c+'</option>').join('')+'</select></label><br><br><div style="display:flex;gap:8px"><label>Du<br><input type="date" id="ed" value="'+p.debut+'"></label><label>Au<br><input type="date" id="ef" value="'+p.fin+'"></label></div><br><label>Note (objectif, accent à mettre…)<br><input id="en" value="'+esc(p.note||'')+'" style="width:100%"></label><div style="margin-top:12px;text-align:right">'+(id?'<button id="es" class="del">Retirer</button> ':'')+'<button id="ex">Annuler</button> <button class="add" id="eo">Enregistrer</button></div>';
 document.body.appendChild(d);d.querySelector('#ex').onclick=()=>d.close();
 if(id)d.querySelector('#es').onclick=async()=>{if(await periodeRetirer(id))d.close()};
 d.querySelector('#eo').onclick=async()=>{const o={theme:d.querySelector('#et').value.trim().slice(0,60),cat:d.querySelector('#ec').value,debut:d.querySelector('#ed').value,fin:d.querySelector('#ef').value,note:d.querySelector('#en').value.trim().slice(0,200)};
  if(!o.theme){alert('Donne un thème.');return}if(!o.debut||!o.fin||o.fin<o.debut){alert('Vérifie les dates (la fin doit suivre le début).');return}
  if(!await periodeSauver(id,o))return;
  d.close();saisonCharger()};d.showModal()}
(function(){const sec=document.getElementById('saison');if(!sec)return;
 sec.innerHTML='<div class="filtres noprint"><button onclick="SAISON_AN--;saisonAff()">◀</button><b id="san" style="padding:7px"></b><button onclick="SAISON_AN++;saisonAff()">▶</button><select id="scat" onchange="saisonAff()"><option value="">Toutes catégories</option>'+SA_CATS.map(c=>'<option>'+c+'</option>').join('')+'</select><button class="add" onclick="periodeEditer(\'\')">+ Thème sur une période</button><button onclick="saisonCharger()">Actualiser</button><button onclick="window.print()">Imprimer</button><button id="saed" onclick="this.textContent=document.getElementById(\'saison\').classList.toggle(\'ed\')?\'✕ Fermer les outils\':\'✏️ Modifier le planning\'">✏️ Modifier le planning</button></div><div id="sares" class="noprint"></div><div id="spal" class="noprint"></div><div id="saisonc"></div>';
 const st=document.createElement('style');st.textContent='.pbar{position:absolute;height:26px;border-radius:6px;border:1px solid #0003;cursor:grab;display:flex;align-items:center;overflow:hidden;user-select:none;touch-action:none}.pbar span{flex:1;padding:0 6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:12px;font-weight:600;color:#1b3a73;pointer-events:none}.ged{padding:0 4px;font-style:normal;cursor:pointer;font-size:12px}.gh{width:8px;height:100%;cursor:ew-resize;background:#0002;flex:none}.slanes{touch-action:pan-y;cursor:crosshair}.srow{margin:0 0 12px}.swk{border-radius:4px;cursor:pointer}.swk:hover{background:#e8b92333}.pbar.sel{outline:3px solid var(--or);outline-offset:1px;z-index:2}.ssea.sel{outline:3px solid var(--or);background:#c0392b}.ssea{background:var(--o);color:#fff;border-radius:4px;font-size:11px;margin:2px;padding:2px 3px;text-align:center}';document.head.appendChild(st);
 saisonPalette();document.getElementById('nsa').onclick=async()=>{show('a');saisonCharger();if(clubOn()&&lsG('codeclub')){await seancesCharger();saisonAff()}};
 if(clubOn()&&lsG('codeclub'))saisonCharger();})();

function saisonPalette(){const e=document.getElementById('spal');if(!e)return;
 e.innerHTML='<p class="hint">Grands thèmes : clique-en un puis tire sur le calendrier pour le placer (clique-le encore pour revenir à la saisie libre).</p><div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px">'+GRANDS.map(([t,c],i)=>'<button data-i="'+i+'" style="background:'+c+';border:2px solid '+(THEME_ACTIF==t?'var(--o)':'transparent')+';font-weight:'+(THEME_ACTIF==t?700:400)+'">'+esc(t)+'</button>').join('')+'<button class="add" onclick="saisonType()">✨ Proposer une saison type</button></div>';
 e.querySelectorAll('button[data-i]').forEach(b=>b.onclick=()=>{const t=GRANDS[+b.dataset.i][0];THEME_ACTIF=THEME_ACTIF==t?'':t;saisonPalette()})}
async function saisonType(){const an=SAISON_AN,cat=document.getElementById('scat').value;
 if(!confirm('Ajouter une progression type (12 blocs de septembre à juin'+(cat?' pour les '+cat:'')+') ? Tu pourras tout déplacer ou retirer ensuite.'))return;
 const L=saLundi(new Date(an,8,1)),S=[['Conduite et dribbles',4],['Conservation et passes',4],['Jeu sans ballon / démarquage',5],['Duels 1 contre 1',3],['Sortie de balle',4],['Transitions',4],['Pressing et défense collective',4],['Finition et jeu devant le but',5],['Coups de pied arrêtés',2],['Jeu libre et matchs',4]];
 let w=0;for(const [t,n] of S){if(t=='Sortie de balle')w+=2;const o={theme:t,cat,debut:saIso(saAdd(L,w*7)),fin:saIso(saAdd(L,(w+n)*7-1)),note:''};w+=n;
  if(o.fin>an+1+'-06-30')break;if(!await periodeSauver('',o))break;await new Promise(r=>setTimeout(r,5))}
 saisonCharger()}
