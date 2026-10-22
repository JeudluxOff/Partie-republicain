# Journal des versions

## V10
- Images d'accueil converties en WebP (équipe : 3,7 Mo → 91 Ko ; affiches : 2,2 Mo → 177 Ko). Les anciens chemins `.png` redirigent vers les `.webp` et les chemins déjà enregistrés en base sont réécrits à la lecture.
- Police Inter servie par `next/font` (auto-hébergée) au lieu d'un `@import` Google Fonts bloquant.
- Tailles de texte relevées : plus aucun texte public sous 12 px (11 px dans l'administration et le portail), corps de texte à 16 px, contrastes des textes secondaires corrigés.
- Nouveau fichier `app/refine.css` : hiérarchie typographique, étiquettes moins tassées, accueil affiné, focus clavier visible. Le supprimer rétablit le rendu V9.
- En-têtes de sécurité : HSTS, Permissions-Policy et, en production, une Content-Security-Policy.
- Cookie de session renommé `sarp_session` (les sessions ouvertes sont déconnectées une fois).
- Documentation réorganisée : `README.md` à jour, notes anciennes déplacées dans `docs/historique/`.
- Code TypeScript des dossiers `lib/` et `app/api/` reformaté (une instruction par ligne).

## V9 — Conseil de gouvernement
Suivi des textes examinés par le Conseil de gouvernement. Notes : `docs/historique/MISE-A-JOUR-CONSEIL-V9.md`.

## V8.1 — Textes de l'interface
Retrait des mentions « RP », « roleplay » et « jeu de rôle » des libellés intégrés. Notes : `docs/historique/MISE-A-JOUR-IMMERSION-V8-1.md`.

## V8 — Interface gouvernementale
Navigation et vues de travail. Notes : `docs/historique/MISE-A-JOUR-INTERFACE-V8.md`.

## V7 — Documents de réforme du State Code
Notes : `docs/historique/MISE-A-JOUR-DOCUMENTS-V7.md`.

## V6 — Le bureau gouvernemental
Notes : `docs/historique/MISE-A-JOUR-GOUVERNEMENT-V6.md`.

## V5 et V4 — Espace gouvernement
Notes : `docs/historique/MISE-A-JOUR-GOUVERNEMENT-V5.md` et `MISE-A-JOUR-GOUVERNEMENT-V4.md`.

## Versions antérieures
Fiches individuelles des membres, suivi privé des adhésions et mise à jour V3 : voir les fichiers correspondants dans `docs/historique/`.
