// Planificateur de saison : thèmes par période (partagés au club) + séances placées par date.
window.PERIODES=[];
const SA_MOIS=['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
const SA_CATS=['U7','U8','U9','U10','U11','U12','U13','U14','U15','U16','U17','U18','Seniors'];
const THEMES_SAISON=['Sortie de balle','Finition','Transitions','Pressing','Jeu sans ballon','Conduite et dribbles','Conservation et passes','Jeu aérien','Coups de pied arrêtés','Physique et appuis','Gardien','Jeu réduit'];
const SA_COUL=['#dce8f8','#fbe9b0','#d6f0d9','#f6d6e0','#e3dcf6','#fde0c8'];
const saIso=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const coulTheme=t=>{let h=0;for(const c of t||'')h=(h*31+c.charCodeAt(0))%SA_COUL.length;return SA_COUL[h]};
let SAISON_AN=(()=>{const n=new Date();return n.getMonth()>=6?n.getFullYear():n.getFullYear()-1})();
const saisonPourStock=()=>{try{return JSON.parse(lsG('periodes')||'[]')}catch(e){return[]}};
async function saisonCharger(msg){
 if(!clubOn()){PERIODES=saisonPourStock();saisonAff(msg);return}
 const code=lsG('codeclub');if(!code){saisonAff('Saisis d\'abord le code club (onglet Base).');return}
 try{const r=await fetch(CLUB_URL+'/rest/v1/rpc/lire_periodes',{method:'POST',headers:clubH(),body:JSON.stringify({code})});
  if(!r.ok)throw new Error(r.status);PERIODES=(await r.json()).map(x=>({...x.data,id:x.id,auteur:x.auteur||''}));saisonAff(msg)}
 catch(e){saisonAff('Planning indisponible pour le moment (le script SQL « saison » est-il lancé ? connexion ?)')}}
function saisonAff(msg){const L=document.getElementById('saisonc');if(!L)return;
 const an=SAISON_AN,deb=an+'-08-01',fin=(an+1)+'-07-31',cat=document.getElementById('scat').value;
 document.getElementById('san').textContent='Saison '+an+'-'+(an+1);
 const per=PERIODES.filter(p=>p.fin>=deb&&p.debut<=fin&&(!cat||!p.cat||p.cat==cat));
 const sea=(window.SEANCES||[]).filter(s=>s.date>=deb&&s.date<=fin);
 const mois=[];for(let i=0;i<12;i++){const d=new Date(an,7+i,1);mois.push({y:d.getFullYear(),m:d.getMonth()})}
 const themesDe=s=>[...new Set((s.exercices||[]).map(e=>{const f=(window.EXERCICES||[]).concat(window.CLUBF||[]).find(y=>y.id==e.id);return f&&f.theme}).filter(Boolean))];
 L.innerHTML=(msg?`<p class="vide">${esc(msg)}</p>`:'')+(per.length?`<div class="tot"><b>Thèmes de la saison</b><br>`+per.map(p=>`<span class="pth" style="background:${coulTheme(p.theme)}" onclick="periodeEditer('${esc(p.id)}')">${esc(p.theme)} <small>${dateFr(p.debut).slice(0,5)} → ${dateFr(p.fin).slice(0,5)}${p.cat?' · '+esc(p.cat):''}</small></span>`).join('')+'</div>':'')
 +mois.map(({y,m})=>{const a=y+'-'+String(m+1).padStart(2,'0'),dd=a+'-01',df=a+'-31';
  const ps=per.filter(p=>p.fin>=dd&&p.debut<=df),ss=sea.filter(s=>s.date.startsWith(a)).sort((x,z)=>x.date.localeCompare(z.date));
  const nb=ps.length?ps.map(p=>{const c=sea.filter(s=>s.date>=p.debut&&s.date<=p.fin).length;return `<div class="pbar" style="background:${coulTheme(p.theme)}" onclick="periodeEditer('${esc(p.id)}')"><b>${esc(p.theme)}</b> <small>du ${dateFr(p.debut).slice(0,5)} au ${dateFr(p.fin).slice(0,5)}${p.cat?' · '+esc(p.cat):''}${p.auteur?' · '+esc(p.auteur):''} · ${c} séance${c>1?'s':''}</small>${p.note?`<br><small>${esc(p.note)}</small>`:''}</div>`}).join(''):'<small style="color:#888">Aucun thème défini ce mois-ci.</small>';
  return `<details class="tstep"${ps.length||ss.length||(new Date().getFullYear()==y&&new Date().getMonth()==m)?' open':''}><summary>${SA_MOIS[m]} ${y} <small style="color:#777;font-weight:400">${ss.length} séance${ss.length>1?'s':''}</small></summary><div style="padding:0 14px 14px">${nb}
  ${ss.map(s=>{const d=(s.exercices||[]).reduce((t,e)=>t+ +e.duree,0);return `<div class="sitem" style="margin-top:6px"><b>${dateFr(s.date)}</b> · ${esc(s.nom||'Séance')} <small style="color:#777">${s.auteur?'· '+esc(s.auteur)+' ':''}· ${d} min${themesDe(s).length?' · '+themesDe(s).map(esc).join(', '):''}</small> <button onclick="ouvrirSeance('${esc(s.id)}',0)">Ouvrir</button></div>`}).join('')}
  <div class="actions"><button class="add" onclick="saisonNouvelleSeance('${a}')">+ Planifier une séance</button><button onclick="periodeEditer('','${a}-01')">+ Thème sur une période</button></div></div></details>`}).join('')}
function saisonNouvelleSeance(mois){let d=document.getElementById('pld');if(d)d.remove();d=document.createElement('dialog');d.id='pld';d.style.cssText='max-width:420px;width:92vw;padding:16px';
 const auj=saIso(new Date()),def=auj.startsWith(mois)?auj:mois+'-01';
 d.innerHTML='<h3 style="margin:0 0 8px">Planifier une séance</h3><label>Date<br><input type="date" id="pd" value="'+def+'" style="width:100%"></label><br><br><label>Nom (catégorie, thème…)<br><input id="pn" placeholder="Ex. U11 – sortie de balle" style="width:100%"></label><div style="margin-top:12px;text-align:right"><button id="px">Annuler</button> <button class="add" id="po">Composer la séance</button></div>';
 document.body.appendChild(d);d.querySelector('#px').onclick=()=>d.close();
 d.querySelector('#po').onclick=()=>{const dt=d.querySelector('#pd').value;if(!dt){alert('Choisis une date.');return}
  S=[];nom.value=d.querySelector('#pn').value.trim();dat.value=dt;lsS('nomseance',nom.value);lsS('dateseance',dt);lsS('seanceid','');TERRAIN=false;TM={};save();d.close();show('s')};d.showModal()}
function periodeEditer(id,debut){const p=PERIODES.find(x=>x.id==id)||{theme:'',cat:'',debut:debut||SAISON_AN+'-09-01',fin:debut||SAISON_AN+'-10-15',note:''};
 let d=document.getElementById('ped');if(d)d.remove();d=document.createElement('dialog');d.id='ped';d.style.cssText='max-width:440px;width:92vw;padding:16px';
 d.innerHTML='<h3 style="margin:0 0 8px">'+(id?'Modifier le thème':'Thème de période')+'</h3><label>Thème<br><input id="et" list="etl" value="'+esc(p.theme)+'" style="width:100%"></label><datalist id="etl">'+THEMES_SAISON.map(t=>'<option>'+t+'</option>').join('')+'</datalist><br><br><label>Catégorie<br><select id="ec" style="width:100%"><option value="">Toutes</option>'+SA_CATS.map(c=>'<option'+(c==p.cat?' selected':'')+'>'+c+'</option>').join('')+'</select></label><br><br><div style="display:flex;gap:8px"><label>Du<br><input type="date" id="ed" value="'+p.debut+'"></label><label>Au<br><input type="date" id="ef" value="'+p.fin+'"></label></div><br><label>Note (objectif, accent à mettre…)<br><input id="en" value="'+esc(p.note||'')+'" style="width:100%"></label><div style="margin-top:12px;text-align:right">'+(id?'<button id="es" class="del">Retirer</button> ':'')+'<button id="ex">Annuler</button> <button class="add" id="eo">Enregistrer</button></div>';
 document.body.appendChild(d);d.querySelector('#ex').onclick=()=>d.close();
 if(id)d.querySelector('#es').onclick=async()=>{if(!confirm('Retirer ce thème du planning ? Il est seulement masqué.'))return;
  if(clubOn()){const code=clubCode();if(!code)return;if(!await clubRpc('retirer_periode',{code,pid:id}))return}
  else{const l=saisonPourStock().filter(x=>x.id!=id);lsS('periodes',JSON.stringify(l))}
  d.close();saisonCharger()};
 d.querySelector('#eo').onclick=async()=>{const o={theme:d.querySelector('#et').value.trim().slice(0,60),cat:d.querySelector('#ec').value,debut:d.querySelector('#ed').value,fin:d.querySelector('#ef').value,note:d.querySelector('#en').value.trim().slice(0,200)};
  if(!o.theme){alert('Donne un thème.');return}if(!o.debut||!o.fin||o.fin<o.debut){alert('Vérifie les dates (la fin doit suivre le début).');return}
  const pid=id||('p'+Date.now().toString(36));
  if(clubOn()){const code=clubCode();if(!code)return;let au=lsG('nomeduc');if(!au){au=(prompt('Ton nom, affiché sur le thème :')||'').trim().slice(0,40);lsS('nomeduc',au)}
   if(!await clubRpc('publier_periode',{code,pid,periode:o,auteur:au}))return;lsS('codeclub',code)}
  else{const l=saisonPourStock().filter(x=>x.id!=pid);l.push({...o,id:pid});lsS('periodes',JSON.stringify(l))}
  d.close();saisonCharger()};d.showModal()}
(function(){const sec=document.getElementById('saison');if(!sec)return;
 sec.innerHTML='<div class="filtres noprint"><button onclick="SAISON_AN--;saisonAff()">◀</button><b id="san" style="padding:7px"></b><button onclick="SAISON_AN++;saisonAff()">▶</button><select id="scat" onchange="saisonAff()"><option value="">Toutes catégories</option>'+SA_CATS.map(c=>'<option>'+c+'</option>').join('')+'</select><button class="add" onclick="periodeEditer(\'\')">+ Thème sur une période</button><button onclick="saisonCharger()">Actualiser</button><button onclick="window.print()">Imprimer</button></div><div id="saisonc"></div>';
 const st=document.createElement('style');st.textContent='.pth{display:inline-block;border-radius:12px;padding:3px 10px;margin:4px 6px 0 0;cursor:pointer}.pbar{border-radius:6px;padding:6px 10px;margin:6px 0;cursor:pointer}';document.head.appendChild(st);
 document.getElementById('nsa').onclick=async()=>{show('a');saisonCharger();if(clubOn()&&lsG('codeclub')){await seancesCharger();saisonAff()}};
 if(clubOn()&&lsG('codeclub'))saisonCharger();})();
