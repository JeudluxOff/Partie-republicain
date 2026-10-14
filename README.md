> **Version 3 : consultez d’abord [MISE-A-JOUR-V3.md](MISE-A-JOUR-V3.md) pour les nouveautés et l’installation sur votre site existant.**

# San Andreas Republican Party de Los Santos — Vercel

Site complet GTA RP : pages publiques, programme, annonces, équipe et cabinets, adhésions, administration des contenus et images.

## Déploiement

1. Extraire cette archive et mettre son contenu à la racine du dépôt GitHub. `package.json`, `vercel.json` et `app/` doivent apparaître directement.
2. Importer le dépôt dans Vercel ; Root Directory `./`, Node.js 22.x. Le framework et les commandes sont configurés par `vercel.json`.
3. Pour l’administration et les adhésions, connecter Neon, exécuter `database/schema.sql` et ajouter `DATABASE_URL`, `ADMIN_PASSWORD`, `SESSION_SECRET`.
4. Pour importer des images, connecter Vercel Blob Public avec `BLOB_READ_WRITE_TOKEN`.
5. Redéployer puis ouvrir `/connexion`.

Le site public fonctionne sans base configurée. Les fonctions d’écriture nécessitent les services ci-dessus. Toutes les étapes sont détaillées dans `INSTALLATION-VERCEL.md`.

## Architecture

- Next.js App Router : accueil `app/page.tsx`, une route explicite par rubrique.
- Fiches individuelles : `app/equipe/[id]/page.tsx` et `app/actualites/[id]/page.tsx`.
- Interface et design conservés dans `app/site.tsx`, `app/globals.css` et `app/civic.css`.
- Fonctions serveur Next.js dans `app/api/`, PostgreSQL Neon et images Vercel Blob.
- Authentification administrateur côté serveur, cookie signé HttpOnly, contrôle d’origine, limites de connexion stockées dans PostgreSQL.
- Aucun service ChatGPT Sites ou Cloudflare requis.

## Commandes

```bash
npm ci
npm run build
npm run test:routes
npm run dev
```

Voir `.env.example` pour les variables. Ne jamais publier `.env.local`. En cas de mise à jour de l’ancien dépôt, retirer `app/[[...slug]]` : il a été remplacé par les routes explicites.

## Suivi des adhésions

Version 2.1 : page `/suivi`, lien privé après envoi et actualisation du statut toutes les 15 secondes. Voir `MISE-A-JOUR-SUIVI.md`. Aucune migration SQL nécessaire.
