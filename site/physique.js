/* Éditeur physique — Atelier Foot (renfo, proprio, étirement, motricité)
   Deux vues :
   - « profil » : joueur articulé vu de côté. Chaque pose = angles des segments ; l'animation passe d'une pose à l'autre en boucle.
     {v:1, vue:'profil', theme, info, anc, miroir, poses:[{t,hd,an,ae,fa,fe,tn,sn,pn,tf,sf,pf,x,air,d,h,anc?}], decor:[{t,x}]}
     Angles en degrés, absolus : 0 = vers le bas, 90 = vers l'avant, 180 = vers le haut, -90 = vers l'arrière.
     t torse (hanche → cou), hd tête (par rapport au torse), an/ae bras proche (bras, avant-bras), fa/fe bras éloigné,
     tn/sn/pn jambe proche (cuisse, tibia, pied), tf/sf/pf jambe éloignée. x = position du point d'appui (anc), air = hauteur du saut.
     d = durée pour arriver à la pose (s), h = temps de tenue (s). Le corps est posé au sol automatiquement.
   - « dessus » : appuis vus de dessus sur une échelle de rythme, des haies, des cerceaux ou des plots.
     {v:1, vue:'dessus', theme, info, face, tempo, disp:{t,n}, pas:[{g:[x,y,levé?], d:[x,y,levé?], s?}]}
     Unité = une case d'échelle (environ 45 cm) ; x le long du dispositif, y en travers (l'échelle va de -0,5 à 0,5).
     pas[0] = départ ; s = saut (les deux pieds décollent). */
const PH_L={to:40,nk:5,hr:9,ua:22,fa:21,th:33,sh:32,ft:14},PH_SOL=182;
const PH_C={peau:'#eab58c',peau2:'#c98f68',mail:'#1b3a73',mail2:'#0f2347',short:'#0f2347',short2:'#08162e',chau:'#e8b923',chau2:'#a8820c',pied:'#222',pied2:'#444',chev:'#3a2a1d'};
const PH_K=['t','hd','an','ae','fa','fe','tn','sn','pn','tf','sf','pf'];
const phR=v=>Math.round(v*10)/10,phD=a=>[Math.sin(a*Math.PI/180),Math.cos(a*Math.PI/180)],phAng=(dx,dy)=>Math.atan2(dx,dy)*180/Math.PI;
const phAdd=(o,a,l)=>{const d=phD(a);return[o[0]+d[0]*l,o[1]+d[1]*l]};
const phW=a=>{a=((a+180)%360+360)%360-180;return a};
// ---------- profil : cinématique ----------
function phFK(p){const L=PH_L,H=[0,0],N=phAdd(H,p.t,L.to),S=phAdd(H,p.t,L.to-4),Hd=phAdd(N,p.t+(p.hd||0),L.nk+L.hr);
 const arm=(a1,a2)=>{const e=phAdd(S,a1,L.ua),w=phAdd(e,a2,L.fa);return{e,w,m:phAdd(w,a2,2.5)}};
 const leg=(t1,t2,t3)=>{const k=phAdd(H,t1,L.th),a=phAdd(k,t2,L.sh),n=[-Math.cos(t3*Math.PI/180),Math.sin(t3*Math.PI/180)],o=(u,v)=>{const d=phD(t3);return[a[0]+d[0]*u+n[0]*v,a[1]+d[1]*u+n[1]*v]};return{k,a,to:o(13,5.3),he:o(-3,5.3)}};
 return{H,N,S,Hd,An:arm(p.an,p.ae),Af:arm(p.fa,p.fe),Ln:leg(p.tn,p.sn,p.pn),Lf:leg(p.tf,p.sf,p.pf)}}
function phAncre(F,a){return a=='p'?F.Ln.a:a=='pf'?F.Lf.a:a=='m'?F.An.w:a=='mf'?F.Af.w:a=='g'?F.Ln.k:F.H}
// Position de la hanche : le point le plus bas touche le sol (moins la hauteur du saut), le point d'appui est en x.
function phPlace(p,anc){const F=phFK(p),pts=[[F.H,7],[F.S,6],[F.N,5],[F.Hd,PH_L.hr],[F.An.e,4],[F.Af.e,4],[F.An.m,3.4],[F.Af.m,3.4],[F.Ln.k,5],[F.Lf.k,5],[F.Ln.a,3.5],[F.Lf.a,3.5],[F.Ln.to,0],[F.Ln.he,0],[F.Lf.to,0],[F.Lf.he,0]];
 const low=Math.max(...pts.map(([q,r])=>q[1]+r)),A=phAncre(F,p.anc||anc||'h');return{F,o:[(p.x??150)-A[0],PH_SOL-low-(p.air||0)]}}
// Positions absolues (repère du dessin) de toutes les articulations, pour l'éditeur.
function phPts(p,anc){const {F,o}=phPlace(p,anc),T=q=>[q[0]+o[0],q[1]+o[1]];
 return{H:T(F.H),N:T(F.N),S:T(F.S),Hd:T(F.Hd),en:T(F.An.e),wn:T(F.An.w),ef:T(F.Af.e),wf:T(F.Af.w),kn:T(F.Ln.k),an:T(F.Ln.a),ton:T(F.Ln.to),kf:T(F.Lf.k),af:T(F.Lf.a),tof:T(F.Lf.to)}}
// Bras ou jambe vers une cible (cinématique inverse à deux segments) : sert à poser une main sur le genou, sur un mur…
function phIK(B,T,l1,l2,sg){const dx=T[0]-B[0],dy=T[1]-B[1],d=Math.min(l1+l2-.01,Math.max(Math.abs(l1-l2)+.01,Math.hypot(dx,dy))),b=phAng(dx,dy),c=Math.acos(Math.max(-1,Math.min(1,(l1*l1+d*d-l2*l2)/(2*l1*d))))*180/Math.PI,a1=b+sg*c,J=phAdd(B,a1,l1);return[a1,phAng(T[0]-J[0],T[1]-J[1])]}
function phMain(p,cote,T,sg){const F=phFK(p),[a1,a2]=phIK(F.S,T,PH_L.ua,PH_L.fa,sg??1);if(cote=='f'){p.fa=a1;p.fe=a2}else{p.an=a1;p.ae=a2}return p}
// ---------- profil : chronologie (images intermédiaires calculées, pour garder les appuis au sol) ----------
function phLerp(a,b,u){const o={...b};PH_K.forEach(k=>{const x=a[k]??0,y=b[k]??0;o[k]=x+phW(y-x)*u});o.x=(a.x??150)+((b.x??150)-(a.x??150))*u;o.air=(a.air||0)+((b.air||0)-(a.air||0))*u;return o}
const phEase=s=>(1-Math.cos(Math.PI*s))/2;
function phVoyage(m){const P=m.poses;return P.length>1&&Math.abs((P[0].x??150)-(P[P.length-1].x??150))>6}
function phFrames(m){const P=m.poses,fr=[],K=8;let t=0;const push=(p,tt,op=1)=>fr.push({t:tt,p,op});
 if(!P.length)return{fr:[],T:0};const voy=phVoyage(m);
 push(P[0],0,voy?0:1);if(voy){t+=.25;push(P[0],t)}t+=P[0].h??.4;push(P[0],t);
 const tr=(a,b,d)=>{for(let k=1;k<=K;k++)push(phLerp(a,b,phEase(k/K)),t+d*k/K);t+=d};
 for(let i=1;i<P.length;i++){tr(P[i-1],P[i],P[i].d??.8);t+=P[i].h??.3;push(P[i],t)}
 const L=P[P.length-1];
 if(voy){t+=.5;push(L,t);t+=.3;push(L,t,0)}else if(P.length>1){tr(L,P[0],P[0].d??.8)}
 return{fr,T:t}}
// ---------- profil : dessin ----------
function phSeg(x1,y1,x2,y2,c,w){return`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`}
function phHaieP(x){return`<g transform="translate(${x} ${PH_SOL})"><line x1="-7" y1="0" x2="7" y2="0" stroke="#555" stroke-width="2.4" stroke-linecap="round"/><line x1="0" y1="0" x2="0" y2="-24" stroke="#666" stroke-width="2"/><rect x="-3.5" y="-28" width="7" height="6" rx="2" fill="#e8731a" stroke="#a84f0e" stroke-width=".6"/></g>`}
const PH_DECOR={haie:{n:'Haie',s:phHaieP},
 step:{n:'Step',s:x=>`<rect x="${x-22}" y="${PH_SOL-13}" width="44" height="13" rx="3" fill="#7d93b5" stroke="#3d5072"/><rect x="${x-22}" y="${PH_SOL-13}" width="44" height="4" rx="2" fill="#3d5072"/>`},
 banc:{n:'Banc',s:x=>`<rect x="${x-30}" y="${PH_SOL-26}" width="60" height="6" rx="2" fill="#a0723f" stroke="#6d4a24"/><rect x="${x-25}" y="${PH_SOL-21}" width="4" height="21" fill="#6d4a24"/><rect x="${x+21}" y="${PH_SOL-21}" width="4" height="21" fill="#6d4a24"/>`},
 mur:{n:'Mur',s:x=>`<rect x="${x-4}" y="30" width="8" height="${PH_SOL-30}" fill="#c9d3e0" stroke="#8796ad"/>`+[50,80,110,140].map(y=>`<line x1="${x-4}" y1="${y}" x2="${x+4}" y2="${y-6}" stroke="#8796ad" stroke-width=".8"/>`).join('')},
 tapis:{n:'Tapis',s:x=>`<rect x="${x-60}" y="${PH_SOL-1.5}" width="120" height="4" rx="2" fill="#2fa84f" opacity=".8"/>`},
 ballon:{n:'Ballon',s:x=>`<g transform="translate(${x} ${PH_SOL-6})"><circle r="6" fill="#fff" stroke="#222" stroke-width="1.1"/><path d="M0 -2.6L2.5 -.8L1.5 2.1H-1.5L-2.5 -.8z" fill="#222"/></g>`},
 plot:{n:'Plot',s:x=>`<path d="M${x-1.5} ${PH_SOL-12}h3l4 12h-11z" fill="#d9a406" stroke="#9a7000" stroke-width=".6"/>`}};
