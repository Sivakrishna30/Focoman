"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { marketplaceApi, MarketplaceStudio } from "@/services/marketplaceApi";

const CITIES = ["All cities", "Chennai", "Mumbai", "Hyderabad", "Bangalore"];

export default function StudioMarketplacePage() {
  const [selectedCity, setSelectedCity] = useState("All cities");
  const [studios, setStudios] = useState<MarketplaceStudio[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStudios = async () => {
      setIsLoading(true);
      const data = await marketplaceApi.getStudios(selectedCity === "All cities" ? undefined : selectedCity);
      setStudios(data);
      setIsLoading(false);
    };
    void loadStudios();
  }, [selectedCity]);

  return (
    <div className="min-h-screen bg-surface-app text-text-primary">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Phase 3 Advisory Banner */}
        <div className="mb-8 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-xs text-blue-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-blue-200 px-2 py-0.5 text-[10px] font-extrabold text-blue-900 uppercase">
              Phase 3 Preview
            </span>
            <span>
              The Studio Marketplace is an upcoming capability. Core Focoman focus is on Confirmed Order Management (OMS).
            </span>
          </div>
          <Link href="/workspaces" className="font-bold underline shrink-0 hover:text-blue-700">
            Go to Workspaces →
          </Link>
        </div>

        <section className="rounded-3xl border border-border-default bg-gradient-to-br from-white via-brand-blue-background/30 to-brand-orange-background/30 p-8 sm:p-12">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-orange-primary">
            Studio Directory
          </span>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Find a photography studio near you
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-secondary sm:text-base">
            Discover listed photography studios on the Focoman network and view their verified contact details.
          </p>
          <div className="mt-7 max-w-sm">
            <label htmlFor="city" className="block text-xs font-bold uppercase tracking-wider text-text-secondary">
              Filter by City
            </label>
            <select
              id="city"
              value={selectedCity}
              onChange={(event) => setSelectedCity(event.target.value)}
              className="mt-2 w-full rounded-xl border border-border-default bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-brand-blue-primary"
            >
              {CITIES.map((city) => (
                <option key={city}>{city}</option>
              ))}
            </select>
          </div>
        </section>

        <section className="mt-8" aria-live="polite">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="text-xl font-extrabold">
              {selectedCity === "All cities" ? "All listed studios" : `Studios in ${selectedCity}`}
            </h2>
            {!isLoading && <span className="text-sm text-text-secondary">{studios.length} found</span>}
          </div>

          {isLoading ? (
            <p className="rounded-2xl border border-border-default bg-white p-6 text-sm text-text-secondary">
              Loading studios...
            </p>
          ) : studios.length === 0 ? (
            <p className="rounded-2xl border border-border-default bg-white p-6 text-sm text-text-secondary">
              No studios are listed in {selectedCity} yet. Try another city.
            </p>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {studios.map((studio) => (
                <article
                  key={studio.studioId}
                  className="rounded-2xl border border-border-default bg-white p-6 shadow-xs transition hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-extrabold text-text-primary">{studio.brandName}</h3>
                      <p className="mt-1 text-sm text-text-secondary">{studio.studioName}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-brand-blue-background px-3 py-1 text-xs font-bold text-brand-blue-primary">
                      {studio.city}
                    </span>
                  </div>
                  <dl className="mt-5 space-y-2 text-sm">
                    <div>
                      <dt className="inline font-semibold text-text-secondary">Phone: </dt>
                      <dd className="inline">{studio.mobile}</dd>
                    </div>
                    <div className="break-all">
                      <dt className="inline font-semibold text-text-secondary">Email: </dt>
                      <dd className="inline">{studio.email}</dd>
                    </div>
                  </dl>
                  <a
                    href={`mailto:${studio.email}`}
                    className="mt-6 inline-flex rounded-lg bg-brand-blue-primary px-4 py-2.5 text-xs font-bold text-white transition hover:bg-sky-600"
                  >
                    Contact Studio
                  </a>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
