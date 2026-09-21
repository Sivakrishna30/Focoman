/**
 * Shared Focoman Constants and System Configuration
 */
import type { CapabilityId, CapabilityMetadata } from '@focoman/types';

export const APP_NAME = 'Focoman';
export const APP_DESCRIPTION = 'Order Management System for Photographic Studios';

export const BOOKING_STATUSES = [
  'BOOKING_REQUEST',
  'OPEN_FOR_NEGOTIATION',
  'AWAITING_PAYMENT',
  'PAYMENT_VERIFICATION',
  'BOOKING_CONFIRMED',
  'CANCELLED',
  'COMPLETED'
] as const;

export const ORDER_STATUSES = ['AWAITING_EVENT', 'POST_EVENT_IN_PROGRESS', 'COMPLETED', 'CANCELLED'] as const;

export const TASK_STATUSES = ['ASSIGNED', 'IN_PROGRESS', 'REVIEW', 'REWORK', 'COMPLETED'] as const;

export const PAYMENT_STATUSES = [
  'PENDING',
  'PAYMENT_SUBMITTED',
  'PENDING_VERIFICATION',
  'PARTIAL',
  'PAID',
  'OVERDUE'
] as const;

export const PAYMENT_METHODS = ['CASH', 'UPI', 'BANK_TRANSFER', 'ONLINE_GATEWAY', 'OTHER'] as const;

export const PAYMENT_VERIFICATION_STATUSES = ['PENDING_VERIFICATION', 'VERIFIED', 'REJECTED'] as const;

export const DEFAULT_SERVICES = [
  { name: 'Traditional Photography', category: 'PHOTOGRAPHY' },
  { name: 'Candid Photography', category: 'PHOTOGRAPHY' },
  { name: 'Videography', category: 'VIDEOGRAPHY' },
  { name: 'Album Design & Printing', category: 'ALBUM' }
] as const;

/**
 * Standard Soft-Delete & Data Retention Configuration
 * Configurable recovery window before permanent administrative cleanup.
 */
export const RECOVERY_WINDOW_DAYS = 14;

/**
 * Flexible Capability-Based Pricing Model Catalog (CHG-027)
 */
export const FREE_CORE_CAPABILITY: CapabilityMetadata = {
  id: 'OMS_BASIC',
  name: 'Basic Order Management',
  category: 'FREE_CORE',
  price: 0,
  description: 'Essential Order Management System for photography and videography studios.',
  valueProp: 'Always ₹0 forever. No order volume caps or retention fees.',
  features: [
    'Create, view, and edit confirmed orders',
    'Order workflow status tracker for real-time progress updates',
    'Basic Crew and Customer information associated with each order',
    'Basic orders operational dashboard',
    'Unlimited orders and events forever',
  ],
  isFreeCore: true,
  studioScoped: true,
};

