'use client';

import {
  addDoc, collection, deleteDoc, doc, getCountFromServer, getDoc, getDocs, orderBy, query, setDoc, updateDoc,
} from 'firebase/firestore';
import { auth, db } from './firebase';
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

// Uploads go through /api/upload (server checks the admin login, then commits the
// file to the GitHub media repo). Vercel caps request bodies at 4.5 MB, so images
// are resized and re-encoded as WebP in the browser until they fit under 4 MB.
export const UPLOAD_LIMIT = 4 * 1024 * 1024;
export const UPLOAD_CONCURRENCY = 2; // each upload is a git commit; keep it gentle

async function encode(bmp, maxW, quality) {
  const scale = Math.min(1, maxW / Math.max(bmp.width, bmp.height));
  const w = Math.round(bmp.width * scale), h = Math.round(bmp.height * scale);
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  canvas.getContext('2d').drawImage(bmp, 0, 0, w, h);
  return new Promise((r) => canvas.toBlob(r, 'image/webp', quality));
}

export async function compressImage(file) {
  if (!/^image\/(jpeg|png|webp|heic|heif|avif|bmp)$/i.test(file.type)) return file;
  let bmp;
  try { bmp = await createImageBitmap(file); } catch { return file; } // e.g. HEIC on Chrome
  try {
    // Try progressively smaller/lighter encodes until it fits comfortably.
    for (const [maxW, q] of [[2400, 0.84], [2000, 0.8], [1600, 0.76], [1280, 0.72]]) {
      const blob = await encode(bmp, maxW, q);
      if (blob && blob.size < UPLOAD_LIMIT * 0.9) {
        if (blob.size >= file.size && file.size < UPLOAD_LIMIT * 0.9 && file.type === 'image/webp') return file;
        return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.webp', { type: 'image/webp' });
      }
    }
    return file;
  } finally {
    bmp.close?.();
  }
}

// Upload an image (compressed first) or a short video. onProgress receives 0..1.
export async function uploadMedia(file, folder = 'uploads', onProgress) {
  const isVideo = file.type.startsWith('video/');
  const isImage = file.type.startsWith('image/');
  if (!isVideo && !isImage) throw new Error('Only images and videos can be uploaded.');
  const body = isImage ? await compressImage(file) : file;
  if (body.size > UPLOAD_LIMIT) {
    throw new Error(isVideo
      ? 'Videos must be under 4 MB. Put longer films on YouTube or Vimeo and paste the link instead.'
      : 'This image is too large even after compression. Try exporting it smaller.');
  }
  if (DEMO) return { url: await demo.upload(body, onProgress), path: '', type: isVideo ? 'video' : 'image' };

  const user = auth?.currentUser;
  if (!user) throw new Error('Signed out. Sign in again to upload.');
  const idToken = await user.getIdToken();
  const form = new FormData();
  form.append('file', body, body.name);
  form.append('folder', folder);

  // XHR rather than fetch so we get upload progress events.
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/upload');
    xhr.setRequestHeader('Authorization', `Bearer ${idToken}`);
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress?.(Math.min(0.95, e.loaded / e.total));
    xhr.onerror = () => reject(new Error('Network error during upload.'));
    xhr.onload = () => {
      let data = {};
      try { data = JSON.parse(xhr.responseText); } catch {}
      if (xhr.status >= 200 && xhr.status < 300 && data.url) { onProgress?.(1); resolve(data); }
      else reject(new Error(data.error || `Upload failed (${xhr.status}).`));
    };
    xhr.send(form);
  });
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
