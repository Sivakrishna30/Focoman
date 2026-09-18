"use server";

import { randomBytes, randomUUID } from "crypto";
import {
  getMembersByStudio,
  getDeletedMembersByStudio,
  getMemberById,
  saveMember,
  updateMember,
  softDeleteMember,
  restoreMember,
  saveInvitation,
  getStudioBySlug,
  getInvitationsByStudio,
  revokeInvitation,
  restoreInvitation,
  acceptInvitationTransaction,
} from "@focoman/db";
import { StudioMember, StudioInvitation } from "@focoman/types";
import { requireVerifiedUser, requireStudioMember } from "@/lib/serverAuth";

/**
 * Server Actions for Studio Crew & Resource Management (ERP)
 * Complete CRUD: Create, Read (active + deleted), Update, Delete (soft), Restore.
 * Full invitation lifecycle: Create, List, Revoke, Accept.
 */

export async function getStudioMembersAction(
  studioSlug: string,
  idToken: string
): Promise<StudioMember[]> {
  const decoded = await requireVerifiedUser(idToken);
  await requireStudioMember(decoded.uid, studioSlug);
  return await getMembersByStudio(studioSlug);
}

export async function getDeletedStudioMembersAction(
  studioSlug: string,
  idToken: string
): Promise<StudioMember[]> {
  const decoded = await requireVerifiedUser(idToken);
  await requireStudioMember(decoded.uid, studioSlug, "STUDIO_OWNER");
  return await getDeletedMembersByStudio(studioSlug);
}

export async function getMemberAction(
  memberId: string,
  studioSlug: string,
  idToken: string
): Promise<StudioMember | null> {
  const decoded = await requireVerifiedUser(idToken);
  await requireStudioMember(decoded.uid, studioSlug);

  const member = await getMemberById(memberId);
  if (!member) return null;
  if (member.studioId !== studioSlug.toLowerCase()) {
    throw new Error("Access denied: Member does not belong to the authorized studio.");
  }
  return member;
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
      status: 'ACTIVE',
      isDeleted: false,
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
      isDeleted: false,
      invitedByUid: decoded.uid,
      createdAt: now,
    };

    await Promise.all([
      saveMember(member),
      saveInvitation(invitation),
    ]);

    return { success: true, member, invitationCode: inviteCode };
  } catch (err: unknown) {
    console.error("[createMemberAction] Error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to create studio member" };
  }
}

export async function updateMemberAction(input: {
  memberId: string;
  studioId: string;
  updates: {
    name?: string;
    phone?: string;
    skills?: string[];
    status?: 'ACTIVE' | 'INACTIVE';
  };
  idToken: string;
}): Promise<{ success: boolean; member?: StudioMember; error?: string }> {
  try {
    const decoded = await requireVerifiedUser(input.idToken);
    await requireStudioMember(decoded.uid, input.studioId, "STUDIO_OWNER");

    const existing = await getMemberById(input.memberId);
    if (!existing) {
      return { success: false, error: "Crew member not found." };
    }
    if (existing.studioId !== input.studioId.toLowerCase()) {
      return { success: false, error: "Unauthorized: Member does not belong to this studio." };
    }

    const updated = await updateMember(input.memberId, {
      ...(input.updates.name ? { name: input.updates.name.trim() } : {}),
      ...(input.updates.phone !== undefined ? { phone: input.updates.phone.trim() || undefined } : {}),
      ...(input.updates.skills ? { skills: input.updates.skills } : {}),
      ...(input.updates.status ? { status: input.updates.status } : {}),
    });

    return { success: true, member: updated || undefined };
  } catch (err: unknown) {
    console.error("[updateMemberAction] Error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to update member" };
  }
}

export async function deleteMemberAction(input: {
  memberId: string;
  studioId: string;
  idToken: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const decoded = await requireVerifiedUser(input.idToken);
    await requireStudioMember(decoded.uid, input.studioId, "STUDIO_OWNER");

    const existing = await getMemberById(input.memberId);
    if (!existing) {
      return { success: false, error: "Crew member not found." };
    }
    if (existing.studioId !== input.studioId.toLowerCase()) {
      return { success: false, error: "Unauthorized: Member does not belong to this studio." };
    }

    await softDeleteMember(input.memberId, decoded.uid);
    return { success: true };
  } catch (err: unknown) {
    console.error("[deleteMemberAction] Error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to delete member" };
  }
}

export async function restoreMemberAction(input: {
  memberId: string;
  studioId: string;
  idToken: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const decoded = await requireVerifiedUser(input.idToken);
    await requireStudioMember(decoded.uid, input.studioId, "STUDIO_OWNER");

    await restoreMember(input.memberId);
    return { success: true };
  } catch (err: unknown) {
    console.error("[restoreMemberAction] Error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to restore member" };
  }
}

export async function revokeInvitationAction(input: {
  inviteCode: string;
  studioId: string;
  idToken: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const decoded = await requireVerifiedUser(input.idToken);
    await requireStudioMember(decoded.uid, input.studioId, "STUDIO_OWNER");

    await revokeInvitation(input.inviteCode, decoded.uid);
    return { success: true };
  } catch (err: unknown) {
    console.error("[revokeInvitationAction] Error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to revoke invitation" };
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
  } catch (err: unknown) {
    console.error("[acceptInvitationAction] Error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to activate studio invitation." };
  }
}

export async function restoreInvitationAction(input: {
  inviteCode: string;
  studioId: string;
  idToken: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const decoded = await requireVerifiedUser(input.idToken);
    await requireStudioMember(decoded.uid, input.studioId, "STUDIO_OWNER");

    await restoreInvitation(input.inviteCode);
    return { success: true };
  } catch (err: unknown) {
    console.error("[restoreInvitationAction] Error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to restore invitation" };
  }
}
