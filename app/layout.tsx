import type { Metadata } from 'next';
import './globals.css';
import './civic.css';
export const metadata: Metadata = {title:'Union Civique — Los Santos',description:'Liberté. Responsabilité. Avenir. Découvrez le mouvement républicain de Los Santos, son projet et ses représentants. Univers GTA RP.',icons:{icon:'/favicon.svg'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="fr"><body>{children}</body></html>}
