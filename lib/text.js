// Tiny helpers shared by server and client components.

// "*one craft*" → [{t:'one craft', it:true}] so admins can mark the serif-italic accent
// in plain text fields without writing HTML.
export function accentParts(str = '') {
  return String(str)
    .split(/(\*[^*]+\*)/g)
    .filter(Boolean)
    .map((t) => (t.startsWith('*') && t.endsWith('*') ? { t: t.slice(1, -1), it: true } : { t, it: false }));
}

export const paragraphs = (str = '') =>
  (Array.isArray(str) ? str : String(str).split(/\n\s*\n/)).map((s) => s.trim()).filter(Boolean);

export const pad = (n) => String(n).padStart(2, '0');

// YouTube / Vimeo page URL → embed URL; anything else is treated as a direct video file.
export function videoEmbed(url = '') {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return { kind: 'iframe', src: `https://www.youtube-nocookie.com/embed/${yt[1]}?rel=0` };
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) return { kind: 'iframe', src: `https://player.vimeo.com/video/${vm[1]}?dnt=1` };
  return url ? { kind: 'file', src: url } : null;
}
