# Mise à jour V3 — San Andreas Republican Party

## Installation sur le site Vercel existant

1. Décompressez le ZIP et remplacez les fichiers du dépôt GitHub par son contenu. Cette mise à jour touche plusieurs fichiers : ne remplacez pas uniquement civic.css.
2. Conservez vos variables Vercel actuelles : DATABASE_URL, ADMIN_PASSWORD, SESSION_SECRET et BLOB_READ_WRITE_TOKEN. Aucun nouveau secret n’est nécessaire.
3. Laissez Vercel terminer le déploiement, puis connectez-vous sur /connexion avec l’identifiant **admin** et votre mot de passe administrateur habituel.
4. Les tables supplémentaires sont créées automatiquement au premier usage. Si le rôle Neon n’a pas le droit de créer des tables, exécutez le contenu de `database/upgrade-v3.sql` dans l’éditeur SQL de votre base Neon existante. Ce script ne supprime aucune donnée. Pour une installation neuve, utilisez `database/schema.sql`.

Les données présentes dans Neon sont conservées : textes, annonces, profils, programme et adhésions. Les portraits, leur transparence, les fiches membres et l’affichage intégral des affiches restent en place. Les nouvelles sections n’inventent aucun événement ni candidat.

## Ce qui change sur le site

- Accueil : une annonce principale, puis les publications suivantes ; campagne configurable et prochains rendez-vous.
- `/campagne` : affiche, présentation et candidats sélectionnés, avec liens vers leurs fiches et cabinets.
- `/agenda` : événements à venir/passés, lieux et inscriptions RP. Un événement passé ou dont les inscriptions sont désactivées n’accepte plus d’inscription. Une seule inscription par contact Discord et événement.
- `/programme` : thèmes cliquables ; chaque thème dispose d’une page avec ses propositions.
- `/presse` : logo, affiches téléchargeables et annonces dont la catégorie contient « communiqué ».
- `/contact` : formulaire indépendant des adhésions ; les messages arrivent dans l’administration.

## Dans l’administration

Les modifications de contenu se publient avec **Enregistrer le site**, en haut de la page. Les comptes et les statuts des messages sont enregistrés immédiatement avec leurs boutons dédiés.

### Campagne

Ouvrez « Campagne », activez l’affichage, indiquez le titre, le texte et l’affiche. Cochez les candidats souhaités. Ils doivent avoir la catégorie « Candidats au gouvernement » et être publiés dans « Équipe & cabinets ». Le cabinet demeure rattaché depuis les fiches membres existantes.

### Agenda

Créez un rendez-vous, renseignez date, heure, lieu et description, puis cochez Publier et éventuellement Ouvrir les inscriptions. Les horaires sont saisis dans le fuseau de votre appareil et affichés en heure de Paris pour les visiteurs. Enregistrez le site.

### Annonces

- « Aperçu avant publication » montre le brouillon en cours sans le publier.
- « Mettre à la une » sélectionne l’annonce principale de l’accueil. Sans sélection, la plus récente est utilisée.
- Pour programmer une annonce, choisissez une date et une heure, cochez Publier et enregistrez. Le serveur masque le contenu avant cette date. Il devient accessible à partir de l’heure choisie ; une page publique déjà ouverte se rafraîchit toutes les 30 secondes lorsqu’elle est visible. Aucun service Cron n’est nécessaire.
- Une annonce en brouillon reste privée même si une heure est renseignée.

Les fiches membres proposent aussi un aperçu de la présentation avant publication.

### Galerie et presse

Chaque sélecteur d’image propose « Choisir dans la galerie » : il réutilise les images importées dans le stockage Blob du site. « Charger la suite » affiche les images suivantes. La galerie montre le dossier `san-andreas-republican-party/` ; les anciennes images stockées ailleurs restent utilisables dans leurs contenus existants.

Dans « Presse », ajoutez les visuels à proposer au téléchargement. Le logo courant apparaît automatiquement. Formats PNG, JPEG et WebP, limite d’import 4 Mo inchangée. Si un navigateur refuse le téléchargement direct, le lien Ouvrir permet d’enregistrer l’image.

### Messages et inscriptions

Ouvrez « Messages & inscriptions » pour consulter les contacts Discord et les inscriptions, marquer un élément nouveau/en cours/traité ou le supprimer. L’affichage propose les 2 000 derniers éléments. Les réponses se font manuellement depuis votre Discord : le site n’envoie pas de DM ni d’e-mail.

### Historique

À chaque remplacement du contenu enregistré, sa version précédente est archivée. Les 50 dernières versions sont accessibles. « Restaurer dans l’éditeur » charge une ancienne version comme brouillon : vérifiez-la puis cliquez sur Enregistrer le site. Cette restauration ne modifie ni les adhésions, ni les messages, ni les comptes. Les fichiers image doivent toujours exister dans Blob. L’historique démarre à l’installation de cette version.

### Comptes et accès

- **Direction** : tous les contenus, adhésions, messages, historique et gestion des comptes.
- **Communication** : annonces, campagne, agenda, presse, galerie, messages et inscriptions. Pas d’accès aux dossiers d’adhésion, à la modification des membres/programmes/identité ni à la gestion des comptes.
- **Recrutement** : dossiers d’adhésion et liens de suivi uniquement.

Le compte principal `admin` utilise toujours ADMIN_PASSWORD. Dans « Comptes & accès », créez un identifiant de 3 à 60 lettres minuscules/chiffres/points/tirets/underscores et un mot de passe d’au moins 16 caractères. Transmettez vous-même les identifiants aux personnes concernées.

Pour réinitialiser un compte, saisissez son identifiant existant, son nouveau mot de passe et son rôle. Ses sessions précédentes sont invalidées. Supprimer un compte révoque également son accès. Les mots de passe des comptes sont stockés sous forme de dérivés scrypt salés, jamais en clair.

## Vérifications réalisées

Compilation de production et vérification TypeScript. Tests HTTP des routes publiques, API et refus d’accès anonyme. 74 vérifications isolées des données et droits : connexion, protection des adhésions, suivi privé, champs des fiches membres, annonce programmée, formulaires, doublons d’inscription, restrictions de rôles, révocation des sessions et restauration sans perte de messages.

Les tests de données utilisent un adaptateur de base isolé, sans écrire dans votre Neon. Le téléversement Blob et le rendu visuel n’ont pas été vérifiés sur votre déploiement Vercel connecté. Le projet est livré en code source ; votre push déclenche le déploiement.
