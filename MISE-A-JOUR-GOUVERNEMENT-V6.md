# V6 — Le bureau gouvernemental

## Installation sur Vercel
Remplacez les sources de votre projet GitHub par le contenu du ZIP, avec package.json à la racine. Redéployez votre projet Vercel. Conservez les variables actuelles et la même base Neon. Aucune nouvelle migration SQL et aucun nouveau mot de passe ne sont nécessaires depuis la V5.

## Nouvelle interface
- Accueil : bulletin éditorial ivoire et bleu nuit, communiqué principal, prochaines réunions et événements accessibles, fil des services.
- Salle du conseil : pour gouverneur, lieutenant-gouverneur et secrétaire général ; synthèse par service et parapheur des dossiers à valider. Les boutons ouvrent le registre du service concerné.
- Secrétariat général : ordre du jour, feuilles de réunion, participants, décisions et documents à valider.
- Finances : poste de trésorerie sombre avec solde, mouvements et graphique ; les fonctions V5 sont conservées.
- Sécurité : centre de coordination, consignes et main courante des incidents.
- Justice : dossiers à onglets avec référence, parties, responsable et échéance.
- Vie citoyenne : guichet avec fiches de demande réparties selon leur statut de validation.
- Événementiel : calendrier mensuel navigable. Cliquez sur un événement pour ouvrir sa fiche.
- Annonces : tableau d'affichage et feuilles de communiqué.
- Codes : coffre d'accès avec valeurs masquées dans les fiches.
- Documents : registre à gauche, aperçu au centre et formulaire à droite sur grand écran ; disposition empilée sur petit écran. Choisissez un modèle pour afficher l'aperçu. Les modèles et fonctions de validation V5 sont conservés.

Ouvrir une fiche masque le tableau de bord pour libérer la place. « Bureau du service » permet de revenir ; une confirmation protège les modifications non enregistrées.

## Données et permissions
Cette version refond l'interface sans remplacer les données. Les accès complets du secrétaire général, les accès partagés Finances/Entreprises, les annonces validées communes et la protection des codes sont conservés. Aucun contenu fictif ni chiffre de démonstration n'est ajouté.

Les modules proposés précédemment (pièces jointes privées, notifications, commentaires, PDF direct, suivi métier distinct de la validation) ne sont pas ajoutés par cette refonte visuelle. L'export de document utilise toujours Imprimer / PDF. La limite de 1 000 dossiers par registre de la V5 demeure, avec son avertissement.

## Vérification
Compilation de production Next.js et TypeScript vérifiée. Pas de validation visuelle automatisée dans un navigateur ni de test sur votre base Neon ou votre déploiement Vercel. Le guide V5 reste inclus pour les opérations et la gestion des comptes.
