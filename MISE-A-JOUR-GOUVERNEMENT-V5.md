# Gouvernement V5 — installation et utilisation

Remplacez les sources du projet GitHub par le contenu de cette archive (package.json à la racine), puis redéployez sur Vercel. Conservez vos variables actuelles DATABASE_URL, SESSION_SECRET, ADMIN_PASSWORD et BLOB_READ_WRITE_TOKEN. Aucun nouveau secret ni nouveau mot de passe prédéfini.

Depuis la V4, aucune migration SQL supplémentaire : les nouveaux types utilisent les tables gouvernementales existantes. Les comptes, dossiers et données du site sont conservés dans la même base Neon. Ne relancez pas de script d'effacement.

## Accès

Ouvrez /gouvernement et connectez-vous avec votre compte gouvernemental.
- Secrétaire général : tous les services, codes confidentiels, création et gestion des comptes. Ce changement s'applique aussi aux comptes existants, indépendamment de leurs anciennes cases de permissions.
- Tous les agents : accueil commun et lecture des annonces validées.
- Gouverneur, lieutenant-gouverneur et secrétaire général : publication des annonces communes. Les autres permissions des comptes existants sont conservées.
- Administrateur technique : gestion des comptes ; utilisez un compte gouvernemental nominatif pour consulter les dossiers.
- Finances et Entreprises : mêmes dossiers et mêmes droits par défaut.

## Accueil commun

Annonces communes : créez une annonce, enregistrez le brouillon puis « Valider et signer RP » pour la publier. Archiver la retire de l'accueil. L'accueil se rafraîchit toutes les 30 secondes ; les formulaires ouverts ne sont pas actualisés automatiquement.
L'activité est limitée aux services accessibles à la personne connectée. Les codes confidentiels n'y sont jamais chargés. Les annonces en brouillon et leur historique restent réservés aux personnes ayant les droits d'édition.

## Espaces par métier

- Secrétariat général : réunions, participants, décisions, responsables et échéances.
- Sécurité : consignes validées mises en avant et fiches incident avec lieu, gravité et mesures.
- Justice : registre des dossiers, références, parties, juriste et échéances.
- Vie citoyenne : demandes par statut, citoyen, catégorie, contact et suivi.
- Événementiel : cartes datées, organisateur, lieu, partenaires, programme et sécurité.
- Finances & Entreprises : tableau de trésorerie sombre, solde, activité du jour et de la semaine, graphique, opérations récentes, entreprises, fiscalité et budgets.

Les fiches utilisent le cycle brouillon → à valider → validé → archivé, avec historique des versions. Les titres « validé » des demandes citoyennes correspondent à une validation administrative, pas à un statut de résolution distinct.

## Trésorerie RP

Une opération contient sens recette/dépense, montant, date, catégorie, référence, contrepartie et justification. Seules les opérations validées entrent dans le solde. Après validation, une opération est immuable : corrigez par une écriture inverse en indiquant la référence d'origine.
Les paiements fiscaux sont ajoutés automatiquement au solde : ne les saisissez pas une seconde fois en recettes. Les budgets sont des enveloppes suivies séparément, pas des écritures de trésorerie. Pour reprendre un solde initial, saisissez et validez une opération de reprise. Aucun lien avec la banque FiveM.
Les tableaux utilisent les 1 000 derniers dossiers du service ; un avertissement signale cette limite lorsqu'elle est atteinte. Les données ne sont pas une comptabilité bancaire réelle.

## Documents

La bibliothèque propose les modèles du service et les modèles personnalisés validés. Choisissez un modèle, complétez ses champs et consultez l'aperçu pendant la saisie. Identité du rédacteur, rôle, date, service et entreprise sélectionnée sont préremplis. La référence définitive est attribuée à l'enregistrement.
Formulaire et aperçu sont côte à côte sur les grands écrans, empilés sur les petits écrans. Enregistrez, soumettez puis validez pour signer RP. « Imprimer / PDF » utilise l'impression du navigateur : choisissez Enregistrer au format PDF. Ce n'est pas un export PDF direct.
L'interface a été réorganisée ; elle n'est pas une reproduction exacte du site médical, dont la capture détaillée du générateur n'a pas été fournie.

## Vérifications

Compilation Next.js et TypeScript ; tests isolés des permissions, annonces, écritures financières, fiches métiers et régressions V4. L'adaptateur de tests utilise une base locale simulant Neon : aucune modification de votre base de production. Le déploiement Vercel réel et l'affichage dans votre navigateur restent à vérifier après publication.
