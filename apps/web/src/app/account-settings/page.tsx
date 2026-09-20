"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { BackButton } from "@/components/BackButton";
import { subscribeToAuthState, signOutUser } from "@/lib/firebaseAuth";
import { getCustomerAuthorizedOrdersHistoryAction } from "@/actions/customerActions";
import { getCustomerBookingRequestsAction } from "@/actions/marketplaceActions";
import { CustomerOrderView, BookingRequest } from "@focoman/types";
import { User } from "firebase/auth";

export default function AccountSettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<CustomerOrderView[]>([]);
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToAuthState(async (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (!currentUser) {
        router.replace("/sign-in");
        return;
      }

      setHistoryLoading(true);
      try {
        const token = await currentUser.getIdToken();
        const [ordersRes, bookingsRes] = await Promise.all([
          getCustomerAuthorizedOrdersHistoryAction(token),
          getCustomerBookingRequestsAction(token),
        ]);

        if (ordersRes.success && ordersRes.history) {
          setOrders(ordersRes.history);
        }
        if (bookingsRes.success && bookingsRes.bookingRequests) {
          setBookings(bookingsRes.bookingRequests);
        }
      } catch (err) {
        console.error("Failed to load customer order history", err);
      } finally {
        setHistoryLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    await signOutUser();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-app flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue-primary"></div>
        </main>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-surface-app text-text-primary">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <div>
          <BackButton fallbackHref="/dashboard" />
        </div>

        {/* Profile Card */}
        <div className="rounded-3xl border border-border-default bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border-divider pb-6">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-text-primary">
                Account & Order History
              </h1>
              <p className="mt-1 text-sm text-text-secondary">
                Manage your personal profile and view your booked studio sessions across Focoman.
              </p>
            </div>
            <div className="h-14 w-14 flex-shrink-0 rounded-full bg-brand-blue-primary text-white flex items-center justify-center text-xl font-bold shadow-sm">
              {user.displayName
                ? user.displayName.charAt(0).toUpperCase()
                : user.email
                ? user.email.charAt(0).toUpperCase()
                : "U"}
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">Full Name</label>
              <div className="w-full rounded-xl border border-border-default bg-surface-app px-4 py-2 text-sm font-medium text-text-primary">
                {user.displayName || "Not provided"}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">Email Address</label>
              <div className="w-full rounded-xl border border-border-default bg-surface-app px-4 py-2 text-sm font-medium text-text-primary">
                {user.email}
              </div>
            </div>
          </div>
        </div>

        {/* Customer Order History (Strict Data Isolation) */}
        <div className="rounded-3xl border border-border-default bg-white p-6 shadow-sm sm:p-8 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-text-primary">Your Studio Bookings & Orders</h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Authorized history of your confirmed sessions. Internal studio notes and crew records are strictly protected.
            </p>
          </div>

          {historyLoading ? (
            <div className="text-sm text-text-secondary py-6 text-center">Loading your order history...</div>
          ) : orders.length === 0 && bookings.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border-default p-8 text-center bg-surface-app">
              <p className="text-sm font-semibold text-text-secondary">No studio orders found.</p>
              <p className="text-xs text-text-tertiary mt-1">
                Explore our verified studios on the{" "}
                <Link href="/studios" className="text-brand-blue-primary font-semibold hover:underline">
                  Studio Marketplace
                </Link>{" "}
                to book your next photography session.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Confirmed Orders */}
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="rounded-2xl border border-border-default bg-surface-app p-5 text-xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-divider pb-2.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-brand-blue-primary">{ord.orderNumber}</span>
                        <span className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-bold text-status-success border border-green-200">
                          {ord.orderStatus}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-text-primary mt-1">
                        {ord.studioName} — {ord.eventType}
                      </h3>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-text-tertiary uppercase">Amount</span>
                      <p className="text-base font-extrabold text-text-primary">
                        ₹{ord.totalAmount.toLocaleString("en-IN")}
                      </p>
                      <p className="text-[10px] text-text-secondary">
                        Paid: ₹{ord.amountPaid.toLocaleString("en-IN")} · Balance: ₹{ord.remainingAmount.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-text-secondary">
                    <div>
                      <span className="text-text-tertiary">Event Date:</span>{" "}
                      <span className="font-semibold text-text-primary">{ord.eventDate}</span>
                    </div>
                    <div>
                      <span className="text-text-tertiary">Location:</span>{" "}
                      <span className="font-semibold text-text-primary">{ord.eventLocation || "In Studio"}</span>
                    </div>
                  </div>

                  {ord.trackingPasskey && (
                    <div className="pt-2 border-t border-border-divider flex justify-between items-center">
                      <span className="text-[11px] text-text-tertiary">
                        Access Code: <strong className="font-mono text-text-primary">{ord.trackingPasskey}</strong>
                      </span>
                      <Link
                        href={`/track/${ord.trackingPasskey}`}
                        className="rounded-xl bg-text-primary px-3 py-1.5 text-[11px] font-bold text-white hover:bg-black transition"
                      >
                        Track Deliverables & Progress →
                      </Link>
                    </div>
                  )}
                </div>
              ))}

              {/* Pending / In-Negotiation Bookings */}
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="rounded-2xl border border-border-default bg-white p-5 text-xs space-y-2 border-l-4 border-l-brand-blue-primary"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono text-[11px] font-bold text-brand-blue-primary">{b.id}</span>
                      <h3 className="text-sm font-bold text-text-primary mt-0.5">
                        {b.packageName || b.eventType} (Booking Request)
                      </h3>
                      <p className="text-text-secondary mt-0.5">Event Date: {b.eventDate}</p>
                    </div>
                    <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold uppercase text-brand-blue-primary border border-blue-200">
                      {b.bookingStatus}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-border-divider text-text-secondary">
                    <span>Requested Price: ₹{b.agreedPrice.toLocaleString("en-IN")}</span>
                    <span className="text-[11px] font-medium text-text-tertiary">
                      {b.bookingStatus === "OPEN_FOR_NEGOTIATION"
                        ? "Under review with studio owner"
                        : "Awaiting studio confirmation"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sign Out Card */}
        <div className="rounded-3xl border border-border-default bg-white p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-text-primary">Sign Out</h3>
            <p className="text-xs text-text-secondary mt-0.5">
              Sign out of your account on this device.
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="rounded-xl border border-red-200 bg-red-50 px-6 py-2.5 text-xs font-bold text-red-600 hover:bg-red-100 transition whitespace-nowrap"
          >
            Sign Out
          </button>
        </div>
      </main>
    </div>
  );
}
