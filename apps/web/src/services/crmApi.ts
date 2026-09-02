import { Customer } from '@focoman/types';

/**
 * Focoman Customer Relationship Management (CRM) Data Service
 * Primary Source of Truth: Focoman Product Discovery Document
 * CRM provides internal Studio Owner customer context (Profiles, contact info, order history).
 * Leads/enquiries are handled externally and recorded directly as Confirmed Orders.
 */

export type { Customer };

export const crmApi = {
  // Real data interaction interface for studio customers
  validateCustomerProfile(name: string, phone?: string): { valid: boolean; error?: string } {
    if (!name || name.trim() === '') {
      return { valid: false, error: 'Customer name is required' };
    }
    return { valid: true };
  }
};