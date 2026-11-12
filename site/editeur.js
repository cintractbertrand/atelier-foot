/* Éditeur de terrain — Atelier Foot
   Format v3 : items = situation de départ ; temps = [{moves:{indice:{x,y,c?,o?}}}].
   Dans un temps, tout bouge en même temps. Le type de flèche est déduit :
   joueur sans ballon = course, joueur avec ballon = conduite, ballon vers joueur = passe, ballon vers but = tir. */
const NAVY='#1b3a73',RED='#d63a2a',GOLD='#e8b923',PLOT='#d9a406',OFF=[7,4.5],V=45,SC=.75;// SC : taille des objets sur le terrain (demande de Bertrand : plus petits)
const DEFS='<defs>'+[['ap','#222'],['ad',PLOT],['ar',RED],['ag','#999']].map(([id,c])=>`<marker id="${id}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="${c}"/></marker>`).join('')+'</defs>';
const blank=()=>{const m={v:3,w:30,h:20,items:[],temps:[]};const f=field(m);m.fr=[f.x,f.y,f.w,f.h];return m};
let M=blank(),tool=null,sel=null,selG=[],box=null,drag=null,tmp=null,hist=[],redo=[],editingId=null,varEdit=null,mode='d',cur=0;
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
 m.items.forEach(it=>{it.x=X(it.x);it.y=Y(it.y);if(it.t=='zone'){it.w=R(it.w*sx);it.h=R(it.h*sy)}if(it.t=='ligne'){it.dx=R(it.dx*sx);it.dy=R(it.dy*sy)}});
 m.temps.forEach(T=>Object.values(T.moves||{}).forEach(q=>{q.x=X(q.x);q.y=Y(q.y);if(q.c)q.c=[X(q.c[0]),Y(q.c[1])]}))}
const EQUIP=['plot','but','haie','cerceau','piquet','mannequin','echelle','txt','ligne'],ROTABLE=['but','plot','txt','haie','piquet','echelle'];
const NOMS={p:'Joueur',ball:'Ballon',plot:'Plot',but:'But',haie:'Haie',cerceau:'Cerceau',piquet:'Piquet',mannequin:'Mannequin',echelle:'Échelle de rythme',txt:'Texte',zone:'Zone',ligne:'Ligne'};
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
 if(it.t=='ligne')return `<line x2="${it.dx}" y2="${it.dy}" stroke="transparent" stroke-width="14"/><line x2="${it.dx}" y2="${it.dy}" stroke="${NAVY}" stroke-width="2" stroke-dasharray="6 4"/>`;
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
   sg[b]={a:pos[b],b:np[b],c:q.c||null,kind:tir?'tir':'passe',from:own[b]!=null?pos[own[b]]:pos[b],to:no[b]!=null?np[no[b]]:np[b],fromP:own[b]!=null,toP:no[b]!=null,rcv:no[b]}});
  mob.forEach(b=>{if(I[b].t=='ball'&&!mv[b]&&own[b]!=null&&sg[own[b]]){const g=sg[own[b]];np[b]=[np[own[b]][0]+OFF[0],np[own[b]][1]+OFF[1]];sg[b]={a:pos[b],b:np[b],c:g.c?[g.c[0]+OFF[0],g.c[1]+OFF[1]]:null,kind:'suivi',own:own[b]}}});
  segs.push(sg);pos=np;own=no;states.push({pos:cl(pos),own:{...own}})});
 return{states,segs,mob}}
function qpts(a,c,b,n=24){const o=[];for(let k=0;k<=n;k++){const t=k/n,u=1-t;o.push(c?[u*u*a[0]+2*u*t*c[0]+t*t*b[0],u*u*a[1]+2*u*t*c[1]+t*t*b[1]]:[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t])}return o}
function plen(p){let l=0;for(let k=1;k<p.length;k++)l+=dist(p[k],p[k-1]);return l}
const segLen=g=>plen(qpts(g.a,g.c,g.b,16)),vel=g=>(g.kind=='passe'||g.kind=='tir')?V*1.6:V;
// Durée propre d'un mouvement ; le temps dure autant que le plus long, et tous les mouvements du temps
// commencent et finissent ensemble (demande de Bertrand), avec le même rythme.
function segDur(sg,i,n=0){const g=sg[i];if(!g)return 0;if(n>4)return segLen(g)/vel(g);
 if(g.kind=='suivi'&&sg[g.own])return segDur(sg,g.own,n+1);let d=segLen(g)/vel(g);
 if(g.rcv!=null&&sg[g.rcv])d=Math.max(d,segDur(sg,g.rcv,n+1));return d}
function timing(S){const durs=S.segs.map(sg=>Math.max(1,...Object.keys(sg).map(i=>segDur(sg,+i))));let t=0;const starts=durs.map(d=>{const s=t;t+=d+.3;return s});return{starts,durs,T:S.segs.length?t+1.6:0}}
function motion(S,TM,i,speed){
 const p0=S.states[0].pos[i];let d='M0 0',cum=0,keys=[[0,0]],spl=[],last=p0;const LIN='0 0 1 1';
 S.segs.forEach((sg,k)=>{const g=sg[i];if(!g)return;const t0=TM.starts[k],L=segLen(g);
  if(keys[keys.length-1][0]<t0-1e-6){keys.push([t0,cum]);spl.push(LIN)}
  const rx=v=>R(v[0]-p0[0])+' '+R(v[1]-p0[1]);d+=g.c?` Q${rx(g.c)} ${rx(g.b)}`:` L${rx(g.b)}`;cum+=L;keys.push([t0+TM.durs[k],cum]);spl.push('.45 0 .55 1');last=g.b});
 if(cum<1)return'';
 if(TM.T-1>keys[keys.length-1][0]){keys.push([TM.T-1,cum]);spl.push(LIN)}d+=' L0 0';cum+=dist(last,p0);keys.push([TM.T,cum]);spl.push('.45 0 .55 1');
 return `<animateMotion dur="${(TM.T/(speed||1)).toFixed(2)}s" repeatCount="indefinite" calcMode="spline" keySplines="${spl.join(';')}" keyTimes="${keys.map(k=>(k[0]/TM.T).toFixed(4)).join(';')}" keyPoints="${keys.map(k=>(k[1]/cum).toFixed(4)).join(';')}" path="${d}"/>`}
// ---------- flèches ----------
function trim(p,r,end){const q=end?p.slice().reverse():p.slice(),o=q[0];while(q.length>2&&dist(q[0],o)<r)q.shift();return end?q.reverse():q}
function wavy(p){const o=[],L=plen(p);let s=0;for(let k=1;k<p.length;k++){const a=p[k-1],b=p[k],l=dist(a,b)||1,nx=-(b[1]-a[1])/l,ny=(b[0]-a[0])/l;for(let u=0;u<l;u+=2){const amp=3*Math.min(1,(L-s-u)/12);const w=amp*Math.sin((s+u)/3);o.push([a[0]+(b[0]-a[0])*u/l+nx*w,a[1]+(b[1]-a[1])*u/l+ny*w])}s+=l}o.push(p[p.length-1]);return o}
function arrow(g,n,op,an){
 let p=qpts(g.from,g.c,g.to,30);if(g.fromP)p=trim(p,10,false);if(g.toP)p=trim(p,10,true);if(plen(p)<6)return'';
 if(g.kind=='conduite')p=wavy(p);
 const st={course:`stroke="${PLOT}" stroke-width="2" stroke-dasharray="5 4" marker-end="url(#ad)"`,conduite:`stroke="#222" stroke-width="1.6" marker-end="url(#ap)"`,passe:`stroke="#222" stroke-width="2" marker-end="url(#ap)"`,tir:`stroke="${RED}" stroke-width="3" marker-end="url(#ar)"`}[g.kind];
 let s=`<polyline points="${p.map(q=>R(q[0])+','+R(q[1])).join(' ')}" fill="none" ${st}${op<1?` opacity="${op}"`:''}/>`;
 if(n&&plen(p)>22){const m=p[Math.floor(p.length*.4)];s+=`<g${op<1?` opacity="${op}"`:''}><circle cx="${R(m[0])}" cy="${R(m[1])}" r="5" fill="#fff" stroke="${NAVY}"/><text x="${R(m[0])}" y="${R(m[1]+2.5)}" font-size="7" font-weight="700" text-anchor="middle" fill="${NAVY}" font-family="sans-serif">${n}</text></g>`}
if(an){const T=an.T,c=t=>Math.min(T,Math.max(0,t)),s0=an.s,e0=an.s+an.d,ts=[0,s0,s0+.25,e0,e0+.5,T].map(c);for(let q=1;q<ts.length;q++)ts[q]=Math.max(ts[q],ts[q-1]);
  s=`<g opacity=".3"><animate attributeName="opacity" dur="${(T/an.sp).toFixed(2)}s" repeatCount="indefinite" keyTimes="${ts.map(t=>R(t/T*1e4)/1e4).join(';')}" values=".3;.3;1;1;.3;.3"/>${s}</g>`}
 return s}
// ---------- demi-terrain (cage en haut) ----------
// Tracés en mètres : foot à 11 si le terrain fait au moins 55 m de large, sinon foot à 8. Ce qui dépasse est coupé.
function demi(m,f){const k=f.w/m.w,ky=f.h/m.h,cx=m.w/2,o=m.w>=55?{sr:[40.3,16.5],sb:[18.3,5.5],pen:11,rc:9.15}:{sr:[26,13],sb:[12,5],pen:9,rc:6};
 const X=x=>R(x*k),Y=y=>R(y*ky),rect=(w,h)=>`<rect x="${X(cx-w/2)}" y="0" width="${X(w)}" height="${Y(h)}"/>`;
 return `<svg x="${R(f.x)}" y="${R(f.y)}" width="${R(f.w)}" height="${R(f.h)}" overflow="hidden"><g fill="none" stroke="${NAVY}" stroke-width="1" opacity=".55">${rect(...o.sr)}${rect(...o.sb)}`+
 `<path d="M${X(cx-o.rc*.8)} ${Y(o.sr[1])} A${X(o.rc)} ${Y(o.rc)} 0 0 0 ${X(cx+o.rc*.8)} ${Y(o.sr[1])}"/>`+
 `<ellipse cx="${X(cx)}" cy="${Y(m.h)}" rx="${X(o.rc)}" ry="${Y(o.rc)}"/></g><circle cx="${X(cx)}" cy="${Y(o.pen)}" r="1.4" fill="${NAVY}" opacity=".55"/></svg>`}
