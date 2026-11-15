/* Base « Renfo » : reprise fidèle du répertoire « Fitness et renforcement musculaire » (O. Stoffer, 175 p.), adaptée au football.
   Une fiche par exercice du livre (page indiquée dans la source), avec un ou plusieurs schémas animés :
   vue de profil (physique.js) ou vue de face / de dessus (physique_plus.js) selon le plan du mouvement.
   Chargé après fiches_physique.js : ajoute les schémas de profil à la bibliothèque de l'éditeur,
   des fiches à l'espace Physique, et complète les fiches communes qui correspondent à un exercice du livre. */
(function(){if(typeof phPresets!='function'||!window.EXERCICES_PHY)return;
 const Q=phQ,LIB=[],base=phPresets;
 const TP=[{t:'tapis',x:150}];
 // Fabriques de schémas : profil (P couché/au sol, PS debout), face (FC), vue de dessus (PL)
 const P=(poses,o={})=>({v:1,vue:'profil',theme:'renfo',anc:o.anc||'h',decor:o.decor||TP,...(o.obj?{obj:o.obj}:{}),info:o.info||'',poses:poses.map(p=>Q(p))});
 const PS=(poses,o={})=>P(poses,{anc:'pf',decor:[],...o});
 const FC=(poses,o={})=>({v:1,vue:'face',theme:'renfo',plan:o.plan||0,decor:o.decor||[],...(o.obj?{obj:o.obj}:{}),info:o.info||'',poses});
 const PL=(poses,o={})=>FC(poses,{plan:1,...o});
 const PRE=id=>{const x=base().find(p=>p.id==id);return x?JSON.parse(JSON.stringify(x.m)):null};
 // Positions de profil
 const B=a=>({an:a,ae:a,fa:a,fe:a});
 const SUP={t:-92,hd:-4,an:88,ae:88,fa:88,fe:88,tn:140,sn:20,pn:92,tf:138,sf:18,pf:92};
 const NUQ={an:-140,ae:-100,fa:-140,fe:-100},UP={t:-128,hd:-14},MI={t:-117,hd:-10};
 const TAB={tn:180,sn:90,pn:90,tf:180,sf:90,pf:90},VER={tn:180,sn:180,pn:262,tf:180,sf:180,pf:262};
 const QUA={t:104,hd:-5,an:0,ae:0,fa:0,fe:0,tn:0,sn:-90,pn:-95,tf:0,sf:-90,pf:-95};
 const QUC={...QUA,t:97,an:2,ae:92,fa:2,fe:92};
 const PRN={t:96,hd:-2,an:92,ae:92,fa:92,fe:92,tn:-90,sn:-90,pn:4,tf:-90,sf:-90,pf:4};
 const LEAN={t:138,hd:-8,tn:52,sn:-6,pn:90,tf:-42,sf:-42,pf:-6};
 const FEN={tn:88,sn:-2,pn:90,tf:-28,sf:-96,pf:-6};
 const SQ={t:142,hd:24,tn:80,sn:-28,pn:90,tf:78,sf:-30,pf:90};
 const STEPC={t:-92,hd:0,tn:140,sn:10,pn:92,tf:140,sf:10,pf:92,air:13}; // couché sur le step, pieds au sol
 const STEP=[{t:'step',x:150}],STEPB=[{t:'banc',x:150}];
 // Positions de face (debout) et couché sur le côté
 const HIP={la:40,le:-30,ra:-40,re:30},WI={lt:12,ls:12,rt:-12,rs:-12},JT={lt:3,ls:3,rt:-3,rs:-3};
 const SQO={lt:62,ls:12,rt:-62,rs:-12,flt:.85,frt:.85},DSQ={lt:42,ls:10,rt:-42,rs:-10,flt:.9,frt:.9};
 const SIDE={la:90,le:90,ra:-90,re:-90},HAUT={la:168,le:174,ra:-168,re:-174},BAS={la:6,le:4,ra:-6,re:-4};
 const EPA={la:75,le:178,ra:-75,re:-178},TRAP={la:62,le:176,ra:-62,re:-176},CURL={la:4,le:176,ra:-4,re:-176,fle:.45,fre:.45};
 const COS={t:-90,pv:-90,hd:0,la:20,le:10,fla:.6,fle:.6,ra:-95,re:-95,lt:90,ls:90,rt:90,rs:90},COSB={...COS,rt:65,rs:118};
 // Vue de dessus : couché sur le dos (tête à gauche), à quatre pattes
 const DOS={t:-90,pv:-90,la:-150,le:-60,ra:-150,re:-60,lt:100,ls:100,rt:80,rs:80};
 const QP={t:-90,pv:-90,la:-100,le:-100,ra:-80,re:-80,fla:.2,fle:.2,fra:.2,fre:.2,lt:110,ls:90,rt:70,rs:90,flt:.2,frt:.2};

 const RENFO='Sur tapis ou sur l’herbe, joueurs dispersés face à l’éducateur (2 m entre chacun).';
 const DEB='Joueurs debout, dispersés face à l’éducateur, 2 m autour de chacun.';
 const TEMPO='Varier le tempo (4 temps pour monter, 4 pour descendre, puis 3-1, 2-2 et 1-1) et finir par de petits mouvements.';
 const J=['U11','U13','U15','U18','Seniors'],G=['U13','U15','U18','Seniors'],A=['U15','U18','Seniors'],TT=['U9','U11','U13','U15','U18','Seniors'];
 const SRC='Fitness et renforcement musculaire, répertoire technique (O. Stoffer), adapté au football';
 const MT={tapis:['tapis',1],halt:['haltères légers (1 à 2 kg)',2],halt1:['haltère léger (1 à 2 kg)',1],barre:['barre légère',1],baton:['bâton',1],step:['step',1],elast:['bande élastique',1],ballon:['ballon souple',1],lest:['lests de cheville',2]};
 const OUT=[];
 // F : une fiche. o = {c,niv,dur,obj,org,der,cons,var,mat,s:[[nom,schéma],…],mk}
 function F(id,titre,muscle,page,o){OUT.push({id:'phy-'+id,titre:titre.slice(0,40),theme:'renfo',muscle,categories:o.c||J,public:['filles','garçons'],niveau:o.niv||'débutant',duree_min:o.dur||5,joueurs:{min:1,max:20},surface:'2 x 2 m par joueur',
   materiel:(o.mat||['tapis']).map(k=>{const m=MT[k]||[k,1];return{nom:m[0],quantite:m[1]}}),auteur:'Commun',source:SRC+', p. '+page,
   objectif:o.obj,organisation:o.org||RENFO,deroulement:o.der,consignes:o.cons,variantes:(o.var||[]).map(([nom,change,difficulte])=>({nom,change,difficulte})),...(o.mk?{mots_cles:o.mk}:{}),
   ...(o.s.length>1?{schemas_physique:o.s.map(([nom,m])=>({nom,m}))}:{schema_physique:o.s[0][1]})});
  o.s.forEach(([nom,m],i)=>{if(m.vue=='profil')LIB.push({id:id+(i?'_'+i:''),nom:(i?titre+' : '+nom:titre).slice(0,60),theme:'renfo',m})})}

 // ===================== ABDOMINAUX (p. 20-44) =====================
 F('flexion_buste','Abdos : relevé de buste, mains aux genoux','abdominaux',20,{obj:'Renforcer le grand droit (ventre), base du gainage pour frapper et sauter.',
  der:'Couché sur le dos, genoux fléchis, pieds au sol, bras tendus. Enrouler le buste en glissant les mains vers les genoux, puis redescendre sans poser la tête. 10 à 15 répétitions, 2 séries.',
  cons:['Enrouler le haut du dos, bas du dos collé au sol','Souffler en montant','Nuque relâchée, regard vers les genoux'],var:[['Tempo',TEMPO,'plus difficile']],
  s:[['Relevé de buste',P([{...SUP,...B(98)},{...SUP,...UP,...B(112),d:1,h:.4}],{info:'1 temps monter, 1 temps descendre'})]]});
 F('rotation_buste','Obliques : rotation du buste, jambe croisée','abdominaux','20 et 30',{obj:'Renforcer les obliques (rotation du tronc dans les frappes et les duels).',
  der:'Couché sur le dos, une jambe croisée sur le genou de l’autre, une main derrière la nuque. Enrouler le buste en tournant les épaules vers le genou fléchi, puis redescendre. 12 par côté, 2 séries.',
  cons:['Ne pas tirer sur la tête','C’est l’épaule qui tourne vers le genou, pas seulement le coude','Mouvement contrôlé'],
  var:[['Tempo','Monter et descendre en 4 temps, 3-1, 1-3 (descente freinée) ou 2-2','plus difficile'],['Enchaînement 8 temps','2 rotations en grande amplitude, 3 petits mouvements en haut, reposer au 8e temps','plus difficile'],['Jambe tendue','Une jambe tendue dans le prolongement de la cuisse opposée : amener le coude vers le genou opposé ; ne pas descendre la jambe trop bas','plus difficile']],
  s:[['Jambe croisée',P([{...SUP,...NUQ,tf:200,sf:150,pf:120},{...SUP,...NUQ,tf:200,sf:150,pf:120,...UP,d:.9,h:.4}])],
     ['Variante jambe tendue',P([{...SUP,...NUQ,tn:128,sn:128,pn:210},{...SUP,...NUQ,tn:128,sn:128,pn:210,tf:205,sf:118,pf:120,...UP,d:.9,h:.4}])]]});
 F('bras_plafond','Abdos : bras devant puis vers le plafond','abdominaux',21,{obj:'Renforcer le ventre en tenant le buste relevé (gainage dynamique).',
  der:'Couché sur le dos, genoux fléchis. Monter le buste bras tendus vers l’avant, puis lever les bras vers le plafond en gardant le buste relevé, ramener les bras devant et redescendre. 8 répétitions, 2 séries.',
  cons:['Le buste reste enroulé pendant que les bras montent','Bas du dos au sol','Souffler'],var:[['Bras croisés','Bras croisés sur la poitrine','plus facile']],
  s:[['4 temps',P([{...SUP,...B(98)},{...SUP,...UP,...B(112),d:.9},{...SUP,...UP,...B(178),d:.7},{...SUP,...UP,...B(112),d:.7}])]]});
 F('jambes_verticales','Abdos : jambes verticales, mains aux pieds','abdominaux',22,{c:G,obj:'Renforcer le ventre jambes levées : le bas du dos reste protégé.',
  der:'Couché sur le dos, jambes tendues à la verticale. Monter le buste en passant les mains entre les jambes, puis aller chercher les pieds. Redescendre lentement. 10 répétitions, 2 séries.',
  cons:['Jambes verticales, genoux légèrement fléchis si besoin','Ne pas balancer les jambes','Souffler en montant'],var:[['Genoux fléchis','Genoux fléchis au-dessus des hanches','plus facile']],
  s:[['Mains entre les jambes puis aux pieds',P([{...SUP,...VER,...B(100)},{...SUP,...VER,t:-122,hd:-12,...B(150),d:.9},{...SUP,...VER,t:-134,hd:-16,...B(172),d:.7}])]]});
 F('petits_mouvements','Abdos : 1 montée et 3 petits mouvements','abdominaux',23,{obj:'Renforcer le ventre en endurance : rester en haut et faire de petits mouvements.',
  der:'Couché sur le dos, mains derrière la nuque. Monter le buste en 1 temps, faire 3 petits mouvements en haut, redescendre au 4e temps. 8 séries de 4 temps.',
  cons:['Petits mouvements sans reposer les épaules','Coudes ouverts, ne pas tirer sur la nuque','Respirer à chaque petit mouvement'],var:[['Bras tendus','Bras tendus vers les genoux','plus facile']],
  s:[['4 temps',P([{...SUP,...NUQ},{...SUP,...NUQ,...UP,d:.6},{...SUP,...NUQ,...MI,d:.3,h:.1},{...SUP,...NUQ,...UP,d:.3,h:.1},{...SUP,...NUQ,...MI,d:.3,h:.1},{...SUP,...NUQ,...UP,d:.3,h:.1}],{info:'1 + 3 petits'})]]});
 F('genoux_buste','Abdos : genoux puis buste en 4 temps','abdominaux','24-25',{c:A,niv:'confirmé',obj:'Renforcer tout le ventre en enchaînant le bas (genoux) et le haut (buste).',
  der:'Couché sur le dos, mains derrière la nuque. Temps 1 : ramener les genoux au-dessus des hanches. Temps 2 : monter le buste. Temps 3 : reposer le buste. Temps 4 : reposer les pieds. 10 répétitions.',
  cons:['Descendre sans à-coups','Dos plaqué au sol','Ne pas tirer sur la nuque'],var:[['2 temps','Monter genoux et buste ensemble, redescendre ensemble','plus difficile'],['Jambes tendues vers le haut','Mêmes temps, jambes tendues vers le plafond','plus difficile']],
  s:[['Genoux fléchis',P([{...SUP,...NUQ},{...SUP,...NUQ,...TAB,d:.8},{...SUP,...NUQ,...TAB,...UP,d:.8},{...SUP,...NUQ,...TAB,d:.8}])],['Jambes tendues vers le haut',P([{...SUP,...NUQ},{...SUP,...NUQ,...VER,d:.8},{...SUP,...NUQ,...VER,...UP,d:.8},{...SUP,...NUQ,...VER,d:.8}])]]});
 F('combinaison_8t','Abdos : 2 relevés et 3 petits (8 temps)','abdominaux',26,{c:G,obj:'Enchaîner grands et petits mouvements du ventre en musique.',
  der:'Couché sur le dos, mains derrière la nuque. Deux relevés de buste en grande amplitude (1 temps pour monter, 1 pour descendre), puis monter et faire 3 petits mouvements, reposer au 8e temps. 4 séries.',
  cons:['Compter à voix haute','Grande amplitude sans élan','Bas du dos au sol'],var:[['Bras tendus','Bras tendus vers les genoux','plus facile']],
  s:[['8 temps',P([{...SUP,...NUQ},{...SUP,...NUQ,...UP,d:.5},{...SUP,...NUQ,d:.5},{...SUP,...NUQ,...UP,d:.5},{...SUP,...NUQ,d:.5},{...SUP,...NUQ,...UP,d:.5},{...SUP,...NUQ,...MI,d:.3,h:.1},{...SUP,...NUQ,...UP,d:.3,h:.1},{...SUP,...NUQ,...MI,d:.3,h:.1},{...SUP,...NUQ,...UP,d:.3,h:.1}])]]});
 F('genoux_petits','Abdos : genoux, buste et 3 petits mouvements','abdominaux',27,{c:A,niv:'confirmé',obj:'Combiner relevé de genoux et relevé de buste avec de petits mouvements.',
  der:'Couché sur le dos, mains derrière la nuque. Ramener les genoux au-dessus des hanches, monter le buste, faire 3 petits mouvements, puis reposer le buste et les pieds. 6 séries.',
  cons:['Genoux immobiles pendant les petits mouvements','Souffler','Redescendre lentement'],var:[['Sans petits mouvements','Genoux puis buste, 4 temps','plus facile']],
  s:[['Enchaînement',P([{...SUP,...NUQ},{...SUP,...NUQ,...TAB,d:.6},{...SUP,...NUQ,...TAB,...UP,d:.6},{...SUP,...NUQ,...TAB,...MI,d:.3,h:.1},{...SUP,...NUQ,...TAB,...UP,d:.3,h:.1},{...SUP,...NUQ,...TAB,...MI,d:.3,h:.1},{...SUP,...NUQ,...TAB,...UP,d:.3,h:.1},{...SUP,...NUQ,...TAB,d:.6}])]]});
 F('changement_rythme','Abdos : changement de rythme','abdominaux',28,{c:G,obj:'Varier le rythme pour travailler le ventre en endurance et en vitesse.',
  der:'Couché sur le dos, mains derrière la nuque. 8 relevés en grande amplitude, puis 2 fois 8 petits mouvements en restant en haut. Récupérer 30 s, 3 séries.',
  cons:['Petits mouvements rapides mais contrôlés','Ne pas reposer la tête pendant les petits','Respirer'],var:[['Isométrie','Remplacer les petits mouvements par 8 à 16 temps de maintien en haut','plus facile']],
  s:[['8 grands, puis petits',P([{...SUP,...NUQ},{...SUP,...NUQ,...UP,d:.5},{...SUP,...NUQ,d:.5},{...SUP,...NUQ,...UP,d:.5},{...SUP,...NUQ,...MI,d:.2,h:0},{...SUP,...NUQ,...UP,d:.2,h:0},{...SUP,...NUQ,...MI,d:.2,h:0},{...SUP,...NUQ,...UP,d:.2,h:0}])]]});
 F('releve_bassin','Abdos : relevé de bassin','abdominaux',29,{obj:'Renforcer le bas du ventre, qui stabilise le bassin à la frappe et en course.',
  der:'Couché sur le dos, bras le long du corps, genoux fléchis au-dessus des hanches. Enrouler le bas du dos pour monter les genoux vers la poitrine, puis redescendre doucement. 10 répétitions, 2 séries.',
  cons:['Seul le bassin s’enroule : ne pas lancer les jambes','Mains à plat au sol','Redescendre lentement'],var:[['Jambes semi-tendues','Jambes tendues ou semi-fléchies vers le haut : pousser les pieds vers le plafond en décollant le bassin','plus difficile']],
  s:[['Genoux fléchis',P([{...SUP,...B(88),...TAB},{...SUP,...B(88),t:-80,tn:208,sn:118,pn:118,tf:206,sf:116,pf:116,d:1.1,h:.4}])],['Jambes vers le plafond',P([{...SUP,...B(88),tn:170,sn:192,pn:272,tf:170,sf:192,pf:272},{...SUP,...B(88),t:-74,tn:186,sn:206,pn:286,tf:186,sf:206,pf:286,d:1,h:.4}])]]});
 F('rotation_jambe','Obliques : coude vers le genou, jambe tendue','abdominaux',30,{c:G,niv:'confirmé',obj:'Renforcer les obliques en amenant le coude vers le genou opposé.',
  der:'Couché sur le dos, mains derrière la nuque, une jambe tendue au-dessus du sol. Ramener le genou opposé vers soi et amener le coude opposé à sa rencontre, puis revenir. 10 par côté.',
  cons:['Ne pas descendre la jambe tendue trop bas (bas du dos au sol)','Tourner les épaules','Coudes ouverts'],var:[['Pied au sol','Pied de la jambe tendue posé au sol','plus facile']],
  s:[['Coude vers le genou',P([{...SUP,...NUQ,tn:128,sn:128,pn:210,tf:140,sf:20},{...SUP,...NUQ,tn:128,sn:128,pn:210,tf:208,sf:118,pf:120,...UP,d:.9,h:.4}])]]});
 F('grimpe_corde','Abdos : grimpé de corde','abdominaux',31,{c:G,obj:'Abdominaux et obliques : mouvements alternés des bras en gardant le buste relevé.',
  der:'Couché sur le dos, pieds au sol, genoux fléchis, bas du dos plaqué (appui lombaire). Buste légèrement relevé, aller chercher le plafond avec une main puis l’autre, comme pour grimper à une corde. 20 s, repos 20 s, 3 fois.',
  cons:['Bas du dos collé au sol','Le buste reste décollé','Souffler régulièrement'],var:[['Plus lent','Une main toutes les 2 secondes','plus facile']],mk:['monté de corde','monter de corde','grimpé de corde','grimper à la corde','corde'],
  s:[['Mains en alternance',P([{...SUP,t:-118,hd:-12,an:168,ae:172,fa:112,fe:112},{...SUP,t:-122,hd:-12,an:112,ae:112,fa:168,fe:172,d:.5,h:.15}])]]});
 F('velo','Obliques : croisés coudes-genoux','abdominaux',31,{c:A,niv:'confirmé',obj:'Abdominaux et coordination : alterner jambe tendue et genou fléchi, comme en course.',
  der:'Couché sur le dos, mains derrière la nuque, buste décollé. Amener un genou vers le coude opposé pendant que l’autre jambe s’allonge, puis changer. 20 s, repos 20 s, 3 fois.',
  cons:['Mains derrière la nuque sans tirer','Bas du dos collé au sol','Mouvement lent et contrôlé'],var:[['Main vers la pointe de pied','Jambe tendue vers le haut : la main opposée va toucher la pointe de pied','plus difficile']],
  s:[['Croisés',P([{...SUP,t:-128,hd:-10,...NUQ,tn:206,sn:116,pn:116,tf:112,sf:112,pf:190},{...SUP,t:-128,hd:-10,...NUQ,tn:112,sn:112,pn:190,tf:206,sf:116,pf:116,d:.5,h:.2}])],
     ['Main vers la pointe de pied',P([{...SUP,...NUQ,...VER},{...SUP,...VER,t:-132,hd:-14,an:168,ae:172,fa:-140,fe:-100,d:.9,h:.3}])]]});
 F('genoux_cote','Obliques : genoux sur le côté, buste enroulé','abdominaux',32,{c:G,obj:'Contraction ciblée des obliques.',
  der:'Couché sur le dos, genoux tombés sur le côté (perpendiculaires au buste). Une main derrière la nuque du côté des genoux, l’autre tendue vers l’avant. Enrouler le buste vers l’avant sans tirer sur la tête. 10 par côté.',
  cons:['Épaules face au plafond','Ne pas tirer sur la tête','Souffler en montant'],var:[['Deux mains à la nuque','Les deux mains soutiennent la tête','plus facile']],
  s:[['Vu de dessus',PL([{...DOS,ra:20,re:40,lt:165,ls:95,rt:155,rs:92,flt:.85,frt:.85},{...DOS,ra:60,re:70,lt:165,ls:95,rt:155,rs:92,flt:.85,frt:.85,ft:.8,d:.9,h:.4}])]]});
 F('genoux_costal','Obliques : genoux levés, couché sur le côté','abdominaux','32-33',{c:G,obj:'Renforcer les obliques côté sol (stabilité du tronc dans les duels).',
  der:'Couché sur le côté, genoux fléchis devant soi, une main au sol devant la poitrine pour l’équilibre. Lever les deux genoux sur le côté, puis contrôler le retour. Reposer ou non les genoux entre chaque répétition. 10 par côté.',
  cons:['Bassin stable, ne pas rouler','Retour freiné','Tête posée sur le bras'],var:[['En diagonale','Incliner le bassin en levant les genoux : le mouvement part en diagonale','plus difficile'],['Jambes tendues','Jambes tendues perpendiculaires au corps (confirmés)','plus difficile']],
  s:[['Vu de face',FC([{...COS,lt:30,ls:90,rt:30,rs:90,flt:.35,frt:.35},{...COS,lt:140,ls:100,rt:140,rs:100,flt:.5,frt:.5,d:1,h:.4}])]]});
 F('inclinaison_couche','Obliques : jambes verticales inclinées','abdominaux',33,{c:G,obj:'Renforcer les obliques en contrôlant la bascule des jambes.',
  der:'Couché sur le dos, bras écartés au sol, jambes levées à la verticale. Incliner les jambes à droite en 2 temps, remonter en 2 temps, puis à gauche. 6 par côté.',
  cons:['Ne pas descendre au-delà de 45°','Épaules collées au sol','Mouvement lent'],var:[['Genoux fléchis','Genoux fléchis au-dessus des hanches','plus facile']],
  s:[['Vu de dessus',PL([{...DOS,la:180,le:180,ra:0,re:0,lt:90,ls:90,rt:90,rs:90,flt:.2,fls:.2,frt:.2,frs:.2},{...DOS,la:180,le:180,ra:0,re:0,lt:45,ls:45,rt:45,rs:45,flt:.7,fls:.7,frt:.7,frs:.7,d:1.2,h:.3},{...DOS,la:180,le:180,ra:0,re:0,lt:90,ls:90,rt:90,rs:90,flt:.2,fls:.2,frt:.2,frs:.2,d:1.2},{...DOS,la:180,le:180,ra:0,re:0,lt:135,ls:135,rt:135,rs:135,flt:.7,fls:.7,frt:.7,frs:.7,d:1.2,h:.3}])]]});
 F('main_cheville','Obliques : main vers la cheville','abdominaux',34,{obj:'Renforcer les obliques par inclinaison du buste.',
  der:'Couché sur le dos, genoux fléchis, jambes légèrement écartées, une main sous la nuque, l’autre tendue sur le côté. S’incliner pour que la main tendue touche la cheville, revenir buste aligné. 1 temps pour aller, 1 pour revenir. 12 par côté.',
  cons:['Épaules légèrement décollées','Glisser sur le côté, ne pas tourner','Nuque soutenue'],var:[['Bilatérale','Toucher un talon puis l’autre (garder les deux mains à la nuque si tension)','plus difficile']],
  s:[['Unilatérale',PL([{...DOS,ra:-20,re:-20,lt:150,ls:40,rt:30,rs:140,flt:.6,frt:.6},{...DOS,t:-72,ra:60,re:70,lt:150,ls:40,rt:30,rs:140,flt:.6,frt:.6,d:.8,h:.3}])],
     ['Bilatérale',PL([{...DOS,la:-150,le:-60,ra:-20,re:-20,lt:150,ls:40,rt:30,rs:140,flt:.6,frt:.6},{...DOS,t:-72,ra:60,re:70,lt:150,ls:40,rt:30,rs:140,flt:.6,frt:.6,d:.7,h:.2},{...DOS,t:-108,la:120,le:110,ra:-20,re:-20,lt:150,ls:40,rt:30,rs:140,flt:.6,frt:.6,d:1.2,h:.2}])]]});
 F('obliques_costal','Obliques : bassin levé sur l’avant-bras','abdominaux',34,{c:A,niv:'confirmé',obj:'Renforcer les obliques et la stabilité latérale (gainage dynamique).',
  der:'Couché sur le côté, en appui sur l’avant-bras, jambes tendues. Élever le bassin, puis le reposer au sol. 8 par côté, 2 séries.',
  cons:['Coude sous l’épaule','Corps aligné en haut','Monter et descendre lentement'],var:[['Genoux fléchis','Appui sur les genoux plutôt que sur les pieds','plus facile']],
  s:[['Vu de face',FC([{...COS,t:-80,pv:-90,ra:0,re:-92,la:60,le:-60,fla:1,fle:1},{...COS,t:-72,pv:-72,ra:0,re:-92,la:60,le:-60,fla:1,fle:1,lt:72,ls:72,rt:72,rs:72,d:1,h:.5}])]]});
 F('superserie_obliques','Obliques : supersérie','abdominaux',35,{c:A,niv:'confirmé',obj:'Enchaîner plusieurs exercices d’obliques sans pause.',
  der:'Couché sur le dos, jambe croisée. 5 x 8 rotations du buste vers le genou, puis 5 x 8 mains vers la pointe de pied, puis 4 x 8 petits mouvements. Changer de côté.',
  cons:['Qualité avant vitesse','Bas du dos au sol','Souffler à chaque montée'],var:[['Réduite','2 x 8 de chaque','plus facile']],
  s:[['Rotation puis pointe de pied',P([{...SUP,...NUQ,tf:200,sf:150,pf:120},{...SUP,...NUQ,tf:200,sf:150,pf:120,...UP,d:.7},{...SUP,...NUQ,tf:200,sf:150,pf:120,d:.7},{...SUP,...NUQ,...VER},{...SUP,...VER,t:-132,hd:-14,an:168,ae:172,fa:-140,fe:-100,d:.8}])]]});
 F('inclinaison_laterale','Obliques : inclinaison debout, bâton','abdominaux',36,{c:A,obj:'Renforcer les obliques et assouplir le côté du tronc.',org:'Joueurs dispersés, un bâton par joueur.',mat:['baton'],
  der:'Debout, jambes écartées, bâton posé sur les épaules. Incliner le buste d’un côté, revenir au centre, puis de l’autre côté. 10 par côté, 2 séries.',
  cons:['Rester dans le plan, sans pencher en avant','Bassin fixe','Mouvement contrôlé'],var:[['Sans bâton','Mains sur les hanches','plus facile']],
  s:[['Vu de face',FC([{...TRAP,...WI},{...TRAP,...WI,t:155,hd:-5,d:1,h:.3},{...TRAP,...WI,d:1},{...TRAP,...WI,t:205,hd:5,d:1,h:.3}],{obj:['baton']})]]});
 F('inclinaison_elastique','Obliques : inclinaison avec élastique','abdominaux',37,{c:A,obj:'Renforcer les obliques contre la résistance d’un élastique.',org:'Joueurs dispersés, une bande élastique sous le pied.',mat:['elast'],
  der:'Debout, un pied sur l’élastique, l’autre extrémité dans la main du même côté, l’autre main sur la hanche. S’incliner du côté opposé en tirant l’élastique, revenir. 10 par côté.',
  cons:['Bras tendu le long du corps','Ne pas pencher en avant','Retour contrôlé'],var:[['Petites inclinaisons','Finir par 7 petites inclinaisons','plus difficile']],
  s:[['Vu de face',FC([{...WI,la:40,le:-30,ra:-8,re:-6},{...WI,t:155,hd:-5,la:20,le:-50,ra:-30,re:-30,d:1,h:.3}],{obj:['elastique_d']})]]});
 F('inclinaison_haltere','Obliques : inclinaison avec haltère','abdominaux','37-38',{c:A,obj:'Renforcer les obliques avec une charge légère.',org:'Joueurs dispersés, un haltère léger chacun.',mat:['halt1'],
  der:'Debout, jambes écartées, haltère dans une main, l’autre main derrière la nuque. Se pencher du côté de l’haltère puis se redresser en s’inclinant de l’autre côté. 10 par côté.',
  cons:['Ne pas tourner le buste','Pas de charge lourde','Erreurs à éviter : pencher en avant, plier les genoux, tirer sur la nuque'],var:[['Sans charge','Main libre le long du corps','plus facile']],
  s:[['Vu de face',FC([{...WI,la:150,le:-120,ra:-6,re:-4},{...WI,t:205,hd:5,la:150,le:-110,ra:15,re:15,d:1,h:.3},{...WI,t:160,hd:-4,la:140,le:-130,ra:-25,re:-25,d:1,h:.3}],{obj:['haltere_d']})]]});
 F('rotation_baton','Obliques : rotation du buste, bâton','abdominaux',39,{c:A,obj:'Renforcer les obliques et mobiliser le tronc (gestes de frappe et de passe).',org:'Joueurs dispersés, un bâton par joueur.',mat:['baton'],
  der:'Debout, jambes écartées, bâton sur les épaules. Tourner le buste d’un côté, revenir de face, puis de l’autre. Les hanches restent de face. 20 rotations, 2 séries.',
  cons:['Hanches face à l’avant','Regard qui suit le bâton','Sans élan'],var:[['Enchaîné','Droite-gauche directement, sans repasser au centre','plus difficile']],
  s:[['Vu de face',FC([{...TRAP,...WI},{...TRAP,...WI,tw:55,d:.9,h:.2},{...TRAP,...WI,d:.9},{...TRAP,...WI,tw:-55,d:.9,h:.2}],{obj:['baton']})]]});
 const R4=(t,ft)=>({...DOS,lt:150,ls:40,rt:30,rs:140,flt:.5,frt:.5,t,ft});
 F('buste_4t','Obliques : droite, gauche, devant, repose','abdominaux',40,{c:G,obj:'Enchaîner rotations et flexion du buste en 4 temps.',
  der:'Couché sur le dos, genoux fléchis, mains derrière la nuque. Temps 1 : monter en rotation vers la droite. Temps 2 : passer à gauche sans redescendre. Temps 3 : revenir face aux genoux. Temps 4 : reposer le buste. 8 séries.',
  cons:['Rester décollé pendant les 3 premiers temps','Souffler','Ne pas tirer sur la nuque'],var:[['Plus lent','2 temps par position','plus facile']],
  s:[['Vu de dessus',PL([R4(-90,1),{...R4(-74,.8),d:.6},{...R4(-106,.8),d:.8},{...R4(-90,.72),d:.6}])]]});
 F('rotation_flexion_8t','Obliques : rotations et flexion (8 temps)','abdominaux',41,{c:A,niv:'confirmé',obj:'Enchaîner rotation, flexion et rotation opposée.',
  der:'Couché sur le dos, mains derrière la nuque. Rotation à droite et retour, flexion face et retour, rotation à gauche et retour, flexion face et retour : 8 temps. 4 séries.',
  cons:['Revenir au sol à chaque fois','Mouvement régulier','Bas du dos collé'],var:[['4 temps','Rotation droite, rotation gauche sans reposer','plus facile']],
  s:[['Vu de dessus',PL([R4(-90,1),{...R4(-74,.8),d:.5},{...R4(-90,1),d:.5},{...R4(-90,.72),d:.5},{...R4(-90,1),d:.5},{...R4(-106,.8),d:.5},{...R4(-90,1),d:.5},{...R4(-90,.72),d:.5}])]]});
 F('flexion_rotation_4t','Abdos : flexion et rotations en 4 temps','abdominaux',42,{c:A,niv:'confirmé',obj:'Grand droit et obliques dans le même enchaînement.',
  der:'Couché sur le dos, mains derrière la nuque. Temps 1 : flexion du buste. Temps 2 : rotation à droite. Temps 3 : rotation à gauche. Temps 4 : flexion face puis reposer. 8 séries.',
  cons:['Rester en haut entre les temps 1 et 4','Coudes ouverts','Souffler'],var:[['Bras tendus','Bras tendus devant','plus facile']],
  s:[['Vu de dessus',PL([R4(-90,1),{...R4(-90,.72),d:.6},{...R4(-74,.8),d:.6},{...R4(-106,.8),d:.8},{...R4(-90,.72),d:.6}])]]});
 F('twist','Abdos : twist en équilibre sur les fessiers','abdominaux',43,{c:A,niv:'confirmé',obj:'Obliques et gainage en équilibre.',
  der:'Assis en équilibre sur les fessiers, pieds décollés, buste incliné en arrière. Tourner le buste et les mains d’un côté puis de l’autre. 10 par côté.',
  cons:['Dos long, pas arrondi','Pieds décollés','Rotation des épaules, pas seulement des bras'],var:[['Pieds au sol','Talons posés','plus facile']],
  s:[['Twist',P([{t:-150,hd:8,an:60,ae:70,fa:60,fe:70,tn:125,sn:100,pn:170,tf:125,sf:100,pf:170},{t:-150,hd:8,an:120,ae:130,fa:120,fe:130,tn:125,sn:100,pn:170,tf:125,sf:100,pf:170,d:.7,h:.2}])]]});
 F('bateau','Abdos : équilibre sur les fessiers','abdominaux',43,{c:G,niv:'confirmé',obj:'Renforcer le ventre en maintien (gainage assis), stabilité pour tirer et se réceptionner.',
  der:'Assis sur les fessiers, buste incliné en arrière, jambes semi-fléchies décollées du sol, bras devant. Tenir 20 s, repos 20 s, 3 fois.',
  cons:['Dos long, pas arrondi','Genoux semi-fléchis','Respirer normalement'],var:[['Pieds au sol','Talons posés','plus facile']],
  s:[['Isométrie',P([{t:-150,hd:8,an:88,ae:90,fa:88,fe:90,tn:125,sn:100,pn:170,tf:125,sf:100,pf:170,h:2},{t:-150,hd:8,an:88,ae:90,fa:88,fe:90,tn:110,sn:88,tf:110,sf:88,pn:160,pf:160,d:.8,h:1.5}],{info:'3 x 20 s'})]]});

 // ===================== ADDUCTEURS (p. 50-54) =====================
 F('adduction_cote','Adducteurs : jambe du dessous levée','adducteurs',50,{obj:'Renforcer l’intérieur des cuisses (adducteurs), zone fragile au foot : changements d’appuis, passes du plat du pied.',
  der:'Couché sur le côté, jambe du dessus croisée devant, pied posé au sol. Lever la jambe du dessous tendue, puis la redescendre sans la poser. 10 par jambe, 2 séries.',
  cons:['Corps aligné, ne pas rouler','Pointe de pied vers l’avant','Mouvement lent'],var:[['Jambe du dessus en arrière','Jambe du dessus fléchie et posée en arrière','plus facile']],
  s:[['Jambe croisée devant',FC([{...COS,lt:60,ls:10,flt:.45,fls:.35},{...COS,lt:60,ls:10,flt:.45,fls:.35,rt:112,rs:112,d:.9,h:.4}])],['Jambe du dessus en arrière',FC([{...COS,lt:120,ls:30,flt:.7},{...COS,lt:120,ls:30,flt:.7,rt:112,rs:112,d:.9,h:.4}])]]});
 F('adduction_verticale','Adducteurs : ouverture des jambes levées','adducteurs',51,{c:G,obj:'Renforcer les adducteurs : prévention des pubalgies et élongations.',
  der:'Couché sur le dos, bras le long du corps, jambes tendues à la verticale. Écarter les jambes, puis les serrer lentement. 10 répétitions, 2 séries.',
  cons:['Bas du dos au sol','Ouverture sans forcer','Serrer en contrôlant'],var:[['Genoux fléchis','Genoux légèrement fléchis','plus facile']],
  s:[['Vu de dessus',PL([{...DOS,la:-10,le:-10,ra:-170,re:-170,lt:90,ls:90,rt:90,rs:90,flt:.2,fls:.2,frt:.2,frs:.2},{...DOS,la:-10,le:-10,ra:-170,re:-170,lt:150,ls:150,rt:30,rs:30,flt:.6,fls:.6,frt:.6,frs:.6,d:1,h:.3}])]]});
 F('adduction_debout','Adducteurs : jambe croisée devant, debout','adducteurs',52,{obj:'Renforcer les adducteurs en appui sur une jambe (équilibre).',org:'Joueurs dispersés, un bâton par joueur pour l’équilibre.',mat:['baton'],
  der:'Debout sur une jambe, bâton tenu de la main opposée. Croiser la jambe libre devant la jambe d’appui, puis la ramener sans poser. 10 par jambe, 2 séries.',
  cons:['Buste droit','Jambe d’appui légèrement fléchie','Petit mouvement contrôlé'],var:[['Avec lest','Lest léger à la cheville','plus difficile']],
  s:[['Vu de face',FC([{la:35,le:15,ra:-40,re:30,lt:4,ls:4,rt:-12,rs:-12},{la:35,le:15,ra:-40,re:30,lt:4,ls:4,rt:22,rs:22,d:.8,h:.3}],{obj:['batonv_g']})]]});
 F('serrer_ballon','Adducteurs : ballon serré entre les genoux','adducteurs',53,{c:TT,obj:'Renforcer les adducteurs en statique, sans risque.',org:'Joueurs assis au sol, un ballon souple (ou de foot) chacun.',mat:['ballon'],
  der:'Assis, genoux fléchis, ballon souple entre les genoux. Comprimer le ballon 5 s, relâcher 5 s. 10 répétitions.',
  cons:['Dos droit','Souffler en serrant','Serrer progressivement'],var:[['Couché','Couché sur le dos, pieds au sol','plus facile']],
  s:[['Assis',P([{t:172,hd:6,an:60,ae:84,fa:60,fe:84,tn:128,sn:20,pn:92,tf:128,sf:20,pf:92,h:1.5},{t:172,hd:6,an:58,ae:82,fa:58,fe:82,tn:126,sn:18,pn:92,tf:126,sf:18,pf:92,d:.4,h:1.5}],{anc:'h',obj:['ballon'],info:'5 s serrer, 5 s relâcher'})]]});
 F('squat_ouvert_barre','Adducteurs : squat jambes écartées, barre','adducteurs',54,{c:A,niv:'confirmé',obj:'Adducteurs, fessiers et cuisses ensemble.',org:'Joueurs dispersés, une barre légère ou un bâton sur les épaules.',mat:['barre'],
  der:'Jambes écartées, pointes de pieds vers l’extérieur, barre posée sur le haut du dos. Descendre en squat, genoux dans l’axe des pieds, puis remonter. 12 répétitions, 2 séries.',
  cons:['Genoux vers l’extérieur, dans l’axe des pieds','Dos droit','Talons au sol'],var:[['Bâton','Bâton à la place de la barre','plus facile']],
  s:[['Vu de face',FC([{...TRAP,lt:20,ls:20,rt:-20,rs:-20},{...TRAP,...SQO,d:1,h:.3}],{obj:['barre']})]]});

 // ===================== BICEPS (p. 58-63) =====================
 F('curl_barre','Biceps : flexion de bras à la barre','biceps',58,{c:A,obj:'Renforcer les biceps (tenir le ballon, contacts).',org:'Joueurs dispersés, une barre légère chacun.',mat:['barre'],
  der:'Debout, pieds largeur de bassin, barre tenue paumes vers l’avant, bras tendus. Fléchir les bras pour monter la barre à la poitrine, redescendre. 4 temps pour monter, 4 pour descendre, puis 3-1, 1-3, 2-2 et 1-1.',
  cons:['Coudes fixes près du corps','Pas d’élan avec le dos','Genoux légèrement fléchis'],var:[['Pied en avant','Un pied devant (60 % du poids) pour protéger le dos','plus facile']],
  s:[['Profil',PS([{...B(0)},{an:4,ae:150,fa:4,fe:150,d:1,h:.3}],{obj:['barre']})]]});
 F('curl_demi','Biceps : demi-amplitudes basse et haute','biceps',59,{c:A,niv:'confirmé',obj:'Biceps en endurance avec des demi-mouvements.',mat:['barre'],org:'Joueurs dispersés, une barre légère chacun.',
  der:'Debout, barre en main. 8 demi-mouvements en bas (de bras tendus à l’horizontale), puis 8 demi-mouvements en haut (de l’horizontale à la poitrine). Enchaîner 2 à 4 cycles.',
  cons:['Avant-bras à l’horizontale entre les deux parties','Coudes fixes','Respirer'],var:[['Cycles courts','4 + 4','plus facile']],
  s:[['Bas puis haut',PS([{...B(0)},{an:4,ae:88,fa:4,fe:88,d:.5},{...B(0),d:.5},{an:4,ae:88,fa:4,fe:88,d:.5},{an:4,ae:152,fa:4,fe:152,d:.5},{an:4,ae:88,fa:4,fe:88,d:.5},{an:4,ae:152,fa:4,fe:152,d:.5}],{obj:['barre']})]]});
 F('curl_fente','Biceps : flexion de bras en appui avant','biceps',60,{c:A,obj:'Biceps en équilibre sur la jambe avant.',mat:['halt1'],org:'Joueurs dispersés, un haltère léger chacun.',
  der:'En appui sur la jambe avant, buste incliné, une main sur la cuisse avant. L’autre bras (côté jambe arrière) fléchit l’avant-bras pour monter l’haltère, puis redescend. 10 par bras.',
  cons:['Coude fixe','Dos plat','Genou avant au-dessus de la cheville'],var:[['Debout','Debout, sans appui','plus facile']],
  s:[['Profil',PS([{...LEAN,an:60,ae:60,fa:2,fe:2},{...LEAN,an:60,ae:60,fa:2,fe:140,d:.9,h:.3}],{obj:['haltere_f']})]]});
 F('curl_halteres','Biceps : flexions alternées aux haltères','biceps','60 et 63',{c:A,obj:'Renforcer les biceps.',mat:['halt'],org:'Joueurs dispersés, deux haltères légers (ou deux bouteilles d’eau).',
  der:'Debout, haltères en main, bras le long du corps. Fléchir un bras puis l’autre en alternance. 10 par bras, 2 séries.',
  cons:['Coudes près du corps','Pas d’élan','Descente lente'],var:[['Prise marteau','Pouces vers le haut (prise neutre)','plus facile'],['Simultané','Les deux bras ensemble','plus difficile']],
  s:[['Vu de face',FC([{...BAS},{...BAS,la:4,le:176,fle:.45,d:.8,h:.2},{...BAS,d:.8},{...BAS,ra:-4,re:-176,fre:.45,d:.8,h:.2}],{obj:['haltere_g','haltere_d']})]]});
 F('double_biceps','Biceps : position double biceps','biceps',61,{c:A,obj:'Biceps et épaules en maintien (bras à l’horizontale).',mat:['halt'],org:'Joueurs dispersés, deux haltères légers.',
  der:'Debout, bras à l’horizontale sur les côtés. Fléchir les avant-bras vers le haut en gardant les coudes à hauteur des épaules, puis tendre. En simultané puis en alterné. 8 + 8.',
  cons:['Coudes à hauteur des épaules','Épaules basses','Charge très légère'],var:[['Sans haltère','Poings serrés','plus facile']],
  s:[['Simultané',FC([{...SIDE},{la:90,le:178,ra:-90,re:-178,d:.8,h:.3}],{obj:['haltere_g','haltere_d']})],['Alterné',FC([{...SIDE},{la:90,le:178,ra:-90,re:-90,d:.7},{...SIDE,d:.7},{la:90,le:90,ra:-90,re:-178,d:.7}],{obj:['haltere_g','haltere_d']})]]});
 F('baton_vertical','Biceps : bâton vertical, changer de main','biceps',62,{c:G,obj:'Biceps, épaules et triceps, avec coordination (changement de main).',mat:['baton'],org:DEB+' Un bâton chacun.',
  der:'Bras tendu sur le côté, bâton tenu à la verticale. 3 flexions de l’avant-bras, puis au 4e temps ramener le bâton devant soi et le passer dans l’autre main. 4 séries.',
  cons:['Bâton bien vertical','Épaule basse','Regarder le bâton au changement'],var:[['Plus de flexions','7 flexions et changement au 8e temps','plus difficile']],
  s:[['Vu de face',FC([{...BAS,ra:-90,re:-90,bv:0},{...BAS,ra:-90,re:-170,bv:0,d:.5},{...BAS,ra:-90,re:-90,bv:0,d:.5},{la:-20,le:-60,ra:20,re:60,fla:.7,fra:.7,bv:.5,d:.7},{...BAS,la:90,le:90,bv:1,d:.7},{...BAS,la:90,le:170,bv:1,d:.5},{...BAS,la:90,le:90,bv:1,d:.5}],{obj:['batonv']})]]});

 // ===================== CUISSES (p. 68-74) =====================
 F('combi_presse_squat','Cuisses : presse, squat ouvert droite et gauche','cuisses',72,{c:G,obj:'Enchaîner presse et squats ouverts (coordination, appuis).',org:DEB,mat:[],
  der:'Pieds joints, mains sur les hanches. Temps 1 : presse de face. Temps 2 : ouvrir à droite en squat ouvert. Temps 3 : revenir au centre en presse. Temps 4 : ouvrir à gauche en squat. 8 séries.',
  cons:['Genoux dans l’axe des pieds','Dos droit','Pas latéral franc'],var:[['Sans presse','Squats ouverts seuls','plus facile']],
  s:[['Vu de face',FC([{...HIP,...JT},{...HIP,lt:8,ls:-6,rt:-8,rs:6,flt:.6,frt:.6,d:.6},{...HIP,...SQO,x:120,d:.7},{...HIP,...JT,d:.6},{...HIP,lt:8,ls:-6,rt:-8,rs:6,flt:.6,frt:.6,d:.6},{...HIP,...SQO,x:180,d:.7}])]]});
 F('squat_fente','Cuisses : squats et fentes avant','cuisses',73,{c:A,niv:'confirmé',obj:'Enchaîner squat ouvert et fentes : appuis et changements de direction.',org:DEB,mat:[],
  der:'Jambes écartées, mains sur les hanches. Squat au centre, fente avant d’un côté, squat au centre, fente de l’autre côté. 8 enchaînements, 2 séries.',
  cons:['Genou avant au-dessus de la cheville','Buste droit','Revenir au centre en poussant sur le talon'],var:[['Sans squat','Fentes alternées seules','plus facile']],
  s:[['Profil',PS([{...HIP_P()},{...SQ,an:40,ae:-20,fa:40,fe:-20,d:.9},{...HIP_P(),d:.8},{...FEN,an:40,ae:-20,fa:40,fe:-20,d:.9}],{anc:'p'})]]});
 function HIP_P(){return{an:30,ae:-40,fa:30,fe:-40}}
 F('squats_3petits','Cuisses : squats droite, gauche et 3 petits','cuisses',74,{c:G,obj:'Endurance des cuisses et changements d’appuis.',org:DEB,mat:[],
  der:'Pieds joints. Squat ouvert à droite, retour, squat ouvert à gauche, retour, puis squat à droite avec 3 petits mouvements en bas. Recommencer en partant à gauche.',
  cons:['Rester bas pendant les petits mouvements','Genoux dans l’axe','Dos droit'],var:[['Sans petits','Squats droite-gauche seuls','plus facile']],
  s:[['Vu de face',FC([{...HIP,...JT},{...HIP,...SQO,x:120,d:.6},{...HIP,...JT,d:.6},{...HIP,...SQO,x:180,d:.6},{...HIP,...JT,d:.6},{...HIP,...SQO,x:120,d:.6},{...HIP,...DSQ,x:120,d:.25,h:0},{...HIP,...SQO,x:120,d:.25,h:0},{...HIP,...DSQ,x:120,d:.25,h:0},{...HIP,...SQO,x:120,d:.25}])]]});

 // ===================== DOS (p. 80-88) =====================
 F('tirage_barre','Dos : tirage de la barre, buste penché','dos',80,{c:A,niv:'confirmé',obj:'Renforcer le milieu du dos (trapèze, rhomboïdes, grand dorsal) : posture et protection.',mat:['barre'],org:'Joueurs dispersés, une barre légère chacun.',
  der:'Pieds largeur des épaules, jambes fléchies, buste incliné en avant, dos droit, prise large. Tirer la barre vers le ventre, coudes vers l’extérieur, puis redescendre. 10 répétitions, 2 séries.',
  cons:['Dos droit, jamais arrondi','Genoux fléchis','Tirer avec les coudes'],var:[['Prise serrée','Mains rapprochées : plus de grand dorsal','plus difficile']],
  s:[['Profil',PS([{t:130,hd:-10,tn:40,sn:-12,pn:90,tf:40,sf:-12,pf:90,...B(0)},{t:130,hd:-10,tn:40,sn:-12,pn:90,tf:40,sf:-12,pf:90,an:-62,ae:30,fa:-62,fe:30,d:.9,h:.3}],{obj:['barre']})]]});
 F('retropulsion','Dos : rétropulsion à l’haltère','dos',81,{c:A,obj:'Renforcer l’arrière des épaules et le haut du dos.',mat:['halt1'],org:'Joueurs dispersés, un haltère léger chacun.',
  der:'En appui avant, buste incliné dans le prolongement de la jambe arrière, mains en soutien sur la jambe avant. Pousser l’haltère vers l’arrière bras tendu, puis revenir. 1 temps aller, 1 temps retour. Finir par de petits mouvements en arrière.',
  cons:['Bras tendu','Dos plat','Contrôler l’aller et le retour'],var:[['Sans charge','Même geste sans haltère','plus facile']],
  s:[['Profil',PS([{...LEAN,an:60,ae:60,fa:4,fe:4},{...LEAN,an:60,ae:60,fa:-80,fe:-80,d:.9,h:.3}],{obj:['haltere_f']})]]});
 F('tirage_halteres','Dos : tirage à l’haltère, appui avant','dos',82,{c:A,niv:'confirmé',obj:'Renforcer le haut du dos.',mat:['halt1'],org:'Joueurs dispersés, un haltère léger chacun.',
  der:'Même position que la rétropulsion. Tirer le coude vers l’arrière et vers le haut, puis repousser l’haltère vers le bas. 10 par bras. Combinaison 4 temps : tirage, retour, rétropulsion, retour.',
  cons:['Coude près du corps','Dos plat','Pas d’à-coups'],var:[['Bande élastique','Remplacer l’haltère par un élastique','plus facile']],
  s:[['Tirage',PS([{...LEAN,an:60,ae:60,fa:4,fe:4},{...LEAN,an:60,ae:60,fa:-100,fe:-6,d:.9,h:.3}],{obj:['haltere_f']})],['Combinaison 4 temps',PS([{...LEAN,an:60,ae:60,fa:4,fe:4},{...LEAN,an:60,ae:60,fa:-100,fe:-6,d:.7},{...LEAN,an:60,ae:60,fa:4,fe:4,d:.7},{...LEAN,an:60,ae:60,fa:-80,fe:-80,d:.7}],{obj:['haltere_f']})]]});
 F('oiseau','Dos : l’oiseau aux haltères','dos','83-84',{c:A,niv:'confirmé',obj:'Renforcer le haut du dos et l’arrière des épaules.',mat:['halt'],org:'Joueurs dispersés, deux haltères légers.',
  der:'En squat ouvert, jambes fléchies, buste droit incliné vers l’avant. Ouvrir les bras sur les côtés, puis revenir en contrôlant. 10 répétitions, 2 séries.',
  cons:['Genoux bien fléchis pour soulager le bas du dos (les cuisses travaillent en isométrie)','Dos plat','Contrôle à l’aller et au retour'],var:[['Sur un step','À genoux sur le step (tapis sur le step), même ouverture des bras','plus facile']],
  s:[['Vu de face',FC([{ft:.45,lt:22,ls:-6,rt:-22,rs:6,flt:.8,frt:.8,la:4,le:2,ra:-4,re:-2,fla:.7,fra:.7,fle:.7,fre:.7},{ft:.45,lt:22,ls:-6,rt:-22,rs:6,flt:.8,frt:.8,la:95,le:95,ra:-95,re:-95,d:1,h:.3}],{obj:['haltere_g','haltere_d']})]]});
 F('rameur_elastique','Dos : le rameur à l’élastique','dos',85,{c:A,niv:'confirmé',obj:'Dos, bras et jambes ensemble, en équilibre (gainage).',mat:['elast','tapis'],
  der:'En équilibre sur les fessiers, élastique sous les pieds. Tirer avec les bras en poussant avec les jambes, comme un rameur, puis revenir. 10 répétitions.',
  cons:['Dos droit','Garder l’équilibre','Réservé aux confirmés'],var:[['Pieds au sol','Talons au sol, tirage des bras seul','plus facile']],
  s:[['Profil',P([{t:-160,hd:8,an:80,ae:80,fa:80,fe:80,tn:130,sn:60,pn:150,tf:130,sf:60,pf:150},{t:-150,hd:8,an:-40,ae:80,fa:-40,fe:80,tn:110,sn:110,pn:190,tf:110,sf:110,pf:190,d:.9,h:.3}],{obj:['elastique_n','elastique_f']})]]});
 F('retropulsion_baton','Dos : rétropulsion avec un bâton','dos',86,{c:G,obj:'Renforcer l’arrière des épaules et le haut du dos.',mat:['baton'],org:DEB+' Un bâton chacun.',
  der:'Debout, bâton tenu derrière soi, bras tendus. Pousser le bâton vers l’arrière puis revenir. Grande amplitude, puis petites amplitudes en position haute.',
  cons:['Ne pas pencher le buste en avant','Bras tendus','Épaules basses'],var:[['Combiné','Alterner poussée vers l’arrière et tirage vers le haut','plus difficile']],
  s:[['Profil',PS([{...B(-10)},{...B(-55),d:.8,h:.2}],{obj:['baton']})]]});
 F('tirage_baton','Dos : tirage du bâton vers le haut','dos',87,{c:G,obj:'Renforcer le haut du dos et les épaules.',mat:['baton'],org:DEB+' Un bâton chacun.',
  der:'Même position, bâton derrière soi. Tirer le bâton vers le haut en pliant les coudes, sans pencher le buste, puis redescendre. 12 répétitions.',
  cons:['Buste droit','Coudes vers le haut','Plus difficile que la rétropulsion'],var:[['Combiné','Poussée vers l’arrière puis tirage vers le haut','plus difficile']],
  s:[['Profil',PS([{...B(-10)},{an:-70,ae:-10,fa:-70,fe:-10,d:.8,h:.2}],{obj:['baton']})]]});
 F('superman','Lombaires : buste, jambes, puis les deux','dos',88,{c:G,obj:'Renforcer le bas du dos en statique.',
  der:'Couché sur le ventre, mains sous le menton. Élever le buste et tenir, reposer. Puis décoller les jambes et tenir. Puis combiner buste et jambes. 3 x 10 s pour chaque.',
  cons:['Mouvement doux, sans cambrer à l’excès','Regard vers le sol','À proscrire en cas de douleur ou blessure au dos'],var:[['Bras tendus','Bras tendus devant (superman)','plus difficile']],
  s:[['Buste',P([{...PRN,an:150,ae:40,fa:150,fe:40},{...PRN,t:104,hd:10,an:150,ae:40,fa:150,fe:40,d:1,h:1}])],['Jambes',P([{...PRN,an:150,ae:40,fa:150,fe:40},{...PRN,an:150,ae:40,fa:150,fe:40,tn:-104,sn:-104,tf:-104,sf:-104,pn:-8,pf:-8,d:1,h:1}])],['Combinaison',P([{...PRN,an:150,ae:40,fa:150,fe:40},{...PRN,t:104,hd:10,an:150,ae:40,fa:150,fe:40,tn:-104,sn:-104,tf:-104,sf:-104,pn:-8,pf:-8,d:1,h:1}])]]});

 // ===================== ÉPAULES (p. 92-97) =====================
 F('developpe_epaules','Épaules : développé alterné aux haltères','épaules',92,{c:A,obj:'Renforcer les épaules (duels, contacts).',mat:['halt'],org:DEB+' Deux haltères légers.',
  der:'Buste droit, jambes écartées largeur d’épaules, haltères aux épaules. Pousser un bras vers le haut puis l’autre, en alternance. 1 temps pour pousser, 1 pour revenir. 10 par bras.',
  cons:['Ventre serré, dos non cambré','Ne pas bloquer le coude','Regard devant'],var:[['Simultané','Les deux bras ensemble','plus difficile']],
  s:[['Vu de face',FC([{...EPA,...WI},{...EPA,...WI,la:168,le:174,d:.7,h:.2},{...EPA,...WI,d:.7},{...EPA,...WI,ra:-168,re:-174,d:.7,h:.2}],{obj:['haltere_g','haltere_d']})]]});
 F('pulsion_avant','Épaules : poussée d’un bras vers l’avant','épaules',93,{c:A,obj:'Avant de l’épaule à l’aller, arrière de l’épaule et dos au retour.',mat:['halt1'],org:DEB+' Un haltère léger.',
  der:'En fente avant, haltère à l’épaule. Pousser le bras vers l’avant, puis revenir en tirant le coude « loin » vers l’arrière. 10 par bras.',
  cons:['Buste stable','Tirer le coude loin derrière au retour','Pas d’élan'],var:[['Sans charge','Poing serré','plus facile']],
  s:[['Profil',PS([{...FEN,t:172,an:-50,ae:150,fa:20,fe:-20},{...FEN,t:172,an:88,ae:90,fa:20,fe:-20,d:.8,h:.2}],{obj:['haltere_n']})]]});
 F('elevation_frontale','Épaules : élévations frontales en 4 temps','épaules',93,{c:A,obj:'Renforcer l’avant des épaules.',mat:['halt'],org:DEB+' Deux haltères légers.',
  der:'Debout, haltères le long des cuisses. Lever un bras tendu devant jusqu’à l’horizontale, puis l’autre, redescendre le premier puis le second : 4 temps. 6 séries.',
  cons:['Pas d’élan avec le buste','Jusqu’à l’horizontale seulement','Épaules basses'],var:[['Combinaison 8 temps','4 temps d’élévations frontales puis 2 élévations latérales (voir fiche élévations latérales)','plus difficile']],
  s:[['Profil',PS([{...B(0)},{an:90,ae:90,fa:0,fe:0,d:.7},{...B(90),d:.7},{an:0,ae:0,fa:90,fe:90,d:.7}],{obj:['haltere_n','haltere_f']})]]});
 F('ecarte_lateral','Épaules : élévations latérales','épaules',94,{c:A,obj:'Renforcer le milieu des épaules.',mat:['halt'],org:DEB+' Deux haltères légers.',
  der:'Debout, haltères en main. Monter les bras sur le côté jusqu’à l’horizontale (1 temps), redescendre en contrôlant (1 temps). 10 répétitions, 2 séries.',
  cons:['Coudes légèrement fléchis','Pas d’élan','Au-delà de l’horizontale : plus de trapèze'],var:[['Combinaison 8 temps','Temps 1 à 4 : élévations frontales (un bras, l’autre, retour) ; temps 5-6 : élévation latérale ; 7-8 : retour','plus difficile']],
  s:[['Vu de face',FC([{...BAS},{...SIDE,d:.9,h:.3}],{obj:['haltere_g','haltere_d']})],['Combinaison 8 temps',FC([{...BAS},{...BAS,ra:-178,re:-178,fra:.3,fre:.3,d:.6},{la:178,le:178,ra:-178,re:-178,fla:.3,fle:.3,fra:.3,fre:.3,d:.6},{...BAS,la:178,le:178,fla:.3,fle:.3,d:.6},{...BAS,d:.6},{...SIDE,d:.8,h:.3}],{obj:['haltere_g','haltere_d']})]]});
 F('epaule_jete','Épaules : épaulé-jeté à la barre','épaules',95,{c:['U18','Seniors'],niv:'confirmé',obj:'Coordination et force du haut du corps (geste délicat).',mat:['barre'],org:'Joueurs dispersés, barre très légère ou bâton.',
  der:'Temps 1 : tirer la barre jusqu’à la poitrine et engager les coudes dessous, genoux légèrement fléchis. Temps 2 : pousser au-dessus de la tête. Temps 3 : redescendre à la poitrine. Temps 4 : redescendre aux cuisses. 8 répétitions.',
  cons:['Apprendre au bâton d’abord','Dos droit','Amortir avec les genoux'],var:[['Bâton','Bâton à la place de la barre','plus facile']],
  s:[['Profil',PS([{...B(0)},{an:-20,ae:165,fa:-20,fe:165,tn:20,sn:-12,tf:20,sf:-12,pn:90,pf:90,d:.7},{an:176,ae:178,fa:176,fe:178,d:.7,h:.2},{an:-20,ae:165,fa:-20,fe:165,d:.7}],{obj:['barre']})]]});
 F('developpe_barre','Épaules : développé devant à la barre','épaules',96,{c:A,niv:'confirmé',obj:'Renforcer les épaules et les triceps.',mat:['barre'],org:'Joueurs dispersés, barre légère ou bâton.',
  der:'Barre posée sur le haut de la poitrine, prise largeur d’épaules, mains en pronation. Pousser la barre vers le haut, redescendre. 10 répétitions.',
  cons:['Contrôle de la barre dans les deux temps','Ne pas cambrer','Une jambe devant pour éviter de compenser avec le dos'],var:[['Bâton','Sans charge','plus facile']],
  s:[['Profil',PS([{...FEN,t:178,an:12,ae:172,fa:12,fe:172},{...FEN,t:178,an:176,ae:178,fa:176,fe:178,d:1,h:.3}],{obj:['barre']})]]});
 F('baton_4t','Épaules : bâton en 4 temps, changer de main','épaules',97,{c:G,obj:'Épaules et coordination : ouvrir les bras en changeant de main.',mat:['baton'],org:DEB+' Un bâton chacun, beaucoup de place autour de soi.',
  der:'Bâton vertical tenu à deux mains devant soi. Ouvrir les bras sur les côtés, le bâton reste dans une main. Revenir, changer de main, ouvrir. Puis même chose en partant bras vers le haut. 8 séries.',
  cons:['Espace suffisant autour de chacun (sécurité)','Bras tendus à l’horizontale','Bâton vertical'],var:[['Lent','2 temps par position','plus facile']],
  s:[['Devant',FC([{la:-15,le:-60,ra:15,re:60,fla:.7,fra:.7,bv:0},{...SIDE,bv:0,d:.7},{la:-15,le:-60,ra:15,re:60,fla:.7,fra:.7,bv:1,d:.7},{...SIDE,bv:1,d:.7}],{obj:['batonv']})],['Vers le haut',FC([{la:172,le:178,ra:-172,re:-178,bv:0},{...SIDE,bv:0,d:.7},{la:172,le:178,ra:-172,re:-178,bv:1,d:.7},{...SIDE,bv:1,d:.7}],{obj:['batonv']})]]});

 // ===================== FESSIERS (p. 104-118) =====================
 F('abduction_debout','Fessiers : jambe ouverte sur le côté, debout','fessiers',104,{obj:'Renforcer le moyen fessier : stabilité du bassin et du genou d’appui.',mat:['baton'],org:DEB+' Un bâton chacun pour l’équilibre.',
  der:'Debout, une main sur le bâton. Ouvrir la jambe tendue sur le côté, puis la ramener sans poser. 1 temps pour monter, 1 pour descendre ; puis 4-4, 3-1, 2-2 ou petits battements. 10 par jambe.',
  cons:['Buste droit, ne pas pencher','Pied de face','Jambe d’appui légèrement fléchie'],var:[['Cercles','Petits cercles sur le côté au lieu des battements','plus difficile']],
  s:[['Vu de face',FC([{la:35,le:15,ra:-40,re:30,lt:4,ls:4,rt:-4,rs:-4},{la:35,le:15,ra:-40,re:30,lt:4,ls:4,rt:-40,rs:-40,d:.8,h:.3}],{obj:['batonv_g']})]]});
 F('ext_debout','Fessiers : extension de hanche, debout','fessiers',105,{obj:'Renforcer le grand fessier (poussée en course).',mat:['baton'],org:DEB+' Un bâton planté devant soi.',
  der:'Mains en appui sur le bâton, buste légèrement incliné en avant. Petits mouvements de jambe tendue vers l’arrière, sans lancer. 1 temps par aller-retour. 15 par jambe.',
  cons:['Petits mouvements, sans lancer la jambe','Ne pas cambrer','Serrer le fessier'],var:[['Avec lest','Lest à la cheville','plus difficile']],
  s:[['Profil',PS([{t:162,hd:10,an:40,ae:55,fa:40,fe:55,tn:2,sn:2,pn:92,tf:-4,sf:-4,pf:92},{t:162,hd:10,an:40,ae:55,fa:40,fe:55,tn:2,sn:2,pn:92,tf:-30,sf:-30,pf:-14,d:.5,h:.1}],{anc:'p',decor:[{t:'baton',x:180}]})]]});
 F('debout_8t','Fessiers : enchaînement debout en 8 temps','fessiers',106,{c:G,obj:'Fessiers, psoas et tenseur du fascia lata dans trois directions.',mat:['baton'],org:DEB+' Un bâton chacun.',
  der:'Mains sur le bâton. Temps 1 : monter le genou. Temps 2 : redescendre sans poser. Temps 3 : ouvrir la jambe sur le côté. Temps 4 : retour. Temps 5 à 7 : trois petites extensions vers l’arrière. Temps 8 : retour. 4 par jambe.',
  cons:['Pied d’appui stable','Buste droit','Ne pas poser le pied avant la fin'],var:[['Sans extensions','Genou et ouverture seulement (4 temps)','plus facile']],
  s:[['Genou et extensions (profil)',PS([{t:172,hd:6,an:40,ae:55,fa:40,fe:55,...{tn:2,sn:2,pn:92,tf:-2,sf:-2,pf:92}},{t:172,hd:6,an:40,ae:55,fa:40,fe:55,tn:2,sn:2,pn:92,tf:95,sf:0,pf:90,d:.5},{t:172,hd:6,an:40,ae:55,fa:40,fe:55,tn:2,sn:2,pn:92,tf:-2,sf:-2,pf:92,d:.5},{t:166,hd:8,an:40,ae:55,fa:40,fe:55,tn:2,sn:2,pn:92,tf:-26,sf:-26,pf:-10,d:.4,h:0},{t:166,hd:8,an:40,ae:55,fa:40,fe:55,tn:2,sn:2,pn:92,tf:-14,sf:-14,pf:0,d:.25,h:0},{t:166,hd:8,an:40,ae:55,fa:40,fe:55,tn:2,sn:2,pn:92,tf:-26,sf:-26,pf:-10,d:.25,h:0}],{anc:'p',decor:[{t:'baton',x:180}]})],
     ['Ouverture (de face)',FC([{la:35,le:15,ra:-40,re:30,...JT},{la:35,le:15,ra:-40,re:30,lt:4,ls:4,rt:-40,rs:-40,d:.6,h:.2}],{obj:['batonv_g']})]]});
 F('squat_abduction','Fessiers : squat et ouverture de jambe','fessiers',107,{c:G,obj:'Grands fessiers et quadriceps dans le squat, moyen fessier dans l’ouverture.',org:DEB,mat:[],
  der:'Jambes écartées largeur d’épaules. Temps 1 : squat. Temps 2 : en remontant, ouvrir la jambe droite. Temps 3 : squat dès que le pied repose. Temps 4 : ouvrir la jambe gauche. 8 séries.',
  cons:['Squat contrôlé, talons au sol','Buste droit pendant l’ouverture','Poser le pied doucement'],var:[['Sans squat','Ouvertures alternées seules','plus facile']],
  s:[['Vu de face',FC([{...HIP,...WI},{...HIP,...DSQ,d:.6},{...HIP,lt:4,ls:4,rt:-42,rs:-42,d:.6},{...HIP,...DSQ,d:.6},{...HIP,lt:42,ls:42,rt:-4,rs:-4,d:.6}])]]});
 F('extension_4p','Fessiers : extension de jambe, sur les coudes','fessiers',108,{obj:'Renforcer les fessiers (poussée en course et en sprint).',
  der:'En appui sur les coudes et les genoux. Repousser une jambe vers l’arrière, puis revenir sans poser le genou. 10 par jambe, 2 séries.',
  cons:['Ne pas accentuer la cambrure en haut','Regard vers le sol','Petits mouvements'],var:[['Jambe tendue','Jambe tendue vers l’arrière, petits battements de haut en bas','plus difficile'],['Talon vers le plafond','Genou fléchi à 90°, pousser le talon vers le plafond en petits mouvements','plus difficile']],
  s:[['Extension',P([{...QUC},{...QUC,tf:-84,sf:-172,pf:-165,d:.8,h:.4}])],['Jambe tendue, battements',P([{...QUC,tf:-80,sf:-80,pf:-8},{...QUC,tf:-98,sf:-98,pf:-20,d:.4,h:.1}])],['Talon vers le plafond',P([{...QUC,tf:-80,sf:-170,pf:-170},{...QUC,tf:-98,sf:-188,pf:-188,d:.4,h:.1}])]]});
 F('abduction_4p','Fessiers : ouverture de cuisse à quatre pattes','fessiers',109,{obj:'Renforcer le moyen et le petit fessier.',
  der:'À quatre pattes, en appui sur les mains (pas sur les coudes : la jambe toucherait le sol). Ouvrir la cuisse sur le côté genou fléchi, puis revenir. 10 par jambe.',
  cons:['Dos plat, bassin stable','Mouvement lent','Regard vers le sol'],var:[['Flexion-abduction','Jambe tendue à l’horizontale vers l’arrière, puis la ramener fléchie sur le côté','plus difficile'],['Petits battements','Jambe ouverte, petits battements','plus difficile']],
  s:[['Vu de dessus',PL([{...QP},{...QP,lt:180,flt:.85,ls:110,fls:.4,d:.8,h:.3}])]]});
 F('quadru_8t','Fessiers : enchaînement à quatre pattes (8 temps)','fessiers',110,{obj:'Enchaîner extension et ouverture de jambe.',
  der:'À quatre pattes. Deux extensions de jambe vers l’arrière (1 temps pour pousser, 1 pour ramener), puis 4 petits battements sur le côté jambe fléchie. « Pousse, ramène, pousse, ramène, et ouvre 4 fois. » 4 par jambe.',
  cons:['Bassin stable','Dos plat','Compter à voix haute'],var:[['Moins de battements','2 extensions et 2 battements','plus facile']],
  s:[['Vu de dessus',PL([{...QP},{...QP,lt:90,ls:90,flt:1,fls:1,d:.5},{...QP,d:.5},{...QP,lt:90,ls:90,flt:1,fls:1,d:.5},{...QP,d:.5},{...QP,lt:180,flt:.85,ls:110,fls:.4,d:.4},{...QP,lt:160,flt:.6,ls:100,fls:.6,d:.3,h:0},{...QP,lt:180,flt:.85,ls:110,fls:.4,d:.3,h:0},{...QP,lt:160,flt:.6,ls:100,fls:.6,d:.3,h:0}])]]});
 F('genou_pousse','Fessiers : genou ramené puis jambe poussée','fessiers',112,{obj:'Grand fessier dans le retour de la jambe (poussée).',
  der:'Couché sur le côté. Ramener le genou du dessus vers soi, puis repousser la jambe en poussant sur le talon, pointe de pied vers soi. 8 temps : 2 fois ramener-repousser, puis 4 battements jambe tendue.',
  cons:['Concentrer l’effort sur la poussée (grand fessier)','Bassin stable','Talon devant'],var:[['Sans battements','Ramener-repousser seulement','plus facile']],
  s:[['Vu de dessus',P([{...SUP,...B(-95),tn:90,sn:90,pn:180,tf:120,sf:40,pf:120},{...SUP,...B(-95),tn:200,sn:100,pn:190,tf:120,sf:40,pf:120,d:.7},{...SUP,...B(-95),tn:90,sn:90,pn:180,tf:120,sf:40,pf:120,d:.7,h:.3}])]]});
 F('genoux_flechis_costal','Fessiers : battements genou fléchi, sur le côté','fessiers',113,{obj:'Moyen et petit fessier, avec psoas en maintien.',
  der:'Couché sur le côté, deux genoux fléchis. Battements de la jambe du dessus en gardant le genou fléchi. 8 temps : 2 extensions de jambe avec retour en flexion, puis 4 battements jambe fléchie.',
  cons:['Pieds ensemble au départ','Bassin stable','Genou plus haut que le pied'],var:[['Plus de battements','8 battements','plus difficile']],
  s:[['Vu de face',FC([{...COS,lt:35,ls:95,rt:35,rs:95,flt:.45,frt:.45},{...COS,lt:115,ls:95,rt:35,rs:95,flt:.55,frt:.45,d:.5,h:.1}])]]});
 F('flexion_avant_costal','Fessiers : jambe tendue vers l’avant, sur le côté','fessiers','114-115',{obj:'Fléchisseurs de hanche à l’aller, grand fessier au retour, moyen fessier dans l’ouverture.',
  der:'Couché sur le côté, jambe du dessous fléchie, jambe du dessus tendue. 4 temps : fléchir la jambe tendue vers l’avant, la ramener dans le prolongement du corps en serrant le fessier, l’ouvrir sur le côté, revenir. 8 séries.',
  cons:['Haut du corps stable au sol, ne pas basculer en arrière','Jambe tendue','Contracter le fessier au retour'],var:[['Autre ordre','Flexion vers l’avant, ouverture depuis la flexion, retour en flexion, puis retour en contractant le fessier','plus difficile']],
  s:[['Flexion vers l’avant (vu de dessus)',P([{...SUP,...B(-95),tn:90,sn:90,pn:180,tf:120,sf:40,pf:120},{...SUP,...B(-95),tn:160,sn:160,pn:250,tf:120,sf:40,pf:120,d:.8,h:.2}])],['Ouverture (vu de face)',FC([{...COSB},{...COSB,lt:130,ls:130,d:.7,h:.2}])]]});
 F('battements_perp','Fessiers : battements jambe perpendiculaire','fessiers',116,{c:G,obj:'Moyen fessier en endurance, contrôle du tronc.',
  der:'Couché sur le côté. 8 temps : 3 petits battements jambe dans le prolongement du corps, changement de direction (4e temps), 3 battements jambe perpendiculaire au corps, changement (8e temps).',
  cons:['Ne pas compenser avec le buste vers l’arrière','Petits battements de haut en bas','Bassin stable'],var:[['Un seul sens','Battements dans le prolongement seulement','plus facile']],
  s:[['Vu de face',FC([{...COSB,lt:110,ls:110},{...COSB,lt:125,ls:125,d:.3,h:0},{...COSB,lt:110,ls:110,d:.3,h:0},{...COSB,lt:60,ls:60,flt:.4,fls:.4,d:.6},{...COSB,lt:75,ls:75,flt:.4,fls:.4,d:.3,h:0},{...COSB,lt:60,ls:60,flt:.4,fls:.4,d:.3,h:0}])]]});
 F('genou_rotation','Fessiers : rotation du genou, sur le côté','fessiers',117,{c:G,obj:'Rotateurs de hanche et moyen fessier (stabilité du genou).',
  der:'Couché sur le côté, genou du dessus levé, pointe de pied posée vers le genou de terre. Amener le genou levé vers le genou de terre en montant le talon, puis revenir. 4 temps : ajouter une extension de la jambe vers le haut.',
  cons:['Bassin stable','Mouvement lent','Talon qui monte quand le genou descend'],var:[['Avec extension','Ajouter l’extension de la jambe vers le haut (4 temps)','plus difficile']],
  s:[['Vu de face',FC([{...COSB,lt:150,ls:40},{...COSB,lt:100,ls:160,d:.7,h:.2},{...COSB,lt:150,ls:40,d:.7},{...COSB,lt:135,ls:135,d:.7,h:.2}])]]});

 F('pont_unipodal','Fessiers : pont, jambe croisée ou tendue','fessiers',118,{c:G,obj:'Grand fessier d’un côté à la fois, et stabilité du bassin (le pont de base est dans la fiche commune Pont).',
  der:'Couché sur le dos, genoux fléchis. Croiser une jambe sur l’autre et élever le bassin en contractant les fessiers, sans « jeter » les hanches, puis redescendre. Plus difficile : appui sur un pied, l’autre jambe tendue vers le plafond. 8 par côté, en 4-4, 3-1, 2-2.',
  cons:['Contracter les fessiers pour monter','Ne pas jeter les hanches vers le haut (bas du dos)','Bassin horizontal'],var:[['Pont classique','Deux pieds au sol','plus facile']],
  s:[['Jambe croisée',P([{...SUP,...B(88),tf:200,sf:150,pf:120},{...SUP,...B(88),t:-66,tn:110,sn:12,tf:230,sf:180,pf:150,d:1,h:.5}])],['Jambe tendue vers le haut',P([{...SUP,...B(88),tf:180,sf:180,pf:262},{...SUP,...B(88),t:-66,tn:110,sn:12,tf:200,sf:200,pf:282,d:1,h:.5}])]]});

 // ===================== ISCHIO-JAMBIERS (p. 122-123) =====================
 F('ischios_4p','Ischios : talon vers la fesse à quatre pattes','ischio-jambiers',122,{obj:'Renforcer les ischio-jambiers (prévention des claquages) ; les quadriceps au retour.',
  der:'À quatre pattes, une jambe tendue en arrière. Ramener le talon vers la fesse, puis tendre de nouveau. Dans la continuité du travail des fessiers. 10 par jambe.',
  cons:['Cuisse fixe','Dos plat','Descente lente'],var:[['Lest','Lest léger à la cheville','plus difficile']],
  s:[['Profil',P([{...QUC,tf:-84,sf:-84,pf:-10},{...QUC,tf:-84,sf:-190,pf:-190,d:.8,h:.3}])]]});
 F('pont_sureleve','Ischios : pont pieds sur le step','ischio-jambiers',122,{c:G,obj:'Chaîne ischios-fessiers-lombaires, ischios en priorité grâce aux pieds surélevés.',mat:['step','tapis'],org:'Joueurs sur un tapis, talons posés sur un step.',
  der:'Couché sur le dos, talons sur le step. Lever le bassin jusqu’à l’alignement épaules-hanches-genoux, puis redescendre. Mieux : monter lentement et descendre de même (4-4) pour préserver le bas du dos. 8 répétitions, 2 séries.',
  cons:['Monter et descendre lentement','Ne pas cambrer','Arrêter si crampe'],var:[['Une jambe','Une jambe levée','plus difficile']],
  s:[['Profil',P([{t:-92,hd:0,...B(88),tn:92,sn:92,pn:160,tf:92,sf:92,pf:160,x:90},{t:-58,hd:0,...B(88),tn:72,sn:72,pn:148,tf:72,sf:72,pf:148,x:90,d:1.2,h:1.2}],{decor:[{t:'step',x:166}]})]]});
 F('flexion_jambe','Ischios : talon vers la fesse, debout, lest','ischio-jambiers',123,{c:G,obj:'Renforcer les ischio-jambiers en appui unipodal.',mat:['lest'],org:DEB+' Lests de cheville (facultatifs), une main sur un bâton ou un mur.',
  der:'Debout sur une jambe. Ramener le talon vers la fesse, puis revenir sans reposer le pied. 10 par jambe. Idéal en enchaînement avec d’autres exercices.',
  cons:['Cuisse verticale','Bassin stable','Descente lente'],var:[['Sans lest','Poids du corps','plus facile']],
  s:[['Profil',PS([{an:50,ae:80,fa:50,fe:80},{an:50,ae:80,fa:50,fe:80,tn:6,sn:-128,pn:-100,d:1,h:.5}],{obj:['lest_n']})]]});

 // ===================== MOLLETS (p. 128-131) =====================
 F('mollets_squat','Mollets : squat ouvert, talons alternés','mollets','128-130',{c:G,obj:'Cuisses et mollets ensemble, équilibre en flexion.',org:DEB,mat:[],
  der:'En squat ouvert, dos droit, monter alternativement le talon droit puis le gauche (1 temps par talon). Combinaison 4 temps : sur les pointes, descendre en squat sur les pointes, poser les talons, se relever. Puis en sens inverse.',
  cons:['Rester bas, genoux dans l’axe des pieds','Corps stable','Dos droit'],var:[['Les deux talons','Monter les deux talons ensemble','plus facile']],
  s:[['Talons alternés',PS([{t:172,hd:0,...B(8),tn:42,sn:-30,pn:90,tf:42,sf:-30,pf:90},{t:168,hd:0,...B(8),tn:42,sn:-30,pn:42,tf:42,sf:-30,pf:90,d:.6},{t:172,hd:0,...B(8),tn:42,sn:-30,pn:90,tf:42,sf:-30,pf:90,d:.6},{t:168,hd:0,...B(8),tn:42,sn:-30,pn:90,tf:42,sf:-30,pf:42,d:.6}],{anc:'pf'})],
     ['Combinaison 4 temps',FC([{...HIP,lt:20,ls:20,rt:-20,rs:-20},{...HIP,lt:20,ls:20,rt:-20,rs:-20,air:5,d:.6},{...HIP,...SQO,air:5,d:.7},{...HIP,...SQO,d:.6},{...HIP,lt:20,ls:20,rt:-20,rs:-20,d:.7}])],
     ['Sens inverse',FC([{...HIP,lt:20,ls:20,rt:-20,rs:-20},{...HIP,...SQO,d:.7},{...HIP,...SQO,air:5,d:.6},{...HIP,lt:20,ls:20,rt:-20,rs:-20,air:5,d:.7},{...HIP,lt:20,ls:20,rt:-20,rs:-20,d:.6}])]]});
 F('pointes','Mollets : sur le bord du step','mollets',131,{c:TT,obj:'Renforcer les mollets : impulsion, appuis et prévention des entorses.',mat:['step','baton'],org:'Un step chacun (ou une marche), un bâton pour l’équilibre.',
  der:'Avant des pieds sur le bord du step, talons dans le vide, mains sur le bâton. Monter sur la pointe des pieds lentement (4 temps), redescendre en 4 temps. 12 répétitions, 2 séries.',
  cons:['Mouvement lent pour rester stable','Chevilles droites','Genoux tendus non bloqués'],var:[['Au sol','Sans step','plus facile'],['Une jambe','Sur un pied','plus difficile']],
  s:[['Profil',PS([{an:30,ae:70,fa:30,fe:70,pn:110,pf:110,air:13},{an:30,ae:70,fa:30,fe:70,pn:42,pf:42,air:13,d:1.4,h:.4}],{decor:[{t:'step',x:146},{t:'baton',x:178}]})]]});
 F('curl_mollets','Combinaison biceps-mollets','mollets',131,{c:A,obj:'Coordination haut et bas du corps.',mat:['halt'],org:DEB+' Deux haltères légers.',
  der:'Debout, haltères en main. Fléchir les bras en déroulant une cheville (talon qui monte), en alternance droite-gauche. 16 temps, 3 séries.',
  cons:['Gainage','Coudes fixes','Mouvement régulier'],var:[['Sans haltère','Poings serrés','plus facile']],
  s:[['Profil',PS([{...B(0)},{an:4,ae:150,fa:4,fe:150,pn:42,d:.7},{...B(0),d:.7},{an:4,ae:150,fa:4,fe:150,pf:42,d:.7}],{obj:['haltere_n','haltere_f']})]]});

 // ===================== PECTORAUX (p. 136-140) =====================
 F('compression_ballon','Pectoraux : comprimer un ballon','pectoraux',136,{c:TT,obj:'Renforcer les pectoraux en statique.',mat:['ballon'],org:DEB+' Un ballon souple (ou de foot) chacun.',
  der:'Ballon tenu à deux mains devant la poitrine. Comprimer le ballon en soufflant, relâcher en inspirant. 10 x 5 s.',
  cons:['Coudes à hauteur des mains','Souffler pendant l’effort','Épaules basses'],var:[['Élastique','Élastique passé dans le dos : pousser les bras vers l’avant en les rapprochant','plus difficile']],
  s:[['Ballon',PS([{an:28,ae:98,fa:28,fe:98},{an:12,ae:96,fa:12,fe:96,d:1,h:.6},{an:5,ae:92,fa:5,fe:92,d:.6,h:.4}],{obj:['ballon']})],['Élastique',PS([{an:-40,ae:90,fa:-40,fe:90},{...B(90),d:.8,h:.3}])]]});
 F('ecarte_serre','Pectoraux : écarté-serré aux haltères','pectoraux',137,{c:A,niv:'confirmé',obj:'Renforcer les pectoraux.',mat:['halt','step'],org:'Joueurs couchés sur un step, deux haltères légers.',
  der:'Couché sur le step, pieds au sol, bras tendus au-dessus de la poitrine. Ouvrir les bras sur les côtés (1 temps), les refermer (1 temps). 10 répétitions.',
  cons:['Coudes légèrement fléchis','Ne pas descendre sous le step','Bas du dos sur le step'],var:[['Sans charge','Mains vides','plus facile']],
  s:[['Vu de dessus',PL([{t:-90,pv:-90,la:180,le:180,ra:0,re:0,lt:120,ls:30,rt:60,rs:150,fla:.3,fle:.3,fra:.3,fre:.3},{t:-90,pv:-90,la:180,le:180,ra:0,re:0,lt:120,ls:30,rt:60,rs:150,d:1,h:.3}],{obj:['haltere_g','haltere_d'],decor:[{t:'step',x:140}]})]]});
 F('pull_over','Pectoraux : pull-over','pectoraux',137,{c:A,niv:'confirmé',obj:'Pectoraux, dorsaux et ouverture de la cage thoracique.',mat:['halt1','step'],org:'Joueurs couchés sur un step, un haltère léger tenu à deux mains.',
  der:'Couché sur le step, haltère tenu bras tendus au-dessus de la poitrine. Descendre les bras vers l’arrière de la tête (1 temps), revenir (1 temps). Finir par de petites amplitudes vers l’arrière.',
  cons:['Bas du dos sur le step','Bras presque tendus','Ne pas forcer l’épaule'],var:[['Petites amplitudes','Rester bras en arrière : petits mouvements','plus difficile']],
  s:[['Profil',P([{...STEPC,...B(178)},{...STEPC,...B(-98),d:1,h:.3}],{decor:STEP,obj:['haltere_n']})]]});
 F('pecs_4t','Pectoraux : développé et pull-over en 4 temps','pectoraux',138,{c:A,niv:'confirmé',obj:'Enchaîner développé et pull-over.',mat:['halt','step'],org:'Joueurs couchés sur un step, deux haltères légers.',
  der:'Couché sur le step, haltères à la poitrine. Temps 1 : pousser vers le haut. Temps 2 : bras en arrière (pull-over). Temps 3 : revenir vers le haut. Temps 4 : redescendre à la poitrine. 8 séries.',
  cons:['Bas du dos sur le step','Contrôle dans les 4 temps','Charge légère'],var:[['Sans pull-over','Développé seul','plus facile']],
  s:[['Profil',P([{...STEPC,an:-40,ae:178,fa:-40,fe:178},{...STEPC,...B(178),d:.7},{...STEPC,...B(-98),d:.8},{...STEPC,...B(178),d:.8}],{decor:STEP,obj:['haltere_n','haltere_f']})]]});
 F('developpe_couche','Pectoraux : développé couché à la barre','pectoraux',139,{c:A,niv:'confirmé',obj:'Renforcer pectoraux, épaules et triceps.',mat:['barre','step'],org:'Joueurs couchés sur un step, barre légère, un partenaire pour assurer.',
  der:'Couché sur le step, prise de barre large. Pousser la barre vers le haut, redescendre. En 4-4, 3-1, 2-2 ou 1-1 ; ajouter des demi-amplitudes (moitié basse ou moitié haute).',
  cons:['Pieds au sol','Coudes à 45° du corps','Partenaire attentif'],var:[['Haltères','Deux haltères légers','plus facile']],
  s:[['Profil',P([{...STEPC,an:-40,ae:178,fa:-40,fe:178},{...STEPC,...B(178),d:1,h:.3}],{decor:STEP,obj:['barre']})]]});

 // ===================== TRICEPS (p. 144-147) =====================
 F('kickback','Triceps : extension en appui avant','triceps',144,{c:A,obj:'Renforcer l’arrière des bras.',mat:['halt1'],org:DEB+' Un haltère léger.',
  der:'En appui sur la jambe avant, le bras opposé fléchi, coude tiré vers l’arrière. Tendre l’avant-bras vers l’arrière, puis fléchir. Longues séries en grande amplitude, finir par de petits mouvements.',
  cons:['Seul l’avant-bras bouge','Dos plat','Pas d’à-coups'],var:[['Position debout','Debout, bras levé coude vers le haut : descendre l’avant-bras derrière la tête puis tendre','plus difficile']],
  s:[['Appui avant',PS([{...LEAN,an:60,ae:60,fa:-100,fe:-6},{...LEAN,an:60,ae:60,fa:-100,fe:-100,d:.8,h:.3}],{obj:['haltere_f']})],['Debout',PS([{an:0,ae:0,fa:178,fe:178},{an:0,ae:0,fa:178,fe:-20,d:.9,h:.3}],{obj:['haltere_f']})]]});
 F('triceps_couche','Triceps : extension couché à la barre','triceps',145,{c:A,niv:'confirmé',obj:'Renforcer les triceps.',mat:['barre','step'],org:'Joueurs couchés sur un step, barre légère, un partenaire.',
  der:'Couché sur le step, prise largeur d’épaules. Fléchir les avant-bras pour amener la barre vers le front, coudes vers l’avant, puis tendre. Jambes fléchies si le bas du dos se cambre. 10 répétitions.',
  cons:['Coudes fixes','Mouvement lent','Charge légère'],var:[['Haltère','Un haltère tenu à deux mains','plus facile']],
  s:[['Profil',P([{...STEPC,...B(176)},{...STEPC,an:176,ae:-100,fa:176,fe:-100,d:1,h:.3}],{decor:STEP,obj:['barre']})]]});
 F('developpe_triceps','Triceps : développé coudes serrés','triceps',146,{c:A,niv:'confirmé',obj:'Triceps et pectoraux.',mat:['barre','step'],org:'Joueurs couchés sur un step, barre légère, un partenaire.',
  der:'Même position. Amener la barre au niveau du ventre en gardant les coudes près du corps, puis la repousser à la verticale. 10 répétitions.',
  cons:['Coudes contre le corps','Barre au-dessus du ventre','Contrôle'],var:[['Haltères','Deux haltères','plus facile']],
  s:[['Profil',P([{...STEPC,...B(176)},{...STEPC,an:60,ae:170,fa:60,fe:170,d:1,h:.3}],{decor:STEP,obj:['barre']})]]});
 F('dips','Triceps : dips sur le step','triceps',147,{c:G,obj:'Renforcer les triceps au poids du corps.',mat:['step'],org:'Joueurs assis au sol devant un step.',
  der:'Assis au sol, mains en appui sur le step derrière soi. Tendre les bras pour décoller les fesses, puis revenir sans reposer les fesses au sol. 10 répétitions.',
  cons:['Coudes vers l’arrière','Épaules basses','Ne pas reposer les fesses'],var:[['Jambes tendues','Jambes tendues devant','plus difficile']],
  s:[['Profil',P([{t:176,hd:4,an:-20,ae:20,fa:-20,fe:20,tn:96,sn:-10,pn:90,tf:96,sf:-10,pf:90,air:6,x:150},{t:176,hd:4,an:-20,ae:-20,fa:-20,fe:-20,tn:78,sn:-20,pn:90,tf:78,sf:-20,pf:90,air:16,x:150,d:.9,h:.3}],{anc:'h',decor:[{t:'step',x:128}]})]]});
 F('pompes_triceps','Triceps : pompes coudes serrés','triceps',147,{c:G,obj:'Triceps et pectoraux au poids du corps.',
  der:'Mains à l’aplomb des épaules. En fléchissant les bras, les coudes restent orientés vers l’arrière, contre le corps. 8 répétitions, 2 séries (sur les genoux si besoin).',
  cons:['Coudes contre le corps','Corps gainé','Descente lente'],var:[['Sur les genoux','Appui sur les genoux','plus facile']],
  s:[['Profil',(()=>{const m=PRE('pompes');return m||P([{...PRN}])})()]]});

 // ===================== ENCHAÎNEMENTS (p. 151-162) =====================
 F('quadri_costal','Enchaînement : jambe allongée puis levée','fessiers',151,{obj:'Quadriceps et fessiers dans un enchaînement couché sur le côté.',
  der:'Couché sur le côté, genou du dessus fléchi. 4 temps : allonger la jambe vers l’avant en poussant sur le talon, lever la jambe tendue, revenir à l’horizontale, replier le genou. 8 séries.',
  cons:['Talon devant, pointe vers soi','Bassin stable','Retour contrôlé'],var:[['Sans élévation','Allonger et replier seulement','plus facile']],
  s:[['Vu de face',FC([{...COSB,lt:40,ls:100,flt:.5},{...COSB,lt:70,ls:70,flt:.4,fls:.4,d:.6},{...COSB,lt:125,ls:125,flt:.6,fls:.6,d:.6},{...COSB,lt:70,ls:70,flt:.4,fls:.4,d:.6}])]]});
 F('costal_8t','Enchaînement couché sur le côté en 8 temps','fessiers',152,{c:G,obj:'Fessiers et quadriceps en enchaînement long.',
  der:'Couché sur le côté, jambe tendue. Ramener le genou, allonger la jambe vers l’avant en poussant sur le talon, replier le genou, repousser la jambe dans le prolongement du corps, puis 4 battements de jambe.',
  cons:['Compter les 8 temps','Haut du corps stable','Battements contrôlés'],var:[['4 temps','Sans battements','plus facile']],
  s:[['Vu de face',FC([{...COSB,lt:90,ls:90},{...COSB,lt:40,ls:100,flt:.5,d:.5},{...COSB,lt:70,ls:70,flt:.4,fls:.4,d:.5},{...COSB,lt:40,ls:100,flt:.5,d:.5},{...COSB,lt:90,ls:90,d:.5},{...COSB,lt:122,ls:122,d:.3,h:0},{...COSB,lt:100,ls:100,d:.3,h:0},{...COSB,lt:122,ls:122,d:.3,h:0}])]]});
 F('cuisses_epaules_2t','Enchaînement cuisses-épaules en 2 temps','cuisses',153,{c:A,obj:'Dissociation : bras dans deux directions, jambes dans une autre action.',mat:['halt'],org:DEB+' Deux haltères légers.',
  der:'Jambes écartées, haltères en main. Temps 1 : fléchir une jambe sur le côté, un bras à l’horizontale sur le côté, l’autre haltère à l’épaule. Temps 2 : retour. Puis de l’autre côté. 8 par côté.',
  cons:['Genou fléchi dans l’axe du pied','Dos droit','Bras à l’horizontale'],var:[['Sans haltère','Poings serrés','plus facile']],
  s:[['Vu de face',FC([{...BAS,...WI},{la:90,le:90,ra:-4,re:-176,fre:.45,lt:24,ls:24,rt:-48,rs:-14,frt:.9,x:140,d:.7,h:.2},{...BAS,...WI,d:.7},{ra:-90,re:-90,la:4,le:176,fle:.45,rt:-24,rs:-24,lt:48,ls:14,flt:.9,x:160,d:.7,h:.2}],{obj:['haltere_g','haltere_d']})]]});
 F('cuisses_epaules_4t','Enchaînement cuisses-épaules en 4 temps','cuisses',154,{c:A,obj:'Squat et élévations des bras : deltoïdes et trapèzes.',mat:['halt'],org:DEB+' Deux haltères légers.',
  der:'Jambes écartées. Temps 1 : squat et bras à l’horizontale sur les côtés. Temps 2 : bras à la verticale. Temps 3 : bras à l’horizontale. Temps 4 : se relever, bras le long du corps. 8 séries.',
  cons:['Rester en squat pendant les temps 1 à 3','Dos droit','Charge légère'],var:[['Sans haltère','Bras libres','plus facile']],
  s:[['Vu de face',FC([{...BAS,lt:20,ls:20,rt:-20,rs:-20},{...SIDE,...SQO,d:.8},{...HAUT,...SQO,d:.7},{...SIDE,...SQO,d:.7}],{obj:['haltere_g','haltere_d']})]]});
 F('squat_developpe','Enchaînement cuisses-épaules à la barre','cuisses',155,{c:A,niv:'confirmé',obj:'Squat et développé : coordination haut et bas du corps.',mat:['barre'],org:DEB+' Barre légère ou bâton.',
  der:'Barre tenue bras tendus devant les cuisses. Temps 1 : monter la barre au-dessus de la tête. Temps 2 : squat, barre aux épaules. Temps 3 : se relever en poussant la barre au-dessus de la tête. Temps 4 : redescendre la barre aux cuisses. 8 séries.',
  cons:['Squat contrôlé, talons au sol','Dos droit','Ne pas cambrer bras en haut'],var:[['Bâton','Bâton à la place de la barre','plus facile']],
  s:[['Vu de face',FC([{la:20,le:20,ra:-20,re:-20,lt:14,ls:14,rt:-14,rs:-14},{la:165,le:172,ra:-165,re:-172,lt:14,ls:14,rt:-14,rs:-14,d:.8},{...TRAP,...SQO,d:.8},{la:165,le:172,ra:-165,re:-172,lt:14,ls:14,rt:-14,rs:-14,d:.8}],{obj:['barre']})]]});
 F('epaules_triceps','Enchaînement épaules-triceps en 4 temps','triceps',156,{c:A,obj:'Épaules puis triceps dans la même position de fente.',mat:['halt1'],org:DEB+' Un haltère léger.',
  der:'En fente, haltère à l’épaule. Temps 1 : pousser le bras vers l’avant. Temps 2 : revenir à l’épaule. Temps 3 : buste incliné, tendre l’avant-bras vers l’arrière (triceps). Temps 4 : retour. 8 par bras.',
  cons:['Buste stable','Coude fixe au temps 3','Charge légère'],var:[['Sans charge','Poing serré','plus facile']],
  s:[['Profil',PS([{...FEN,t:165,an:-50,ae:150,fa:20,fe:-20},{...FEN,t:165,an:88,ae:90,fa:20,fe:-20,d:.7},{...FEN,t:165,an:-50,ae:150,fa:20,fe:-20,d:.7},{...FEN,t:150,an:-90,ae:-90,fa:20,fe:-20,d:.7}],{obj:['haltere_n']})]]});
 F('cuisses_bras','Enchaînement cuisses-épaules-biceps-triceps','cuisses',157,{c:A,obj:'Squat tenu et travail alterné des bras.',mat:['halt'],org:DEB+' Deux haltères légers.',
  der:'En squat ouvert, bras à l’horizontale sur les côtés. Fléchir un avant-bras vers la poitrine pendant que l’autre reste tendu, puis inverser. 16 temps, 2 séries.',
  cons:['Rester en squat','Coudes à hauteur des épaules','Dos droit'],var:[['Debout','Sans squat','plus facile']],
  s:[['Vu de face',FC([{la:90,le:-20,ra:-90,re:-90,fle:.7,...SQO},{la:90,le:90,ra:-90,re:20,fre:.7,...SQO,d:.7}],{obj:['haltere_g','haltere_d']})]]});
 F('epaules_pecs','Enchaînement épaules-pectoraux','pectoraux',157,{c:G,obj:'Épaules et pectoraux : rapprocher les coudes devant le visage.',org:DEB,mat:[],
  der:'Debout, avant-bras à la verticale devant le visage, coudes écartés à hauteur des épaules. Rapprocher les coudes l’un de l’autre, puis les écarter. 16 répétitions.',
  cons:['Coudes à hauteur des épaules','Avant-bras verticaux','Serrer fort en fin de mouvement'],var:[['Avec un ballon','Ballon serré entre les avant-bras','plus difficile']],
  s:[['Vu de face',FC([{la:90,le:178,ra:-90,re:-178},{la:-20,le:178,ra:20,re:-178,fla:.5,fra:.5,d:.7,h:.2}])]]});
 F('bras_jambe_halteres','Enchaînement bras et jambe opposés, haltère','dos',158,{c:A,obj:'Épaules, dos et grands fessiers ; gainage de tout le tronc.',mat:['halt1','tapis'],
  der:'En appui sur une main (haltère dans l’autre main, ou sans) et sur le genou opposé. Tendre en même temps le bras vers l’avant et la jambe opposée vers l’arrière, puis revenir. 8 par côté.',
  cons:['Dos plat, bassin horizontal','Bras et jambe dans le prolongement du corps','Mouvement lent'],var:[['Sans haltère','Main vide','plus facile']],
  s:[['Profil',P([{...QUA,ae:0,an:-90,fe:0,fa:0},{...QUA,an:90,ae:90,tf:-90,sf:-90,pf:-4,d:1,h:.5}],{obj:['haltere_n']})]]});
 F('pompes_bras','Enchaînement pectoraux-épaules : pompes et bras','pectoraux',159,{c:G,obj:'Pectoraux puis épaules : pompe sur les genoux et bras tendu devant.',
  der:'Appui sur les genoux. Temps 1 : descendre (pompe). Temps 2 : remonter en tendant un bras devant. Temps 3 : pompe. Temps 4 : remonter en tendant l’autre bras. 8 séries.',
  cons:['Corps aligné des genoux à la tête','Gainage pendant le bras tendu','Descente lente'],var:[['Sans bras','Pompes sur les genoux seules','plus facile']],
  s:[['Profil',P([{t:116,hd:-6,an:0,ae:0,fa:0,fe:0,tn:-58,sn:-148,pn:-140,tf:-58,sf:-148,pf:-140},{t:100,hd:-4,an:-60,ae:30,fa:-60,fe:30,tn:-74,sn:-148,pn:-140,tf:-74,sf:-148,pf:-140,d:.8},{t:116,hd:-6,an:95,ae:95,fa:0,fe:0,tn:-58,sn:-148,pn:-140,tf:-58,sf:-148,pf:-140,d:.8,h:.3}],{anc:'g'})]]});
 F('transition_pecs_abdos','Transition pectoraux-abdominaux','abdominaux',160,{c:A,obj:'Passer du travail des pectoraux à celui des abdominaux sans pause.',mat:['halt1','tapis'],
  der:'Couché sur le dos, genoux fléchis, haltère tenu bras tendus. Temps 1 : pull-over. Temps 2 : ramener l’haltère sur la poitrine. Temps 3 : relevé de buste. Temps 4 : redescendre et tendre les bras. 8 séries.',
  cons:['Bas du dos au sol','Haltère contre la poitrine pendant le relevé','Charge légère'],var:[['Sans haltère','Mains vides','plus facile']],
  s:[['Profil',P([{...SUP,...B(178)},{...SUP,...B(-96),d:.8},{...SUP,an:-30,ae:160,fa:-30,fe:160,d:.8},{...SUP,...UP,an:-10,ae:150,fa:-10,fe:150,d:.8},{...SUP,...B(178),d:.8}],{obj:['haltere_n']})]]});
 F('epaules_obliques','Enchaînement épaules-obliques','abdominaux',161,{c:G,obj:'Épaules en statique, obliques en dynamique.',org:DEB,mat:[],
  der:'Bras à l’horizontale. Pousser le buste à droite sans bouger le bas du corps, revenir au centre, pousser à gauche, revenir. Puis directement droite-gauche, ou en 8 temps : droite, gauche, droite, droite, gauche, droite, gauche, gauche.',
  cons:['Bassin fixe','Bras à l’horizontale','Buste droit, pas penché'],var:[['Sans temps intermédiaire','Droite-gauche directement','plus difficile']],
  s:[['Vu de face',FC([{...SIDE,...WI},{...SIDE,...WI,t:168,hd:12,d:.6,h:.2},{...SIDE,...WI,d:.6},{...SIDE,...WI,t:192,hd:-12,d:.6,h:.2}])]]});
 F('cuisses_add_obliques','Enchaînement cuisses-adducteurs-obliques','adducteurs',162,{c:A,obj:'Cuisses, adducteurs et obliques ensemble.',mat:['baton'],org:DEB+' Un bâton chacun.',
  der:'Jambes écartées, bâton sur les trapèzes. Incliner le buste d’un côté pendant que la jambe opposée se fléchit (fente latérale). Plusieurs séries d’un côté avant de changer.',
  cons:['Genou fléchi dans l’axe du pied','Buste dans le plan','Bâton légèrement décalé du côté de l’inclinaison'],var:[['Sans bâton','Mains sur les hanches','plus facile']],
  s:[['Vu de face',FC([{...TRAP,lt:18,ls:18,rt:-18,rs:-18},{...TRAP,t:155,hd:-5,lt:18,ls:18,rt:-55,rs:-14,frt:.9,x:162,d:.9,h:.3}],{obj:['baton']})]]});

 // Hors répertoire : fiches gardées (le livre ne les propose pas : à valider par Bertrand)
 F('canif','Canif (buste et genoux ensemble)','abdominaux','-',{c:A,niv:'confirmé',obj:'Gainage dynamique du ventre : relier le buste et les jambes, utile pour les duels et les sauts de tête.',
  der:'Couché sur le dos, bras tendus derrière la tête. Ramener en même temps le buste et les genoux l’un vers l’autre, puis revenir sans poser les talons. 8 répétitions, 2 séries.',
  cons:['Genoux légèrement fléchis, jamais bloqués','Pas de traction sur la nuque','Revenir lentement','Arrêter si douleur dans le bas du dos'],var:[['Alterné','Monter un genou à la fois en croisant la main opposée','plus facile']],
  s:[['Canif',P([{t:-92,hd:0,an:-92,ae:-92,fa:-92,fe:-92,tn:90,sn:90,pn:170,tf:90,sf:90,pf:170,x:130,h:.6},{t:-142,hd:-6,an:130,ae:130,fa:128,fe:128,tn:128,sn:118,pn:195,tf:126,sf:116,pf:195,x:130,d:1.1,h:.5}])]]});
 F('descente_jambes','Descente de jambes tendues','abdominaux','-',{c:A,niv:'confirmé',obj:'Renforcer le bas du ventre et les fléchisseurs de hanche (frappe, courses, duels).',
  der:'Couché sur le dos, jambes tendues à la verticale, bras le long du corps. Descendre lentement les deux jambes tendues, s’arrêter avant que le bas du dos se décolle, puis remonter. 8 répétitions, 2 séries.',
  cons:['Bas du dos toujours plaqué au sol','Descente en 3 secondes','Jambes tendues, pointes de pieds relevées'],var:[['Genoux fléchis','Descendre les jambes genoux fléchis','plus facile']],
  s:[['Descente',P([{...SUP,...B(88),...VER,h:.5},{...SUP,...B(88),tn:122,sn:122,pn:204,tf:122,sf:122,pf:204,d:1.6,h:.5}])]]});
 OUT.slice(-2).forEach(f=>f.source='Hors répertoire Stoffer (le livre ne propose pas ce mouvement)');

 // Fiches communes complétées par le livre (même mouvement : schémas et variantes en plus, pas de doublon)
 const PLUS={
  crunch:{p:23,v:[['Tempo','Monter et descendre en 4 temps, puis 2-2, 3-1 et explosif (1 temps pour monter, 3 pour descendre)','plus difficile']]},
  squat:{p:'68-70',v:[['Squats ouverts','Jambes écartées, talons puis pointes de pieds vers l’extérieur','plus difficile'],['Presse','Pieds joints, genoux serrés','plus difficile'],['Tempo','4-4, 3-1, 2-2, 1-1','plus difficile']],
   s:[['Squat ouvert (de face)',FC([{...HIP,lt:20,ls:20,rt:-20,rs:-20},{...HIP,...SQO,d:1,h:.3}])],['Presse, pieds joints',PS([{...HIP_P()},{...SQ,tn:70,sn:-34,tf:70,sf:-34,...HIP_P(),d:1,h:.3}])]]},
  fente:{p:'70-71',v:[['Jambe reculée','Reculer la jambe au lieu d’avancer','plus facile'],['Fente placée','Jambe avant déjà placée : descendre et remonter sur place (3-1, 2-2) ; le genou ne dépasse pas la cheville','plus facile']],
   s:[['Fente placée',PS([{...FEN,an:30,ae:-40,fa:30,fe:-40,tn:60,sn:-8,tf:-10,sf:-30},{...FEN,an:30,ae:-40,fa:30,fe:-40,d:1,h:.3}],{anc:'p'})]]},
  pompes:{p:'139-140',v:[['Sur les genoux','Appui sur les genoux si trop difficile','plus facile'],['Pompes en 4 temps','Flexion-extension en alternant l’appui sur le bras droit puis le gauche (confirmés)','plus difficile']]},
  abduction:{p:111,v:[['Enchaînement 8 temps','Monter la jambe en 2 temps, descendre en 2 temps, puis 4 petits battements','plus difficile']],s:[['Vu de face',FC([{...COSB},{...COSB,lt:128,ls:128,d:.8,h:.3}])]]}
 };

 phPresets=function(){return base().concat(LIB)};
 OUT.forEach(f=>{const i=window.EXERCICES_PHY.findIndex(x=>x.id==f.id);if(i>=0)window.EXERCICES_PHY.splice(i,1);window.EXERCICES_PHY.push(f)});
 Object.entries(PLUS).forEach(([id,o])=>{const f=window.EXERCICES_PHY.find(x=>x.id=='phy-'+id);if(!f)return;
  f.source=(f.source?f.source+' ; ':'')+SRC+', p. '+o.p;
  o.v.forEach(([nom,change,difficulte])=>{if(!f.variantes.some(y=>y.nom==nom))f.variantes.push({nom,change,difficulte})});
  if(o.s&&f.schema_physique&&!f.schemas_physique)f.schemas_physique=[{nom:f.titre,m:f.schema_physique}].concat(o.s.map(([nom,m])=>({nom,m})))});
 // Sous-catégorie Muscle des fiches communes
 const MUS={abdominaux:'crunch canif descente_jambes gainage gainage_lat',cuisses:'squat fente squat_saut squat_1p chaise',dos:'bird_dog',fessiers:'abduction pont','ischio-jambiers':'nordique',pectoraux:'pompes'};
 Object.entries(MUS).forEach(([m,l])=>l.split(' ').forEach(i=>{const f=window.EXERCICES_PHY.find(x=>x.id=='phy-'+i);if(f&&!f.muscle)f.muscle=m}));
})();
