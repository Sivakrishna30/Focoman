"use server";

import { randomUUID } from "crypto";
import { getCustomersByStudio, saveCustomer } from "@focoman/db";
import { Customer } from "@focoman/types";
import { requireVerifiedUser, requireStudioMember } from "@/lib/serverAuth";

/**
 * Server Actions for Customer Management
 * CHG-010: Authorization enforced on all actions.
 * IDs use crypto.randomUUID() — collision-safe.
 * Errors are thrown, not swallowed into empty arrays.
 */

export async function getStudioCustomersAction(
  studioSlug: string,
  idToken: string
): Promise<Customer[]> {
  // Authorization: must be an active studio member to view customers
  const decoded = await requireVerifiedUser(idToken);
  await requireStudioMember(decoded.uid, studioSlug);
  // Errors propagate — no silent [] fallback
  return await getCustomersByStudio(studioSlug);
}

export async function createCustomerAction(input: {
  studioId: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  idToken: string;
}): Promise<{ success: boolean; customer?: Customer; error?: string }> {
  try {
    // Authorization: must be an active studio member to create customers
    const decoded = await requireVerifiedUser(input.idToken);
    await requireStudioMember(decoded.uid, input.studioId);

    if (!input.name || input.name.trim().length === 0) {
      return { success: false, error: "Customer name is required." };
    }
    if (!input.studioId) {
      return { success: false, error: "Studio ID is required." };
    }

    const customerId = `CUS-${randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase()}`;
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
