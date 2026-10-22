import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import './civic.css';
import './member-profile.css';
import './extensions.css';
import './refine.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const metadata: Metadata = {
  title: 'San Andreas Republican Party — Los Santos',
  description: 'Liberté. Responsabilité. Avenir. Découvrez le mouvement républicain de Los Santos, son projet et ses représentants.',
  icons: { icon: '/favicon.png' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
