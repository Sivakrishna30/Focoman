import { notFound } from 'next/navigation';
import {
  requireStudioSessionMember,
  StudioMembershipRequiredError,
  UnauthenticatedSessionError,
} from '@/lib/serverAuth';
import type { StudioMembership } from '@focoman/types';

export async function requireDashboardStudioAccess(
  studioSlug: string,
  requiredRole?: StudioMembership['role']
): Promise<Awaited<ReturnType<typeof requireStudioSessionMember>>> {
  try {
    const access = await requireStudioSessionMember(studioSlug);
    if (requiredRole && access.membership.role !== requiredRole) {
      throw new StudioMembershipRequiredError('This dashboard section is owner-only.');
    }
    return access;
  } catch (error: unknown) {
    if (error instanceof UnauthenticatedSessionError) {
      notFound(); // Do not reveal whether this studio route exists — same 404 as unauthorized
    }
    if (error instanceof StudioMembershipRequiredError) {
      notFound();
    }
    throw error;
  }
}

export async function requireDashboardOwnerAccess(studioSlug: string): Promise<void> {
  await requireDashboardStudioAccess(studioSlug, 'STUDIO_OWNER');
}