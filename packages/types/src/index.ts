/**
 * Focoman Shared Domain Types
 * Primary Product Source of Truth: Focoman Product Discovery Document
 */

export type OrderStatus = 'AWAITING_EVENT' | 'POST_EVENT_IN_PROGRESS' | 'COMPLETED';

export type TaskStatus = 'ASSIGNED' | 'IN_PROGRESS' | 'REVIEW' | 'REWORK' | 'COMPLETED';

export type PaymentStatus = 'PAYMENT_PENDING' | 'PAYMENT_CONFIRMATION_REQUIRED' | 'PAYMENT_COMPLETED';

export interface Studio {
  id: string;
  name: string;
  city: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudioMember {
  id: string;
  studioId: string;
  name: string;
  email: string;
  phone?: string;
  skills: string[]; // e.g. ['PHOTOGRAPHY', 'VIDEOGRAPHY', 'PHOTO_EDITING', 'ALBUM_DESIGN']
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
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

export interface Order {
  id: string;
  studioId: string;
  orderNumber: string; // e.g. ORD-1024
  customer: {
    id: string;
    name: string;
    phone?: string;
  };
  eventType: string;
  eventDate: string; // YYYY-MM-DD
  eventLocation?: string;
  services: string[];
  packages: string[];
  pricing: OrderPricing;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  assignedResources: ResourceAssignment[];
  trackingPasskey: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
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
