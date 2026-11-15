/* Circuit d'ateliers (espace Physique) : une fiche « circuit » = 4 à 8 fiches existantes prises comme postes.
   Champ de la fiche : circuit:{postes:[id…], duree_s, recup_s, groupes, rotations}. Stockée comme toute autre fiche (club).
   Rotation : à la rotation r, le groupe g est au poste (g + r) modulo le nombre de postes.
   Affichage : plan vu de dessus, tableau des rotations, schémas des postes, minuteur qui enchaîne postes et récupérations. */
(function(){
const LET='ABCDEFGH',COL=['#1b3a73','#c0392b','#2e8b57','#8e44ad','#d9a406','#16a0a0','#e8731a','#555'];
const q=id=>E.find(x=>x.id==id);
const mn=s=>{const m=Math.floor(s/60),r=Math.round(s%60);return m?m+' min'+(r?' '+r+' s':''):r+' s'};
const clk=s=>Math.floor(s/60)+':'+String(Math.max(0,Math.ceil(s))%60).padStart(2,'0');
const cut=(t,n)=>t.length>n?t.slice(0,n-1)+'…':t;
const duree=c=>{const n=c.rotations;return n*c.duree_s+Math.max(0,n-1)*(c.recup_s||0)};
const poste=(c,g,r)=>(g+r)%c.postes.length;
// ---------- plan vu de dessus ----------
function circPlan(e){const c=e.circuit,n=c.postes.length,cx=150,cy=100,rx=98,ry=58;
 const P=i=>{const a=-Math.PI/2-Math.PI/n+2*Math.PI*i/n;return[cx+rx*Math.cos(a),cy+ry*Math.sin(a),a]};
 let s=`<svg viewBox="0 0 300 200" class="circplan" role="img" aria-label="Plan du circuit"><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="#9fb0cf" stroke-width="2" stroke-dasharray="5 4"/>`;
 for(let i=0;i<n;i++){const a=(P(i)[2]+P((i+1)%n)[2]+(i==n-1?2*Math.PI:0))/2,x=cx+rx*Math.cos(a),y=cy+ry*Math.sin(a),dx=-rx*Math.sin(a),dy=ry*Math.cos(a),ang=Math.atan2(dy,dx)*180/Math.PI;
  s+=`<path d="M-6 -5L5 0L-6 5z" transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${ang.toFixed(1)})" fill="#e8b923" stroke="#a8820c" stroke-width=".6"/>`}
 c.postes.forEach((id,i)=>{const [x,y]=P(i),f=q(id),t=f?f.titre:'?',haut=y<cy;
  s+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="14" fill="#1b3a73" stroke="#fff" stroke-width="2"/><text x="${x.toFixed(1)}" y="${(y+5).toFixed(1)}" font-size="14" font-weight="700" text-anchor="middle" fill="#fff" font-family="sans-serif">${i+1}</text>`+
  `<text x="${x.toFixed(1)}" y="${(haut?y-19:y+27).toFixed(1)}" font-size="8.5" text-anchor="middle" fill="#222" font-family="sans-serif">${esc(cut(t,20))}</text>`;
  if(i<c.groupes)s+=`<circle cx="${(x+15).toFixed(1)}" cy="${(y-12).toFixed(1)}" r="7" fill="${COL[i%8]}" stroke="#fff" stroke-width="1.2"/><text x="${(x+15).toFixed(1)}" y="${(y-9).toFixed(1)}" font-size="8.5" font-weight="700" text-anchor="middle" fill="#fff" font-family="sans-serif">${LET[i]}</text>`});
 return s+`<text x="${cx}" y="${cy-4}" font-size="10" text-anchor="middle" fill="#1b3a73" font-family="sans-serif" font-weight="700">Sens de rotation</text><text x="${cx}" y="${cy+10}" font-size="9" text-anchor="middle" fill="#555" font-family="sans-serif">départ : lettres de couleur</text></svg>`}
// ---------- tableau des rotations ----------
function circTable(c){const R=[...Array(c.rotations).keys()];
 return `<table class="circtab"><thead><tr><th></th>${R.map(r=>`<th>Rot. ${r+1}</th>`).join('')}</tr></thead><tbody>${[...Array(c.groupes).keys()].map(g=>`<tr><th style="color:${COL[g%8]}">Groupe ${LET[g]}</th>${R.map(r=>`<td>poste ${poste(c,g,r)+1}</td>`).join('')}</tr>`).join('')}</tbody></table>`}
// ---------- minuteur ----------
const CT={};let CTI=null,CTA=null;
const ctPh=c=>{const L=[];for(let r=0;r<c.rotations;r++){L.push({k:'w',r,s:c.duree_s});if(r<c.rotations-1&&c.recup_s)L.push({k:'r',r,s:c.recup_s})}return L};
const ctSt=id=>CT[id]||(CT[id]={i:0,run:false,end:0,left:null});
const ctLeft=(id,ph)=>{const t=ctSt(id);return t.run?Math.max(0,(t.end-Date.now())/1000):(t.left??ph.s)};
function ctBeep(long){try{navigator.vibrate&&navigator.vibrate(long?[400,150,400,150,400]:[300,120,300])}catch(e){}
 try{CTA=CTA||new(window.AudioContext||window.webkitAudioContext)();if(CTA.state=='suspended')CTA.resume();const t0=CTA.currentTime,n=long?6:3;
  for(let k=0;k<n;k++){const t=t0+k*.3,o=CTA.createOscillator(),g=CTA.createGain();o.type='square';o.frequency.value=k==n-1?1175:880;g.gain.setValueAtTime(.35,t);g.gain.exponentialRampToValueAtTime(.001,t+.22);o.connect(g);g.connect(CTA.destination);o.start(t);o.stop(t+.25)}}catch(e){}}
function ctHtml(e){const c=e.circuit,id=e.id,L=ctPh(c),t=ctSt(id),fin=t.i>=L.length,ph=L[Math.min(t.i,L.length-1)],sec=fin?0:ctLeft(id,ph);
 // Pendant une récupération, on annonce déjà les places de la rotation suivante.
 const r=fin?c.rotations-1:ph.k=='r'?ph.r+1:ph.r;
 const place=[...Array(c.groupes).keys()].map(g=>{const p=poste(c,g,r),f=q(c.postes[p]);return`<li style="border-color:${COL[g%8]}"><b style="color:${COL[g%8]}">${LET[g]}</b> → poste ${p+1} <small>${esc(f?cut(f.titre,26):'?')}</small></li>`}).join('');
 const titre=fin?'Circuit terminé !':ph.k=='w'?`Rotation ${ph.r+1}/${c.rotations} · atelier`:`Changement de poste → rotation ${ph.r+2}/${c.rotations}`;
 return `<div class="circtm${fin?' fin':ph.k=='r'?' rec':''}" data-ct="${esc(id)}"><div class="ct1">${esc(titre)}</div><div class="ct2">${fin?'✓':clk(sec)}</div><ul class="ct3">${place}</ul>
 <div class="actions noprint"><button class="add" onclick="ctGo('${esc(id)}')">${t.run?'⏸ Pause':fin?'↻ Recommencer':t.i||t.left!=null?'▶ Reprendre':'▶ Lancer le circuit'}</button><button onclick="ctSkip('${esc(id)}')" title="Passer à l'étape suivante">⏭</button><button onclick="ctRaz('${esc(id)}')" title="Remettre à zéro">↺</button></div></div>`}
function ctRender(id){const e=q(id);if(!e)return;document.querySelectorAll('.circtm[data-ct="'+id.replace(/"/g,'')+'"]').forEach(d=>{d.outerHTML=ctHtml(e)})}
function ctStart(id,i){const e=q(id),L=ctPh(e.circuit),t=ctSt(id);t.i=i;if(i>=L.length){t.run=false;t.left=null;return}t.left=null;t.run=true;t.end=Date.now()+L[i].s*1000}
window.ctGo=id=>{const e=q(id);if(!e)return;const L=ctPh(e.circuit),t=ctSt(id);ctBeep(false);
 if(t.i>=L.length){t.i=0;t.left=null;t.run=false}
 if(t.run){t.left=ctLeft(id,L[t.i]);t.run=false}else{const s=t.left??L[t.i].s;t.run=true;t.end=Date.now()+s*1000;t.left=null}
 ctRender(id);if(!CTI)CTI=setInterval(ctTick,300);try{navigator.wakeLock&&navigator.wakeLock.request('screen').catch(()=>{})}catch(e){}};
window.ctSkip=id=>{const e=q(id);if(!e)return;const L=ctPh(e.circuit),t=ctSt(id),run=t.run;if(t.i>=L.length)return;t.i++;t.left=null;if(t.i>=L.length)t.run=false;else if(run)t.end=Date.now()+L[t.i].s*1000;ctRender(id)};
window.ctRaz=id=>{delete CT[id];ctRender(id)};
function ctTick(){let run=false;Object.keys(CT).forEach(id=>{const t=CT[id];if(!t.run)return;const e=q(id);if(!e){t.run=false;return}const L=ctPh(e.circuit);
  if(Date.now()>=t.end){const i=t.i+1;if(i>=L.length){t.i=i;t.run=false;ctBeep(true)}else{ctStart(id,i);ctBeep(false);run=true}ctRender(id)}
  else{run=true;const sec=Math.max(0,(t.end-Date.now())/1000);document.querySelectorAll('.circtm[data-ct="'+id.replace(/"/g,'')+'"] .ct2').forEach(d=>d.textContent=clk(sec))}});
 if(!run){clearInterval(CTI);CTI=null}}
// ---------- fiche ----------
function ficheCircuit(e,v){const c=e.circuit,P=c.postes.map(id=>q(id)),sch=P.map((f,i)=>f&&f.schema_svg?{nom:(i+1)+' · '+f.titre,svg:f.schema_svg,dessus:false,incl:false}:null).filter(Boolean);
 const e2={...e,variantes:[],schema_svg:null,schemas_svg:sch,schema_physique:null};
 return `<div class="fiche circuit"><h3><span class="min">${v&&v.duree||e.duree_min}'</span>${esc(e.titre)}</h3>
<div class="tags">${e.auteur?`<span class="tclub">${esc(e.auteur)}</span>`:''}<span>circuit</span><span>${c.postes.length} postes</span><span>${c.groupes} groupes</span><span>${mn(c.duree_s)} par poste</span></div>
${!v?`<div class="actions noprint"><button onclick="circEdit('${esc(e.id)}')">✎ Modifier le circuit</button></div>`:''}
<div class="circtop"><div>${circPlan(e)}</div><div>${circTable(c)}<p class="hint" style="margin:6px 0 0">${c.recup_s?`Récupération / changement de poste : ${mn(c.recup_s)}. `:''}À chaque rotation, chaque groupe passe au poste suivant (numéro + 1).</p></div></div>
${ctHtml(e)}
${sch.length?schemas(e2,v):''}
<h4>Les postes</h4><ol class="circpostes">${P.map((f,i)=>f?`<li><b>${esc(f.titre)}</b>${f.muscle?` <small>(${esc(f.muscle)})</small>`:''} — ${esc(cut(f.objectif||'',120))}</li>`:`<li>Fiche introuvable (${esc(c.postes[i])})</li>`).join('')}</ol>
<h4>Matériel</h4><p>${txtMat(e.materiel||[])}</p>
<h4>Organisation</h4><p>${esc(e.organisation)}</p>
<h4>Consignes</h4><ul>${(e.consignes||[]).map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`}
const f0=fiche;fiche=function(e,v){return e&&e.circuit?ficheCircuit(e,v):f0(e,v)};
// En séance, le minuteur du circuit remplace le minuteur global de l'exercice.
const t0=tmHtml;tmHtml=function(i,d){const e=q((S[i]||{}).id);return e&&e.circuit?'':t0(i,d)};
// ---------- créateur ----------
let CB=null;
const cand=()=>E.filter(e=>PHT.has(e.theme)&&!e.circuit);
function circEdit(id){const old=id&&q(id),c=old&&old.circuit;
 CB={id:old?old.id:null,titre:old?old.titre:'',postes:c?c.postes.slice():[],dm:c?c.duree_s/60:5,rc:c?c.recup_s:30,g:c?c.groupes:4,r:c?c.rotations:null,old};
 let d=document.getElementById('dcirc');if(d)d.remove();d=document.createElement('dialog');d.id='dcirc';d.style.cssText='max-width:760px;width:96vw;border:0;border-radius:10px;padding:14px 16px';
 d.innerHTML=`<h3 style="margin:0 0 8px">${old?'Modifier le circuit':'Créer un circuit d’ateliers'}</h3>
 <label style="display:block;margin-bottom:8px">Titre (40 car.) <input id="cb_t" maxlength="40" style="width:100%" value="${esc(CB.titre).replace(/"/g,'&quot;')}" placeholder="ex. Circuit renfo 4 × 5 min"></label>
 <b>Postes, dans l’ordre du circuit (4 à 8)</b><ol id="cb_sel" style="margin:4px 0 8px;padding-left:22px"></ol>
 <details open><summary><b>Ajouter un poste</b> (fiches Physique)</summary><input id="cb_q" placeholder="Rechercher une fiche…" style="width:100%;margin:6px 0"><div id="cb_c" style="max-height:200px;overflow:auto;border:1px solid #ccd;border-radius:6px"></div></details>
 <div style="display:flex;gap:12px;flex-wrap:wrap;margin:10px 0"><label>Durée par poste (min) <input id="cb_d" type="number" min="0.5" step="0.5" style="width:70px"></label><label>Récup / changement (s) <input id="cb_rc" type="number" min="0" step="5" style="width:70px"></label><label>Groupes <input id="cb_g" type="number" min="1" max="8" style="width:60px"></label><label>Rotations <input id="cb_r" type="number" min="1" max="16" style="width:60px"></label></div>
 <p id="cb_s" class="hint"></p>
 <div class="actions"><button class="add" id="cb_ok">Enregistrer le circuit</button><button id="cb_x">Annuler</button></div>`;
 document.body.appendChild(d);const $c=i=>d.querySelector('#'+i);
 $c('cb_d').value=CB.dm;$c('cb_rc').value=CB.rc;$c('cb_g').value=CB.g;$c('cb_r').value=CB.r||CB.postes.length||4;
 const lire=()=>{CB.dm=Math.max(.5,+$c('cb_d').value||5);CB.rc=Math.max(0,+$c('cb_rc').value||0);CB.g=Math.max(1,Math.min(8,Math.round(+$c('cb_g').value||1)));CB.r=Math.max(1,Math.min(16,Math.round(+$c('cb_r').value||1)));CB.titre=$c('cb_t').value};
 const sel=()=>{$c('cb_sel').innerHTML=CB.postes.map((id,i)=>{const f=q(id);return`<li><b>${esc(f?f.titre:'Fiche introuvable ('+id+')')}</b> <button data-m="-1" data-i="${i}">▲</button><button data-m="1" data-i="${i}">▼</button><button data-m="0" data-i="${i}">✕</button></li>`}).join('')||'<li style="list-style:none;color:#888">Aucun poste : ajoute des fiches ci-dessous.</li>';
  $c('cb_sel').querySelectorAll('button').forEach(b=>b.onclick=()=>{const i=+b.dataset.i,m=+b.dataset.m;if(!m)CB.postes.splice(i,1);else if(CB.postes[i+m]){[CB.postes[i],CB.postes[i+m]]=[CB.postes[i+m],CB.postes[i]]}sel();sum()})};
 const lst=()=>{const w=$c('cb_q').value.toLowerCase();$c('cb_c').innerHTML=cand().filter(e=>!w||(e.titre+' '+(e.muscle||'')+' '+e.theme).toLowerCase().includes(w)).slice(0,60).map(e=>`<div style="display:flex;gap:6px;align-items:center;padding:3px 8px;border-bottom:1px solid #eef"><button class="add" data-id="${esc(e.id)}">+</button><span>${esc(e.titre)} <small style="color:#777">${esc(e.theme)}${e.muscle?' · '+esc(e.muscle):''}</small></span></div>`).join('')||'<p style="padding:6px">Aucune fiche.</p>';
  $c('cb_c').querySelectorAll('button').forEach(b=>b.onclick=()=>{if(CB.postes.length>=8){alert('8 postes au maximum.');return}CB.postes.push(b.dataset.id);sel();sum()})};
 const sum=()=>{lire();const c={postes:CB.postes,duree_s:CB.dm*60,recup_s:CB.rc,groupes:CB.g,rotations:CB.r},ok=CB.postes.length>=4;
  $c('cb_s').innerHTML=`${CB.postes.length} poste${CB.postes.length>1?'s':''} · ${CB.g} groupe${CB.g>1?'s':''} · ${CB.r} rotation${CB.r>1?'s':''} → durée totale <b>${Math.ceil(duree(c)/60)} min</b>`+(CB.g>CB.postes.length&&CB.postes.length?' · <b style="color:#c0392b">plus de groupes que de postes</b>':'')+(CB.r>CB.postes.length&&CB.postes.length?' · un groupe repasse sur un même poste':'')+(ok?'':' · <b style="color:#c0392b">minimum 4 postes</b>')};
 ['cb_d','cb_rc','cb_g','cb_r'].forEach(i=>$c(i).oninput=sum);$c('cb_q').oninput=lst;
 $c('cb_x').onclick=()=>d.close();$c('cb_ok').onclick=()=>circSave(d);
 sel();lst();sum();d.showModal()}
window.circEdit=circEdit;
function circSave(d){const t=CB.titre.trim();if(!t){alert('Donne un titre au circuit.');return}if(CB.postes.length<4||CB.postes.length>8){alert('Un circuit compte de 4 à 8 postes.');return}
 if(CB.postes.some(id=>!q(id))){alert('Une fiche de poste est introuvable : retire-la.');return}
 const c={postes:CB.postes.slice(),duree_s:Math.round(CB.dm*60),recup_s:CB.rc,groupes:CB.g,rotations:CB.r},P=c.postes.map(q),n=P.length,tot=Math.ceil(duree(c)/60);
 const mat={};P.forEach(f=>(matListe(f)||[]).forEach(m=>{const k=m.nom;mat[k]=(mat[k]||0)+(+m.quantite||1)}));
 const cats=[...new Set(P.flatMap(f=>f.categories||[]))],old=CB.old;
 const f={...(old?propre(old,true):{}),id:old?old.id:'perso-circ-'+Date.now().toString(36),perso:true,titre:t.slice(0,40),theme:'circuit',categories:cats,public:['filles','garçons'],niveau:'débutant',duree_min:tot,joueurs:{min:c.groupes,max:c.groupes*8},surface:'',
  materiel:Object.entries(mat).map(([nom,quantite])=>({nom,quantite})),
  auteur:nomAut(lsG('nomeduc')||old&&old.auteur||''),mots_cles:['circuit','ateliers','rotation','renfo','proprio'],
  objectif:'Enchaîner '+n+' petits ateliers : chaque groupe passe à tour de rôle sur chaque poste, au même signal.',
  organisation:n+' postes de '+mn(c.duree_s)+(c.recup_s?', '+mn(c.recup_s)+' de récupération pour changer de poste':'')+'. '+c.groupes+' groupes, '+c.rotations+' rotations. Au signal, chaque groupe passe au poste suivant (numéro + 1).',
  deroulement:P.map((x,i)=>(i+1)+'. '+x.titre).join(' · '),
  consignes:['Même signal pour tous : on change de poste ensemble.','Chaque poste est expliqué et montré avant de lancer le circuit.','Qualité du geste avant le nombre de répétitions.'],variantes:[],circuit:c};
 if(!f.auteur)delete f.auteur;delete f.club;delete f.maj;delete f.schema_svg;delete f.schemas_svg;
 const a=chargePerso().filter(x=>x.id!=f.id);a.push(f);savePerso(a);d.close();majE();show('b');
 const auto=typeof clubAuto=='function'&&clubAuto();if(auto)partager(f.id,true);
 setTimeout(()=>alert('Circuit « '+f.titre+' » enregistré'+(auto?' et ajouté au club.':' sur cet appareil.')),50)}
// Bouton de création dans l'espace Physique.
const mf=majFiltres;majFiltres=function(){mf();if(ZONE=='p'){const s=document.getElementById('side');if(s&&!s.querySelector('#bcirc')){const b=document.createElement('button');b.id='bcirc';b.className='add big';b.textContent='🔁 Créer un circuit d’ateliers';b.onclick=()=>circEdit();const p=s.querySelector('#bph');p?p.after(b):s.prepend(b)}}};
const st=document.createElement('style');st.textContent=`.circtop{display:grid;grid-template-columns:minmax(280px,1.3fr) 1fr;gap:12px;align-items:center;margin:8px 0}@media(max-width:700px){.circtop{grid-template-columns:1fr}}
.circplan{width:100%;max-width:420px;background:#f6f9ff;border:1px solid #cfd8e6;border-radius:8px}
.circtab{border-collapse:collapse;font-size:13px;width:100%}.circtab th,.circtab td{border:1px solid #cfd8e6;padding:3px 6px;text-align:center}.circtab thead th{background:#dce8f8}.circtab tbody th{text-align:left}
.circtm{background:#fff;border:2px solid var(--o);border-radius:10px;padding:8px 12px;margin:10px 0;text-align:center}.circtm.rec{border-color:#c0392b;background:#fff3f0}.circtm.fin{border-color:#2e8b57;background:#eefaf2}
.ct1{font-weight:700;color:var(--o)}.ct2{font-size:44px;font-weight:700;line-height:1.1}.ct3{list-style:none;margin:6px 0;padding:0;display:flex;gap:6px;flex-wrap:wrap;justify-content:center}.ct3 li{border:2px solid;border-radius:14px;padding:2px 10px;font-size:14px;background:#fff}
.circpostes{padding-left:22px;margin:4px 0}`;document.head.appendChild(st);
})();