// Un membre = chaîne de groupes emboîtés ; chaque articulation tourne (animateTransform) avec les valeurs de chaque image.
function phRot(vals,an){const v0=vals[0];if(!an||vals.every(v=>Math.abs(v-v0)<.05))return`<g transform="rotate(${phR(v0)})">`;return`<g transform="rotate(${phR(v0)})"><animateTransform attributeName="transform" type="rotate" values="${vals.map(phR).join(';')}" ${an}/>`}
function phUnwrap(a){for(let i=1;i<a.length;i++){while(a[i]-a[i-1]>180)a[i]-=360;while(a[i]-a[i-1]<-180)a[i]+=360}return a}
// Formes effilées (muscles, chaussures) : le segment part de y0 vers y1, largeur w0 → w1, renflement wm à la fraction tm.
function phCap(y0,y1,w0,w1,f){const r0=w0/2,r1=w1/2;return`<path d="M${-r0} ${y0}A${r0} ${r0} 0 0 1 ${r0} ${y0}L${r1} ${y1}A${r1} ${r1} 0 0 1 ${-r1} ${y1}Z" fill="${f}"/>`}
function phLimb(y0,y1,w0,wm,w1,tm,f){const r0=w0/2,m=wm/2,r1=w1/2,ym=y0+(y1-y0)*tm;return`<path d="M${-r0} ${y0}A${r0} ${r0} 0 0 1 ${r0} ${y0}Q${phR(m*1.9-r0*.45-r1*.45)} ${ym} ${r1} ${y1}A${r1} ${r1} 0 0 1 ${-r1} ${y1}Q${-phR(m*1.9-r0*.45-r1*.45)} ${ym} ${-r0} ${y0}Z" fill="${f}"/>`}
// Chaussure de foot (orteils vers +y, semelle côté x négatif) : tige, semelle, languette, lacets.
function phChaus(ff){const C=PH_C,t=ff?C.pied2:C.pied,so=ff?'#111':'#000';return`<path d="M-5.2 -3.6Q-5.6 -2 -5.2 0L-5.4 11Q-5.4 14.6 -3.2 14.8Q-.6 14.4 .3 11.5Q1.1 8 .8 4.4Q.9 1.2 .3 -1.2Q-.5 -3.6 -2.4 -3.8Z" fill="${t}"/><path d="M-5.9 -3.6L-5.9 14.9" stroke="${so}" stroke-width="1.5" stroke-linecap="round"/><path d="M.6 2.8L-1.8 3.4M.7 5.4L-1.6 6M.6 8L-1.5 8.5" stroke="${ff?'#888':'#bbb'}" stroke-width=".7" stroke-linecap="round"/>`}
function phCorps(frames,an){
 const ps=frames.map(f=>f.p),col=k=>ps.map(p=>p[k]??0),A=k=>phUnwrap(col(k)),rel=(c,pa)=>{const x=A(c),y=pa?A(pa):x.map(()=>0);return phUnwrap(x.map((v,i)=>-(v-y[i])))},L=PH_L,C=PH_C;
 const root=frames.map(f=>phPlace(f.p,f.anc).o),r0=root[0],trs=an&&root.some(q=>Math.abs(q[0]-r0[0])+Math.abs(q[1]-r0[1])>.05)?`<animateTransform attributeName="transform" type="translate" values="${root.map(q=>phR(q[0])+' '+phR(q[1])).join(';')}" ${an}/>`:'';
 const R0=inner=>`<g transform="translate(${phR(r0[0])} ${phR(r0[1])})">${trs}${inner}</g>`;
 const torse=inner=>phRot(rel('t'),an)+inner+'</g>';
 const bras=(c,u,f,ff)=>{const pe=ff?C.peau2:C.peau,ma=ff?C.mail2:C.mail;return R0(torse(`<g transform="translate(0 ${L.to-4})">${phRot(rel(u,'t'),an)}${phLimb(0,L.ua,6.6,6.9,5.2,.3,pe)}${phCap(-1.5,10.5,9.4,8.4,ma)}<rect x="-4.2" y="9.4" width="8.4" height="1.3" fill="${ff?C.chau2:C.chau}"/><g transform="translate(0 ${L.ua})">${phRot(rel(f,u),an)}${phLimb(-.5,L.fa,5.6,5.8,3.9,.3,pe)}<ellipse cy="${L.fa+2.6}" rx="2.9" ry="3.7" fill="${pe}"/><ellipse cx="-2.3" cy="${L.fa+1.2}" rx="1.1" ry="2.3" fill="${pe}"/></g></g></g></g>`))};
 const jambe=(t1,t2,t3,ff)=>{const pe=ff?C.peau2:C.peau,sh=ff?C.short2:C.short,so=ff?C.chau2:C.chau;return R0(`${phRot(rel(t1),an)}${phLimb(6,L.th,11,9.4,7.4,.35,pe)}${phCap(-2,16,12,10.6,sh)}<g transform="translate(0 ${L.th})">${phRot(rel(t2,t1),an)}${phLimb(-2,17,7.8,8.8,6.6,.4,pe)}${phLimb(12,L.sh,7.4,7,5.2,.3,so)}<rect x="-3.7" y="12" width="7.4" height="2" fill="${ff?C.mail2:C.mail}"/><g transform="translate(0 ${L.sh})">${phRot(rel(t3,t2),an)}${phChaus(ff)}</g></g></g></g></g>`)};
 const tronc=R0(torse(`<circle r="8" fill="${C.short}"/><path d="M-6.6 3C-6.6 8 -6 11 -6.2 14C-6.4 20 -8 23 -7.8 28C-7.6 33 -6.5 36 -4 38.5L4 38.5C6.5 37 7.2 33 7.2 28C7.2 22 6.6 18 6.2 14C6 9 7.6 5 7.4 3Z" fill="${C.mail}"/><path d="M-6.6 3L7.4 3" stroke="${C.chau}" stroke-width="1.6"/>${phSeg(0,L.to-6,0,L.to-3,C.chau,8)}<g transform="translate(0 ${L.to})">${phRot(A('hd').map(v=>-v),an)}${phSeg(0,-2,0,L.nk+2,C.peau,6)}<circle cx=".6" cy="${L.nk+L.hr}" r="${L.hr+.4}" fill="${C.chev}"/><circle cx="-1.8" cy="${L.nk+L.hr-1.4}" r="${L.hr-1.2}" fill="${C.peau}"/><circle cx="-10" cy="${L.nk+L.hr-1.8}" r="1.4" fill="${C.peau}"/><ellipse cx="2.4" cy="${L.nk+L.hr-.8}" rx="1.5" ry="2.1" fill="${C.peau2}"/><path d="M-9.2 ${L.nk+L.hr+3.4}Q-4 ${L.nk+L.hr+8.8} 3.4 ${L.nk+L.hr+6.4}" fill="none" stroke="${C.chev}" stroke-width="2.6" stroke-linecap="round"/><circle cx="-6.2" cy="${L.nk+L.hr+1}" r="1" fill="#222"/></g></g>`));
 return bras('f','fa','fe',1)+jambe('tf','sf','pf',1)+tronc+jambe('tn','sn','pn',0)+bras('n','an','ae',0)}
function phProfil(m,o={}){const P=m.poses||[];if(!P.length)return'';let fr,T=0,an='';
 if(o.anim&&P.length>1){({fr,T}=phFrames(m));an=`dur="${(T/(o.speed||1)).toFixed(2)}s" keyTimes="${fr.map(f=>(f.t/T).toFixed(4)).join(';')}" calcMode="linear" repeatCount="indefinite"`}
 else fr=[{p:P[Math.min(o.pose||0,P.length-1)]}];
 fr.forEach(f=>f.anc=m.anc);
 const op=an&&fr.some(f=>f.op===0)?`<animate attributeName="opacity" values="${fr.map(f=>f.op??1).join(';')}" ${an}/>`:'';
 let b=(m.decor||[]).filter(d=>PH_DECOR[d.t]&&d.t!='ballon').map(d=>PH_DECOR[d.t].s(d.x)).join('');
 b+=`<g>${op}${phCorps(fr,an)}</g>`+(m.decor||[]).filter(d=>d.t=='ballon').map(d=>PH_DECOR.ballon.s(d.x)).join('');
 const C=o.cam||phCam(m);b=`<g transform="translate(${C.tx} ${C.ty}) scale(${C.s})">${b}</g>`;
 return m.miroir?`<g transform="translate(300 0) scale(-1 1)">${b}</g>`:b}
// Cadrage : le mouvement (toutes les poses) remplit le dessin, le sol reste en bas. Agrandi au plus × 1,5.
function phCam(m){let x0=1e9,x1=-1e9,y0=1e9;(m.poses||[]).forEach(p=>{Object.values(phPts(p,m.anc)).forEach(q=>{x0=Math.min(x0,q[0]-12);x1=Math.max(x1,q[0]+12);y0=Math.min(y0,q[1]-14)})});
 (m.decor||[]).forEach(d=>{if(d.t=='tapis')return;const w=d.t=='banc'?32:d.t=='step'?24:10;x0=Math.min(x0,d.x-w);x1=Math.max(x1,d.x+w);if(d.t=='haie')y0=Math.min(y0,PH_SOL-36)});
 if(x0>x1)return{s:1,tx:0,ty:0};const s=Math.max(.6,Math.min(1.5,280/(x1-x0),(PH_SOL-26)/(PH_SOL-y0))),cx=(x0+x1)/2;return{s:phR(s*100)/100,tx:phR(150-s*cx),ty:phR(PH_SOL*(1-s))}}
// ---------- dessus : appuis ----------
const PH_DISP={echelle:{n:'Échelle de rythme',e:1,mat:'echelle'},haies:{n:'Haies basses',e:2,mat:'haie'},cerceaux:{n:'Cerceaux',e:1.5,mat:'cerceau'},plots:{n:'Plots',e:2,mat:'plot'},aucun:{n:'Rien (sol)',e:1}};
function dsGeo(m){const d=m.disp||{t:'echelle',n:6},e=(PH_DISP[d.t]||PH_DISP.echelle).e,n=Math.max(1,d.n||1),xs=[].concat(...(m.pas||[]).map(q=>[q.g[0],q.d[0]])),lo=Math.min(0,...xs)-.8,hi=Math.max(n*e,...xs)+.8,c=Math.min(44,276/(hi-lo));
 const x0=150-(lo+hi)/2*c;return{c,e,n,t:d.t,W:(x,y)=>[phR(x0+x*c),phR(104+y*c)],x0}}
function dsDisp(G){const {c,e,n,t,W}=G;let s='';
 if(t=='echelle'){const [a,b]=[W(0,-.5),W(n,.5)];s+=`<rect x="${a[0]}" y="${a[1]}" width="${phR(b[0]-a[0])}" height="${phR(b[1]-a[1])}" fill="#fff8e0"/>`;for(let i=0;i<=n;i++){const p=W(i,-.5);s+=`<line x1="${p[0]}" y1="${p[1]}" x2="${p[0]}" y2="${phR(p[1]+c)}" stroke="#e8b923" stroke-width="${phR(c*.12)}"/>`}s+=`<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${a[1]}" stroke="#333" stroke-width="1.2"/><line x1="${a[0]}" y1="${b[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#333" stroke-width="1.2"/>`}
 for(let i=0;i<n&&t!='echelle';i++){const [x,y]=W((i+.5)*e,0);
  if(t=='haies')s+=`<rect x="${phR(x-c*.09)}" y="${phR(y-c*.75)}" width="${phR(c*.18)}" height="${phR(c*1.5)}" rx="${phR(c*.09)}" fill="#e8731a" stroke="#a84f0e" stroke-width=".6"/><rect x="${phR(x-c*.14)}" y="${phR(y-c*.82)}" width="${phR(c*.28)}" height="${phR(c*.16)}" fill="#555"/><rect x="${phR(x-c*.14)}" y="${phR(y+c*.66)}" width="${phR(c*.28)}" height="${phR(c*.16)}" fill="#555"/>`;
  if(t=='cerceaux')s+=`<circle cx="${x}" cy="${y}" r="${phR(c*.62)}" fill="none" stroke="#2fa84f" stroke-width="${phR(c*.1)}"/>`;
  if(t=='plots')s+=`<circle cx="${x}" cy="${y}" r="${phR(c*.2)}" fill="#d9a406" stroke="#9a7000" stroke-width=".6"/><circle cx="${x}" cy="${y}" r="${phR(c*.07)}" fill="#9a7000"/>`}
 return s}
