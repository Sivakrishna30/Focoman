import { redirect } from "next/navigation";
import { getStudioBySlug } from "@focoman/db";
import { MarketplaceSettingsClient } from "@/features/marketplace/MarketplaceSettingsClient";
import { requireDashboardStudioAccess } from "@/lib/dashboardAccess";

export default async function MarketplaceSettingsPage(props: { params: Promise<{ studioSlug: string }> }) {
  const params = await props.params;
  await requireDashboardStudioAccess(params.studioSlug, "STUDIO_OWNER");
  const studio = await getStudioBySlug(params.studioSlug);
  if (!studio) {
    redirect("/workspaces");
  }

  // Studio Marketplace is 100% free for all studios

  return (
    <div className="flex-1 overflow-auto bg-surface-app p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-text-primary">Studio Marketplace Profile</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Manage your studio&apos;s public presence on the Studio Marketplace.
          </p>
        </div>
        
        <MarketplaceSettingsClient studioId={studio.id} />
      </div>
    </div>
  );
}
