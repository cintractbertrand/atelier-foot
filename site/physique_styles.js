/* Rendus du joueur de profil (au choix de l'utilisateur) : Réaliste, Mannequin 3D, Analyse.
   Chaque rendu dessine le joueur à partir des articulations (mêmes poses que le rendu classique).
   L'animation est reconstruite en SMIL : le dessin est calculé à chaque image, et ce qui change (chemins, positions,
   rotations) est animé avec la même chronologie que le rendu classique. Export PNG et impression restent donc valables. */
(function(){if(typeof phCorps=='undefined'||typeof PH_SOL=='undefined')return;
const NV='#1b3a73',ND='#0f2347',GO='#e8b923',GOD='#b48a10',SOL=PH_SOL;
const r=v=>Math.round(v*10)/10,f2=q=>r(q[0])+' '+r(q[1]),sm=s=>s*s*(3-2*s),lp=(a,b,u)=>[a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u];
/* ---------- formes : segment effilé (largeur w0 → wm → w1), décalable pour les reflets ---------- */
function shape(a,b,w0,wm,w1,tm=.4,off=0,k=1){
 const dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy)||1,nx=-dy/L,ny=dx/L,N=5,le=[],ri=[];
 const W=u=>(u<tm?w0+(wm-w0)*sm(u/tm):wm+(w1-wm)*sm((u-tm)/(1-tm)))*k/2;
 for(let i=0;i<=N;i++){const u=i/N,w=W(u),cx=a[0]+dx*u+nx*off,cy=a[1]+dy*u+ny*off;le.push([cx+nx*w,cy+ny*w]);ri.push([cx-nx*w,cy-ny*w])}
 const r1=W(1),r0=W(0);
 return'M'+f2(le[0])+le.slice(1).map(q=>'L'+f2(q)).join('')+`A${r(r1)} ${r(r1)} 0 0 0 ${f2(ri[N])}`+ri.slice(0,N).reverse().map(q=>'L'+f2(q)).join('')+`A${r(r0)} ${r(r0)} 0 0 0 ${f2(le[0])}Z`}
const LIGHT=[-.5,-.85];
function vol(a,b,w0,wm,w1,tm,fill,hl=.22,sh=.1){ // segment avec reflet (côté lumière) et ombre
 const dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy)||1,s=((-dy/L)*LIGHT[0]+(dx/L)*LIGHT[1])>0?1:-1,m=Math.max(w0,wm,w1);
 return`<path d="${shape(a,b,w0,wm,w1,tm)}" fill="${fill}"/>`+(hl?`<path d="${shape(a,b,w0,wm,w1,tm,s*m*.2,.4)}" fill="#fff" opacity="${hl}"/>`:'')+(sh?`<path d="${shape(a,b,w0,wm,w1,tm,-s*m*.26,.34)}" fill="#000" opacity="${sh}"/>`:'')}
const cap=(a,b,w0,w1,fill)=>`<path d="${shape(a,b,w0,(w0+w1)/2,w1,.5)}" fill="${fill}"/>`;
const circ=(c,rr,fill,ex='')=>`<circle cx="${r(c[0])}" cy="${r(c[1])}" r="${rr}" fill="${fill}" ${ex}/>`;
const unit=(a,b)=>{const d=Math.hypot(b[0]-a[0],b[1]-a[1])||1;return[(b[0]-a[0])/d,(b[1]-a[1])/d]};
const headRot=j=>Math.atan2(j.Hd[0]-j.N[0],-(j.Hd[1]-j.N[1]))*180/Math.PI;
// articulations en coordonnées du dessin
function joints(F,o){const T=q=>[q[0]+o[0],q[1]+o[1]],A=a=>({e:T(a.e),w:T(a.w),m:T(a.m)}),L=l=>({k:T(l.k),a:T(l.a),to:T(l.to),he:T(l.he)});
 return{H:T(F.H),N:T(F.N),S:T(F.S),Hd:T(F.Hd),an:A(F.An),af:A(F.Af),ln:L(F.Ln),lf:L(F.Lf)}}
