/* Éditeur de terrain — Atelier Foot
   Format v3 : items = situation de départ ; temps = [{moves:{indice:{x,y,c?,o?}}}].
   Dans un temps, tout bouge en même temps. Le type de flèche est déduit :
   joueur sans ballon = course, joueur avec ballon = conduite, ballon vers joueur = passe, ballon vers but = tir. */
const NAVY='#1b3a73',RED='#d63a2a',GOLD='#e8b923',PLOT='#d9a406',OFF=[9,6],V=45;
const DEFS='<defs>'+[['ap','#222'],['ad',PLOT],['ar',RED],['ag','#999']].map(([id,c])=>`<marker id="${id}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="${c}"/></marker>`).join('')+'</defs>';
const blank=()=>{const m={v:3,w:30,h:20,items:[],temps:[]};const f=field(m);m.fr=[f.x,f.y,f.w,f.h];return m};
let M=blank(),tool='sel',sel=null,drag=null,tmp=null,hist=[],redo=[],editingId=null,mode='d',cur=0;
const $e=id=>document.getElementById(id);
const esc2=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const R=v=>Math.round(v*10)/10,cl=o=>JSON.parse(JSON.stringify(o)),dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
const isP=(m,o)=>o!=null&&m.items[o]&&m.items[o].t=='p';
function norm(m){m=cl(m||blank());m.v=3;m.temps=m.temps||[];m.items=(m.items||[]).filter(i=>['p','ball','zone',...EQUIP].includes(i.t));
 const nf=field(m),of=m.fr?{x:m.fr[0],y:m.fr[1],w:m.fr[2],h:m.fr[3]}:fieldOld(m);remap(m,of,nf);return m}
// Le terrain suit le rapport largeur/longueur, mais reste toujours assez grand pour placer les éléments.
function field(m){const r=Math.min(2.2,Math.max(.8,m.w/m.h));let fw,fh;if(r>260/156){fw=260;fh=260/r}else{fh=156;fw=156*r}const q=v=>Math.round(v*10)/10;return{x:q(20+(260-fw)/2),y:q(22+(156-fh)/2),w:q(fw),h:q(fh)}}
function fieldOld(m){const s=Math.min(260/m.w,156/m.h),fw=m.w*s,fh=m.h*s;return{x:20+(260-fw)/2,y:22+(156-fh)/2,w:fw,h:fh}}
function remap(m,of,nf){m.fr=[nf.x,nf.y,nf.w,nf.h];if(Math.abs(of.x-nf.x)+Math.abs(of.y-nf.y)+Math.abs(of.w-nf.w)+Math.abs(of.h-nf.h)<.5)return;
 const sx=nf.w/of.w,sy=nf.h/of.h,X=x=>R(nf.x+(x-of.x)*sx),Y=y=>R(nf.y+(y-of.y)*sy);
 m.items.forEach(it=>{it.x=X(it.x);it.y=Y(it.y);if(it.t=='zone'){it.w=R(it.w*sx);it.h=R(it.h*sy)}});
 m.temps.forEach(T=>Object.values(T.moves||{}).forEach(q=>{q.x=X(q.x);q.y=Y(q.y);if(q.c)q.c=[X(q.c[0]),Y(q.c[1])]}))}
