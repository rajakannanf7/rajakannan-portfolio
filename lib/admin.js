'use client';

import {
  addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, setDoc, updateDoc,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './firebase';

export async function listAll(name, orderField = 'order') {
  const snap = await getDocs(query(collection(db, name), orderBy(orderField, 'asc')));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function saveDoc(name, id, data) {
  if (id) {
    await setDoc(doc(db, name, id), data, { merge: true });
    return id;
  }
  const created = await addDoc(collection(db, name), data);
  return created.id;
}

export async function removeDoc(name, id) {
  await deleteDoc(doc(db, name, id));
}

export async function patchDoc(name, id, data) {
  await updateDoc(doc(db, name, id), data);
}

// Reordering writes every changed row — fine at portfolio scale, and it means
// the public site can just orderBy('order') without any client-side sorting.
export async function persistOrder(name, rows) {
  await Promise.all(
    rows.map((r, i) => (r.order === i + 1 ? null : updateDoc(doc(db, name, r.id), { order: i + 1 })))
  );
}

export async function uploadImage(file, folder = 'uploads') {
  const clean = file.name.replace(/[^a-zA-Z0-9._-]/g, '-').toLowerCase();
  const path = `${folder}/${Date.now()}-${clean}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return { url, path };
}

export async function deleteImage(path) {
  if (!path) return;
  try {
    await deleteObject(ref(storage, path));
  } catch (err) {
    console.warn('[admin] could not delete stored file:', err.message);
  }
}

export function slugify(s) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}