// chaussure vue de profil : talon, pointe, cheville
function botte(l,fill,sole){const s=unit(lp(l.he,l.to,.2),l.a),u=unit(l.he,l.to),A=l.a,tu=[l.to[0]+s[0]*5,l.to[1]+s[1]*5],ins=[lp(l.he,l.to,.62)[0]+s[0]*9,lp(l.he,l.to,.62)[1]+s[1]*9],af=[A[0]+u[0]*3.4,A[1]+u[1]*3.4],ab=[A[0]-u[0]*3.4,A[1]-u[1]*3.4];
 const pts=[l.he,l.to,tu,ins,af,ab].map(f2).join('L');return`<path d="M${pts}Z" fill="${fill}" stroke="${fill}" stroke-width="1.8" stroke-linejoin="round"/><line x1="${r(l.he[0])}" y1="${r(l.he[1])}" x2="${r(l.to[0])}" y2="${r(l.to[1])}" stroke="${sole}" stroke-width="1.7" stroke-linecap="round"/>`}
function ombre(j,p,fill,op){const x=(j.ln.a[0]+j.lf.a[0])/2,k=1-(p.air||0)/160;return`<ellipse cx="${r(x)}" cy="${PH_SOL+1}" rx="${r(26*k)}" ry="3.2" fill="${fill}" opacity="${op*k}" filter="url(#blur)"/>`}

const DEFS='<defs><radialGradient id="jb" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff"/><stop offset=".5" stop-color="#d7dbe3"/><stop offset="1" stop-color="#8d95a6"/></radialGradient><radialGradient id="jbd" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#e3e6ec"/><stop offset=".5" stop-color="#aab1bf"/><stop offset="1" stop-color="#6b7384"/></radialGradient><radialGradient id="jn" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#6c92d8"/><stop offset=".5" stop-color="#274b8f"/><stop offset="1" stop-color="#0d2349"/></radialGradient><filter id="blur" x="-30%" y="-100%" width="160%" height="300%"><feGaussianBlur stdDeviation="2.2"/></filter><filter id="glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="1.8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>';
/* ---------- B · Réaliste : peau, maillot, short, chaussettes, crampons, volumes ---------- */
function drawB(j,p){const sk='#eab58c',skD='#c98f68',je=NV,jeD=ND,so=GO,soD=GOD;
 const arm=(A,ff)=>{const s=ff?skD:sk,m=ff?jeD:je;return vol(j.S,A.e,7.4,7.8,5.8,.35,s)+vol(j.S,lp(j.S,A.e,.42),10,10,9,.5,m,ff?0:.2)+vol(A.e,A.w,5.8,6.6,4,.3,s)+`<ellipse cx="${r(lp(A.w,A.m,.55)[0])}" cy="${r(lp(A.w,A.m,.55)[1])}" rx="3" ry="3.8" fill="${s}"/>`};
 const leg=(L,ff)=>{const s=ff?skD:sk,sh=ff?'#08162e':ND,k=ff?soD:so;return vol(j.H,L.k,13,12.6,8.8,.3,s)+vol(j.H,lp(j.H,L.k,.64),15,14.4,13,.5,sh,ff?0:.18)+vol(L.k,L.a,8.6,9.6,5.8,.3,s)+vol(lp(L.k,L.a,.42),L.a,7.6,7.4,5.8,.5,k,.2)+botte(L,ff?'#2b2b2b':'#161616','#f2f2f2')};
 const th=headRot(j);
 const head=`<g transform="translate(${f2(j.Hd)})"><g transform="rotate(${r(th)})"><circle r="9.6" fill="#3a2a1d"/><circle cx="1.8" cy="1.2" r="8" fill="${sk}"/><ellipse cx="9.4" cy="2.2" rx="1.9" ry="2.4" fill="${sk}"/><ellipse cx="-1.6" cy=".8" rx="1.7" ry="2.4" fill="${skD}"/><circle cx="5.4" cy="-.4" r="1" fill="#2a1d14"/><path d="M-9 -2C-8 -9 3 -11 9 -4C5 -6 -1 -5 -4 -2Z" fill="#3a2a1d"/><path d="M-6 8Q-1 9 4 8" stroke="#fff" stroke-opacity=".25" fill="none"/></g></g>`;
 return ombre(j,p,'#000',.35)+arm(j.af,1)+leg(j.lf,1)
  +vol(j.H,j.N,16,15.4,18.5,.5,je,.2,.14)+circ(j.H,8.6,ND)
  +vol(j.N,lp(j.N,j.Hd,.5),5.8,5.4,5.4,.5,sk,.2,.1)+circ(j.N,4.8,'none',`stroke="${GO}" stroke-width="1.8"`)+head
  +leg(j.ln,0)+arm(j.an,0)}

