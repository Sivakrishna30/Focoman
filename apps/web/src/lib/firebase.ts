import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";

/**
 * Firebase Client SDK Initialization for Focoman
 * Project: focoman (https://focoman.firebaseapp.com)
 */

function getAuthDomain(): string {
  const canonicalDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "focoman.firebaseapp.com";
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    // Only use custom host if it's explicitly verified in Google OAuth client, never for dynamic preview domains (*.run.app) or localhost
    if (
      hostname &&
      hostname !== "localhost" &&
      hostname !== "127.0.0.1" &&
      !hostname.includes(".run.app") &&
      !hostname.includes("aistudio") &&
      (hostname === "focoman.web.app" || hostname === "focoman.com" || hostname === "www.focoman.com")
    ) {
      return window.location.host;
    }
  }
  return canonicalDomain;
}

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAukfeW5FnsojfxV6KxF2Fe1piRBE6uGlA",
  authDomain: getAuthDomain(),
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "focoman",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "focoman.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "959249421269",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:959249421269:web:92f562545232bde996e35c",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-HW2HJV3PXR",
};

// Initialize Firebase App singleton
export const firebaseApp: FirebaseApp =
  getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth: Auth = getAuth(firebaseApp);

// Initialize Firestore Client SDK
export const db: Firestore = getFirestore(firebaseApp);

// Initialize Analytics safely on client only
let analyticsInstance: Analytics | null = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analyticsInstance = getAnalytics(firebaseApp);
    }
  }).catch(() => {
    // Graceful fallback in environments where analytics is not supported
  });
}

export const getFirebaseAnalytics = () => analyticsInstance;
