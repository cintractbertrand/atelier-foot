// Planificateur de saison : thèmes par période (partagés au club) + séances placées par date.
window.PERIODES=[];
const SA_MOIS=['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
const SA_CATS=['U7','U8','U9','U10','U11','U12','U13','U14','U15','U16','U17','U18','Seniors'];
// Grands thèmes de la saison (couleur fixe), d'après les phases du jeu et les progressions FFF.
const GRANDS=[['Conduite et dribbles','#d6f0d9'],['Conservation et passes','#dce8f8'],['Jeu sans ballon / démarquage','#e3dcf6'],['Duels 1 contre 1','#fde0c8'],['Sortie de balle','#c9e8f2'],['Transitions','#fbe9b0'],['Pressing et défense collective','#f6d6e0'],['Finition et jeu devant le but','#ffd0a8'],['Coups de pied arrêtés','#e0e0c8'],['Physique et appuis','#e6e6e6'],['Gardien','#d4e8d0'],['Jeu libre et matchs','#f0e0f6']];
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
 try{const r=await fetch(CLUB_URL+'/rest/v1/rpc/lire_periodes',{method:'POST',headers:clubH(),body:JSON.stringify({code})});
  if(!r.ok)throw new Error(r.status);PERIODES=(await r.json()).map(x=>({...x.data,id:x.id,auteur:x.auteur||''}));saisonAff(msg)}
 catch(e){saisonAff('Planning indisponible pour le moment (le script SQL « saison » est-il lancé ? connexion ?)')}}
const CW=46,LH=30;
const saD=s=>{const [y,m,d]=s.split('-');return new Date(+y,m-1,+d)};
const saLundi=d=>{const x=new Date(d);x.setDate(x.getDate()-((x.getDay()+6)%7));return x};
const saAdd=(d,n)=>{const x=new Date(d);x.setDate(x.getDate()+n);return x};
async function periodeSauver(id,o){const pid=id||('p'+Date.now().toString(36)+Math.random().toString(36).slice(2,5));
 if(clubOn()){const code=clubCode();if(!code)return false;let au=lsG('nomeduc');if(!au){au=(prompt('Ton nom, affiché sur le thème :')||'').trim().slice(0,40);lsS('nomeduc',au)}
  if(!await clubRpc('publier_periode',{code,pid,periode:o,auteur:au}))return false;lsS('codeclub',code)}
 else{const l=saisonPourStock().filter(x=>x.id!=pid);l.push({...o,id:pid});lsS('periodes',JSON.stringify(l))}return true}
function themesEnCours(){const e=document.getElementById('thencours');if(!e)return;const auj=saIso(new Date());
 const l=PERIODES.filter(p=>p.debut<=auj&&p.fin>=auj);
 e.innerHTML=l.length?'Thèmes en cours : '+l.map(p=>`<span style="background:${coulTheme(p.theme)};color:#1b3a73;border-radius:10px;padding:1px 9px;margin-right:4px;cursor:pointer" onclick="nsa.click()">${esc(p.theme)}${p.cat?' · '+esc(p.cat):''} <small>jusqu'au ${dateFr(p.fin).slice(0,5)}</small></span>`).join(''):'';}