// Semelle vue de dessus (pointe vers +x) : gauche et droite sont symétriques.
function dsPied(c,g,col,trait){const L=c*.27,w=c*.11,k=g?-1:1;return`<path d="M${phR(-L)} ${phR(k*w*.2)}C${phR(-L)} ${phR(-k*w)} ${phR(-L*.2)} ${phR(-k*w*1.1)} ${phR(L*.5)} ${phR(-k*w*.95)}C${phR(L*1.05)} ${phR(-k*w*.8)} ${phR(L*1.05)} ${phR(k*w*.9)} ${phR(L*.45)} ${phR(k*w*.8)}C${phR(-L*.1)} ${phR(k*w*.5)} ${phR(-L)} ${phR(k*w*1.1)} ${phR(-L)} ${phR(k*w*.2)}Z" fill="${col}" stroke="${trait||'#0006'}" stroke-width=".6"/>`}
const DS_G='#1b3a73',DS_D='#d63a2a';
function dsFrames(m){const P=m.pas||[],fr=[],K=6,tp=m.tempo||.42;let t=0;if(!P.length)return{fr,T:0};
 const st=q=>({g:q.g.slice(),d:q.d.slice()}),push=(a,sg,sd,sb,op=1)=>fr.push({t,g:a.g,d:a.d,sg,sd,sb,op});
 push(st(P[0]),1,1,1,0);t+=.25;push(st(P[0]),1,1,1);t+=.35;push(st(P[0]),1,1,1);
 for(let i=1;i<P.length;i++){const a=P[i-1],b=P[i],mg=Math.hypot(a.g[0]-b.g[0],a.g[1]-b.g[1])>.02||!!a.g[2]!=!!b.g[2],md=Math.hypot(a.d[0]-b.d[0],a.d[1]-b.d[1])>.02||!!a.d[2]!=!!b.d[2],d=tp*(b.s?1.35:1),t0=t;
  for(let k=1;k<=K;k++){const u=phEase(k/K),h=Math.sin(Math.PI*k/K),l=(x,y)=>[x[0]+(y[0]-x[0])*u,x[1]+(y[1]-x[1])*u,y[2]];t=t0+d*k/K;
   push({g:l(a.g,b.g),d:l(a.d,b.d)},(mg||b.s)?1+.45*h:1,(md||b.s)?1+.45*h:1,b.s?1+.14*h:1)}t+=.06;push(st(b),1,1,1)}
 t+=.6;push(st(P[P.length-1]),1,1,1);t+=.3;push(st(P[P.length-1]),1,1,1,0);return{fr,T:t}}
function dsCorps(c,face){return`<g transform="rotate(${face||0})"><ellipse rx="${phR(c*.2)}" ry="${phR(c*.5)}" fill="${PH_C.mail}" opacity=".8"/><ellipse cx="${phR(c*.05)}" cy="${phR(-c*.5)}" rx="${phR(c*.1)}" ry="${phR(c*.08)}" fill="${PH_C.peau}" opacity=".9"/><ellipse cx="${phR(c*.05)}" cy="${phR(c*.5)}" rx="${phR(c*.1)}" ry="${phR(c*.08)}" fill="${PH_C.peau}" opacity=".9"/><circle cx="${phR(c*.02)}" r="${phR(c*.2)}" fill="${PH_C.chev}"/><path d="M${phR(c*.08)} ${phR(-c*.13)}A${phR(c*.16)} ${phR(c*.16)} 0 0 1 ${phR(c*.08)} ${phR(c*.13)}" fill="${PH_C.peau}"/></g>`}
function dsDessus(m,o={}){const G=dsGeo(m),{c,W}=G,P=m.pas||[],face=m.face||0;let b=dsDisp(G);if(!P.length)return b;
 // Traces : chaque appui posé, numéroté dans l'ordre (ce qu'on dessine sur une fiche papier).
 const lab=(p,n,col)=>`<text x="${p[0]}" y="${phR(p[1]+c*.06)}" font-size="${phR(Math.max(4,c*.2))}" font-weight="700" text-anchor="middle" fill="#fff" font-family="sans-serif" style="pointer-events:none">${n}</text>`;
 const pied=(q,g,op,n)=>{const p=W(q[0],q[1]);return`<g transform="translate(${p[0]} ${p[1]}) rotate(${face})" opacity="${op}">${dsPied(c,g,g?DS_G:DS_D)}${n!=null?`<g transform="rotate(${-face})">${lab([0,0],n)}</g>`:''}</g>`};
 if(o.traces!==false){let n=0;b+=pied(P[0].g,1,.25)+pied(P[0].d,0,.25);for(let i=1;i<P.length;i++){const a=P[i-1],q=P[i];
  ['g','d'].forEach(k=>{if(!q[k][2]&&(Math.hypot(a[k][0]-q[k][0],a[k][1]-q[k][1])>.02||a[k][2]))b+=pied(q[k],k=='g',o.edit?.18:.4,o.edit?null:++n)})}}
 if(o.edit)return b;
 const cen=s=>{const g=s.g,d=s.d;return[(g[0]+d[0])/2,(g[1]+d[1])/2]};
 if(!o.anim){const s=P[Math.min(o.pas||0,P.length-1)];return b+dsAct(s,W,c,face)}
 const {fr,T}=dsFrames(m),kt=fr.map(f=>(f.t/T).toFixed(4)).join(';'),an=`dur="${(T/(o.speed||1)).toFixed(2)}s" keyTimes="${kt}" calcMode="linear" repeatCount="indefinite"`;
 const mv=(get,sc,inner)=>{const ps=fr.map(get).map(q=>W(q[0],q[1])),ss=fr.map(sc);return`<g transform="translate(${ps[0][0]} ${ps[0][1]})"><animateTransform attributeName="transform" type="translate" values="${ps.map(p=>p.join(' ')).join(';')}" ${an}/><g>${ss.some(v=>v!=1)?`<animateTransform attributeName="transform" type="scale" values="${ss.map(v=>phR(v*100)/100).join(';')}" ${an}/>`:''}${inner}</g></g>`};
 const opl=k=>`<animate attributeName="opacity" values="${fr.map(f=>f[k][2]?.45:1).join(';')}" ${an}/>`;
 b+=`<g><animate attributeName="opacity" values="${fr.map(f=>f.op).join(';')}" ${an}/>`+mv(f=>f.g,f=>f.sg*(f.g[2]?1.15:1),`<g transform="rotate(${face})">${opl('g')}${dsPied(c,1,DS_G,'#fff')}</g>`)+mv(f=>f.d,f=>f.sd*(f.d[2]?1.15:1),`<g transform="rotate(${face})">${opl('d')}${dsPied(c,0,DS_D,'#fff')}</g>`)+mv(f=>cen(f),f=>f.sb,dsCorps(c,face))+'</g>';
 return b}
function dsAct(s,W,c,face){const pd=(q,g)=>{const p=W(q[0],q[1]);return`<g transform="translate(${p[0]} ${p[1]}) rotate(${face})" opacity="${q[2]?.5:1}">${dsPied(c,g,g?DS_G:DS_D,'#fff')}</g>`},m=W((s.g[0]+s.d[0])/2,(s.g[1]+s.d[1])/2);
 return pd(s.g,1)+pd(s.d,0)+`<g transform="translate(${m[0]} ${m[1]})">${dsCorps(c,face)}</g>`}
