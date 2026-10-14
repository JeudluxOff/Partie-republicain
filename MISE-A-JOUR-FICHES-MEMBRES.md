# Fiches individuelles des membres

Cette version reprend le dernier projet fourni, avec la correction des fonds transparents, et intègre la présentation individuelle inspirée du SVG transmis.

## Installer

Remplacer les fichiers du dépôt GitHub par le contenu du ZIP, puis attendre le déploiement Vercel. Conserver les variables et la base Neon : aucun SQL supplémentaire n’est nécessaire.

## Utiliser

Dans Administration → Équipe & cabinets, ouvrir un membre. Remplir les champs Rôle sur la fiche de présentation, Priorités du membre et Valeurs du membre, puis cliquer sur Enregistrer le site.

Le champ Fonction / poste visé apparaît au-dessus du nom. Si Rôle sur la fiche est vide, la fonction est aussi utilisée dans la ligne Rôle. Les priorités et valeurs non renseignées affichent « À venir ». Aucun contenu de démonstration n’est ajouté aux membres réels.

Sur la page Équipe, cliquer sur un membre affiche son portrait, son nom et ses informations dans la nouvelle présentation. La biographie et le cabinet restent affichés sous la fiche. Les membres non publiés restent masqués.

Les PNG transparents sont conseillés : le site adapte l’image au cadre sans étirement ni recadrage. Il ne retire pas un fond intégré dans une photo. Sur téléphone, le portrait et les informations s’affichent verticalement. Les champs longs passent à la ligne et la fiche grandit.

Le décor de drapeaux a été extrait du SVG fourni. Le logo configurable du site et le nom du parti sont utilisés. Les portraits et les textes de la maquette ne sont pas imposés aux autres membres.

## Vérifications

Compilation Next.js et TypeScript réussies. Tests HTTP locaux des routes réussis. 43 contrôles isolés réussis, dont enregistrement et restitution des trois nouveaux champs, conservation de la biographie, compatibilité des anciens profils et validation des types et longueurs. Base Neon simulée lors des contrôles isolés ; aucun déploiement sur le compte Vercel n’a été effectué ici.
