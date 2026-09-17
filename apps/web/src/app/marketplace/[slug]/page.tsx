import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicMarketplaceProfile } from "@/actions/marketplaceActions";
import { Navbar } from "@/components/Navbar";

export default async function PublicProfilePage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const res = await getPublicMarketplaceProfile(params.slug);
  
  if (!res.success || !res.profile) {
    notFound();
  }
  
  const p = res.profile;

  return (
    <div className="min-h-screen bg-surface-app flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-12">
        <Link href="/marketplace" className="inline-flex items-center gap-2 text-xs font-semibold text-text-tertiary hover:text-text-primary transition mb-8">
          <span>←</span> Back to Search
        </Link>
        
        <div className="bg-white rounded-3xl border border-border-default shadow-sm overflow-hidden">
          {/* Header Area */}
          <div className="bg-gradient-to-r from-brand-blue-background to-brand-purple-background p-8 sm:p-12">
            <h1 className="text-3xl font-extrabold text-text-primary tracking-tight sm:text-4xl">{p.name}</h1>
            <p className="mt-2 flex items-center gap-2 text-sm text-text-secondary font-medium">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {p.city}
            </p>
          </div>
          
          <div className="p-8 sm:p-12 grid gap-12 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {p.description && (
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-text-tertiary mb-3">About the Studio</h2>
                  <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">{p.description}</p>
                </div>
              )}
              
              {p.tags && p.tags.length > 0 && (
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-text-tertiary mb-3">Services</h2>
                  <div className="flex flex-wrap gap-2">
                    {p.tags.map(tag => (
                      <span key={tag} className="bg-surface-app text-text-primary text-xs font-semibold px-3 py-1.5 rounded-lg border border-border-default">
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
                <h2 className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary mb-4">Verified Focoman Metrics</h2>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-semibold text-text-secondary uppercase">On-Time Delivery</p>
                    <p className="text-2xl font-extrabold text-status-success mt-1">{p.verifiedMetrics?.onTimeDeliveryPercentage || 0}%</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-text-secondary uppercase">Completed Orders</p>
                    <p className="text-2xl font-extrabold text-text-primary mt-1">{p.verifiedMetrics?.completedOrdersCount || 0}</p>
                  </div>
                  <p className="text-[9px] text-text-tertiary pt-4 border-t border-border-divider">
                    These metrics are automatically calculated from actual operational data and cannot be manually edited by the studio.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
