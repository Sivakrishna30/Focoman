import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPublicMarketplaceProfile } from "@/actions/marketplaceActions";
import { getPublishedStudioPackages } from "@focoman/db";
import { Navbar } from "@/components/Navbar";
import { PublicStudioPackagesClient } from "@/features/marketplace/PublicStudioPackagesClient";

export const dynamic = "force-dynamic";

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const res = await getPublicMarketplaceProfile(params.slug);
  if (!res.success || !res.profile) {
    return {
      title: "Studio Not Found | Focoman",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://focoman.web.app";
  const p = res.profile;
  const title = `${p.name} — Photography Studio in ${p.city} | Focoman`;
  const description = p.description
    ? p.description.slice(0, 160)
    : `Explore services, verified track records, and packages for ${p.name} in ${p.city} on Focoman.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/studio/${params.slug}`,
    },
    openGraph: {
      title,
      description,
      type: "profile",
      url: `${baseUrl}/studio/${params.slug}`,
    },
  };
}

export default async function StudioStorefrontPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const res = await getPublicMarketplaceProfile(params.slug);

  if (!res.success || !res.profile) {
    notFound();
  }

  const p = res.profile;
  const packages = await getPublishedStudioPackages(p.studioId);

  return (
    <div className="min-h-screen bg-surface-app flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-12">
        <Link
          href="/studios"
          className="inline-flex items-center gap-2 text-xs font-semibold text-text-tertiary hover:text-text-primary transition mb-8"
        >
          <span>←</span> Back to Studio Directory
        </Link>

        <div className="bg-white rounded-3xl border border-border-default shadow-sm overflow-hidden">
          {/* Header Area */}
          <div className="bg-gradient-to-r from-brand-blue-background via-white to-brand-purple-background p-8 sm:p-12 border-b border-border-divider">
            <span className="inline-block rounded-full bg-brand-blue-background border border-brand-blue-light/50 px-3 py-1 text-[10px] font-bold text-brand-blue-primary uppercase tracking-widest mb-3">
              Verified Studio Storefront
            </span>
            <h1 className="text-3xl font-extrabold text-text-primary tracking-tight sm:text-4xl">
              {p.name}
            </h1>
            <p className="mt-2 flex items-center gap-2 text-sm text-text-secondary font-medium">
              <svg className="h-4 w-4 text-brand-blue-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {p.city}
            </p>
          </div>

          <div className="p-8 sm:p-12 grid gap-10 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {p.description && (
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-text-tertiary mb-3">
                    About the Studio
                  </h2>
                  <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
                    {p.description}
                  </p>
                </div>
              )}

              {p.tags && p.tags.length > 0 && (
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-text-tertiary mb-3">
                    Specialized Services
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {p.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-surface-app text-text-primary text-xs font-semibold px-3 py-1.5 rounded-lg border border-border-default"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar / Metrics */}
            <div>
              <div className="rounded-2xl border border-border-default bg-surface-app p-6">
                <h2 className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary mb-4">
                  Verified Focoman Metrics
                </h2>

                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-semibold text-text-secondary uppercase">
                      On-Time Delivery
                    </p>
                    <p className="text-2xl font-extrabold text-status-success mt-1">
                      {p.verifiedMetrics?.onTimeDeliveryPercentage || 0}%
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-text-secondary uppercase">
                      Completed Orders
                    </p>
                    <p className="text-2xl font-extrabold text-text-primary mt-1">
                      {p.verifiedMetrics?.completedOrdersCount || 0}
                    </p>
                  </div>
                  <p className="text-[9px] text-text-tertiary pt-4 border-t border-border-divider">
                    These metrics are calculated automatically from actual order completion timestamps. Studio owners cannot edit these numbers.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Studio Packages & Booking Flow */}
          <div className="border-t border-border-divider bg-white p-8 sm:p-12">
            <h2 className="text-lg font-bold text-text-primary mb-2">Available Packages &amp; Pricing</h2>
            <p className="text-xs text-text-secondary mb-6">
              Review packages offered by {p.name}. Select a package to submit a booking inquiry.
            </p>
            <PublicStudioPackagesClient studioId={p.studioId} packages={packages} />
          </div>
        </div>
      </main>
    </div>
  );
}
