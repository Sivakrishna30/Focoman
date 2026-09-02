"use server";

import { getCustomersByStudio, saveCustomer } from "@focoman/db";
import { Customer } from "@focoman/types";

/**
 * Server Actions for Customer Management
 */

export async function getStudioCustomersAction(studioSlug: string): Promise<Customer[]> {
  try {
    return await getCustomersByStudio(studioSlug);
  } catch (err) {
    console.error("[getStudioCustomersAction] Error:", err);
    return [];
  }
}

export async function createCustomerAction(input: {
  studioId: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
}): Promise<{ success: boolean; customer?: Customer; error?: string }> {
  try {
    if (!input.name || input.name.trim().length === 0) {
      return { success: false, error: "Customer name is required." };
    }
    if (!input.studioId) {
      return { success: false, error: "Studio ID is required." };
    }

    const customerId = `CUS-${Date.now().toString().slice(-6)}`;
    const now = new Date().toISOString();

    const customer: Customer = {
      id: customerId,
      studioId: input.studioId.toLowerCase(),
      name: input.name.trim(),
      phone: input.phone?.trim() || undefined,
      email: input.email?.trim() || undefined,
      address: input.address?.trim() || undefined,
      createdAt: now,
      updatedAt: now,
    };

    await saveCustomer(customer);
    return { success: true, customer };
  } catch (err: any) {
    console.error("[createCustomerAction] Error:", err);
    return { success: false, error: err.message || "Failed to create customer" };
  }
}
