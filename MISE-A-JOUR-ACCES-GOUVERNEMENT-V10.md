# V10 — Candidatures, adhésions et presse dans le gouvernement

## Installer

Remplacez les sources du dépôt par le contenu de cette archive, puis poussez sur GitHub pour déclencher Vercel. Conservez vos variables et votre base Neon existantes. Aucune nouvelle variable n’est nécessaire. Les colonnes de suivi des candidatures (révision et entretien) sont ajoutées automatiquement lors du premier accès, sans supprimer les données.

## Accès

Connectez-vous sur /gouvernement avec votre compte gouvernemental. Les comptes Gouverneur et Secrétaire d’État général voient automatiquement « Candidatures & adhésions » et « Presse & communication ».

Dans Comptes & permissions, modifiez le compte de la personne à habiliter et cochez les droits des deux nouvelles rubriques :
- Consulter : voir les dossiers ou les publications.
- Créer + Modifier : rédiger de nouvelles publications et modifier des brouillons.
- Modifier, pour le recrutement : notes internes, préparation des entretiens et suivi courant.
- Valider : accepter, refuser, archiver ou rouvrir une candidature ; publier ou modifier un contenu public.
- Supprimer + Valider, pour la communication : retirer un contenu public.

Le lieutenant-gouverneur et les autres membres ont besoin d’une délégation explicite pour ces rubriques. L’administration technique continue à gérer les comptes ; la gestion des dossiers se fait avec un compte gouvernemental nominatif.

## Candidatures et adhésions

Les demandes existantes sont conservées dans le même registre. Les onglets distinguent les adhésions au parti et les candidatures gouvernementales. Les anciens choix « Rejoindre un cabinet » et « Proposer ma candidature » sont classés parmi les candidatures gouvernementales.

Le formulaire public /candidater permet de préciser librement le poste ou le domaine souhaité. Son lien est disponible dans le pied de page et dans l’espace recrutement. Le formulaire /adherer reste disponible.

Un dossier contient le parcours, les motivations, les coordonnées, les disponibilités, les notes internes et la date d’entretien. Le candidat conserve son lien privé /suivi : il voit son statut, jamais les notes ou la date interne d’entretien. Il faut lui communiquer le rendez-vous sur Discord ; aucun message automatique n’est envoyé.

Accepter une candidature ne crée pas automatiquement un compte : utilisez ensuite Comptes & permissions pour attribuer les accès nécessaires. Les dossiers peuvent être archivés ; leur suppression définitive reste disponible dans l’administration existante.

## Presse & communication

- Publications : brouillons, communiqués, texte, résumé, image, publication immédiate ou programmée.
- Visuels presse : affiches et images téléchargeables sur /presse. Ces ressources deviennent publiques dès leur enregistrement.
- Messages & inscriptions : lecture des messages et suivi Nouveau / En cours / Traité.

Les contenus sont les mêmes que ceux de l’administration du site. Les modifications faites dans le gouvernement apparaissent donc sur le site public et dans l’administration existante. Les autres contenus (équipe, programme, identité, etc.) sont conservés côté serveur.

Les imports PNG, JPG et WebP jusqu’à 4 Mo utilisent le stockage Vercel Blob déjà configuré. Une publication de catégorie « Communiqué » apparaît dans le coin presse lorsqu’elle est publiée. Les dates sont saisies dans le fuseau de l’appareil et enregistrées avec leur fuseau.

## Vérification

Contrôles isolés : nouvelles permissions, délégation, candidatures publiques, suivi privé, protection des notes, conflits de version, brouillons et publication, conservation de l’identité et de l’équipe. Compilation Next.js et TypeScript vérifiées. Les tests utilisent un adaptateur local de base de données ; le déploiement Vercel, la base Neon réelle et le rendu visuel dans un navigateur n’ont pas été testés dans cette session.
