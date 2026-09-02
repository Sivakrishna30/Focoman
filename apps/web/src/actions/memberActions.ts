"use server";

import { getMembersByStudio, saveMember } from "@focoman/db";
import { StudioMember } from "@focoman/types";

/**
 * Server Actions for Studio Crew & Resource Management
 */

export async function getStudioMembersAction(studioSlug: string): Promise<StudioMember[]> {
  try {
    return await getMembersByStudio(studioSlug);
  } catch (err) {
    console.error("[getStudioMembersAction] Error:", err);
    return [];
  }
}

export async function createMemberAction(input: {
  studioId: string;
  name: string;
  email: string;
  phone?: string;
  skills: string[];
}): Promise<{ success: boolean; member?: StudioMember; error?: string }> {
  try {
    if (!input.name || input.name.trim().length === 0) {
      return { success: false, error: "Member name is required." };
    }
    if (!input.email || !input.email.includes("@")) {
      return { success: false, error: "Valid email address is required." };
    }
    if (!input.skills || input.skills.length === 0) {
      return { success: false, error: "At least one certified skill must be selected." };
    }

    const memberId = `MEM-${Date.now().toString().slice(-6)}`;
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