/* ---------- C · Mannequin 3D : argile claire, volumes, buste bleu club ---------- */
function drawC(j,p){const CL='#d7dbe3',CLD='#aab1bf';
 const arm=(A,ff)=>{const c=ff?CLD:CL,g=ff?'url(#jbd)':'url(#jb)';return vol(j.S,A.e,6.4,6.6,5,.4,c,.55,.16)+circ(A.e,3.6,g)+vol(A.e,A.w,5,5.4,3.6,.35,c,.55,.16)+circ(A.w,2.8,g)+`<ellipse cx="${r(lp(A.w,A.m,.6)[0])}" cy="${r(lp(A.w,A.m,.6)[1])}" rx="2.7" ry="3.6" fill="${g}"/>`};
 const leg=(L,ff)=>{const c=ff?CLD:CL,g=ff?'url(#jbd)':'url(#jb)';return vol(j.H,L.k,11,11,7.6,.3,c,.55,.18)+circ(L.k,4.8,g)+vol(L.k,L.a,7.6,8.2,5,.3,c,.55,.18)+circ(L.a,3.4,g)+botte(L,c,ff?NV:'#2c56a8').replace(/stroke-width="1.8"/,'stroke-width="2.2"')};
 const th=headRot(j),c=lp(j.H,j.S,.42);
 return ombre(j,p,'#556',.4)+arm(j.af,1)+leg(j.lf,1)
  +vol(j.H,c,13.5,14.2,14,.5,'#14305f',.3,.2)+vol(c,j.S,15,17.5,15,.5,'#274b8f',.45,.2)
  +`<path d="${shape(lp(c,j.S,.55),lp(c,j.S,.66),17,17,17)}" fill="${GO}" opacity=".9"/>`
  +circ(c,4.4,'url(#jb)')+circ(j.H,6.6,'url(#jb)')+circ(j.S,5,'url(#jb)')
  +vol(j.N,lp(j.N,j.Hd,.5),4.8,4.6,4.6,.5,CL,.55,.15)
  +`<g transform="translate(${f2(j.Hd)})"><g transform="rotate(${r(th)})"><ellipse rx="7.6" ry="9.4" fill="url(#jb)"/><ellipse cx="7.8" cy="1.8" rx="1.8" ry="2.4" fill="#c4c9d4"/></g></g>`
  +leg(j.ln,0)+arm(j.an,0)}

