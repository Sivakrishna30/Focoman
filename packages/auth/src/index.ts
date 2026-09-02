import 'server-only';
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

/**
 * Focoman Firebase Authentication & Authorization Helpers
 * Server-only verification and claim validation
 */

export type UserRole = 'STUDIO_OWNER' | 'STUDIO_MEMBER' | 'CUSTOMER_GUEST';

export interface AuthSession {
  uid: string;
  email?: string;
  role: UserRole;
  studioId: string;
  memberId?: string;
}

function parsePrivateKey(rawKey: string | undefined): string | undefined {
  if (!rawKey) return undefined;
  let key = rawKey.trim();
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
    key = key.slice(1, -1).trim();
  }
  return key.replace(/\\n/g, '\n').replace(/\\\\n/g, '\n');
}

function getFirebaseAuthInstance() {
  const existingApps = getApps();
  if (existingApps.length > 0) {
    return getAuth(existingApps[0]);
  }

  const projectId =
    process.env.FIREBASE_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    process.env.GOOGLE_CLOUD_PROJECT;

  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = parsePrivateKey(process.env.FIREBASE_PRIVATE_KEY);

  if (clientEmail && privateKey && projectId) {
    const app = initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
      projectId,
    });
    return getAuth(app);
  }

  if (projectId) {
    const app = initializeApp({ projectId });
    return getAuth(app);
  }

  return null;
}

/**
 * Verifies a Firebase Auth ID Token on the server and extracts the typed user session.
 */
export async function verifyIdToken(idToken: string): Promise<AuthSession | null> {
  if (!idToken || typeof idToken !== 'string') return null;

  try {
    const auth = getFirebaseAuthInstance();
    if (auth) {
      const decoded = await auth.verifyIdToken(idToken);
      const role = (decoded.role as UserRole) || 'STUDIO_MEMBER';
      const studioId = (decoded.studioId as string) || '';
      const memberId = (decoded.memberId as string) || undefined;

      return {
        uid: decoded.uid,
        email: decoded.email,
        role,
        studioId,
        memberId,
      };
    }
  } catch (err) {
    console.error('[Focoman Auth] ID Token verification failed:', err);
  }

  return null;
}

// ============================================================================
// ROLE & PERMISSION ENFORCEMENT RULES
// ============================================================================

export function canAccessStudioBusinessData(session: AuthSession, targetStudioId: string): boolean {
  if (!session || !targetStudioId) return false;
  if (session.studioId.toLowerCase() !== targetStudioId.toLowerCase()) return false;
  return session.role === 'STUDIO_OWNER';
}

export function canAccessAssignedOrder(
  session: AuthSession,
  targetStudioId: string,
  assignedMemberId?: string
): boolean {
  if (!session || !targetStudioId) return false;
  if (session.studioId.toLowerCase() !== targetStudioId.toLowerCase()) return false;
  if (session.role === 'STUDIO_OWNER') return true;
  if (session.role === 'STUDIO_MEMBER' && session.memberId && session.memberId === assignedMemberId) {
    return true;
  }
  return false;
}
