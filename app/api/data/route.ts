import { getContent, json } from '../../../lib/server';
import { session } from '../../../lib/auth';
import { publicContent } from '../../../lib/public-content';
export async function GET(req: Request) { try {
    const { content, revision } = await getContent();
    const user = await session();
    const edit = new URL(req.url).searchParams.get('admin') === '1' && user && user.role !== 'recrutement';
    return json({ content: edit ? content : publicContent(content), revision, isAdmin: !!user, role: user?.role || '', username: user?.username || '' });
}
catch {
    return json({ error: 'Le contenu est momentanément indisponible.' }, 503);
} }