function setFond(v){snap();const of=field(M);M.fond=v||undefined;if(v=='demi'){if(M.w==30&&M.h==20){M.w=40;M.h=30}remap(M,of,field(M));const f=field(M);
  if(!M.items.some(i=>i.t=='but'&&Math.abs(i.y-f.y)<15))M.items.push({t:'but',x:R(f.x+f.w/2),y:R(f.y)})}else remap(M,of,field(M));
 $e('dw').value=M.w;$e('dh').value=M.h;draw()}
// ---------- tourner / retourner tout le schéma (départ et mouvements) ----------
// fixe : les cages et le terrain restent en place, seuls joueurs, matériel et trajets tournent autour du centre (en mètres).
function transfo(quart,fixe){const of=field(M),old={w:M.w,h:M.h};if(quart&&!fixe){M.w=old.h;M.h=old.w}const nf=field(M);
 const P=fixe&&quart?(x,y)=>{const mx=(x-of.x)/of.w*M.w-M.w/2,my=(y-of.y)/of.h*M.h-M.h/2,cl2=(v,a)=>Math.min(a,Math.max(0,v));return[R(of.x+cl2(M.w/2-my,M.w)/M.w*of.w),R(of.y+cl2(M.h/2+mx,M.h)/M.h*of.h)]}
  :(x,y)=>{const u=(x-of.x)/of.w,v=(y-of.y)/of.h,[a,b]=quart?[1-v,u]:[1-u,v];return[R(nf.x+a*nf.w),R(nf.y+b*nf.h)]};
 M.items.forEach(it=>{if(fixe&&it.t=='but')return;if(it.t=='zone'){const p1=P(it.x,it.y),p2=P(it.x+it.w,it.y+it.h);it.x=Math.min(p1[0],p2[0]);it.y=Math.min(p1[1],p2[1]);it.w=R(Math.abs(p2[0]-p1[0]));it.h=R(Math.abs(p2[1]-p1[1]));return}
  if(it.t=='ligne'){const e=P(it.x+it.dx,it.y+it.dy),a=P(it.x,it.y);it.x=a[0];it.y=a[1];it.dx=R(e[0]-a[0]);it.dy=R(e[1]-a[1]);return}
  [it.x,it.y]=P(it.x,it.y);if(['but','haie','echelle'].includes(it.t))it.rot=(((it.rot||0)+(quart?90:(180-2*(it.rot||0))))%360+360)%360});
 M.temps.forEach(T=>Object.values(T.moves||{}).forEach(q=>{[q.x,q.y]=P(q.x,q.y);if(q.c)q.c=P(q.c[0],q.c[1])}));M.fr=[nf.x,nf.y,nf.w,nf.h]}
