/* Joueur : cinq rendus au choix (Classique + A Arcade, C Pro, D Mini-star, E Hologramme ; le style B Facettes est écarté).
   Chargé après physique_plus.js. Le choix est mémorisé dans le navigateur (clé joueur_style) ; « Classique » ne change rien au moteur.
   Chaque style redessine le joueur dans les repères locaux du moteur (un repère par segment) :
   profil (phCorps), face (phCorpsFace), appuis vus de dessus (dsPied, dsCorps) et vue inclinée (phJoueurIncl).
   L'animation est reconstruite en SMIL : le dessin est calculé à chaque image, ce qui change (positions, rotations) est animé
   avec la même chronologie que le rendu classique. Export PNG et impression restent donc valables.
   Description des styles : chantiers/mannequins_v2/styles.md ; page de comparaison : demo-mannequins-v2.html. */
(function(){if(typeof phCorps=='undefined'||typeof PH_SOL=='undefined'||!window.phFaceCore)return;
const r=v=>Math.round(v*10)/10;
const hex=c=>[1,3,5].map(i=>parseInt(c.slice(i,i+2),16));
const mix=(a,b,t)=>{const A=hex(a),B=hex(b);return'#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('')};
const tone=(c,k)=>k>=0?mix(c,'#ffffff',k):mix(c,'#050c20',-k);
/* ---------- géométrie ---------- */
function side(p){let d='';for(let i=0;i<p.length-1;i++){const a=p[i-1]||p[i],b=p[i],c=p[i+1],e=p[i+2]||c;d+=`C${r(b[0]+(c[0]-a[0])/6)} ${r(b[1]+(c[1]-a[1])/6)} ${r(c[0]-(e[0]-b[0])/6)} ${r(c[1]-(e[1]-b[1])/6)} ${r(c[0])} ${r(c[1])}`}return d}
// sd : contour lisse d'une table [y,xa,xb] ; a..b = bande (0 = bord arrière, 1 = bord avant) ; f0/f1 = bout plat en haut / en bas
function sd(P,o={}){const a=o.a??0,b=o.b??1,X=(q,t)=>q[1]+(q[2]-q[1])*t,F=P.map(q=>[X(q,b),q[0]]),B=P.map(q=>[X(q,a),q[0]]).reverse(),n=P.length-1;
 const cap=(p,q,s,flat)=>{if(flat)return`L${r(q[0])} ${r(q[1])}`;const k=.66*Math.abs(p[0]-q[0])*s;return`C${r(p[0])} ${r(p[1]+k)} ${r(q[0])} ${r(q[1]+k)} ${r(q[0])} ${r(q[1])}`};
 return`M${r(F[0][0])} ${r(F[0][1])}`+side(F)+cap(F[n],B[0],1,o.f1)+side(B)+cap(B[n],F[0],-1,o.f0)+'Z'}
function at(P,y){if(y<=P[0][0])return[y,P[0][1],P[0][2]];for(let i=1;i<P.length;i++)if(y<=P[i][0]){const a=P[i-1],b=P[i],u=(y-a[0])/(b[0]-a[0]);return[y,a[1]+(b[1]-a[1])*u,a[2]+(b[2]-a[2])*u]}const l=P[P.length-1];return[y,l[1],l[2]]}
// cut : portion y0..y1 d'une table, élargie de g (manche, short, chaussette)
function cut(P,y0,y1,g=0){const s=Math.sign(P[0][2]-P[0][1])||1,n=P.length-1;let R=P.filter(q=>q[0]>y0+.01&&q[0]<y1-.01);if(y0>P[0][0])R=[at(P,y0),...R];if(y1<P[n][0])R=[...R,at(P,y1)];return R.map(q=>[q[0],q[1]-g*s,q[2]+g*s])}
const sym=a=>a.map(q=>[q[0],-q[1],q[1]]),grow=(P,k)=>P.map(q=>[q[0],q[1]*k,q[2]*k]);
function blob(p){const n=p.length;let d=`M${r(p[0][0])} ${r(p[0][1])}`;for(let i=0;i<n;i++){const a=p[(i-1+n)%n],b=p[i],c=p[(i+1)%n],e=p[(i+2)%n];d+=`C${r(b[0]+(c[0]-a[0])/6)} ${r(b[1]+(c[1]-a[1])/6)} ${r(c[0]-(e[0]-b[0])/6)} ${r(c[1]-(e[1]-b[1])/6)} ${r(c[0])} ${r(c[1])}`}return d+'Z'}
const poly=p=>'M'+p.map(q=>r(q[0])+' '+r(q[1])).join('L')+'Z';
const ell=(cx,cy,rx,ry=rx)=>`M${r(cx-rx)} ${r(cy)}A${rx} ${ry} 0 1 0 ${r(cx+rx)} ${r(cy)}A${rx} ${ry} 0 1 0 ${r(cx-rx)} ${r(cy)}Z`;
const mir=p=>p.map(q=>[-q[0],q[1]]);
/* SIL : silhouettes du segment en cours, pour la passe de contour (dessinée sous tous les aplats de la chaîne) */
let SIL=[];
const base=(d,fill,ex='')=>{SIL.push(d);return`<path d="${d}" fill="${fill}" ${ex}/>`};
const pa=(d,fill,ex='')=>`<path d="${d}" fill="${fill}" ${ex}/>`;
const li=(d,col,w,ex='')=>`<path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${ex}/>`;

/* ---------- tables de formes : athlète (styles A, B, C, E) et cartoon (style D) ---------- */
const R_ATH={profil:{
  uarm:[[0,-4.3,4.4],[7,-4.3,4.4],[15,-3.4,3.6],[22,-3,3.1]],
  farm:[[0,-3.1,3.2],[6,-3.3,3.7],[14,-2.5,2.8],[21,-2,2.1]],
  thigh:[[0,-6.7,6.4],[9,-6.9,7.7],[20,-5.6,6.5],[28,-4.6,5],[33,-4.2,4.4]],
  shin:[[0,-4.3,4.3],[7,-5.8,4.1],[15,-4.9,3.5],[24,-3.1,2.9],[32,-2.7,2.7]],
  torso:[[1,7.3,-6.3],[8,6.7,-6.4],[16,6.3,-6.7],[24,7.3,-7.9],[31,7.9,-8.9],[36,7.1,-7.6],[39.5,5.2,-4.8]],
  neck:[[36,3.2,-2.4],[47,3.4,-2.6]],hip:7.9,hand:[0,24.3,2.7,3.8],handP:[[-2.3,20.6],[-2.9,23.8],[-2.5,27],[-1,28.6],[.8,28.2],[1.9,26.2],[2.2,24.6],[3.5,24.2],[3.7,22.6],[2.4,20.8]],
  boot:[[-5.3,-3.8],[-5.5,3],[-5.5,11.5],[-4.9,14.6],[-3.2,15.4],[-1.2,13.6],[.2,9.5],[1.6,5],[3.4,2.6],[3.6,-1.2],[1.6,-4.2],[-2,-4.8]]},
 face:{
  uarm:sym([[0,4.5],[7,4.4],[15,3.5],[22,3.1]]),farm:sym([[0,3.2],[6,3.5],[14,2.7],[21,2.1]]),
  thigh:sym([[0,6.2],[8,7],[19,6],[28,4.8],[33,4.3]]),shin:sym([[0,4.3],[8,5.1],[16,4.3],[25,3.1],[32,2.8]]),
  torso:sym([[1,8.3],[6,8.6],[14,7.9],[24,9.6],[32,11],[36.5,11.8],[39,9],[40.5,4.8]]),
  neck:sym([[36,2.9],[47,3]]),hand:[0,24.3,2.9,3.8],handP:[[-2.4,20.6],[-3,23.8],[-2.6,27],[-1,28.6],[1,28.6],[2.6,27],[3,23.8],[2.4,20.6]],
  pelvis:[[-9.2,7],[9.2,7],[9.6,-3],[5,-7.5],[0,-5],[-5,-7.5],[-9.6,-3]],
  boot:[[-3.2,-3],[-3.9,3],[-4.4,7.5],[-3.4,10.2],[0,11],[3.4,10.2],[4.4,7.5],[3.9,3],[3.2,-3],[0,-4]]}};
const R_TOON={profil:{
  uarm:[[0,-4.8,4.8],[22,-4.2,4.2]],farm:[[0,-4.2,4.2],[21,-3.8,3.8]],
  thigh:[[0,-7.2,7.2],[12,-7.2,7.6],[26,-6,6.2],[33,-5.6,5.6]],shin:[[0,-5.6,5.4],[10,-6,5.2],[24,-4.9,4.7],[32,-4.7,4.7]],
  torso:[[1,8.4,-7.8],[12,8.6,-8.6],[26,8.8,-9.2],[35,7.8,-8],[39.5,5.8,-5.4]],
  neck:[[36,3.4,-2.8],[44,3.4,-2.8]],hip:8.8,hand:[0,25,4.5,4.5],
  boot:[[-5.6,-5],[-5.8,3],[-5.8,13],[-5,17.4],[-2.4,18.6],[.6,16.6],[2.2,11],[3,5.5],[4.6,2.6],[4.6,-2.2],[2,-5.4],[-2.4,-6]]},
 face:{
  uarm:sym([[0,4.8],[22,4.2]]),farm:sym([[0,4.2],[21,3.8]]),thigh:sym([[0,6.4],[12,7.2],[26,6],[33,5.6]]),shin:sym([[0,5.6],[10,5.8],[24,4.8],[32,4.7]]),
  torso:sym([[1,9],[10,9.4],[24,10.4],[34,11.6],[38.5,9.6],[40.5,5.4]]),neck:sym([[36,3.1],[44,3.1]]),hand:[0,25,4.5,4.5],
  pelvis:[[-9.8,7],[9.8,7],[10.2,-3],[5.4,-7.5],[0,-5],[-5.4,-7.5],[-10.2,-3]],
  boot:[[-3.8,-3.6],[-4.8,3],[-5.6,8.5],[-4.4,12],[0,13],[4.4,12],[5.6,8.5],[4.8,3],[3.8,-3.6],[0,-4.6]]}};

/* ---------- palettes (club ESGA : bleu et or) ---------- */
const FAR=(P,k=.26,to='#0d1c3f')=>Object.fromEntries(Object.entries(P).map(([n,c])=>[n,mix(c,to,k)]));
const PAL={
 A:{sk:'#f3bd8f',je:'#2a5bd0',sh:'#142b60',so:'#f6c62f',bo:'#ffffff',ha:'#2b1d14',cu:'#f6c62f',st:'#f6c62f',sb:'#142b60',se:'#f6c62f',ol:'#0b1933'},
 C:{sk:'#eab58c',je:'#2a56b8',sh:'#152c62',so:'#f0c033',bo:'#ffffff',ha:'#241710',cu:'#11244f',st:'#e8b923',sb:'#1b3a73',se:'#e8b923'},
 D:{sk:'#ffc99c',je:'#2f6be6',sh:'#1b3a8a',so:'#ffd23f',bo:'#1b3a8a',ha:'#4a2d18',cu:'#ffd23f',st:'#ffd23f',sb:'#ffffff',se:'#ffd23f',ol:'#152456'},
 E:{sk:'#3f7bf0',je:'#3f7bf0',sh:'#3f7bf0',so:'#3f7bf0',bo:'#3f7bf0',ha:'#1b3a73',cu:'#e8b923',st:'#e8b923',sb:'#e8b923',se:'#e8b923'}};
Object.keys(PAL).forEach(k=>PAL[k]=[PAL[k],FAR(PAL[k],k=='D'?.2:.26)]);

/* =====================================================================================================
   LES CINQ STYLES. Chaque style fournit :
     R       tables de formes (R_ATH ou R_TOON)
     ol      contour : {c couleur, w épaisseur, op opacité}  (passe dessinée sous les aplats de chaque chaîne)
     paint   (table, clé couleur, loin?, options) → un segment peint à la manière du style
     dot     (cx,cy,rx,ry, clé, loin?) → main, hanche
     head    (vue, loin?)   boot (vue, loin?)   ombre (x, y, k)
     kit     détails de tenue : manche, poignet, bande du short, chaussette…
   ===================================================================================================== */
const ST={};

/* ---------- A · ARCADE : cel-shading, contour épais, ombre nette en deux tons ---------- */
ST.A={k:'A',nom:'Arcade',sous:'cel-shading',R:R_ATH,shape(d,key,far){return base(d,PAL.A[far][key])},ol:{c:PAL.A[0].ol,w:2.3,op:1},kit:{sl:11,cuff:1.8,stripe:1,sock:8,band:1},
 paint(P,key,far,o={}){const c=PAL.A[far][key];return base(sd(P,o),c)+(o.sh===0?'':pa(sd(P,{...o,a:0,b:.36}),tone(c,-.26)))+(o.hl===0?'':pa(sd(cut(P,P[0][0]+2,P[P.length-1][0]-3),{a:.74,b:.88}),'#fff','opacity=".32"'))},
 dot(cx,cy,rx,ry,key,far){const c=PAL.A[far][key];return base(ell(cx,cy,rx,ry),c)+pa(ell(cx+rx*.3,cy-ry*.1,rx*.62,ry*.8),tone(c,-.24),'opacity=".0"')},
 ombre:(x,y,k)=>`<ellipse cx="${r(x)}" cy="${y}" rx="${r(27*k)}" ry="${r(4.4*k)}" fill="#0b1933" opacity="${r(.3*k)}"/>`,
 boot(v,far){const c=PAL.A[far],R=this.R[v];if(v=='face')return base(blob(R.boot),c.bo)+pa(blob(R.boot.map(q=>[q[0]*.5+2,q[1]])),tone(c.bo,-.2))+pa(`M-4.4 7.2Q0 5.4 4.4 7.2L3.4 10.2Q0 11.4 -3.4 10.2Z`,c.se);
  return base(blob(R.boot),c.bo)+pa(`M-5.4 -3.6L-5.4 14.4Q-4.6 15.6 -2.9 15.3L-3.4 12Q-3.6 3 -3.2 -4.4Z`,tone(c.bo,-.2))+pa(`M-.4 10.8L1.2 5.6L3 6.4L.9 11.6Z`,c.se)+pa(`M3.5 2.4L3.6 -1.2Q3 -3.4 1.6 -4.2L.4 -1.4Z`,c.se)+li(`M-5.9 -3.8L-5.9 14.4`,c.ol,1.5)+[0,5.2,10.4].map(y=>pa(`M-7.6 ${y}h1.6v1.9h-1.6z`,c.ol)).join('')},
 head(v,far){const c=PAL.A[far],sS=tone(c.sk,-.24);
  if(v=='face'){const sk=[[0,5],[-4.6,6.6],[-7.2,10.5],[-7.9,15.5],[-6.8,20],[-3.5,22.6],[0,23.1],[3.5,22.6],[6.8,20],[7.9,15.5],[7.2,10.5],[4.6,6.6]];
   const ha=[[-8.4,15.2],[-8.8,20.6],[-6.2,24.2],[-3.8,23.4],[-2.4,26.2],[-.2,24],[2,26.6],[3.8,23.6],[6.4,24.6],[8.8,20.6],[8.4,15.2],[6.8,18.8],[3,20],[-1,19],[-4,20.2],[-6.8,18.6]];
   return base(ell(-8.3,13.4,1.6,2.3),c.sk)+base(ell(8.3,13.4,1.6,2.3),sS)+base(blob(sk),c.sk)+pa(blob([[0,5],[4.6,6.6],[7.2,10.5],[7.9,15.5],[6.8,20],[4.4,17],[3.6,11],[1.6,7]]),sS)
    +base(poly(ha),c.ha,`stroke="${c.ha}" stroke-width="1" stroke-linejoin="round"`)+pa(poly([[-6.6,21],[-4,22.4],[-2.6,24.6],[-2.8,21.4],[-5,20.6]]),tone(c.ha,.22))
    +pa(ell(-3.1,13.6,1.05,1.6),c.ol)+pa(ell(3.1,13.6,1.05,1.6),c.ol)+pa(ell(-3.4,14.2,.35,.45),'#fff')+pa(ell(2.8,14.2,.35,.45),'#fff')+li('M-5 16.4L-1.6 16M5 16.4L1.6 16',c.ol,1.1)+li('M-2.2 9.4Q0 8 2.2 9.4',c.ol,1)}
  const sk=[[-4.2,5.6],[-7.2,8],[-8.2,10.2],[-9.9,12.2],[-8.3,14.4],[-8.5,16.6],[-7.4,19.6],[-2,22.7],[4.5,21.7],[8.6,16.5],[7.8,10.5],[4.5,6.5],[0,5.2]];
  const ha=[[-7.6,18.2],[-10.8,21.4],[-7,21.6],[-9,25],[-4.2,23.6],[-3.6,26.4],[.6,24.4],[2.6,26],[6.6,22.8],[9.8,17.6],[9,11.4],[6,9.2],[5.4,13.6],[2.6,13.2],[2.2,16.8],[-1.4,17.8],[-4.8,16.9]];
  return base(blob(sk),c.sk)+pa(blob([[4.5,6.5],[7.8,10.5],[5.4,12.4],[1,9.4],[-3,6.6],[0,5.2]]),sS)
   +base(poly(ha),c.ha,`stroke="${c.ha}" stroke-width="1" stroke-linejoin="round"`)+pa(poly([[-6.4,20.6],[-8,23.8],[-4.6,22.6],[-3.8,24.8],[-1,22.6],[-4,20.6]]),tone(c.ha,.22))
   +pa(ell(3.3,12.5,1.7,2.3),sS)+pa(ell(-5.6,14.1,1,1.6),c.ol)+pa(ell(-5.9,14.7,.35,.45),'#fff')+li('M-8.2 16.3L-4.6 16.9',c.ol,1.2)+li('M-7.8 9.5L-5.6 9.1',c.ol,1)}};

/* ---------- C · PRO : volumes lisses en dégradé, tenue moderne, visage détaillé ---------- */
ST.C={k:'C',nom:'Pro',sous:'rendu lisse',R:R_ATH,shape(d,key,far){return base(d,`url(#c_${key}${far?'f':''})`)},ol:{c:'#071330',w:1.2,op:.5},kit:{sl:11.5,cuff:1.4,stripe:1,sock:9,band:1,lines:1},
 paint(P,key,far,o={}){const g=o.grad||`url(#c_${key}${far?'f':''})`;return base(sd(P,o),g)+(o.hl===0?'':pa(sd(cut(P,P[0][0]+1,P[P.length-1][0]-2),{a:.84,b:.96}),'#fff','opacity=".3"'))},
 dot(cx,cy,rx,ry,key,far){return base(ell(cx,cy,rx,ry),`url(#c_${key}${far?'f':''})`)},
 ombre:(x,y,k)=>`<ellipse cx="${r(x)}" cy="${y+1}" rx="${r(34*k)}" ry="${r(6*k)}" fill="url(#c_om)"/>`,
 boot(v,far){const R=this.R[v],g=`url(#c_bo${far?'f':''})`,go=PAL.C[far].se,nv=PAL.C[far].sh;if(v=='face')return base(blob(R.boot),g)+pa(`M-4.4 7.4Q0 5.8 4.4 7.4L3.4 10.2Q0 11.4 -3.4 10.2Z`,go)+li('M-1.6 0L1.6 0M-1.8 2.6L1.8 2.6',nv,.7);
  return base(blob(R.boot),g)+pa(`M-5.4 8.5Q-2.6 9.4 .4 9L-1.2 13.6Q-3.2 15.6 -4.9 14.6Q-5.5 12 -5.4 8.5Z`,go)+pa(`M3.5 2.4L3.6 -1.2Q3 -3.4 1.6 -4.2L.8 -1.6Z`,go)+li('M1.4 4.6L-.6 5.2M.9 6.9L-1 7.4',nv,.7)+li(`M-5.9 -3.8L-5.9 14.4`,nv,1.5)+[0,5.2,10.4].map(y=>pa(`M-7.4 ${y}h1.4v1.7h-1.4z`,nv)).join('')},
 head(v,far){const c=PAL.C[far],sk=far?c.sk:'url(#c_hd)',d=tone(c.sk,-.3),h=c.ha;
  if(v=='face'){const p=[[0,5],[-4.4,6.4],[-7,10.4],[-7.7,15.5],[-6.8,20],[-3.5,22.6],[0,23.1],[3.5,22.6],[6.8,20],[7.7,15.5],[7,10.4],[4.4,6.4]];
   return base(ell(-8,13.4,1.5,2.4),c.sk)+base(ell(8,13.4,1.5,2.4),d)+base(blob(p),sk)
    +base(blob([[-8,15.4],[-8.2,20.4],[-5,23.8],[0,24.6],[5,23.8],[8.2,20.4],[8,15.4],[6.4,19],[3,20.4],[0,20.2],[-3,20.4],[-6.4,19]]),h)+pa(blob([[-8,15.4],[-8.2,19],[-6.6,19.4],[-6.6,16.4]]),tone(h,.3),'opacity=".7"')+pa(blob([[8,15.4],[8.2,19],[6.6,19.4],[6.6,16.4]]),tone(h,.3),'opacity=".5"')
    +pa(ell(-3.1,13.9,1.5,1),'#fff')+pa(ell(3.1,13.9,1.5,1),'#fff')+pa(ell(-3.1,13.9,.85,.95),'#2a1a10')+pa(ell(3.1,13.9,.85,.95),'#2a1a10')
    +li('M-5 16L-1.6 15.8M5 16L1.6 15.8',h,1)+li('M.2 13L-.9 10.6L.8 10.5',d,.8)+li('M-2.2 8.5Q0 7.7 2.2 8.5',tone(c.sk,-.5),1)}
  const p=[[-4.2,5.6],[-6.6,7.6],[-7.6,9.2],[-8.3,10.6],[-9.9,12.1],[-8.3,14.2],[-8.5,16.5],[-7.4,19.6],[-2,22.7],[4.5,21.7],[8.6,16.5],[7.8,10.5],[4.5,6.5],[0,5.2]];
  return base(blob(p),sk)+pa(blob([[4.5,6.5],[7.8,10.5],[5.2,11.6],[1,8.6],[-3,6.4],[0,5.2]]),d,'opacity=".6"')
   +base(blob([[-7.9,18.4],[-7.6,21.2],[-3,23.8],[3,23.4],[7.6,20.4],[9.3,15.6],[8.4,11],[6.2,9.6],[5.5,13],[3,14.4],[2.2,17.4],[-2,18.5],[-5,17.7]]),h)+pa(blob([[8.4,11],[6.2,9.6],[5.5,13],[4.4,15.4],[7.2,15.4]]),tone(h,.3),'opacity=".75"')+pa(blob([[-7,20.4],[-3,22.8],[2,22.6],[-1,21],[-5,19.4]]),tone(h,.18),'opacity=".8"')
   +pa(ell(3.4,12.4,1.8,2.4),c.sk)+li('M3.9 13.8Q2.6 12.6 3.6 11',d,.7)
   +pa(ell(-5.7,14.1,1.4,1),'#fff')+pa(ell(-6.1,14.1,.8,.95),'#2a1a10')+li('M-8.3 16.2Q-6.4 16.9 -4.5 16.2',h,1.1)+li('M-7.6 9.2L-5.6 8.9',tone(c.sk,-.5),.9)}};

/* ---------- D · MINI-STAR : cartoon, grosse tête, formes rondes, contour doux ---------- */
ST.D={k:'D',nom:'Mini-star',sous:'cartoon',R:R_TOON,ol:{c:PAL.D[0].ol,w:2.6,op:1},kit:{sl:12,cuff:2.4,stripe:0,sock:6,band:2,star:1},
 paint(P,key,far,o={}){const c=PAL.D[far][key];return base(sd(P,o),c)+(o.sh===0?'':pa(sd(P,{...o,a:0,b:.3}),tone(c,-.16)))+(o.hl===0?'':li(sd(cut(P,P[0][0]+3,P[P.length-1][0]-5),{a:.76,b:.77}).split('C')[0]+side(cut(P,P[0][0]+3,P[P.length-1][0]-5).map(q=>[q[1]+(q[2]-q[1])*.76,q[0]])),'#fff',1.6,'opacity=".5"'))},
 dot(cx,cy,rx,ry,key,far){return base(ell(cx,cy,rx,ry),PAL.D[far][key])},
 ombre:(x,y,k)=>`<ellipse cx="${r(x)}" cy="${y}" rx="${r(30*k)}" ry="${r(5*k)}" fill="#1b3a8a" opacity="${r(.22*k)}"/>`,
 boot(v,far){const c=PAL.D[far],R=this.R[v];if(v=='face')return base(blob(R.boot),c.bo)+pa(`M-5.6 8.6Q0 6.4 5.6 8.6L4.4 12Q0 13.4 -4.4 12Z`,c.se)+pa(ell(-1.6,2.5,1.5,2.4),'#fff','opacity=".35"');
  return base(blob(R.boot),c.bo)+pa(`M-5.8 9Q-2.6 10.4 1.6 10.2L.6 16.6Q-2.4 19 -5 17.4Q-5.9 14 -5.8 9Z`,c.se)+pa(ell(1.2,2,1.4,2.8),'#fff','opacity=".35"')+li(`M-6.4 -5L-6.4 17`,'#fff',1.8)},
 head(v,far){const c=PAL.D[far],d=tone(c.sk,-.16),o=c.ol;
  if(v=='face'){const p=[[0,4.5],[-7,6.2],[-11.6,11.5],[-12.4,18],[-9.6,24.6],[-4.6,27.8],[0,28.4],[4.6,27.8],[9.6,24.6],[12.4,18],[11.6,11.5],[7,6.2]];
   return base(ell(-12.6,15,2.2,3),c.sk)+base(ell(12.6,15,2.2,3),d)+base(blob(p),c.sk)
    +base(blob([[-12.6,18],[-12.4,25],[-7.6,30],[-2,30.4],[0,33.4],[3.4,30.4],[8,29.8],[12.4,25],[12.6,18],[10,22.4],[5,24.6],[1,22.6],[-3.6,24.8],[-9,22.6]]),c.ha)+pa(blob([[-9.6,25.6],[-6,28.6],[-2,29],[-5.4,26.6],[-8.4,24.4]]),tone(c.ha,.28))
    +pa(ell(-4.6,15,2.9,3.7),'#fff')+pa(ell(4.6,15,2.9,3.7),'#fff')+pa(ell(-4.2,14.8,1.8,2.4),o)+pa(ell(5,14.8,1.8,2.4),o)+pa(ell(-4.8,15.8,.7,.8),'#fff')+pa(ell(4.4,15.8,.7,.8),'#fff')
    +pa(ell(-8.6,10.6,2,1.3),'#ff8f7a','opacity=".5"')+pa(ell(8.6,10.6,2,1.3),'#ff8f7a','opacity=".5"')+li('M-3.2 9.2Q0 6.4 3.2 9.2',o,1.4)+li('M-7.4 20.4Q-4.6 21.6 -2.2 20.4M7.4 20.4Q4.6 21.6 2.2 20.4',c.ha,1.4)}
  const p=[[-5.4,4.8],[-10.4,7.4],[-12.6,11.6],[-14,14],[-12.4,16.6],[-12.2,20.6],[-9.6,25.4],[-3,28.6],[5,27.6],[11.4,22.4],[13,15.5],[10.6,8.6],[5,5]];
  return base(blob(p),c.sk)+pa(blob([[5,5],[10.6,8.6],[13,15.5],[9.6,13],[5,8.4],[0,5.6]]),d)
   +base(blob([[-12.4,21],[-15.4,24.6],[-11,25.2],[-12.6,29.6],[-6.6,29],[-3,32.4],[2.6,30],[8,28.6],[13,23.6],[14.6,16],[12.6,9.6],[9,7.6],[8.6,13.4],[5,13.2],[4.4,19.6],[-2,22.2],[-8,20.6]]),c.ha)+pa(blob([[-9,24.6],[-9.6,28],[-5.4,27.4],[-2,29.6],[-3.6,25.6],[-6.4,23.6]]),tone(c.ha,.28))
   +pa(ell(5.6,14,2.4,3.1),d)+pa(ell(-7.6,15.4,2.9,3.8),'#fff')+pa(ell(-8.4,15.2,1.8,2.5),o)+pa(ell(-9,16.2,.7,.8),'#fff')+pa(ell(-4.4,10.4,2,1.3),'#ff8f7a','opacity=".5"')+li('M-11.4 9.6Q-9 8 -7 9.6',o,1.4)+li('M-10.6 20.6Q-8 21.8 -5.4 20.6',c.ha,1.4)}};

/* ---------- E · HOLOGRAMME : corps en verre bleu, articulations or, muscle travaillé en surbrillance ---------- */
let HOT={};
ST.E={k:'E',nom:'Hologramme',sous:'verre et muscles',R:R_ATH,shape(d,key,far){return`<g opacity="${far?.5:1}">`+base(d,'url(#e_gl)','stroke="#16327a" stroke-width="1.3" stroke-linejoin="round"')+'</g>'},ol:null,kit:{sl:0,cuff:0,stripe:0,sock:0,band:0,bare:1},
 paint(P,key,far,o={}){const n=P[P.length-1][0];return`<g opacity="${far?.5:1}">`+base(sd(P,o),'url(#e_gl)','stroke="#16327a" stroke-width="1.3" stroke-linejoin="round"')+pa(sd(cut(P,P[0][0]+1,n-2),{a:.72,b:.9}),'#fff','opacity=".5"')
  +(o.hot?pa(sd(cut(P,P[0][0]+o.hot[2]*(n-P[0][0]),P[0][0]+o.hot[3]*(n-P[0][0])),{a:o.hot[0],b:o.hot[1]}),'url(#e_hot)','opacity=".92" stroke="#b85a00" stroke-width=".6"'):'')+this.ring(0,P[0][0]<1?P[0][0]>0?-99:0:-99)+'</g>'},
 ring:(x,y,rr=2.7)=>y<-50?'':`<circle cx="${x}" cy="${y}" r="${rr}" fill="#fff" stroke="#e8a800" stroke-width="1.7"/>`,
 dot(cx,cy,rx,ry,key,far){return`<g opacity="${far?.5:1}">`+base(ell(cx,cy,rx,ry),'url(#e_gl)','stroke="#16327a" stroke-width="1.3"')+(key=='sh'&&HOT.hip?pa(ell(cx+2.6,cy,rx*.6,ry*.78),'url(#e_hot)','opacity=".92"'):'')+(key=='sh'?this.ring(cx,cy,3.1):this.ring(cx,cy-ry-1,2.4))+'</g>'},
 ombre:(x,y,k)=>`<ellipse cx="${r(x)}" cy="${y}" rx="${r(30*k)}" ry="${r(5*k)}" fill="none" stroke="#e8a800" stroke-width="1.6" opacity="${r(.9*k)}"/><ellipse cx="${r(x)}" cy="${y}" rx="${r(22*k)}" ry="${r(3.6*k)}" fill="#2a5fd6" opacity="${r(.22*k)}"/>`,
 boot(v,far){const R=this.R[v];return`<g opacity="${far?.5:1}">`+base(blob(R.boot),'url(#e_gl)','stroke="#16327a" stroke-width="1.3" stroke-linejoin="round"')+(v=='face'?'':li(`M-5.9 -3.8L-5.9 14.4`,'#e8a800',1.6))+this.ring(0,0,2.5)+'</g>'},
 head(v,far){const vis=v=='face'?`M-6.6 15.6Q0 17.6 6.6 15.6L6.2 12.2Q0 13.6 -6.2 12.2Z`:`M-8.6 15.8Q-4 17.4 1.4 15.4L1 12.4Q-4 13.6 -8.4 12.2Z`;
  return base(v=='face'?ell(0,14.2,7.6,9):blob([[-4.2,5.6],[-7.4,8.4],[-9,12.4],[-8.4,17],[-6.6,20.6],[-2,22.9],[4.5,21.9],[8.6,16.5],[7.8,10.5],[4.5,6.5],[0,5.2]]),'url(#e_hd)','stroke="#16327a" stroke-width="1.3"')+pa(vis,'#0f2a66','opacity=".85"')+li(v=='face'?'M-4.6 20.4Q0 22.4 4.6 20.4':'M-5.6 20Q-1 22 3.4 20.6','#fff',1.2,'opacity=".7"')}};

/* ---------- composition commune : tenue posée sur les tables du style ---------- */
function part(st,v,name,far){const R=st.R[v],K=st.kit,c=PAL[st.k][far],P=(t,k,o)=>st.paint(t,k,far,o),band=(t,y0,y1,g,col)=>pa(sd(cut(t,y0,y1,g),{f0:1,f1:1}),col),H=HOT;
 switch(name){
 case'uarm':return P(R.uarm,'sk',{hl:K.sl?0:1,hot:H.uarm})+(K.sl?P(cut(R.uarm,-99,K.sl,.8),'je',{f1:1})+(K.cuff?band(R.uarm,K.sl-K.cuff,K.sl,.9,c.cu):''):'');
 case'farm':{const h=R.hand;return(R.handP&&st.shape?st.shape(blob(R.handP),'sk',far)+(st.k=='E'?'':li(v=='face'?'M-.9 25.4L-1 28M.9 25.4L1 28':'M-.5 25.2L-.8 28.2M2 24.4L1.2 25.6',tone(c.sk,-.4),.6,'opacity=".7"')):st.dot(h[0],h[1],h[2],h[3],'sk',far))+P(R.farm,'sk',{hot:H.farm})}
 case'thigh':return P(R.thigh,'sk',{hl:0,hot:H.thigh})+(K.bare?'':P(cut(R.thigh,-99,17,1),'sh',{f1:1})+(K.stripe&&v=='profil'?li(`M.6 1L.9 15.4`,c.st,1.7):'')+(K.lines?band(R.thigh,15.8,17,1.05,c.st)+(v=='profil'?li('M2.4 19Q3.6 26 1.8 31',tone(c.sk,-.5),.7,'opacity=".3"'):''):''));
 case'shin':return P(R.shin,'sk',{hl:K.bare?1:0,sh:K.bare?1:0,hot:H.shin})+(K.bare?'':P(cut(R.shin,K.sock,99,.5),'so',{f0:1})+(K.band==1?band(R.shin,K.sock+1.4,K.sock+3,.55,c.sb)+band(R.shin,K.sock+4.2,K.sock+5.2,.55,c.sb):K.band==2?band(R.shin,K.sock,K.sock+3.4,.6,c.sb):''));
 case'foot':return st.boot(v,far);
 case'head':return st.head(v,far);
 case'pelvis':{const d=poly(R.pelvis),col=c.sh;  if(st.k=='E')return base(d,'url(#e_gl)','stroke="#16327a" stroke-width="1.3" stroke-linejoin="round"')+st.ring(-4.5,0,2.8)+st.ring(4.5,0,2.8);
  return base(d,st.k=='C'?'#152c62':col,`stroke-linejoin="round"`)+li(`M-9 7L9 7`,c.st,1.3)}
 case'torso':{const T=R.torso,top=T[T.length-1][0];let s=K.bare?'':P(R.neck,'sk',{f0:1,f1:1,hl:0});
  if(v=='profil')s=st.dot(0,0,R.hip,R.hip,'sh',far)+s;
  s+=P(T,'je',{f0:1,f1:v=='face',hot:H.torso,grad:st.k=='C'?(v=='face'?'url(#c_jeF)':'url(#c_jeT)'):null});
  if(K.bare)return s+(v=='face'?li('M0 4L0 37','#fff',1.1,'opacity=".6"')+st.ring(0,22,3.4):li('M2.6 4Q4.4 20 2.6 36','#fff',1.1,'opacity=".6"'))+st.ring(0,top+.5,2.6);
  const col=at(T,top-1.2);
  if(v=='face'){s+=pa(`M-4.2 ${top+.4}L0 ${top-4.4}L4.2 ${top+.4}L2.6 ${top+.8}L0 ${top-2}L-2.6 ${top+.8}Z`,c.cu)+pa(`M-2.6 ${top+.8}L0 ${top-2}L2.6 ${top+.8}Z`,c.sk);
   if(K.star)s+=pa(star(0,25,5.4),c.se);else s+=pa('M-7.2 32.6h3.6v-2.6l-1.8 -1.7l-1.8 1.7z',c.se)+(st.k=='C'?li('M-11 36.4L-8.6 4M11 36.4L8.6 4',c.se,.9,'opacity=".9"'):'')}
  else{s+=pa(sd(cut(T,top-2.2,top,.3),{f0:1,f1:1}),c.cu);if(K.star)s+=pa(star(-2.2,24,4.4),c.se);if(st.k=='C')s+=li('M2.4 3Q3.6 20 2 37',c.se,.9,'opacity=".9"');if(st.k=='A'||st.k=='C')s+=li('M-4 6.4Q0 9 4.6 6.8M-3 11.4Q.6 13.4 4.8 11.6',tone(c.je,-.45),.8,'opacity=".55"')}
  return s}}}
const star=(cx,cy,R)=>poly([...Array(10)].map((_,i)=>{const a=i*Math.PI/5,q=i%2?R*.45:R;return[cx+q*Math.sin(a),cy+q*Math.cos(a)]}));

/* ---------- assemblage : chaînes de segments, contour sous les aplats ----------
   Chaque segment = trois groupes imbriqués (translate, rotate, scale) : une seule opération par attribut transform,
   pour que l'animation SMIL puisse animer chacune. Le scale n'existe que de face (segments raccourcis). */
function frame(a,b,L,inner,sc){const dx=b[0]-a[0],dy=b[1]-a[1];
 return`<g transform="translate(${r(a[0])} ${r(a[1])})"><g transform="rotate(${r(-phAng(dx,dy))})">`+(sc?`<g transform="scale(1 ${Math.round(Math.hypot(dx,dy)/L*100)/100})">${inner}</g>`:inner)+'</g></g>'}
function chain(st,v,segs,far,patch='',noOl){const sc=v=='face',S=segs.map(([a,b,L,n])=>{SIL=[];const f=part(st,v,n,far);return{a,b,L,f,sil:SIL}});let o='';
 if(st.ol&&!noOl)o+=`<g fill="${st.ol.c}" stroke="${st.ol.c}" stroke-width="${st.ol.w}" stroke-linejoin="round" opacity="${st.ol.op}">`+S.map(s=>frame(s.a,s.b,s.L,s.sil.map(d=>`<path d="${d}"/>`).join(''),sc)).join('')+'</g>'+patch;
 return o+S.map(s=>frame(s.a,s.b,s.L,s.f,sc)).join('')}
// Profil : bras loin, jambe loin, buste + tête, jambe proche, bras proche
function profil(st,p,anc){const {F,o}=phPlace(p,anc),T=q=>[q[0]+o[0],q[1]+o[1]],H=T(F.H),N=T(F.N),S=T(F.S),Hd=T(F.Hd),c=PAL[st.k][0];
 const arm=(A,far)=>chain(st,'profil',[[S,T(A.e),22,'uarm'],[T(A.e),T(A.w),21,'farm']],far,far||st.k=='E'?'':`<circle cx="${r(S[0])}" cy="${r(S[1])}" r="3.4" fill="${st.k=='C'?'#2a56b8':c.je}"/>`);
 const leg=(L,pn,far)=>{const a=T(L.a),d=phD(pn);return chain(st,'profil',[[H,T(L.k),33,'thigh'],[T(L.k),a,32,'shin'],[a,[a[0]+d[0]*10,a[1]+d[1]*10],10,'foot']],far,far||st.k=='E'?'':`<circle cx="${r(H[0])}" cy="${r(H[1])}" r="${st.R.profil.hip-1.6}" fill="${st.k=='C'?'#152c62':c.sh}"/>`)};
 const x=(T(F.Ln.a)[0]+T(F.Lf.a)[0])/2;
 return st.ombre(x,PH_SOL+1,1-(p.air||0)/110)+arm(F.Af,1)+leg(F.Lf,p.pf,1)+chain(st,'profil',[[H,N,40,'torso'],[N,Hd,14,'head']],0)+leg(F.Ln,p.pn,0)+arm(F.An,0)}
// Face : jambes, short, buste + tête, bras (ordre du moteur)
function face(st,p,o,sol){const F=phFaceCore.fk(p),T=q=>[q[0]+o[0],q[1]+o[1]],H=T(F.H),N=T(F.N),Hd=T(F.Hd),pv=phD(p.pv);
 const leg=L=>chain(st,'face',[[T(L.P),T(L.k),33,'thigh'],[T(L.k),T(L.a),32,'shin'],[T(L.a),T(L.b),7,'foot']],0);
 const arm=A=>chain(st,'face',[[T(A.S),T(A.e),22,'uarm'],[T(A.e),T(A.w),21,'farm']],0);
 return(sol!=null?st.ombre((T(F.Lg.a)[0]+T(F.Ld.a)[0])/2,sol+1,1-(p.air||0)/110):'')+leg(F.Ld)+leg(F.Lg)+chain(st,'face',[[H,[H[0]+pv[0]*10,H[1]+pv[1]*10],10,'pelvis']],0,'',1)+chain(st,'face',[[H,N,40,'torso'],[N,Hd,14,'head']],0)+arm(F.Ad)+arm(F.Ag)}


/* ---------- gradients (styles Pro et Hologramme) : une seule fois dans la page ; ajoutés au PNG par pngFiche ---------- */
const DEFS=`<linearGradient id="c_sk"><stop offset="0" stop-color="#b97a52"/><stop offset=".55" stop-color="#f6c9a2"/><stop offset="1" stop-color="#e2a57a"/></linearGradient><linearGradient id="c_skf"><stop offset="0" stop-color="#93603f"/><stop offset=".55" stop-color="#c99a76"/><stop offset="1" stop-color="#b3835f"/></linearGradient><linearGradient id="c_je"><stop offset="0" stop-color="#0f2452"/><stop offset=".6" stop-color="#2f62c9"/><stop offset="1" stop-color="#1f4698"/></linearGradient><linearGradient id="c_jef"><stop offset="0" stop-color="#0a1838"/><stop offset=".6" stop-color="#1e4189"/><stop offset="1" stop-color="#153067"/></linearGradient><linearGradient id="c_jeT" x1="1" x2="0"><stop offset="0" stop-color="#0f2452"/><stop offset=".62" stop-color="#3468d4"/><stop offset="1" stop-color="#2450ab"/></linearGradient><linearGradient id="c_jeF" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1b3f8e"/><stop offset=".35" stop-color="#3468d4"/><stop offset="1" stop-color="#112a5e"/></linearGradient><linearGradient id="c_sh"><stop offset="0" stop-color="#060f26"/><stop offset=".6" stop-color="#1c3875"/><stop offset="1" stop-color="#11244f"/></linearGradient><linearGradient id="c_shf"><stop offset="0" stop-color="#040a1a"/><stop offset=".6" stop-color="#12264f"/><stop offset="1" stop-color="#0b1836"/></linearGradient><linearGradient id="c_so"><stop offset="0" stop-color="#a67c08"/><stop offset=".6" stop-color="#ffdc5c"/><stop offset="1" stop-color="#e3b01c"/></linearGradient><linearGradient id="c_sof"><stop offset="0" stop-color="#7a5c08"/><stop offset=".6" stop-color="#c9a430"/><stop offset="1" stop-color="#a98514"/></linearGradient><linearGradient id="c_bo"><stop offset="0" stop-color="#aab4c8"/><stop offset=".6" stop-color="#ffffff"/><stop offset="1" stop-color="#e3e8f2"/></linearGradient><linearGradient id="c_bof"><stop offset="0" stop-color="#7f8aa0"/><stop offset=".6" stop-color="#cfd6e3"/><stop offset="1" stop-color="#b3bccd"/></linearGradient><radialGradient id="c_hd" cx=".38" cy=".62" r=".75"><stop offset="0" stop-color="#f8cfab"/><stop offset=".6" stop-color="#e4aa80"/><stop offset="1" stop-color="#b97a52"/></radialGradient><radialGradient id="c_om"><stop offset="0" stop-color="#0b1a3a" stop-opacity=".42"/><stop offset="1" stop-color="#0b1a3a" stop-opacity="0"/></radialGradient><linearGradient id="e_gl"><stop offset="0" stop-color="#1d4fc4" stop-opacity=".78"/><stop offset=".7" stop-color="#5b93ff" stop-opacity=".5"/><stop offset="1" stop-color="#bcd5ff" stop-opacity=".62"/></linearGradient><linearGradient id="e_hot"><stop offset="0" stop-color="#ff8a1e"/><stop offset="1" stop-color="#ffd23d"/></linearGradient><radialGradient id="e_hd" cx=".35" cy=".65" r=".8"><stop offset="0" stop-color="#d6e6ff" stop-opacity=".85"/><stop offset="1" stop-color="#2a5fd6" stop-opacity=".7"/></radialGradient>`;
window.PH_STYLES={classique:{n:'Classique'},A:{n:'Arcade'},C:{n:'Pro'},D:{n:'Mini-star'},E:{n:'Hologramme'}};
window.PH_STYLE='C';try{const s=localStorage.getItem('joueur_style');if(s&&PH_STYLES[s])PH_STYLE=s}catch(e){}
window.phSetStyle=s=>{if(!PH_STYLES[s])return;try{localStorage.setItem('joueur_style',s)}catch(e){}location.reload()};
const st=ST[PH_STYLE];if(!st)return;
{const ins=()=>{if(document.getElementById('js_defs'))return;const e=document.createElementNS('http://www.w3.org/2000/svg','svg');e.id='js_defs';e.setAttribute('width','0');e.setAttribute('height','0');e.style.cssText='position:absolute;width:0;height:0';e.innerHTML='<defs>'+DEFS+'</defs>';document.body.insertBefore(e,document.body.firstChild)};document.body?ins():document.addEventListener('DOMContentLoaded',ins)}

/* ---------- appuis vus de dessus (dessus et inclinée) : chaussure et corps aux couleurs du style ---------- */
{const pied0=dsPied,corps0=dsCorps,P=PAL[PH_STYLE][0],k0=PH_STYLE;
 dsPied=function(c,g,col,trait){let s=pied0(c,g,col,trait);const L=c*.27,w=c*.11,k=g?-1:1,ex=[];
  const tc=`<path d="M${r(L*.5)} ${r(-k*w*.9)}Q${r(L*1.12)} 0 ${r(L*.45)} ${r(k*w*.85)}Z" fill="${P.se}"/>`;
  if(k0=='A'||k0=='D'){s=s.replace(/stroke="[^"]*" stroke-width="[^"]*"/,`stroke="${k0=='A'?'#0b1933':'#152456'}" stroke-width="${k0=='A'?1.3:1.6}"`);ex.push(tc)}
  if(k0=='C'){ex.push(`<path d="M${r(-L*.7)} ${r(-k*w*.45)}L${r(L*.75)} ${r(-k*w*.4)}" stroke="#fff" stroke-width=".9" stroke-linecap="round" opacity=".5"/>`,tc.replace(P.se,'#fff').replace('/>',' opacity=".35"/>'))}
  if(k0=='E'){s=s.replace(/fill="([^"]*)"/,'fill="$1" fill-opacity=".65"');ex.push(`<circle cx="${r(-L*.55)}" r="${r(c*.05)}" fill="#fff" stroke="#e8a800" stroke-width="1.2"/>`)}
  return s+ex.join('')};
 dsCorps=function(c,face){let s=corps0(c,face);const C=PH_C;
  s=s.split(C.mail).join(P.je).split(C.peau).join(P.sk).split(C.chev).join(P.ha);
  if(k0=='A'||k0=='D')s=s.replace(/<ellipse /g,`<ellipse stroke="${P.ol}" stroke-width="1.1" `);
  if(k0=='E')s=s.replace('<g ','<g opacity=".8" ');
  return s}}

/* ---------- animation SMIL ---------- */

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
// ---------- chargement à la demande : la fiche est dessinée fixe, l'animation n'est fabriquée que pour les schémas visibles ----------
const REG=new Map();let SEQ=0;
const IO=typeof IntersectionObserver!='undefined'?new IntersectionObserver(es=>es.forEach(e=>e.target.querySelectorAll('g[data-phs]').forEach(g=>{const q=REG.get(g.dataset.phs);if(!q)return;
 if(e.isIntersecting&&!g.dataset.live){g.innerHTML=animer(q.frames.map(q.fn),q.an);g.dataset.live='1'}else if(!e.isIntersecting&&g.dataset.live){g.innerHTML=q.stat;delete g.dataset.live}})),{rootMargin:'250px'}):null;
function scan(n){const L=n.tagName=='svg'?[n]:(n.querySelectorAll?[...n.querySelectorAll('svg')]:[]);L.forEach(s=>{if(!s.__ph&&s.querySelector('g[data-phs]')){s.__ph=1;IO.observe(s)}})}
if(IO)new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType==1)scan(n)}))).observe(document.documentElement,{childList:true,subtree:true});
function decime(frames,an){
 if(!an||frames.length<=2)return[frames,an];
 const kt=/keyTimes="([^"]*)"/.exec(an)[1].split(';').map(Number),dur=parseFloat(/dur="([\d.]+)s"/.exec(an)[1]);let last=0;const idx=[0];
 for(let i=1;i<frames.length-1;i++)if((kt[i]-kt[last])*dur>=.1){idx.push(i);last=i}
 idx.push(frames.length-1);
 return[idx.map(i=>frames[i]),an.replace(/keyTimes="[^"]*"/,'keyTimes="'+idx.map(i=>kt[i].toFixed(3)).join(';')+'"')]}
function rendre(frames,an,fn){
 const [fr,an2]=decime(frames,an),stat=fn(fr[0]);
 if(!an2||fr.length<2)return stat;
 if(!IO)return animer(fr.map(fn),an2);
 const id='phs'+(++SEQ);REG.set(id,{frames:fr,an:an2,fn,stat});if(REG.size>600)REG.delete(REG.keys().next().value);
 return`<g data-phs="${id}">${stat}</g>`}

/* ---------- branchement sur le moteur ---------- */
phCorps=function(frames,an){return rendre(frames,an,f=>profil(st,f.p,f.anc))};
window.phCorpsFace=function(frames,an,plan,E){if(plan)return null;return rendre(frames,an,f=>face(st,f.p,E.place(f.p,0),PH_SOL))};
// Vue inclinée : même joueur de face, jambes calculées pour atteindre les pieds
window.phJoueurIncl=function(I,an,legpx){const L=PH_L,HW=4.5,s=Math.max(.4,Math.min(1.1,legpx/(L.th+L.sh+5.3))),KS=-1,fr=[];
 I.forEach(i=>{const rel=F=>[(F[0]-i.H[0])/s,(F[1]-i.H[1])/s-5.3],rg=rel(i.fg),rd=rel(i.fd),gd=rg[0]>=rd[0],Lr=gd?rg:rd,Ll=gd?rd:rg;
  const a=phIK([HW,0],Lr,L.th,L.sh,KS),b=phIK([-HW,0],Ll,L.th,L.sh,-KS);
  fr.push({p:phF({x:0,lt:a[0],ls:a[1],rt:b[0],rs:b[1],la:6,le:4,ra:-6,re:-4})})});
 const hs=I.map(i=>r(i.H[0])+' '+r(i.H[1])),tv=an&&hs.some(x=>x!=hs[0])?`<animateTransform attributeName="transform" type="translate" values="${hs.join(';')}" ${an}/>`:'';
 return`<g transform="translate(${hs[0]})">${tv}<g transform="scale(${r(s*100)/100})">${rendre(fr,an,f=>face(st,f.p,[0,0],null))}</g></g>`};
})();
