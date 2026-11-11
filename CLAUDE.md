# Atelier Foot – contexte du projet

## But
Petit site web pour préparer des séances d'entraînement de foot à partir d'une base d'exercices que l'on empile, réordonne et modifie. Inspiré de l'atelier GMP (maths) : même esprit, les fiches d'exercices de maths deviennent des fiches d'exercices de foot.

## Façon de travailler
- Répondre en français. Une seule question de clarification si la demande est ambiguë.
- Réponses courtes, sans préambule. Modifications ciblées plutôt que fichiers complets.
- Pas d'outils ni de recherches inutiles. Proposer un résumé quand la conversation s'allonge.
- Méthodes simples, passes courtes. Pas de panneau de contrôle ni de dashboard.
- Fin de tâche : un message de notification court.
- Ne jamais écrire de mot de passe ni de compte en clair.
- Ne rien supprimer sans accord explicite : déplacer dans `9_A_supprimer`.

## Répartition des modèles
- Opus dirige : il découpe le travail, rédige les consignes, relit et valide.
- Opus délègue l'exécution à des agents Sonnet ou Haiku :
  - Haiku : tâches répétitives et simples (mise en forme de fiches, renommage, contrôle de champs).
  - Sonnet : code du site, rédaction des exercices et des variantes.
- Si le résultat d'un agent est insuffisant après une reprise, Opus refait la tâche lui-même ou la confie à un agent Opus, et le signale en une ligne.
- Chaque consigne d'agent est autonome : fichiers concernés, format attendu, critère de fin.

## Site
- Site statique, sans serveur : le site en ligne (GitHub Pages) est la référence, plus de site local (décision de Bertrand, 11/11/2026). Le PC garde les PDF, brouillons et fiches JSON ; on les importe dans le site avec le bouton « Importer des fiches (.json) » (code club demandé).
- Publié sur GitHub (dépôt public `cintractbertrand/atelier-foot`) avec GitHub Pages, à la demande de Bertrand (11/11/2026). Garder le code statique et simple.
- Fiches partagées entre éducateurs : base Supabase (choix de Bertrand, 11/11/2026). Lecture libre, écriture avec un code club stocké chiffré ; « Retirer » masque sans effacer. Config dans `site/club.js`, script dans `chantiers/base_partagee/supabase.sql`. Sans config, le site reste 100 % local.
- Lisible sur téléphone au bord du terrain, imprimable sur une page A4.
- Deux écrans :
  1. **Base d'exercices** : recherche et filtres (catégorie, thème, durée, matériel, nombre de joueurs).
  2. **Séance** : exercices empilés, ordre modifiable, durée et variante modifiables par exercice ; total du temps et liste du matériel calculés automatiquement.
- Séances enregistrées dans le navigateur, avec export/import en fichier pour les sauvegarder ou les passer à un autre éducateur.

## Fiche d'exercice
Une fiche = un fichier, avec un `id` qui ne change jamais.
- `id`, titre (40 caractères max)
- thème : échauffement, technique, conduite, passe, tir, jeu réduit, tactique, physique, gardien, retour au calme
- catégories : U7 à U18 et seniors, filles et garçons
- niveau : débutant / confirmé
- durée (minutes), nombre de joueurs (min–max), surface
- matériel : liste avec quantités (ballons, plots, coupelles, chasubles, mini-buts…)
- objectif, organisation, déroulement, consignes clés
- variantes : chacune avec un nom, ce qui change, plus facile ou plus difficile, et sa durée ou son matériel s'ils diffèrent
- mots_cles : liste de mots-clés (facultatif), cherchés par le site
- schéma de terrain (SVG simple), facultatif

## Posture d'expert
- Se comporter en expert de l'entraînement de football.
- Avant de rédiger des exercices, d'abord étudier et chercher sur internet des séances de football adaptées (âge, niveau, catégorie) ; s'en inspirer sans copier, et noter les sources dans le chantier.

## Rédaction des exercices
- Les agents rédigent la base de départ ; Bertrand relit et corrige.
- Exercices classiques et sûrs, adaptés à l'âge : pas de charge physique inadaptée aux jeunes catégories.
- Texte court et concret : ce que fait le joueur, ce que regarde l'éducateur.
- Anti-doublons : tout nouvel exercice est comparé à ceux du même thème ; un simple changement de distances ou de nombre de joueurs est une variante, pas une nouvelle fiche.

## Dossiers
- `exercices/` : une fiche par fichier, un sous-dossier par thème
- `site/` : code du site
- `chantiers/` : un sous-dossier par chantier en cours ; terminés dans `chantiers/termines`
- `9_A_supprimer/` : Bertrand supprime à la main
- Noms de fichiers : 40 caractères max, sans accents ni espaces.

## Premières étapes
1. Valider le format de fiche sur 3 exercices d'exemple.
2. Construire l'écran Séance (empiler, modifier, totaux).
3. Rédiger la base de départ par thème, par lots courts.