function tourner(){snap();transfo(true,M.fond=='demi'||M.items.some(i=>i.t=='but'));$e('dw').value=M.w;$e('dh').value=M.h;sel=null;draw()}
function miroir(){snap();transfo(false,M.fond=='demi'||M.items.some(i=>i.t=='but'));sel=null;draw()}
function gridSvg(m,f,g){let d='';for(let v=g;v<m.w;v+=g){const x=R(f.x+v*f.w/m.w);d+=`M${x} ${R(f.y)}V${R(f.y+f.h)}`}for(let v=g;v<m.h;v+=g){const y=R(f.y+v*f.h/m.h);d+=`M${R(f.x)} ${y}H${R(f.x+f.w)}`}return `<path d="${d}" stroke="${NAVY}" stroke-width=".4" opacity=".25" fill="none" style="pointer-events:none"/>`}
// ---------- rendu ----------
function render0(m,o={}){
 m=norm(m);const S=simulate(m),I=m.items,f=field(m),ed=o.editor,nT=S.segs.length;
 const k=Math.min(cur,Math.max(0,nT-1)),st=ed=='m'?S.states[Math.min(k+1,nT)]:S.states[0],before=ed=='m'&&nT?S.states[k]:null;
 const TM=o.animOn?timing(S):null,P=i=>(I[i].t=='p'||I[i].t=='ball')?st.pos[i]:[I[i].x,I[i].y];
 let b=`<rect x="1" y="1" width="298" height="198" rx="6" fill="#e6eefa" stroke="${NAVY}"/><rect x="${R(f.x)}" y="${R(f.y)}" width="${R(f.w)}" height="${R(f.h)}" fill="#f4f8fd" stroke="${NAVY}" stroke-width="1.5"/>`+(m.fond=='demi'?demi(m,f):'')+(o.grid?gridSvg(m,f,o.grid):'');
 const di=i=>ed=='d'||(ed=='m'&&(I[i].t=='p'||I[i].t=='ball'))?` data-i="${i}" style="cursor:grab"`:'';
 I.forEach((it,i)=>{if(it.t=='zone')b+=`<rect${ed=='d'?` data-i="${i}" style="cursor:grab"`:''} x="${it.x}" y="${it.y}" width="${it.w}" height="${it.h}" fill="${ed?'#1b3a7310':'none'}" stroke="${NAVY}" stroke-dasharray="6 4"/>`});
 S.segs.forEach((sg,j)=>{const op=ed=='d'?.25:(ed=='m'&&j!=k?.22:1);Object.values(sg).forEach(g=>{if(g.kind!='suivi')b+=arrow(g,ed&&nT>1?j+1:0,op,TM&&nT>1?{s:TM.starts[j],d:TM.durs[j],T:TM.T,sp:o.speed||1}:null)})});
 if(before)S.mob.forEach(i=>{if(dist(before.pos[i],st.pos[i])>2)b+=`<g transform="translate(${R(before.pos[i][0])} ${R(before.pos[i][1])})" opacity=".3" style="pointer-events:none"><g transform="scale(${SC})">${shape(I[i])}</g></g>`});
 const draw1=(it,i)=>{const p=P(i);let inner=['zone','ligne','txt'].includes(it.t)?shape(it):`<g transform="scale(${SC})">${shape(it)}</g>`;if(TM&&(it.t=='p'||it.t=='ball')){const mo=motion(S,TM,i,o.speed);if(mo)inner=`<g>${inner}${mo}</g>`}
  return `<g transform="translate(${R(p[0])} ${R(p[1])})${it.rot?` rotate(${it.rot})`:''}"${di(i)}>${ed&&(sel===i||selG.includes(i))?'<circle r="12" fill="none" stroke="#e8731a" stroke-dasharray="3 2"/>':''}${di(i)?`<circle r="${it.t=='ball'?6:12}" fill="transparent"/>`:''}${inner}</g>`};
 [...EQUIP,'p','ball'].forEach(t=>I.forEach((it,i)=>{if(it.t==t)b+=draw1(it,i)}));
 if(ed=='m'&&nT)Object.keys(S.segs[k]).forEach(s=>{const g=S.segs[k][s];if(g.kind=='suivi')return;const h=g.c||[(g.from[0]+g.to[0])/2,(g.from[1]+g.to[1])/2];b+=`<circle data-h="${s}" cx="${R(h[0])}" cy="${R(h[1])}" r="5" fill="#fff" stroke="#e8731a" stroke-width="2" style="cursor:move"><title>Tirer pour courber, double-clic pour redresser</title></circle>`});
 const lab=(x,y,t,r)=>{const tr=r?` transform="rotate(-90 ${x} ${y})"`:'';return `<rect x="${x-17}" y="${y-8}" width="34" height="13" rx="3" fill="#fff"${tr}/><text x="${x}" y="${y+3}" font-size="10" font-weight="700" fill="${NAVY}" text-anchor="middle" font-family="sans-serif"${tr}>${t}</text>`};
 const x1=R(f.x),x2=R(f.x+f.w),y1=R(f.y),y2=R(f.y+f.h);
 b+=`<g stroke="${NAVY}" stroke-width="1.2" fill="none"><line x1="${x1}" y1="8" x2="${x2}" y2="8"/><line x1="${x1}" y1="4" x2="${x1}" y2="12"/><line x1="${x2}" y1="4" x2="${x2}" y2="12"/><line x1="292" y1="${y1}" x2="292" y2="${y2}"/><line x1="288" y1="${y1}" x2="296" y2="${y1}"/><line x1="288" y1="${y2}" x2="296" y2="${y2}"/></g>`+lab(R((f.x*2+f.w)/2),8,m.w+' m')+lab(292,R((f.y*2+f.h)/2),m.h+' m',1);
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200"${ed?' id="cv" style="touch-action:none;user-select:none"':''}>${DEFS}${b}</svg>`}
function render(m,o={}){return uniq2(render0(m,o))}
// ---------- édition ----------
function snap(){hist.push(JSON.stringify(M));if(hist.length>80)hist.shift();redo=[]}
function undo(){if(hist.length){redo.push(JSON.stringify(M));M=JSON.parse(hist.pop());sel=null;selG=[];fixCur();draw()}}
function redoF(){if(redo.length){hist.push(JSON.stringify(M));M=JSON.parse(redo.pop());sel=null;selG=[];fixCur();draw()}}
function fixCur(){cur=Math.max(0,Math.min(cur,M.temps.length-1))}
function pt(ev){const s=$e('cv'),p=s.createSVGPoint();p.x=ev.clientX;p.y=ev.clientY;const q=p.matrixTransform(s.getScreenCTM().inverse());return[Math.round(q.x),Math.round(q.y)]}
function nextLabel(c){const n=M.items.filter(i=>i.t=='p'&&i.c==c).length;return c=='r'?String(n+1):c=='j'?'G':String.fromCharCode(65+n%26)}
function nearP(P,x,y,r,skip){let best=null,bd=r;M.items.forEach((it,i)=>{if(it.t=='p'&&i!==skip){const d=Math.hypot(P[i][0]-x,P[i][1]-y);if(d<bd){bd=d;best=i}}});return best}
function removeItem(i){M.items.splice(i,1);const sh=j=>j==null?null:(j==i?null:(j>i?j-1:j));
 M.items.forEach(it=>{if(it.o!=null)it.o=sh(it.o)});
 M.temps.forEach(T=>{const n={};Object.keys(T.moves||{}).forEach(s=>{const j=+s;if(j==i)return;const q=T.moves[s];if(q.o!=null)q.o=sh(q.o);n[j>i?j-1:j]=q});T.moves=n});sel=null}
// Aimant : un joueur lâché près d'un plot (piquet, mannequin, haie) se colle juste à côté ; dans un cerceau, au centre.
const AIM=['plot','piquet','mannequin','haie','cerceau'];
function aimant(x,y){let best=null,bd=16;M.items.forEach(it=>{if(AIM.includes(it.t)){const d=Math.hypot(it.x-x,it.y-y);if(d<bd){bd=d;best=it}}});
 if(!best)return[x,y];if(best.t=='cerceau')return[best.x,best.y];const d=bd||1,ux=bd>.5?(x-best.x)/d:-.7,uy=bd>.5?(y-best.y)/d:.7;return[R(best.x+ux*9),R(best.y+uy*9)]}
// Grille aimantée (idée GeoGebra) : réglage de l'appareil, invisible sur les fiches.
let GRID=1;try{const g=localStorage.getItem('grille1');if(g!=null)GRID=+g||0}catch(e){}// grille 1 m par défaut (demande de Bertrand, 12/11/2026)
function setGrille(v){GRID=+v||0;try{localStorage.setItem('grille1',GRID)}catch(e){}draw()}
function grille(x,y){if(!GRID)return[x,y];const f=field(M),kx=f.w/M.w,ky=f.h/M.h,c=(v,o,k,L)=>R(o+Math.min(L,Math.max(0,Math.round((v-o)/k/GRID)*GRID))*k);return[c(x,f.x,kx,M.w),c(y,f.y,ky,M.h)]}
function cale(x,y,joueur){if(joueur){const a=aimant(x,y);if(a[0]!=x||a[1]!=y)return a}return grille(x,y)}
function bind(){
 const s=$e('cv');
 s.onpointerdown=ev=>{const [x,y]=pt(ev),h=ev.target.closest('[data-h]'),el=ev.target.closest('[data-i]'),i=el?+el.dataset.i:null;s.setPointerCapture(ev.pointerId);
  if(DP&&mode=='d'){const g=ev.target.closest('[data-dp]');if(g){drag={k:'dp',w:g.dataset.dp,x,y,C:DP.C.slice(),L:DP.L,a:DP.a};return}if(i==null)return;DP=null}
  if(mode=='m'){
   if(h){snap();drag={k:'curve',i:+h.dataset.h};return}
   if(i==null){if(sel!=null){sel=null;draw()}return}if(!M.temps.length){M.temps.push({moves:{}});cur=0}
   snap();sel=i;drag={k:'mv',i,x0:x,y0:y,moved:false};return}
  if(tool=='ball'&&i!=null&&M.items[i].t=='p'){snap();const p=M.items[i];M.items.push({t:'ball',x:p.x+OFF[0],y:p.y+OFF[1],o:i});sel=M.items.length-1;draw();return}
  if(i!=null&&selG.includes(i)){const o={};selG.forEach(j=>o[j]=[M.items[j].x,M.items[j].y]);drag={k:'g',x,y,o,s:false};return}
  if(i!=null&&M.items[i].gr){const g=M.items[i].gr;selG=M.items.map((o,j)=>o.gr==g?j:-1).filter(j=>j>=0);sel=null;const o={};selG.forEach(j=>o[j]=[M.items[j].x,M.items[j].y]);drag={k:'g',x,y,o,s:false};draw();return}
  selG=[];
  if(i!=null){sel=i;const it=M.items[i],o=cl(it);if(it.t=='ball'&&isP(M,it.o)){const q=M.items[it.o];o.x=q.x+OFF[0];o.y=q.y+OFF[1]}drag={k:'d',i,x,y,o,s:false};draw();return}
  if(!tool){sel=null;box={x1:x,y1:y,x2:x,y2:y};return}
  if(tool=='zone'||tool=='ligne'){tmp={x1:x,y1:y,x2:x,y2:y,k:tool};return}
  snap();{const [x,y]=cale(...pt(ev),tool.startsWith('p_'));
  if(tool.startsWith('p_')){const c=tool[2];M.items.push({t:'p',c,l:nextLabel(c),x,y})}
  else if(tool=='txt'){const t=prompt('Texte :');if(!t){hist.pop();return}M.items.push({t:'txt',s:t,x,y})}
  else if(tool=='ball')M.items.push({t:'ball',x,y});
  else M.items.push({t:tool,x,y});}
  sel=M.items.length-1;if(ONCE.includes(tool))setTool(null);draw()};
 s.onpointermove=ev=>{const [x,y]=pt(ev);
  if(drag&&drag.k=='dp'){const C=drag.C;if(drag.w=='b')DP.C=[drag.C[0]+x-drag.x,drag.C[1]+y-drag.y];
   else if(drag.w=='s'){const r0=Math.max(3,Math.hypot(drag.x-C[0],drag.y-C[1]));DP.L=Math.max(1,Math.min(60,Math.round(drag.L*Math.hypot(x-C[0],y-C[1])/r0*2)/2))}
   else{const d=(Math.atan2(y-C[1],x-C[0])-Math.atan2(drag.y-C[1],drag.x-C[0]))*180/Math.PI;DP.a=((Math.round((drag.a+d)/5)*5)%360+360)%360}
   dpMaj();return}
  if(drag&&drag.k=='curve'){const T=M.temps[cur],q=T&&T.moves[drag.i];if(q){q.c=[x,y];draw()}else{const S=simulate(M),g=S.segs[cur]&&S.segs[cur][drag.i];if(g&&g.kind=='conduite'){}}return}
  if(drag&&drag.k=='mv'){if(!drag.moved&&Math.hypot(x-drag.x0,y-drag.y0)<4)return;drag.moved=true;const T=M.temps[cur];T.moves=T.moves||{};const q=T.moves[drag.i]||{};const g=cale(x,y,M.items[drag.i].t=='p');T.moves[drag.i]={x:g[0],y:g[1],...(M.items[drag.i].t=='ball'?{o:null}:{})};if(q.c&&M.items[drag.i].t=='p')delete T.moves[drag.i].c;draw();return}
  if(drag&&drag.k=='g'){const dx=x-drag.x,dy=y-drag.y;if(!drag.s){if(Math.hypot(dx,dy)<3)return;snap();drag.s=true}selG.forEach(j=>{const it=M.items[j];if(it.t=='ball'&&isP(M,it.o)&&selG.includes(it.o))return;if(it.t=='ball'&&it.o!=null)delete it.o;it.x=drag.o[j][0]+dx;it.y=drag.o[j][1]+dy});draw();return}
  if(box){box.x2=x;box.y2=y;const p=$e('prev');if(p)p.remove();s.insertAdjacentHTML('beforeend',`<rect id="prev" x="${Math.min(box.x1,box.x2)}" y="${Math.min(box.y1,box.y2)}" width="${Math.abs(box.x2-box.x1)}" height="${Math.abs(box.y2-box.y1)}" fill="#e8b92322" stroke="#e8731a" stroke-dasharray="3 2"/>`);return}
  if(drag&&drag.k=='d'){const it=M.items[drag.i],o=drag.o,dx=x-drag.x,dy=y-drag.y;if(!drag.s){if(Math.hypot(dx,dy)<3)return;snap();drag.s=true}if(it.t=='ball'&&it.o!=null)delete it.o;it.x=o.x+dx;it.y=o.y+dy;if(!['zone','ligne'].includes(it.t))[it.x,it.y]=cale(it.x,it.y,it.t=='p');draw();return}
  if(tmp){tmp.x2=x;tmp.y2=y;if(tmp.k=='ligne'){const dx=x-tmp.x1,dy=y-tmp.y1,k=Math.tan(10*Math.PI/180);if(Math.abs(dy)<=k*Math.abs(dx))tmp.y2=tmp.y1;else if(Math.abs(dx)<=k*Math.abs(dy))tmp.x2=tmp.x1}// presque horizontale ou verticale : on la redresse
   const p=$e('prev');if(p)p.remove();s.insertAdjacentHTML('beforeend',tmp.k=='ligne'?`<line id="prev" x1="${tmp.x1}" y1="${tmp.y1}" x2="${tmp.x2}" y2="${tmp.y2}" stroke="${NAVY}" stroke-width="2" stroke-dasharray="6 4"/>`:`<rect id="prev" x="${Math.min(tmp.x1,tmp.x2)}" y="${Math.min(tmp.y1,tmp.y2)}" width="${Math.abs(tmp.x2-tmp.x1)}" height="${Math.abs(tmp.y2-tmp.y1)}" fill="none" stroke="${NAVY}" stroke-dasharray="6 4"/>`)}};
 s.onpointerup=ev=>{const [x,y]=pt(ev);
  if(drag&&drag.k=='dp'){drag=null;return}
  if(drag&&drag.k=='mv'){const i=drag.i,T=M.temps[cur];
   if(!drag.moved){hist.pop()}else{const S=simulate({...M,temps:M.temps.slice(0,cur)}),start=S.states[S.states.length-1];
    if(M.items[i].t=='ball'){const Pend=simulate(M).states[cur+1].pos,o=nearP(Pend,x,y,20);
     if(o!=null){T.moves[i]={x:Pend[o][0]+OFF[0],y:Pend[o][1]+OFF[1],o};if(start.own[i]===o)delete T.moves[i]}
     else if(Math.hypot(x-start.pos[i][0],y-start.pos[i][1])<6)delete T.moves[i]}
    else if(Math.hypot(x-start.pos[i][0],y-start.pos[i][1])<6)delete T.moves[i]}
   drag=null;draw();return}
  if(box){const b=box;box=null;const x0=Math.min(b.x1,b.x2),x1=Math.max(b.x1,b.x2),y0=Math.min(b.y1,b.y2),y1=Math.max(b.y1,b.y2);
   if(x1-x0>6||y1-y0>6){const P=simulate(M).states[0].pos;selG=[];M.items.forEach((it,j)=>{const q=(it.t=='p'||it.t=='ball')?P[j]:[it.x,it.y];if(q[0]>=x0&&q[0]<=x1&&q[1]>=y0&&q[1]<=y1)selG.push(j)});if(selG.length==1){sel=selG[0];selG=[]}}
   drag=null;draw();return}
  if(drag&&drag.k=='g'){drag=null;draw();return}
  if(drag&&drag.k=='d'&&drag.s){const it=M.items[drag.i];if(it.t=='ball'&&it.o==null){const P={};M.items.forEach((q,j)=>P[j]=[q.x,q.y]);const o=nearP(P,it.x,it.y,16);if(o!=null)it.o=o}}
  drag=null;
  if(tmp){const t=tmp;tmp=null;if(Math.hypot(t.x2-t.x1,t.y2-t.y1)>6){snap();M.items.push(t.k=='ligne'?{t:'ligne',x:t.x1,y:t.y1,dx:t.x2-t.x1,dy:t.y2-t.y1}:{t:'zone',x:Math.min(t.x1,t.x2),y:Math.min(t.y1,t.y2),w:Math.abs(t.x2-t.x1),h:Math.abs(t.y2-t.y1)});sel=M.items.length-1;if(ONCE.includes(t.k))setTool(null)}}
  draw()};
 s.ondblclick=ev=>{const h=ev.target.closest('[data-h]');if(h&&mode=='m'){const q=M.temps[cur]&&M.temps[cur].moves[+h.dataset.h];if(q&&q.c){snap();delete q.c;draw()}return}
  const el=ev.target.closest('[data-i]');if(!el||mode!='d')return;const it=M.items[+el.dataset.i];if(it.t=='p'){const l=prompt('Nom du joueur :',it.l);if(l!=null){snap();it.l=l.slice(0,3);draw()}}else if(it.t=='txt'){const l=prompt('Texte :',it.s);if(l!=null){snap();it.s=l;draw()}}};
}
const TOOLS=[['p_b','Joueur',{t:'p',c:'b',l:'A'}],['p_r','Adversaire',{t:'p',c:'r',l:'1'}],['p_j','Gardien',{t:'p',c:'j',l:'G'}],['ball','Ballon',{t:'ball'}],['plot','Plot',{t:'plot'}],['piquet','Piquet',{t:'piquet'}],['cerceau','Cerceau',{t:'cerceau'}],['haie','Haie',{t:'haie'}],['mannequin','Mannequin',{t:'mannequin'}],['echelle','Échelle',{t:'echelle'}],['but','But',{t:'but'}],['zone','Zone'],['ligne','Ligne'],['txt','Texte']];
// Ces éléments se posent un par un ; les autres restent actifs pour en poser plusieurs à la suite.
const ONCE=['but','echelle','txt','zone','ligne'];
const ICO={ligne:'<line x1="-9" y1="6" x2="9" y2="-6" stroke="#1b3a73" stroke-width="2" stroke-dasharray="3 2"/>',zone:'<rect x="-8" y="-6" width="16" height="12" fill="none" stroke="#1b3a73" stroke-dasharray="3 2"/>',txt:'<text y="5" font-size="14" font-weight="700" text-anchor="middle" fill="#333" font-family="serif">T</text>'};
const icon=(t,s)=>{const vb=t=='echelle'||t=='but'?'-32 -12 64 24':(t=='piquet'||t=='mannequin')?'-12 -17 24 24':'-12 -12 24 24';return `<svg viewBox="${vb}" width="${t=='echelle'||t=='but'?40:24}" height="24">${s?shape(s):ICO[t]||''}</svg>`};
function hintD(){const nom=(TOOLS.find(x=>x[0]==tool)||[])[1];
 if(!tool)return sel!=null?'Glisse l\'élément pour le placer, ou règle-le avec ses boutons.':'Choisis un élément ci-dessus, puis touche le terrain pour le poser. Glisse un élément pour le déplacer, ou entoure-en plusieurs avec ton doigt pour les bouger ensemble.';
 if(tool=='ball')return'Touche un joueur pour lui donner le ballon, ou le terrain pour un ballon libre.';
 if(tool=='zone')return'Glisse ton doigt sur le terrain pour tracer la zone.';
 if(tool=='ligne')return'Glisse ton doigt sur le terrain pour tracer une ligne (couloir, tiers…).';
 if(ONCE.includes(tool))return'Touche le terrain pour poser : '+nom.toLowerCase()+'.';
 return'Touche le terrain à chaque endroit où poser un '+nom.toLowerCase()+'. Re-touche le bouton pour arrêter.'}
function setTool(t){tool=t;selG=[];document.querySelectorAll('#tools button').forEach(b=>b.classList.toggle('on',b.dataset.t==t));if(t)sel=null;draw()}
function props(){
 if(mode=='d'&&selG.length)return`<b>${selG.length} éléments</b> <button onclick="dupSel()">+ Copier (avec leurs trajets)</button> <button class="del" onclick="suppSel()">🗑 Supprimer</button> <button onclick="selG=[];draw()">Désélectionner</button>${selG.some(j=>M.items[j]&&M.items[j].gr)?' <button onclick="degrouper()" title="Pour bouger un seul élément de la forme">✂ Séparer la forme</button>':''}<div class="disp">Ranger : <button onclick="alignG('h')">⇔ Aligner en ligne</button><button onclick="alignG('v')">⇕ Aligner en colonne</button><button onclick="repartirG()">↔ Espacer régulièrement</button><button onclick="miroirCopie()">⧉ Copie en miroir</button></div>`;
 if(mode=='d'&&sel==null&&DISPO.includes(tool))return dispo(null);
 if(sel==null||!M.items[sel])return'';const it=M.items[sel],i=sel;
 if(mode=='m'){const q=M.temps[cur]&&M.temps[cur].moves[i];if(!q)return`<b>${esc2(NOMS[it.t])} ${esc2(it.l||'')}</b> <span class="vide0">ne bouge pas dans ce temps</span>`;
  return`<b>${esc2(NOMS[it.t])} ${esc2(it.l||'')}</b> <button onclick="snap();delete M.temps[cur].moves[${i}];draw()">✕ Annuler ce mouvement</button>${q.c?` <button onclick="snap();delete M.temps[cur].moves[${i}].c;draw()">Redresser la flèche</button>`:''}`}
 if(mode!='d')return'';let h='';
 const rot=`<button onclick="rotSel(-90)">↺</button><button onclick="rotSel(-15)">↺ 15°</button><button onclick="rotSel(15)">↻ 15°</button><button onclick="rotSel(90)">↻</button>`;
 if(it.t=='p')h=`<b>Joueur</b> <input value="${esc2(it.l)}" maxlength="3" style="width:60px" title="Nom (3 car.)" onchange="snap();M.items[${i}].l=this.value;draw()"> ${[['b','Bleu',NAVY],['r','Rouge',RED],['j','Jaune',GOLD]].map(([v,l,c])=>`<button class="pastille${it.c==v?' on':''}" style="background:${c}" title="${l}" onclick="snap();M.items[${i}].c='${v}';draw()"></button>`).join('')} <button onclick="dupSel()">+ Copier</button>`;
 else if(it.t=='ball')h=`<b>Ballon</b> ${it.o!=null?`au pied de ${esc2(M.items[it.o]&&M.items[it.o].l)} <button onclick="snap();delete M.items[${i}].o;M.items[${i}].y+=14;draw()">Détacher</button>`:'libre : glisse-le sur un joueur pour le lui donner'}`;
 else if(it.t=='txt')h=`<b>Texte</b> <input value="${esc2(it.s)}" onchange="snap();M.items[${i}].s=this.value;draw()"> ${rot}`;
 else h=`<b>${NOMS[it.t]||it.t}</b> ${ROTABLE.includes(it.t)?rot:''} <button onclick="dupSel()">+ Copier</button>`+(['plot','piquet','cerceau','mannequin','haie'].includes(it.t)?`${dispo(i)}`:'');
 return h+` <button class="del" onclick="snap();removeItem(${i});draw()">🗑 Supprimer</button>`}
const DISPO=['plot','piquet','cerceau','mannequin','haie'];
function dispo(i){const on=DP&&i!=null&&DP.i===i,v=on?DP:{L:DPL,n:DPN,a:0};
 return `<div class="disp">${on?'<b>Aperçu</b> : glisse la forme pour la déplacer, ↻ pour la tourner, ▢ pour l’agrandir.':i==null?'Ou pose directement en forme :':'Disposer à partir d’ici :'}<br>${Object.entries(FORMES).map(([k,l])=>`<button${on&&DP.forme==k?' class="on"':''} onclick="disposer('${k}')">${l}</button>`).join('')}<br>côté / écart <input id="disp_m" type="number" min="1" max="60" step=".5" value="${v.L}" style="width:56px"${on?' oninput="dpSet()"':''}> m · nombre (ligne, cercle) <input id="disp_n" type="number" min="2" max="12" value="${v.n}" style="width:50px"${on?' oninput="dpSet()"':''}>${on?` · angle <b id="disp_a">${v.a}°</b><br><button class="ok" onclick="dpPlacer()">✓ Placer</button> <button onclick="dpAnnuler()">✕ Annuler</button>`:''}</div>`}
function rotSel(d){if(sel==null)return;const it=M.items[sel];if(!ROTABLE.includes(it.t))return;snap();it.rot=((it.rot||0)+d+360)%360;draw()}
// ---------- ranger la sélection (idées GeoGebra) ----------
const libres=()=>selG.filter(j=>{const it=M.items[j];return it&&!(it.t=='ball'&&isP(M,it.o))&&it.t!='zone'&&it.t!='ligne'});
function alignG(ax){const L=libres();if(L.length<2)return;snap();const k=ax=='h'?'y':'x',m=R(L.reduce((a,j)=>a+M.items[j][k],0)/L.length);L.forEach(j=>M.items[j][k]=m);draw()}
function repartirG(){const L=libres();if(L.length<3)return;const xs=L.map(j=>M.items[j].x),ys=L.map(j=>M.items[j].y),k=(Math.max(...xs)-Math.min(...xs))>=(Math.max(...ys)-Math.min(...ys))?'x':'y',o=L.slice().sort((a,b)=>M.items[a][k]-M.items[b][k]),a=M.items[o[0]][k],b=M.items[o[o.length-1]][k];
 snap();o.forEach((j,n)=>M.items[j][k]=R(a+(b-a)*n/(o.length-1)));draw()}
// Copie en miroir gauche/droite (sélection, ou tout le schéma) : pour deux ateliers face à face. Trajets compris.
function miroirCopie(){const f=field(M),cx=f.x+f.w/2,X=x=>R(2*cx-x),ids=(selG.length?selG:M.items.map((_,j)=>j)).slice().sort((a,b)=>a-b),map={};snap();
 ids.forEach(i=>{const it=M.items[i];if(!it)return;const n=cl(it);n.x=X(it.x);if(it.t=='zone')n.x=R(2*cx-it.x-it.w);if(it.t=='ligne'){n.x=X(it.x);n.dx=-it.dx}
  if(['but','haie','echelle'].includes(it.t))n.rot=((180-(it.rot||0))%360+360)%360;
  if(it.t!='p'&&it.t!='ball'&&M.items.some(o=>o.t==it.t&&Math.hypot(o.x-n.x,o.y-n.y)<3))return;
  if(it.t=='p')n.l=nextLabel(it.c);M.items.push(n);map[i]=M.items.length-1});
 Object.entries(map).forEach(([i,j])=>{const n=M.items[j];if(n.t=='ball'&&n.o!=null){if(map[n.o]!=null)n.o=map[n.o];else delete n.o}});
 M.temps.forEach(T=>Object.keys(T.moves||{}).forEach(k=>{const j=map[k];if(j==null)return;const q=cl(T.moves[k]);q.x=X(q.x);if(q.c)q.c=[X(q.c[0]),q.c[1]];if(q.o!=null)q.o=map[q.o]!=null?map[q.o]:null;T.moves[j]=q}));
 const nw=Object.values(map);regrp(nw);selG=nw.length>1?nw:[];sel=null;draw()}
// Copies : les éléments copiés forment leur propre groupe.
function regrp(js){const m={};js.forEach(j=>{const o=M.items[j];if(o&&o.gr)o.gr=m[o.gr]||(m[o.gr]='g'+Date.now().toString(36)+Object.keys(m).length)});const n={};js.forEach(j=>{const o=M.items[j];if(o&&o.gr)n[o.gr]=(n[o.gr]||0)+1});js.forEach(j=>{const o=M.items[j];if(o&&o.gr&&n[o.gr]<2)delete o.gr})}
function degrouper(){snap();selG.forEach(j=>delete M.items[j].gr);selG=[];draw()}
function dupSel(){const ids=selG.length?selG.slice():sel!=null?[sel]:[];if(!ids.length)return;snap();const map={},D=24;
 ids.forEach(i=>{const it=cl(M.items[i]);it.x+=D;if(it.t=='p')it.l=nextLabel(it.c);map[i]=M.items.length;M.items.push(it)});
 ids.forEach(i=>{const it=M.items[map[i]];if(it.o!=null)it.o=map[it.o]!=null?map[it.o]:(delete it.o,undefined);if(it.o===undefined)delete it.o});
 M.temps.forEach(T=>{const mv=T.moves||{};ids.forEach(i=>{const q=mv[i];if(!q)return;const n=cl(q);n.x+=D;if(n.c)n.c=[n.c[0]+D,n.c[1]];if(n.o!=null&&map[n.o]!=null)n.o=map[n.o];mv[map[i]]=n});T.moves=mv});
 const nw=ids.map(i=>map[i]);regrp(nw);if(nw.length>1){selG=nw;sel=null}else{sel=nw[0];selG=[]}draw()}
function suppSel(){snap();selG.slice().sort((a,b)=>b-a).forEach(removeItem);selG=[];sel=null;draw()}
function tbar(){
 const n=M.temps.length;return (n?M.temps.map((T,j)=>`<button class="${j==cur?'on':''}" onclick="cur=${j};sel=null;draw()">Temps ${j+1}</button>`).join(''):'')+
 ` <button onclick="snap();M.temps.splice(${n?cur+1:0},0,{moves:{}});cur=${n?cur+1:0};sel=null;draw()">+ Temps suivant</button>`+(n?` <button class="del" onclick="if(confirm('Supprimer le Temps ${cur+1} ?')){snap();M.temps.splice(cur,1);fixCur();draw()}">🗑</button>`:'')}
const SUIV={d:['Suivant : faire bouger →','m'],m:['Suivant : voir l\'animation →','v'],v:['Enregistrer la fiche →','f']};
function ui(){
 ['D','M','V'].forEach(k=>$e('tab'+k).classList.toggle('on',mode==k.toLowerCase()));
 $e('tools').classList.toggle('hide',mode!='d');$e('visbar').classList.toggle('hide',mode!='v');$e('tbar').classList.toggle('hide',mode!='m');$e('opts').classList.toggle('hide',mode=='v');
 $e('hint').textContent=mode=='d'?hintD():mode=='m'?(M.temps.length?'Temps '+(cur+1)+' : glisse joueurs et ballon à leur nouvelle place (ils bougent ensemble). Ballon sur un joueur = passe, dans le but = tir. Rond orange = courber.':'Glisse un joueur ou le ballon vers sa nouvelle place : la flèche se dessine toute seule.'):'Vérifie que l\'animation raconte bien l\'exercice.';
 $e('tbar').innerHTML=mode=='m'?tbar():'';$e('props').innerHTML=props();const k=compte(M),l=Object.entries(k.mat);$e('compte').textContent=mode=='v'?'':`Sur le schéma : ${k.joueurs} joueur${k.joueurs>1?'s':''}`+(l.length?' · '+l.map(([n,q])=>q+' '+nomMat(n,q)).join(', '):'');
 const f=editingId&&E.find(x=>x.id==editingId),pv=varEdit&&E.find(x=>x.id==varEdit.pid);$e('edtitre').textContent=pv?(varEdit.idx!=null?'Variante « '+(pv.variantes[varEdit.idx]||{}).nom+' » de : ':'Nouvelle variante de : ')+pv.titre:f?'Modification : '+f.titre:'Nouveau schéma';
 $e('fond').value=M.fond||'';$e('grille').value=String(GRID);if(mode=='v'){$e('vtemps').max=M.temps.length}$e('suiv').textContent=mode=='v'&&(varEdit||editingId)?'Enregistrer… →':SUIV[mode][0];$e('undo').disabled=!hist.length;$e('redo').disabled=!redo.length}
// ---------- mesures (idée GeoGebra) : distance en mètres pendant qu'on glisse ----------
function metres(a,b){const f=field(M);return Math.hypot((b[0]-a[0])*M.w/f.w,(b[1]-a[1])*M.h/f.h)}
function mesure(a,b){const s=$e('cv');if(!s||!a||!b)return;const d=metres(a,b);if(d<.5)return;const mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2,t=(Math.round(d*10)/10).toString().replace('.',',')+' m';
 s.insertAdjacentHTML('beforeend',`<g style="pointer-events:none"><line x1="${R(a[0])}" y1="${R(a[1])}" x2="${R(b[0])}" y2="${R(b[1])}" stroke="#e8731a" stroke-width=".5" stroke-dasharray="1.5 1.5"/><rect x="${R(mx-9)}" y="${R(my-3.8)}" width="18" height="6.5" rx="2" fill="#e8731a" opacity=".9"/><text x="${R(mx)}" y="${R(my+1.3)}" font-size="4.6" font-weight="700" text-anchor="middle" fill="#fff" font-family="sans-serif">${t}</text></g>`)}
function mesureDrag(){
 if(drag.k=='mv'&&drag.moved){const T=M.temps[cur],q=T&&T.moves[drag.i];if(!q)return;const S=simulate({...M,temps:M.temps.slice(0,cur)}),a=S.states[S.states.length-1].pos[drag.i];mesure(a,[q.x,q.y]);return}
 if(drag.k=='d'&&drag.s){const it=M.items[drag.i];if(it.t=='zone'||it.t=='ligne')return;const P=simulate(M).states[0].pos,me=(it.t=='p'||it.t=='ball')?P[drag.i]:[it.x,it.y];const pr=[];
  const mob=t=>t=='p'||t=='ball';// un joueur se mesure aux joueurs, un plot (ou autre matériel) au matériel du terrain
  M.items.forEach((o,j)=>{if(j==drag.i||o.t=='zone'||o.t=='ligne'||o.t=='txt'||o.t=='ball'||mob(o.t)!=mob(it.t)||(it.t=='ball'&&j===it.o))return;const q=(o.t=='p'||o.t=='ball')?P[j]:[o.x,o.y];pr.push([dist(q,me),q])});pr.sort((a,b)=>a[0]-b[0]).slice(0,2).forEach(([,q])=>mesure(q,me))}}
// ---------- dispositions de plots (idée GeoGebra : polygones réguliers) ----------
// Aperçu à placer : on le glisse, on le tourne (poignée ↻) et on l'agrandit (poignée carrée) à la souris, puis « Placer ».
let DP=null,DPL=10,DPN=4;// DP = {i: plot de départ, forme, n, L (m), a (degrés), C (centre en px)}
const FORMES={carre:'▢ Carré',triangle:'△ Triangle',ligne:'⋯ Ligne',cercle:'◯ Cercle'};
function dpMetres(){const {forme:fo,n,L}=DP,pts=[[0,0]];
 if(fo=='ligne')for(let k=1;k<n;k++)pts.push([k*L,0]);
 if(fo=='carre')pts.push([L,0],[L,L],[0,L]);
 if(fo=='triangle')pts.push([L,0],[L/2,-L*Math.sqrt(3)/2]);
 if(fo=='cercle')for(let k=1;k<n;k++){const a=2*Math.PI*k/n,r=L/2;pts.push([r-r*Math.cos(a),-r*Math.sin(a)])}
 const cx=pts.reduce((s,p)=>s+p[0],0)/pts.length,cy=pts.reduce((s,p)=>s+p[1],0)/pts.length;return pts.map(([x,y])=>[x-cx,y-cy])}
function dpPts(){const f=field(M),kx=f.w/M.w,ky=f.h/M.h,a=DP.a*Math.PI/180,c=Math.cos(a),s=Math.sin(a),C=DP.C;
 return{C,pts:dpMetres().map(([u,v])=>[R(C[0]+(u*c-v*s)*kx),R(C[1]+(u*s+v*c)*ky)])}}
// Taille de départ adaptée au terrain (demande de Bertrand) : environ la moitié du petit côté ; une ligne couvre 60 % de la longueur.
function taille0(fo,n){const c=Math.min(M.w,M.h);return Math.max(1,fo=='ligne'?Math.round(M.w*.6/Math.max(1,n-1)*2)/2:Math.round(c*.5))}
function disposer(forme){let neuf=false;if(sel==null&&DISPO.includes(tool)){const f=field(M);snap();M.items.push({t:tool,x:R(f.x+f.w/2),y:R(f.y+f.h/2)});sel=M.items.length-1;neuf=true}
 const it=M.items[sel];if(!it)return;
 if(DP&&DP.i===sel){DP.forme=forme;DP.L=taille0(forme,DP.n);draw();return}
 const n=Math.max(2,Math.min(12,+($e('disp_n')||{}).value||DPN)),L=taille0(forme,n),f=field(M);
 DP={i:sel,forme,n,L,a:0,C:[0,0],neuf};const o=dpMetres()[0];DP.C=[it.x-o[0]*f.w/M.w,it.y-o[1]*f.h/M.h];if(neuf)DP.C=[it.x,it.y];draw()}
function dpSet(){if(!DP)return;const m=+$e('disp_m').value,n=+$e('disp_n').value;if(m>=1&&m<=60)DP.L=m;if(n>=2&&n<=12&&Math.round(n)!=DP.n){DP.n=Math.round(n);if(DP.forme=='ligne')DP.L=taille0('ligne',DP.n)}dpMaj()}
function dpSvg(){const {C,pts}=dpPts(),it=M.items[DP.i],r=Math.max(10,...pts.map(p=>dist(p,C))),a=DP.a*Math.PI/180,sn=Math.sin(a),cs=Math.cos(a),
 hr=[R(C[0]+sn*(r+14)),R(C[1]-cs*(r+14))],pf=pts.reduce((b,q)=>dist(q,C)>=dist(b,C)-.01?q:b,pts[0]),df=Math.max(1,dist(pf,C)),hs=[R(pf[0]+(pf[0]-C[0])/df*9),R(pf[1]+(pf[1]-C[1])/df*9)],rot=(it.rot||0)+(it.t=='haie'?DP.a:0),
 ly=R(Math.max(7,Math.min(194,hr[1]-10))),lx=R(Math.max(19,Math.min(281,hr[0]))),O='#e8731a';
 return `<g id="dpov"><path d="M${pts.map(p=>p.join(' ')).join('L')}${DP.forme=='ligne'?'':'Z'}" fill="#e8b92320" stroke="${O}" stroke-width=".8" stroke-dasharray="3 2" data-dp="b" style="cursor:move"/>`
 +pts.map(p=>`<g transform="translate(${p[0]} ${p[1]})${rot?` rotate(${rot})`:''}" opacity=".6" data-dp="b" style="cursor:move"><circle r="7" fill="transparent"/><g transform="scale(${SC})">${shape(it)}</g></g>`).join('')
 +`<line x1="${R(C[0])}" y1="${R(C[1])}" x2="${hr[0]}" y2="${hr[1]}" stroke="${O}" stroke-width=".6" stroke-dasharray="2 2" style="pointer-events:none"/>`
 +`<g data-dp="r" style="cursor:grab" transform="translate(${hr[0]} ${hr[1]})"><title>Tourner</title><circle r="6" fill="#fff" stroke="${O}" stroke-width="1.5"/><text y="3" font-size="8" font-weight="700" text-anchor="middle" fill="${O}" font-family="sans-serif" style="pointer-events:none">↻</text></g>`
 +`<g data-dp="s" style="cursor:nwse-resize" transform="translate(${hs[0]} ${hs[1]})"><title>Agrandir / rétrécir</title><rect x="-4.5" y="-4.5" width="9" height="9" rx="1.5" fill="#fff" stroke="${O}" stroke-width="1.5"/></g>`
 +`<g style="pointer-events:none"><rect x="${lx-17}" y="${ly-5}" width="34" height="7.5" rx="2" fill="#fff" opacity=".9"/><text x="${lx}" y="${R(ly+.6)}" font-size="5" font-weight="700" text-anchor="middle" fill="${O}" font-family="sans-serif">${DP.L} m · ${DP.a}°</text></g></g>`}
function dpMaj(){const o=$e('dpov');if(o)o.remove();const s=$e('cv');const g=s&&DP&&s.querySelector(`[data-i="${DP.i}"]`);if(g)g.style.opacity=.25;if(s&&DP)s.insertAdjacentHTML('beforeend',dpSvg());const m=$e('disp_m');if(m&&DP&&document.activeElement!==m)m.value=DP.L;const a=$e('disp_a');if(a&&DP)a.textContent=DP.a+'°'}
function dpAnnuler(){if(DP&&DP.neuf){DP=null;undo()}else{DP=null;draw()}}
function dpPlacer(){if(!DP)return;const {pts}=dpPts(),it=M.items[DP.i],f=field(M),in_=([x,y])=>x>=f.x-2&&x<=f.x+f.w+2&&y>=f.y-2&&y<=f.y+f.h+2;
 const gr='g'+Date.now().toString(36);snap();if(it.t=='haie')it.rot=(((it.rot||0)+DP.a)%360+360)%360;[it.x,it.y]=pts[0];const n0=M.items.length;pts.slice(1).forEach(p=>{if(in_(p))M.items.push({...cl(it),x:p[0],y:p[1]})});if(M.items.length>n0){it.gr=gr;M.items.slice(n0).forEach(o=>o.gr=gr)}else delete it.gr;DPL=DP.L;DPN=DP.n;if(DP.neuf&&tool)sel=null;DP=null;draw()}
// Curseur des temps (idée GeoGebra) : on fige l'animation à la fin d'un temps.
function vAller(k){const svg=$e('cvbox').querySelector('svg');if(!svg)return;const S=simulate(norm(M)),TM=timing(S),n=S.segs.length;k=Math.max(0,Math.min(n,k));
 const t=k==0?0:TM.starts[k-1]+TM.durs[k-1]+.05;svg.pauseAnimations();svg.setCurrentTime(t/(+$e('vspeed').value||1));$e('vtemps').value=k;$e('vtlab').textContent=k?'Temps '+k+' / '+n:'Départ';const b=$e('vpause');b.textContent='▶ Lecture';b.dataset.p=1}
function vTemps(d){vAller((+$e('vtemps').value||0)+d)}
function draw(){const box=$e('cvbox');if(DP&&(mode!='d'||sel!==DP.i||!M.items[DP.i]))DP=null;if($e('vtlab'))$e('vtlab').textContent='';if(mode=='v')box.innerHTML=render(M,{animOn:true,speed:+$e('vspeed').value});else{box.innerHTML=render(M,{editor:mode,grid:GRID});bind();if(drag)mesureDrag();if(DP)dpMaj()}ui();brouillon()}
function setMode(m){mode=m;tmp=null;box=null;selG=[];drag=null;sel=null;tool=null;document.querySelectorAll('#tools button').forEach(b=>b.classList.remove('on'));fixCur();const b=$e('vpause');b.textContent='⏸ Pause';delete b.dataset.p;draw();window.scrollTo({top:0})}
// Brouillon : le schéma en cours est gardé sur l'appareil, même si on change d'écran ou ferme la page.
function brouillon(){try{localStorage.setItem('brouillon_editeur',JSON.stringify({M,editingId,varEdit}))}catch(e){}}
let dimSnap=false;
function majDim(){const w=Math.max(1,+$e('dw').value||0),h=Math.max(1,+$e('dh').value||0);if(!+$e('dw').value||!+$e('dh').value)return;
 if(!dimSnap){snap();dimSnap=true}const of=field(M);M.w=w;M.h=h;remap(M,of,field(M));draw()}
// ---------- fiches perso ----------
function chargePerso(){try{return JSON.parse(localStorage.getItem('mesfiches')||'[]')}catch(e){return[]}}
function savePerso(a){try{localStorage.setItem('mesfiches',JSON.stringify(a))}catch(e){alert('Enregistrement local impossible : exporte la fiche en fichier.')}}
const CATS=['U7','U9','U11','U13','U15','U18','Seniors'];
// Enregistrer une fiche ou une variante déjà existante : on choisit de la remplacer ou d'en faire une nouvelle variante.
function enregistrerChoix(){const f=editingId&&E.find(x=>x.id==editingId),pv=varEdit&&varEdit.idx!=null&&E.find(x=>x.id==varEdit.pid),pn=varEdit&&varEdit.idx==null&&E.find(x=>x.id==varEdit.pid);
 if(!f&&!pv&&!pn)return ouvrirDlg();const v=pv&&pv.variantes[varEdit.idx],src=f||pv||pn;
 $e('c_titre').textContent=f?'« '+f.titre+' »':pv?'la variante « '+(v&&v.nom)+' »':'ce schéma (fait à partir de « '+pn.titre+' »)';
 $e('c_rempl').textContent=f?'Remplacer la fiche (même nom)':pv?'Remplacer cette variante':'Remplacer le schéma de la fiche « '+pn.titre+' »';
 $e('c_rempl').onclick=()=>{$e('dlgc').close();copieDe=null;if(pn){editingId=pn.id;varEdit=null;ui();brouillon()}ouvrirDlg()};
 // Nouvelle fiche : on repart d'une copie de la fiche (textes compris), à renommer et modifier ; l'ancienne ne bouge pas.
 $e('c_new').onclick=()=>{$e('dlgc').close();copieDe=src.id;editingId=null;varEdit=null;ui();brouillon();ouvrirDlg();$e('f_titre').value=(f?f.titre+' (copie)':pv?pv.titre+' – '+(v&&v.nom||''):pn.titre+' (nouvelle)').slice(0,40);$e('f_titre').select()};
 $e('c_var').onclick=()=>{$e('dlgc').close();copieDe=null;varEdit={pid:src.id,idx:null};editingId=null;ui();brouillon();ouvrirDlg()};
 $e('dlgc').showModal()}
let copieDe=null;
function ouvrirDlg(){if(varEdit)return ouvrirDlgV();const f=editingId?E.find(x=>x.id==editingId):copieDe?E.find(x=>x.id==copieDe):null;const g=id=>$e(id);
 g('f_titre').value=f?.titre||'';g('f_theme').value=f?.theme||'échauffement';const cs=f?.categories||[];g('f_cats').innerHTML=[...new Set([...CATS,...cs])].map(c=>`<label class="chip"><input type="checkbox" value="${esc2(c)}"${cs.includes(c)?' checked':''}> ${esc2(c)}</label>`).join('');g('f_niveau').value=f?.niveau||'débutant';
 g('f_duree').value=f?.duree_min||15;g('f_jmin').value=f?.joueurs.min||6;g('f_jmax').value=f?.joueurs.max||12;
 const k=compte(M);g('f_mat').value=Object.entries(k.mat).map(([n,q])=>q+' '+nomMat(n,q)).join(', ')||(f?f.materiel.map(m=>m.quantite+' '+m.nom).join(', '):'');if(!f){g('f_jmin').value=k.joueurs||6;g('f_jmax').value=k.joueurs||12}g('f_obj').value=f?.objectif||'';g('f_org').value=f?.organisation||'';g('f_dero').value=f?.deroulement||'';
 g('f_cons').value=(f?.consignes||[]).join('\n');g('f_var').value=(f?.variantes||[]).map(v=>v.nom+' : '+v.change).join('\n');$e('dlg').showModal()}
// ---------- brouillons de fiche (sur l'appareil, hors base commune) ----------
let draftId=null;
const CH=['f_titre','f_theme','f_niveau','f_duree','f_jmin','f_jmax','f_mat','f_obj','f_org','f_dero','f_cons','f_var'];
function brouillonsLis(){try{return JSON.parse(localStorage.getItem('brouillons_fiches')||'[]')}catch(e){return[]}}
function brouillonsSauve(a){try{localStorage.setItem('brouillons_fiches',JSON.stringify(a));return true}catch(e){alert('Enregistrement impossible sur cet appareil.');return false}}
// Appel silencieux : si le script SQL des brouillons n'est pas lancé, les brouillons restent locaux.
const brRpc=async(fn,body)=>{try{return(await fetch(CLUB_URL+'/rest/v1/rpc/'+fn,{method:'POST',headers:clubH(),body:JSON.stringify(body)})).ok}catch(e){return false}};
const clubBr=()=>typeof clubOn=='function'&&clubOn()&&!!lsG('codeclub');
function brouillonEnreg(avecChamps){const ch={};if(avecChamps){CH.forEach(k=>ch[k]=$e(k).value);ch.cats=[...document.querySelectorAll('#f_cats input:checked')].map(x=>x.value)}
 const a=brouillonsLis(),id=draftId||'br-'+Date.now().toString(36),o={id,titre:(avecChamps&&ch.f_titre.trim())||'Sans titre',date:new Date().toISOString(),M:cl(M),editingId,varEdit,champs:avecChamps?ch:null,auteur:lsG('nomeduc')||''},i=a.findIndex(x=>x.id==id);
 i>=0?a[i]=o:a.push(o);if(!brouillonsSauve(a))return false;draftId=id;
 if(clubBr())brRpc('publier_brouillon',{code:lsG('codeclub'),bid:id,brouillon:o,auteur:o.auteur});return true}
// Liste : brouillons de l'appareil + brouillons partagés du club (base du club, comme les fiches).
async function brouillonsClub(){if(!clubBr())return[];try{const r=await fetch(CLUB_URL+'/rest/v1/rpc/lire_brouillons',{method:'POST',headers:clubH(),body:JSON.stringify({code:lsG('codeclub')})});if(!r.ok)return[];return(await r.json()).map(x=>({...x.data,id:x.id,auteur:x.auteur||x.data.auteur||'',date:x.maj||x.data.date}))}catch(e){return[]}}
let BRC=[];
async function brouillonsAff(){$e('b_liste').innerHTML='<p>Chargement…</p>';$e('dlgb').showModal();BRC=await brouillonsClub();
 const m=new Map();brouillonsLis().concat(BRC).forEach(b=>{const o=m.get(b.id);if(!o||(b.date||'')>(o.date||''))m.set(b.id,b)});
 const a=[...m.values()].sort((x,y)=>(y.date||'').localeCompare(x.date||''));
 $e('b_liste').innerHTML=a.length?a.map(b=>`<div class="actions"><b>${esc2(b.titre)}</b> <small>${b.auteur?esc2(b.auteur)+' · ':''}${new Date(b.date).toLocaleString('fr-FR',{dateStyle:'short',timeStyle:'short'})}</small><button onclick="brouillonReprendre('${esc2(b.id)}')">Reprendre</button><button onclick="brouillonSupp('${esc2(b.id)}')">Supprimer</button></div>`).join(''):'<p>Aucun brouillon.</p>'}
function brouillonSupp(id){if(!confirm('Supprimer ce brouillon ?'))return;brouillonsSauve(brouillonsLis().filter(x=>x.id!=id));if(draftId==id)draftId=null;
 if(clubBr())brRpc('retirer_brouillon',{code:lsG('codeclub'),bid:id}).then(brouillonsAff);else brouillonsAff()}
function brouillonReprendre(id){copieDe=null;const b=brouillonsLis().concat(BRC).filter(x=>x.id==id).sort((x,y)=>(y.date||'').localeCompare(x.date||''))[0];if(!b)return;$e('dlgb').close();draftId=id;M=norm(b.M);editingId=b.editingId||null;varEdit=b.varEdit||null;$e('dw').value=M.w;$e('dh').value=M.h;sel=null;hist=[];redo=[];cur=0;show('e');setMode('d');
 if(b.champs&&!varEdit){ouvrirDlg();CH.forEach(k=>$e(k).value=b.champs[k]);document.querySelectorAll('#f_cats input').forEach(x=>x.checked=b.champs.cats.includes(x.value))}}
function enregistrer(ev){ev.preventDefault();const g=id=>$e(id).value.trim(),lines=s=>g(s).split('\n').map(x=>x.trim()).filter(Boolean),old=editingId?E.find(x=>x.id==editingId):copieDe?(c=>{if(!c)return null;const o=cl(c);['id','club','maj','auteur','schema_svg'].forEach(k=>delete o[k]);return o})(E.find(x=>x.id==copieDe)):null;copieDe=null;
 const fiche={...(old||{}),id:editingId||'perso-'+Date.now().toString(36),perso:true,titre:g('f_titre').slice(0,40),theme:g('f_theme'),categories:[...document.querySelectorAll('#f_cats input:checked')].map(x=>x.value),public:old?.public||['filles','garçons'],niveau:g('f_niveau'),duree_min:+g('f_duree')||15,joueurs:{min:+g('f_jmin')||1,max:+g('f_jmax')||1},surface:old?.surface||(M.w+' x '+M.h+' m'),
  materiel:g('f_mat').split(',').map(x=>x.trim()).filter(Boolean).map(x=>{const m=x.match(/^(\d+)\s+(.*)$/);return m?{nom:m[2],quantite:+m[1]}:{nom:x,quantite:1}}),
  objectif:g('f_obj'),organisation:g('f_org'),deroulement:g('f_dero'),consignes:lines('f_cons'),
  variantes:lines('f_var').map(l=>{const [n,...r]=l.split(':');const ov=old?.variantes?.find(v=>v.nom==n.trim());const o={...(ov||{}),nom:n.trim(),change:r.join(':').trim()||n.trim(),difficulte:ov?.difficulte||''};delete o.schema_svg;return o}),
  schema_modele:cl(M)};delete fiche.club;delete fiche.maj;delete fiche.schema_svg;
 const a=chargePerso().filter(x=>x.id!=fiche.id);a.push(fiche);savePerso(a);if(draftId){brouillonsSauve(brouillonsLis().filter(x=>x.id!=draftId));if(clubBr())brRpc('retirer_brouillon',{code:lsG('codeclub'),bid:draftId});draftId=null}$e('dlg').close();editingId=fiche.id;majE();show('b');setTimeout(()=>alert('Fiche « '+fiche.titre+' » enregistrée sur cet appareil.'+(window.boutonsClub?' Pour la partager, utilise le bouton du club sur la fiche.':'')),50)}
const hyd=e=>{if(!e.schema_modele)return e;return{...e,schema_svg:render(e.schema_modele,{animOn:true}),variantes:(e.variantes||[]).map(v=>v.schema_modele?{...v,schema_svg:render(v.schema_modele,{animOn:true})}:v)}};
// Copie d'une fiche sans ce qui est recalculé à l'affichage (schémas SVG) ni les infos du club.
function propre(f,keep){const o=cl(f);['schema_svg','club','maj',...(keep?[]:['perso','auteur'])].forEach(k=>delete o[k]);(o.variantes||[]).forEach(v=>delete v.schema_svg);return o}
// ---------- variantes ----------
// Comme dans l'atelier GMP : on part d'une copie de l'exercice, on la modifie, elle reste rangée sous l'exercice d'origine.
function nouvelleVariante(id){const f=E.find(x=>x.id==id);if(!f||!f.schema_modele)return;varEdit={pid:id,idx:null};editingId=null;M=norm(f.schema_modele);$e('dw').value=M.w;$e('dh').value=M.h;sel=null;hist=[];redo=[];cur=0;show('e');setMode('d')}
function modifierVariante(id,k){const f=E.find(x=>x.id==id),v=f&&f.variantes[k];if(!v)return;varEdit={pid:id,idx:k};editingId=null;M=norm(v.schema_modele||f.schema_modele);$e('dw').value=M.w;$e('dh').value=M.h;sel=null;hist=[];redo=[];cur=0;show('e');setMode('d')}
function ouvrirDlgV(){const f=E.find(x=>x.id==varEdit.pid);if(!f){alert('Exercice d\'origine introuvable.');varEdit=null;ui();return}const v=varEdit.idx!=null?f.variantes[varEdit.idx]||{}:{};
 $e('v_parent').textContent=f.titre;$e('v_nom').value=v.nom||'';$e('v_change').value=v.change||'';$e('v_duree').value=v.duree||'';document.querySelectorAll('[name=v_diff]').forEach(r=>r.checked=r.value==(v.difficulte||''));$e('dlgv').showModal()}
function enregistrerV(ev){ev.preventDefault();const f=E.find(x=>x.id==varEdit.pid);if(!f)return;const o=propre(f,true);o.perso=true;o.variantes=o.variantes||[];
 const v={...(varEdit.idx!=null?o.variantes[varEdit.idx]:{}),nom:$e('v_nom').value.trim().slice(0,40),change:$e('v_change').value.trim(),difficulte:(document.querySelector('[name=v_diff]:checked')||{}).value||'',schema_modele:cl(M)};
 const d=+$e('v_duree').value;if(d&&d!=o.duree_min)v.duree=d;else delete v.duree;
 if(varEdit.idx!=null)o.variantes[varEdit.idx]=v;else{o.variantes.push(v);varEdit.idx=o.variantes.length-1}
 const a=chargePerso().filter(x=>x.id!=o.id);a.push(o);savePerso(a);$e('dlgv').close();majE();show('b');
 setTimeout(()=>alert('Variante « '+v.nom+' » enregistrée : elle s\'affiche à côté de « '+o.titre+' ».'+(window.boutonsClub?' Pour la partager, utilise « Partager au club » sur la fiche.':'')),50)}
const aOrig=id=>window.EXERCICES.some(x=>x.id==id)||(window.CLUBF||[]).some(x=>x.id==id);
const MKSTOP=new Set('de du des la le les un une et en au aux avec sans par pour sur sous dans contre ou son ses cette qui que vers entre puis apres après face'.split(' '));
function motsCles(f){const t=(f.titre||'').toLowerCase(),o=[];(t.match(/\d+\s*(?:c|contre)\s*\d+/g)||[]).forEach(m=>{const n=m.match(/\d+/g);o.push(n[0]+' contre '+n[1])});(t.match(/[a-zàâäçéèêëîïôöùûüœ-]+/g)||[]).forEach(w=>{if(w.length>3&&!MKSTOP.has(w))o.push(w)});o.push(f.theme);return[...new Set(o)].slice(0,10)}
function nettoie(f){if(!f.mots_cles||!f.mots_cles.length)f.mots_cles=motsCles(f);if(f.auteur=='ESGA')f.auteur='Commun';if(/^nicolas\s+rou/i.test((f.auteur||'').trim()))f.auteur='Nico';if(f.theme=='passe'||f.theme=='tir')f.theme='technique';const num=+((f.id||'').match(/-(\d+)$/)||[])[1];if(f.theme=='match'||(/^match/i.test(f.titre||'')&&num<100)){if(Array.isArray(f.mots_cles))f.mots_cles=f.mots_cles.map(m=>m==f.theme?'jeu réduit':m);f.theme='jeu réduit'}if(Array.isArray(f.categories))f.categories=[...new Set(f.categories.map(c=>/^seniors?$/i.test(c)?'Seniors':/^U[79]$/.test(c)?'U7-U9':c))];return f}
function majE(){const p=chargePerso(),ids=new Set(p.map(x=>x.id)),c=(window.CLUBF||[]).filter(x=>!ids.has(x.id)),cid=new Set(c.map(x=>x.id));
 E=window.EXERCICES.filter(x=>!ids.has(x.id)&&!cid.has(x.id)).map(hyd).concat(c.map(hyd),p.map(hyd)).map(nettoie);majFiltres();base();if(typeof seance=='function')seance()}
function modifierSchema(id){const f=E.find(x=>x.id==id);if(!f||!f.schema_modele)return;editingId=id;varEdit=null;M=norm(f.schema_modele);$e('dw').value=M.w;$e('dh').value=M.h;sel=null;hist=[];redo=[];cur=0;show('e');setMode('d')}
function exporterFiche(id){const f=E.find(x=>x.id==id),o=propre(f);if(!o.schema_modele&&f.schema_svg)o.schema_svg=f.schema_svg;const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(o,null,2)],{type:'application/json'}));a.download=f.id+'.json';a.click()}
function supprimerPerso(id){if(confirm(aOrig(id)?'Rétablir la fiche d\'origine ?':'Supprimer cette fiche ?')){savePerso(chargePerso().filter(x=>x.id!=id));majE()}}
function initEditeur(){
 $e('tools').innerHTML=TOOLS.map(([t,l,s])=>`<button data-t="${t}" title="${l}">${icon(t,s)}<span>${l}</span></button>`).join('');
 document.querySelectorAll('#tools button').forEach(b=>b.onclick=()=>setTool(tool==b.dataset.t?null:b.dataset.t));
 $e('dw').oninput=$e('dh').oninput=majDim;$e('fond').onchange=ev=>setFond(ev.target.value);$e('dw').onblur=$e('dh').onblur=()=>{dimSnap=false};
 $e('undo').onclick=undo;$e('redo').onclick=redoF;
 $e('clear').onclick=()=>{if(confirm('Tout effacer ?')){snap();M.items=[];M.temps=[];sel=null;cur=0;draw()}};
 $e('tabD').onclick=()=>setMode('d');$e('suiv').onclick=()=>{const n=SUIV[mode][1];n=='f'?enregistrerChoix():setMode(n)};$e('tabM').onclick=()=>setMode('m');$e('tabV').onclick=()=>setMode('v');
 $e('vpause').onclick=()=>{const s=$e('cvbox').querySelector('svg'),b=$e('vpause');if(b.dataset.p){s.unpauseAnimations();b.textContent='⏸ Pause';delete b.dataset.p}else{s.pauseAnimations();b.textContent='▶ Lecture';b.dataset.p=1}};
 $e('vrestart').onclick=()=>{$e('vpause').textContent='⏸ Pause';delete $e('vpause').dataset.p;draw()};
 $e('vspeed').onchange=()=>draw();
 $e('dlpng').onclick=()=>pngDe(render(M,{}),'schema');
 $e('dlsvg').onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([render(M,{animOn:true})],{type:'image/svg+xml'}));a.download='schema.svg';a.click()};
 $e('save').onclick=enregistrerChoix;$e('fdlg').onsubmit=enregistrer;$e('fdlgv').onsubmit=enregistrerV;$e('cancel').onclick=()=>$e('dlg').close();
 $e('f_brouillon').onclick=()=>{if(brouillonEnreg(true)){$e('dlg').close();alert('Brouillon enregistré. Retrouve-le avec « Mes brouillons ».')}};
 $e('brouillons').onclick=brouillonsAff;$e('b_nouv').onclick=()=>{if(brouillonEnreg(false)){brouillonsAff()}};
 $e('nouveau').onclick=()=>{if(M.items.length&&!confirm('Commencer un nouveau schéma ? Le schéma en cours sera remplacé.'))return;copieDe=null;editingId=null;varEdit=null;draftId=null;M=blank();$e('dw').value=30;$e('dh').value=20;sel=null;hist=[];redo=[];cur=0;setMode('d')};
 document.addEventListener('keydown',ev=>{if($e('editeur').classList.contains('hide')||/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName))return;
  if((ev.ctrlKey||ev.metaKey)&&ev.key.toLowerCase()=='z'){ev.preventDefault();ev.shiftKey?redoF():undo();return}
  if((ev.ctrlKey||ev.metaKey)&&ev.key.toLowerCase()=='y'){ev.preventDefault();redoF();return}
  if(mode=='d'&&selG.length&&(ev.key=='Delete'||ev.key=='Backspace')){ev.preventDefault();suppSel();return}
  if(mode=='d'&&sel!=null&&(ev.key=='Delete'||ev.key=='Backspace')){ev.preventDefault();snap();removeItem(sel);draw()}
  if(mode=='d'&&sel!=null&&(ev.key=='r'||ev.key=='R'))rotSel(ev.shiftKey?-90:90)});
 try{const b=JSON.parse(localStorage.getItem('brouillon_editeur')||'null');if(b&&b.M){M=norm(b.M);editingId=b.editingId||null;varEdit=b.varEdit||null;$e('dw').value=M.w;$e('dh').value=M.h}}catch(e){}
 setMode('d');majE()}
initEditeur();

// Export PNG : le schéma (position de départ, fond blanc) pour l'envoyer par message.
function pngDe(svg,nom){const im=new Image(),u=URL.createObjectURL(new Blob([svg.replace('<svg ','<svg width="1200" height="800" ')],{type:'image/svg+xml'}));
 im.onload=()=>{const c=document.createElement('canvas');c.width=1200;c.height=800;const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,1200,800);x.drawImage(im,0,0,1200,800);URL.revokeObjectURL(u);
  c.toBlob(b=>{const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=nom+'.png';a.click()},'image/png')};
 im.onerror=()=>alert('Export PNG impossible sur cet appareil.');im.src=u}
function pngFiche(btn,titre){const s=btn.closest('figure').querySelector('svg');if(!s)return;const c=s.cloneNode(true);c.querySelectorAll('animate,animateMotion').forEach(n=>n.remove());pngDe(new XMLSerializer().serializeToString(c),(titre||'schema').replace(/[^\w-]+/g,'_').slice(0,40))}
