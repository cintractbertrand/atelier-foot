# Éditeur physique (renfo, proprio, étirement, motricité) — 15/11/2026

Demande de Bertrand : un éditeur sur le modèle de l'éditeur de terrain, avec un joueur articulé (bras, jambes, sauts, haies, échelle de rythme).

## Choix
- Code : `site/physique.js`. Fiche : champ `schema_physique` (format décrit en tête du fichier), à la place de `schema_modele`.
- Deux vues : joueur de profil (poses successives, animées en boucle, corps posé au sol automatiquement) et appuis vus de dessus (pied gauche bleu, pied droit rouge, traces numérotées).
- Nouveaux thèmes : renfo, proprio, étirement, motricité.
- Bibliothèque de départ : 25 mouvements de profil, 20 parcours d'appuis (les 11 gestes d'échelle de la séance 21 U14F-U15F de Nico, haies, cerceaux).

## Sources consultées (inspiration, pas de copie)
- Répertoire « Fitness, renforcement » (PDF fourni par Bertrand) : fessiers couché sur le côté, ischios en quadrupédie, pont.
- Séance 21 U14F-U15F (Nico) : motricité avec l'échelle (11 gestes), gainage face/côté, pont fessier, bird dog, chaise.
- FFF, échauffement structuré à visée préventive : https://www.fff.fr/648-l-echauffement-structure-a-visee-preventive.html
- FIFA, préparation athlétique intégrée : https://foot63.fff.fr/wp-content/uploads/sites/111/2025/01/Preparation-athletique-integree-FIFA.pdf
- FFF Puy-de-Dôme, la motricité à l'école de football : https://foot63.fff.fr/wp-content/uploads/sites/111/2022/09/La-Motricité-à-lécole-de-football.pdf
- FIFA Training Centre, circuits de vitesse (échelle) : https://www.fifatrainingcentre.com/media/native/test/FIFA_Session_Plan_Colbert_Speed_Circuit_4-FR.pdf

## Import du répertoire « Fitness et renforcement musculaire » (15/11/2026)
- PDF de 175 pages (O. Stoffer), scanné : lu par OCR puis relu à l'œil. Exercices aux haltères, barre, step lesté et élastiques écartés ; seuls ceux au poids du corps utiles au football sont repris.
- 13 nouvelles fiches (`site/fiches_repertoire.js`, 2 lots) : relevé de bassin, canif, bateau, adducteurs couché, fessiers et ischios en quadrupédie, lombaires (superman), montées sur pointes.
- Variantes ajoutées aux fiches existantes (squat ouvert/serré, pompes sur genoux/coudes serrés, crunch, abduction), pour éviter les doublons.
- Écartés : dips (pose du joueur peu lisible), oiseau, pectoraux au ballon, enchaînements sur musique (pas de valeur pour le foot).

## Lot 3 du répertoire fitness (15/11/2026)
- Bertrand : « on prend tout et on filtre sur le site » → exercices avec charge légère (haltères, barre, bâton) repris aussi, matériel indiqué sur la fiche ; filtre « Muscle » (champ `muscle`) dans la colonne de gauche de la Base : abdominaux, adducteurs, biceps, cuisses, dos, épaules, fessiers, ischio-jambiers, mollets, pectoraux, triceps (rubriques du sommaire du PDF).
- 26 fiches de plus (68 fiches physiques au total) : 16 avec schéma animé, 10 sans schéma (mouvements de face : inclinaisons, rotations avec bâton, élévations latérales, oiseau, abductions et adductions) car le joueur de profil ne les montre pas.
- Non repris : épaulé-jeté, écarté couché aux haltères, enchaînements sur musique (combinaisons de gestes déjà couvertes par les fiches).

## Reprise fidèle du répertoire Stoffer (15/11/2026)
- Relecture page par page (p. 20 à 162) : une fiche par exercice ou enchaînement du livre, page indiquée dans la source. 106 fiches portent la source Stoffer (dont squat, fente, pompes, crunch, abduction complétées par des schémas et variantes).
- Moteur : `site/physique_plus.js` ajoute la vue de face (debout, couché sur le côté), la vue de dessus (couché sur le dos, à quatre pattes) et les objets tenus (haltères, barre, bâton, bâton vertical qui change de main, élastique, ballon, lests).
- Hors livre, gardées en attente de validation : canif, descente de jambes tendues (le livre ne les propose pas).
- Gainage facial (p. 44), pont (p. 118 hors variantes) et bird dog : déjà dans les fiches de Nico ; seules les formes propres au livre ont une fiche (pont jambe croisée ou tendue, bras et jambe opposés avec haltère).
