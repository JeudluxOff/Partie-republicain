# Union Civique de Los Santos

Site de parti politique fictif GTA RP, avec administration et adhésions.

**Commencer par [INSTALLATION-VERCEL.md](./INSTALLATION-VERCEL.md).**

## Stack

Next.js App Router, React, TypeScript, PostgreSQL Neon, Vercel Blob.

## Structure

- `app/site.tsx` : pages publiques et interface d’administration.
- `app/globals.css` : styles communs et interface d’administration.
- `app/civic.css` : refonte institutionnelle inspirée du site San Andreas Government.
- `app/api/` : contenus, adhésions, fichiers, connexion et déconnexion.
- `lib/content.ts` : contenu initial et types.
- `lib/server.ts` : accès PostgreSQL, réponses et contrôles communs.
- `lib/auth.ts` : sessions administrateur signées, vérifiées côté serveur.
- `public/images/` : visuels originaux inclus.
- `database/schema.sql` : création des tables et index.
- `scripts/setup-db.mjs` : application du schéma SQL.

Les contenus sont rendus comme du texte React, sans injection HTML. Les écritures d’administration nécessitent une session valide et la bonne origine. L’enregistrement des contenus utilise une révision pour empêcher l’écrasement d’une modification concurrente.

Les imports acceptent seulement PNG, JPEG et WebP, avec vérification de signature du fichier et limite de 4 Mo. Les médias publics ne servent pas au stockage des dossiers d’adhésion.

Le code source ne contient aucun identifiant ni mot de passe de production. Le projet d’origine et son hébergement restent indépendants de cet export.
