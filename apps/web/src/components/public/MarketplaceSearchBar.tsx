"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

interface MarketplaceSearchBarProps {
  initialCity?: string;
}

export function MarketplaceSearchBar({ initialCity = "" }: MarketplaceSearchBarProps) {
  const router = useRouter();
  const [city, setCity] = useState(initialCity);
  const [isLocating, setIsLocating] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const handleSearch = (targetCity?: string) => {
    const queryCity = typeof targetCity === "string" ? targetCity : city;
    const trimmed = queryCity.trim();
    startTransition(() => {
      if (trimmed) {
        router.push(`/studios?city=${encodeURIComponent(trimmed)}`);
      } else {
        router.push("/studios");
      }
    });
  };

  const handleNearbyClick = () => {
    setLocationError(null);
    setShowPermissionModal(true);
  };

  const executeGeolocation = () => {
    setShowPermissionModal(false);
    setIsLocating(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setIsLocating(false);
      setLocationError("Geolocation is not supported by your browser. Please enter your city manually.");
      return;
    }

    // Trigger 100% native browser Geolocation API
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        let detectedCity = "";

        try {
          // Reverse geocode real coordinates
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          if (response.ok) {
            const data = await response.json();
            detectedCity = data.city || data.locality || data.principalSubdivision || "";
          }
        } catch {
          try {
            const fallbackRes = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            if (fallbackRes.ok) {
              const fallbackData = await fallbackRes.json();
              detectedCity =
                fallbackData.address?.city ||
                fallbackData.address?.town ||
                fallbackData.address?.state_district ||
                fallbackData.address?.county ||
                "";
            }
          } catch {
            // Geocoding network error
          }
        }

        setIsLocating(false);

        if (detectedCity) {
          const cleanCity = detectedCity.replace(/\s+district$/i, "").trim();
          setCity(cleanCity);
          handleSearch(cleanCity);
        } else {
          setLocationError("Could not detect city name from your GPS coordinates. Please enter your city manually.");
        }
      },
      (error) => {
        setIsLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          setLocationError("Location permission was denied. Please allow location access in your browser settings or type your city manually.");
        } else {
          setLocationError("Unable to retrieve your location. Please enter your city manually.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleClear = () => {
    setCity("");
    setLocationError(null);
    startTransition(() => {
      router.push("/studios");
    });
  };

  return (
    <div className="w-full max-w-xl mx-auto mt-6 relative">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
        className="flex flex-col sm:flex-row items-center gap-2 p-1.5 rounded-2xl border border-border-default bg-surface-app shadow-sm focus-within:border-brand-purple-primary focus-within:ring-1 focus-within:ring-brand-purple-primary transition"
      >
        {/* City Input */}
        <div className="flex items-center flex-1 w-full pl-3.5 pr-2 gap-2.5">
          <svg className="h-5 w-5 text-text-tertiary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <input
            type="text"
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              if (locationError) setLocationError(null);
            }}
            placeholder="Enter city (e.g. Chennai, Coimbatore, Madurai)"
            className="w-full bg-transparent border-0 px-2.5 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-0 ml-0.5"
            autoComplete="off"
          />
          {city && (
            <button
              type="button"
              onClick={handleClear}
              className="text-text-tertiary hover:text-text-primary text-xs p-1 cursor-pointer shrink-0"
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Buttons Group */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto shrink-0 justify-end px-1 sm:px-0">
          {/* Near by Me Button */}
          <button
            type="button"
            onClick={handleNearbyClick}
            disabled={isLocating}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-xl border border-border-default bg-white px-3.5 py-2 text-xs font-bold text-text-primary hover:bg-slate-50 hover:border-brand-purple-soft transition active:scale-95 disabled:opacity-60 cursor-pointer shadow-2xs"
            title="Find studios near your current location"
          >
            {isLocating ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5 text-brand-purple-primary" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Locating...</span>
              </>
            ) : (
              <>
                <svg className="h-3.5 w-3.5 text-brand-purple-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="3 11 22 2 13 21 11 13 3 11" />
                </svg>
                <span>Near by Me</span>
              </>
            )}
          </button>

          {/* Search Button */}
          <button
            type="submit"
            className="flex-1 sm:flex-none rounded-xl bg-text-primary px-4 py-2 text-xs font-bold text-white transition hover:bg-black active:scale-95 cursor-pointer shadow-2xs"
          >
            Search
          </button>
        </div>
      </form>

      {/* Geolocation permission prompt modal */}
      {showPermissionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-border-default text-left">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-full bg-brand-purple-background flex items-center justify-center text-brand-purple-primary font-bold shrink-0">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polygon points="3 11 22 2 13 21 11 13 3 11" />
                </svg>
              </div>
              <h3 className="font-extrabold text-base text-text-primary">Enable Location Access</h3>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed mb-5">
              Allow location access so Focoman can automatically discover verified photography studios near your city.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowPermissionModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-text-secondary hover:bg-slate-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeGeolocation}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-purple-primary hover:bg-brand-purple-hover transition shadow-sm cursor-pointer"
              >
                Allow Location Access
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inline Location Error (100% native error text, no emojis or dummy fallbacks) */}
      {locationError && (
        <div className="mt-2.5 flex items-center justify-between text-left text-xs bg-amber-50 border border-amber-200 text-amber-900 rounded-xl px-3.5 py-2.5 animate-in fade-in">
          <span>{locationError}</span>
          <button
            type="button"
            onClick={() => setLocationError(null)}
            className="ml-3 font-bold hover:underline cursor-pointer text-amber-900 shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Active filter badge */}
      {initialCity && (
        <div className="mt-2.5 flex items-center justify-center gap-2 text-xs text-text-secondary">
          <span>Filtered by city: <strong className="text-text-primary">&quot;{initialCity}&quot;</strong></span>
          <button
            type="button"
            onClick={handleClear}
            className="text-brand-purple-primary hover:underline font-bold cursor-pointer"
          >
            View all cities
          </button>
        </div>
      )}
    </div>
  );
}