// ---------- dessus, vue inclinée (demande de Bertrand) : sol écrasé, haies et plots en relief, joueur debout ----------
function dsIncline(m,o={}){const G=dsGeo(m),P=m.pas||[],face=(m.face||0)*Math.PI/180,K=.6,c=Math.min(G.c,40),mid=(150-G.x0)/G.c,Y0=148;
 const Pr=(x,y,h=0)=>[phR(150+(x-mid)*c+y*c*.28),phR(Y0+y*c*K-h*c)],pts=a=>a.map(q=>q.join(' ')).join(' L');
 const {n,e,t}=G;let b='';
 if(t=='echelle'){b+=`<path d="M${pts([Pr(0,-.5),Pr(n,-.5),Pr(n,.5),Pr(0,.5)])}Z" fill="#fff8e0"/>`;for(let i=0;i<=n;i++)b+=`<line x1="${Pr(i,-.5)[0]}" y1="${Pr(i,-.5)[1]}" x2="${Pr(i,.5)[0]}" y2="${Pr(i,.5)[1]}" stroke="#e8b923" stroke-width="${phR(c*.1)}"/>`;
  b+=`<path d="M${pts([Pr(0,-.5),Pr(n,-.5)])}M${pts([Pr(0,.5),Pr(n,.5)])}" stroke="#333" stroke-width="1.2" fill="none"/>`}
 const pr=[];for(let i=0;i<n&&t!='echelle';i++)pr.push((i+.5)*e);
 const elt=(x,front)=>{if(t=='haies'){const H=.5,y0=-.7,y1=.7,q=(y,h)=>Pr(x,y,h);return front?`<line x1="${q(y1,0)[0]}" y1="${q(y1,0)[1]}" x2="${q(y1,H)[0]}" y2="${q(y1,H)[1]}" stroke="#555" stroke-width="1.6"/><line x1="${q(y0,H)[0]}" y1="${q(y0,H)[1]}" x2="${q(y1,H)[0]}" y2="${q(y1,H)[1]}" stroke="#e8731a" stroke-width="${phR(c*.13)}" stroke-linecap="round"/>`:`<ellipse cx="${q(y0,0)[0]}" cy="${q(y0,0)[1]}" rx="${phR(c*.16)}" ry="${phR(c*.06)}" fill="#0002"/><ellipse cx="${q(y1,0)[0]}" cy="${q(y1,0)[1]}" rx="${phR(c*.16)}" ry="${phR(c*.06)}" fill="#0002"/><line x1="${q(y0,0)[0]}" y1="${q(y0,0)[1]}" x2="${q(y0,H)[0]}" y2="${q(y0,H)[1]}" stroke="#555" stroke-width="1.6"/>`}
  const p=Pr(x,0);if(t=='cerceaux')return front?'':`<ellipse cx="${p[0]}" cy="${p[1]}" rx="${phR(c*.62)}" ry="${phR(c*.62*K)}" fill="none" stroke="#2fa84f" stroke-width="${phR(c*.09)}"/>`;
  if(t=='plots')return front?`<path d="M${phR(p[0]-c*.17)} ${p[1]}L${phR(p[0]-c*.03)} ${phR(p[1]-c*.38)}h${phR(c*.06)}L${phR(p[0]+c*.17)} ${p[1]}Z" fill="#d9a406" stroke="#9a7000" stroke-width=".6"/>`:`<ellipse cx="${p[0]}" cy="${p[1]}" rx="${phR(c*.2)}" ry="${phR(c*.07)}" fill="#0002"/>`;return''};
 b+=pr.map(x=>elt(x,0)).join('');
 const pied=(q,g,op,h=0,nn)=>{const p=Pr(q[0],q[1],h);return`<g transform="translate(${p[0]} ${p[1]}) scale(1 ${K}) rotate(${m.face||0})" opacity="${op}">${dsPied(c,g,g?DS_G:DS_D,'#fff')}</g>`+(nn!=null?`<text x="${p[0]}" y="${phR(p[1]+c*.07)}" font-size="${phR(Math.max(4,c*.19))}" font-weight="700" text-anchor="middle" fill="#fff" font-family="sans-serif">${nn}</text>`:'')};
 if(P.length){let k=0;for(let i=1;i<P.length;i++){const a=P[i-1],q=P[i];['g','d'].forEach(f=>{if(!q[f][2]&&(Math.hypot(a[f][0]-q[f][0],a[f][1]-q[f][1])>.02||a[f][2]))b+=pied(q[f],f=='g',.35,0,++k)})}}
 // Joueur : jambes (hanche → genou → pied), buste, tête, bras ; tout est recalculé à chaque image.
 const lat=[Math.sin(face),-Math.cos(face)],fw=[Math.cos(face),Math.sin(face)],LEG=1.4,TO=1.05;
 const img=f=>{const hg=(f.sg-1)/.45*.55+(f.g[2]?.5:0),hd=(f.sd-1)/.45*.55+(f.d[2]?.5:0),hb=(f.sb-1)/.14*.35+Math.max(hg,hd)*.25,cx=(f.g[0]+f.d[0])/2,cy=(f.g[1]+f.d[1])/2;
  const hip=s=>Pr(cx+lat[0]*.17*s,cy+lat[1]*.17*s,LEG+hb),kn=(s,q,h)=>{const u=(cx+lat[0]*.17*s+q[0])/2+fw[0]*.18,v=(cy+lat[1]*.17*s+q[1])/2+fw[1]*.18;return Pr(u,v,(LEG+hb+h)/2+.05)};
  return{G:[hip(1),kn(1,f.g,hg),Pr(f.g[0],f.g[1],hg+.08)],D:[hip(-1),kn(-1,f.d,hd),Pr(f.d[0],f.d[1],hd+.08)],H:Pr(cx,cy,LEG+hb),fg:Pr(f.g[0],f.g[1],hg),fd:Pr(f.d[0],f.d[1],hd),sg:Pr(f.g[0],f.g[1]),sd:Pr(f.d[0],f.d[1]),hg,hd,op:f.op??1}};
 let fr,an='';if(o.anim&&P.length>1){const r=dsFrames(m);fr=r.fr;an=`dur="${(r.T/(o.speed||1)).toFixed(2)}s" keyTimes="${fr.map(f=>(f.t/r.T).toFixed(4)).join(';')}" calcMode="linear" repeatCount="indefinite"`}
 else{const s=P[Math.min(o.pas||0,Math.max(0,P.length-1))]||{g:[0,-.2],d:[0,.2]};fr=[{g:s.g,d:s.d,sg:1,sd:1,sb:1}]}
 const I=fr.map(img),A=(attr,vals)=>an&&vals.some(v=>v!=vals[0])?`<animate attributeName="${attr}" values="${vals.join(';')}" ${an}/>`:'';
 const path=(get,col,w)=>{const d=I.map(i=>'M'+pts(get(i)));return`<path d="${d[0]}" fill="none" stroke="${col}" stroke-width="${phR(w)}" stroke-linecap="round" stroke-linejoin="round">${A('d',d)}</path>`};
 const tr=(get,inner)=>{const v=I.map(i=>get(i).join(' '));return`<g transform="translate(${v[0]})">${an&&v.some(x=>x!=v[0])?`<animateTransform attributeName="transform" type="translate" values="${v.join(';')}" ${an}/>`:''}${inner}</g>`};
 const ombre=k=>tr(i=>i[k],`<ellipse rx="${phR(c*.22)}" ry="${phR(c*.08)}" fill="#0003"/>`);
 const piedA=(k,g)=>tr(i=>i[k=='g'?'fg':'fd'],`<g transform="scale(1 ${K}) rotate(${m.face||0})">${dsPied(c,g,g?DS_G:DS_D,'#fff')}</g>`);
 const lw=c*.2,Lt=TO*c,sh=[lat[0]*.3*c+lat[1]*.3*c*.28,lat[1]*.3*c*K],corps=`<line x1="0" y1="0" x2="0" y2="${phR(-Lt)}" stroke="${PH_C.mail}" stroke-width="${phR(c*.42)}" stroke-linecap="round"/><line x1="${phR(sh[0])}" y1="${phR(-Lt*.88+sh[1])}" x2="${phR(-sh[0])}" y2="${phR(-Lt*.88-sh[1])}" stroke="${PH_C.mail}" stroke-width="${phR(c*.26)}" stroke-linecap="round"/>`
  +[1,-1].map(sd=>`<path d="M${phR(sd*sh[0])} ${phR(-Lt*.88+sd*sh[1])}l${phR(sd*sh[0]*.25+fw[0]*c*.12)} ${phR(c*.55)}l${phR(fw[0]*c*.18)} ${phR(c*.4)}" fill="none" stroke="${PH_C.peau}" stroke-width="${phR(c*.12)}" stroke-linecap="round"/>`).join('')
  +`<circle cy="${phR(-Lt-c*.32)}" r="${phR(c*.27)}" fill="${PH_C.peau}"/><path d="M${phR(-c*.27)} ${phR(-Lt-c*.32)}a${phR(c*.27)} ${phR(c*.27)} 0 0 1 ${phR(c*.54)} 0q${phR(-c*.27)} ${phR(-c*.1)} ${phR(-c*.54)} 0z" fill="${PH_C.chev}"/>`;
 const fig=ombre('sg')+ombre('sd')+piedA('g',1)+piedA('d',0)+path(i=>i.G,PH_C.peau2,c*.17)+path(i=>i.D,PH_C.peau,c*.17)+path(i=>[i.G[0],[(i.G[0][0]+i.G[1][0])/2,(i.G[0][1]+i.G[1][1])/2]],PH_C.short2,c*.22)+path(i=>[i.D[0],[(i.D[0][0]+i.D[1][0])/2,(i.D[0][1]+i.D[1][1])/2]],PH_C.short,c*.22)+tr(i=>i.H,corps);
 b+=`<g>${A('opacity',I.map(i=>i.op))}${fig}</g>`+pr.map(x=>elt(x,1)).join('');
 return b}
// ---------- rendu commun ----------
function phInfo(m){if(!m.info)return'';const t=String(m.info).slice(0,30),w=Math.max(30,t.length*5.6+20);return`<g transform="translate(${296-w} 5)"><rect width="${w}" height="16" rx="8" fill="${PH_C.mail}"/><circle cx="9" cy="8" r="5" fill="none" stroke="#fff" stroke-width="1.2"/><line x1="9" y1="8" x2="9" y2="4.6" stroke="#e8b923" stroke-width="1.2"/><text x="17" y="11.5" font-size="9" font-weight="700" fill="#fff" font-family="sans-serif">${phEsc(t)}</text></g>`}
const phEsc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function renderPhys(m,o={}){if(!m)return'';let b;
 if(m.vue=='dessus')b=`<rect x="1" y="1" width="298" height="198" rx="6" fill="#e6eefa" stroke="#1b3a73"/>`+(m.incl&&!o.edit?`<path d="M2 70H298V197H2Z" fill="#d9ead0"/>`+dsIncline(m,o):dsDessus(m,o))+(o.edit?'':`<g font-size="8" font-family="sans-serif" font-weight="700"><g transform="translate(14 190) rotate(-90)">${dsPied(26,1,DS_G)}</g><text x="22" y="193" fill="${DS_G}">pied gauche</text><g transform="translate(84 190) rotate(-90)">${dsPied(26,0,DS_D)}</g><text x="92" y="193" fill="${DS_D}">pied droit</text></g>`);
 else b=`<rect x="1" y="1" width="298" height="198" rx="6" fill="#e6eefa" stroke="#1b3a73"/><rect x="2" y="${PH_SOL}" width="296" height="${197-PH_SOL}" fill="#cfe3c4"/><line x1="2" y1="${PH_SOL}" x2="298" y2="${PH_SOL}" stroke="#6f9a5b" stroke-width="1.4"/>`+phProfil(m,o);
 return`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200"${o.id?` id="${o.id}" style="touch-action:none;user-select:none"`:''}>${b}${phInfo(m)}</svg>`}
function phCompte(m){const c={};if(!m)return{joueurs:0,mat:c};if(m.vue=='dessus'){const d=PH_DISP[(m.disp||{}).t];if(d&&d.mat)c[d.mat]=d.mat=='echelle'?1:(m.disp.n||1)}else(m.decor||[]).forEach(d=>{if(d.t!='mur')c[d.t]=(c[d.t]||0)+1});return{joueurs:1,mat:c}}
// ---------- aides pour composer les poses ----------
// Pose la jambe « side » au sol (cheville à la verticale de sa position actuelle), le reste du corps étant déjà posé.
function phAppui(p,side,sg=1){const F=phFK(p),Lg=side=='f'?F.Lf:F.Ln,O=side=='f'?F.Ln:F.Lf,pts=[[F.H,7],[F.S,6],[F.Hd,PH_L.hr],[F.An.m,3.4],[F.Af.m,3.4],[O.k,5],[O.to,0],[O.he,0],[O.a,3.5]];
 const low=Math.max(...pts.map(([q,r])=>q[1]+r)),pf=side=='f'?p.pf:p.pn,sole=Math.max(5.3*Math.abs(Math.sin(pf*Math.PI/180)),3.5),[a1,a2]=phIK([0,0],[Lg.a[0],low-sole],PH_L.th,PH_L.sh,sg);
 if(side=='f'){p.tf=a1;p.sf=a2}else{p.tn=a1;p.sn=a2}return p}
// Jambe tendue posée au sol (talon), le reste du corps étant déjà posé : on cherche l'angle de la jambe.
function phTendre(p,side){const k1=side=='f'?'tf':'tn',k2=side=='f'?'sf':'sn',F0=phFK(p),O=side=='f'?F0.Ln:F0.Lf,low=Math.max(...[[F0.H,7],[F0.S,6],[O.k,5],[O.to,0],[O.he,0],[O.a,3.5]].map(([q,r])=>q[1]+r));let best=0,bd=1e9;
 for(let a=0;a<=88;a+=.5){p[k1]=p[k2]=a;const L=side=='f'?phFK(p).Lf:phFK(p).Ln,d=Math.abs(Math.max(L.he[1],L.to[1])-low);if(d<bd){bd=d;best=a}}p[k1]=p[k2]=best;return p}
