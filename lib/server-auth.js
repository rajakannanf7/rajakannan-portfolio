import { createRemoteJWKSet, jwtVerify } from 'jose';
import { adminEmails, firebaseConfig } from './config';

// Verifies a Firebase Auth ID token without a service account: Firebase signs
// ID tokens with Google's public "securetoken" keys, so checking the signature,
// issuer and audience (the project id) is enough.
const JWKS = createRemoteJWKSet(
  new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com')
);

// Returns the admin's email, or throws with an HTTP-ish status on failure.
export async function requireAdmin(request) {
  const projectId = firebaseConfig.projectId;
  if (!projectId) throw Object.assign(new Error('Firebase is not configured on the server.'), { status: 500 });

  const header = request.headers.get('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) throw Object.assign(new Error('Not signed in.'), { status: 401 });

  let payload;
  try {
    ({ payload } = await jwtVerify(token, JWKS, {
      issuer: `https://securetoken.google.com/${projectId}`,
      audience: projectId,
    }));
  } catch {
    throw Object.assign(new Error('Session expired. Sign in again.'), { status: 401 });
  }

  const email = String(payload.email || '').toLowerCase();
  const allowed = adminEmails;
  // Firebase lets anyone with the public API key create an email/password
  // account, so "signed in" alone is not enough: require an allow-listed email.
  if (!allowed.length || !allowed.includes(email)) {
    throw Object.assign(new Error('This account is not an admin.'), { status: 403 });
  }
  return email;
}
