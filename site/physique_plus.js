/* Compléments du moteur physique (chargé après physique.js) :
   1) Joueur vu de face (debout) ou de dessus (couché sur le dos) pour les mouvements dans le plan frontal
      (écartés, inclinaisons, abductions, adductions…), que la vue de profil ne montre pas.
      {v:1, vue:'face', theme, info, plan:0|1, obj:[…], decor:[{t,x}], poses:[{t,hd,la,le,ra,re,lt,ls,rt,rs,pv,tw,ft,fla,fle,fra,fre,flt,fls,frt,frs,x,air,d,h}]}
      Angles absolus en degrés : 0 = vers le bas, + vers la droite de l'écran (= côté gauche du joueur), 180 = vers le haut.
      t torse (hanche → cou), hd tête, la/le bras gauche (bras, avant-bras), ra/re bras droit, lt/ls jambe gauche (cuisse, tibia),
      rt/rs jambe droite, pv bassin (180 debout), tw torsion du buste (degrés), air = hauteur de saut.
      f… = raccourci du segment (1 = longueur normale, 0,3 = segment orienté vers nous) : ft torse, fla/fle bras gauche…
      plan:1 = vue de dessus d'un joueur couché sur le dos, tête à gauche (t=-90, pv=-90 ; jambes vers la droite = 90).
   2) Objets tenus ou attachés, pour les deux vues : m.obj = liste parmi
      'haltere_n','haltere_f' (profil : main proche / éloignée), 'haltere_g','haltere_d' (face : main gauche / droite),
      'barre','baton','ballon' (entre les deux mains), 'elastique_n','elastique_f','elastique_g','elastique_d' (du pied à la main),
      'lest_n','lest_f','lest_g','lest_d' (lest à la cheville), 'batonv_g','batonv_d' (face : bâton vertical tenu d'une main), 'batonv' (bâton vertical qui passe d'une main à l'autre : clé de pose bv, 0 = main droite, 1 = main gauche).
   3) Matériel de décor en plus : 'baton' (bâton planté, pour l'équilibre). */
