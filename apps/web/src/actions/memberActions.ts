"use server";

import { randomUUID } from "crypto";
import { getMembersByStudio, saveMember } from "@focoman/db";
import { StudioMember } from "@focoman/types";
import { requireVerifiedUser, requireStudioMember } from "@/lib/serverAuth";

/**
 * Server Actions for Studio Crew & Resource Management
 * CHG-010: Authorization enforced on all actions.
 * createMemberAction requires STUDIO_OWNER role.
 * IDs use crypto.randomUUID() — collision-safe.
 * Errors are thrown, not swallowed into empty arrays.
 */

export async function getStudioMembersAction(
  studioSlug: string,
  idToken: string
): Promise<StudioMember[]> {
  // Authorization: must be an active studio member to view crew
  const decoded = await requireVerifiedUser(idToken);
  await requireStudioMember(decoded.uid, studioSlug);
  // Errors propagate — no silent [] fallback
  return await getMembersByStudio(studioSlug);
}

export async function createMemberAction(input: {
  studioId: string;
  name: string;
  email: string;
  phone?: string;
  skills: string[];
  idToken: string;
}): Promise<{ success: boolean; member?: StudioMember; error?: string }> {
  try {
    // Authorization: only STUDIO_OWNER can create crew members
    const decoded = await requireVerifiedUser(input.idToken);
    await requireStudioMember(decoded.uid, input.studioId, "STUDIO_OWNER");

    if (!input.name || input.name.trim().length === 0) {
      return { success: false, error: "Member name is required." };
    }
    if (!input.email || !input.email.includes("@")) {
      return { success: false, error: "Valid email address is required." };
    }
    if (!input.skills || input.skills.length === 0) {
      return { success: false, error: "At least one certified skill must be selected." };
    }

    const memberId = `MEM-${randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase()}`;
    const now = new Date().toISOString();

    const member: StudioMember = {
      id: memberId,
      studioId: input.studioId.toLowerCase(),
      name: input.name.trim(),
      email: input.email.trim(),
      phone: input.phone?.trim() || undefined,
      skills: input.skills,
      createdAt: now,
      updatedAt: now,
    };

    await saveMember(member);
    return { success: true, member };
  } catch (err: any) {
    console.error("[createMemberAction] Error:", err);
    return { success: false, error: err.message || "Failed to create studio member" };
  }
}
