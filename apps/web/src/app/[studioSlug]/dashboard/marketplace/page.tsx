import { redirect } from "next/navigation";
import { getStudioBySlug } from "@focoman/db";
import { MarketplaceSettingsClient } from "@/features/marketplace/MarketplaceSettingsClient";

export default async function MarketplaceSettingsPage(props: { params: Promise<{ studioSlug: string }> }) {
  const params = await props.params;
  const studio = await getStudioBySlug(params.studioSlug);
  if (!studio) {
    redirect("/workspaces");
  }

  // Ensure marketplace feature is enabled
  if (!studio.features?.marketplace) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-xl font-bold text-text-primary">Studio Marketplace Module Disabled</h2>
          <p className="mt-2 text-text-secondary">This module is not enabled for your studio. Please contact support to enable the Studio Marketplace module.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-surface-app p-6 sm:p-8">
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
