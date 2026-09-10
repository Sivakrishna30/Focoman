"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { User } from "firebase/auth";
import { Studio } from "@focoman/types";
import { subscribeToAuthState, getCurrentUserIdToken, signOutUser } from "@/lib/firebaseAuth";
import { isDemoStudio, getDemoActiveUser, subscribeToDemoStore } from "@/lib/demoStore";

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
  const isDemo = isDemoStudio(studio.id);
  const [user, setUser] = useState<User | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthState(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const token = await currentUser.getIdToken();
          setIdToken(token);
        } catch (err) {
          console.error("[StudioWorkspaceProvider] Failed to get initial token:", err);
          setIdToken(null);
        }
      } else if (isDemo) {
        const demoUser = getDemoActiveUser();
        if (demoUser) {
          setUser({
            uid: demoUser.uid,
            displayName: demoUser.name,
            email: demoUser.email,
          } as unknown as User);
          setIdToken("demo-token");
        } else {
          setUser(null);
          setIdToken(null);
        }
      } else {
        setUser(null);
        setIdToken(null);
      }
      setAuthLoading(false);
    });

    const unsubDemo = isDemo
      ? subscribeToDemoStore(() => {
          const demoUser = getDemoActiveUser();
          if (demoUser) {
            setUser({
              uid: demoUser.uid,
              displayName: demoUser.name,
              email: demoUser.email,
            } as unknown as User);
            setIdToken("demo-token");
          }
        })
      : () => {};

    return () => {
      unsubscribe();
      unsubDemo();
    };
  }, [isDemo]);

  const getIdToken = useCallback(async (forceRefresh = false): Promise<string | null> => {
    if (isDemo) return "demo-token";
    return await getCurrentUserIdToken(forceRefresh);
  }, [isDemo]);

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
