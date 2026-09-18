"use server";

import {
  getStudioBySlug,
  registerStudioTransaction,
  getMembershipsByUid,
  updateStudio,
  softDeleteStudio,
  restoreStudio,
} from "@focoman/db";
import { Studio, StudioMembership } from "@focoman/types";
import { requireVerifiedUser, requireStudioMember } from "@/lib/serverAuth";

/**
 * Server Actions for Studio Registration, Workspaces & Settings
 * Supports Studio registration, soft-deletion, restoration, and configuration.
 */

export async function checkStudioSlugAvailabilityAction(slug: string): Promise<{
  available: boolean;
  message?: string;
}> {
  const cleanSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
  if (!cleanSlug || cleanSlug.length < 3) {
    return { available: false, message: "Slug must be at least 3 characters." };
  }

  const existing = await getStudioBySlug(cleanSlug);
  if (existing) {
    return { available: false, message: `Studio identifier "${cleanSlug}" is already in use.` };
  }

  return { available: true };
}

export async function registerStudioAction(input: {
  name: string;
  city: string;
  website?: string;
  instagram?: string;
  idToken: string;
}): Promise<{
  success: boolean;
  studio?: Studio;
  error?: string;
}> {
  try {
    const decoded = await requireVerifiedUser(input.idToken);
    const ownerUid = decoded.uid;
    const ownerEmail = decoded.email || "";
    const ownerName = decoded.name || decoded.email || "Studio Owner";

    const name = input.name.trim();
    const city = input.city.trim();
    if (!name) return { success: false, error: "Studio name is required." };
    if (!city) return { success: false, error: "City is required." };

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    if (!slug) return { success: false, error: "Invalid studio name." };

    const now = new Date().toISOString();
    const studio: Studio = {
      id: slug,
      name,
      city,
      ownerId: ownerUid,
      ownerName,
      ownerEmail,
      features: {
        oms: true,
        crm: true,
        erp: true,
        whatsapp: true,
        marketplace: false,
      },
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
    };

    const membership: StudioMembership = {
      id: `${slug}_${ownerUid}`,
      studioId: slug,
      studioName: name,
      uid: ownerUid,
      role: "STUDIO_OWNER",
      status: "ACTIVE",
      joinedAt: now,
      updatedAt: now,
    };

    const result = await registerStudioTransaction(studio, membership);
    if (!result.success) {
      return { success: false, error: result.error || "Failed to register studio." };
    }

    return { success: true, studio };
  } catch (err: unknown) {
    console.error("[registerStudioAction] Error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to register studio." };
  }
}

export async function getUserWorkspacesAction(idToken: string): Promise<StudioMembership[]> {
  const decoded = await requireVerifiedUser(idToken);
  return await getMembershipsByUid(decoded.uid);
}

export async function updateStudioAction(input: {
  studioSlug: string;
  updates: {
    name?: string;
    city?: string;
    website?: string;
    instagram?: string;
    features?: Partial<Studio['features']>;
  };
  idToken: string;
}): Promise<{ success: boolean; studio?: Studio; error?: string }> {
  try {
    const decoded = await requireVerifiedUser(input.idToken);
    await requireStudioMember(decoded.uid, input.studioSlug, "STUDIO_OWNER");

    const updated = await updateStudio(input.studioSlug, {
      ...(input.updates.name ? { name: input.updates.name.trim() } : {}),
      ...(input.updates.city ? { city: input.updates.city.trim() } : {}),
      ...(input.updates.website !== undefined ? { website: input.updates.website.trim() } : {}),
      ...(input.updates.instagram !== undefined ? { instagram: input.updates.instagram.trim() } : {}),
      ...(input.updates.features ? { features: input.updates.features as any } : {}),
    });

    return { success: true, studio: updated || undefined };
  } catch (err: unknown) {
    console.error("[updateStudioAction] Error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to update studio." };
  }
}

export async function updateStudioWhatsappConfigAction(
  studioSlug: string,
  config: Record<string, boolean>,
  idToken: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const decoded = await requireVerifiedUser(idToken);
    await requireStudioMember(decoded.uid, studioSlug, "STUDIO_OWNER");
    
    await updateStudio(studioSlug, { whatsappConfig: config });
    return { success: true };
  } catch (err: unknown) {
    console.error("[updateStudioWhatsappConfigAction] Error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to update config." };
  }
}

export async function resetStudioWhatsappConfigAction(
  studioSlug: string,
  idToken: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const decoded = await requireVerifiedUser(idToken);
    await requireStudioMember(decoded.uid, studioSlug, "STUDIO_OWNER");

    const defaultToggles: Record<string, boolean> = {
      master_operational: true,
      oms_owner_3day_reminder: true,
      oms_owner_post_event_start: true,
      oms_owner_raw_photos_sent: true,
      oms_owner_customer_selection_done: true,
      oms_owner_album_review_done: true,
      oms_owner_ready_for_delivery: true,
      erp_crew_planned_alert: true,
      erp_crew_task_assigned: true,
      crm_customer_progress_update: true,
      crm_customer_delivery_ready: true,
      crm_customer_payment_reminder: true,
    };

    await updateStudio(studioSlug, { whatsappConfig: defaultToggles });
    return { success: true };
  } catch (err: unknown) {
    console.error("[resetStudioWhatsappConfigAction] Error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to reset config." };
  }
}

export async function deleteStudioAction(
  studioSlug: string,
  idToken: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const decoded = await requireVerifiedUser(idToken);
    await requireStudioMember(decoded.uid, studioSlug, "STUDIO_OWNER");

    await softDeleteStudio(studioSlug, decoded.uid);
    return { success: true };
  } catch (err: unknown) {
    console.error("[deleteStudioAction] Error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to delete studio." };
  }
}

export async function restoreStudioAction(
  studioSlug: string,
  idToken: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const decoded = await requireVerifiedUser(idToken);
    await requireStudioMember(decoded.uid, studioSlug, "STUDIO_OWNER");

    await restoreStudio(studioSlug);
    return { success: true };
  } catch (err: unknown) {
    console.error("[restoreStudioAction] Error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to restore studio." };
  }
}