/* ---------- D · Analyse : squelette lumineux, angle du genou ---------- */
function drawD(j,p){const CY='#6ee7ff',CYD='#2a8fb0',GL='#ffd76a';
 const ln=(a,b,c,w)=>`<line x1="${r(a[0])}" y1="${r(a[1])}" x2="${r(b[0])}" y2="${r(b[1])}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;
 const jt=(q,c)=>circ(q,2.6,'#0a1631',`stroke="${c}" stroke-width="1.6"`);
 const arm=(A,c,w)=>ln(j.S,A.e,c,w)+ln(A.e,A.w,c,w)+jt(A.e,c)+jt(A.w,c);
 const leg=(L,c,w)=>ln(j.H,L.k,c,w)+ln(L.k,L.a,c,w)+ln(L.a,L.to,c,w)+ln(L.a,L.he,c,w)+jt(L.k,c)+jt(L.a,c);
 const k=j.ln.k,v1=unit(k,j.H),v2=unit(k,j.ln.a),R=11,p1=[k[0]+v1[0]*R,k[1]+v1[1]*R],p2=[k[0]+v2[0]*R,k[1]+v2[1]*R],sw=(v1[0]*v2[1]-v1[1]*v2[0])>0?1:0,ang=Math.round(180-Math.abs(phW(p.sn-p.tn))),lab=[k[0]+14,k[1]-5];
 return `<g filter="url(#glow)">`+arm(j.af,CYD,2.4)+leg(j.lf,CYD,2.6)
  +`<path d="${shape(j.H,j.N,15,15,17,.5)}" fill="${GO}" opacity=".3"/>`+ln(j.H,j.S,GL,4.2)+ln(j.N,lp(j.N,j.Hd,.4),GL,2.4)+circ(j.Hd,9.2,'none',`stroke="${GL}" stroke-width="2"`)+jt(j.H,GL)+jt(j.S,GL)
  +leg(j.ln,CY,3.2)+arm(j.an,CY,3)+`</g>`
  +`<path d="M${f2(k)}L${f2(p1)}A${R} ${R} 0 0 ${sw} ${f2(p2)}Z" fill="${GL}" opacity=".3"/><text x="${r(lab[0])}" y="${r(lab[1])}" font-size="8.5" font-weight="700" fill="${GL}" font-family="system-ui,sans-serif">${ang}°</text>`}


// ---------- animation : transforme N dessins successifs (même structure) en un dessin animé SMIL ----------
function tokens(s){return s.match(/<[^>]+>|[^<]+/g)||[]}
function attrs(t){const o=[];t.replace(/([\w:-]+)="([^"]*)"/g,(m,k,v)=>{o.push([k,v]);return m});return o}
function animer(list,an,op){
 const T=list.map(tokens),n=T[0].length;
 if(T.some(t=>t.length!=n)||list.length<2)return list[0];
 const calcD=an.replace(/calcMode="linear"\s*/,'');
 const animsDe=col=>{const at=col.map(attrs),keys=at[0].map(a=>a[0]),dyn=[];
  keys.forEach((k,q)=>{const vs=at.map(a=>a[q]&&a[q][0]==k?a[q][1]:null);if(vs.some(v=>v===null))return;if(vs.some(v=>v!==vs[0]))dyn.push([k,vs])});
  return dyn.map(([k,vs])=>{
   if(k=='transform'){const ty=/^(\w+)\(/.exec(vs[0])[1],nums=vs.map(v=>/\(([^)]*)\)/.exec(v)[1]);let vals=nums;
    if(ty=='rotate'){let prev=null;vals=nums.map(x=>{let a=parseFloat(x);if(prev!==null){while(a-prev>180)a-=360;while(a-prev<-180)a+=360}prev=a;return r(a)})}
    return`<animateTransform attributeName="transform" type="${ty}" values="${vals.join(';')}" ${an}/>`}
   return`<animate attributeName="${k}" values="${vs.join(';')}" ${an}/>`}).join('')};
 let out='';
 for(let i=0;i<n;i++){
  const col=T.map(t=>t[i]);
  if(col.every(x=>x===col[0])){out+=col[0];continue}
  if(col[0][0]!='<')continue; // texte variable : déjà traité avec sa balise
  const nom=/^<(\w+)/.exec(col[0])[1];
  if(nom=='text'&&T[0][i+1]&&T[0][i+1][0]!='<'){ // texte qui change : une copie par valeur, affichée à son tour
   const tx=T.map(t=>t[i+1]),vals=[...new Set(tx)],an2=animsDe(col);
   vals.forEach(v=>{out+=col[0].replace(/>$/,'>')+an2+`<animate attributeName="display" calcMode="discrete" values="${tx.map(c=>c===v?'inline':'none').join(';')}" ${calcD}/>`+v+'</text>'});
   i+=2;continue}
  const anim=animsDe(col),tag=col[0];
  out+=tag.endsWith('/>')?tag.slice(0,-2)+'>'+anim+'</'+nom+'>':tag+anim}
 return out}
// ---------- vue de face : mêmes rendus à partir des articulations de face ----------
function faceJ(F,o){const T=q=>[q[0]+o[0],q[1]+o[1]],A=a=>({S:T(a.S),e:T(a.e),w:T(a.w),m:T(a.m)}),L=l=>({P:T(l.P),k:T(l.k),a:T(l.a),b:T(l.b)});
 return{H:T(F.H),N:T(F.N),Hd:T(F.Hd),Ag:A(F.Ag),Ad:A(F.Ad),Lg:L(F.Lg),Ld:L(F.Ld)}}
function tronc(j){const u=unit(j.H,j.N),n=[-u[1],u[0]],sg=((j.Ag.S[0]-j.Ad.S[0])*n[0]+(j.Ag.S[1]-j.Ad.S[1])*n[1])>0?1:-1,w=8.8,wg=[j.H[0]+n[0]*sg*w,j.H[1]+n[1]*sg*w],wd=[j.H[0]-n[0]*sg*w,j.H[1]-n[1]*sg*w];return{u,n,sg,wg,wd,poly:`M${f2(j.Ag.S)}L${f2(j.Ad.S)}L${f2(wd)}L${f2(wg)}Z`}}
function teteFace(j,fond,peau,chev,traits){const th=headRot(j);return`<g transform="translate(${f2(j.Hd)})"><g transform="rotate(${r(th)})">`+(chev?`<circle r="9.9" fill="${chev}"/>`:'')+`<ellipse cy="${chev?1.2:0}" rx="8.4" ry="9.4" fill="${fond}"/>`+(traits?`<ellipse cx="-9" cy="1" rx="1.8" ry="2.6" fill="${peau}"/><ellipse cx="9" cy="1" rx="1.8" ry="2.6" fill="${peau}"/><circle cx="-3.3" cy="0" r="1.1" fill="#1a1410"/><circle cx="3.3" cy="0" r="1.1" fill="#1a1410"/><path d="M-5.6 -2.6Q-3.3 -4 -1.4 -2.8M1.4 -2.8Q3.3 -4 5.6 -2.6" stroke="#1a1410" stroke-width="1" fill="none" stroke-linecap="round"/><path d="M0 1.5L-1.2 4.6L1.2 4.6" stroke="#a0654a" stroke-width=".9" fill="none"/><path d="M-3 6.8Q0 8.4 3 6.8" stroke="#7a3a2a" stroke-width="1.1" fill="none" stroke-linecap="round"/><path d="M-9.4 -1C-9.6 -9.4 9.6 -9.4 9.4 -1C6 -5.4 -6 -5.4 -9.4 -1Z" fill="${chev}"/>`:'')+`</g></g>`}
function faceB(j){const sk='#eab58c',skD='#c98f68',T=tronc(j);
 const leg=L=>vol(L.P,L.k,13.6,13.2,9.4,.3,sk)+vol(L.P,lp(L.P,L.k,.7),16.4,15.6,14.4,.5,ND,.18)+vol(L.k,L.a,9,10.2,6.4,.3,sk)+vol(lp(L.k,L.a,.42),L.a,8.6,8.4,6.8,.5,GO,.2)+cap(L.a,L.b,10,8.4,'#161616')+`<path d="${shape(lp(L.a,L.b,.1),lp(L.a,L.b,.9),3,3,3,.5,-2)}" fill="#fff" opacity=".5"/>`;
 const arm=(A)=>vol(A.S,A.e,9.4,9.8,7,.3,sk)+vol(A.S,lp(A.S,A.e,.45),12,11.8,10.8,.5,NV,.25)+`<path d="${shape(lp(A.S,A.e,.42),lp(A.S,A.e,.48),11.6,11.6,11)}" fill="${GO}"/>`+vol(A.e,A.w,7,7.8,4.6,.28,sk)+cap(A.w,A.m,6.4,5,sk);
 return leg(j.Ld)+leg(j.Lg)+`<path d="${T.poly}" fill="${NV}" stroke="${NV}" stroke-width="5" stroke-linejoin="round"/><path d="M${f2(lp(j.Ag.S,j.Ad.S,.2))}L${f2(lp(j.Ag.S,j.Ad.S,.5))}L${f2(lp(T.wd,T.wg,.5))}L${f2(lp(T.wd,T.wg,.15))}Z" fill="#fff" opacity=".12"/>`
  +circ(j.H,9.6,ND)+`<path d="M${f2(lp(j.N,j.H,.04))}L${f2(lp(j.N,j.H,.04))}" stroke="none"/><path d="M${f2([j.N[0]-T.n[0]*3.6,j.N[1]-T.n[1]*3.6])}L${f2(lp(j.N,j.H,.16))}L${f2([j.N[0]+T.n[0]*3.6,j.N[1]+T.n[1]*3.6])}" stroke="${GO}" stroke-width="1.8" fill="none" stroke-linejoin="round"/>`
  +cap(j.N,lp(j.N,j.Hd,.55),6,5.6,sk)+arm(j.Ad)+arm(j.Ag)+teteFace(j,sk,skD,'#3a2a1d',1)}
function faceC(j){const CL='#d7dbe3',T=tronc(j);
 const leg=L=>vol(L.P,L.k,11,11,7.6,.3,CL,.55,.18)+circ(L.k,4.8,'url(#jb)')+vol(L.k,L.a,7.6,8.2,5,.3,CL,.55,.18)+circ(L.a,3.4,'url(#jb)')+cap(L.a,L.b,8,6.6,CL)+circ(L.P,5.6,'url(#jb)');
 const arm=A=>vol(A.S,A.e,6.4,6.6,5,.4,CL,.55,.16)+circ(A.e,3.6,'url(#jb)')+vol(A.e,A.w,5,5.4,3.6,.35,CL,.55,.16)+circ(A.w,2.8,'url(#jb)')+cap(A.w,A.m,5.4,4.4,CL)+circ(A.S,5.2,'url(#jb)');
 return leg(j.Ld)+leg(j.Lg)+`<path d="${T.poly}" fill="#274b8f" stroke="#274b8f" stroke-width="5" stroke-linejoin="round"/><path d="M${f2(lp(j.Ag.S,j.Ad.S,.15))}L${f2(lp(j.Ag.S,j.Ad.S,.5))}L${f2(lp(T.wd,T.wg,.5))}L${f2(lp(T.wd,T.wg,.1))}Z" fill="#fff" opacity=".18"/>`
  +circ(j.H,8.8,'url(#jn)')+vol(j.N,lp(j.N,j.Hd,.5),4.8,4.6,4.6,.5,CL,.55,.15)+arm(j.Ad)+arm(j.Ag)
  +`<g transform="translate(${f2(j.Hd)})"><g transform="rotate(${r(headRot(j))})"><ellipse rx="7.6" ry="9.4" fill="url(#jb)"/></g></g>`}
function faceD(j){const CY='#6ee7ff',GL='#ffd76a',T=tronc(j);
 const ln=(a,b,c,w)=>`<line x1="${r(a[0])}" y1="${r(a[1])}" x2="${r(b[0])}" y2="${r(b[1])}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`,jt=(q,c)=>circ(q,2.6,'#0a1631',`stroke="${c}" stroke-width="1.6"`);
 const leg=L=>ln(L.P,L.k,CY,3)+ln(L.k,L.a,CY,3)+ln(L.a,L.b,CY,3)+jt(L.k,CY)+jt(L.a,CY),arm=A=>ln(A.S,A.e,CY,2.8)+ln(A.e,A.w,CY,2.8)+jt(A.e,CY)+jt(A.w,CY);
 return`<g filter="url(#glow)"><path d="${T.poly}" fill="${GO}" opacity=".3"/>`+leg(j.Ld)+leg(j.Lg)+ln(j.Ag.S,j.Ad.S,GL,3)+ln(j.H,j.N,GL,3.2)+ln(j.Lg.P,j.Ld.P,GL,3)+arm(j.Ad)+arm(j.Ag)+jt(j.H,GL)+jt(j.Ag.S,GL)+jt(j.Ad.S,GL)+circ(j.Hd,9.2,'none',`stroke="${GL}" stroke-width="2"`)+`</g>`}