// Main posée sur un point du dessin (repère 300 × 200), par ex. un mur.
function phMainW(p,cote,Tw,anc,sg){const {o}=phPlace(p,anc);return phMain(p,cote,[Tw[0]-o[0],Tw[1]-o[1]],sg)}
// ---------- bibliothèque de mouvements (point de départ, à ajuster dans l'éditeur) ----------
const PH_DEB={t:180,hd:0,an:-6,ae:6,fa:6,fe:18,tn:3,sn:0,pn:90,tf:-3,sf:-3,pf:90};
const phQ=o=>({...PH_DEB,...o});
function phPresetsProfil(){const Q=phQ,L=[];const add=(id,nom,theme,info,m)=>L.push({id,nom,theme,m:{v:1,vue:'profil',theme,info,...m}});
 // Renforcement
 add('gainage','Gainage de face','renfo','35 s',{anc:'m',decor:[{t:'tapis',x:130}],poses:[Q({t:96,hd:-4,an:-2,ae:90,fa:2,fe:90,tn:-84,sn:-84,pn:4,tf:-85,sf:-85,pf:4,x:185,h:2})]});
 add('gainage_lat','Gainage de côté','renfo','35 s par côté',{anc:'m',decor:[{t:'tapis',x:130}],poses:[Q({t:106,hd:0,an:2,ae:95,fa:180,fe:180,tn:-74,sn:-74,pn:16,tf:-76,sf:-76,pf:14,x:190,h:2})]});
 {const a=Q({t:-86,hd:-6,an:86,ae:88,fa:86,fe:88,tn:140,sn:8,pn:92,tf:138,sf:6,pf:92,x:205,h:.6}),b=Q({...a,t:-66,tn:112,sn:-6,pn:88,tf:110,sf:-8,pf:88,d:1.2,h:1.5});add('pont','Pont fessier','renfo','35 s',{anc:'p',decor:[{t:'tapis',x:150}],poses:[a,b]})}
 add('chaise','Chaise contre un mur','renfo','45 s',{anc:'h',decor:[{t:'mur',x:115}],poses:[Q({an:88,ae:90,fa:86,fe:92,tn:90,sn:0,pn:90,tf:88,sf:-2,pf:90,x:127,h:2})]});
 {const a=Q({x:150,h:.4}),b=Q({t:142,hd:24,an:95,ae:95,fa:93,fe:93,tn:80,sn:-28,pn:90,tf:78,sf:-30,pf:90,x:150,d:1,h:.5});add('squat','Squat','renfo','10 répétitions',{anc:'p',poses:[a,b]})}
 {const a=Q({x:115,h:.4}),b=Q({an:-28,ae:45,fa:-22,fe:50,tn:88,sn:-2,pn:90,tf:-28,sf:-96,pf:-6,x:115,d:1,h:.5});phMain(a,'n',[7,-3],-1);phMain(a,'f',[5,-3],-1);phMain(b,'n',[7,-3],-1);phMain(b,'f',[5,-3],-1);add('fente','Fente avant alternée','renfo','8 par jambe',{anc:'pf',poses:[a,b]})}
 {const a=Q({t:100,hd:-6,an:0,ae:0,fa:0,fe:0,tn:-80,sn:-80,pn:8,tf:-80,sf:-80,pf:8,x:200,h:.3}),b=Q({t:94,hd:-6,an:-128,ae:22,fa:-128,fe:22,tn:-86,sn:-86,pn:4,tf:-86,sf:-86,pf:4,x:200,d:.9,h:.2});add('pompes','Pompes','renfo','8 répétitions',{anc:'m',poses:[a,b]})}
 {const a=Q({t:104,hd:-5,an:0,ae:0,fa:0,fe:0,tn:0,sn:-90,pn:-95,tf:0,sf:-90,pf:-95,x:140,h:.5}),b=Q({...a,an:100,ae:100,tf:-100,sf:-100,pf:-110,d:1,h:1}),c=Q({...a,fa:100,fe:100,tn:-100,sn:-100,pn:-110,d:1,h:1});add('bird_dog','Bird dog (bras et jambe opposés)','renfo','8 par côté',{anc:'h',decor:[{t:'tapis',x:140}],poses:[a,b,Q({...a,d:1}),c]})}
 {const a=Q({t:-92,hd:-4,an:88,ae:88,fa:88,fe:88,tn:140,sn:20,pn:92,tf:138,sf:18,pf:92,x:150,h:.3}),b=Q({...a,t:-128,hd:-18,an:112,ae:112,fa:110,fe:110,d:.8,h:.4});add('crunch','Abdos (relevé de buste)','renfo','12 répétitions',{anc:'h',decor:[{t:'tapis',x:150}],poses:[a,b]})}
 {const a=Q({an:10,ae:100,fa:8,fe:100,tn:0,sn:-90,pn:0,tf:2,sf:-90,pf:0,x:110,h:.6}),b=Q({...a,t:132,hd:10,an:60,ae:80,fa:58,fe:82,tn:-48,tf:-46,d:2.4,h:.2});add('nordique','Ischios nordiques (à deux)','renfo','5 répétitions',{anc:'g',decor:[{t:'tapis',x:130}],poses:[a,b]})}
 // Proprioception
 {const a=Q({tn:92,sn:2,pn:95,tf:-2,sf:0,pf:90,an:25,ae:60,fa:-25,fe:-5,x:150,h:1.2}),b=Q({...a,tn:48,sn:48,pn:140,d:.9}),c=Q({...a,tn:-30,sn:-62,pn:22,d:.9});add('unipodal','Équilibre sur un pied','proprio','30 s par jambe',{anc:'pf',poses:[a,b,Q({...a,d:.9}),c]})}
 {const a=Q({tn:-5,sn:-60,pn:30,x:170,h:.6}),b=Q({t:96,hd:-12,an:18,ae:22,fa:26,fe:30,tn:-92,sn:-92,pn:-2,tf:14,sf:-6,pf:90,x:170,d:1.4,h:2});add('avion','Équilibre penché (l’avion)','proprio','5 par jambe',{anc:'pf',poses:[a,b]})}
 {const a=Q({tn:92,sn:2,pn:95,tf:-2,sf:0,pf:90,an:25,ae:60,fa:-25,fe:-5,x:150,h:.5}),b=Q({...a,tn:55,sn:45,pn:135,tf:55,sf:-25,t:155,hd:20,an:60,ae:80,fa:40,fe:70,d:1,h:.8});add('squat_1p','Flexion sur une jambe','proprio','6 par jambe',{anc:'pf',poses:[a,b]})}
 // Étirements
 {const a=Q({x:150,h:.5}),b=Q({tn:-6,sn:-168,pn:-178,tf:0,sf:0,pf:90,fa:70,fe:80,x:150,d:1,h:3});phMain(b,'n',phFK(b).Ln.a,1);add('quadri','Étirement des quadriceps','étirement','20 s par jambe',{anc:'pf',poses:[a,b]})}
 {const a=Q({x:150,h:.5}),b=Q({t:125,hd:28,tn:24,sn:24,pn:125,tf:-6,sf:-22,pf:90,x:150,d:1.2,h:3});phTendre(b,'n');const F=phFK(b),k=[F.Ln.k[0]*.8,F.Ln.k[1]*.8];phMain(b,'n',[k[0]+3,k[1]-6],1);phMain(b,'f',[k[0]+1,k[1]-5],1);add('ischios','Étirement des ischios','étirement','20 s par jambe',{anc:'pf',poses:[a,b]})}
 {const b=Q({t:150,hd:20,tn:45,sn:-10,pn:90,tf:-24,sf:-24,pf:90,x:105,h:3});phAppui(b,'n',1);phMainW(b,'n',[208,92],'pf',-1);phMainW(b,'f',[208,96],'pf',-1);add('mollets','Étirement des mollets (mur)','étirement','20 s par jambe',{anc:'pf',decor:[{t:'mur',x:216}],poses:[b]})}
 {const a=Q({t:180,tn:86,sn:-2,pn:90,tf:-28,sf:-94,pf:-100,x:120,h:1}),b=Q({...a,t:174,tf:-42,d:1.2,h:2});[a,b].forEach(p=>{phAppui(p,'n',1);const k=phFK(p).Ln.k;phMain(p,'n',[k[0]-2,k[1]-5],1);phMain(p,'f',[k[0]-4,k[1]-5],1)});add('psoas','Fente basse (psoas)','étirement','20 s par jambe',{anc:'pf',decor:[{t:'tapis',x:140}],poses:[a,b]})}
 {const a=Q({t:178,tn:90,sn:90,pn:168,tf:90,sf:90,pf:168,x:110,h:.8}),b=Q({...a,t:120,hd:18,d:1.4,h:2.5});[a,b].forEach(p=>{const F=phFK(p),T=p===a?F.Ln.k:F.Ln.to;phMain(p,'n',[T[0]-(p===a?4:0),T[1]-5],1);phMain(p,'f',[T[0]-(p===a?6:2),T[1]-5],1)});add('ischios_assis','Ischios assis (mains vers les pieds)','étirement','20 s',{anc:'h',decor:[{t:'tapis',x:150}],poses:[a,b]})}
 {const a=Q({t:-92,hd:0,an:-92,ae:-92,fa:84,fe:92,tn:90,sn:90,pn:170,tf:88,sf:88,pf:170,x:140,h:.6}),b=Q({...a,tf:128,sf:128,pf:208,d:.9,h:.8});add('abduction','Fessiers : jambe levée sur le côté','renfo','10 par jambe',{anc:'h',decor:[{t:'tapis',x:150}],poses:[a,b]})}
 // Motricité, sauts
 {const st=x=>Q({x,h:.3}),cr=(x,av)=>Q({t:150,hd:20,an:av?60:-40,ae:av?80:-20,fa:av?58:-36,fe:av?78:-18,tn:62,sn:-30,pn:90,tf:60,sf:-32,pf:90,x,d:.35,h:.06}),ap=x=>Q({t:170,hd:5,an:120,ae:150,fa:118,fe:148,tn:100,sn:-15,pn:60,tf:98,sf:-17,pf:60,x,air:34,d:.42,h:0});
  add('haies_joints','Sauts de haies pieds joints','motricité','3 passages',{anc:'h',decor:[{t:'haie',x:120},{t:'haie',x:200}],poses:[st(60),cr(66),ap(120),cr(164,1),ap(200),cr(244,1),{...st(250),d:.4,h:.5}]})}
 {const s=(x,o)=>Q({t:170,x,...o});
  add('haies_alt','Haies : jambe d’attaque, jambe de retrait','motricité','2 passages par jambe',{anc:'h',decor:[{t:'haie',x:150}],poses:[
   s(70,{an:40,ae:100,fa:-40,fe:-10,tn:-10,sn:-15,pn:85,tf:60,sf:-10,pf:90,h:.1}),
   s(112,{t:160,an:-40,ae:-10,fa:60,fe:110,tn:-25,sn:-30,pn:20,tf:85,sf:20,pf:100,air:6,d:.3,h:0}),
   s(150,{t:150,hd:15,an:-50,ae:-20,fa:75,fe:85,tn:-30,sn:-100,pn:-10,tf:82,sf:52,pf:112,air:22,d:.28,h:0}),
   s(188,{t:168,an:60,ae:110,fa:-30,fe:-10,tn:88,sn:-5,pn:95,tf:-5,sf:-5,pf:90,d:.28,h:.05}),
   s(232,{an:-30,ae:10,fa:40,fe:100,tn:-12,sn:-20,pn:80,tf:50,sf:-15,pf:90,d:.35,h:.4})]})}
 {const cr=(x,av)=>Q({t:158,hd:14,an:av?50:-45,ae:av?70:-25,fa:av?40:-40,fe:av?60:-20,tn:45,sn:-30,pn:90,tf:-10,sf:-110,pf:-30,x,d:.3,h:.05}),ai=x=>Q({t:168,an:80,ae:120,fa:70,fe:110,tn:-12,sn:-22,pn:40,tf:-5,sf:-105,pf:-30,x,air:18,d:.35,h:0});
  add('cloche_pied','Sauts à cloche-pied','motricité','3 sauts, puis l’autre jambe',{anc:'h',poses:[Q({tf:-10,sf:-100,pf:-20,x:70,h:.4}),cr(74),ai(112),cr(150,1),ai(190),cr(228,1),Q({tf:-10,sf:-100,pf:-20,x:232,d:.4,h:.5})]})}
 {const a=Q({t:178,an:-40,ae:20,fa:70,fe:150,tn:95,sn:5,pn:100,tf:-4,sf:-6,pf:68,air:2,x:150,d:.22,h:.02}),b=Q({t:178,an:70,ae:150,fa:-40,fe:20,tn:-4,sn:-6,pn:68,tf:95,sf:5,pf:100,air:2,x:150,d:.22,h:.02});add('genoux','Montées de genoux','motricité','20 s',{anc:'h',poses:[a,b]})}
 {const a=Q({t:176,an:40,ae:100,fa:-30,fe:30,tn:-8,sn:-165,pn:-175,tf:2,sf:0,pf:68,air:2,x:150,d:.22,h:.02}),b=Q({t:176,an:-30,ae:30,fa:40,fe:100,tn:2,sn:0,pn:68,tf:-8,sf:-165,pf:-175,air:2,x:150,d:.22,h:.02});add('talons','Talons-fesses','motricité','20 s',{anc:'h',poses:[a,b]})}
 {const st=Q({x:150,h:.4}),cr=Q({t:145,hd:22,an:-45,ae:-25,fa:-42,fe:-22,tn:75,sn:-30,pn:90,tf:73,sf:-32,pf:90,x:150,d:.5,h:.15}),up=Q({t:178,an:165,ae:170,fa:160,fe:168,tn:2,sn:0,pn:20,tf:1,sf:-1,pf:22,air:28,x:150,d:.3,h:0});add('squat_saut','Squat sauté','motricité','6 répétitions',{anc:'h',poses:[st,cr,up,{...cr,an:70,ae:90,fa:68,fe:88,d:.3,h:.3},{...st,d:.5}]})}
 return L}