function saisonAff(msg){themesEnCours();const L=document.getElementById('saisonc');if(!L)return;
 const an=SAISON_AN,cat=document.getElementById('scat').value;document.getElementById('san').textContent='Saison '+an+'-'+(an+1)+' (août → juin)';
 const d0=saLundi(new Date(an,7,1)),W=Math.floor((new Date(an+1,5,30)-d0)/6048e5)+1;
 const idx=s=>Math.floor((saD(s)-d0)/6048e5);
 const per=PERIODES.filter(p=>idx(p.fin)>=0&&idx(p.debut)<W&&(!cat||!p.cat||p.cat==cat)).sort((x,y)=>x.debut.localeCompare(y.debut));
 const lanes=[];per.forEach(p=>{p._a=Math.max(0,idx(p.debut));p._b=Math.min(W-1,idx(p.fin));let l=lanes.findIndex(e=>e<p._a);if(l<0){l=lanes.length;lanes.push(-1)}lanes[l]=p._b;p._l=l});
 const nl=lanes.length+1,H=nl*LH+6;
 const grid='repeating-linear-gradient(90deg,#d5deea 0 1px,transparent 1px '+CW+'px)';
 let mh='',wh='',sh='';
 for(let i=0;i<W;i++){const d=saAdd(d0,i*7);wh+=`<div style="position:absolute;left:${i*CW}px;width:${CW}px;text-align:center;font-size:11px;color:#777">${d.getDate()}/${d.getMonth()+1}</div>`;
  if(i==0||d.getMonth()!=saAdd(d0,(i-1)*7).getMonth()){const m=saAdd(d,6).getMonth();mh+=`<div style="position:absolute;left:${i*CW}px;font-weight:700;color:var(--o);padding-left:4px;border-left:2px solid var(--or)">${SA_MOIS[m]}</div>`}}
 const sea=(window.SEANCES||[]).filter(s=>s.date&&idx(s.date)>=0&&idx(s.date)<W);
 for(let i=0;i<W;i++){const d=saAdd(d0,i*7),ss=sea.filter(s=>idx(s.date)==i);
  sh+=`<div class="swk" style="position:absolute;left:${i*CW}px;width:${CW}px;top:0;bottom:0" onclick="saisonNouvelleSeance('${saIso(d)}')" title="Planifier une séance cette semaine">${ss.map(s=>`<div class="ssea" onclick="event.stopPropagation();ouvrirSeance('${esc(s.id)}',0)" title="${esc((s.nom||'Séance')+' · '+dateFr(s.date)+(s.auteur?' · '+s.auteur:''))}">${dateFr(s.date).slice(0,5)}</div>`).join('')}</div>`}
 const bars=per.map(p=>`<div class="pbar" data-id="${esc(p.id)}" style="left:${p._a*CW+1}px;width:${(p._b-p._a+1)*CW-2}px;top:${p._l*LH+3}px;background:${coulTheme(p.theme)}" title="${esc(p.theme+' · '+dateFr(p.debut)+' → '+dateFr(p.fin)+(p.cat?' · '+p.cat:'')+(p.note?' · '+p.note:''))}"><i class="gh gl"></i><span>${esc(p.theme)}${p.cat?' · '+esc(p.cat):''}</span><i class="gh gr"></i></div>`).join('');
 const W2=W*CW,mx=Math.max(0,...[...Array(W).keys()].map(i=>sea.filter(s=>idx(s.date)==i).length));
 L.innerHTML=(msg?`<p class="vide">${esc(msg)}</p>`:'')+`<p class="hint noprint">Tire sur une ligne vide pour créer un thème, tire un thème pour le déplacer, tire ses bords pour l'allonger. Clique dessus pour le modifier. Clique une semaine du bas pour planifier une séance.</p>
 <div id="sscr" style="overflow-x:auto;background:#fff;border-radius:8px;padding:6px 0"><div style="position:relative;width:${W2}px">
 <div style="position:relative;height:22px">${mh}</div><div style="position:relative;height:18px">${wh}</div>
 <div id="slanes" style="position:relative;height:${H}px;background:${grid}">${bars}<div id="sghost" class="pbar hide" style="background:#e8b92399;top:0"></div></div>
 <div style="position:relative;height:${Math.max(60,mx*22+10)}px;background:${grid};border-top:2px solid var(--or)">${sh}</div></div></div>`;
 saisonDrag(d0,W,per)}
