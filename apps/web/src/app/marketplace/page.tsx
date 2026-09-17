import Link from "next/link";
import { searchPublicMarketplace } from "@/actions/marketplaceActions";
import { Navbar } from "@/components/Navbar";

// Server Component with search params
export default async function MarketplacePage({
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
            <h1 className="text-3xl font-extrabold text-text-primary tracking-tight sm:text-4xl">Studio Marketplace</h1>
            <p className="mt-4 text-text-secondary max-w-2xl mx-auto">
              Discover verified photography and videography studios near you with authentic operational performance metrics, on-time delivery records, and client reviews.
            </p>
            
            <form
              action="/marketplace"
              method="GET"
              className="mt-8 flex justify-center"
              suppressHydrationWarning
            >
              <div
                suppressHydrationWarning
                className="flex w-full max-w-md items-center gap-2 rounded-xl border border-border-default bg-surface-app p-1.5 shadow-sm focus-within:border-brand-blue-primary focus-within:ring-1 focus-within:ring-brand-blue-primary transition"
              >
                <div className="pl-3 text-text-tertiary">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <input 
                  type="text" 
                  name="city"
                  defaultValue={city || ""}
                  placeholder="Enter city (e.g. Bangalore)"
                  className="w-full bg-transparent border-0 px-2 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-0"
                  suppressHydrationWarning
                  autoComplete="off"
                  data-lpignore="true"
                  data-form-type="other"
                />
                <button
                  type="submit"
                  suppressHydrationWarning
                  className="rounded-lg bg-text-primary px-4 py-2 text-xs font-bold text-white transition hover:bg-black"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Results */}
        <div className="flex-1 bg-surface-app py-12 px-4 sm:px-6">
          <div className="mx-auto max-w-5xl">
            {profiles.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-text-secondary">No studios found {city ? `in ${city}` : ""}.</p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {profiles.map(p => (
                  <Link href={`/marketplace/${p.slug}`} key={p.id} className="group flex flex-col rounded-2xl border border-border-default bg-white p-5 shadow-sm transition hover:border-brand-blue-light hover:shadow-md">
                    <div className="flex items-start justify-between">
                      <h2 className="font-bold text-text-primary text-lg group-hover:text-brand-blue-primary transition">{p.name}</h2>
                      {p.verifiedMetrics && (
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] font-bold text-status-success bg-green-50 px-2 py-0.5 rounded-full">
                            {p.verifiedMetrics.onTimeDeliveryPercentage}% On-Time
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-text-tertiary">{p.city}</p>
                    
                    {p.tags && p.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {p.tags.slice(0,3).map(tag => (
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
                      <span className="text-xs font-bold text-brand-blue-primary group-hover:underline">View Profile</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
