"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { subscribeToAuthState } from "@/lib/firebaseAuth";
import { getMySyncedOrdersAction } from "@/actions/orderActions";
import { Order } from "@focoman/types";
import { User } from "firebase/auth";
import Link from "next/link";

export default function TrackOrderPortalPage() {
  const router = useRouter();
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [syncedOrders, setSyncedOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToAuthState(async (user) => {
      setCurrentUser(user);
      if (user) {
        setLoadingOrders(true);
        try {
          const token = await user.getIdToken();
          const orders = await getMySyncedOrdersAction(token);
          setSyncedOrders(orders);
        } catch (err) {
          console.error("Failed to load synced orders:", err);
        } finally {
          setLoadingOrders(false);
        }
      } else {
        setSyncedOrders([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = accessCode.trim().toUpperCase();
    if (!cleanCode) {
      setError("Please enter a valid Customer Order Access Code.");
      return;
    }
    setError(null);
    router.push(`/track/${encodeURIComponent(cleanCode)}`);
  };

  return (
    <div className="min-h-screen bg-surface-app text-text-primary flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center p-4 py-12">
        <div className="w-full max-w-xl space-y-8">
          {/* Access Code Search Card */}
          <div className="rounded-3xl border border-border-default bg-white p-6 sm:p-10 shadow-sm text-center space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary">
                Track Your Event Order
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-text-secondary leading-relaxed">
                Enter your private Customer Order Access Code provided by your photography studio.
              </p>
            </div>

            <form onSubmit={handleTrackSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  placeholder="Enter Customer Order Access Code"
                  className="w-full rounded-2xl border border-border-default px-4 py-3 text-center font-mono text-sm font-bold uppercase tracking-wider text-text-primary outline-none focus:border-brand-blue-primary focus:ring-2 focus:ring-brand-blue-soft transition"
                />
                {error && <p className="mt-2 text-xs font-semibold text-status-error">{error}</p>}
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-brand-blue-primary py-3.5 text-xs font-bold text-white hover:bg-sky-600 transition shadow-xs"
              >
                Track Order & Deliverables
              </button>
            </form>

            <p className="text-[11px] text-text-tertiary">
              No account or login required for guest tracking.
            </p>
          </div>

          {/* Logged In User's Synced Orders Section */}
          {currentUser && (
            <div className="rounded-3xl border border-border-default bg-white p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-border-divider pb-4">
                <div>
                  <h2 className="text-base font-bold text-text-primary">My Synced Orders</h2>
                  <p className="text-xs text-text-secondary">Orders linked to {currentUser.email}</p>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-extrabold text-emerald-800 uppercase">
                  Logged In
                </span>
              </div>

              {loadingOrders ? (
                <div className="py-6 text-center text-xs text-text-tertiary">Loading your synced bookings...</div>
              ) : syncedOrders.length === 0 ? (
                <p className="py-4 text-center text-xs text-text-secondary">
                  No orders synced to your account yet. Track an order with its access code above and click &quot;Sync Order to Account&quot;.
                </p>
              ) : (
                <div className="space-y-3">
                  {syncedOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-border-default p-4 hover:border-brand-blue-primary transition"
                    >
                      <div>
                        <span className="font-mono text-[10px] font-bold text-text-tertiary">{order.orderNumber}</span>
                        <h3 className="text-sm font-bold text-text-primary">{order.eventType}</h3>
                        <p className="text-xs text-text-secondary">
                          Event Date: {new Date(order.eventDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Link
                        href={`/track/${encodeURIComponent(order.trackingPasskey)}`}
                        className="rounded-xl bg-brand-blue-primary px-4 py-2 text-xs font-bold text-white hover:bg-sky-600 text-center transition"
                      >
                        View Order →
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
