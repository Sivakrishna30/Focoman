"use server";

import { randomBytes, randomUUID } from "crypto";
import {
  getMembersByStudio,
  saveMember,
  saveInvitation,
  getStudioBySlug,
  getInvitationsByStudio,
  acceptInvitationTransaction,
} from "@focoman/db";
import { StudioMember, StudioInvitation } from "@focoman/types";
import { requireVerifiedUser, requireStudioMember } from "@/lib/serverAuth";

/**
 * Server Actions for Studio Crew & Resource Management
 * CHG-010 & CHG-012: Authorization enforced on all actions.
 * createMemberAction requires STUDIO_OWNER role.
 * IDs use crypto.randomUUID() / crypto.randomBytes() — collision-safe.
 * Full member invitation & activation lifecycle implemented per Auth Architecture.
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

export async function getStudioInvitationsAction(
  studioSlug: string,
  idToken: string
): Promise<StudioInvitation[]> {
  const decoded = await requireVerifiedUser(idToken);
  await requireStudioMember(decoded.uid, studioSlug, "STUDIO_OWNER");
  return await getInvitationsByStudio(studioSlug);
}

export async function createMemberAction(input: {
  studioId: string;
  name: string;
  email: string;
  phone?: string;
  skills: string[];
  idToken: string;
}): Promise<{
  success: boolean;
  member?: StudioMember;
  invitationCode?: string;
  error?: string;
}> {
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

    const studio = await getStudioBySlug(input.studioId);
    const studioName = studio?.name || input.studioId;

    const memberId = `MEM-${randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase()}`;
    const inviteCode = `INV-${randomBytes(3).toString('hex').toUpperCase()}-${randomBytes(2).toString('hex').toUpperCase()}`;
    const now = new Date().toISOString();

    const member: StudioMember = {
      id: memberId,
      studioId: input.studioId.toLowerCase(),
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      phone: input.phone?.trim() || undefined,
      skills: input.skills,
      createdAt: now,
      updatedAt: now,
    };

    const invitation: StudioInvitation = {
      id: inviteCode,
      studioId: input.studioId.toLowerCase(),
      studioName,
      email: input.email.trim().toLowerCase(),
      name: input.name.trim(),
      skills: input.skills,
      role: 'STUDIO_MEMBER',
      status: 'PENDING',
      invitedByUid: decoded.uid,
      createdAt: now,
    };

    await Promise.all([
      saveMember(member),
      saveInvitation(invitation),
    ]);

    return { success: true, member, invitationCode: inviteCode };
  } catch (err: any) {
    console.error("[createMemberAction] Error:", err);
    return { success: false, error: err.message || "Failed to create studio member" };
  }
}

export async function acceptInvitationAction(input: {
  inviteCode: string;
  idToken: string;
}): Promise<{
  success: boolean;
  studioId?: string;
  studioName?: string;
  error?: string;
}> {
  try {
    const cleanCode = input.inviteCode?.trim().toUpperCase();
    if (!cleanCode || cleanCode.length < 5) {
      return { success: false, error: "Please provide a valid invitation code." };
    }

    // Authenticate user with Google Firebase token
    const decoded = await requireVerifiedUser(input.idToken);
    const uid = decoded.uid;
    const userEmail = decoded.email;

    if (!userEmail) {
      return { success: false, error: "Authenticated account does not have an email address." };
    }

    const res = await acceptInvitationTransaction({
      code: cleanCode,
      uid,
      userEmail,
      userName: decoded.name || decoded.email,
    });

    if (!res.success) {
      return { success: false, error: res.error || "Failed to accept invitation." };
    }

    return {
      success: true,
      studioId: res.studioId,
      studioName: res.studioName,
    };
  } catch (err: any) {
    console.error("[acceptInvitationAction] Error:", err);
    return { success: false, error: err.message || "Failed to activate studio invitation." };
  }
}
