import { notFound } from "next/navigation";
import { getStudioBySlug } from "@/services/mockDb";
import { DashboardSidebar } from "@/components/DashboardSidebar";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ studioSlug: string }>;
}) {
  const { studioSlug } = await params;
  const studio = getStudioBySlug(studioSlug);
  if (!studio) notFound();

  return (
    <div className="flex h-screen overflow-hidden bg-surface-app">
      <DashboardSidebar
        studioSlug={studioSlug}
        plan={studio.plan}
        studioName={studio.studioName}
        ownerName={studio.ownerName}
      />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
