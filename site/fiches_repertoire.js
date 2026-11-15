/* Fiches « sans ballon » tirées du répertoire « Fitness et renforcement musculaire » (O. Stoffer, 175 p.), adaptées au football.
   Seuls les exercices au poids du corps sont repris (haltères, barre, step lesté : écartés). Joueur articulé : voir physique.js.
   Chargé après fiches_physique.js : ajoute des mouvements à la bibliothèque de l'éditeur et des fiches à la Base,
   et complète quelques fiches existantes avec des variantes du répertoire. */
(function(){if(typeof phPresets!='function'||!window.EXERCICES_PHY)return;
 const Q=phQ,L=[];const add=(id,nom,theme,info,m)=>L.push({id,nom,theme,m:{v:1,vue:'profil',theme,info,...m}});
 const T=['tapis',150];
 // Abdominaux
 {const a=Q({t:-92,hd:-4,an:88,ae:88,fa:88,fe:88,tn:180,sn:90,pn:90,tf:180,sf:90,pf:90,x:150,h:.5}),b=Q({...a,t:-80,tn:208,sn:118,pn:118,tf:206,sf:116,pf:116,d:1.1,h:.4});add('releve_bassin','Relevé de bassin (genoux-poitrine)','renfo','10 répétitions',{anc:'h',decor:[{t:'tapis',x:150}],poses:[a,b]})}
 {const a=Q({t:-92,hd:0,an:-92,ae:-92,fa:-92,fe:-92,tn:90,sn:90,pn:170,tf:90,sf:90,pf:170,x:130,h:.6}),b=Q({...a,t:-142,hd:-6,an:130,ae:130,fa:128,fe:128,tn:128,sn:118,pn:195,tf:126,sf:116,pf:195,d:1.1,h:.5});add('canif','Canif (buste et genoux ensemble)','renfo','8 répétitions',{anc:'h',decor:[{t:'tapis',x:150}],poses:[a,b]})}
 {const a=Q({t:-150,hd:8,an:88,ae:90,fa:88,fe:90,tn:125,sn:100,pn:170,tf:125,sf:100,pf:170,x:150,h:2}),b=Q({...a,tn:110,sn:88,tf:110,sf:88,pn:160,pf:160,d:.8,h:1.5});add('bateau','Équilibre sur les fessiers (le bateau)','renfo','3 x 20 s',{anc:'h',decor:[{t:'tapis',x:150}],poses:[a,b]})}
 // Adducteurs, fessiers, ischios
 {const a=Q({t:-92,hd:0,an:-92,ae:-92,fa:84,fe:92,tn:118,sn:12,pn:92,tf:90,sf:90,pf:170,x:140,h:.6}),b=Q({...a,tf:128,sf:128,pf:208,d:.9,h:.8});add('adduction_cote','Adducteurs : jambe du dessous levée','renfo','10 par jambe',{anc:'h',decor:[{t:'tapis',x:150}],poses:[a,b]})}
 {const a=Q({t:104,hd:-5,an:0,ae:0,fa:0,fe:0,tn:0,sn:-90,pn:-95,tf:0,sf:-90,pf:-95,x:140,h:.5}),b=Q({...a,tf:-84,sf:-172,pf:-165,d:.8,h:.7});add('extension_4p','Fessiers : jambe repoussée en arrière','renfo','10 par jambe',{anc:'h',decor:[{t:'tapis',x:140}],poses:[a,b]})}
 {const a=Q({t:104,hd:-5,an:0,ae:0,fa:0,fe:0,tn:0,sn:-90,pn:-95,tf:0,sf:-90,pf:-95,x:140,h:.5}),b=Q({...a,sf:-150,pf:-140,d:.9,h:.5});add('ischios_4p','Ischios : talon vers la fesse','renfo','10 par jambe',{anc:'h',decor:[{t:'tapis',x:140}],poses:[a,b]})}
 {const a=Q({t:96,hd:-2,an:92,ae:92,fa:92,fe:92,tn:-90,sn:-90,pn:4,tf:-90,sf:-90,pf:4,x:150,h:.5}),b=Q({...a,t:98,hd:12,an:114,ae:114,fa:114,fe:114,tn:-112,sn:-112,tf:-112,sf:-112,pn:-8,pf:-8,d:1,h:1.5});add('superman','Lombaires : bras et jambes décollés','renfo','3 x 15 s',{anc:'h',decor:[{t:'tapis',x:150}],poses:[a,b]})}
 // Mollets
 {const a=Q({x:150,h:.5}),b=Q({pn:40,pf:40,an:12,ae:12,fa:12,fe:12,x:150,d:1.2,h:.8});add('pointes','Montées sur les pointes de pieds','renfo','15 répétitions',{anc:'pf',poses:[a,b]})}
 // Triceps
 const base=phPresets;phPresets=function(){return base().concat(L)};
 // Fiches : [catégories, niveau, durée, objectif, organisation, déroulement, consignes, variantes]
 const RENFO='Sur tapis ou sur l’herbe, joueurs dispersés face à l’éducateur. Travail au poids du corps.';
 const J=['U11','U13','U15','U18','Seniors'],G=['U13','U15','U18','Seniors'],A=['U15','U18','Seniors'];
 const D={
  releve_bassin:[J,'débutant',5,'Renforcer le bas du ventre, qui stabilise le bassin à la frappe et en course.',RENFO,'Couché sur le dos, bras le long du corps, genoux fléchis au-dessus des hanches. Enrouler le bas du dos pour monter les genoux vers la poitrine, puis redescendre doucement sans poser les pieds. 10 répétitions, 2 séries.',['Seul le bas du dos s’enroule : ne pas lancer les jambes','Mouvement lent, sans à-coups','Souffler en montant','Lombaires collées au sol en bas du mouvement'],[['Jambes tendues','Pousser le bassin vers le ciel, jambes semi-tendues','plus difficile']]],
  canif:[A,'confirmé',5,'Gainage dynamique du ventre : relier le buste et les jambes, utile pour les duels et les sauts de tête.',RENFO,'Couché sur le dos, bras tendus derrière la tête. Ramener en même temps le buste et les genoux l’un vers l’autre, puis revenir sans poser les talons. 8 répétitions, 2 séries.',['Genoux légèrement fléchis, jamais bloqués','Pas de traction sur la nuque','Revenir lentement','Arrêter si douleur dans le bas du dos'],[['Alterné','Monter un genou à la fois en croisant la main opposée','plus facile']]],
  bateau:[G,'confirmé',5,'Renforcer le ventre en maintien (gainage assis), stabilité pour tirer et se réceptionner.',RENFO,'Assis sur les fessiers, buste incliné en arrière, jambes semi-fléchies décollées du sol, bras devant. Tenir la position 20 s, repos 20 s, 3 fois.',['Dos long, pas arrondi','Genoux semi-fléchis pour soulager le bas du dos','Respirer normalement'],[['Twist','Tourner buste et jambes de côté en alternance (joueurs confirmés)','plus difficile'],['Pieds au sol','Talons posés, seul le buste est incliné','plus facile']]],
  adduction_cote:[J,'débutant',5,'Renforcer l’intérieur des cuisses (adducteurs), zone fragile au foot : changements d’appuis, passes du coup de pied.',RENFO,'Couché sur le côté, jambe du dessus fléchie et posée devant. Lever lentement la jambe du dessous, tendue, puis la redescendre sans la poser. 10 par jambe, 2 séries.',['Corps aligné, ne pas rouler vers l’avant ou l’arrière','Pied relevé, jambe tendue','Descendre en 2 secondes'],[['Jambe du dessus tendue','Croiser la jambe du dessus devant, tendue, pour plus d’amplitude','plus difficile']]],
  extension_4p:[J,'débutant',5,'Renforcer les fessiers (poussée en course et en sprint).',RENFO,'À quatre pattes (mains sous les épaules, genoux sous les hanches). Repousser une jambe en arrière, genou fléchi, talon vers le ciel, puis revenir sans poser le genou. 10 par jambe, 2 séries.',['Dos plat, ne pas cambrer en haut du mouvement','Regarder le sol','Serrer le fessier en haut','Petits mouvements maîtrisés'],[['Jambe tendue','Pousser la jambe tendue en arrière et faire de petits battements','plus difficile'],['Sur les coudes','Appui sur les avant-bras, plus confortable pour les poignets','plus facile']]],
  ischios_4p:[J,'débutant',5,'Renforcer l’arrière des cuisses (ischio-jambiers), prévention des claquages.',RENFO,'À quatre pattes. Ramener un talon vers la fesse en pliant le genou, puis redescendre lentement. 10 par jambe, 2 séries.',['Cuisse verticale, qui ne bouge pas','Dos plat','Descendre lentement (2 s)'],[['Allongé sur le dos','Pieds sur un support : soulever le bassin, puis le descendre lentement (confirmés)','plus difficile']]],
  superman:[G,'débutant',4,'Renforcer le bas du dos et le gainage arrière.',RENFO,'Allongé sur le ventre, bras tendus devant. Décoller en même temps bras, tête et jambes du sol, tenir 15 s, relâcher. 3 fois.',['Regarder le sol, nuque dans le prolongement','Mouvement doux, sans cambrer à l’excès','Respirer pendant la tenue'],[['Buste seul','Décoller seulement le buste, mains sous le menton','plus facile'],['Jambes seules','Décoller seulement les jambes','plus facile']]],
  pointes:[T_ALL(),'débutant',4,'Renforcer les mollets : impulsion, appuis rapides et prévention des blessures à la cheville.','Joueurs dispersés, éventuellement une main sur un mur ou un partenaire.','Debout, monter lentement sur la pointe des pieds, marquer un temps d’arrêt, puis redescendre en 3 secondes. 15 répétitions, 2 séries.',['Monter bien droit, chevilles non penchées','Descente lente et contrôlée','Genoux tendus mais non bloqués'],[['Sur une jambe','Même exercice sur un pied, 10 par jambe','plus difficile'],['Sur un rebord','Talons dans le vide au bord d’une marche, amplitude plus grande','plus difficile']]]
 };
 function T_ALL(){return['U9','U11','U13','U15','U18','Seniors']}
 const SRC='Fitness et renforcement musculaire, répertoire technique (O. Stoffer), adapté au football';
 const MAT={};
 L.forEach(p=>{const d=D[p.id];if(!d)return;const [cats,niv,dur,obj,org,der,cons,vars]=d,k=phCompte(p.m);
  window.EXERCICES_PHY.push({id:'phy-'+p.id,titre:p.nom.slice(0,40),theme:p.theme,categories:cats,public:['filles','garçons'],niveau:niv,duree_min:dur,joueurs:{min:1,max:20},surface:'2 x 2 m par joueur',
   materiel:Object.entries(k.mat).map(([n,q])=>({nom:typeof nomMat=='function'?nomMat(n,q):n,quantite:q})),auteur:'Commun',source:SRC,
   objectif:obj,organisation:org,deroulement:der,consignes:cons,variantes:vars.map(([nom,change,difficulte])=>({nom,change,difficulte})),schema_physique:p.m})});
 // Variantes du répertoire ajoutées aux fiches existantes (pas de doublon : même mouvement, autre forme)
 const plus=(id,v)=>{const f=window.EXERCICES_PHY.find(x=>x.id==id);if(f&&!f.variantes.some(y=>y.nom==v[0]))f.variantes.push({nom:v[0],change:v[1],difficulte:v[2]})};
 plus('phy-squat',['Squat ouvert','Jambes écartées au-delà des épaules, pointes de pieds légèrement ouvertes : travaille aussi les adducteurs','plus difficile']);
 plus('phy-squat',['Squat serré (presse)','Pieds joints, genoux ensemble : cuisses plus sollicitées','plus difficile']);
 plus('phy-squat',['Squat puis fente','Enchaîner un squat, puis une fente avant, en alternant les jambes','plus difficile']);
 plus('phy-pompes',['Pompes sur les genoux','Appui sur les genoux, corps aligné des genoux à la tête','plus facile']);
 plus('phy-pompes',['Pompes coudes serrés','Coudes près du corps : plus de travail des triceps','plus difficile']);
 plus('phy-crunch',['Mains aux tempes','Mains sur la nuque sans tirer, ou croisées sur la poitrine si tension','plus facile']);
 plus('phy-crunch',['Rotation','Monter le buste en rotation vers le genou opposé (obliques)','plus difficile']);
 plus('phy-abduction',['Battements','Jambe levée : petits battements de haut en bas (4 par série)','plus difficile']);
})();