const FACE={realiste:faceB,mannequin:faceC,analyse:faceD};

// ---------- appuis (dessus et inclinée) : chaussures de dessus selon le rendu, palette du joueur ----------
const PAL_ST={mannequin:{peau:'#d7dbe3',peau2:'#aab1bf',chev:'#aab1bf'},analyse:{peau:'#6ee7ff',peau2:'#2a8fb0',chev:'#ffd76a'}};
const PIED={
 realiste:(c,g)=>{const k=g?-1:1,col=g?'#161616':'#2b2b2b';return`<g transform="scale(${r(c/44)})"><path d="M-10 ${-3.4*k}Q-11.5 0 -10 ${3.4*k}L-2 ${4.6*k}Q6 ${5*k} 11 ${2.2*k}Q13.2 0 11 ${-2.2*k}Q6 ${-4.6*k} -2 ${-4.6*k}Z" fill="${col}" stroke="#f2f2f2" stroke-width="1"/><path d="M-3 ${-2*k}L2 ${2*k}M0 ${-3*k}L5 ${.6*k}" stroke="${g?GO:'#888'}" stroke-width=".9"/><circle cx="-6" cy="${-2*k}" r="1" fill="#ddd"/><circle cx="-6" cy="${2*k}" r="1" fill="#ddd"/><circle cx="6" cy="${-2*k}" r="1" fill="#ddd"/><circle cx="6.4" cy="${1.8*k}" r="1" fill="#ddd"/></g>`},
 mannequin:(c,g)=>`<g transform="scale(${r(c/44)})">${PIED0_shape(g,'#d7dbe3','#8d95a6')}</g><circle r="${r(c*.06)}" fill="${g?NV:GO}" stroke="#fff" stroke-width=".8"/>`,
 analyse:(c,g)=>`<g filter="url(#glow)"><g transform="scale(${r(c/44)})">${PIED0_shape(g,g?'#6ee7ff44':'#ff9d3a44',g?'#6ee7ff':'#ff9d3a')}</g></g>`};