export const PURCHASABLE_CAPABILITIES: CapabilityMetadata[] = [
  {
    id: 'CUSTOMER_BASIC',
    name: 'Customer Management Basic',
    category: 'CUSTOMER_MANAGEMENT',
    price: 199,
    description: 'Central customer directory with profiles and order history.',
    valueProp: 'Organize client relationships and track lifetime value.',
    features: [
      'Customer directory and searchable profiles',
      'Customer order history',
      'Payment and receivables history',
      'Booking and inquiry history',
    ],
    studioScoped: true,
  },
  {
    id: 'CUSTOMER_ADVANCED',
    name: 'Customer Management Advanced',
    category: 'CUSTOMER_MANAGEMENT',
    price: 299,
    description: 'Smart customer re-engagement and milestone tracking.',
    valueProp: 'Automate anniversary reminders and repeat booking outreach.',
    includedCapabilities: ['CUSTOMER_BASIC'],
    features: [
      'Includes all Customer Management Basic capabilities',
      'Anniversary reminders & notifications',
      'Customer milestone reminders',
      'Re-engagement reminders based on previous events',
    ],
    studioScoped: true,
  },
  {
    id: 'CREW_BASIC',
    name: 'Crew Management Basic',
    category: 'CREW_MANAGEMENT',
    price: 199,
    description: 'Roster management, skills directory, and manual assignment.',
    valueProp: 'Streamline team coordination and task allocation.',
    features: [
      'Crew profiles, roles, and skills database',
      'Manual crew assignment to events and tasks',
      'Basic crew availability calendar',
      'Smart Resource Suggestions (Studio owner remains in control)',
    ],
    studioScoped: true,
  },
  {
    id: 'CREW_ADVANCED',
    name: 'Crew Management Advanced',
    category: 'CREW_MANAGEMENT',
    price: 299,
    description: 'Conflict detection, workload tracking, and automated suggestions.',
    valueProp: 'Avoid double-booking and balance crew workload seamlessly.',
    includedCapabilities: ['CREW_BASIC'],
    features: [
      'Includes all Crew Management Basic capabilities',
      'Crew workload tracking and allocation balance',
      'Advanced availability visibility',
      'Double-booking conflict detection',
      'Workload-aware resource suggestions (Suggests → Owner reviews → Owner confirms)',
    ],
    studioScoped: true,
  },
  {
    id: 'MARKETPLACE',
    name: 'Studio Marketplace',
    category: 'STUDIO_MARKETPLACE',
    price: 499,
    description: 'Public studio profile, packages directory, and incoming booking inquiries.',
    valueProp: 'Get discovered and receive direct client booking requests.',
    features: [
      'Public studio profile page with services, pricing, and availability',
      'Studio-configured packages and negotiable pricing settings',
      'Booking inquiries and inquiry history management',
      'Optional negotiation flow and agreed amount confirmation',
      'Direct confirmed order creation from bookings',
      'Confirmed events automatically sync to studio availability',
    ],
    studioScoped: true,
  },
  {
    id: 'DRIVE_CLIENT_REVIEW',
    name: 'OMS Advanced (Google Drive Preview & Photo Selection)',
    category: 'DRIVE_CLIENT_REVIEW',
    price: 299,
    description: 'In-app Google Drive photo previews, client commenting, and review status.',
    valueProp: 'In-app Google Drive preview, photo selection, and client comments without leaving your studio workflow.',
    features: [
      'Google Drive integration with order-linked Drive references',
      'Photo and file references linked to orders',
      'In-app client review interface',
      'Client photo selection & comments',
      'Review status tracking in production workflow',
    ],
    studioScoped: true,
  },
  {
    id: 'WHATSAPP_NOTIFICATIONS',
    name: 'WhatsApp Notifications',
    category: 'WHATSAPP',
    price: 199,
    description: 'Automated lifecycle event notifications for clients and crew.',
    valueProp: 'Keep clients and crew informed automatically at key milestones.',
    features: [
      'Fixed operational notification set across order lifecycle',
      'Booking / order confirmation alerts',
      'Crew dispatch and event shoot reminders',
      'Selection gallery ready notifications',
      'Important production milestone updates',
      'Delivery and dispatch notifications',
    ],
    studioScoped: true,
  },
  {
    id: 'WHATSAPP_OPERATIONS',
    name: 'WhatsApp Operations',
    category: 'WHATSAPP',
    price: 499,
    description: 'Interactive WhatsApp Operations Bot for Studio Owners.',
    valueProp: 'Manage and query your studio operations directly via WhatsApp.',
    includedCapabilities: ['WHATSAPP_NOTIFICATIONS'],
    features: [
      'Includes all WhatsApp Notifications capabilities',
      'WhatsApp Operations Bot for Studio Owner',
      'Check orders, upcoming events, and pending tasks via WhatsApp',
      'Supported operational status updates via chat',
      'Crew reminders and event call-time lookup',
    ],
    limitations: [
      'Studio Owner access only (restricted from customers and general crew)',
      'Operational usage safeguard: 499 bot messages/interactions per studio per month',
    ],
    studioScoped: true,
  },
];

export const ALL_CAPABILITIES = [FREE_CORE_CAPABILITY, ...PURCHASABLE_CAPABILITIES];

export const WHATSAPP_OPERATIONS_BOT_MONTHLY_LIMIT = 499;

/**
 * Calculates the combined monthly price for a set of selected capabilities.
 * Handles dependencies (e.g., Advanced includes Basic) so customers are never double-charged.
 */
export function calculateMonthlyTotal(selectedCapabilities: CapabilityId[]): number {
  const selectedSet = new Set(selectedCapabilities);
  let total = 0;

  // Customer Management Category
  if (selectedSet.has('CUSTOMER_ADVANCED')) {
    total += 299;
  } else if (selectedSet.has('CUSTOMER_BASIC') || selectedSet.has('CUSTOMER_CRM')) {
    total += 199;
  }

  // Crew Management Category
  if (selectedSet.has('CREW_ADVANCED') || selectedSet.has('ERP_SMART_RESOURCE_AUTOMATION')) {
    total += 299;
  } else if (selectedSet.has('CREW_BASIC') || selectedSet.has('TEAM_MANAGEMENT') || selectedSet.has('ERP_BASIC')) {
    total += 199;
  }

  // Studio Marketplace
  if (selectedSet.has('MARKETPLACE') || selectedSet.has('MARKETPLACE_PUBLIC')) {
    total += 499;
  }

  // Google Drive + Client Review
  if (selectedSet.has('DRIVE_CLIENT_REVIEW') || selectedSet.has('GOOGLE_DRIVE')) {
    total += 299;
  }

  // WhatsApp Category
  if (selectedSet.has('WHATSAPP_OPERATIONS') || selectedSet.has('WHATSAPP_BOT')) {
    total += 499;
  } else if (selectedSet.has('WHATSAPP_NOTIFICATIONS')) {
    total += 199;
  }

  return total;
}

