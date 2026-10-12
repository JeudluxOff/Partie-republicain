'use client';
export default function ErrorPage({reset}:{reset:()=>void}) {
  return <main className="wrap section"><h1>Le site rencontre un problème.</h1><p>Réessayez dans quelques instants.</p><button className="button" onClick={reset}>Réessayer</button><p><a href="/">Revenir à l’accueil</a></p></main>;
}
