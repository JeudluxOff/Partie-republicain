# Vérifications de l’export

- Compilation Next.js de production réussie (`npm run build`, Next.js 16.4.0).
- Vérification TypeScript réussie pendant la compilation.
- 23 contrôles isolés réussis : mot de passe, signature de session, refus des sessions modifiées, révocation après changement du mot de passe, accès anonyme refusé à l’administration, contrôle d’origine, attributs du cookie, limite de tentatives, sauvegarde des contenus, conflits de révision, confidentialité des brouillons, adhésion, doublons, suivi et suppression.
- Les contrôles utilisent une base isolée et des dépendances simulées. Ils ne constituent pas un test de connexion à ta future base Neon ni à ton stockage Vercel Blob.
- Aucun déploiement n’a été réalisé sur ton compte Vercel. Effectue les étapes du guide, puis les vérifications après déploiement.
- Le rendu visuel n’a pas pu être inspecté dans un navigateur dans cet environnement. Les styles comprennent les adaptations pour ordinateur, tablette et mobile.
