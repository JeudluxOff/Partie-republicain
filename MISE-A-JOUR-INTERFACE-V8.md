# V8 — Interface gouvernementale

## Installation
Remplacez les sources de votre projet GitHub par le contenu du ZIP et redéployez sur Vercel. Conservez les variables et la base Neon existantes. Aucun SQL supplémentaire ni changement de comptes depuis la V7.

## Navigation
Le menu latéral distingue l'espace commun, les services accessibles et l'administration. Sur téléphone, utilisez le bouton de menu en haut à gauche. Le fil d'Ariane identifie la rubrique ouverte.
Chaque service propose :
- Vue d'ensemble : son tableau de bord et ses actions métier.
- Registre : tableau des dossiers avec recherche par titre, auteur ou référence, filtres par type et statut.
- Documents : documents et modèles du service. Cet onglet n'est pas présent pour les annonces et les codes confidentiels.

Cliquez sur le titre d'un dossier pour ouvrir sa fiche. La liste reste accessible à gauche. Les changements de rubrique et de vue demandent confirmation lorsqu'un formulaire a été modifié sans être enregistré. Actualiser le registre après confirmation recharge également le formulaire.

## Présentation
Accueil avec annonce principale, indicateurs issus des données autorisées, agenda et activité. Navigation compacte avec icônes, palette bleu nuit / blanc / bleu, statuts sous forme d'étiquettes. Finances, calendrier, dossiers judiciaires, demandes citoyennes et centre de coordination conservent leurs vues métier.
Dans l'atelier documentaire, aperçu au centre et propriétés à droite sur les grands écrans, disposition empilée sur les petits. Recherche dans les modèles avant sélection. Les sept modèles législatifs de la V7 et la comparaison avant/après sont conservés.

## Références de conception consultées
- USWDS — navigation latérale hiérarchisée : https://designsystem.digital.gov/components/side-navigation/
- GOV.UK — navigation du service et identification de la rubrique : https://design-system.service.gov.uk/components/service-navigation/
- Linear — vues de travail et propriétés des projets : https://linear.app/docs/projects

Ces références orientent l'organisation et la lisibilité ; l'interface est adaptée au gouvernement RP de San Andreas. Aucun logo de ces services n'est utilisé.

## Données et limites
Les permissions sont inchangées, dont les accès complets du secrétaire général et le partage Finances/Entreprises. Le code serveur, les données et le site public ne sont pas remplacés. Les limites fonctionnelles précédentes restent applicables : registre limité aux 1 000 dossiers les plus récents avec avertissement, PDF par impression, pas de nouvelles pièces jointes ni notifications.

## Aperçu
Le fichier HTML d'aperçu utilise les mêmes composants et styles avec des données fictives. Il permet de naviguer, filtrer, consulter et préparer un document, mais bloque tout enregistrement. Il ne se connecte pas à votre base.

## Validation
Compilation de production et TypeScript réussis. Aperçu autonome compilé depuis les composants de la V8. Pas de contrôle visuel dans un navigateur automatisé, ni de test sur votre déploiement Vercel ou votre base de production.
