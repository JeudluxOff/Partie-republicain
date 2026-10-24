# V4 — Espace gouvernement de San Andreas

## Installation et premier accès

1. Remplacez les fichiers du dépôt GitHub par le contenu de ce ZIP complet, puis laissez Vercel redéployer. Conservez DATABASE_URL, ADMIN_PASSWORD, SESSION_SECRET et BLOB_READ_WRITE_TOKEN.
2. Connectez-vous sur `/connexion` avec votre compte principal `admin` et son mot de passe actuel. Un compte du parti ayant le rôle Direction peut également gérer les accès gouvernementaux.
3. Ouvrez `/gouvernement` ou le lien Espace gouvernement de l’administration. La session technique donne accès à **Comptes & permissions**, pas aux dossiers gouvernementaux.
4. Créez un compte nominatif pour le gouverneur : nom RP, identifiant, mot de passe de 16 caractères minimum, poste Gouverneur. Vérifiez les cases de permissions puis enregistrez.
5. Pour utiliser le compte gouvernemental, déconnectez-vous aussi de l’administration du parti (ou utilisez une fenêtre privée), puis ouvrez `/gouvernement` et connectez-vous avec les nouveaux identifiants. Les comptes gouvernementaux n’utilisent pas la page de connexion du parti.
6. Créez ensuite les comptes des secrétaires et conseillers. Le gouverneur et les administrateurs techniques peuvent gérer les comptes. Le lieutenant ne gère pas les comptes par défaut.

Les nouvelles tables sont créées automatiquement au premier usage. Si les droits Neon de création de tables sont limités, exécutez `database/upgrade-v4.sql` dans l’éditeur SQL de **la base existante**. Le script ne supprime aucune donnée. Une installation entièrement neuve utilise `database/schema.sql`.

Aucun mot de passe de compte gouvernemental n’est fourni dans le ZIP. Vous choisissez les mots de passe dans l’administration. Les données du parti, les adhésions, le suivi et toutes les fonctions V3 sont conservés.

## Postes et droits par défaut

| Poste | Services accessibles | Capacités par défaut |
|---|---|---|
| Gouverneur | Tous | Consultation, création, modification, validation, suppression de brouillons ; gestion des comptes |
| Lieutenant-gouverneur | Tous | Consultation, création, modification, validation, suppression de brouillons |
| Secrétaire d’État général | Secrétariat général | Consultation, création, modification, validation |
| Sécurité intérieure | Sécurité et Codes confidentiels | Consultation, création, modification, validation |
| Finances | Finances & Entreprises | Consultation, création, modification, validation |
| Entreprises | Finances & Entreprises | Exactement le même service et les mêmes droits que Finances |
| Justice | Justice | Consultation, création, modification, validation |
| Vie citoyenne | Vie citoyenne | Consultation, création, modification, validation |
| Événementiel | Événementiel | Consultation, création, modification, validation |
| Conseiller | Domaine choisi | Consultation, création, modification ; pas de validation ni de suppression |
| Administrateur technique du site | Gestion des comptes | N’accède pas aux dossiers avec son identité technique ; utilise un compte gouvernemental nominatif pour travailler |

Les cases de droits peuvent être ajustées individuellement, service par service. Consulter est nécessaire pour les autres droits. Finances et Entreprises partagent un seul registre : aucune copie ou synchronisation manuelle. Les codes confidentiels sont un service distinct, dont les accès peuvent être retirés sans retirer l’accès aux rapports de sécurité.

Changer un rôle recharge ses droits par défaut dans le formulaire : vérifiez les cases avant d’enregistrer. Modifier un compte, ses droits ou son mot de passe invalide ses sessions existantes. Supprimer un compte révoque son accès, sans supprimer les documents qu’il a rédigés. Un utilisateur ne peut pas modifier/supprimer son propre compte ; un autre administrateur doit s’en charger.

## Travailler dans un service

Chaque service propose des notes, tâches, documents et modèles. Le menu ne montre que les services autorisés. Le contrôle est également effectué côté serveur pour chaque lecture et écriture ; masquer un bouton n’est pas la protection utilisée.

Sélectionnez un service, cliquez sur **Nouveau dossier**, choisissez le type, remplissez les champs puis **Enregistrer le brouillon**. Les champs auteur, référence et signature sont gérés par le serveur. Les dossiers sont partagés avec les autres comptes ayant accès au même service, y compris ses conseillers. Il n’y a pas de restriction par auteur à l’intérieur d’un service.

Cycle de travail : Brouillon → À valider → Validé → Archivé. Un responsable disposant du droit Valider peut valider directement un brouillon, le signer RP, l’archiver ou rouvrir un document. Un conseiller prépare et soumet, mais ne valide pas par défaut.

Une modification d’un document validé retire sa validation et le remet en brouillon. Il faut enregistrer les changements avant de soumettre ou valider. L’archivage n’efface pas les données. Seuls les brouillons sans paiement peuvent être supprimés ; les autres dossiers restent archivables.

Les dossiers utilisent des versions : une sauvegarde obsolète est refusée lorsqu’un collègue a modifié la même fiche. L’historique conserve l’auteur de chaque action, la date, le statut et le contenu de la version. Les suppressions et modifications de comptes sont également journalisées.

## Documents préremplis : même principe que le site médical

