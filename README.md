# Atelier Foot

Petit site statique pour préparer des séances d'entraînement de football (ESGA Foot Genas Azieu).

- **Base** : fiches d'exercices avec schéma animé, filtres par thème, catégorie, durée et niveau.
- **Séance** : empiler les exercices, régler durée et variante ; durée totale, joueurs et matériel calculés automatiquement.
- **Éditeur** : dessiner un schéma (départ puis déplacements par temps), l'animer et l'enregistrer comme fiche.

## Utiliser

- En ligne : la page GitHub Pages du dépôt.
- En local : ouvrir `site/index.html` dans un navigateur (aucun serveur nécessaire).

## Organisation

- `exercices/<theme>/` : une fiche JSON par exercice (`id` fixe, champ `schema_modele` pour le schéma).
- `site/` : code du site. Après modification d'une fiche : `python site/mettre_a_jour.py` (régénère `site/data.js`).
- `chantiers/` : travaux en cours ou scripts ponctuels.
