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
- [ ] Dynamic PDF Generator component (React PDF)
- [ ] Download PDF button in OMS & Customer Tracking Portal
- [ ] Email & WhatsApp dispatch with attached PDF link
