import type { Metadata } from 'next';
import './globals.css';
import './civic.css';
import './member-profile.css';
import './extensions.css';
export const metadata: Metadata = {title:'San Andreas Republican Party — Los Santos',description:'Liberté. Responsabilité. Avenir. Découvrez le mouvement républicain de Los Santos, son projet et ses représentants.',icons:{icon:'/favicon.png'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="fr"><body>{children}</body></html>}
