# San Andreas Republican Party

Site officiel du mouvement, de son administration et de son portail gouvernemental.
Next.js 16 · React 19 · TypeScript · PostgreSQL (Neon) · Vercel Blob · déploiement Vercel.

## Démarrage rapide

```bash
npm ci
cp .env.example .env.local   # puis renseigner les variables
npm run db:setup             # crée les tables Neon
npm run dev                  # http://localhost:3000
```

Variables d'environnement (voir `.env.example`) :

| Variable | Rôle |
| --- | --- |
| `DATABASE_URL` | Chaîne de connexion PostgreSQL Neon |
| `ADMIN_PASSWORD` | Mot de passe du compte `admin` (16 caractères minimum) |
| `SESSION_SECRET` | Secret de signature des sessions (32 caractères minimum, distinct du mot de passe) |
| `BLOB_READ_WRITE_TOKEN` | Stockage Vercel Blob public, pour l'import d'images |

## Commandes

| Commande | Effet |
| --- | --- |
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production (vérifie d'abord la présence des fichiers essentiels) |
| `npm run typecheck` | Vérification TypeScript |
| `npm run test:routes` | Tests de routes sur le build de production |
| `npm run format` | Formate le code avec Prettier (téléchargé à la demande) |

## Structure

- `app/` : pages (accueil, programme, équipe, actualités, adhésion, administration, `/gouvernement`, `/suivi`), composants et feuilles de style. `refine.css` est chargé en dernier.
- `app/api/` : routes API (connexion, contenu, adhésions, médias, dossiers gouvernementaux, suivi).
- `lib/` : authentification, accès base de données, contenu par défaut, logique gouvernementale.
- `database/` : `schema.sql` et migrations.
- `scripts/` : initialisation de la base et contrôles de build.
- `public/images/` : logo et visuels (WebP).
- `docs/` : guide d'installation Vercel et historique des mises à jour.

## Documentation

- [Installation sur Vercel](docs/INSTALLATION-VERCEL.md)
- [Journal des versions](CHANGELOG.md)
- Notes détaillées de chaque version : `docs/historique/`