// Appuis vus de dessus. Unité = une case d'échelle ; G = pied gauche, D = pied droit ; levé = 1 (pied en l'air).
function phPresetsDessus(){const L=[],n=6;const add=(id,nom,theme,info,m)=>L.push({id,nom,theme,m:{v:1,vue:'dessus',theme,info,...m}});
 const seq=(start,steps)=>{const o=[{g:start.g.slice(),d:start.d.slice()}];steps.forEach(st=>{const p=o[o.length-1],q={g:p.g.slice(),d:p.d.slice()};if(st.g)q.g=st.g.slice();if(st.d)q.d=st.d.slice();if(st.s)q.s=1;o.push(q)});return o};
 const inv=P=>P.map(q=>({...q,g:[q.g[0],-q.g[1],q.g[2]].filter(v=>v!==undefined),d:[q.d[0],-q.d[1],q.d[2]].filter(v=>v!==undefined)}));// en reculant : gauche et droite changent de côté
 const E={t:'echelle',n},S0={g:[-.6,-.2],d:[-.6,.2]};
 {const st=[];for(let i=0;i<n;i++)st.push(i%2?{d:[i+.5,.12]}:{g:[i+.5,-.12]});st.push(n%2?{d:[n+.6,.2]}:{g:[n+.6,-.2]},n%2?{g:[n+.6,-.2]}:{d:[n+.6,.2]});add('ech_1','Échelle : 1 pied par case','motricité','2 allers-retours',{disp:E,face:0,tempo:.32,pas:seq(S0,st)})}
 {const st=[];for(let i=0;i<n;i++)st.push({g:[i+.5,-.2]},{d:[i+.5,.2]});st.push({g:[n+.6,-.2]},{d:[n+.6,.2]});add('ech_2','Échelle : 2 pieds par case','motricité','2 allers-retours',{disp:E,face:0,tempo:.26,pas:seq(S0,st)})}
 {const st=[];for(let i=0;i<n;i++)st.push({d:[i+.7,0]},{g:[i+.3,0]});st.push({d:[n+.7,0]},{g:[n+.3,0]});add('ech_cote','Échelle de côté : un pied entre, l’autre suit','motricité','2 allers-retours',{disp:E,face:-90,tempo:.3,pas:seq({g:[-.7,0],d:[-.3,0]},st)})}
 {const st=[];for(let i=0;i<n;i++)st.push({g:[i+.45,-.1]},{d:[i+.75,.06]});st.push({g:[n+.45,-.1]},{d:[n+.75,.06]});add('ech_croise','Échelle de côté : le pied le plus loin entre','motricité','2 allers-retours',{disp:E,face:-90,tempo:.34,pas:seq({g:[-.75,0],d:[-.3,0]},st)})}
 const icky=()=>{const st=[];let c='g';for(let i=0;i<n;i++){if(c=='g')st.push({d:[i+.5,.18]},{g:[i+.5,-.18]},{d:[i+1,.9]});else st.push({g:[i+.5,-.18]},{d:[i+.5,.18]},{g:[i+1,-.9]});c=c=='g'?'d':'g'}return seq({g:[0,-1.05],d:[0,-.7]},st)};
 add('ech_icky','Échelle : 2 pieds dedans, 1 ressort','motricité','2 allers-retours',{disp:E,face:0,tempo:.3,pas:icky()});
 add('ech_icky_r','Échelle : 2 dedans, 1 ressort, en reculant','motricité','2 allers-retours',{disp:E,face:180,tempo:.34,pas:inv(icky())});
 const io=()=>{const st=[];for(let i=0;i<n;i++)st.push({d:[i+.5,.18]},{g:[i+.5,-.18]},{g:[i+1,-1.05]},{d:[i+1,-.7]});return seq({g:[0,-1.05],d:[0,-.7]},st)};
 add('ech_io','Échelle : 2 pieds dedans, 2 pieds dehors','motricité','2 allers-retours',{disp:E,face:0,tempo:.3,pas:io()});
 add('ech_io_r','Échelle : 2 dedans, 2 dehors, en reculant','motricité','2 allers-retours',{disp:E,face:180,tempo:.34,pas:inv(io())});
 {const st=[];for(let i=0;i<n;i++)st.push({d:[i+.5,0]},{d:[i+.75,-.7]},{g:[i+1,-1.05]});add('ech_1dehors','Échelle : un pied toujours dehors','motricité','2 allers-retours par pied',{disp:E,face:0,tempo:.3,pas:seq({g:[0,-1.05],d:[.1,-.7]},st)})}
 {const st=[];for(let i=0;i<n;i++)st.push({d:[i+.7,0]},{g:[i+.3,0]},{d:[i+1.7,.95]},{g:[i+1.3,.95]});add('ech_cote_io','Échelle de côté : entrer, ressortir, avancer','motricité','2 allers-retours',{disp:E,face:-90,tempo:.3,pas:seq({g:[.3,.95],d:[.7,.95]},st.slice(0,4*n-2))})}
 {const st=[];for(let i=0;i<n;i++){const y=i%2?.95:-.95;st.push({d:[i+.7,0]},{g:[i+.3,0]},{d:[i+.7,y]},{g:[i+.3,y]})}add('ech_zigzag','Échelle de côté : ressortir devant, derrière','motricité','2 allers-retours',{disp:E,face:-90,tempo:.3,pas:seq({g:[-.3,.95],d:[.1,.95]},st)})}
 // Haies basses (5), une tous les 2 pas
 const H={t:'haies',n:5};
 {const st=[];for(let i=1;i<=5;i++)st.push({g:[2*i-.05,-.18],d:[2*i-.05,.18],s:1});add('haie_joints','Haies : sauts pieds joints','motricité','3 passages',{disp:H,face:0,tempo:.45,pas:seq({g:[-.1,-.18],d:[-.1,.18]},st)})}
 {const st=[];for(let i=1;i<=5;i++)st.push(i%2?{g:[2*i,-.12]}:{d:[2*i,.12]});st.push({g:[11,-.18]},{d:[11,.18]});add('haie_1appui','Haies : un pied après l’autre (1 appui)','motricité','3 passages',{disp:H,face:0,tempo:.4,pas:seq({g:[-.6,-.15],d:[-.1,.15]},st)})}
 {const st=[];for(let i=1;i<=5;i++)st.push({g:[2*i-.25,-.15]},{d:[2*i+.25,.15]});add('haie_2appuis','Haies : 2 appuis entre les haies','motricité','3 passages',{disp:H,face:0,tempo:.32,pas:seq({g:[-.6,-.15],d:[-.15,.15]},st)})}
 {const st=[];for(let i=1;i<=5;i++)st.push({g:[2*i-.22,0],d:[2*i+.22,0],s:1});add('haie_lat','Haies : sauts de côté pieds joints','motricité','3 passages',{disp:H,face:-90,tempo:.45,pas:seq({g:[-.22,0],d:[.22,0]},st)})}
 {const st=[];for(let i=1;i<=5;i++)st.push({d:[2*i,.15],g:[2*i-.35,-.2,1],s:1});add('haie_cloche','Haies : cloche-pied','motricité','2 passages par pied',{disp:H,face:0,tempo:.45,pas:seq({g:[-.35,-.2,1],d:[0,.15]},st)})}
 // Cerceaux (6)
 const C={t:'cerceaux',n:6},cx=i=>(i+.5)*1.5;
 {const st=[];for(let i=0;i<6;i++)st.push({g:[cx(i),-.18],d:[cx(i),.18],s:1});add('cer_joints','Cerceaux : pieds joints','motricité','3 passages',{disp:C,face:0,tempo:.42,pas:seq({g:[-.7,-.18],d:[-.7,.18]},st)})}
 {const st=[];for(let i=0;i<6;i++)st.push(i%2?{d:[cx(i),.08]}:{g:[cx(i),-.08]});add('cer_course','Cerceaux : un pied par cerceau','motricité','3 passages',{disp:C,face:0,tempo:.34,pas:seq({g:[-.9,-.15],d:[-.5,.15]},st)})}
 {const st=[];for(let i=0;i<6;i++)st.push({d:[cx(i),.05],g:[cx(i)-.35,-.25,1],s:1});add('cer_cloche','Cerceaux : cloche-pied','motricité','2 passages par pied',{disp:C,face:0,tempo:.42,pas:seq({g:[-.85,-.25,1],d:[-.5,.05]},st)})}
 {const st=[];for(let i=0;i<6;i++)st.push(i%2?{g:[cx(i),-.2],d:[cx(i),.2],s:1}:{g:[cx(i),-.85],d:[cx(i),.85],s:1});add('cer_ecart','Cerceaux : pieds écartés, pieds joints','motricité','3 passages',{disp:{t:'cerceaux',n:6},face:0,tempo:.42,pas:seq({g:[-.7,-.18],d:[-.7,.18]},st)})}
 return L}
