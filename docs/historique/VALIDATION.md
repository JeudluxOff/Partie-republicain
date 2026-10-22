# Validation — version Vercel 2.0.0

Vérifications effectuées le 12 octobre 2026 :

- Compilation Next.js de production et vérification TypeScript réussies.
- Accueil généré explicitement à la route `/` ; rubriques à routes dédiées.
- 11 adresses publiques, administrateur et fiches : HTTP 200 sur le serveur de production local.
- Deux adresses inexistantes : HTTP 404 attendu.
- API de contenu accessible sans base avec le contenu initial ; session anonyme confirmée.
- Lecture des dossiers sans connexion : HTTP 403.
- Image originale : HTTP 200 et type PNG.
- Configuration Vercel explicite et contrôle des fichiers avant compilation.

Les styles, les images originales, les textes, les formulaires, les API et les mécanismes d’authentification de la version précédente sont conservés. L’ancien routeur global et les fichiers de connecteurs inutilisés ont été retirés.

Ces vérifications portent sur le code livré et le serveur local. Aucun nouveau déploiement Vercel n’a été effectué depuis cet environnement. Les opérations réelles Neon et Blob nécessitent de connecter les services et de renseigner les variables dans le projet Vercel. Les tests de routes ne valident pas ces services réels.

## Version 2.1 — suivi privé

Compilation et contrôles des routes incluant `/suivi` réussis. 35 tests isolés des API et signatures réussis (services simulés). Aucun déploiement Vercel réel effectué. Voir `MISE-A-JOUR-SUIVI.md`.
