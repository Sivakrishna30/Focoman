import 'server-only';
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getAuth, DecodedIdToken } from 'firebase-admin/auth';
import { getMembershipByUidAndStudio } from '@focoman/db';
import { StudioMembership } from '@focoman/types';

/**
 * Server-Side Authorization Utilities — CHG-010
 * Provides identity verification and studio membership enforcement
 * for all mutating Server Actions.
 *
 * Pattern:
 *   const decoded = await requireVerifiedUser(idToken);
 *   const membership = await requireStudioMember(decoded.uid, studioId);
 */

function parsePrivateKey(rawKey: string | undefined): string | undefined {
  if (!rawKey) return undefined;
  let key = rawKey.trim();
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
    key = key.slice(1, -1).trim();
  }
  return key.replace(/\\n/g, '\n').replace(/\\\\n/g, '\n');
}

function getAdminAuthInstance() {
  const projectId =
    process.env.FIREBASE_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    process.env.GOOGLE_CLOUD_PROJECT;

  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = parsePrivateKey(process.env.FIREBASE_PRIVATE_KEY);

  const emulatorHost = process.env.FIRESTORE_EMULATOR_HOST;

  const existingApps = getApps();
  if (existingApps.length > 0) {
    return getAuth(existingApps[0]);
  }

  if (clientEmail && privateKey && projectId) {
    const app = initializeApp(
      { credential: cert({ projectId, clientEmail, privateKey }), projectId },
      'auth-instance'
    );
    return getAuth(app);
  }

  if (emulatorHost && projectId) {
    const app = initializeApp({ projectId }, 'auth-instance');
    return getAuth(app);
  }

  throw new Error(
    '[Focoman Auth] Firebase Admin credentials are not configured. ' +
    'Cannot verify identity tokens without valid server credentials.'
  );
}

/**
 * Verifies a Firebase ID token and returns the decoded token payload.
 * Throws an error with a user-safe message if the token is missing or invalid.
 */
export async function requireVerifiedUser(idToken: string | undefined): Promise<DecodedIdToken> {
  if (!idToken || idToken.trim().length === 0) {
    throw new Error('Authentication required. No identity token provided.');
  }

  try {
    const adminAuth = getAdminAuthInstance();
    const decoded = await adminAuth.verifyIdToken(idToken);
    return decoded;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Token verification failed.';
    throw new Error(`Authentication failed: ${message}`);
  }
}

/**
 * Verifies that the authenticated user (by UID) is an ACTIVE member or owner
 * of the specified studio. Throws if no active membership record exists.
 *
 * @param uid - The Firebase UID from `requireVerifiedUser`.
 * @param studioId - The studio slug/ID to check membership against.
 * @param requiredRole - Optional: enforce a specific role (e.g., 'STUDIO_OWNER').
 */
export async function requireStudioMember(
  uid: string,
  studioId: string,
  requiredRole?: string
): Promise<StudioMembership> {
  const membership = await getMembershipByUidAndStudio(uid, studioId);

  if (!membership) {
    throw new Error(
      `Authorization denied: You are not an active member of studio "${studioId}".`
    );
  }

  if (requiredRole && membership.role !== requiredRole) {
    throw new Error(
      `Authorization denied: This action requires the "${requiredRole}" role. ` +
      `Your current role in studio "${studioId}" is "${membership.role}".`
    );
  }

  return membership;
}
