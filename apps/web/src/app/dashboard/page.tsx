"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { subscribeToAuthState } from "@/lib/firebaseAuth";
import { getUserWorkspacesAction } from "@/actions/studioActions";
import { Navbar } from "@/components/Navbar";
import { BackButton } from "@/components/BackButton";

export default function GlobalDashboardRedirect() {
  const router = useRouter();
  const [status, setStatus] = useState("Checking authentication...");

  useEffect(() => {
    const unsubscribe = subscribeToAuthState(async (user) => {
      if (user) {
        try {
          setStatus("Finding your default studio...");
          const idToken = await user.getIdToken();
          const workspaces = await getUserWorkspacesAction(idToken);
          
          const activeWorkspaces = workspaces.filter((workspace) => workspace.status === "ACTIVE");
          const stored = typeof window !== "undefined"
            ? localStorage.getItem(`focoman_default_workspace_${user.uid}`)
            : null;
          const wasCleared = stored === '__cleared__';
          const defaultStudio = (!stored || wasCleared) ? null : stored;

          if (defaultStudio && activeWorkspaces.some((w) => w.studioId.toLowerCase() === defaultStudio.toLowerCase())) {
            // Explicit default set — go straight there
            router.replace(`/${defaultStudio}/dashboard`);
          } else if (!wasCleared && activeWorkspaces.length > 0) {
            // Never configured — auto-set first studio as default
            const firstStudio = activeWorkspaces[0].studioId;
            localStorage.setItem(`focoman_default_workspace_${user.uid}`, firstStudio);
            router.replace(`/${firstStudio}/dashboard`);
          } else {
            // Explicitly cleared — let user pick
            router.replace("/workspaces");
          }
        } catch (error) {
          console.error("Failed to load workspaces", error);
          setStatus("Error loading workspaces. Redirecting...");
          setTimeout(() => router.replace("/workspaces"), 1500);
        }
      } else {
        router.replace("/sign-in");
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <div className="min-h-screen bg-surface-app flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm text-center border border-border-default">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue-primary mx-auto mb-4"></div>
          <p className="text-sm font-medium text-text-secondary">{status}</p>
        </div>
      </main>
    </div>
  );
}
