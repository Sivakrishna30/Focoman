"use client";

import { useEffect } from "react";
import { subscribeToTokenChange, syncServerSession } from "@/lib/firebaseAuth";

/**
 * SessionSyncProvider
 *
 * Ensures that whenever Firebase Auth has an active client-side user
 * (e.g., restored from IndexedDB on page load or when ID tokens are refreshed),
 * the server-side HTTP `__session` cookie is automatically synced.
 *
 * This prevents unexpected 404s on server-rendered studio routes without requiring
 * manual re-authentication.
 */
export function SessionSyncProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const unsubscribe = subscribeToTokenChange(async (user) => {
      if (user) {
        await syncServerSession();
      }
    });
    return () => unsubscribe();
  }, []);

  return <>{children}</>;
}
