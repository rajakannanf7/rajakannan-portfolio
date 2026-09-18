// Public project settings. None of these are secrets: the Firebase web config is
// sent to every visitor's browser, and the admin email / repo name are not
// credentials. Environment variables override them (e.g. on a staging project).
// The only secret, GITHUB_TOKEN, lives in Vercel env vars and is read server-side.
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyBG5-bSKYVPRKgmJHVximjuX1RqQ0MuC-g',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'rajakannan-portfolio.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'rajakannan-portfolio',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'rajakannan-portfolio.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '355587673319',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:355587673319:web:f5f27f06d749e7f3992642',
};

// Must match the isAdmin() list in firestore.rules.
export const adminEmails = (process.env.ADMIN_EMAILS || 'rajakannanf7@gmail.com')
  .split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);

export const mediaRepo = process.env.MEDIA_REPO || 'rajakannanf7/rajakannan-media';
export const mediaBranch = process.env.MEDIA_BRANCH || 'main';