function PIED0_shape(g,fill,stroke){const k=g?-1:1;return`<path d="M-10 ${-3.4*k}Q-11.5 0 -10 ${3.4*k}L-2 ${4.6*k}Q6 ${5*k} 11 ${2.2*k}Q13.2 0 11 ${-2.2*k}Q6 ${-4.6*k} -2 ${-4.6*k}Z" fill="${fill}" stroke="${stroke}" stroke-width="1.1"/>`}


// ---------- registre des rendus ----------
window.PH_STYLES={classique:{n:'Classique'},realiste:{n:'Réaliste',draw:drawB},mannequin:{n:'Mannequin 3D',draw:drawC},analyse:{n:'Analyse',draw:drawD}};
window.PH_STYLE='realiste';try{const s=localStorage.getItem('rendu_joueur');if(s&&PH_STYLES[s])PH_STYLE=s}catch(e){}
window.phSetStyle=s=>{if(!PH_STYLES[s])return;try{localStorage.setItem('rendu_joueur',s)}catch(e){}location.reload()};
if(typeof PH_C!='undefined'&&PAL_ST[PH_STYLE])Object.assign(PH_C,PAL_ST[PH_STYLE]);
if(typeof dsPied!='undefined'&&PIED[PH_STYLE]){const p0=dsPied;dsPied=function(c,g,col,trait){return PIED[PH_STYLE](c,g)}}

