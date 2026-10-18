# V7 — Documents de réforme du State Code

## Installation
Remplacez les sources du projet GitHub par le contenu de l'archive puis redéployez sur Vercel. Conservez la même base Neon et les variables actuelles. Aucune migration SQL supplémentaire depuis la V6.

## Accès aux modèles
Dans /gouvernement, ouvrez votre service → Nouveau dossier → Document → choisissez un modèle. Les sept nouveaux modèles sont disponibles dans les six services métiers (hors annonces et codes confidentiels) :
1. Projet de loi — modification du State Code.
2. Proposition de loi — modification du State Code.
3. Amendement à un texte en examen.
4. Note de présentation d'une réforme.
5. Avis juridique RP sur une réforme.
6. Compte rendu d'examen d'un texte.
7. Décision RP d'adoption ou de rejet.

Les documents restent dans le service où ils sont créés, avec ses permissions existantes. Les accès du secrétaire général sont conservés.

## Préparer une réforme
Renseignez l'objet, les auteurs, les motifs, la synthèse, les conséquences, le financement et l'entrée en vigueur proposée. Ajoutez de 1 à 20 dispositions :
- Ajouter : référence du code, numéro du nouvel article et rédaction proposée.
- Remplacer : référence, texte actuel et nouvelle rédaction.
- Abroger : référence et texte actuel.

Les dispositions sont numérotées automatiquement. L'aperçu et l'impression incluent un tableau avant/après. Pour un amendement, indiquez la référence et la version du texte en examen ; les références et textes visés sont saisis manuellement. Le site n'importe ni ne modifie le State Code.

Les champs, articles et choix restent modifiables après enregistrement. L'identité initiale du rédacteur et la référence restent stables ; l'historique existant retrace les révisions et leurs auteurs. Une modification remet le document en brouillon. Le modèle ne peut pas être changé après la création.

## Examen et décision RP
Le champ de suivi permet de noter Préparation, Déposé, Avis demandé, En révision ou Décision attendue (selon le modèle). Le passage d'étape est renseigné manuellement et ne remplace pas une procédure réelle de dépôt ou un vote.
Les projets, propositions et amendements portent « Projet — non adopté ». Valider une fiche dans le portail valide sa rédaction, pas une loi. Pour consigner une décision RP, créez une fiche « Décision RP d'adoption ou de rejet », renseignez la référence et la version exactes, l'autorité, le résultat, les votes, les motifs et l'application, puis soumettez-la à validation.
Les fiches de décision sont référencées manuellement dans les documents de suivi. Elles ne changent pas automatiquement le statut d'un projet, sa mention de projet, ni le State Code. Conservez le projet comme pièce préparatoire ; utilisez la fiche de décision validée pour attester du résultat RP.

## Impression
Imprimer / PDF → Enregistrer au format PDF dans le navigateur. Ce n'est pas un téléchargement PDF direct. Avant d'imprimer, vérifiez les références et les textes recopiés depuis la version de votre serveur.

## Inspiration officielle et adaptation RP
Structure inspirée des textes californiens : intitulé, auteur, résumé, références aux sections modifiées, dispositions numérotées et examen par amendements. Les intitulés français « projet » et « proposition » sont des conventions de votre serveur, pas une transcription de la nomenclature américaine.
Sources consultées le 18 octobre 2026 :
- Office of the Chief Clerk, Glossary of Terms : https://clerk.assembly.ca.gov/glossary-terms
- Exemple officiel SB 1186, amendé le 20 juin 2012 : https://www.leginfo.ca.gov/pub/11-12/bill/sen/sb_1151-1200/sb_1186_bill_20120620_amended_asm_v96.html
Les modèles ne recopient pas le contenu de ces lois et n'imposent aucune institution ou procédure au serveur.

## Vérifications
186 contrôles isolés réussis, dont création des sept modèles, conservation des champs, révision, référence stable, opérations ajout/remplacement/abrogation et rejet des entrées invalides. Compilation Next.js / TypeScript vérifiée séparément. Tests de persistance réalisés avec un adaptateur local ; pas de test sur votre base Neon de production ni de contrôle visuel dans votre navigateur.