1. Nouveau dossier → Document.
2. Choisissez un modèle de votre service.
3. Dans Finances & Entreprises, sélectionnez éventuellement une entreprise pour reprendre son nom et son responsable.
4. Complétez les champs structurés. L’aperçu A4 se construit immédiatement.
5. Enregistrez : le serveur attribue la référence et utilise le nom RP et la fonction du compte connecté, le service et la date.
6. Le texte enregistré peut être relu et modifié avant validation. La validation inscrit le nom du signataire et sa date. C’est une signature RP enregistrée dans l’historique, pas une signature électronique certifiée.
7. **Imprimer / PDF** ouvre la boîte d’impression du navigateur. Choisissez « Enregistrer au format PDF ». Le format d’impression est A4 ; les menus ne sont pas imprimés. Aucun service externe ne reçoit le contenu.

Les documents non validés portent la mention BROUILLON. Le fichier PDF est produit par le navigateur, pas par une intégration au site médical : son principe de formulaire et préremplissage est repris, pas sa base de données.

### Les 15 modèles inclus

- Secrétariat général : décret gouvernemental, arrêté de nomination, compte rendu de réunion.
- Sécurité : ordre de mission, rapport d’incident.
- Finances & Entreprises : décision fiscale, autorisation d’activité, rapport de contrôle d’entreprise, demande de budget.
- Justice : avis juridique RP, bordereau de transmission.
- Vie citoyenne : suivi d’une demande citoyenne, fiche de projet citoyen.
- Événementiel : autorisation d’événement, bilan d’événement.

Pour ajouter un modèle, choisissez Nouveau dossier → Modèle de document. Ajoutez des champs (texte, texte long, date, nombre), indiquez leur clé puis utilisez `{{cle_du_champ}}` dans le texte. Les variables automatiques sont `{{reference}}`, `{{date}}`, `{{service}}`, `{{redacteur}}`, `{{fonction}}`, `{{entreprise}}`, `{{responsable}}`. Un modèle personnalisé doit être validé pour apparaître dans le sélecteur de modèles du service.

## Taxes, entreprises et paiements RP

Ordre conseillé :

1. Créez une fiche **Entreprise** et faites-la valider.
2. Créez un **Taux de taxe** : pourcentage de 0 à 100, assiette (ex. chiffre d’affaires déclaré), date d’application, motifs. Faites-le valider.
3. Créez un **Avis de taxe & paiements** : entreprise, taux validé déjà applicable, montant déclaré, période et échéance.
4. Le serveur calcule le montant dû en centimes, arrondi au centime. Le nom du taux, son pourcentage et sa version sont conservés dans l’avis. Une modification ultérieure du taux ne recalcule pas les anciens avis.
5. Validez l’avis. Un avis validé ne peut plus être modifié ou rouvert pour changer son montant. En cas de rectification, archivez-le et créez un nouvel avis explicite ; son historique et ses paiements restent conservés.
6. Enregistrez chaque règlement RP avec son montant et une référence. Les paiements partiels sont possibles. Une référence déjà utilisée sur le même avis et un montant supérieur au reste dû sont refusés. Le droit Valider du service est requis pour enregistrer un paiement.

Il s’agit de comptabilité RP : aucun paiement bancaire, Discord ou FiveM n’est exécuté. L’assiette et les paiements sont saisis manuellement. La taxe est un pourcentage simple, sans barème progressif ou calcul juridique réel. Un document « Décision fiscale » ne change pas à lui seul le taux du registre.

Le type **Budget** suit une enveloppe allouée et les dépenses constatées pour une période. C’est un suivi manuel, indépendant des règlements des avis de taxe.

## Sécurité et codes confidentiels

- Sécurité intérieure → Niveau d’alerte / consigne : libellé libre, consignes et date d’application.
- Codes confidentiels → Code confidentiel : code d’accès RP, fréquence ou autre valeur, consignes et expiration facultative. La valeur est masquée visuellement, avec un bouton Afficher.
- L’expiration est informative : aucun accès ou système en jeu n’est changé automatiquement.
- L’historique des codes est réservé aux comptes ayant accès à ce même service. Les anciennes valeurs restent présentes dans les versions pour le suivi RP.

Aucune donnée gouvernementale n’est publiée sur le site du parti ou son API publique. Les documents restent dans Neon ; ils ne sont pas envoyés au stockage Blob public. Il n’y a pas d’import de pièces jointes dans cette version : les documents sont créés et édités dans le portail.

## Limites et vérifications

Les 1 000 dossiers les plus récents d’un service sont affichés ; un avertissement apparaît au-delà. Les compteurs portent sur les dossiers chargés. L’historique d’un dossier montre ses 100 dernières versions. Il n’y a pas de notifications automatiques, de publication au Journal officiel ni de connexion aux données du site médical.

Vérification TypeScript, compilation de production et tests des routes. Tests isolés des permissions, des sessions révoquées, du partage Finances/Entreprises, des calculs et règlements RP, de la validation documentaire, des modèles personnalisés et de la non-divulgation des codes. L’adaptateur SQL de test est isolé ; aucune écriture n’a été faite dans votre Neon. La syntaxe PostgreSQL des écritures atomiques a été relue, mais ces écritures n’ont pas été testées sur votre base réelle. Rendu navigateur et impression PDF à vérifier sur votre déploiement Vercel.
