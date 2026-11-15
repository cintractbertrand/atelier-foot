# Mannequins v2 : cinq styles à choisir

Démo : `site/demo-mannequins-v2.html` (page à part, le moteur et les fiches ne sont pas touchés).
Demande de Bertrand (15/11/2026) : designs plus jolis, esprit jeu vidéo de foot récent, SVG léger, fond clair, bleu et or.
Déjà essayés et écartés (voir `chantiers/rendus_joueur/`) : Silhouette, Réaliste, Mannequin 3D (bande dorée du buste refusée), Analyse (corps et bras pas assez visibles), Jeu vidéo et Rendu 3D sur fond sombre.

## Principe commun (à garder pour la conversion)

Le code de la démo est la référence : toutes les formes y sont déjà écrites dans les repères locaux du moteur.

- Un repère par segment, origine à l'articulation de départ, +y vers l'articulation suivante.
  - Bras, avant-bras, cuisse, tibia : +x = avant du joueur.
  - Buste (hanche vers cou, 0 à 40) et tête (cou vers sommet) : -x = avant, comme dans `phCorps`.
  - Pied de profil : origine à la cheville, +y = pointe, semelle à x = -5,4, comme `phChaus`.
  - Vue de face : mêmes repères, formes symétriques, raccourci par `scale(1 f)`.
- Une forme = une table de lignes `[y, x_arrière, x_avant]` (`R_ATH` pour A, B, C, E ; `R_TOON` pour D).
  `sd(table, {a, b, f0, f1})` trace le contour lisse ; `a..b` donne une bande (0 = bord arrière, 1 = bord avant), utile pour l'ombre et le reflet ; `f0`/`f1` = bout plat.
  `cut(table, y0, y1, g)` découpe la manche, le short ou la chaussette sur le membre, élargi de `g`.
- Tenue (fonction `part`) : manche jusqu'à y = 11 du bras, short jusqu'à y = 17 de la cuisse, chaussette à partir de y = 6 à 9 du tibia, maillot à ourlet plat sur le buste, disque de hanche couleur short.
- Ordre des calques de profil : bras loin, jambe loin, buste et tête, jambe proche, bras proche. De face : jambes, short, buste et tête, bras.
- Membres loin : palette mélangée à 26 % vers `#0d1c3f` (20 % pour D) ; opacité 0,5 pour E.
- Contour (A, C, D) : pour chaque chaîne (bras, jambe, buste et tête), on dessine d'abord toutes les silhouettes avec un trait, puis tous les aplats. Ainsi le trait ne coupe pas les articulations. Après le contour de la jambe proche et du bras proche, un disque couleur short (hanche) ou maillot (épaule) efface le trait à la jonction.
  Dans le moteur (groupes imbriqués animés en SMIL), cela revient à émettre chaque chaîne deux fois : une fois en silhouette avec trait, une fois en aplats.
- Dans le moteur, remplacer les appels `phLimb` / `phCap` / `phChaus` et les dessins de buste et de tête de `phCorps` (profil) et de `body` (face, `physique_plus.js`) par les formes du style choisi. Les palettes `PAL` remplacent `PH_C`.

## A · Arcade (cel-shading)

- Contour `#0b1933`, épaisseur 2,3 (trait centré, donc 1,15 visible).
- Chaque segment : aplat, puis ombre nette sur la bande arrière 0 à 0,36 (couleur assombrie de 26 %), puis reflet blanc à 32 % sur la bande 0,74 à 0,88.
- Palette : peau `#f3bd8f`, maillot `#2a5bd0`, short `#142b60`, chaussettes `#f6c62f`, chaussures blanches, cheveux `#2b1d14`.
- Tenue : poignet de manche or (1,8), bande or sur le côté du short (profil), deux rayures bleu nuit en haut de la chaussette, col or.
- Chaussure blanche, semelle et crampons bleu nuit, bande et languette or.
- Tête : cheveux en pointes (polygone à angles vifs) avec une mèche plus claire, œil ovale plein, sourcil, petite bouche, ombre sous la mâchoire.
- Ombre au sol : ellipse bleu nuit à 30 %.

## B · Facettes (low-poly)

- Aucune courbe, aucun contour. Fonction `facettes` : arête à 58 % de la largeur ; pour chaque tranche, 2 triangles côté arrière (teintes -20 à -30 %) et 2 côté avant (+3 à +17 %), alternées d'une tranche à l'autre ; bouts en pointe.
- Chaque triangle a un trait de sa propre couleur (0,5) pour cacher les jointures.
- Palette : peau `#e9ae80`, maillot `#2b5cc6`, short `#16306b`, chaussettes `#f0bf2c`, chaussures `#f4f6fb` avec pointe or.
- Tête : polygone à 10 sommets découpé en triangles (visage clair devant, cheveux derrière), œil en petit triangle sombre.
- Hanche et main : hexagones en éventail. Ombre au sol : hexagone aplati bleu à 22 %.
- C'est le style le plus lourd (environ 200 triangles) et le plus long à convertir.

## C · Pro (rendu lisse)

- Dégradés en travers du segment (définitions `c_…` en tête de la démo) : arrière sombre, clair à 55 à 60 %, puis ton moyen. Même principe que `PH_G` du moteur.
- Reflet blanc à 30 % sur la bande 0,84 à 0,96. Contour discret `#071330`, épaisseur 1,2, opacité 0,5.
- Tenue : poignets bleu nuit, liseré or fin en bas du short et sur les côtés du maillot, deux rayures bleues sur la chaussette or, pastille or sur la poitrine (face).
- Chaussure blanche en dégradé, pointe et languette or, lacets et crampons bleu nuit.
- Tête : dégradé radial `c_hd`, coupe courte avec dégradé plus clair sur la nuque, œil avec blanc et iris, sourcil, oreille, nez et bouche.
- Ombre au sol : ellipse en dégradé radial `c_om` (pas de filtre de flou).

## D · Mini-star (cartoon)

- Tables `R_TOON` : membres épais et presque droits, poing rond (rayon 4,5), grosses chaussures, tête de rayon 12,5 environ.
- Contour `#152456`, épaisseur 2,6. Ombre sur la bande arrière 0 à 0,3 (-16 %), filet blanc de reflet à 76 % de la largeur.
- Palette vive : peau `#ffc99c`, maillot `#2f6be6`, short `#1b3a8a`, chaussettes `#ffd23f` à revers blanc, chaussures bleues à pointe or.
- Étoile or à 5 branches sur le maillot, poignets et col or.
- Tête : grands yeux blancs à pupille bleu nuit et point de lumière, joues roses, sourire, houppette.

## E · Hologramme (verre et muscles)

- Corps sans tenue : chaque segment en dégradé bleu translucide `e_gl`, trait `#16327a` de 1,3, reflet blanc à 50 % sur la bande 0,72 à 0,9.
- Anneau or (blanc, trait `#e8a800` de 1,7) à chaque articulation ; cercle or au sol sous le joueur.
- Tête : sphère `e_hd` avec visière bleu nuit.
- Muscle travaillé en surbrillance (dégradé orange `e_hot`) : objet `HOT`, par segment `[a, b, y0, y1]` = bande en largeur et portion en longueur. Exemples de la démo : squat = avant de la cuisse et fessier, haie = mollet et cuisse, échelle = mollet.
  Pour le site, il faudrait une table muscle vers segments reliée au champ `muscle` des fiches ; sans elle, le style marche sans surbrillance.
