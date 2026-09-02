"use server";

import {
  getStudioBySlug,
  registerStudioTransaction,
  getMembershipsByUid,
} from "@focoman/db";
import { Studio, StudioMembership } from "@focoman/types";

/**
 * Server Actions for Studio Registration & Multi-Studio Workspaces
 * Source of Truth: Authentication & Multi-Studio Identity Architecture Specification
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
  ownerUid: string;
  ownerName: string;
  ownerEmail: string;
}): Promise<{
  success: boolean;
  studio?: Studio;
  error?: string;
}> {
  const name = input.name.trim();
  const city = input.city.trim();
  if (!name) return { success: false, error: "Studio name is required." };
  if (!city) return { success: false, error: "City is required." };
  if (!input.ownerUid) return { success: false, error: "Authentication required." };

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  if (!slug) return { success: false, error: "Invalid studio name." };

  const now = new Date().toISOString();
  const studio: Studio = {
    id: slug,
    name,
    city,
    ownerId: input.ownerUid,
    ownerName: input.ownerName || "Studio Owner",
    ownerEmail: input.ownerEmail || "",
    createdAt: now,
    updatedAt: now,
  };

  const membership: StudioMembership = {
    id: `${slug}_${input.ownerUid}`,
    studioId: slug,
    studioName: name,
    uid: input.ownerUid,
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
}

export async function getUserWorkspacesAction(uid: string): Promise<StudioMembership[]> {
  if (!uid) return [];
  return await getMembershipsByUid(uid);
}
