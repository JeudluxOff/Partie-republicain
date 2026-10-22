import {existsSync} from 'node:fs';
const files = ['app/gouvernement/page.tsx','app/gouvernement/portal.tsx','app/gouvernement/government.css','lib/government.ts','lib/gov-server.ts','lib/gov-validation.ts','app/api/government/records/route.ts','app/api/government/users/route.ts','app/api/government/session/route.ts','database/upgrade-v4.sql','app/extensions.tsx','app/extensions.css','lib/extra-db.ts','lib/public-content.ts','app/api/manage/route.ts','app/api/messages/route.ts','app/api/media/route.ts','database/upgrade-v3.sql','app/member-profile.tsx', 'app/member-profile.css', 'public/images/member-flags.svg', 'app/suivi/page.tsx', 'app/tracking.tsx', 'lib/tracking.ts', 'app/api/suivi/route.ts', 'app/api/admin/suivi/route.ts', 'app/page.tsx', 'app/layout.tsx', 'app/site.tsx', 'app/programme/page.tsx', 'app/equipe/page.tsx', 'app/equipe/[id]/page.tsx', 'app/actualites/page.tsx', 'app/actualites/[id]/page.tsx', 'app/adherer/page.tsx', 'app/admin/page.tsx', 'app/connexion/page.tsx', 'app/mentions/page.tsx', 'app/api/data/route.ts', 'app/api/admin/route.ts', 'app/api/applications/route.ts', 'app/api/login/route.ts', 'app/api/logout/route.ts', 'app/api/upload/route.ts', 'public/images/equipe-union-civique.webp', 'vercel.json'];
const missing = files.filter(file => !existsSync(file));
if (missing.length) {
  console.error('PROJET INCOMPLET : fichiers absents du dépôt :\n' + missing.join('\n'));
  process.exit(1);
}
console.log('Sources Vercel complètes : accueil, rubriques, administration, API et image présents.');
