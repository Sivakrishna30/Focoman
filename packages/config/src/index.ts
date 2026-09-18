/**
 * Shared Focoman Constants and System Configuration
 */
import type { CapabilityId } from '@focoman/types';

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
 * Pricing and Capability Mapping (CHG-026)
 */
export const PLAN_PRICES: Record<string, number> = {
  FREE: 0,
  STARTER: 499,
  PROFESSIONAL: 999,
  COMPLETE: 1999,
};

export const TRIAL_DURATION_DAYS = 14;

export const PLAN_CAPABILITIES: Record<string, CapabilityId[]> = {
  FREE: [
    'OMS_CORE',
    'CUSTOMER_BASIC',
    'ANALYTICS_BASIC',
  ],
  STARTER: [
    'OMS_CORE',
    'CUSTOMER_BASIC',
    'CUSTOMER_CRM',
    'TEAM_MANAGEMENT',
    'MANUAL_ASSIGNMENT',
    'MARKETPLACE_CONFIGURATION',
    'BOOKING_REQUESTS',
    'NEGOTIATION',
    'PAYMENT_RECORDING',
    'PAYMENT_VERIFICATION',
    'ERP_BASIC',
    'ANALYTICS_BASIC',
    'AUTOMATION_BASIC',
  ],
  PROFESSIONAL: [
    'OMS_CORE',
    'CUSTOMER_BASIC',
    'CUSTOMER_CRM',
    'TEAM_MANAGEMENT',
    'MANUAL_ASSIGNMENT',
    'MARKETPLACE_CONFIGURATION',
    'MARKETPLACE_PUBLIC',
    'BOOKING_REQUESTS',
    'NEGOTIATION',
    'PAYMENT_RECORDING',
    'PAYMENT_VERIFICATION',
    'ERP_BASIC',
    'ERP_AVAILABILITY',
    'ERP_WORKLOAD',
    'ERP_CONFLICT_DETECTION',
    'ERP_RESOURCE_SUGGESTION',
    'GOOGLE_CALENDAR',
    'GOOGLE_DRIVE',
    'AUTOMATION_BASIC',
    'AUTOMATION_ADVANCED',
    'ANALYTICS_BASIC',
    'ANALYTICS_ADVANCED',
  ],
  COMPLETE: [
    'OMS_CORE',
    'CUSTOMER_BASIC',
    'CUSTOMER_CRM',
    'TEAM_MANAGEMENT',
    'MANUAL_ASSIGNMENT',
    'MARKETPLACE_CONFIGURATION',
    'MARKETPLACE_PUBLIC',
    'BOOKING_REQUESTS',
    'NEGOTIATION',
    'PAYMENT_RECORDING',
    'PAYMENT_VERIFICATION',
    'ERP_BASIC',
    'ERP_AVAILABILITY',
    'ERP_WORKLOAD',
    'ERP_CONFLICT_DETECTION',
    'ERP_RESOURCE_SUGGESTION',
    'ERP_SMART_RESOURCE_AUTOMATION',
    'GOOGLE_CALENDAR',
    'GOOGLE_DRIVE',
    'AUTOMATION_BASIC',
    'AUTOMATION_ADVANCED',
    'ANALYTICS_BASIC',
    'ANALYTICS_ADVANCED',
    'WHATSAPP_NOTIFICATIONS',
    'WHATSAPP_BOT',
    'MULTI_STUDIO',
    'ADVANCED_INTEGRATIONS',
  ],
};
