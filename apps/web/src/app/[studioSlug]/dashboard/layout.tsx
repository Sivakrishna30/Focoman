import { notFound } from "next/navigation";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { getStudioBySlug } from "@focoman/db";

const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV || "local";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ studioSlug: string }>;
}) {
  const { studioSlug } = await params;

  // CHG-010: Load real studio data from Firestore — no placeholder slug or empty owner name.
  const studio = await getStudioBySlug(studioSlug);

  if (!studio) {
    // Studio slug not found in Firestore — surface truthful 404, not a broken dashboard.
    notFound();
  }

  return (
    <div className="flex h-screen overflow-hidden bg-surface-app">
      <DashboardSidebar
        studioSlug={studioSlug}
        plan="professional"
        studioName={studio.name}
        ownerName={studio.ownerName}
        appEnv={APP_ENV}
      />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
