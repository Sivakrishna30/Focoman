"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { User } from "firebase/auth";
import { Studio } from "@focoman/types";
import { subscribeToTokenChange, getCurrentUserIdToken, signOutUser, syncServerSession } from "@/lib/firebaseAuth";

export interface StudioWorkspaceContextValue {
  studio: Studio;
  user: User | null;
  idToken: string | null;
  authLoading: boolean;
  getIdToken: (forceRefresh?: boolean) => Promise<string | null>;
  signOut: () => Promise<void>;
}

const StudioWorkspaceContext = createContext<StudioWorkspaceContextValue | null>(null);

export function StudioWorkspaceProvider({
  studio,
  children,
}: {
  studio: Studio;
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToTokenChange(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const token = await currentUser.getIdToken();
          setIdToken(token);
          void syncServerSession(false);
        } catch (err) {
          console.error("[StudioWorkspaceProvider] Failed to get fresh token:", err);
          setIdToken(null);
        }
      } else {
        setUser(null);
        setIdToken(null);
      }
      setAuthLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const getIdToken = useCallback(async (forceRefresh = false): Promise<string | null> => {
    return await getCurrentUserIdToken(forceRefresh);
  }, []);

  const handleSignOut = useCallback(async () => {
    await signOutUser();
    setUser(null);
    setIdToken(null);
  }, []);

  return (
    <StudioWorkspaceContext.Provider
      value={{
        studio,
        user,
        idToken,
        authLoading,
        getIdToken,
        signOut: handleSignOut,
      }}
    >
      {children}
    </StudioWorkspaceContext.Provider>
  );
}

export function useStudioWorkspace(): StudioWorkspaceContextValue {
  const context = useContext(StudioWorkspaceContext);
  if (!context) {
    throw new Error("useStudioWorkspace must be used within a StudioWorkspaceProvider");
  }
  return context;
}
