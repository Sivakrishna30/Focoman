"use server";

import {
  getStudioBySlug,
  registerStudioTransaction,
  getMembershipsByUid,
} from "@focoman/db";
import { Studio, StudioMembership } from "@focoman/types";
import { requireVerifiedUser } from "@/lib/serverAuth";

/**
 * Server Actions for Studio Registration & Multi-Studio Workspaces
 * CHG-010: Authorization enforced on mutating actions.
 * registerStudioAction: ownerUid is derived from the verified token — never trusted from the client.
 * getUserWorkspacesAction: UID is verified against the token — no UID spoofing possible.
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
  idToken: string; // Required: Firebase ID token — UID is extracted server-side, not trusted from client
}): Promise<{
  success: boolean;
  studio?: Studio;
  error?: string;
}> {
  try {
    // Verify identity: UID comes from the token, never from client input
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
  } catch (err: any) {
    console.error("[registerStudioAction] Error:", err);
    return { success: false, error: err.message || "Failed to register studio." };
  }
}

export async function getUserWorkspacesAction(idToken: string): Promise<StudioMembership[]> {
  // UID is derived from the verified token — client cannot supply or spoof a UID
  const decoded = await requireVerifiedUser(idToken);
  // Errors propagate — no silent [] fallback
  return await getMembershipsByUid(decoded.uid);
}
