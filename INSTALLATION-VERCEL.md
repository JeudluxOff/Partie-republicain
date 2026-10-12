# Union Civique — installation sur Vercel

Le dossier contient le site complet, ses images originales, son administration et son formulaire d’adhésion. La refonte visuelle reprend les formes du précédent portail San Andreas Government : bannière photo, cadres décalés, blocs arrondis, pictogrammes circulaires, bleu institutionnel et rouge.

## 1. Mettre le code sur GitHub

1. Décompresse `Union-Civique-Vercel.zip` sur ton ordinateur.
2. Crée un dépôt GitHub privé.
3. Ajoute **tous les fichiers extraits du ZIP** à la racine du dépôt (le ZIP contient directement les fichiers du projet). Tu dois voir directement `package.json`, `app`, `public` et `lib`.
4. N’ajoute jamais de fichier `.env.local` ni de mot de passe sur GitHub.

Le ZIP n’est pas à importer directement comme un site statique. Il faut importer ce projet Next.js dans Vercel.

## Repartir depuis le dépôt précédent

Remplace les anciens fichiers du site par ceux de cette archive. Supprime l’ancien dossier `app/[[...slug]]` s’il est encore présent : les pages ont maintenant chacune leur fichier. Conserve tes variables d’environnement dans Vercel et ta base Neon existante.

Cette archive est plate : `package.json`, `vercel.json` et `app/` doivent se trouver directement à la racine de ton dépôt. Ne téléverse pas simplement le fichier ZIP dans GitHub.

## 2. Créer le projet Vercel

Dans Vercel, choisis **Add New → Project**, puis importe ton dépôt GitHub.

- Framework : **Next.js**.
- Root Directory : la racine où se trouve `package.json`.
- Install Command : `npm ci`.
- Build Command : `npm run build`.
- Output Directory : laisse le réglage par défaut de Next.js.
- Node.js : **22.x**.

Le fichier `vercel.json` configure explicitement le framework Next.js, `npm ci`, `npm run build` et la sortie par défaut du framework. La Root Directory reste à vérifier dans Vercel : choisis `./` si les fichiers sont à la racine.

Un premier déploiement peut afficher les pages publiques sans base configurée. Les modifications et les adhésions nécessitent les étapes suivantes.

## 3. Brancher la base de données Neon

Dans **Storage / Marketplace** du projet Vercel, ajoute **Neon** (PostgreSQL), puis connecte cette base au projet. Tu peux aussi créer une base sur https://neon.com et renseigner sa chaîne de connexion manuellement.

Dans **Settings → Environment Variables**, assure-toi d’avoir :

| Nom | Valeur |
| --- | --- |
| `DATABASE_URL` | La chaîne de connexion PostgreSQL fournie par Neon. |
| `ADMIN_PASSWORD` | Ton mot de passe administrateur, au moins 16 caractères. |
| `SESSION_SECRET` | Une valeur aléatoire d’au moins 32 caractères, distincte du mot de passe. |

N’utilise aucun préfixe `NEXT_PUBLIC_` pour ces variables. Elles doivent rester côté serveur.

Dans la console Neon, ouvre **SQL Editor**, copie tout le contenu de `database/schema.sql`, puis exécute-le. Cela crée les tables des contenus, des adhésions et des limites de connexion. Le script ne supprime pas les données existantes.

Alternative sur ton ordinateur : configure `.env.local`, puis lance `npm run db:setup`.

Pour générer un secret de session si Node.js est installé :

```bash
node -e "console.log(require('node:crypto').randomBytes(48).toString('hex'))"
```

## 4. Brancher les images

Dans le projet Vercel : **Storage → Create Storage → Blob**.

- Crée un stockage **Public**, réservé aux images du site.
- Connecte-le au projet et à l’environnement Production.
- Vérifie que `BLOB_READ_WRITE_TOKEN` est présent dans les variables d’environnement. Le code utilise ce jeton.

Les images originales du ZIP fonctionnent déjà sans Blob. Blob est nécessaire pour importer de nouvelles images depuis l’administration. Les nouveaux fichiers sont limités à **4 Mo** en PNG, JPG ou WebP pour rester sous la limite des requêtes serveur Vercel.

