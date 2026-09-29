"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { CustomerTrackingView, OrderStatus, TaskStatus } from "@focoman/types";
import { Navbar } from "@/components/Navbar";
import { subscribeToAuthState } from "@/lib/firebaseAuth";
import { syncOrderToAccountAction } from "@/actions/orderActions";
import { User } from "firebase/auth";
import Link from "next/link";

const STATUS_LABELS: Record<OrderStatus, string> = {
  AWAITING_EVENT: "Awaiting Event",
  POST_EVENT_IN_PROGRESS: "Post-Event In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  ASSIGNED: "Pending",
  IN_PROGRESS: "In Progress",
  REVIEW: "Under Review",
  REWORK: "Revising",
  COMPLETED: "Completed",
};

interface TrackOrderClientProps {
  view: CustomerTrackingView;
  rawIdentifier: string;
}

export function TrackOrderClient({ view, rawIdentifier }: TrackOrderClientProps) {
  const { order, tasks } = view;

  const searchParams = useSearchParams();
  const autoSyncRequested = searchParams.get("autoSync") === "true";
  const hasAutoSyncedRef = useRef(false);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [enteredPasskey, setEnteredPasskey] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passkeyError, setPasskeyError] = useState<string | null>(null);

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  const validatePasskey = useCallback(
    (input: string): boolean => {
      const cleanInput = input.trim().toUpperCase();
      if (!cleanInput) return false;

      const numericPinMatch = order.trackingPasskey.match(/\d{6}/g) || order.orderNumber.match(/\d{6}/g) || [];

      if (cleanInput === order.trackingPasskey.toUpperCase()) return true;
      if (cleanInput === order.orderNumber.toUpperCase()) return true;
      if (cleanInput === order.id.toUpperCase()) return true;
      if (numericPinMatch.some((pin) => cleanInput === pin)) return true;

      return false;
    },
    [order.trackingPasskey, order.orderNumber, order.id]
  );

  // Restore unlocked session from sessionStorage or check Firebase Auth email match
  useEffect(() => {
    const sessionKey = `focoman_unlocked_order_${order.id}`;
    const stored = typeof window !== "undefined" ? sessionStorage.getItem(sessionKey) : null;
    if (stored === "true") {
      setIsUnlocked(true);
    }

    const unsubscribe = subscribeToAuthState((user) => {
      setCurrentUser(user);
      setAuthChecked(true);

      if (user) {
        const userEmail = user.email?.toLowerCase();
        const customerEmail = order.customerEmail?.toLowerCase();

        // 1. Customer email/UID match
        const isCustomerMatch = Boolean(
          (userEmail && customerEmail && userEmail === customerEmail) ||
          (order.customerUid && order.customerUid === user.uid)
        );

        // 2. Studio Owner match
        const isOwnerMatch = Boolean(
          (userEmail && order.studioOwnerEmail && userEmail === order.studioOwnerEmail.toLowerCase()) ||
          (order.studioOwnerId && order.studioOwnerId === user.uid)
        );

        // 3. Crew / Staff match
        const isStaffMatch = Boolean(
          isOwnerMatch ||
          (userEmail && order.staffEmails && order.staffEmails.includes(userEmail)) ||
          (order.staffUids && order.staffUids.includes(user.uid))
        );

        if (isCustomerMatch || isStaffMatch) {
          setIsUnlocked(true);
        }
      }
    });

    return () => unsubscribe();
  }, [
    order.id,
    order.customerEmail,
    order.customerUid,
    order.studioOwnerEmail,
    order.studioOwnerId,
    order.staffEmails,
    order.staffUids,
  ]);

  const handleVerifyPasskey = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePasskey(enteredPasskey)) {
      setIsUnlocked(true);
      setPasskeyError(null);
      if (typeof window !== "undefined") {
        sessionStorage.setItem(`focoman_unlocked_order_${order.id}`, "true");
      }
    } else {
      setPasskeyError("Invalid passkey or 6-digit access PIN. Please check and try again.");
    }
  };

  const handleSyncToAccount = useCallback(async () => {
    if (!currentUser) return;
    setIsSyncing(true);
    setSyncError(null);
    try {
      const token = await currentUser.getIdToken();
      const res = await syncOrderToAccountAction({
        passkey: order.trackingPasskey,
        idToken: token,
      });

      if (res.success) {
        setSyncSuccess(true);
        setIsUnlocked(true);
      } else {
        setSyncError(res.error || "Failed to sync order to your account.");
      }
    } catch (err) {
      setSyncError(err instanceof Error ? err.message : "An error occurred while syncing order.");
    } finally {
      setIsSyncing(false);
    }
  }, [currentUser, order.trackingPasskey]);

  // Auto-sync order when redirected back from sign-in
  useEffect(() => {
    if (!currentUser || !autoSyncRequested || hasAutoSyncedRef.current) return;

    const userEmail = currentUser.email?.toLowerCase();
    const isOwnerMatch = Boolean(
      (userEmail && order.studioOwnerEmail && userEmail === order.studioOwnerEmail.toLowerCase()) ||
      (order.studioOwnerId && order.studioOwnerId === currentUser.uid)
    );
    const isStaffMatch = Boolean(
      isOwnerMatch ||
      (userEmail && order.staffEmails && order.staffEmails.includes(userEmail)) ||
      (order.staffUids && order.staffUids.includes(currentUser.uid))
    );

    // If staff, unlock directly without customer sync
    if (isStaffMatch) {
      setIsUnlocked(true);
      return;
    }

    // Auto-sync for customers returning from sign-in
    hasAutoSyncedRef.current = true;
    setIsUnlocked(true);
    handleSyncToAccount();
  }, [
    currentUser,
    autoSyncRequested,
    order.studioOwnerEmail,
    order.studioOwnerId,
    order.staffEmails,
    order.staffUids,
    handleSyncToAccount,
  ]);

  const isCompleted = order.orderStatus === "COMPLETED";

  // LOCKED STATE: Show Passkey / Email Auth verification UI
  if (!isUnlocked) {
    const hasCustomerEmail = Boolean(order.customerEmail && order.customerEmail.trim().length > 0);
    const signInRedirectUrl = `/sign-in?redirect=${encodeURIComponent(`/track/${rawIdentifier}`)}&autoSync=true`;

    return (
      <div className="min-h-screen bg-surface-app text-text-primary flex flex-col">
        <Navbar />

        <main className="flex-1 flex flex-col items-center justify-center p-4 py-12">
          <div className="w-full max-w-lg space-y-6">
            <div className="rounded-3xl border border-border-default bg-white p-6 sm:p-10 shadow-sm text-center space-y-6">
              <div>
                <span className={`inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider mb-2 ${
                  hasCustomerEmail ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-brand-blue-primary"
                }`}>
                  {hasCustomerEmail ? "Protected Order" : "6-Digit PIN Protected"}
                </span>
                <h1 className="text-xl sm:text-2xl font-extrabold text-text-primary">
                  Order Access Verification
                </h1>
                <p className="mt-2 text-xs text-text-secondary leading-relaxed">
                  Order Number: <span className="font-mono font-bold text-text-primary">{order.orderNumber}</span>
                </p>
              </div>

              {/* Option 1: Registered Customer Email Access */}
              {hasCustomerEmail && (
                <div className="space-y-4 rounded-2xl bg-emerald-50/60 p-5 border border-emerald-200 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-900 block">Registered Customer Email</span>
                    <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5">Primary Account</span>
                  </div>
                  <span className="font-mono text-sm font-extrabold text-emerald-800 block mt-0.5">
                    {order.customerEmail}
                  </span>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Customer email is on file. Sign in with Google to view order status, Google Drive deliverables, and photo selections with 1-click access.
                  </p>

                  {currentUser ? (
                    <div className="space-y-2 pt-2 border-t border-emerald-200">
                      <p className="text-xs text-text-secondary">
                        Logged in as <strong className="text-text-primary">{currentUser.email}</strong>.
                      </p>
                      {currentUser.email?.toLowerCase() !== order.customerEmail?.toLowerCase() && (
                        <p className="text-xs font-semibold text-status-error bg-white p-2.5 rounded-xl border border-red-200">
                          Your current account ({currentUser.email}) does not match the customer email on file ({order.customerEmail}). You can sign in with {order.customerEmail}, or enter the 6-digit access PIN below.
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="pt-2">
                      <Link
                        href={signInRedirectUrl}
                        className="block w-full text-center rounded-xl bg-brand-blue-primary py-3 text-xs font-bold text-white hover:bg-sky-600 transition shadow-xs"
                      >
                        Sign In with Customer Email →
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Visual Divider between Customer Account and Guest/Family PIN */}
              {hasCustomerEmail && (
                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border-default" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-3 text-[11px] font-bold text-text-tertiary">
                      — OR ENTER 6-DIGIT PIN FOR GUESTS &amp; FAMILY —
                    </span>
                  </div>
                </div>
              )}

              {/* Option 2: 6-Digit Access PIN (Available for Guests, Friends & Family) */}
              <div className="space-y-4 text-left rounded-2xl bg-surface-app/70 p-5 border border-border-default">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-text-primary block">
                    6-Digit Access PIN
                  </label>
                  <span className="text-[10px] font-semibold text-text-tertiary">
                    Friends, Family &amp; Guests
                  </span>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Enter the 6-digit access PIN provided by <strong className="text-text-primary">{order.studioName}</strong> or the couple to view order status and gallery previews.
                </p>

                <form onSubmit={handleVerifyPasskey} className="space-y-3">
                  <div>
                    <input
                      type="text"
                      maxLength={6}
                      value={enteredPasskey}
                      onChange={(e) => {
                        setEnteredPasskey(e.target.value.replace(/\D/g, "").slice(0, 6));
                        if (passkeyError) setPasskeyError(null);
                      }}
                      placeholder="Enter 6-digit PIN"
                      className="w-full rounded-2xl border border-border-default bg-white px-4 py-3 text-center font-mono text-lg font-bold tracking-widest text-text-primary outline-none focus:border-brand-blue-primary focus:ring-2 focus:ring-brand-blue-soft transition"
                    />
                    {passkeyError && (
                      <p className="mt-2 text-xs font-semibold text-status-error">{passkeyError}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-2xl bg-brand-blue-primary py-3.5 text-xs font-bold text-white hover:bg-sky-600 transition shadow-xs"
                  >
                    Unlock Order Details
                  </button>
                </form>
              </div>
            </div>
          </div>
        </main>

        <footer className="border-t border-border-default bg-white py-8">
          <div className="mx-auto max-w-7xl px-4 text-center text-xs text-text-tertiary sm:px-6 lg:px-8">
            © {new Date().getFullYear()} ThreadSafe Focoman. All rights reserved. | Focus beyond the frames
          </div>
        </footer>
      </div>
    );
  }

  // UNLOCKED STATE: Display full order tracking page
  const userEmail = currentUser?.email?.toLowerCase();
  const isOwnerMatch = Boolean(
    currentUser &&
    ((userEmail && order.studioOwnerEmail && userEmail === order.studioOwnerEmail.toLowerCase()) ||
    (order.studioOwnerId && order.studioOwnerId === currentUser.uid))
  );

  const isStaffMatch = Boolean(
    currentUser &&
    (isOwnerMatch ||
    (userEmail && order.staffEmails && order.staffEmails.includes(userEmail)) ||
    (order.staffUids && currentUser && order.staffUids.includes(currentUser.uid)))
  );

  const signInRedirectUrl = `/sign-in?redirect=${encodeURIComponent(`/track/${rawIdentifier}`)}&autoSync=true`;

  return (
    <div className="min-h-screen bg-surface-app text-text-primary flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col p-4 py-12">
        <div className="mx-auto w-full max-w-4xl space-y-6">

          {/* Guest Blurb: prompt guest viewers to sign in and auto-associate */}
          {!currentUser && (
            <div className="rounded-2xl border border-brand-blue-soft bg-brand-blue-background/80 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-blue-primary text-white shrink-0 text-sm font-bold">
                  👤
                </div>
                <div>
                  <p className="text-xs font-bold text-text-primary">Viewing as Guest</p>
                  <p className="text-xs text-text-secondary mt-0.5">
                    Sign in to associate this order with your account for 1-click tracking, automated status updates, and deliverables access anytime.
                  </p>
                </div>
              </div>
              <Link
                href={signInRedirectUrl}
                className="rounded-xl bg-brand-blue-primary px-4 py-2 text-xs font-bold text-white hover:bg-sky-600 transition shrink-0 shadow-xs"
              >
                Sign In to Associate
              </Link>
            </div>
          )}

          {/* Studio Staff Recognition: Never show sync banner to studio owners or crew members */}
          {isStaffMatch && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-3.5 px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-200 text-emerald-800 text-[11px] font-bold">
                  ✓
                </span>
                <div>
                  <p className="font-bold text-emerald-950">
                    Studio Access: {isOwnerMatch ? "Studio Owner" : "Crew Member"} ({currentUser?.email})
                  </p>
                  <p className="text-[11px] text-emerald-800 mt-0.5">
                    Authenticated with your studio credentials. Passkey is bypassed automatically.
                  </p>
                </div>
              </div>
              {order.studioId && (
                <Link
                  href={`/${order.studioId}/dashboard/oms`}
                  className="rounded-xl border border-emerald-600 bg-white px-3.5 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition shrink-0"
                >
                  Open in Studio OMS →
                </Link>
              )}
            </div>
          )}

          {/* Customer Sync Banner: Only shown to customers, never to studio owners or crew members */}
          {currentUser && !isStaffMatch && !syncSuccess && order.customerUid !== currentUser.uid && (
            <div className="rounded-2xl border border-brand-blue-soft bg-brand-blue-background/80 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-brand-blue-primary block">Sync Order to Account</span>
                <p className="text-xs text-text-secondary mt-0.5">
                  Link this order to <strong className="text-text-primary">{currentUser.email}</strong>. Once synced, you will never be asked for a passkey again when logged in.
                </p>
                {syncError && <p className="text-xs font-semibold text-status-error mt-1">{syncError}</p>}
              </div>
              <button
                type="button"
                onClick={handleSyncToAccount}
                disabled={isSyncing}
                className="rounded-xl bg-brand-blue-primary px-4 py-2 text-xs font-bold text-white hover:bg-sky-600 transition shrink-0 disabled:opacity-50"
              >
                {isSyncing ? "Syncing..." : "Sync Order to Account"}
              </button>
            </div>
          )}

          {syncSuccess && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800">
              Order successfully synced to your account ({currentUser?.email}). Passkey will no longer be required when logged in.
            </div>
          )}

          {/* Order Details Header Card */}
          <div className="rounded-3xl border border-border-default bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border-divider pb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-brand-blue-primary">
                  Order Tracking
                </span>
                <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl">
                  {order.eventType}
                </h1>
                <p className="mt-1 text-sm text-text-secondary">
                  Order Number: <span className="font-semibold text-text-primary">{order.orderNumber}</span>
                </p>
              </div>
              <div className="text-left sm:text-right">
                <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold shadow-xs ${
                  isCompleted ? "bg-emerald-100 text-emerald-800 border border-emerald-300" : 
                  order.orderStatus === "POST_EVENT_IN_PROGRESS" ? "bg-amber-100 text-amber-800 border border-amber-300" :
                  "bg-sky-100 text-sky-800 border border-sky-300"
                }`}>
                  {STATUS_LABELS[order.orderStatus]}
                </div>
              </div>
            </div>

            {/* Event Details Grid */}
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-text-tertiary">Customer</span>
                <p className="mt-1 text-sm font-semibold text-text-primary">{order.customerName}</p>
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-text-tertiary">Date</span>
                <p className="mt-1 text-sm font-semibold text-text-primary">
                  {new Date(order.eventDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-text-tertiary">Location</span>
                <p className="mt-1 text-sm font-semibold text-text-primary truncate">
                  {order.eventLocation || "Studio Venue"}
                </p>
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-text-tertiary">Services</span>
                <p className="mt-1 text-sm font-semibold text-text-primary truncate">
                  {order.services.join(", ")}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="rounded-3xl border border-border-default bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold text-text-primary mb-4">Payment Summary</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl bg-surface-app p-4 border border-border-default">
                <span className="text-xs text-text-tertiary block">Total Value</span>
                <span className="text-lg font-extrabold text-text-primary mt-1 block">
                  ₹{order.totalAmount.toLocaleString()}
                </span>
              </div>
              <div className="rounded-2xl bg-emerald-50/60 p-4 border border-emerald-200">
                <span className="text-xs text-emerald-800 block">Advance Paid</span>
                <span className="text-lg font-extrabold text-emerald-900 mt-1 block">
                  ₹{order.advanceAmount.toLocaleString()}
                </span>
              </div>
              <div className="rounded-2xl bg-surface-app p-4 border border-border-default">
                <span className="text-xs text-text-tertiary block">Remaining Balance</span>
                <span className="text-lg font-extrabold text-text-primary mt-1 block">
                  ₹{order.remainingAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Production Status */}
          <div className="rounded-3xl border border-border-default bg-white p-6 shadow-sm sm:p-8 space-y-4">
            <h2 className="text-lg font-bold text-text-primary">Production Status</h2>
            {tasks.length === 0 ? (
              <p className="text-xs text-text-tertiary italic">Production milestones are being organized by the studio.</p>
            ) : (
              <div className="divide-y divide-border-divider">
                {tasks.map((task, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-text-primary">{task.title}</p>
                      <p className="text-[10px] sm:text-xs text-text-tertiary uppercase tracking-wider mt-0.5">
                        {task.serviceCategory}
                      </p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                      task.status === "COMPLETED"
                        ? "bg-emerald-100 text-emerald-800"
                        : task.status === "IN_PROGRESS"
                        ? "bg-blue-100 text-brand-blue-primary"
                        : "bg-slate-100 text-slate-700"
                    }`}>
                      {TASK_STATUS_LABELS[task.status] || task.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Google Drive Shoot Gallery & Deliverables */}
          <div className="rounded-3xl border border-border-default bg-white p-6 shadow-sm sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-border-divider pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-blue-soft/50 text-brand-blue-primary font-black text-sm">
                  GD
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-text-primary">
                    Google Drive Shoot Gallery &amp; Deliverables
                  </h2>
                  <p className="text-xs text-text-secondary">
                    Review thumbnails and download confirmed edits directly inside your portal without logging into Google.
                  </p>
                </div>
              </div>
              <span className="hidden sm:inline-flex rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                In-App Preview Active
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { name: "Preview_01.jpg", type: "RAW Select", status: "Approved" },
                { name: "Preview_02.jpg", type: "RAW Select", status: "Approved" },
                { name: "Teaser_Reel.mp4", type: "Video Edit", status: "Ready" },
                { name: "Master_Album.pdf", type: "Album Draft", status: "Review" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-2xl border border-border-default bg-surface-app/40 p-3.5 text-xs transition hover:bg-surface-app"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-brand-blue-primary font-bold text-[10px] border border-border-default shrink-0">
                      IMG
                    </span>
                    <div className="min-w-0">
                      <p className="font-bold text-text-primary truncate">{item.name}</p>
                      <p className="text-[10px] text-text-tertiary">{item.type}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold text-slate-700 shrink-0">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      <footer className="border-t border-border-default bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-xs text-text-tertiary sm:px-6 lg:px-8">
          © {new Date().getFullYear()} ThreadSafe Focoman. All rights reserved. | Focus beyond the frames
        </div>
      </footer>
    </div>
  );
}
