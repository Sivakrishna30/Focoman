# ERP Invoicing & Payment Receipts Roadmap Checklist

This document tracks the upcoming ERP Invoicing, Advance Receipt, and Billing features for Focoman studios.

## 1. Overview & Objectives
Provide studio owners with professional, legally compliant, and branded PDF invoices and payment receipts that can be downloaded, printed, or sent via WhatsApp/Email.

---

## 2. Core Components to Build

### A. Tax & Non-Tax Invoice Generation
- **Studio Header Information**:
  - Studio Name, Logo, Physical Address, Phone, Support Email.
  - GSTIN (Goods and Services Tax Identification Number) - optional for unregistered studios.
- **Client & Event Details**:
  - Client Full Name, Phone, Email, Billing Address.
  - Event Dates, Event Types (Wedding, Reception, Birthday, Corporate), Venue/City.
- **Line Items & Services**:
  - HSN/SAC Code: **9983** (Official Indian SAC for Photographic & Videographic Services).
  - Itemized breakdowns (e.g. Traditional Photo, Candid Photo, Cinematic Video, Drone, Photobook Album).
  - Rates, quantities, discounts, and taxable value.
- **GST Calculation (Indian Tax Standard)**:
  - Intra-state (Within Tamil Nadu): CGST (9%) + SGST (9%) = 18%.
  - Inter-state: IGST (18%).
  - Non-GST / Composition Studio mode: Clean non-tax bill without GST breakup.
- **Payment & Bank Settlement**:
  - Bank Account Name, Account Number, IFSC Code, Branch.
  - Studio UPI ID & Dynamic UPI QR Code for instant scan-and-pay.
  - Terms & conditions / Cancellation & delivery policy.

### B. Payment Receipts (Advance & Balance Milestones)
- **Advance Payment Receipt**:
  - Issued immediately upon booking confirmation / token advance.
  - Explicit record of: Amount Paid, Date Received, Payment Mode (Cash, UPI, NEFT, Cheque), Balance Outstanding.
- **Interim / Progress Milestone Receipts**:
  - Stage-wise payments (e.g., Shoot day completion, Album layout approval).
- **Final Settlement Receipt**:
  - Clear "PAID IN FULL" zero-balance clearance certificate accompanying media delivery.

### C. Technical Implementation Architecture
- **PDF Engine**: `@react-pdf/renderer` or server-side headless PDF generator.
- **Storage**: Firestore payment ledger subcollection (`studios/{studioId}/orders/{orderId}/payments/{paymentId}`).
- **Actions**:
  - `generateInvoicePdfAction(orderId, studioSlug)`
  - `recordPaymentMilestoneAction(orderId, paymentData)`
  - `sendInvoiceEmailAction(orderId, customerEmail)`
  - `shareInvoiceWhatsAppAction(orderId, customerPhone)`

---

## 3. Checklist Status
- [ ] Database Schema: Add `invoices` & `payments` subcollections under Orders
- [ ] SAC 9983 & GST rate presets in Studio Settings
- [ ] Bank details & UPI QR Code configuration in Studio Settings
- [ ] Dynamic PDF Generator component (React PDF / Clean HTML Print View)
- [ ] Download PDF button in OMS & Customer Tracking Portal
- [ ] Email & WhatsApp dispatch with attached PDF link

---

## 4. Phase 1 vs Phase 2 Strategy: Pragmatic Minimal Invoicing & Crew Payouts

Per user architectural review on 2026-10-28: Complex statutory HR compliance (PF, ESI, biometric attendance, and automated corporate banking APIs) is **out of scope for Phase 1** and deferred to Phase 2. The MVP focuses on a lightweight, pragmatic system tailored to how real wedding & event photography studios operate.

### Phase 1 (Minimal & High-Impact):
1. **Minimal Client Invoice & Receipt**:
   - Clean printable/PDF format with Studio Header, Client Details, Event Date & Venue.
   - Line items: Photography, Videography, Drone, Album.
   - Optional GST (CGST/SGST/IGST) or clean non-tax bill.
   - Advance paid, milestone paid & balance due.
   - Dynamic UPI QR Code (Scan to pay via GPay/PhonePe).
   - One-click Print/Download & WhatsApp Web share link.
2. **Freelance Crew Payout Summary ("The Shoot IS Attendance")**:
   - In FocoMan, attendance is naturally derived from confirmed order event dates and assigned crew.
   - Monthly summary per member: Number of shoots attended + production/editing tasks completed.
   - Estimated total based on saved crew day-rate.
   - Studio owner reviews, enters the final amount paid, selects payment mode (GPay, UPI, Cash, Bank Transfer), and clicks **Record Payment**.
   - Generates a clean 1-page **Crew Payout Voucher / Simple Payslip**.
   - **Manual Disbursement**: Studio owner transfers via their normal banking/UPI app and records the reference. Zero banking API risk or payment gateway KYC friction.

### Phase 2 (Deferred to Future):
- Full-time fixed salaried staff payroll with monthly salary adjustments.
- Automated bulk salary disbursement via RazorpayX / Cashfree Banking API.
- Optional statutory PF (12%), ESI, and Professional Tax calculations for studios with 20+ employees.

