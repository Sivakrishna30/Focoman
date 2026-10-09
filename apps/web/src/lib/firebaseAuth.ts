import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  onIdTokenChanged,
  User,
  UserCredential,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "firebase/auth";
import { auth } from "./firebase";

/**
 * Client-side Firebase Authentication helper functions
 */

const googleProvider = new GoogleAuthProvider();

let inFlightSync: Promise<boolean> | null = null;
let lastSyncedToken: string | null = null;
let redirectHandlingPromise: Promise<UserCredential | null> | null = null;

/**
 * Synchronizes client-side Firebase Auth credentials with the server-side
 * HTTP session cookie (`__session`).
 *
 * Idempotent: Deduplicates simultaneous in-flight requests and avoids
 * redundant calls if the token has not changed.
 */
export async function syncServerSession(force = false): Promise<boolean> {
  if (typeof window === "undefined") return false;
  if (!auth.currentUser) {
    try {
      await fetch("/api/session", { method: "DELETE" });
    } catch {
      // Ignore background delete errors
    }
    lastSyncedToken = null;
    return false;
  }

  if (inFlightSync) return inFlightSync;

  inFlightSync = (async () => {
    try {
      const idToken = await auth.currentUser!.getIdToken(force);
      if (!force && lastSyncedToken === idToken) {
        return true;
      }
      const response = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      if (response.ok) {
        lastSyncedToken = idToken;
        return true;
      }
      return false;
    } catch (error) {
      console.error("[Focoman Auth] Failed to sync session cookie with server:", error);
      return false;
    } finally {
      inFlightSync = null;
    }
  })();

  return inFlightSync;
}

/**
 * Initiates Google sign-in via same-tab redirect.
 */
export async function signInWithGoogle(): Promise<void> {
  await signInWithRedirect(auth, googleProvider);
}

/**
 * Handles incoming redirect sign-in results from Google OAuth.
 * Safe to call on multiple component mounts: memoizes in-flight execution.
 */
export async function handleRedirectAuth(): Promise<UserCredential | null> {
  if (typeof window === "undefined") return null;
  if (redirectHandlingPromise) return redirectHandlingPromise;

  redirectHandlingPromise = (async () => {
    try {
      const credential = await getRedirectResult(auth);
      if (credential?.user) {
        const idToken = await credential.user.getIdToken(true);
        const response = await fetch('/api/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken }),
        });
        if (response.ok) {
          lastSyncedToken = idToken;
        }
        return credential;
      }
      return null;
    } catch (error) {
      console.error("[Focoman Auth] Failed to process redirect sign-in:", error);
      throw error;
    }
  })();

  return redirectHandlingPromise;
}

export async function loginWithEmail(email: string, password: string): Promise<UserCredential> {
  return await signInWithEmailAndPassword(auth, email, password);
}

export async function registerWithEmail(email: string, password: string): Promise<UserCredential> {
  return await createUserWithEmailAndPassword(auth, email, password);
}

export async function signOutUser(): Promise<void> {
  lastSyncedToken = null;
  const response = await fetch('/api/session', { method: 'DELETE' });
  if (!response.ok) {
    throw new Error('Unable to clear the secure server session. Please try signing out again.');
  }
  await signOut(auth);
}

export function subscribeToAuthState(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export function subscribeToTokenChange(callback: (user: User | null) => void) {
  return onIdTokenChanged(auth, callback);
}

export async function getCurrentUserIdToken(forceRefresh = false): Promise<string | null> {
  if (!auth.currentUser) return null;
  return await auth.currentUser.getIdToken(forceRefresh);
}

