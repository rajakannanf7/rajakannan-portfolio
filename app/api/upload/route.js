import { requireAdmin } from '../../../lib/server-auth';
import { mediaBranch, mediaRepo } from '../../../lib/config';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Vercel caps a function request body at 4.5 MB; stay under it with headroom.
const MAX_BYTES = 4 * 1024 * 1024;
const TYPES = /^(image\/(webp|jpeg|png|gif|avif|svg\+xml)|video\/(mp4|webm|quicktime))$/;

const json = (body, status = 200) => Response.json(body, { status });

// POST multipart { file, folder } with "Authorization: Bearer <Firebase ID token>".
// Commits the file to the media repo and returns its public /media URL.
export async function POST(request) {
  try {
    await requireAdmin(request);
  } catch (e) {
    return json({ error: e.message }, e.status || 401);
  }

  const repo = mediaRepo, branch = mediaBranch;
  const token = process.env.GITHUB_TOKEN;
  if (!repo || !token) return json({ error: 'Media storage is not configured (add GITHUB_TOKEN in Vercel).' }, 500);

  let file, folder;
  try {
    const form = await request.formData();
    file = form.get('file');
    folder = String(form.get('folder') || 'uploads');
  } catch {
    return json({ error: 'Upload was not a valid form.' }, 400);
  }
  if (!file || typeof file === 'string') return json({ error: 'No file received.' }, 400);
  if (!TYPES.test(file.type)) return json({ error: `File type ${file.type || 'unknown'} is not allowed.` }, 415);
  if (file.size > MAX_BYTES) {
    return json({ error: 'Files must be under 4 MB here. For longer videos, paste a YouTube or Vimeo link instead.' }, 413);
  }

  const safeFolder = folder.replace(/[^a-z0-9/-]/gi, '').replace(/^\/+|\/+$/g, '').slice(0, 40) || 'uploads';
  const safeName = (file.name || 'file').toLowerCase().replace(/[^a-z0-9._-]/g, '-').replace(/-+/g, '-').slice(-80);
  const stamp = new Date().toISOString().slice(0, 7); // 2026-09
  const path = `${safeFolder}/${stamp}/${Date.now()}-${Math.random().toString(36).slice(2, 7)}-${safeName}`;
  const content = Buffer.from(await file.arrayBuffer()).toString('base64');

  const url = `https://api.github.com/repos/${repo}/contents/${path.split('/').map(encodeURIComponent).join('/')}`;
  const init = {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message: `Upload ${path}`, content, branch }),
  };

  // Each upload is its own commit on the branch head. Parallel uploads can race
  // (409 conflict); a short randomised retry resolves it.
  for (let attempt = 0; attempt < 6; attempt++) {
    const res = await fetch(url, init);
    if (res.ok) {
      const type = file.type.startsWith('video/') ? 'video' : 'image';
      return json({ url: `/media/${path}`, path, type });
    }
    if (res.status === 409 || res.status === 422 || res.status >= 500) {
      await new Promise((r) => setTimeout(r, 300 + Math.random() * 700 * (attempt + 1)));
      continue;
    }
    const detail = await res.json().catch(() => ({}));
    const hint = res.status === 401 || res.status === 403 || res.status === 404
      ? ' Check GITHUB_TOKEN has Contents: read & write on the media repo.' : '';
    return json({ error: `GitHub rejected the upload (${res.status}: ${detail.message || 'unknown'}).${hint}` }, 502);
  }
  return json({ error: 'GitHub was busy. Try the upload again.' }, 503);
}
