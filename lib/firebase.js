import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

import { firebaseConfig as config } from './config';

// The site must render without Firebase configured — the public pages fall back
// to lib/fallback.js so a fresh clone works before you touch the console.
export const firebaseReady = Boolean(config.apiKey && config.projectId);

let app = null;
if (firebaseReady) {
  app = getApps().length ? getApp() : initializeApp(config);
}

export const db = app ? getFirestore(app) : null;
export const auth = app ? getAuth(app) : null;
export default app;
