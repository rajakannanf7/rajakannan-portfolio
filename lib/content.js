import { collection, doc, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db, firebaseReady } from './firebase';
import * as seed from './fallback';

// Every getter degrades to the seed content: no Firebase env, empty collection,
// or a failed read all render the same finished site. Never throws.

async function readCollection(name, seedData, orderField = 'order') {
  if (!firebaseReady || !db) return seedData;
  try {
    const snap = await getDocs(query(collection(db, name), orderBy(orderField, 'asc')));
    if (snap.empty) return seedData;
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.warn(`[content] ${name} fell back to seed:`, err.message);
    return seedData;
  }
}

async function readBySlug(name, slug, seedData) {
  if (firebaseReady && db) {
    try {
      const direct = await getDoc(doc(db, name, slug));
      if (direct.exists()) return { id: direct.id, ...direct.data() };
      const snap = await getDocs(query(collection(db, name), where('slug', '==', slug)));
      if (!snap.empty) return { id: snap.docs[0].id, ...snap.docs[0].data() };
      // Collection has content but not this slug: a real 404, don't fall back.
      const any = await getDocs(query(collection(db, name)));
      if (!any.empty) return null;
    } catch (err) {
      console.warn(`[content] ${name}/${slug} fell back to seed:`, err.message);
    }
  }
  return seedData.find((x) => x.slug === slug) || null;
}

const live = (rows) => rows.filter((r) => r.published !== false);

export async function getProjects() {
  return live(await readCollection('projects', seed.projects));
}
export async function getFeaturedProjects() {
  return (await getProjects()).filter((p) => p.featured && p.cover);
}
export async function getProject(slug) {
  const p = await readBySlug('projects', slug, seed.projects);
  return p && p.published !== false ? p : null;
}

export async function getShoots() {
  return live(await readCollection('shoots', seed.shoots));
}
export async function getShoot(slug) {
  const s = await readBySlug('shoots', slug, seed.shoots);
  return s && s.published !== false ? s : null;
}

export async function getSkills() {
  return readCollection('skills', seed.skills);
}
export async function getSkill(slug) {
  return readBySlug('skills', slug, seed.skills);
}

export async function getLabs() {
  return readCollection('labs', seed.labs);
}

export async function getSite() {
  if (!firebaseReady || !db) return seed.site;
  try {
    const snap = await getDoc(doc(db, 'settings', 'site'));
    return snap.exists() ? { ...seed.site, ...snap.data() } : seed.site;
  } catch {
    return seed.site;
  }
}

// Neighbour for the "next project" link at the bottom of a case study.
export function nextOf(list, current) {
  const i = list.findIndex((x) => x.slug === current.slug);
  return list.length > 1 ? list[(i + 1) % list.length] : null;
}