const EQUIP=['plot','but','haie','cerceau','piquet','mannequin','echelle','txt'],ROTABLE=['but','plot','txt','haie','piquet','echelle'];
const NOMS={p:'Joueur',ball:'Ballon',plot:'Plot',but:'But',haie:'Haie',cerceau:'Cerceau',piquet:'Piquet',mannequin:'Mannequin',echelle:'Échelle de rythme',txt:'Texte',zone:'Zone'};
function shape(it){
 if(it.t=='p'){const c=it.c=='r'?RED:it.c=='j'?GOLD:NAVY;return `<ellipse cy="9" rx="7" ry="2.2" fill="#0002"/><circle r="9.5" fill="${c}" stroke="#fff" stroke-width="1.6"/><circle r="9.5" fill="none" stroke="#0003" stroke-width=".6"/><text y="3.8" font-size="10.5" text-anchor="middle" fill="${it.c=='j'?NAVY:'#fff'}" font-family="sans-serif" font-weight="700">${esc2(it.l)}</text>`}
 if(it.t=='plot')return `<ellipse cy="4.2" rx="5" ry="1.4" fill="#0002"/><path d="M-1 -4.5h2L4 3.5h-8z" fill="${PLOT}" stroke="#9a7000" stroke-width=".5"/><rect x="-5" y="3" width="10" height="1.8" rx=".9" fill="#9a7000"/>`;
 if(it.t=='ball')return `<circle r="4.3" fill="#fff" stroke="#222" stroke-width="1.1"/><path d="M0 -1.9L1.8 -.6L1.1 1.5H-1.1L-1.8 -.6z" fill="#222"/>`;
 if(it.t=='but')return `<rect x="-20" y="-5" width="40" height="10" rx="1" fill="#fff"/>${[-15,-10,-5,0,5,10,15].map(x=>`<line x1="${x}" y1="-5" x2="${x}" y2="5" stroke="#c9d3e0" stroke-width=".7"/>`).join('')}<line x1="-20" y1="0" x2="20" y2="0" stroke="#c9d3e0" stroke-width=".7"/><rect x="-20" y="-5" width="40" height="10" rx="1" fill="none" stroke="#222" stroke-width="2"/>`;
 if(it.t=='haie')return `<rect x="-11" y="-3.5" width="2.4" height="7" rx="1" fill="#555"/><rect x="8.6" y="-3.5" width="2.4" height="7" rx="1" fill="#555"/><rect x="-10" y="-1.6" width="20" height="3.2" rx="1.6" fill="#e8731a" stroke="#a84f0e" stroke-width=".5"/>`;
 if(it.t=='cerceau')return `<circle r="8" fill="none" stroke="#0002" stroke-width="3" transform="translate(.8 1)"/><circle r="8" fill="none" stroke="#2fa84f" stroke-width="2.4"/>`;
 if(it.t=='piquet')return `<ellipse cy="2.5" rx="4" ry="1.4" fill="#0003"/><rect x="-1.6" y="-15" width="3.2" height="17" rx="1.6" fill="#fff" stroke="#333" stroke-width=".5"/>${[-13,-8,-3].map(y=>`<rect x="-1.6" y="${y}" width="3.2" height="2.6" fill="${RED}"/>`).join('')}`;
 if(it.t=='mannequin')return `<ellipse cy="2.5" rx="6" ry="1.8" fill="#0003"/><path d="M-4.5 2 L-3.5 -9 Q0 -11 3.5 -9 L4.5 2 Z" fill="#5b6b82" stroke="#2b3646" stroke-width=".6"/><circle cy="-13" r="3.6" fill="#5b6b82" stroke="#2b3646" stroke-width=".6"/><rect x="-4" y="-6" width="8" height="1.8" fill="#fff" opacity=".8"/>`;
 if(it.t=='echelle')return `<line x1="-30" y1="-5" x2="30" y2="-5" stroke="#333" stroke-width="1.2"/><line x1="-30" y1="5" x2="30" y2="5" stroke="#333" stroke-width="1.2"/>${[-30,-22.5,-15,-7.5,0,7.5,15,22.5,30].map(x=>`<line x1="${x}" y1="-5" x2="${x}" y2="5" stroke="${GOLD}" stroke-width="2"/>`).join('')}`;
 if(it.t=='txt')return `<text font-size="10" text-anchor="middle" fill="#333" font-family="sans-serif">${esc2(it.s)}</text>`;
 return ''}
// ---------- simulation ----------
function simulate(m){
 const I=m.items,TT=m.temps||[],mob=[];I.forEach((it,i)=>{if(it.t=='p'||it.t=='ball')mob.push(i)});
 let pos={},own={};
 I.forEach((it,i)=>{pos[i]=[it.x,it.y];if(it.t=='ball')own[i]=isP(m,it.o)?it.o:null});
 mob.forEach(b=>{if(I[b].t=='ball'&&own[b]!=null)pos[b]=[pos[own[b]][0]+OFF[0],pos[own[b]][1]+OFF[1]]});
 const states=[{pos:cl(pos),own:{...own}}],segs=[];
 TT.forEach(T=>{const mv=T.moves||{},np=cl(pos),no={...own},sg={};
  Object.keys(mv).forEach(s=>{const i=+s;if(!I[i]||I[i].t!='p')return;const q=mv[s];np[i]=[q.x,q.y];
   const carry=mob.some(b=>I[b].t=='ball'&&own[b]==i&&!mv[b]);
   sg[i]={a:pos[i],b:np[i],c:q.c||null,kind:carry?'conduite':'course',from:pos[i],to:np[i],fromP:true,toP:false}});
  Object.keys(mv).forEach(s=>{const b=+s;if(!I[b]||I[b].t!='ball')return;const q=mv[s];no[b]=isP(m,q.o)?q.o:null;
   np[b]=no[b]!=null?[np[no[b]][0]+OFF[0],np[no[b]][1]+OFF[1]]:[q.x,q.y];
   const tir=no[b]==null&&I.some(g=>g.t=='but'&&Math.hypot(g.x-q.x,g.y-q.y)<26);
   sg[b]={a:pos[b],b:np[b],c:q.c||null,kind:tir?'tir':'passe',from:own[b]!=null?pos[own[b]]:pos[b],to:no[b]!=null?np[no[b]]:np[b],fromP:own[b]!=null,toP:no[b]!=null}});
  mob.forEach(b=>{if(I[b].t=='ball'&&!mv[b]&&own[b]!=null&&sg[own[b]]){const g=sg[own[b]];np[b]=[np[own[b]][0]+OFF[0],np[own[b]][1]+OFF[1]];sg[b]={a:pos[b],b:np[b],c:g.c?[g.c[0]+OFF[0],g.c[1]+OFF[1]]:null,kind:'suivi'}}});
  segs.push(sg);pos=np;own=no;states.push({pos:cl(pos),own:{...own}})});
 return{states,segs,mob}}
