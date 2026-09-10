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
  return await signInWithPopup(auth, googleProvider);
}

export async function loginWithEmail(email: string, password: string): Promise<UserCredential> {
  return await signInWithEmailAndPassword(auth, email, password);
}

export async function registerWithEmail(email: string, password: string): Promise<UserCredential> {
  return await createUserWithEmailAndPassword(auth, email, password);
}

export async function signOutUser(): Promise<void> {
  return await signOut(auth);
}

export function subscribeToAuthState(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export async function getCurrentUserIdToken(forceRefresh = false): Promise<string | null> {
  if (!auth.currentUser) return null;
  return await auth.currentUser.getIdToken(forceRefresh);
}