Les images de ce stockage sont publiques. Les demandes d’adhésion et les notes privées restent dans la base de données, pas dans Blob.

## 5. Redéployer et se connecter

Après l’ajout de toutes les variables : **Deployments → Redeploy**.

Ouvre ensuite :

- `/` : site public.
- `/connexion` : connexion administrateur avec `ADMIN_PASSWORD`.
- `/admin` : gestion du site.

La session expire après 12 heures. Modifier `ADMIN_PASSWORD` ou `SESSION_SECRET`, puis redéployer, invalide les sessions précédentes. La connexion est limitée à 10 tentatives par adresse réseau sur 15 minutes.

La version Vercel utilise ce mot de passe, et non la connexion ChatGPT du premier hébergement.

## 6. Utiliser l’administration

- **Identité & accueil** : nom, slogan, présentation, grand titre, image principale, lien Discord.
- **Annonces** : créer, modifier, importer une image, conserver en brouillon ou publier.
- **Équipe & cabinets** : vrais noms RP, fonctions, biographies, portraits, ordre d’affichage ; pour un membre de cabinet, choisir le représentant auquel il est rattaché.
- **Programme** : titres, textes et orientations.
- **Adhésions** : lire les demandes, changer leur statut, ajouter des notes privées, exporter la sélection en CSV ou supprimer un dossier.

Pour les contenus, clique sur **Enregistrer le site**. Pour une adhésion, clique sur **Enregistrer le dossier**.

Les noms et fonctions exacts de l’équipe ne sont pas inventés : ajoute les fiches depuis **Équipe & cabinets**.

## 7. Vérifier après le déploiement

1. Ouvre le site depuis une fenêtre privée : les pages publiques doivent être accessibles.
2. Ouvre `/admin` sans connexion : aucun dossier ne doit être visible.
3. Connecte-toi et enregistre un changement de texte.
4. Recharge l’accueil et vérifie le texte.
5. Envoie un dossier RP de test via `/adherer`, consulte-le dans l’administration, puis supprime-le.
6. Importe une image et vérifie son affichage après enregistrement.

Si Vercel demande une connexion à tous les visiteurs, vérifie **Settings → Deployment Protection** pour le domaine de production.

## Sur ton ordinateur

Installe Node.js 22, puis ouvre un terminal dans le dossier du projet :

```bash
npm ci
```

Copie `.env.example` vers `.env.local`, renseigne les quatre variables, puis :

```bash
npm run db:setup
npm run dev
```

Ouvre http://localhost:3000. Pour compiler : `npm run build`.

## Important sur la reprise des données

Ce ZIP contient le code et le contenu initial. Les éventuelles adhésions, nouvelles images ou modifications enregistrées sur l’ancien site ChatGPT ne sont pas automatiquement transférées vers Neon/Vercel. Le nouveau projet possède sa propre base.

## En cas d’erreur

- **Configuration incomplète** : vérifier les trois variables de connexion puis redéployer.
- **Connexion impossible** : vérifier `DATABASE_URL` et l’exécution de `database/schema.sql` dans la bonne base Neon.
- **Import d’image impossible** : vérifier que le Blob est Public, connecté au projet et que `BLOB_READ_WRITE_TOKEN` est défini.
- **Image trop lourde** : exporter en JPG ou WebP sous 4 Mo.
- **Mot de passe incorrect** : vérifier sa valeur exacte dans Vercel, puis redéployer après modification.
- **Trop de tentatives** : patienter 15 minutes.
- **Conflit d’enregistrement** : une autre fenêtre a enregistré le site ; conserver le texte en cours, recharger, puis appliquer le changement.

## Documentation officielle

- Next.js sur Vercel : https://vercel.com/docs/frameworks/full-stack/nextjs
- Neon Serverless Driver : https://neon.com/docs/serverless/serverless-driver
- Import d’images Vercel Blob : https://vercel.com/docs/vercel-blob/server-upload

## Vérification locale de la version de production

```bash
npm run build
npm run test:routes
```

Le contrôle de sources intégré à la compilation affiche un message explicite si une page ou une API manque. Les tests de routes lancent temporairement le serveur local sur le port 3187, sans utiliser ta base ni tes secrets, puis vérifient les pages, les erreurs 404, l’image principale et la protection des dossiers.