function qpts(a,c,b,n=24){const o=[];for(let k=0;k<=n;k++){const t=k/n,u=1-t;o.push(c?[u*u*a[0]+2*u*t*c[0]+t*t*b[0],u*u*a[1]+2*u*t*c[1]+t*t*b[1]]:[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t])}return o}
function plen(p){let l=0;for(let k=1;k<p.length;k++)l+=dist(p[k],p[k-1]);return l}
const segLen=g=>plen(qpts(g.a,g.c,g.b,16)),vel=g=>(g.kind=='passe'||g.kind=='tir')?V*1.6:V;
function timing(S){const durs=S.segs.map(sg=>Math.max(1,...Object.values(sg).map(g=>segLen(g)/vel(g))));let t=0;const starts=durs.map(d=>{const s=t;t+=d+.3;return s});return{starts,durs,T:S.segs.length?t+1.6:0}}
function motion(S,TM,i,speed){
 const p0=S.states[0].pos[i];let d='M0 0',cum=0,keys=[[0,0]],spl=[],last=p0;const EASE={passe:'.1 .6 .4 1',tir:'.1 .6 .4 1',conduite:'.35 0 .65 1'},LIN='0 0 1 1';
 S.segs.forEach((sg,k)=>{const g=sg[i];if(!g)return;const t0=TM.starts[k],L=segLen(g);
  if(keys[keys.length-1][0]<t0-1e-6){keys.push([t0,cum]);spl.push(LIN)}
  const rx=v=>R(v[0]-p0[0])+' '+R(v[1]-p0[1]);d+=g.c?` Q${rx(g.c)} ${rx(g.b)}`:` L${rx(g.b)}`;cum+=L;keys.push([t0+Math.max(.2,L/vel(g)),cum]);spl.push(EASE[g.kind]||'.45 0 .55 1');last=g.b});
 if(cum<1)return'';
 if(TM.T-1>keys[keys.length-1][0]){keys.push([TM.T-1,cum]);spl.push(LIN)}d+=' L0 0';cum+=dist(last,p0);keys.push([TM.T,cum]);spl.push('.45 0 .55 1');
 return `<animateMotion dur="${(TM.T/(speed||1)).toFixed(2)}s" repeatCount="indefinite" calcMode="spline" keySplines="${spl.join(';')}" keyTimes="${keys.map(k=>(k[0]/TM.T).toFixed(4)).join(';')}" keyPoints="${keys.map(k=>(k[1]/cum).toFixed(4)).join(';')}" path="${d}"/>`}
// ---------- flèches ----------
function trim(p,r,end){const q=end?p.slice().reverse():p.slice(),o=q[0];while(q.length>2&&dist(q[0],o)<r)q.shift();return end?q.reverse():q}
function wavy(p){const o=[],L=plen(p);let s=0;for(let k=1;k<p.length;k++){const a=p[k-1],b=p[k],l=dist(a,b)||1,nx=-(b[1]-a[1])/l,ny=(b[0]-a[0])/l;for(let u=0;u<l;u+=2){const amp=3*Math.min(1,(L-s-u)/12);const w=amp*Math.sin((s+u)/3);o.push([a[0]+(b[0]-a[0])*u/l+nx*w,a[1]+(b[1]-a[1])*u/l+ny*w])}s+=l}o.push(p[p.length-1]);return o}
function arrow(g,n,op,an){
 let p=qpts(g.from,g.c,g.to,30);if(g.fromP)p=trim(p,13,false);if(g.toP)p=trim(p,13,true);if(plen(p)<6)return'';
 if(g.kind=='conduite')p=wavy(p);
 const st={course:`stroke="${PLOT}" stroke-width="2" stroke-dasharray="5 4" marker-end="url(#ad)"`,conduite:`stroke="#222" stroke-width="1.6" marker-end="url(#ap)"`,passe:`stroke="#222" stroke-width="2" marker-end="url(#ap)"`,tir:`stroke="${RED}" stroke-width="3" marker-end="url(#ar)"`}[g.kind];
 let s=`<polyline points="${p.map(q=>R(q[0])+','+R(q[1])).join(' ')}" fill="none" ${st}${op<1?` opacity="${op}"`:''}/>`;
 if(n&&plen(p)>22){const m=p[Math.floor(p.length*.4)];s+=`<g${op<1?` opacity="${op}"`:''}><circle cx="${R(m[0])}" cy="${R(m[1])}" r="5" fill="#fff" stroke="${NAVY}"/><text x="${R(m[0])}" y="${R(m[1]+2.5)}" font-size="7" font-weight="700" text-anchor="middle" fill="${NAVY}" font-family="sans-serif">${n}</text></g>`}
if(an){const T=an.T,c=t=>Math.min(T,Math.max(0,t)),s0=an.s,e0=an.s+an.d,ts=[0,s0,s0+.25,e0,e0+.5,T].map(c);for(let q=1;q<ts.length;q++)ts[q]=Math.max(ts[q],ts[q-1]);
  s=`<g opacity=".3"><animate attributeName="opacity" dur="${(T/an.sp).toFixed(2)}s" repeatCount="indefinite" keyTimes="${ts.map(t=>R(t/T*1e4)/1e4).join(';')}" values=".3;.3;1;1;.3;.3"/>${s}</g>`}
 return s}