function phPresets(){return phPresetsProfil().concat(phPresetsDessus())}
// ======================= Écran d'édition =======================
const PH_THEMES=[['renfo','Renfo'],['proprio','Proprio'],['étirement','Étirement'],['motricité','Motricité']];
let PH=null,PHMODE=false,phEt=1,phCur=0,phDrag=null,phHist=[],phRedo=[],phEditId=null,phFiltre='',phSaveT=null;
const $p=id=>document.getElementById(id),phCl=o=>JSON.parse(JSON.stringify(o));
function phSnap(){phHist.push(JSON.stringify(PH));if(phHist.length>60)phHist.shift();phRedo=[]}
function phUndo(){if(phHist.length){phRedo.push(JSON.stringify(PH));PH=JSON.parse(phHist.pop());phFix();phDraw()}}
function phRedoF(){if(phRedo.length){phHist.push(JSON.stringify(PH));PH=JSON.parse(phRedo.pop());phFix();phDraw()}}
function phFix(){const n=PH?(PH.vue=='dessus'?PH.pas.length:PH.poses.length):1;phCur=Math.max(0,Math.min(phCur,n-1))}
function phBrouillon(){try{localStorage.setItem('brouillon_physique',JSON.stringify({PH,phEditId}))}catch(e){}}
// Passer de l'éditeur de terrain à l'éditeur physique (et retour) : chacun garde sa fiche en cours.
function phMode(on){const ed=$p('editeur');if(on==PHMODE)return;
 if(on){phSaveT={editingId,varEdit};editingId=phEditId;varEdit=null}else{phEditId=editingId;if(phSaveT){editingId=phSaveT.editingId;varEdit=phSaveT.varEdit}}
 PHMODE=on;ed.classList.toggle('phy',on);$p('edT').classList.toggle('on',!on);$p('edP').classList.toggle('on',on);if(on){if(!PH)phEt=1;phDraw()}else if(typeof draw=='function')draw()}
function phCharger(m,id){PH=phCl(m);phEditId=id||null;editingId=phEditId;varEdit=null;copieDe=null;phCur=0;phHist=[];phRedo=[];phAller(2)}
function phModifier(id){const f=E.find(x=>x.id==id);if(!f||!f.schema_physique)return;show('e');phMode(true);phCharger(f.schema_physique,id)}
function phAller(n){if(n>1&&!PH)n=1;phEt=n;phDrag=null;phDraw();window.scrollTo({top:0})}
function phLib(){const L=phPresets().filter(p=>!phFiltre||p.theme==phFiltre);
 return`<div class="actions">${[['','Tous'],...PH_THEMES].map(([k,l])=>`<button class="${phFiltre==k?'on':''}" onclick="phFiltre='${k}';phDraw()">${l}</button>`).join('')}</div>
 <p class="hint">Choisis un mouvement proche de ton exercice : tu pourras bouger les bras et les jambes, ajouter des poses ou des appuis, puis l'enregistrer comme fiche.</p>
 <div class="phgrid">${L.map(p=>`<button onclick="phCharger(phPresets().find(x=>x.id=='${p.id}').m)">${renderPhys(p.m,{pose:p.m.vue=='profil'?Math.min(1,p.m.poses.length-1):0})}<span>${phEsc(p.nom)}</span></button>`).join('')}
 <button onclick="phCharger({v:1,vue:'profil',theme:'renfo',anc:'p',poses:[phQ({x:150})],decor:[]})">${renderPhys({v:1,vue:'profil',anc:'p',poses:[phQ({x:150})]})}<span>Joueur debout (vide)</span></button>
 <button onclick="phCharger({v:1,vue:'dessus',theme:'motricité',face:0,tempo:.38,disp:{t:'echelle',n:6},pas:[{g:[-.6,-.2],d:[-.6,.2]}]})">${renderPhys({v:1,vue:'dessus',disp:{t:'echelle',n:6},pas:[{g:[-.6,-.2],d:[-.6,.2]}]},{edit:1})}<span>Appuis à dessiner (vide)</span></button></div>`}
// ---------- profil : édition à la souris / au doigt ----------
const PH_H={N:['t','H'],Hd:['hd','N'],en:['an','S'],wn:['ae','en'],ef:['fa','S'],wf:['fe','ef'],kn:['tn','H'],an:['sn','kn'],ton:['pn','an'],kf:['tf','H'],af:['sf','kf'],tof:['pf','af']};
const PH_LIM={ae:['an',-5,165],fe:['fa',-5,165],sn:['tn',-160,5],sf:['tf',-160,5],pn:['sn',-10,125],pf:['sf',-10,125]};
function phVers(P,cam){return q=>{let x=cam.tx+cam.s*q[0],y=cam.ty+cam.s*q[1];if(PH.miroir)x=300-x;return[phR(x),phR(y)]}}
function phDe(cam){return(x,y)=>{if(PH.miroir)x=300-x;return[(x-cam.tx)/cam.s,(y-cam.ty)/cam.s]}}
function phEditProfil(){const P=PH.poses[phCur],cam=phDrag&&phDrag.cam||phCam(PH),T=phVers(P,cam),pts=phPts(P,PH.anc);let s=renderPhys(PH,{pose:phCur,cam,id:'phsv'});
 if(phCur>0){const g=renderPhys({...PH,info:''},{pose:phCur-1,cam}).replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'').replace(/<rect x="1"[^>]*\/>/,'').replace(/<rect x="2"[^>]*\/><line[^>]*\/>/,'');s=s.replace('</svg>',`<g opacity=".18" style="pointer-events:none">${g}</g></svg>`)}
 const hs=Object.keys(PH_H).sort((a,b)=>/f$/.test(b)-/f$/.test(a)).map(k=>{const q=T(pts[k]),far=/f$/.test(k);return`<g data-ph="${k}" transform="translate(${q[0]} ${q[1]})" style="cursor:grab"><circle r="10" fill="transparent"/><circle r="${k=='Hd'||k=='N'?4.5:3.8}" fill="${far?'#fff':'#e8731a'}" stroke="#e8731a" stroke-width="1.6"/></g>`}).join('');
 const h=T(pts.H),dec=(PH.decor||[]).map((d,i)=>{const q=T([d.x,PH_SOL-4]);return`<g data-dec="${i}" transform="translate(${q[0]} ${q[1]})" style="cursor:ew-resize"><rect x="-9" y="-9" width="18" height="14" fill="transparent"/><path d="M-6 0h12M-6 0l3-3M-6 0l3 3M6 0l-3-3M6 0l-3 3" stroke="#e8731a" stroke-width="1.4" fill="none"/></g>`}).join('');
 return s.replace('</svg>',`${dec}${hs}<g data-ph="H" transform="translate(${h[0]} ${h[1]})" style="cursor:move"><circle r="11" fill="transparent"/><rect x="-5" y="-5" width="10" height="10" rx="2" fill="#1b3a73" stroke="#e8b923" stroke-width="1.6"/></g></svg>`)}
function phPt(ev){const s=$p('phsv'),p=s.createSVGPoint();p.x=ev.clientX;p.y=ev.clientY;const q=p.matrixTransform(s.getScreenCTM().inverse());return[q.x,q.y]}
function phBind(){const s=$p('phsv');if(!s)return;
 s.onpointerdown=ev=>{const g=ev.target.closest('[data-ph],[data-dec],[data-pied]');if(!g)return;s.setPointerCapture(ev.pointerId);phSnap();const [x,y]=phPt(ev);
  if(PH.vue=='dessus'){phDrag={k:'pied',f:g.dataset.pied,G:dsGeo(PH)};return}
  const cam=phCam(PH),P=PH.poses[phCur];phDrag={k:g.dataset.ph,dec:g.dataset.dec,cam,x,y,x0:P.x??150,air0:P.air||0,dx0:g.dataset.dec!=null?PH.decor[+g.dataset.dec].x:0}};
 s.onpointermove=ev=>{if(!phDrag)return;const [x,y]=phPt(ev);
  if(phDrag.k=='pied'){const G=phDrag.G,u=v=>Math.round(v*4)/4,X=u((x-G.W(0,0)[0])/G.c),Y=u((y-G.W(0,0)[1])/G.c),q=PH.pas[phCur],o=q[phDrag.f];q[phDrag.f]=[X,Y].concat(o[2]?[1]:[]);phDraw();return}
  const P=PH.poses[phCur],cam=phDrag.cam,dw=(x-phDrag.x)/cam.s*(PH.miroir?-1:1);
  if(phDrag.dec!=null){PH.decor[+phDrag.dec].x=Math.round(phDrag.dx0+dw);phDraw();return}
  if(phDrag.k=='H'){P.x=Math.round(phDrag.x0+dw);P.air=Math.max(0,Math.round(phDrag.air0-(y-phDrag.y)/cam.s));phDraw();return}
  const [key,par]=PH_H[phDrag.k],w=phDe(cam)(x,y),pp=phPts(P,PH.anc),base=par=='S'?pp.N:pp[par];let a=phAng(w[0]-base[0],w[1]-base[1]);
  if(key=='hd')a=Math.max(-60,Math.min(60,phW(a-P.t)));
  const lim=PH_LIM[key];if(lim){const r=Math.max(lim[1],Math.min(lim[2],phW(a-P[lim[0]])));a=P[lim[0]]+r}
  P[key]=Math.round(a);phDraw()};
 s.onpointerup=s.onpointercancel=()=>{if(phDrag){phDrag=null;phDraw()}}}
// ---------- dessus : édition ----------
function phEditDessus(){const P=PH.pas,q=P[phCur],G=phDrag&&phDrag.G||dsGeo(PH),face=PH.face||0;let s=renderPhys(PH,{edit:1,id:'phsv'});
 const pied=(p,g,op,h)=>{const w=G.W(p[0],p[1]);return`<g ${h?`data-pied="${g?'g':'d'}" style="cursor:grab"`:'style="pointer-events:none"'} transform="translate(${w[0]} ${w[1]})"><circle r="${phR(G.c*.45)}" fill="transparent"/><g transform="rotate(${face})" opacity="${op*(p[2]?.55:1)}">${dsPied(G.c,g,g?DS_G:DS_D,h?'#e8731a':'#fff')}</g>${h?`<text y="${phR(G.c*.07)}" font-size="${phR(G.c*.22)}" font-weight="700" text-anchor="middle" fill="#fff" font-family="sans-serif" style="pointer-events:none">${g?'G':'D'}</text>`:''}</g>`};
 const prev=phCur>0?pied(P[phCur-1].g,1,.35)+pied(P[phCur-1].d,0,.35):'',m=G.W((q.g[0]+q.d[0])/2,(q.g[1]+q.d[1])/2);
 return s.replace('</svg>',`${prev}<g transform="translate(${m[0]} ${m[1]})" opacity=".35" style="pointer-events:none">${dsCorps(G.c,face)}</g>${pied(q.g,1,1,1)}${pied(q.d,0,1,1)}</svg>`)}
