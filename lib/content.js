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

export async function getProjects() {
  return readCollection('projects', seed.projects);
}

export async function getFeaturedProjects() {
  const all = await getProjects();
  return all.filter((p) => p.featured && p.cover);
}

export async function getIndexProjects() {
  const all = await getProjects();
  return all.filter((p) => !p.featured || !p.cover);
}

export async function getProject(slug) {
  if (firebaseReady && db) {
    try {
      const direct = await getDoc(doc(db, 'projects', slug));
      if (direct.exists()) return { id: direct.id, ...direct.data() };
      const snap = await getDocs(query(collection(db, 'projects'), where('slug', '==', slug)));
      if (!snap.empty) return { id: snap.docs[0].id, ...snap.docs[0].data() };
    } catch (err) {
      console.warn('[content] project read fell back to seed:', err.message);
    }
  }
  return seed.projects.find((p) => p.slug === slug) || null;
}

export async function getPhotos() {
  return readCollection('photos', seed.photos);
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

export const expertise = seed.expertise;
export const experience = seed.experience;
export const clients = seed.clients;