// ---------- rendu ----------
function render0(m,o={}){
 m=norm(m);const S=simulate(m),I=m.items,f=field(m),ed=o.editor,nT=S.segs.length;
 const k=Math.min(cur,Math.max(0,nT-1)),st=ed=='m'?S.states[Math.min(k+1,nT)]:S.states[0],before=ed=='m'&&nT?S.states[k]:null;
 const TM=o.animOn?timing(S):null,P=i=>(I[i].t=='p'||I[i].t=='ball')?st.pos[i]:[I[i].x,I[i].y];
 let b=`<rect x="1" y="1" width="298" height="198" rx="6" fill="#e6eefa" stroke="${NAVY}"/><rect x="${R(f.x)}" y="${R(f.y)}" width="${R(f.w)}" height="${R(f.h)}" fill="#f4f8fd" stroke="${NAVY}" stroke-width="1.5"/>`;
 const di=i=>ed=='d'||(ed=='m'&&(I[i].t=='p'||I[i].t=='ball'))?` data-i="${i}" style="cursor:grab"`:'';
 I.forEach((it,i)=>{if(it.t=='zone')b+=`<rect${ed=='d'?` data-i="${i}" style="cursor:grab"`:''} x="${it.x}" y="${it.y}" width="${it.w}" height="${it.h}" fill="${ed?'#1b3a7310':'none'}" stroke="${NAVY}" stroke-dasharray="6 4"/>`});
 S.segs.forEach((sg,j)=>{const op=ed=='d'?.25:(ed=='m'&&j!=k?.22:1);Object.values(sg).forEach(g=>{if(g.kind!='suivi')b+=arrow(g,ed&&nT>1?j+1:0,op,TM&&nT>1?{s:TM.starts[j],d:TM.durs[j],T:TM.T,sp:o.speed||1}:null)})});
 if(before)S.mob.forEach(i=>{if(dist(before.pos[i],st.pos[i])>2)b+=`<g transform="translate(${R(before.pos[i][0])} ${R(before.pos[i][1])})" opacity=".3" style="pointer-events:none">${shape(I[i])}</g>`});
 const draw1=(it,i)=>{const p=P(i);let inner=shape(it);if(TM&&(it.t=='p'||it.t=='ball')){const mo=motion(S,TM,i,o.speed);if(mo)inner=`<g>${inner}${mo}</g>`}
  return `<g transform="translate(${R(p[0])} ${R(p[1])})${it.rot?` rotate(${it.rot})`:''}"${di(i)}>${ed&&sel===i?'<circle r="15" fill="none" stroke="#e8731a" stroke-dasharray="3 2"/>':''}${ed&&it.t=='ball'?'<circle r="8" fill="transparent"/>':''}${inner}</g>`};
 [...EQUIP,'p','ball'].forEach(t=>I.forEach((it,i)=>{if(it.t==t)b+=draw1(it,i)}));
 if(ed=='m'&&nT)Object.keys(S.segs[k]).forEach(s=>{const g=S.segs[k][s];if(g.kind=='suivi')return;const h=g.c||[(g.from[0]+g.to[0])/2,(g.from[1]+g.to[1])/2];b+=`<circle data-h="${s}" cx="${R(h[0])}" cy="${R(h[1])}" r="5" fill="#fff" stroke="#e8731a" stroke-width="2" style="cursor:move"><title>Tirer pour courber, double-clic pour redresser</title></circle>`});
 const lab=(x,y,t,r)=>{const tr=r?` transform="rotate(-90 ${x} ${y})"`:'';return `<rect x="${x-17}" y="${y-8}" width="34" height="13" rx="3" fill="#fff"${tr}/><text x="${x}" y="${y+3}" font-size="10" font-weight="700" fill="${NAVY}" text-anchor="middle" font-family="sans-serif"${tr}>${t}</text>`};
 const x1=R(f.x),x2=R(f.x+f.w),y1=R(f.y),y2=R(f.y+f.h);
 b+=`<g stroke="${NAVY}" stroke-width="1.2" fill="none"><line x1="${x1}" y1="8" x2="${x2}" y2="8"/><line x1="${x1}" y1="4" x2="${x1}" y2="12"/><line x1="${x2}" y1="4" x2="${x2}" y2="12"/><line x1="292" y1="${y1}" x2="292" y2="${y2}"/><line x1="288" y1="${y1}" x2="296" y2="${y1}"/><line x1="288" y1="${y2}" x2="296" y2="${y2}"/></g>`+lab(R((f.x*2+f.w)/2),8,m.w+' m')+lab(292,R((f.y*2+f.h)/2),m.h+' m',1);
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200"${ed?' id="cv" style="touch-action:none;user-select:none"':''}>${DEFS}${b}</svg>`}
function render(m,o={}){return uniq2(render0(m,o))}
// ---------- édition ----------
function snap(){hist.push(JSON.stringify(M));if(hist.length>80)hist.shift();redo=[]}
function undo(){if(hist.length){redo.push(JSON.stringify(M));M=JSON.parse(hist.pop());sel=null;fixCur();draw()}}
function redoF(){if(redo.length){hist.push(JSON.stringify(M));M=JSON.parse(redo.pop());sel=null;fixCur();draw()}}
function fixCur(){cur=Math.max(0,Math.min(cur,M.temps.length-1))}
function pt(ev){const s=$e('cv'),p=s.createSVGPoint();p.x=ev.clientX;p.y=ev.clientY;const q=p.matrixTransform(s.getScreenCTM().inverse());return[Math.round(q.x),Math.round(q.y)]}
function nextLabel(c){const n=M.items.filter(i=>i.t=='p'&&i.c==c).length;return c=='r'?String(n+1):c=='j'?'G':String.fromCharCode(65+n%26)}
function nearP(P,x,y,r,skip){let best=null,bd=r;M.items.forEach((it,i)=>{if(it.t=='p'&&i!==skip){const d=Math.hypot(P[i][0]-x,P[i][1]-y);if(d<bd){bd=d;best=i}}});return best}
function removeItem(i){M.items.splice(i,1);const sh=j=>j==null?null:(j==i?null:(j>i?j-1:j));
 M.items.forEach(it=>{if(it.o!=null)it.o=sh(it.o)});
 M.temps.forEach(T=>{const n={};Object.keys(T.moves||{}).forEach(s=>{const j=+s;if(j==i)return;const q=T.moves[s];if(q.o!=null)q.o=sh(q.o);n[j>i?j-1:j]=q});T.moves=n});sel=null}
function bind(){
 const s=$e('cv');
 s.onpointerdown=ev=>{const [x,y]=pt(ev),h=ev.target.closest('[data-h]'),el=ev.target.closest('[data-i]'),i=el?+el.dataset.i:null;s.setPointerCapture(ev.pointerId);
  if(mode=='m'){
   if(h){snap();drag={k:'curve',i:+h.dataset.h};return}
   if(i==null)return;if(!M.temps.length){M.temps.push({moves:{}});cur=0}
   snap();sel=i;drag={k:'mv',i,x0:x,y0:y,moved:false};return}
  if(tool=='sel'){sel=i;if(i!=null){snap();const it=M.items[i];if(it.t=='ball'&&isP(M,it.o)){const p=M.items[it.o];it.x=p.x+OFF[0];it.y=p.y+OFF[1]}drag={k:'d',i,x,y,o:cl(it)}}draw();return}
  if(tool=='gomme'){if(i!=null){snap();removeItem(i);draw()}return}
  if(tool=='zone'){tmp={x1:x,y1:y,x2:x,y2:y};return}
  snap();
  if(tool.startsWith('p_')){const c=tool[2];M.items.push({t:'p',c,l:nextLabel(c),x,y})}
  else if(tool=='txt'){const t=prompt('Texte :');if(!t){hist.pop();return}M.items.push({t:'txt',s:t,x,y})}
  else if(tool=='ball'){const P={};M.items.forEach((it,j)=>P[j]=[it.x,it.y]);const o=nearP(P,x,y,18);M.items.push(o!=null?{t:'ball',x,y,o}:{t:'ball',x,y})}
  else M.items.push({t:tool,x,y});
  sel=M.items.length-1;draw()};
 s.onpointermove=ev=>{const [x,y]=pt(ev);
  if(drag&&drag.k=='curve'){const T=M.temps[cur],q=T&&T.moves[drag.i];if(q){q.c=[x,y];draw()}else{const S=simulate(M),g=S.segs[cur]&&S.segs[cur][drag.i];if(g&&g.kind=='conduite'){}}return}
  if(drag&&drag.k=='mv'){if(!drag.moved&&Math.hypot(x-drag.x0,y-drag.y0)<4)return;drag.moved=true;const T=M.temps[cur];T.moves=T.moves||{};const q=T.moves[drag.i]||{};T.moves[drag.i]={x,y,...(M.items[drag.i].t=='ball'?{o:null}:{})};if(q.c&&M.items[drag.i].t=='p')delete T.moves[drag.i].c;draw();return}
  if(drag&&drag.k=='d'){const it=M.items[drag.i],o=drag.o,dx=x-drag.x,dy=y-drag.y;if(it.t=='ball'&&it.o!=null&&Math.hypot(dx,dy)>4)delete it.o;it.x=o.x+dx;it.y=o.y+dy;draw();return}
  if(tmp){tmp.x2=x;tmp.y2=y;const p=$e('prev');if(p)p.remove();s.insertAdjacentHTML('beforeend',`<rect id="prev" x="${Math.min(tmp.x1,tmp.x2)}" y="${Math.min(tmp.y1,tmp.y2)}" width="${Math.abs(tmp.x2-tmp.x1)}" height="${Math.abs(tmp.y2-tmp.y1)}" fill="none" stroke="${NAVY}" stroke-dasharray="6 4"/>`)}};
 s.onpointerup=ev=>{const [x,y]=pt(ev);
  if(drag&&drag.k=='mv'){const i=drag.i,T=M.temps[cur];
   if(!drag.moved){hist.pop()}else{const S=simulate({...M,temps:M.temps.slice(0,cur)}),start=S.states[S.states.length-1];
    if(M.items[i].t=='ball'){const Pend=simulate(M).states[cur+1].pos,o=nearP(Pend,x,y,20);
     if(o!=null){T.moves[i]={x:Pend[o][0]+OFF[0],y:Pend[o][1]+OFF[1],o};if(start.own[i]===o)delete T.moves[i]}
     else if(Math.hypot(x-start.pos[i][0],y-start.pos[i][1])<6)delete T.moves[i]}
    else if(Math.hypot(x-start.pos[i][0],y-start.pos[i][1])<6)delete T.moves[i]}
   drag=null;draw();return}
  if(drag&&drag.k=='d'){const it=M.items[drag.i];if(it.t=='ball'&&it.o==null){const P={};M.items.forEach((q,j)=>P[j]=[q.x,q.y]);const o=nearP(P,it.x,it.y,16);if(o!=null)it.o=o}}
  drag=null;
  if(tmp){const t=tmp;tmp=null;if(Math.hypot(t.x2-t.x1,t.y2-t.y1)>6){snap();M.items.push({t:'zone',x:Math.min(t.x1,t.x2),y:Math.min(t.y1,t.y2),w:Math.abs(t.x2-t.x1),h:Math.abs(t.y2-t.y1)});sel=M.items.length-1}}
  draw()};
 s.ondblclick=ev=>{const h=ev.target.closest('[data-h]');if(h&&mode=='m'){const q=M.temps[cur]&&M.temps[cur].moves[+h.dataset.h];if(q&&q.c){snap();delete q.c;draw()}return}
  const el=ev.target.closest('[data-i]');if(!el||mode!='d')return;const it=M.items[+el.dataset.i];if(it.t=='p'){const l=prompt('Nom du joueur :',it.l);if(l!=null){snap();it.l=l.slice(0,3);draw()}}else if(it.t=='txt'){const l=prompt('Texte :',it.s);if(l!=null){snap();it.s=l;draw()}}};
}
const TOOLS=[['sel','Déplacer'],['p_b','Joueur',{t:'p',c:'b',l:'A'}],['p_r','Adversaire',{t:'p',c:'r',l:'1'}],['p_j','Gardien/joker',{t:'p',c:'j',l:'G'}],['ball','Ballon',{t:'ball'}],['plot','Plot',{t:'plot'}],['piquet','Piquet',{t:'piquet'}],['mannequin','Mannequin',{t:'mannequin'}],['haie','Haie',{t:'haie'}],['cerceau','Cerceau',{t:'cerceau'}],['echelle','Échelle',{t:'echelle'}],['but','But',{t:'but'}],['zone','Zone'],['txt','Texte'],['gomme','Gomme']];
const ICO={sel:'<path d="M-4 -8L6 2L1 3L4 9L1 10L-2 4L-6 7z" fill="#333"/>',zone:'<rect x="-8" y="-6" width="16" height="12" fill="none" stroke="#1b3a73" stroke-dasharray="3 2"/>',txt:'<text y="5" font-size="14" font-weight="700" text-anchor="middle" fill="#333" font-family="serif">T</text>',gomme:'<path d="M-6 -6L6 6M6 -6L-6 6" stroke="#d63a2a" stroke-width="2.5"/>'};
const icon=(t,s)=>{const vb=t=='echelle'||t=='but'?'-32 -12 64 24':(t=='piquet'||t=='mannequin')?'-12 -17 24 24':'-12 -12 24 24';return `<svg viewBox="${vb}" width="${t=='echelle'||t=='but'?36:20}" height="20" style="vertical-align:middle">${s?shape(s):ICO[t]||''}</svg>`};
const HINTS={sel:'Glisse un élément pour le placer. Un ballon lâché près d\'un joueur se lie à lui. Clique un élément pour ses réglages.',zone:'Glisse pour dessiner une zone.',gomme:'Clique sur un élément pour le supprimer.',ball:'Clique sur le terrain, ou sur un joueur pour lui donner le ballon.'};
function setTool(t){tool=t;document.querySelectorAll('#tools button').forEach(b=>b.classList.toggle('on',b.dataset.t==t));ui()}
function props(){
 if(mode!='d'||sel==null||!M.items[sel])return'';const it=M.items[sel],i=sel;let h='';
 const rot=`<button onclick="rotSel(-15)">↺ 15°</button><button onclick="rotSel(15)">↻ 15°</button><button onclick="rotSel(90)">↻ 90°</button>`;
 if(it.t=='p')h=`<b>Joueur</b> Nom <input value="${esc2(it.l)}" maxlength="3" style="width:56px" onchange="snap();M.items[${i}].l=this.value;draw()"> Couleur <select onchange="snap();M.items[${i}].c=this.value;draw()">${[['b','Bleu'],['r','Rouge'],['j','Jaune']].map(([v,l])=>`<option value="${v}"${it.c==v?' selected':''}>${l}</option>`).join('')}</select> <button onclick="dupSel()">Dupliquer</button>`;
 else if(it.t=='ball')h=`<b>Ballon</b> ${it.o!=null?`lié à ${esc2(M.items[it.o]&&M.items[it.o].l)} <button onclick="snap();delete M.items[${i}].o;M.items[${i}].y+=14;draw()">Libérer</button>`:'libre (glisse-le sur un joueur pour le lier)'}`;
 else if(it.t=='txt')h=`<b>Texte</b> <input value="${esc2(it.s)}" onchange="snap();M.items[${i}].s=this.value;draw()"> ${rot}`;
 else h=`<b>${NOMS[it.t]||it.t}</b> ${ROTABLE.includes(it.t)?rot:''}`;
 return h+` <button onclick="snap();removeItem(${i});draw()">Supprimer</button>`}
function rotSel(d){if(sel==null)return;const it=M.items[sel];if(!ROTABLE.includes(it.t))return;snap();it.rot=((it.rot||0)+d+360)%360;draw()}
function dupSel(){const it=M.items[sel];snap();M.items.push({...cl(it),x:it.x+24,l:it.t=='p'?nextLabel(it.c):it.l});sel=M.items.length-1;draw()}
function tbar(){
 const n=M.temps.length;return (n?M.temps.map((T,j)=>`<button class="${j==cur?'on':''}" onclick="cur=${j};sel=null;draw()">Temps ${j+1}</button>`).join(''):'<span>Aucun temps : glisse un joueur ou le ballon pour créer le Temps 1.</span>')+
 ` <button onclick="snap();M.temps.splice(${n?cur+1:0},0,{moves:{}});cur=${n?cur+1:0};draw()">+ Nouveau temps</button>`+(n?` <button onclick="if(confirm('Supprimer le Temps ${cur+1} ?')){snap();M.temps.splice(cur,1);fixCur();draw()}">Supprimer ce temps</button>`:'')}
function ui(){
 $e('tabD').classList.toggle('on',mode=='d');$e('tabM').classList.toggle('on',mode=='m');$e('tabV').classList.toggle('on',mode=='v');
 $e('edbar').classList.toggle('hide',mode=='v');$e('tools').classList.toggle('hide',mode!='d');$e('visbar').classList.toggle('hide',mode!='v');$e('tbar').classList.toggle('hide',mode!='m');
 $e('hint').textContent=mode=='d'?(HINTS[tool]||'Clique sur le terrain pour placer.'):mode=='m'?'Glisse un joueur ou le ballon à sa nouvelle place : la flèche se crée seule (course, conduite si le joueur a le ballon, passe si tu lâches le ballon sur un joueur, tir dans le but). Tout ce qui bouge dans un même temps bouge en même temps. Tire le rond orange pour courber.':'';
 $e('tbar').innerHTML=mode=='m'?tbar():'';$e('props').innerHTML=props();const k=compte(M),l=Object.entries(k.mat);$e('compte').textContent=mode=='v'?'':`Sur le schéma : ${k.joueurs} joueur${k.joueurs>1?'s':''}`+(l.length?' · '+l.map(([n,q])=>q+' '+nomMat(n,q)).join(', '):'')}
function draw(){const box=$e('cvbox');if(mode=='v')box.innerHTML=render(M,{animOn:true,speed:+$e('vspeed').value});else{box.innerHTML=render(M,{editor:mode});bind()}ui()}
function setMode(m){mode=m;tmp=null;drag=null;if(m!='d')sel=null;fixCur();const b=$e('vpause');b.textContent='⏸ Pause';delete b.dataset.p;draw()}
let dimSnap=false;
function majDim(){const w=Math.max(1,+$e('dw').value||0),h=Math.max(1,+$e('dh').value||0);if(!+$e('dw').value||!+$e('dh').value)return;
 if(!dimSnap){snap();dimSnap=true}const of=field(M);M.w=w;M.h=h;remap(M,of,field(M));draw()}
// ---------- fiches perso ----------
function chargePerso(){try{return JSON.parse(localStorage.getItem('mesfiches')||'[]')}catch(e){return[]}}
function savePerso(a){try{localStorage.setItem('mesfiches',JSON.stringify(a))}catch(e){alert('Enregistrement local impossible : exporte la fiche en fichier.')}}
function ouvrirDlg(){const f=editingId?E.find(x=>x.id==editingId):null;const g=id=>$e(id);
 g('f_titre').value=f?.titre||'';g('f_theme').value=f?.theme||'échauffement';g('f_cats').value=(f?.categories||['U11','U13']).join(', ');g('f_niveau').value=f?.niveau||'débutant';
 g('f_duree').value=f?.duree_min||15;g('f_jmin').value=f?.joueurs.min||6;g('f_jmax').value=f?.joueurs.max||12;
 const k=compte(M);g('f_mat').value=Object.entries(k.mat).map(([n,q])=>q+' '+nomMat(n,q)).join(', ')||(f?f.materiel.map(m=>m.quantite+' '+m.nom).join(', '):'');if(!f){g('f_jmin').value=k.joueurs||6;g('f_jmax').value=k.joueurs||12}g('f_obj').value=f?.objectif||'';g('f_org').value=f?.organisation||'';g('f_dero').value=f?.deroulement||'';
 g('f_cons').value=(f?.consignes||[]).join('\n');g('f_var').value=(f?.variantes||[]).map(v=>v.nom+' : '+v.change).join('\n');$e('dlg').showModal()}
function enregistrer(ev){ev.preventDefault();const g=id=>$e(id).value.trim(),lines=s=>g(s).split('\n').map(x=>x.trim()).filter(Boolean),old=editingId?E.find(x=>x.id==editingId):null;
 const fiche={...(old||{}),id:editingId||'perso-'+Date.now().toString(36),perso:true,titre:g('f_titre').slice(0,40),theme:g('f_theme'),categories:g('f_cats').split(',').map(x=>x.trim()).filter(Boolean),public:old?.public||['filles','garçons'],niveau:g('f_niveau'),duree_min:+g('f_duree')||15,joueurs:{min:+g('f_jmin')||1,max:+g('f_jmax')||1},surface:old?.surface||(M.w+' x '+M.h+' m'),
  materiel:g('f_mat').split(',').map(x=>x.trim()).filter(Boolean).map(x=>{const m=x.match(/^(\d+)\s+(.*)$/);return m?{nom:m[2],quantite:+m[1]}:{nom:x,quantite:1}}),
  objectif:g('f_obj'),organisation:g('f_org'),deroulement:g('f_dero'),consignes:lines('f_cons'),
  variantes:lines('f_var').map(l=>{const [n,...r]=l.split(':');const ov=old?.variantes?.find(v=>v.nom==n.trim());return{nom:n.trim(),change:r.join(':').trim()||n.trim(),difficulte:ov?.difficulte||''}}),
  schema_modele:cl(M)};delete fiche.club;delete fiche.maj;delete fiche.schema_svg;
 const a=chargePerso().filter(x=>x.id!=fiche.id);a.push(fiche);savePerso(a);$e('dlg').close();editingId=fiche.id;majE();show('b')}
const hyd=e=>e.schema_modele?{...e,schema_svg:render(e.schema_modele,{animOn:true})}:e;
const aOrig=id=>window.EXERCICES.some(x=>x.id==id)||(window.CLUBF||[]).some(x=>x.id==id);
function majE(){const p=chargePerso(),ids=new Set(p.map(x=>x.id)),c=(window.CLUBF||[]).filter(x=>!ids.has(x.id)),cid=new Set(c.map(x=>x.id));
 E=window.EXERCICES.filter(x=>!ids.has(x.id)&&!cid.has(x.id)).map(hyd).concat(c.map(hyd),p.map(hyd));majFiltres();base();if(typeof seance=='function')seance()}
function modifierSchema(id){const f=E.find(x=>x.id==id);if(!f||!f.schema_modele)return;editingId=id;M=norm(f.schema_modele);$e('dw').value=M.w;$e('dh').value=M.h;sel=null;hist=[];redo=[];cur=0;show('e');setMode('d')}
function exporterFiche(id){const f=E.find(x=>x.id==id),o={...f};['perso','club','auteur','maj'].forEach(k=>delete o[k]);if(o.schema_modele)delete o.schema_svg;const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(o,null,2)],{type:'application/json'}));a.download=f.id+'.json';a.click()}
function supprimerPerso(id){if(confirm(aOrig(id)?'Rétablir la fiche d\'origine ?':'Supprimer cette fiche ?')){savePerso(chargePerso().filter(x=>x.id!=id));majE()}}
function initEditeur(){
 $e('tools').innerHTML=TOOLS.map(([t,l,s])=>`<button data-t="${t}" title="${l}">${icon(t,s)} ${l}</button>`).join('');
 document.querySelectorAll('#tools button').forEach(b=>b.onclick=()=>setTool(b.dataset.t));
 $e('dw').oninput=$e('dh').oninput=majDim;$e('dw').onblur=$e('dh').onblur=()=>{dimSnap=false};
 $e('undo').onclick=undo;$e('redo').onclick=redoF;
 $e('clear').onclick=()=>{if(confirm('Tout effacer ?')){snap();M.items=[];M.temps=[];sel=null;cur=0;draw()}};
 $e('tabD').onclick=()=>setMode('d');$e('tabM').onclick=()=>setMode('m');$e('tabV').onclick=()=>setMode('v');
 $e('vpause').onclick=()=>{const s=$e('cvbox').querySelector('svg'),b=$e('vpause');if(b.dataset.p){s.unpauseAnimations();b.textContent='⏸ Pause';delete b.dataset.p}else{s.pauseAnimations();b.textContent='▶ Lecture';b.dataset.p=1}};
 $e('vrestart').onclick=()=>{$e('vpause').textContent='⏸ Pause';delete $e('vpause').dataset.p;draw()};
 $e('vspeed').onchange=()=>draw();
 $e('dlsvg').onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([render(M,{animOn:true})],{type:'image/svg+xml'}));a.download='schema.svg';a.click()};
 $e('save').onclick=ouvrirDlg;$e('fdlg').onsubmit=enregistrer;$e('cancel').onclick=()=>$e('dlg').close();
 $e('nouveau').onclick=()=>{editingId=null;M=blank();$e('dw').value=30;$e('dh').value=20;sel=null;hist=[];redo=[];cur=0;setMode('d')};
 document.addEventListener('keydown',ev=>{if($e('editeur').classList.contains('hide')||/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName))return;
  if((ev.ctrlKey||ev.metaKey)&&ev.key.toLowerCase()=='z'){ev.preventDefault();ev.shiftKey?redoF():undo();return}
  if((ev.ctrlKey||ev.metaKey)&&ev.key.toLowerCase()=='y'){ev.preventDefault();redoF();return}
  if(mode=='d'&&sel!=null&&(ev.key=='Delete'||ev.key=='Backspace')){ev.preventDefault();snap();removeItem(sel);draw()}
  if(mode=='d'&&sel!=null&&(ev.key=='r'||ev.key=='R'))rotSel(ev.shiftKey?-90:90)});
 setTool('sel');setMode('d');majE()}
initEditeur();
