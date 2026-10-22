# Mise à jour : suivi privé des adhésions

## Installation sur le site existant

1. Remplace les fichiers du dépôt par le contenu de ce ZIP, à la même racine.
2. Conserve tes variables Vercel et ta base Neon : aucune modification SQL n’est nécessaire.
3. Attends que le nouveau déploiement Vercel soit Ready, puis ouvre le domaine du site mis à jour.

## Pour les candidats

Après l’envoi d’une demande, le site donne une référence et un lien privé avec les boutons « Suivre ma demande » et « Copier le lien ». Il faut conserver ce lien, qui donne accès au statut. La référence courte seule ne permet pas de se connecter.

La page `/suivi` est accessible dans le pied de page et depuis le formulaire. On peut y coller le lien ou le code complet. Le statut est vérifié toutes les 15 secondes pendant que l’onglet est visible, à son retour au premier plan et via le bouton Actualiser. Ce suivi n’envoie pas de notification Discord ou d’e-mail.

Statuts : demande reçue, en cours d’examen, acceptée, refusée, archivée. Seuls la référence, le statut et la date de dépôt sont exposés : aucun nom, identifiant Discord, motivation ou note interne.

## Pour les administrateurs

Dans `/admin` → Adhésions, ouvrir un dossier, choisir son statut puis cliquer sur « Enregistrer le dossier ». Le candidat verra le changement à la prochaine actualisation.

Dans chaque dossier, « Obtenir le lien de suivi du candidat » permet de copier le lien à transmettre personnellement au bon candidat. Cela fonctionne aussi pour les anciens dossiers et en cas de lien perdu. Aucun message n’est envoyé automatiquement.

Les liens utilisent une signature avec SESSION_SECRET. Ils restent valides tant que le dossier existe et que ce secret ne change pas. Si le secret change, récupérer de nouveaux liens depuis l’administration. Le lien donne accès au statut à toute personne qui le possède : le conserver privé.

## Validation

Compilation Next.js/TypeScript réussie. Tests des routes de production locale réussis. 35 contrôles isolés réussis, dont signature altérée, référence courte refusée, accès administrateur protégé, changement de statut visible, confidentialité des notes, anciens dossiers, suppression et changement du secret. La base et les services externes sont simulés dans les contrôles isolés. Le déploiement réel sur ton compte Vercel reste à effectuer.
