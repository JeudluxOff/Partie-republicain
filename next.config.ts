import type { NextConfig } from 'next';

// Politique de contenu appliquée en production uniquement (le mode dev de Next a besoin d'eval).
// Les scripts et styles inline restent autorisés : Next.js en injecte pour l'hydratation.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ');

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
  ...(process.env.NODE_ENV === 'production' ? [{ key: 'Content-Security-Policy', value: csp }] : []),
];

const config: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      { source: '/images/:path*', headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' }] },
    ];
  },
  // Anciens chemins PNG (3,7 Mo et 2,2 Mo) remplacés par des WebP de moins de 200 Ko.
  async redirects() {
    return [
      { source: '/images/equipe-union-civique.png', destination: '/images/equipe-union-civique.webp', permanent: true },
      { source: '/images/affiches-union-civique.png', destination: '/images/affiches-union-civique.webp', permanent: true },
    ];
  },
};

export default config;