// ---------- barre, réglages ----------
function phBar(){if(PH.vue=='dessus'){const n=PH.pas.length;return PH.pas.map((_,j)=>`<button class="${j==phCur?'on':''}" onclick="phCur=${j};phDraw()">${j?'Pas '+j:'Départ'}</button>`).join('')+` <button onclick="phSnap();const q=phCl(PH.pas[phCur]);delete q.s;PH.pas.splice(phCur+1,0,q);phCur++;phDraw()">+ Pas</button>`+(n>1&&phCur?` <button class="del" onclick="phSnap();PH.pas.splice(phCur,1);phFix();phDraw()">🗑</button>`:'')}
 const n=PH.poses.length;return PH.poses.map((_,j)=>`<button class="${j==phCur?'on':''}" onclick="phCur=${j};phDraw()">Pose ${j+1}</button>`).join('')+` <button onclick="phSnap();const q=phCl(PH.poses[phCur]);PH.poses.splice(phCur+1,0,q);phCur++;phDraw()" title="Copie la pose, puis bouge-la">+ Pose</button>`+(n>1?` <button class="del" onclick="phSnap();PH.poses.splice(phCur,1);phFix();phDraw()">🗑</button>`:'')}
const PH_ANC=[['h','Hanche'],['p','Pied (jambe claire)'],['pf','Pied (jambe foncée)'],['m','Main (bras clair)'],['mf','Main (bras foncé)'],['g','Genou (jambe claire)']];
function phProps(){const sel=(id,v,opts,on)=>`<select id="${id}" onchange="${on}">${opts.map(([k,l])=>`<option value="${k}"${String(v)==String(k)?' selected':''}>${l}</option>`).join('')}</select>`;
 const com=`<label>Thème ${sel('ph_th',PH.theme||'renfo',PH_THEMES,"phSnap();PH.theme=this.value")}</label> <label>Bulle <input id="ph_info" value="${phEsc(PH.info||'')}" maxlength="30" placeholder="ex. 30 s, 8 par jambe" style="width:150px" onchange="phSnap();PH.info=this.value.trim();phDraw()"></label>`;
 if(PH.vue=='dessus'){const q=PH.pas[phCur],d=PH.disp||{t:'echelle',n:6};
  return`<div>${phCur?`<label class="chip"><input type="checkbox"${q.s?' checked':''} onchange="phSnap();PH.pas[phCur].s=this.checked?1:0;if(!this.checked)delete PH.pas[phCur].s;phDraw()"> Saut (les 2 pieds décollent)</label> `:''}<label class="chip"><input type="checkbox"${q.g[2]?' checked':''} onchange="phSnap();phLeve('g',this.checked)"> Pied gauche levé</label> <label class="chip"><input type="checkbox"${q.d[2]?' checked':''} onchange="phSnap();phLeve('d',this.checked)"> Pied droit levé</label></div><div><label class="chip"><input type="checkbox"${PH.incl?' checked':''} onchange="phSnap();if(this.checked)PH.incl=1;else delete PH.incl;phDraw()"> Vue inclinée, joueur debout (pour l’animation et la fiche ; on règle les pas vu de dessus)</label></div>
  <div>${sel('ph_disp',d.t,Object.entries(PH_DISP).map(([k,v])=>[k,v.n]),"phSnap();PH.disp={...(PH.disp||{}),t:this.value};phDraw()")} <label>nombre <input type="number" min="1" max="12" value="${d.n||6}" style="width:56px" onchange="phSnap();PH.disp={...(PH.disp||{t:'echelle'}),n:Math.max(1,Math.min(12,+this.value||1))};phDraw()"></label>
  <label>Joueur ${sel('ph_face',PH.face||0,[[0,'face à l’avant'],[-90,'de côté (regarde en haut)'],[90,'de côté (regarde en bas)'],[180,'de dos (recule)']],"phSnap();PH.face=+this.value;phDraw()")}</label>
  <label>Rythme ${sel('ph_tempo',PH.tempo||.38,[[.26,'rapide'],[.38,'normal'],[.55,'lent']],"phSnap();PH.tempo=+this.value")}</label></div><div>${com}</div>`}
 const P=PH.poses[phCur];
 return`<div><label>Arriver en <input type="number" min=".1" max="5" step=".1" value="${P.d??.8}" style="width:60px" onchange="phSnap();PH.poses[phCur].d=Math.max(.1,+this.value||.8)"> s</label> <label>Tenir <input type="number" min="0" max="10" step=".1" value="${P.h??.3}" style="width:60px" onchange="phSnap();PH.poses[phCur].h=Math.max(0,+this.value||0)"> s</label> <label>Saut <input type="range" min="0" max="50" value="${P.air||0}" oninput="PH.poses[phCur].air=+this.value;phDraw(1)" onchange="phSnap()"></label></div>
 <div><label>Point fixe ${sel('ph_anc',PH.anc||'h',PH_ANC,"phSnap();phAncrer(this.value)")}</label> <label class="chip"><input type="checkbox"${PH.miroir?' checked':''} onchange="phSnap();PH.miroir=this.checked;phDraw()"> Regarde à gauche</label></div>
 <div>Matériel : ${Object.entries(PH_DECOR).map(([k,v])=>`<button onclick="phSnap();PH.decor=PH.decor||[];PH.decor.push({t:'${k}',x:${k=='mur'?240:k=='tapis'?150:200}});phDraw()">+ ${v.n}</button>`).join('')}${(PH.decor||[]).map((d,i)=>` <button class="del" onclick="phSnap();PH.decor.splice(${i},1);phDraw()">✕ ${PH_DECOR[d.t].n}</button>`).join('')}</div><div>${com}</div>`}
function phLeve(k,on){const q=PH.pas[phCur];q[k]=on?[q[k][0],q[k][1],1]:[q[k][0],q[k][1]];phDraw()}
// Changer de point fixe sans faire sauter le joueur : on garde sa position actuelle.
function phAncrer(a){PH.poses.forEach(p=>{const w=phPts(p,PH.anc),k={h:'H',p:'an',pf:'af',m:'wn',mf:'wf',g:'kn'}[a];p.x=Math.round(w[k][0])});PH.anc=a;phDraw()}
function phHint(){if(phEt==3)return'Vérifie que l’animation montre bien le mouvement.';
 if(PH.vue=='dessus')return phCur?'Glisse le pied qui bouge (G ou D) à sa nouvelle place. Les traces numérotées montrent l’ordre des appuis.':'Départ : place les deux pieds, puis « + Pas » pour chaque appui.';
 return'Glisse les ronds orange pour plier bras, jambes, tête et buste (ronds blancs : côté foncé, le plus loin). Le carré bleu déplace le joueur ou le fait sauter. « + Pose » ajoute l’étape suivante.'}
function phDraw(lite){const box=$p('phys');if(!box||!PHMODE)return;
 [1,2,3,4].forEach(k=>$p('phT'+k).classList.toggle('on',phEt==k));
 $p('phtitre').textContent=phEditId&&E.find(x=>x.id==phEditId)?'Modification : '+E.find(x=>x.id==phEditId).titre:'Nouvel exercice sans ballon';
 $p('phlib').classList.toggle('hide',phEt!=1);$p('phed').classList.toggle('hide',phEt==1||!PH);$p('phvis').classList.toggle('hide',phEt!=3);
 if(phEt==1){$p('phlib').innerHTML=phLib();$p('phsuiv').textContent=PH?'Reprendre l’exercice en cours →':'';$p('phsuiv').classList.toggle('hide',!PH);phBrouillon();return}
 $p('phbar').innerHTML=phEt==2?phBar():'';$p('phhint').textContent=phHint();
 if(phEt==3)$p('phcv').innerHTML=renderPhys(PH,{anim:true,speed:+$p('phspeed').value||1});
 else{$p('phcv').innerHTML=PH.vue=='dessus'?phEditDessus():phEditProfil();phBind();if(!lite)$p('phprops').innerHTML=phProps()}
 $p('phprops').classList.toggle('hide',phEt!=2);$p('phvue').classList.toggle('hide',PH.vue!='dessus');$p('phsuiv').textContent=phEt==2?'Suivant : voir l’animation →':'Enregistrer la fiche →';$p('phsuiv').classList.remove('hide');
 $p('phundo').disabled=!phHist.length;$p('phredo').disabled=!phRedo.length;phBrouillon()}
function phBascule(b,id){const e=E.find(x=>x.id==id);if(!e||!e.schema_physique)return;const cur=b.dataset.i!=null?b.dataset.i=='1':!!e.schema_physique.incl,nv=!cur,sv=b.closest('figure').querySelector('svg');if(sv)sv.outerHTML=renderPhys({...e.schema_physique,incl:nv?1:0},{anim:true});b.dataset.i=nv?'1':'0';b.textContent=nv?'Vue de dessus':'Vue inclinée'}
function phSuivant(){if(phEt==1&&PH)return phAller(2);if(phEt==2)return phAller(3);phFiche()}
// Étape ④ : on réutilise le formulaire de fiche de l'éditeur de terrain (PHMODE = le schéma enregistré est PH).
function phFiche(){if(!PH)return;editingId=phEditId&&E.find(x=>x.id==phEditId)?phEditId:null;varEdit=null;etapeFiche()}
function phInit(){const ed=$p('editeur');if(!ed||$p('phys'))return;
 ed.insertAdjacentHTML('afterbegin',`<div id="edtype" class="steps noprint"><button id="edT" class="on" onclick="phMode(false)">⚽ Terrain (avec ballon)</button><button id="edP" onclick="phMode(true)">🤸 Renfo, proprio, étirement, motricité</button></div>
 <div id="phys"><p id="phtitre" class="edtitre"></p><div class="steps"><button id="phT1" onclick="phAller(1)">① Choisir</button><button id="phT2" onclick="phAller(2)">② Ajuster</button><button id="phT3" onclick="phAller(3)">③ Voir</button><button id="phT4" onclick="phFiche()">④ Fiche</button></div>
 <div id="phlib"></div><div id="phed"><div id="phbar" class="actions"></div><div id="phvis" class="actions hide"><button onclick="const s=$p('phcv').querySelector('svg');if(s.animationsPaused()){s.unpauseAnimations();this.textContent='⏸ Pause'}else{s.pauseAnimations();this.textContent='▶ Lecture'}">⏸ Pause</button><select id="phspeed" onchange="phDraw()"><option value=".5">Lent</option><option value="1" selected>Normal</option><option value="1.5">Rapide</option></select><button onclick="pngDe(renderPhys(PH,{pose:Math.min(1,(PH.poses||[1]).length-1)}),'schema')">Image PNG</button><button id="phvue" onclick="if(PH.vue!='dessus')return;phSnap();if(PH.incl)delete PH.incl;else PH.incl=1;phDraw()">Vue inclinée / de dessus</button></div>
 <div id="phcv" class="sch"></div><p id="phhint" class="hint"></p><div id="phprops" class="actions phprops"></div></div>
 <div class="actions"><button id="phsuiv" class="add big" onclick="phSuivant()"></button><button id="phundo" onclick="phUndo()">↶ Annuler</button><button id="phredo" onclick="phRedoF()">↷ Rétablir</button><button onclick="if(!PH||confirm('Choisir un autre mouvement ? L’exercice en cours sera remplacé.')){PH=null;phEditId=null;phAller(1)}">Nouveau</button></div></div>`);
 try{const b=JSON.parse(localStorage.getItem('brouillon_physique')||'null');if(b&&b.PH){PH=b.PH;phEditId=b.phEditId||null;phEt=2}}catch(e){}}
phInit();
