# V9 — Conseil de gouvernement

Cette version reprend la V8.1 et ajoute le suivi des textes examinés par le Conseil de gouvernement.

## Installation sur Vercel

Remplacez les sources de votre dépôt par le contenu de cette archive, à la racine (au même niveau que package.json), puis poussez le dépôt sur GitHub. Vercel reconstruira le site.

Conservez vos variables existantes DATABASE_URL, SESSION_SECRET, ADMIN_PASSWORD et BLOB_READ_WRITE_TOKEN. Aucune nouvelle variable ni commande SQL à exécuter : cette fonction utilise les tables gouvernementales existantes. Ne supprimez pas votre base de données.

## Déposer et suivre un dossier

1. Connectez-vous avec un compte gouvernemental, puis ouvrez votre service et ses Documents.
2. Créez ou ouvrez un document législatif, complétez-le et enregistrez-le.
3. Cliquez sur « Transmettre au Conseil ». La confirmation indique que le texte sera visible par tous les comptes gouvernementaux.
4. Ouvrez « Conseil de gouvernement » dans la navigation commune. Consultez le dossier et sa copie du texte source.
5. Le lieutenant-gouverneur et le secrétaire d’État général enregistrent chacun leur avis favorable ou défavorable, avec motivation.
6. Le gouverneur autorise la soumission au vote ou refuse le projet. Les avis sont consultatifs : il peut statuer sans attendre les avis ou malgré un avis défavorable. Il peut retirer un dossier soumis tant que le résultat n’a pas été enregistré.
7. Le vote se tient en séance. Le site ne propose aucun bulletin de vote individuel.
8. Le gouverneur ou le secrétaire général consigne la date, les nombres de voix pour/contre/abstentions, le résultat proclamé et le procès-verbal. Tous les comptes gouvernementaux peuvent consulter ce résultat.

## Règles d’accès

- Tous les comptes gouvernementaux, y compris les conseillers : consultation des dossiers du Conseil.
- Transmission : droit de lecture et de création dans le service du document source.
- Lieutenant-gouverneur : son avis consultatif uniquement, pendant l’examen.
- Secrétaire général : son avis consultatif et saisie du résultat après autorisation du gouverneur.
- Gouverneur : décision de soumission/refus et saisie du résultat.
- Compte technique du parti : gestion des comptes existante, aucun accès au Conseil. Utilisez un compte gouvernemental nominatif.

Les permissions de cette procédure sont contrôlées côté serveur. Le pouvoir général d’administration des dossiers du secrétaire général ne permet pas de se substituer au gouverneur dans cette procédure.

## Version du texte et traçabilité

La transmission copie le texte, sa référence et sa version. Modifier le document source ne modifie jamais la copie examinée. Pour soumettre un texte révisé, transmettez sa nouvelle version dans un nouveau dossier ; le gouverneur peut refuser l’ancien dossier encore en cours.

Chaque avis, décision et résultat est enregistré avec auteur, date et historique. Les avis deviennent non modifiables après soumission. Le résultat final ne peut pas être écrasé silencieusement. La mise à jour concurrente d’une version périmée est refusée.

L’adoption inscrite dans le Conseil ne modifie pas automatiquement le State Code, les taxes, les autres registres ni les documents d’origine. La mise en application se fait séparément. Le résultat est celui proclamé en séance : aucune règle de quorum ou de majorité n’est inventée par le logiciel. Précisez les participants et la règle retenue dans le procès-verbal.

## Vérification

Build de production Next.js et vérification TypeScript réussis. 227 contrôles isolés passent, dont le parcours complet du Conseil, les droits, les conflits de version, l’immuabilité de la copie, les erreurs de date et de décompte, et le blocage des contournements par les anciennes API.

Les tests de routes utilisent un adaptateur local de base de données ; ils ne constituent pas une vérification du déploiement Vercel ou de votre base Neon. Aucun déploiement en production ni test visuel dans un navigateur n’a été effectué dans cette session.
