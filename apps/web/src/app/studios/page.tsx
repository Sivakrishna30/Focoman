import Link from "next/link";
import type { Metadata } from "next";
import { searchPublicMarketplace } from "@/actions/marketplaceActions";
import { Navbar } from "@/components/Navbar";
import { MarketplaceSearchBar } from "@/components/public/MarketplaceSearchBar";

export const metadata: Metadata = {
  title: "Studio Marketplace | Verified Photography Studios | Focoman",
  description: "Explore independent photography studios on Studio Marketplace. Review real operational track records, authentic service packages, and submit direct booking inquiries.",
  alternates: {
    canonical: "https://focoman.web.app/studios",
  },
};

export default async function StudiosPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const city = typeof resolvedParams.city === "string" ? resolvedParams.city : undefined;
  
  const res = await searchPublicMarketplace(city);
  const profiles = res.success ? res.profiles || [] : [];

  return (
    <div className="min-h-screen bg-surface-app flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-border-divider pt-12 pb-8 px-4 sm:px-6">
          <div className="mx-auto max-w-5xl text-center">
            <span className="inline-block rounded-full bg-brand-blue-background px-3 py-1 text-xs font-bold text-brand-blue-primary uppercase tracking-wider mb-3">
              Studio Marketplace
            </span>
            <h1 className="text-3xl font-extrabold text-text-primary tracking-tight sm:text-4xl">
              Verified Photography Studios
            </h1>
            <p className="mt-4 text-text-secondary max-w-2xl mx-auto text-sm sm:text-base">
              Explore independent photography studios on Studio Marketplace. Review real operational track records, authentic service packages, and submit direct booking inquiries.
            </p>
            
            <MarketplaceSearchBar initialCity={city} />
          </div>
        </div>
        
        {/* Results */}
        <div className="flex-1 bg-surface-app py-12 px-4 sm:px-6">
          <div className="mx-auto max-w-5xl">
            {profiles.length === 0 ? (
              <div className="text-center py-20 rounded-2xl border border-dashed border-border-default bg-white p-8">
                <p className="text-text-primary font-bold text-base">No studios currently listed {city ? `in "${city}"` : ""}.</p>
                <p className="mt-2 text-text-secondary text-xs">
                  Studios must be verified on Focoman and opt-in to publish their profile on the Studio Marketplace.
                </p>
                {city && (
                  <Link href="/studios" className="mt-4 inline-block text-xs font-bold text-brand-blue-primary hover:underline">
                    View all studios →
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {profiles.map(p => (
                  <Link
                    href={`/studios/${p.slug}`}
                    key={p.id}
                    className="group flex flex-col rounded-2xl border border-border-default bg-white p-5 shadow-sm transition hover:border-brand-blue-light hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        {p.logoUrl ? (
                          <img
                            src={p.logoUrl}
                            alt={`${p.name} logo`}
                            className="w-10 h-10 rounded-xl object-cover border border-border-default shadow-xs shrink-0 bg-surface-app"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-brand-blue-background border border-brand-blue-light/30 text-brand-blue-primary font-bold text-sm flex items-center justify-center shrink-0">
                            {p.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <h2 className="font-bold text-text-primary text-lg group-hover:text-brand-blue-primary transition truncate">
                          {p.name}
                        </h2>
                      </div>
                      {p.verifiedMetrics && (
                        <div className="flex flex-col items-end shrink-0 ml-2">
                          <span className="text-[10px] font-bold text-status-success bg-green-50 px-2 py-0.5 rounded-full">
                            {p.verifiedMetrics.onTimeDeliveryPercentage}% On-Time
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-text-tertiary flex items-center gap-1">
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      {p.city}
                    </p>
                    
                    {p.tags && p.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {p.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="bg-surface-app text-text-secondary text-[10px] font-semibold px-2 py-1 rounded border border-border-divider">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="mt-6 pt-4 border-t border-border-divider mt-auto flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-text-secondary">
                        {p.verifiedMetrics?.completedOrdersCount || 0} Verified Deliveries
                      </span>
                      <span className="text-xs font-bold text-brand-blue-primary group-hover:underline">
                        View Profile →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-divider bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-tertiary">
            <p>© {new Date().getFullYear()} Focoman. All rights reserved.</p>
            <p>Built for professional photography studios.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
