import { mediaBranch, mediaRepo } from '../../../lib/config';

export const runtime = 'nodejs';

const TYPES = {
  webp: 'image/webp', jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', gif: 'image/gif',
  avif: 'image/avif', svg: 'image/svg+xml', mp4: 'video/mp4', webm: 'video/webm', mov: 'video/quicktime',
};

// Serves uploaded media from the GitHub media repo under this site's domain.
// Upload paths are unique and never overwritten, so responses are cached for a
// year at Vercel's edge and in browsers; GitHub is only hit on a cache miss.
// Works with a private media repo because the token stays on the server.
export async function GET(_request, { params }) {
  const repo = mediaRepo, branch = mediaBranch;
  const token = process.env.GITHUB_TOKEN;
  const parts = (params.path || []).filter((p) => p && p !== '..' && p !== '.');
  const ext = (parts[parts.length - 1] || '').split('.').pop().toLowerCase();
  if (!repo || !parts.length || !TYPES[ext]) return new Response('Not found', { status: 404 });

  const res = await fetch(
    `https://api.github.com/repos/${repo}/contents/${parts.map(encodeURIComponent).join('/')}?ref=${encodeURIComponent(branch)}`,
    {
      headers: {
        Accept: 'application/vnd.github.raw',
        'X-GitHub-Api-Version': '2022-11-28',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: 'no-store',
    }
  );
  if (!res.ok) return new Response('Not found', { status: 404, headers: { 'Cache-Control': 'public, max-age=60' } });

  return new Response(res.body, {
    headers: {
      'Content-Type': TYPES[ext],
      'Cache-Control': 'public, max-age=31536000, s-maxage=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
      ...(ext === 'svg' ? { 'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'" } : {}),
    },
  });
}