/**
 * Returns the complete effective set of capabilities granted to a studio,
 * expanding any parent capability inclusions (e.g. Advanced includes Basic).
 */
export function getEffectiveCapabilities(selectedCapabilities: CapabilityId[] = []): CapabilityId[] {
  const effective = new Set<CapabilityId>();
  
  // Free core is always included
  effective.add('OMS_BASIC');
  effective.add('OMS_CORE');

  for (const capId of selectedCapabilities) {
    effective.add(capId);

    if (capId === 'CUSTOMER_ADVANCED') {
      effective.add('CUSTOMER_BASIC');
      effective.add('CUSTOMER_CRM');
    }
    if (capId === 'CUSTOMER_BASIC' || capId === 'CUSTOMER_CRM') {
      effective.add('CUSTOMER_BASIC');
      effective.add('CUSTOMER_CRM');
    }

    if (capId === 'CREW_ADVANCED') {
      effective.add('CREW_BASIC');
      effective.add('TEAM_MANAGEMENT');
      effective.add('MANUAL_ASSIGNMENT');
      effective.add('ERP_BASIC');
      effective.add('ERP_AVAILABILITY');
      effective.add('ERP_WORKLOAD');
      effective.add('ERP_CONFLICT_DETECTION');
      effective.add('ERP_RESOURCE_SUGGESTION');
      effective.add('ERP_SMART_RESOURCE_AUTOMATION');
    }
    if (capId === 'CREW_BASIC') {
      effective.add('TEAM_MANAGEMENT');
      effective.add('MANUAL_ASSIGNMENT');
      effective.add('ERP_BASIC');
      effective.add('ERP_AVAILABILITY');
      effective.add('ERP_RESOURCE_SUGGESTION');
    }

    if (capId === 'MARKETPLACE' || capId === 'MARKETPLACE_PUBLIC') {
      effective.add('MARKETPLACE');
      effective.add('MARKETPLACE_CONFIGURATION');
      effective.add('MARKETPLACE_PUBLIC');
      effective.add('BOOKING_REQUESTS');
      effective.add('NEGOTIATION');
    }

    if (capId === 'DRIVE_CLIENT_REVIEW' || capId === 'GOOGLE_DRIVE') {
      effective.add('DRIVE_CLIENT_REVIEW');
      effective.add('GOOGLE_DRIVE');
    }

    if (capId === 'WHATSAPP_OPERATIONS' || capId === 'WHATSAPP_BOT') {
      effective.add('WHATSAPP_OPERATIONS');
      effective.add('WHATSAPP_NOTIFICATIONS');
      effective.add('WHATSAPP_BOT');
    }
    if (capId === 'WHATSAPP_NOTIFICATIONS') {
      effective.add('WHATSAPP_NOTIFICATIONS');
    }
  }

  return Array.from(effective);
}

/**
 * Pricing and Capability Mapping (Backward Compatibility Mapping)
 */
export const PLAN_PRICES: Record<string, number> = {
  FREE: 0,
  STARTER: 499,
  PROFESSIONAL: 999,
  COMPLETE: 1999,
};

export const TRIAL_DURATION_DAYS = 30;

export const PLAN_CAPABILITIES: Record<string, CapabilityId[]> = {
  FREE: ['OMS_BASIC', 'OMS_CORE'],
  STARTER: ['OMS_BASIC', 'OMS_CORE', 'CUSTOMER_BASIC', 'CREW_BASIC', 'WHATSAPP_NOTIFICATIONS'],
  PROFESSIONAL: ['OMS_BASIC', 'OMS_CORE', 'CUSTOMER_ADVANCED', 'CREW_BASIC', 'MARKETPLACE', 'DRIVE_CLIENT_REVIEW', 'WHATSAPP_NOTIFICATIONS'],
  COMPLETE: ['OMS_BASIC', 'OMS_CORE', 'CUSTOMER_ADVANCED', 'CREW_ADVANCED', 'MARKETPLACE', 'DRIVE_CLIENT_REVIEW', 'WHATSAPP_OPERATIONS'],
};
