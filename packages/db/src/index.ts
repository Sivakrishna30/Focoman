/**
 * Server-Only Firestore Database Access Boundary
 * Privileged database mutations execute exclusively on the server.
 * Generic unrestricted CRUD is NEVER exposed to the browser client.
 */

export const IS_SERVER_ENVIRONMENT = typeof window === 'undefined';

if (!IS_SERVER_ENVIRONMENT) {
  throw new Error(
    '@focoman/db is a SERVER-ONLY module and must never be imported into browser bundles.'
  );
}

export interface FirestoreConfig {
  projectId?: string;
  clientEmail?: string;
  privateKey?: string;
}

export function getFirestoreServerInstance(config?: FirestoreConfig) {
  if (!IS_SERVER_ENVIRONMENT) {
    throw new Error('Cannot initialize Firestore Server Admin SDK on client side');
  }
  // Server-side Admin SDK initialization wrapper stub
  return {
    initialized: true,
    projectId: config?.projectId || process.env.FIREBASE_PROJECT_ID || 'focoman-dev'
  };
}
