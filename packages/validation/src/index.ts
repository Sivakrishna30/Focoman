/**
 * Focoman Shared Validation Schemas & Helpers
 */

export interface CreateOrderInput {
  studioId: string;
  customerName: string;
  customerPhone?: string;
  eventType: string;
  eventDate: string;
  services: string[];
  packages?: string[];
  estimatedPrice: number;
  finalConfirmedPrice: number;
  advanceAmount: number;
}

export function validateCreateOrderInput(input: Partial<CreateOrderInput>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!input.studioId) errors.push('studioId is required');
  if (!input.customerName || input.customerName.trim() === '') errors.push('customerName is required');
  if (!input.eventType || input.eventType.trim() === '') errors.push('eventType is required');
  if (!input.eventDate) errors.push('eventDate is required');
  if (!input.services || input.services.length === 0) errors.push('at least one service must be selected');
  if (typeof input.finalConfirmedPrice !== 'number' || input.finalConfirmedPrice < 0) {
    errors.push('finalConfirmedPrice must be a non-negative number');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

export interface AssignResourceInput {
  orderId: string;
  memberId: string;
  memberName: string;
  skill: string;
}

export function validateAssignResourceInput(input: Partial<AssignResourceInput>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!input.orderId) errors.push('orderId is required');
  if (!input.memberId) errors.push('memberId is required');
  if (!input.skill) errors.push('skill is required');

  return {
    valid: errors.length === 0,
    errors
  };
}