// Analyse : fond sombre (le jaune et le cyan ne se voient pas sur le fond clair du site)
if(typeof renderPhys!='undefined'&&PH_STYLE=='analyse'){const rp=renderPhys;
 renderPhys=function(m,o){return rp(m,o).replace('fill="#e6eefa" stroke="#1b3a73"','fill="#0a1631" stroke="#2a8fb0"').replace('fill="#cfe3c4"','fill="#0f2a55"').replace('stroke="#6f9a5b"','stroke="#6ee7ff"').replace('fill="#d9ead0"','fill="#0f2a55"').replace(/fill="#1b3a73">pied gauche/g,'fill="#6ee7ff">pied gauche').replace(/fill="#d63a2a">pied droit/g,'fill="#ff9d3a">pied droit')}}

// ---------- chargement à la demande : la fiche est dessinée fixe, l'animation n'est fabriquée que pour les schémas visibles ----------
const REG=new Map();let SEQ=0;
const IO=typeof IntersectionObserver!='undefined'?new IntersectionObserver(es=>es.forEach(e=>e.target.querySelectorAll('g[data-phs]').forEach(g=>{const q=REG.get(g.dataset.phs);if(!q)return;
 if(e.isIntersecting&&!g.dataset.live){g.innerHTML=animer(q.frames.map(q.fn),q.an);g.dataset.live='1'}else if(!e.isIntersecting&&g.dataset.live){g.innerHTML=q.stat;delete g.dataset.live}})),{rootMargin:'250px'}):null;
