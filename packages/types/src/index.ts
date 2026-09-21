/**
 * Focoman Shared Domain Types
 * Primary Product Source of Truth: Focoman Product Discovery Document
 */

/**
 * PLAN & ENTITLEMENT TYPES (CHG-027 Capability-Based Pricing Model)
 */
export type PlanType = 'FREE' | 'STARTER' | 'PROFESSIONAL' | 'COMPLETE' | 'CUSTOM';

export type CapabilityId =
  // Primary Capability-Based Pricing IDs
  | 'OMS_BASIC'              // Free Core: Basic Order Management (₹0)
  | 'CUSTOMER_BASIC'         // Customer Management Basic (₹199/mo)
  | 'CUSTOMER_ADVANCED'      // Customer Management Advanced (₹299/mo)
  | 'CREW_BASIC'             // Crew Management Basic (₹199/mo)
  | 'CREW_ADVANCED'          // Crew Management Advanced (₹299/mo)
  | 'MARKETPLACE'            // Studio Marketplace (₹499/mo)
  | 'DRIVE_CLIENT_REVIEW'    // Google Drive + Client Review (₹299/mo)
  | 'WHATSAPP_NOTIFICATIONS' // WhatsApp Notifications (₹199/mo)
  | 'WHATSAPP_OPERATIONS'    // WhatsApp Operations (₹499/mo)
  // Backward compatibility legacy aliases
  | 'OMS_CORE'
  | 'CUSTOMER_CRM'
  | 'TEAM_MANAGEMENT'
  | 'MANUAL_ASSIGNMENT'
  | 'MARKETPLACE_CONFIGURATION'
  | 'MARKETPLACE_PUBLIC'
  | 'BOOKING_REQUESTS'
  | 'NEGOTIATION'
  | 'PAYMENT_RECORDING'
  | 'PAYMENT_VERIFICATION'
  | 'ERP_BASIC'
  | 'ERP_AVAILABILITY'
  | 'ERP_WORKLOAD'
  | 'ERP_CONFLICT_DETECTION'
  | 'ERP_RESOURCE_SUGGESTION'
  | 'ERP_SMART_RESOURCE_AUTOMATION'
  | 'GOOGLE_CALENDAR'
  | 'GOOGLE_DRIVE'
  | 'AUTOMATION_BASIC'
  | 'AUTOMATION_ADVANCED'
  | 'ANALYTICS_BASIC'
  | 'ANALYTICS_ADVANCED'
  | 'WHATSAPP_BOT'
  | 'MULTI_STUDIO'
  | 'ADVANCED_INTEGRATIONS';

export interface CapabilityMetadata {
  id: CapabilityId;
  name: string;
  category: 'FREE_CORE' | 'CUSTOMER_MANAGEMENT' | 'CREW_MANAGEMENT' | 'STUDIO_MARKETPLACE' | 'DRIVE_CLIENT_REVIEW' | 'WHATSAPP';
  price: number;
  description: string;
  valueProp: string;
  includedCapabilities?: CapabilityId[];
  dependencies?: CapabilityId[];
  features: string[];
  limitations?: string[];
  isFreeCore?: boolean;
  studioScoped: boolean;
}

export interface StudioPlan {
  plan?: PlanType;
  selectedCapabilities: CapabilityId[];
  isTrial?: boolean;
  trialStartedAt?: string;
  trialExpiresAt?: string;
  updatedAt: string;
}


export type BookingStatus =
  | 'BOOKING_REQUEST'
  | 'OPEN_FOR_NEGOTIATION'
  | 'AWAITING_PAYMENT'
  | 'PAYMENT_VERIFICATION'
  | 'BOOKING_CONFIRMED'
  | 'CANCELLED'
  | 'COMPLETED';

export type OrderStatus = 'AWAITING_EVENT' | 'POST_EVENT_IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export type TaskStatus = 'ASSIGNED' | 'IN_PROGRESS' | 'REVIEW' | 'REWORK' | 'COMPLETED';

export type PaymentStatus =
  | 'PENDING'
  | 'PAYMENT_SUBMITTED'
  | 'PENDING_VERIFICATION'
  | 'PARTIAL'
  | 'PAID'
  | 'OVERDUE';

export type PaymentMethod = 'CASH' | 'UPI' | 'BANK_TRANSFER' | 'ONLINE_GATEWAY' | 'OTHER';

export type PaymentVerificationStatus = 'PENDING_VERIFICATION' | 'VERIFIED' | 'REJECTED';

export interface SoftDeletable {
  isDeleted?: boolean;
  deletedAt?: string | null;
  deletedBy?: string | null;
}

