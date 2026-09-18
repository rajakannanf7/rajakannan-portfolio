'use client';

// Local demo backend for the admin: `NEXT_PUBLIC_ADMIN_DEMO=1 npm run dev`.
// Stores everything in this browser's localStorage, seeded from lib/fallback.js,
// so the editor can be tried before Firebase is connected. Uploads become
// in-memory blob URLs that last until the tab closes. Never used in production.
import * as seed from './fallback';

const KEY = 'rk-admin-demo-v1';

function fresh() {
  const strip = (arr, id) => arr.map((x) => ({ ...x, id: id(x) }));
  return {
    projects: strip(seed.projects, (x) => x.slug),
    shoots: strip(seed.shoots, (x) => x.slug),
    skills: strip(seed.skills, (x) => x.slug),
    labs: strip(seed.labs, (x) => x.id),
    settings: [{ id: 'site', ...seed.site }],
    enquiries: [],
  };
}
function read() {
  try { const v = JSON.parse(localStorage.getItem(KEY)); if (v) return v; } catch {}
  const v = fresh(); write(v); return v;
}
function write(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch {} }
const tick = () => new Promise((r) => setTimeout(r, 120));

export const demo = {
  async listAll(name) { await tick(); return [...(read()[name] || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)); },
  async getOne(name, id) { await tick(); return (read()[name] || []).find((x) => x.id === id) || null; },
  async count(name) { return (read()[name] || []).length; },
  async saveDoc(name, id, data) {
    await tick();
    const db = read(); const list = db[name] || (db[name] = []);
    const newId = id || Math.random().toString(36).slice(2, 10);
    const i = list.findIndex((x) => x.id === newId);
    const row = { ...data, id: newId };
    if (i >= 0) list[i] = row; else list.push(row);
    write(db); return newId;
  },
  async removeDoc(name, id) { const db = read(); db[name] = (db[name] || []).filter((x) => x.id !== id); write(db); },
  async patchDoc(name, id, data) { const db = read(); db[name] = (db[name] || []).map((x) => (x.id === id ? { ...x, ...data } : x)); write(db); },
  async upload(body, onProgress) {
    for (let p = 0.2; p <= 1; p += 0.2) { onProgress?.(p); await tick(); }
    return URL.createObjectURL(body);
  },
  reset() { write(fresh()); },
};
