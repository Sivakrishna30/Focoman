import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
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

export async function signInWithGoogle(): Promise<UserCredential> {
  const credential = await signInWithPopup(auth, googleProvider);
  try {
    const idToken = await credential.user.getIdToken(true);
    const response = await fetch('/api/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });
    if (!response.ok) {
      throw new Error('Unable to establish a secure server session. Please try signing in again.');
    }
    return credential;
  } catch (error) {
    await signOut(auth);
    throw error;
  }
}

export async function loginWithEmail(email: string, password: string): Promise<UserCredential> {
  return await signInWithEmailAndPassword(auth, email, password);
}

export async function registerWithEmail(email: string, password: string): Promise<UserCredential> {
  return await createUserWithEmailAndPassword(auth, email, password);
}

export async function signOutUser(): Promise<void> {
  const response = await fetch('/api/session', { method: 'DELETE' });
  if (!response.ok) {
    throw new Error('Unable to clear the secure server session. Please try signing out again.');
  }
  await signOut(auth);
}

export function subscribeToAuthState(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export async function getCurrentUserIdToken(forceRefresh = false): Promise<string | null> {
  if (!auth.currentUser) return null;
  return await auth.currentUser.getIdToken(forceRefresh);
}
