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
      console.log("[Focoman Auth] Posting idToken to /api/session...");
      const response = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      console.log("[Focoman Auth] /api/session response status:", response.status);
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
 * Initiates Google sign-in.
 * - On localhost: uses signInWithPopup to avoid browser cross-origin third-party storage partitioning blocks.
 * - On deployed production domains: uses same-tab signInWithRedirect for mobile and full-page redirect flow.
 */
export async function signInWithGoogle(forceRedirect = false): Promise<UserCredential | void> {
  const isLocalhost = typeof window !== "undefined" &&
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

  if (isLocalhost && !forceRedirect) {
    console.log("[Focoman Auth] Localhost detected. Using signInWithPopup to avoid cross-origin cookie partition block.");
    const credential = await signInWithPopup(auth, googleProvider);
    await syncServerSession(true);
    return credential;
  }

  console.log("[Focoman Auth] Production environment detected. Initiating same-tab signInWithRedirect...");
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
      console.log("[Focoman Auth] Checking getRedirectResult(auth)...");
      const credential = await getRedirectResult(auth);
      console.log("[Focoman Auth] getRedirectResult returned:", credential ? {
        uid: credential.user?.uid,
        email: credential.user?.email,
      } : "null (no pending redirect credential)");

      if (credential?.user) {
        console.log("[Focoman Auth] Syncing server session for user:", credential.user.email);
        await syncServerSession(true);
        return credential;
      }
      return null;
    } catch (error) {
      console.error("[Focoman Auth] Error processing redirect sign-in:", error);
      throw error;
    }
  })();

  return redirectHandlingPromise;
}

/**
 * Optional fallback popup sign-in if redirect is blocked.
 */
export async function signInWithGooglePopup(): Promise<UserCredential> {
  console.log("[Focoman Auth] Initiating signInWithPopup as fallback...");
  const credential = await signInWithPopup(auth, googleProvider);
  await syncServerSession(true);
  return credential;
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