export interface StudioPackage extends SoftDeletable {
  id: string;
  studioId: string;
  name: string;
  description?: string;
  services: string[]; // Category or service names
  price: number;
  isNegotiable: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentProof {
  proofUrl?: string;
  referenceNumber?: string;
  notes?: string;
  uploadedAt: string;
}

export interface PaymentRecord extends SoftDeletable {
  id: string;
  orderId?: string;
  bookingRequestId?: string;
  studioId: string;
  customerId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  verificationStatus: PaymentVerificationStatus;
  proof?: PaymentProof;
  verifiedBy?: string;
  verifiedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventLocationInfo {
  address: string;
  mapsUrl?: string;
  latitude?: number;
  longitude?: number;
  notes?: string;
}

export interface PreflightConflictReport {
  hasConflicts: boolean;
  eventDateConflicts: {
    orderId: string;
    orderNumber: string;
    eventType: string;
  }[];
  resourceConflicts: {
    memberId: string;
    memberName: string;
    role: string;
    conflictingOrderId: string;
  }[];
  warnings: string[];
  suggestions: string[];
  evaluatedAt: string;
}

export interface ResourceSuggestion {
  memberId: string;
  memberName: string;
  skill: string;
  matchScore: number;
  matchReason: string;
  availableOnDate: boolean;
  currentWorkload: number; // Number of assigned active tasks
  status: 'SUGGESTED' | 'CONFIRMED' | 'REJECTED';
}

export interface BookingRequest extends SoftDeletable {
  id: string;
  studioId: string;
  customerId: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  packageId?: string;
  packageName?: string;
  eventType: string;
  eventDate: string; // YYYY-MM-DD
  location: EventLocationInfo;
  notes?: string;
  originalPrice: number;
  negotiatedPrice?: number;
  agreedPrice: number;
  advanceRequested: number;
  isNegotiable: boolean;
  bookingStatus: BookingStatus;
  orderId?: string;
  cancellationReason?: string;
  cancelledBy?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CancellationInfo {
  cancellationReason: string;
  cancelledBy: string;
  cancelledAt: string;
  refundNotes?: string;
}

export interface CustomerOrderView {
  id: string;
  orderNumber: string;
  studioName: string;
  studioId: string;
  eventType: string;
  eventDate: string;
  eventLocation?: string;
  services: string[];
  totalAmount: number;
  advanceAmount: number;
  amountPaid: number;
  remainingAmount: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  bookingStatus?: BookingStatus;
  trackingPasskey: string;
  createdAt: string;
  updatedAt: string;
}

export interface Studio extends SoftDeletable {
  id: string;
  name: string;
  // Plan information (CHG-026)
  planInfo?: StudioPlan;

  city: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone?: string;
  whatsappConfig?: Record<string, boolean>;
  features?: {
    oms: boolean;
    crm: boolean;
    erp: boolean;
    whatsapp: boolean;
    marketplace: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface MarketplaceProfile extends SoftDeletable {
  id: string; // Typically matches studioId
  studioId: string;
  name: string;
  slug: string;
  city: string;
  description?: string;
  tags: string[]; // e.g. ['WEDDING', 'PORTRAIT', 'CORPORATE']
  coverImageUrl?: string;
  isVisible: boolean;
  verifiedMetrics: {
    onTimeDeliveryPercentage: number;
    completedOrdersCount: number;
    lastCalculatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface StudioMember extends SoftDeletable {
  id: string;
  studioId: string;
  name: string;
  email: string;
  phone?: string;
  skills: string[]; // e.g. ['PHOTOGRAPHY', 'VIDEOGRAPHY', 'PHOTO_EDITING', 'ALBUM_DESIGN']
  status?: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface StudioMembership extends SoftDeletable {
  id: string; // composite: {studioId}_{uid}
  studioId: string;
  studioName: string;
  uid: string;
  role: 'STUDIO_OWNER' | 'STUDIO_MEMBER';
  skills?: string[];
  status: 'ACTIVE' | 'INACTIVE';
  joinedAt: string;
  updatedAt: string;
}

export interface StudioInvitation extends SoftDeletable {
  id: string; // unique single-use invite code / token, e.g. INV-A92B-4F8C
  studioId: string;
  studioName: string;
  email: string;
  name?: string;
  skills: string[];
  role: 'STUDIO_MEMBER';
  status: 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'REVOKED';
  invitedByUid: string;
  createdAt: string;
  acceptedAt?: string;
  acceptedByUid?: string;
}

export interface Customer extends SoftDeletable {
  id: string;
  studioId: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  studioId: string;
  name: string;
  category: 'PHOTOGRAPHY' | 'VIDEOGRAPHY' | 'ALBUM' | 'GENERAL';
  defaultPrice: number;
}

export interface Package {
  id: string;
  studioId: string;
  name: string;
  serviceIds: string[];
  packagePrice: number;
}

export interface ResourceAssignment {
  memberId: string;
  memberName: string;
  skill: string;
  availabilityConfirmed: boolean | null; // null = pending, true = confirmed, false = rejected
}

export interface OrderPricing {
  estimatedPrice: number;
  finalConfirmedPrice: number;
  advanceAmount: number;
  remainingAmount: number;
}

export interface Order extends SoftDeletable {
  id: string;
  studioId: string;
  orderNumber: string; // e.g. ORD-1024
  bookingRequestId?: string;
  customer: {
    id: string;
    name: string;
    phone?: string;
    email?: string;
  };
  eventType: string;
  eventDate: string; // YYYY-MM-DD
  eventLocation?: string;
  locationInfo?: EventLocationInfo;
  services: string[];
  packages: string[];
  pricing: OrderPricing;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  bookingStatus?: BookingStatus;
  assignedResources: ResourceAssignment[];
  resourceSuggestions?: ResourceSuggestion[];
  preflightReport?: PreflightConflictReport;
  cancellationInfo?: CancellationInfo;
  trackingPasskey: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task extends SoftDeletable {
  id: string;
  orderId: string;
  studioId: string;
  title: string;
  serviceCategory: 'PHOTOGRAPHY' | 'VIDEOGRAPHY' | 'ALBUM' | 'GENERAL';
  assignedMemberId: string;
  assignedMemberName: string;
  status: TaskStatus;
  sequenceOrder: number;
  reworkNotes?: string;
  createdAt: string;
  updatedAt: string;
}