function saisonDrag(d0,W,per){const lanes=document.getElementById('slanes'),g=document.getElementById('sghost');if(!lanes)return;
 const wk=e=>Math.max(0,Math.min(W-1,Math.floor((e.clientX-lanes.getBoundingClientRect().left)/CW)));
 const dIso=(i,fin)=>saIso(saAdd(d0,i*7+(fin?6:0)));
 let m=null;
 const pos=(a,b)=>{g.style.left=a*CW+1+'px';g.style.width=(b-a+1)*CW-2+'px'};
 lanes.onpointerdown=e=>{if(e.button)return;const bar=e.target.closest('.pbar:not(#sghost)');const i=wk(e);
  if(!bar){m={t:'new',a:i,b:i,mv:0};g.classList.remove('hide');g.style.top=Math.floor((e.clientY-lanes.getBoundingClientRect().top)/LH)*LH+3+'px';pos(i,i);lanes.setPointerCapture(e.pointerId);return}
  const p=per.find(x=>x.id==bar.dataset.id);if(!p)return;const t=e.target.classList.contains('gl')?'l':e.target.classList.contains('gr')?'r':'m';
  m={t,p,bar,i0:i,a:p._a,b:p._b,a0:p._a,b0:p._b,mv:0};lanes.setPointerCapture(e.pointerId);e.preventDefault()};
 lanes.onpointermove=e=>{if(!m)return;const i=wk(e);
  if(m.t=='new'){m.b=i;pos(Math.min(m.a,m.b),Math.max(m.a,m.b));m.mv=1;return}
  const dl=i-m.i0;if(dl)m.mv=1;let a=m.a0,b=m.b0;
  if(m.t=='m'){a=m.a0+dl;b=m.b0+dl;if(a<0){b-=a;a=0}if(b>W-1){a-=b-(W-1);b=W-1}}
  else if(m.t=='l')a=Math.min(m.b0,m.a0+dl);else b=Math.max(m.a0,m.b0+dl);
  m.a=a;m.b=b;m.bar.style.left=a*CW+1+'px';m.bar.style.width=(b-a+1)*CW-2+'px'};
 lanes.onpointerup=async e=>{if(!m)return;const q=m;m=null;g.classList.add('hide');
  if(q.t=='new'){const a=Math.min(q.a,q.b),b=Math.max(q.a,q.b);if(THEME_ACTIF){const c=document.getElementById('scat').value;if(await periodeSauver('',{theme:THEME_ACTIF,cat:c,debut:dIso(a),fin:dIso(b,1),note:''}))saisonCharger();else saisonAff();return}periodeEditer('',dIso(a),dIso(b,1));return}
  if(!q.mv){periodeEditer(q.p.id);return}
  const {_a,_b,_l,id,auteur,...o}=q.p;o.debut=dIso(q.a);o.fin=dIso(q.b,1);
  if(await periodeSauver(q.p.id,o))saisonCharger();else saisonAff()};
 lanes.onpointercancel=()=>{m=null;g.classList.add('hide');saisonAff()}}
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
 if(id)d.querySelector('#es').onclick=async()=>{if(!confirm('Retirer ce thème du planning ? Il est seulement masqué.'))return;
  if(clubOn()){const code=clubCode();if(!code)return;if(!await clubRpc('retirer_periode',{code,pid:id}))return}
  else{const l=saisonPourStock().filter(x=>x.id!=id);lsS('periodes',JSON.stringify(l))}
  d.close();saisonCharger()};
 d.querySelector('#eo').onclick=async()=>{const o={theme:d.querySelector('#et').value.trim().slice(0,60),cat:d.querySelector('#ec').value,debut:d.querySelector('#ed').value,fin:d.querySelector('#ef').value,note:d.querySelector('#en').value.trim().slice(0,200)};
  if(!o.theme){alert('Donne un thème.');return}if(!o.debut||!o.fin||o.fin<o.debut){alert('Vérifie les dates (la fin doit suivre le début).');return}
  if(!await periodeSauver(id,o))return;
  d.close();saisonCharger()};d.showModal()}
(function(){const sec=document.getElementById('saison');if(!sec)return;
 sec.innerHTML='<div class="filtres noprint"><button onclick="SAISON_AN--;saisonAff()">◀</button><b id="san" style="padding:7px"></b><button onclick="SAISON_AN++;saisonAff()">▶</button><select id="scat" onchange="saisonAff()"><option value="">Toutes catégories</option>'+SA_CATS.map(c=>'<option>'+c+'</option>').join('')+'</select><button class="add" onclick="periodeEditer(\'\')">+ Thème sur une période</button><button onclick="saisonCharger()">Actualiser</button><button onclick="window.print()">Imprimer</button></div><div id="spal" class="noprint"></div><div id="saisonc"></div>';
 const st=document.createElement('style');st.textContent='.pbar{position:absolute;height:26px;border-radius:6px;border:1px solid #0003;cursor:grab;display:flex;align-items:center;overflow:hidden;user-select:none;touch-action:none}.pbar span{flex:1;padding:0 8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:13px;font-weight:600;color:#1b3a73;pointer-events:none}.gh{width:9px;height:100%;cursor:ew-resize;background:#0002;flex:none}#slanes{touch-action:pan-y;cursor:crosshair}.swk{border-radius:4px;cursor:pointer}.swk:hover{background:#e8b92333}.ssea{background:var(--o);color:#fff;border-radius:4px;font-size:11px;margin:2px;padding:2px 3px;text-align:center}';document.head.appendChild(st);
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
