import { notFound } from "next/navigation";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { StudioWorkspaceProvider } from "@/components/StudioWorkspaceProvider";
import { DashboardTopNav } from "@/components/DashboardTopNav";
import { getStudioBySlug } from "@focoman/db";
import { Studio } from "@focoman/types";
import { DEMO_STUDIO } from "@/lib/demoData";
import { DemoBanner } from "@/components/DemoBanner";

const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV || "local";

function isDemoSlug(slug: string): boolean {
  const s = slug.toLowerCase();
  return s === "lumina-studios" || s === "demo" || s === "demo-studio";
}

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ studioSlug: string }>;
}) {
  const { studioSlug } = await params;
  const isDemo = isDemoSlug(studioSlug);

  let studio: Studio | null = null;
  if (isDemo) {
    studio = DEMO_STUDIO;
  } else {
    studio = await getStudioBySlug(studioSlug);
  }

  if (!studio) {
    // Studio slug not found — surface truthful 404
    notFound();
  }

  const serializedStudio: Studio = {
    id: studio.id,
    name: studio.name,
    city: studio.city || "",
    ownerId: studio.ownerId,
    ownerName: studio.ownerName,
    ownerEmail: studio.ownerEmail,
    ownerPhone: studio.ownerPhone || undefined,
    createdAt: studio.createdAt || new Date().toISOString(),
    updatedAt: studio.updatedAt || new Date().toISOString(),
  };

  return (
    <StudioWorkspaceProvider studio={serializedStudio}>
      <div className="flex h-screen overflow-hidden bg-surface-app flex-col md:flex-row">
        <DashboardSidebar
          studioSlug={studioSlug}
          plan="complete"
          studioName={serializedStudio.name}
          ownerName={serializedStudio.ownerName}
          appEnv={APP_ENV}
        />
        <main className="flex-1 min-w-0 flex flex-col h-full overflow-hidden relative">
          <DashboardTopNav />
          {isDemo && <DemoBanner studioSlug={studioSlug} />}
          <div id="dashboard-main-content" className="flex-1 overflow-y-auto min-h-0">{children}</div>
        </main>
      </div>
    </StudioWorkspaceProvider>
  );
}