function scan(n){const L=n.tagName=='svg'?[n]:(n.querySelectorAll?[...n.querySelectorAll('svg')]:[]);L.forEach(s=>{if(!s.__ph&&s.querySelector('g[data-phs]')){s.__ph=1;IO.observe(s)}})}
if(IO)new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType==1)scan(n)}))).observe(document.documentElement,{childList:true,subtree:true});
function decime(frames,an){
 if(!an||frames.length<=2)return[frames,an];
 const kt=/keyTimes="([^"]*)"/.exec(an)[1].split(';').map(Number),dur=parseFloat(/dur="([\d.]+)s"/.exec(an)[1]);let last=0;const idx=[0];
 for(let i=1;i<frames.length-1;i++)if((kt[i]-kt[last])*dur>=.16){idx.push(i);last=i}
 idx.push(frames.length-1);
 return[idx.map(i=>frames[i]),an.replace(/keyTimes="[^"]*"/,'keyTimes="'+idx.map(i=>kt[i].toFixed(3)).join(';')+'"')]}
function rendre(frames,an,fn){
 const [fr,an2]=decime(frames,an),stat=fn(fr[0]);
 if(!an2||fr.length<2)return DEFS+stat;
 if(!IO)return DEFS+animer(fr.map(fn),an2);
 const id='phs'+(++SEQ);REG.set(id,{frames:fr,an:an2,fn,stat});if(REG.size>600)REG.delete(REG.keys().next().value);
 return DEFS+`<g data-phs="${id}">${stat}</g>`}
const corps0=phCorps;
phCorps=function(frames,an){const S=PH_STYLES[window.PH_STYLE];if(!S||!S.draw)return corps0(frames,an);
 return rendre(frames,an,f=>{const {F,o}=phPlace(f.p,f.anc);return S.draw(joints(F,o),f.p)})};
window.phCorpsFace=function(frames,an,plan,E){const dr=FACE[window.PH_STYLE];if(!dr)return null;
 return rendre(frames,an,f=>dr(faceJ(E.fk(f.p),E.place(f.p,plan))))};
})();
