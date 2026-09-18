"use server";

import { randomUUID } from "crypto";
import {
  getCustomersByStudio,
  getDeletedCustomersByStudio,
  getCustomerById,
  saveCustomer,
  updateCustomer,
  softDeleteCustomer,
  restoreCustomer,
} from "@focoman/db";
import { Customer } from "@focoman/types";
import { requireVerifiedUser, requireStudioMember } from "@/lib/serverAuth";

/**
 * Server Actions for Customer Management (CRM)
 * Full CRUD: Create, Read (active + deleted), Update, Soft-Delete, Restore.
 * Enforces authenticated user, authorized studio, and resource ownership.
 */

export async function getStudioCustomersAction(
  studioSlug: string,
  idToken: string
): Promise<Customer[]> {
  const decoded = await requireVerifiedUser(idToken);
  await requireStudioMember(decoded.uid, studioSlug);
  return await getCustomersByStudio(studioSlug);
}

export async function getDeletedStudioCustomersAction(
  studioSlug: string,
  idToken: string
): Promise<Customer[]> {
  const decoded = await requireVerifiedUser(idToken);
  await requireStudioMember(decoded.uid, studioSlug);
  return await getDeletedCustomersByStudio(studioSlug);
}

export async function getCustomerAction(
  customerId: string,
  studioSlug: string,
  idToken: string
): Promise<Customer | null> {
  const decoded = await requireVerifiedUser(idToken);
  await requireStudioMember(decoded.uid, studioSlug);
  
  const customer = await getCustomerById(customerId);
  if (!customer) return null;
  // Resource ownership validation
  if (customer.studioId !== studioSlug.toLowerCase()) {
    throw new Error("Access denied: Customer does not belong to the authorized studio.");
  }
  return customer;
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
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
    };

    await saveCustomer(customer);
    return { success: true, customer };
  } catch (err: unknown) {
    console.error("[createCustomerAction] Error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to create customer" };
  }
}

export async function updateCustomerAction(input: {
  customerId: string;
  studioId: string;
  updates: {
    name?: string;
    phone?: string;
    email?: string;
    address?: string;
  };
  idToken: string;
}): Promise<{ success: boolean; customer?: Customer; error?: string }> {
  try {
    const decoded = await requireVerifiedUser(input.idToken);
    await requireStudioMember(decoded.uid, input.studioId);

    const existing = await getCustomerById(input.customerId);
    if (!existing) {
      return { success: false, error: "Customer not found." };
    }
    // Resource ownership validation
    if (existing.studioId !== input.studioId.toLowerCase()) {
      return { success: false, error: "Unauthorized: Customer does not belong to this studio." };
    }

    const updated = await updateCustomer(input.customerId, {
      ...(input.updates.name ? { name: input.updates.name.trim() } : {}),
      ...(input.updates.phone !== undefined ? { phone: input.updates.phone.trim() || undefined } : {}),
      ...(input.updates.email !== undefined ? { email: input.updates.email.trim() || undefined } : {}),
      ...(input.updates.address !== undefined ? { address: input.updates.address.trim() || undefined } : {}),
    });

    return { success: true, customer: updated || undefined };
  } catch (err: unknown) {
    console.error("[updateCustomerAction] Error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to update customer" };
  }
}

export async function deleteCustomerAction(input: {
  customerId: string;
  studioId: string;
  idToken: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const decoded = await requireVerifiedUser(input.idToken);
    await requireStudioMember(decoded.uid, input.studioId);

    const existing = await getCustomerById(input.customerId);
    if (!existing) {
      return { success: false, error: "Customer not found." };
    }
    if (existing.studioId !== input.studioId.toLowerCase()) {
      return { success: false, error: "Unauthorized: Customer does not belong to this studio." };
    }

    await softDeleteCustomer(input.customerId, decoded.uid);
    return { success: true };
  } catch (err: unknown) {
    console.error("[deleteCustomerAction] Error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to delete customer" };
  }
}

export async function restoreCustomerAction(input: {
  customerId: string;
  studioId: string;
  idToken: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const decoded = await requireVerifiedUser(input.idToken);
    await requireStudioMember(decoded.uid, input.studioId);

    await restoreCustomer(input.customerId);
    return { success: true };
  } catch (err: unknown) {
    console.error("[restoreCustomerAction] Error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to restore customer" };
  }
}

export async function getCustomerAuthorizedOrdersHistoryAction(idToken: string) {
  try {
    const decoded = await requireVerifiedUser(idToken);
    const customerId = decoded.uid;

    const { getCustomerOrdersHistory, getStudioBySlug } = await import("@focoman/db");
    const { toCustomerOrderView } = await import("@focoman/domain");

    const orders = await getCustomerOrdersHistory(customerId);

    // Transform into clean CustomerOrderView DTOs
    const historyPromises = orders.map(async (order) => {
      const studio = await getStudioBySlug(order.studioId);
      return toCustomerOrderView(order, studio?.name || "Studio");
    });

    const sanitizedHistory = await Promise.all(historyPromises);

    return { success: true, history: sanitizedHistory };
  } catch (err: unknown) {
    console.error("[getCustomerAuthorizedOrdersHistoryAction] Error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to fetch customer order history" };
  }
}

