// Presentation of legacy templates; stored records and audit snapshots stay intact.
export function documentDisplay(text: string) {
    return text
        .replace(/Document de jeu de rôle\.\s*/g, '')
        .replace(/Document de jeu de rôle — procédure adaptée au serveur\./g, 'Secrétariat général — Registre gouvernemental.')
        .replace(/\s+RP\b(?![-_])/g, '');
}
