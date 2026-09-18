/**
 * Shared Focoman Constants and System Configuration
 */

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
