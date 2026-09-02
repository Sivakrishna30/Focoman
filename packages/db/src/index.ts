import 'server-only';

/**
 * Server-Only Firestore Database Access Boundary
 * Privileged database access executes exclusively on the server.
 * Generic unrestricted CRUD is NEVER exposed to the client browser.
 */

export const IS_SERVER_ENVIRONMENT = typeof window === 'undefined';

if (!IS_SERVER_ENVIRONMENT) {
  throw new Error(
    '@focoman/db is a SERVER-ONLY module and must never be imported into browser client bundles.'
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

  const projectId = config?.projectId || process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  return {
    initialized: true,
    projectId,
    collections: {
      studios: 'studios',
      members: 'members',
      customers: 'customers',
      orders: 'orders',
      tasks: 'tasks'
    }
  };
}
