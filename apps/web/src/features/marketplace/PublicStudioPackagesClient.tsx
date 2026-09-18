"use client";

import { useState } from "react";
import { StudioPackage, BookingRequest } from "@focoman/types";
import { createBookingRequestAction, recordPaymentAction } from "@/actions/marketplaceActions";
import { subscribeToAuthState } from "@/lib/firebaseAuth";
import { useEffect } from "react";
import { User } from "firebase/auth";

export function PublicStudioPackagesClient({
  studioId,
  packages,
}: {
  studioId: string;
  packages: StudioPackage[];
}) {
  const [user, setUser] = useState<User | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<StudioPackage | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRequest | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [eventType, setEventType] = useState("Wedding");
  const [eventDate, setEventDate] = useState("");
  const [address, setAddress] = useState("");
  const [mapsUrl, setMapsUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [requestNegotiation, setRequestNegotiation] = useState(false);

  // Optional advance payment recording
  const [recordPaymentNow, setRecordPaymentNow] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "CASH" | "BANK_TRANSFER" | "OTHER">("UPI");
  const [paymentReference, setPaymentReference] = useState("");

  useEffect(() => {
    const unsub = subscribeToAuthState((u) => {
      setUser(u);
      if (u) {
        if (u.displayName) setCustomerName(u.displayName);
        if (u.email) setCustomerEmail(u.email);
      }
    });
    return () => unsub();
  }, []);

  const handleOpenBooking = (pkg?: StudioPackage) => {
    setSelectedPackage(pkg || null);
    if (pkg) {
      setEventType(pkg.services[0] || "Photography");
      setRequestNegotiation(false);
      setPaymentAmount(Math.round(pkg.price * 0.3));
    }
    setError(null);
    setConfirmedBooking(null);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !eventDate || !address) {
      setError("Please fill in all required fields (Name, Event Date, and Address).");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const idToken = user ? await user.getIdToken() : undefined;
      const price = selectedPackage ? selectedPackage.price : 0;

      const res = await createBookingRequestAction(
        {
          studioId,
          packageId: selectedPackage?.id,
          packageName: selectedPackage?.name,
          customerName,
          customerEmail,
          customerPhone,
          eventType,
          eventDate,
          address,
          mapsUrl: mapsUrl || undefined,
          notes: notes || undefined,
          price,
          requestNegotiation: selectedPackage?.isNegotiable ? requestNegotiation : false,
        },
        idToken
      );

      if (!res.success || !res.bookingRequest) {
        setError(res.error || "Failed to create booking request");
        setSubmitting(false);
        return;
      }

      const booking = res.bookingRequest;

      // If customer wants to record payment right away (e.g. offline UPI/Cash)
      if (recordPaymentNow && paymentAmount > 0) {
        await recordPaymentAction(
          {
            bookingRequestId: booking.id,
            studioId,
            customerId: booking.customerId,
            amount: paymentAmount,
            method: paymentMethod,
            referenceNumber: paymentReference || undefined,
          },
          idToken
        );
      }

      setConfirmedBooking(booking);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border-divider pb-4">
        <div>
          <h2 className="text-xl font-bold text-text-primary">Studio Packages & Services</h2>
          <p className="text-xs text-text-secondary mt-1">
            Choose a package or request a tailored event booking directly with this studio.
          </p>
        </div>
        <button
          onClick={() => handleOpenBooking()}
          className="rounded-xl bg-text-primary px-4 py-2 text-xs font-bold text-white hover:bg-black transition shadow-sm"
        >
          Custom Booking Request
        </button>
      </div>

      {packages.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border-default p-8 text-center bg-surface-app">
          <p className="text-sm font-semibold text-text-secondary">No public packages published yet.</p>
          <p className="text-xs text-text-tertiary mt-1">
            You can still submit a direct custom booking request using the button above.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="flex flex-col justify-between rounded-2xl border border-border-default bg-white p-6 shadow-sm hover:border-text-primary transition"
            >
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-text-primary">{pkg.name}</h3>
                    <p className="text-2xl font-extrabold text-text-primary mt-2">
                      ₹{pkg.price.toLocaleString("en-IN")}
                    </p>
                  </div>
                  {pkg.isNegotiable ? (
                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700 border border-blue-200">
                      Negotiable
                    </span>
                  ) : (
                    <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-700 border border-gray-200">
                      Fixed Price
                    </span>
                  )}
                </div>

                {pkg.description && (
                  <p className="text-xs text-text-secondary mt-3 leading-relaxed">
                    {pkg.description}
                  </p>
                )}

                {pkg.services && pkg.services.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {pkg.services.map((svc) => (
                      <span
                        key={svc}
                        className="rounded-lg bg-surface-app px-2 py-1 text-[10px] font-medium text-text-secondary border border-border-default"
                      >
                        {svc}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-border-divider">
                <button
                  onClick={() => handleOpenBooking(pkg)}
                  className="w-full rounded-xl bg-brand-blue-primary py-2.5 text-xs font-bold text-white hover:bg-sky-600 transition shadow-sm"
                >
                  Book Package
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-border-default my-8 max-h-[90vh] overflow-y-auto">
            {confirmedBooking ? (
              <div className="text-center py-4 space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-status-success">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-extrabold text-text-primary">
                  {confirmedBooking.isNegotiable ? "Negotiation Request Submitted!" : "Booking Request Received!"}
                </h3>
                <p className="text-xs text-text-secondary max-w-sm mx-auto">
                  Your reference ID is <span className="font-mono font-bold text-text-primary">{confirmedBooking.id}</span>. The studio has been notified and will review your request.
                </p>

                <div className="rounded-2xl bg-surface-app p-4 text-left text-xs space-y-2 border border-border-default">
                  <div className="flex justify-between">
                    <span className="text-text-tertiary">Event Date:</span>
                    <span className="font-semibold text-text-primary">{confirmedBooking.eventDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-tertiary">Status:</span>
                    <span className="font-bold uppercase text-brand-blue-primary">{confirmedBooking.bookingStatus}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-tertiary">Agreed/Requested Price:</span>
                    <span className="font-bold text-text-primary">₹{confirmedBooking.agreedPrice.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-tertiary">Advance Requested:</span>
                    <span className="font-bold text-text-primary">₹{confirmedBooking.advanceRequested.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <div className="pt-4 flex justify-center">
                  <button
                    onClick={() => setShowModal(false)}
                    className="rounded-xl bg-text-primary px-6 py-2.5 text-xs font-bold text-white hover:bg-black transition"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-between border-b border-border-divider pb-3">
                  <div>
                    <h3 className="text-lg font-bold text-text-primary">
                      {selectedPackage ? `Book: ${selectedPackage.name}` : "Request Event Booking"}
                    </h3>
                    {selectedPackage && (
                      <p className="text-xs text-text-secondary mt-0.5">
                        Base Price: ₹{selectedPackage.price.toLocaleString("en-IN")}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="rounded-lg p-1.5 text-text-tertiary hover:text-text-primary"
                  >
                    ✕
                  </button>
                </div>

                {error && (
                  <div className="rounded-xl bg-red-50 p-3 text-xs font-semibold text-status-error border border-red-200">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-text-primary mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full rounded-xl border border-border-input px-3 py-2 text-xs focus:ring-1 focus:ring-brand-blue-primary"
                      placeholder="e.g. Anand Kumar"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-primary mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full rounded-xl border border-border-input px-3 py-2 text-xs focus:ring-1 focus:ring-brand-blue-primary"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">Email Address</label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full rounded-xl border border-border-input px-3 py-2 text-xs focus:ring-1 focus:ring-brand-blue-primary"
                    placeholder="anand@example.com"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-text-primary mb-1">Event Type *</label>
                    <input
                      type="text"
                      required
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                      className="w-full rounded-xl border border-border-input px-3 py-2 text-xs focus:ring-1 focus:ring-brand-blue-primary"
                      placeholder="e.g. Wedding, Reception, Birthday"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-primary mb-1">Event Date *</label>
                    <input
                      type="date"
                      required
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full rounded-xl border border-border-input px-3 py-2 text-xs focus:ring-1 focus:ring-brand-blue-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">Event Location / Venue Address *</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full rounded-xl border border-border-input px-3 py-2 text-xs focus:ring-1 focus:ring-brand-blue-primary"
                    placeholder="e.g. Royal Palace Hall, MG Road, Bangalore"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">Google Maps Link (Optional)</label>
                  <input
                    type="url"
                    value={mapsUrl}
                    onChange={(e) => setMapsUrl(e.target.value)}
                    className="w-full rounded-xl border border-border-input px-3 py-2 text-xs focus:ring-1 focus:ring-brand-blue-primary"
                    placeholder="https://maps.google.com/..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">Notes / Special Requests</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full rounded-xl border border-border-input px-3 py-2 text-xs focus:ring-1 focus:ring-brand-blue-primary"
                    placeholder="Any specific timings, drone requirements, or album preferences..."
                  />
                </div>

                {/* Negotiation Option */}
                {selectedPackage?.isNegotiable && (
                  <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-3 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-blue-900">Request Price Negotiation</span>
                      <p className="text-[10px] text-blue-700">This package allows negotiable pricing. Studio owner will review and agree on final amount.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={requestNegotiation}
                      onChange={(e) => setRequestNegotiation(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-brand-blue-primary focus:ring-brand-blue-primary"
                    />
                  </div>
                )}

                {/* Advance Payment Submission Option */}
                <div className="rounded-xl border border-border-default bg-surface-app p-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-text-primary">Record Advance Payment (Optional)</span>
                      <p className="text-[10px] text-text-secondary">Have you already paid an advance via UPI or Cash?</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={recordPaymentNow}
                      onChange={(e) => setRecordPaymentNow(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-brand-blue-primary focus:ring-brand-blue-primary"
                    />
                  </div>

                  {recordPaymentNow && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-border-divider">
                      <div>
                        <label className="block text-[10px] font-semibold text-text-primary mb-1">Amount Paid (₹)</label>
                        <input
                          type="number"
                          value={paymentAmount}
                          onChange={(e) => setPaymentAmount(Number(e.target.value))}
                          className="w-full rounded-lg border border-border-input px-2 py-1.5 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-text-primary mb-1">Method</label>
                        <select
                          value={paymentMethod}
                          onChange={(e) => setPaymentMethod(e.target.value as any)}
                          className="w-full rounded-lg border border-border-input px-2 py-1.5 text-xs"
                        >
                          <option value="UPI">UPI</option>
                          <option value="CASH">Cash</option>
                          <option value="BANK_TRANSFER">Bank Transfer</option>
                          <option value="OTHER">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-text-primary mb-1">Reference / UTR</label>
                        <input
                          type="text"
                          value={paymentReference}
                          onChange={(e) => setPaymentReference(e.target.value)}
                          placeholder="UPI Transaction ID"
                          className="w-full rounded-lg border border-border-input px-2 py-1.5 text-xs"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="rounded-xl border border-border-default px-4 py-2 text-xs font-semibold text-text-secondary hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-xl bg-brand-blue-primary px-5 py-2 text-xs font-bold text-white hover:bg-sky-600 disabled:opacity-50 transition shadow-sm"
                  >
                    {submitting ? "Submitting..." : requestNegotiation ? "Submit Negotiation Request" : "Confirm Booking Request"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
