'use client';

import {
  addDoc, collection, deleteDoc, doc, getCountFromServer, getDoc, getDocs, orderBy, query, setDoc, updateDoc,
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './firebase';
import { demo } from './admin-demo';

// Dev-only local demo (see lib/admin-demo.js). Never active in a production build.
export const DEMO = process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_ADMIN_DEMO === '1';

export async function listAll(name, orderField = 'order') {
  if (DEMO) return demo.listAll(name);
  const snap = await getDocs(query(collection(db, name), orderBy(orderField, 'asc')));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getOne(name, id) {
  if (DEMO) return demo.getOne(name, id);
  const snap = await getDoc(doc(db, name, id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function saveDoc(name, id, data) {
  const { id: _drop, ...clean } = data;
  if (DEMO) return demo.saveDoc(name, id, clean);
  if (id) {
    await setDoc(doc(db, name, id), clean);
    return id;
  }
  const created = await addDoc(collection(db, name), clean);
  return created.id;
}

export async function removeDoc(name, id) {
  if (DEMO) return demo.removeDoc(name, id);
  await deleteDoc(doc(db, name, id));
}

export async function patchDoc(name, id, data) {
  if (DEMO) return demo.patchDoc(name, id, data);
  await updateDoc(doc(db, name, id), data);
}

// Reordering writes every changed row — fine at portfolio scale, and it means
// the public site can just orderBy('order') without any client-side sorting.
export async function persistOrder(name, rows) {
  if (DEMO) return Promise.all(rows.map((r, i) => demo.patchDoc(name, r.id, { order: i + 1 })));
  await Promise.all(
    rows.map((r, i) => (r.order === i + 1 ? null : updateDoc(doc(db, name, r.id), { order: i + 1 })))
  );
}

// Resize to maxW on the long edge and re-encode as WebP in the browser, so a
// 30 MB camera JPEG lands in Storage as a ~300 KB web image. GIFs and SVGs pass through.
export async function compressImage(file, maxW = 2400, quality = 0.84) {
  if (!/^image\/(jpeg|png|webp|heic|heif|avif|bmp)$/i.test(file.type)) return file;
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, maxW / Math.max(bmp.width, bmp.height));
    const w = Math.round(bmp.width * scale), h = Math.round(bmp.height * scale);
    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    canvas.getContext('2d').drawImage(bmp, 0, 0, w, h);
    bmp.close?.();
    const blob = await new Promise((r) => canvas.toBlob(r, 'image/webp', quality));
    if (!blob || blob.size >= file.size) return file; // already small; keep the original
    return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.webp', { type: 'image/webp' });
  } catch {
    return file; // browser can't decode it (e.g. HEIC on Chrome): upload as-is
  }
}

// Upload an image (compressed first) or a video. onProgress receives 0..1.
export async function uploadMedia(file, folder = 'uploads', onProgress) {
  const isVideo = file.type.startsWith('video/');
  const isImage = file.type.startsWith('image/');
  if (!isVideo && !isImage) throw new Error('Only images and videos can be uploaded.');
  const body = isImage ? await compressImage(file) : file;
  const limit = isVideo ? 100 : 8;
  if (body.size > limit * 1024 * 1024) {
    throw new Error(isVideo ? 'Videos must be under 100 MB. Put longer films on YouTube or Vimeo and paste the link.' : 'Image is still over 8 MB after compression.');
  }
  if (DEMO) return { url: await demo.upload(body, onProgress), path: '', type: isVideo ? 'video' : 'image' };
  const clean = body.name.replace(/[^a-zA-Z0-9._-]/g, '-').toLowerCase();
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 7)}-${clean}`;
  const task = uploadBytesResumable(ref(storage, path), body, { contentType: body.type, cacheControl: 'public,max-age=31536000,immutable' });
  await new Promise((res, rej) => task.on('state_changed', (s) => onProgress?.(s.bytesTransferred / s.totalBytes), rej, res));
  const url = await getDownloadURL(task.snapshot.ref);
  return { url, path, type: isVideo ? 'video' : 'image' };
}

export async function deleteMedia(path) {
  if (!path || DEMO) return;
  try {
    await deleteObject(ref(storage, path));
  } catch (err) {
    console.warn('[admin] could not delete stored file:', err.message);
  }
}

export function slugify(s = '') {
  return s
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export async function countDocs(name) {
  if (DEMO) return demo.count(name);
  return (await getCountFromServer(collection(db, name))).data().count;
}