(function(){if(typeof PH_L=='undefined')return;
 const L=PH_L,C=PH_C,SW=10,HW=4.5;
 const FKEYS=['ft','fla','fle','fra','fre','flt','fls','frt','frs'];
 const KF=['t','hd','la','le','ra','re','lt','ls','rt','rs','pv','tw','x','air','bv',...FKEYS];
 const DEF={t:180,hd:0,la:7,le:5,ra:-7,re:-5,lt:3,ls:3,rt:-3,rs:-3,pv:180,tw:0,x:150,air:0,bv:0};FKEYS.forEach(k=>DEF[k]=1);
 window.phF=o=>({...DEF,...o});
 const cosd=a=>Math.cos(a*Math.PI/180);
 // ---------- géométrie de face ----------
 function fk(p){const H=[0,0],N=phAdd(H,p.t,L.to*p.ft),S0=phAdd(H,p.t,(L.to-4)*p.ft),pr=phD(p.t-90),sw=SW*cosd(p.tw||0);
  const Sl=[S0[0]+pr[0]*sw,S0[1]+pr[1]*sw],Sr=[S0[0]-pr[0]*sw,S0[1]-pr[1]*sw],pp=phD(p.pv-90),Pl=[pp[0]*HW,pp[1]*HW],Pr=[-pp[0]*HW,-pp[1]*HW];
  const arm=(S,a1,a2,f1,f2)=>{const e=phAdd(S,a1,L.ua*f1),w=phAdd(e,a2,L.fa*f2);return{S,e,w,m:phAdd(w,a2,2.6*f2),d:a2}};
  const leg=(P,t1,t2,f1,f2)=>{const k=phAdd(P,t1,L.th*f1),a=phAdd(k,t2,L.sh*f2);return{P,k,a,b:phAdd(a,t2,7*f2)}};
  return{H,N,Hd:phAdd(N,p.t+(p.hd||0),(L.nk+L.hr)*p.ft),Ag:arm(Sl,p.la,p.le,p.fla,p.fle),Ad:arm(Sr,p.ra,p.re,p.fra,p.fre),Lg:leg(Pl,p.lt,p.ls,p.flt,p.fls),Ld:leg(Pr,p.rt,p.rs,p.frt,p.frs)}}
 const allPts=F=>[F.H,F.N,F.Hd,F.Ag.e,F.Ag.m,F.Ad.e,F.Ad.m,F.Lg.k,F.Lg.b,F.Ld.k,F.Ld.b,F.Ag.S,F.Ad.S];
 function place(p,plan){if(plan)return[p.x,100];const F=fk(p),low=Math.max(...allPts(F).map(q=>q[1]))+3;return[p.x,PH_SOL-low-(p.air||0)]}
 // Points absolus utiles aux objets, pour une pose de face
 function absFace(p,plan){const F=fk(p),o=place(p,plan),T=q=>[q[0]+o[0],q[1]+o[1]];
  return{bv:p.bv||0,mg:T(F.Ag.m),md:T(F.Ad.m),dg:F.Ag.d,dd:F.Ad.d,ag:T(F.Lg.a),ad:T(F.Ld.a),pg:T(F.Lg.b),pd:T(F.Ld.b)}}
 function frames(m){const P=m.poses.map(phF),fr=[],K=8;let t=0;const push=(p,tt)=>fr.push({t:tt,p});
  const lerp=(a,b,e)=>{const o={};KF.forEach(k=>o[k]=a[k]+(b[k]-a[k])*e);return o};
  push(P[0],0);t+=P[0].h??.4;push(P[0],t);
  const tr=(a,b,d)=>{for(let k=1;k<=K;k++)push(lerp(a,b,phEase(k/K)),t+d*k/K);t+=d};
  for(let i=1;i<P.length;i++){tr(P[i-1],P[i],P[i].d??.8);t+=P[i].h??.3;push(P[i],t)}
  if(P.length>1)tr(P[P.length-1],P[0],P[0].d??.8);
  return{fr,T:t}}
 // ---------- dessin de face ----------
 function body(fr,an,plan){
  const ps=fr.map(f=>f.p),A=k=>phUnwrap(ps.map(p=>p[k]??0)),V=k=>ps.map(p=>p[k]??1),rel=(c,pa)=>{const x=A(c),y=pa?A(pa):x.map(()=>0);return phUnwrap(x.map((v,i)=>-(v-y[i])))};
  const same=a=>a.every(v=>Math.abs(v-a[0])<.002);
  const root=ps.map(p=>place(p,plan)),r0=root[0],moves=an&&root.some(q=>Math.abs(q[0]-r0[0])+Math.abs(q[1]-r0[1])>.05);
  const trs=moves?`<animateTransform attributeName="transform" type="translate" values="${root.map(q=>phR(q[0])+' '+phR(q[1])).join(';')}" ${an}/>`:'';
  const R0=inner=>`<g transform="translate(${phR(r0[0])} ${phR(r0[1])})">${trs}${inner}</g>`;
  // segment raccourci : la forme est écrasée le long du segment, l'articulation suivante est rapprochée
  const sc=(f,inner)=>{const v=V(f);if(same(v)&&Math.abs(v[0]-1)<.002)return inner;const a=an&&!same(v)?`<animateTransform attributeName="transform" type="scale" values="${v.map(x=>'1 '+phR(x*100)/100).join(';')}" ${an}/>`:'';return`<g transform="scale(1 ${phR(v[0]*100)/100})">${a}${inner}</g>`};
  const tr=(len,f,inner,dx)=>{const v=f?V(f):ps.map(()=>1),xs=dx||ps.map(()=>0),vals=v.map((x,i)=>phR(xs[i])+' '+phR(len*x)),a=an&&!vals.every(s=>s==vals[0])?`<animateTransform attributeName="transform" type="translate" values="${vals.join(';')}" ${an}/>`:'';return`<g transform="translate(${vals[0]})">${a}${inner}</g>`};
  const pe=C.peau,pe2=C.peau2,ma=C.mail,sh=C.short,so=C.chau;
  const bras=(u,f,fu,ff,dark)=>`${phRot(rel(u,'t'),an)}${sc(fu,phLimb(0,L.ua,6.6,6.9,5.2,.3,dark?pe2:pe)+phCap(-1.5,10.5,9.4,8.4,dark?C.mail2:ma)+`<rect x="-4.2" y="9.4" width="8.4" height="1.3" fill="${so}"/>`)}${tr(L.ua,fu,`${phRot(rel(f,u),an)}${sc(ff,phLimb(-.5,L.fa,5.6,5.8,3.9,.3,dark?pe2:pe)+`<ellipse cy="${L.fa+2.6}" rx="2.9" ry="3.4" fill="${dark?pe2:pe}"/>`)}</g>`)}</g>`;
  const jambe=(t1,t2,f1,f2,dark)=>`${phRot(rel(t1,'pv'),an)}${sc(f1,phLimb(2,L.th,11,9.8,7.6,.35,dark?pe2:pe)+phCap(-2,16,12,10.6,dark?C.short2:sh))}${tr(L.th,f1,`${phRot(rel(t2,t1),an)}${sc(f2,phLimb(-2,17,7.8,8.8,6.6,.4,dark?pe2:pe)+phLimb(12,L.sh,7.4,7,5.2,.3,dark?C.chau2:so)+`<rect x="-3.7" y="12" width="7.4" height="2" fill="${ma}"/><g transform="translate(0 ${L.sh})"><ellipse cy="3.2" rx="3.7" ry="5.6" fill="${C.pied}"/><ellipse cy="1.3" rx="2.5" ry="2.3" fill="${C.pied2}"/></g>`)}</g>`)}</g>`;
  const pelvis=inner=>R0(phRot(rel('pv'),an)+inner+'</g>');
  const torse=inner=>R0(phRot(rel('t'),an)+inner+'</g>');
  const tw=ps.map(p=>cosd(p.tw||0)),ft=V('ft');
  const sx=ps.map((p,i)=>.6+.4*tw[i]),scT=(()=>{const vals=sx.map((x,i)=>phR(x*100)/100+' '+phR(ft[i]*100)/100);const a=an&&!vals.every(s=>s==vals[0])?`<animateTransform attributeName="transform" type="scale" values="${vals.join(';')}" ${an}/>`:'';return inner=>`<g transform="scale(${vals[0]})">${a}${inner}</g>`})();
  const jersey=`<path d="M-8.6 3L8.6 3L7.2 14L8.6 33Q8.8 36 6 37L-6 37Q-8.8 36 -8.6 33L-7.2 14Z" fill="${ma}"/><path d="M-5 37Q0 40.5 5 37" stroke="${so}" stroke-width="1.6" fill="none"/><path d="M0 35V24" stroke="${C.mail2}" stroke-width=".8"/>`;
  const head=tr(L.to,'ft',`${phRot(A('hd').map(v=>-v),an)}<rect x="-2.4" y="-3" width="4.8" height="${L.nk+2}" fill="${pe}"/><g transform="translate(0 ${L.nk+L.hr})"><circle r="${L.hr}" fill="${pe}"/><path d="M-9 1Q-9.6 -9.2 0 -9.6Q9.6 -9.2 9 1Q6 -3 0 -3.4Q-6 -3 -9 1Z" fill="${C.chev}" transform="rotate(180)"/><circle cx="-3.2" cy="-1.2" r="1" fill="#2a1b10"/><circle cx="3.2" cy="-1.2" r="1" fill="#2a1b10"/><path d="M-2.2 -4.6Q0 -5.8 2.2 -4.6" stroke="#8a4b2e" stroke-width=".8" fill="none"/></g></g>`);
  const shorts=`<path d="M-9 6.5L9 6.5L10.2 -9L1.6 -9L0 -5L-1.6 -9L-10.2 -9Z" fill="${sh}"/><path d="M-9 6.5L9 6.5" stroke="${so}" stroke-width="1"/>`;
  // côté gauche du joueur (écran à droite) : x négatif dans le repère du torse et du bassin quand il est debout
  const epaule=(side)=>{const xs=tw.map(c=>side*SW*c);return torse(tr(L.to-4,'ft',side<0?bras('la','le','fla','fle',0):bras('ra','re','fra','fre',0),xs))};
  const hanche=(side)=>pelvis(`<g transform="translate(${side*HW} 0)">${side<0?jambe('lt','ls','flt','fls',0):jambe('rt','rs','frt','frs',0)}</g>`);
  return hanche(-1)+hanche(1)+pelvis(shorts)+torse(scT(jersey)+head)+epaule(-1)+epaule(1)}
 function cam(m){let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;m.poses.map(phF).forEach(p=>{const F=fk(p),o=place(p,m.plan);allPts(F).forEach(q=>{x0=Math.min(x0,q[0]+o[0]-12);x1=Math.max(x1,q[0]+o[0]+12);y0=Math.min(y0,q[1]+o[1]-14);y1=Math.max(y1,q[1]+o[1]+10)})});
  (m.decor||[]).forEach(d=>{if(d.t=='tapis')return;const w=d.t=='banc'?(m.plan?48:32):d.t=='step'?24:10;x0=Math.min(x0,d.x-w);x1=Math.max(x1,d.x+w);if(!m.plan&&d.t=='baton')y0=Math.min(y0,PH_SOL-80)});
  if(m.obj&&m.obj.some(o=>o=='barre'||o=='baton')){x0-=22;x1+=22}
  if(m.plan){const s=Math.max(.6,Math.min(1.5,270/(x1-x0),170/(y1-y0))),cx=(x0+x1)/2,cy=(y0+y1)/2;return{s,tx:150-s*cx,ty:100-s*cy}}
  const s=Math.max(.6,Math.min(1.5,280/(x1-x0),(PH_SOL-26)/(PH_SOL-y0))),cx=(x0+x1)/2;return{s,tx:150-s*cx,ty:PH_SOL*(1-s)}}
 const decorPlan=d=>d.t=='banc'?`<rect x="${d.x-48}" y="86" width="96" height="28" rx="4" fill="#a0723f" stroke="#6d4a24"/>`:d.t=='step'?`<rect x="${d.x-26}" y="88" width="52" height="24" rx="4" fill="#7d93b5" stroke="#3d5072"/>`:'';
 function dessinFace(m,o={}){const P=m.poses||[];if(!P.length)return'';let fr,an='';
  if(o.anim&&P.length>1){const r=frames(m);fr=r.fr;an=`dur="${(r.T/(o.speed||1)).toFixed(2)}s" keyTimes="${fr.map(f=>(f.t/r.T).toFixed(4)).join(';')}" calcMode="linear" repeatCount="indefinite"`}
  else fr=[{p:phF(P[Math.min(o.pose||0,P.length-1)])}];
  const c=cam(m),dec=(m.decor||[]).map(d=>m.plan?decorPlan(d):PH_DECOR[d.t]&&d.t!='ballon'?PH_DECOR[d.t].s(d.x):'').join('');
  const pts=fr.map(f=>absFace(f.p,m.plan));
  return`<g transform="translate(${phR(c.tx)} ${phR(c.ty)}) scale(${phR(c.s*100)/100})">${dec}${objets(m.obj,pts,an,'face',0)}${(window.phCorpsFace&&phCorpsFace(fr,an,m.plan,{fk,place:(p,pl)=>place(p,pl)}))||body(fr,an,m.plan)}${objets(m.obj,pts,an,'face',1)}</g>`}
 // ---------- objets ----------
 const av=(name,vals,an)=>an&&!vals.every(v=>v==vals[0])?`<animate attributeName="${name}" values="${vals.join(';')}" ${an}/>`:'';
 const circ=(P,r,fill,stroke,an,sw=.8)=>`<circle cx="${phR(P[0][0])}" cy="${phR(P[0][1])}" r="${r}" fill="${fill}"${stroke?` stroke="${stroke}" stroke-width="${sw}"`:''}>${av('cx',P.map(q=>phR(q[0])),an)}${av('cy',P.map(q=>phR(q[1])),an)}</circle>`;
 const line=(A,B,col,w,an,cap='round')=>`<line x1="${phR(A[0][0])}" y1="${phR(A[0][1])}" x2="${phR(B[0][0])}" y2="${phR(B[0][1])}" stroke="${col}" stroke-width="${w}" stroke-linecap="${cap}">${av('x1',A.map(q=>phR(q[0])),an)}${av('y1',A.map(q=>phR(q[1])),an)}${av('x2',B.map(q=>phR(q[0])),an)}${av('y2',B.map(q=>phR(q[1])),an)}</line>`;
 const mid=(a,b)=>[(a[0]+b[0])/2,(a[1]+b[1])/2],ext=(a,b,l)=>{const dx=b[0]-a[0],dy=b[1]-a[1],n=Math.hypot(dx,dy)||1;return[b[0]+dx/n*l,b[1]+dy/n*l]};
 const disque=(P,an,r=3.8)=>circ(P,r,'#4a4f57','#1f2328',an)+circ(P,r*.42,'#9aa1aa',null,an);
 // devant : true = dessiné par-dessus le corps
 function objets(list,pts,an,vue,devant){if(!list||!list.length)return'';let s='';
  const G=k=>pts.map(p=>p[k]);
  list.forEach(o=>{
   if(vue=='face'){
    if(!devant)return;
    if(o=='haltere_g'||o=='haltere_d'){const k=o.slice(-1),M=G('m'+k),D=pts.map(p=>p['d'+k]);
     const A=M.map((q,i)=>phAdd(q,D[i]+90,5.5)),B=M.map((q,i)=>phAdd(q,D[i]-90,5.5)),pl=(P,j)=>line(P.map((q,i)=>phAdd(q,D[i],4.2)),P.map((q,i)=>phAdd(q,D[i]+180,4.2)),'#3a3f46',3.4,an,'butt');
     s+=line(A,B,'#6b717a',2,an)+pl(A)+pl(B)}
    else if(o=='barre'||o=='baton'){const g=G('mg'),d=G('md'),l=o=='barre'?20:26,A=g.map((q,i)=>ext(d[i],q,l)),B=d.map((q,i)=>ext(g[i],q,l));
     s+=line(A,B,o=='barre'?'#6b717a':'#b07a3c',o=='barre'?2.4:2.6,an);
     if(o=='barre'){const ang=g.map((q,i)=>phAng(d[i][0]-q[0],d[i][1]-q[1])),pl=P=>line(P.map((q,i)=>phAdd(q,ang[i]+90,8)),P.map((q,i)=>phAdd(q,ang[i]-90,8)),'#3a3f46',4,an,'butt');
      s+=pl(g.map((q,i)=>ext(d[i],q,l-5)))+pl(d.map((q,i)=>ext(g[i],q,l-5)))}}
    else if(o=='batonv'||o=='batonv_g'||o=='batonv_d'){const M=o=='batonv'?pts.map(p=>[p.md[0]+(p.mg[0]-p.md[0])*p.bv,p.md[1]+(p.mg[1]-p.md[1])*p.bv]):G('m'+o.slice(-1));s+=line(M.map(q=>[q[0],q[1]-42]),M.map(q=>[q[0],Math.min(q[1]+60,PH_SOL)]),'#b07a3c',2.6,an)}
    else if(o=='ballon'){s+=circ(G('mg').map((q,i)=>mid(q,G('md')[i])),7,'#fff','#222',an,1.1)}
    else if(o.startsWith('elastique_')){const k=o.slice(-1);s+=line(G('p'+k),G('m'+k),'#d63b3b',1.4,an)}
    else if(o.startsWith('lest_')){const k=o.slice(-1);s+=circ(G('a'+k),4,'#4a4f57','#1f2328',an)}
   }else{ // profil
    const near=o.endsWith('_n');
    if(o.startsWith('haltere_')){if(devant==near)s+=disque(G(near?'mn':'mf'),an)}
    else if(o=='barre'){if(devant)s+=disque(G('mn').map((q,i)=>mid(q,G('mf')[i])),an,7.5)}
    else if(o=='baton'){if(devant)s+=circ(G('mn').map((q,i)=>mid(q,G('mf')[i])),2.4,'#b07a3c','#6d4a24',an)}
    else if(o=='ballon'){if(devant)s+=circ(G('mn').map((q,i)=>{const r=mid(q,G('mf')[i]);return[r[0]+5,r[1]]}),7,'#fff','#222',an,1.1)}
    else if(o.startsWith('elastique_')){if(devant==near)s+=line(G(near?'pn':'pf'),G(near?'mn':'mf'),'#d63b3b',1.4,an)}
    else if(o.startsWith('lest_')){if(devant==near)s+=circ(G(near?'an':'af'),4,'#4a4f57','#1f2328',an)}
   }});
  return s}
 // Objets en vue de profil (appelé par phProfil)
 window.phObjets=function(m,fr,an,devant){if(!m.obj||!m.obj.length)return'';
  const pts=fr.map(f=>{const {F,o}=phPlace(f.p,f.anc),T=v=>[v[0]+o[0],v[1]+o[1]];return{mn:T(F.An.m),mf:T(F.Af.m),an:T(F.Ln.a),af:T(F.Lf.a),pn:T(F.Ln.to),pf:T(F.Lf.to)}});
  return objets(m.obj,pts,an,'profil',devant)};
 // Bâton planté (appui pour l'équilibre)
 PH_DECOR.baton={n:'Bâton (appui)',s:x=>`<line x1="${x}" y1="${PH_SOL}" x2="${x}" y2="${PH_SOL-80}" stroke="#b07a3c" stroke-width="2.6" stroke-linecap="round"/>`};
 const base=renderPhys;
 renderPhys=function(m,o={}){if(!m||m.vue!='face')return base(m,o);
  const fond=m.plan?`<rect x="1" y="1" width="298" height="198" rx="6" fill="#d9ead0" stroke="#1b3a73"/><rect x="34" y="26" width="232" height="148" rx="10" fill="#2fa84f" opacity=".3"/>`:`<rect x="1" y="1" width="298" height="198" rx="6" fill="#e6eefa" stroke="#1b3a73"/><rect x="2" y="${PH_SOL}" width="296" height="${197-PH_SOL}" fill="#cfe3c4"/><line x1="2" y1="${PH_SOL}" x2="298" y2="${PH_SOL}" stroke="#6f9a5b" stroke-width="1.4"/>`;
  return`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200"${o.id?` id="${o.id}" style="touch-action:none;user-select:none"`:''}>${fond}${dessinFace(m,o)}${phInfo(m)}</svg>`};
 // Les schémas de face ne se modifient pas encore dans l'éditeur
 if(typeof phModifier=='function'){const mod=phModifier;phModifier=function(id){const f=(window.E||[]).find(x=>x.id==id);if(f&&f.schema_physique&&f.schema_physique.vue=='face'){alert('Ce schéma vu de face n’est pas encore modifiable dans l’éditeur.');return}return mod(id)}}
 // Joueur de face articulé posé sur des appuis (vue inclinée) : le même joueur que les schémas de face, jambes calculées pour atteindre les pieds
 window.phFaceCore={body,fk,place};
 window.phJoueurIncl=function(I,an,legpx){
  const s=Math.max(.4,Math.min(1.1,legpx/(L.th+L.sh+5.3))),KS=-1,fr=[];
  I.forEach(i=>{const rel=F=>[(F[0]-i.H[0])/s,(F[1]-i.H[1])/s-5.3],rg=rel(i.fg),rd=rel(i.fd),gd=rg[0]>=rd[0],Lr=gd?rg:rd,Ll=gd?rd:rg;
   const a=phIK([HW,0],Lr,L.th,L.sh,KS),b=phIK([-HW,0],Ll,L.th,L.sh,-KS);
   fr.push({p:phF({x:0,lt:a[0],ls:a[1],rt:b[0],rs:b[1],la:6,le:4,ra:-6,re:-4})})});
  const tv=v=>an&&v.some(x=>x!=v[0])?`<animateTransform attributeName="transform" type="translate" values="${v.join(';')}" ${an}/>`:'';
  const hs=I.map(i=>phR(i.H[0])+' '+phR(i.H[1])),os=fr.map(f=>{const o=place(f.p,false);return phR(-o[0])+' '+phR(-o[1])});
  return`<g transform="translate(${hs[0]})">${tv(hs)}<g transform="scale(${phR(s*100)/100})"><g transform="translate(${os[0]})">${tv(os)}${body(fr,an,false)}</g></g></g>`};
})();
