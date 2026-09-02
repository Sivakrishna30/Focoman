/**
 * Shared Focoman Constants and System Configuration
 */

export const APP_NAME = 'Focoman';
export const APP_DESCRIPTION = 'Order Management System for Photographic Studios';

export const ORDER_STATUSES = ['AWAITING_EVENT', 'POST_EVENT_IN_PROGRESS', 'COMPLETED'] as const;

export const TASK_STATUSES = ['ASSIGNED', 'IN_PROGRESS', 'REVIEW', 'REWORK', 'COMPLETED'] as const;

export const PAYMENT_STATUSES = ['PAYMENT_PENDING', 'PAYMENT_CONFIRMATION_REQUIRED', 'PAYMENT_COMPLETED'] as const;

export const DEFAULT_SERVICES = [
  { name: 'Traditional Photography', category: 'PHOTOGRAPHY' },
  { name: 'Candid Photography', category: 'PHOTOGRAPHY' },
  { name: 'Videography', category: 'VIDEOGRAPHY' },
  { name: 'Album Design & Printing', category: 'ALBUM' }
] as const;
