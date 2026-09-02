/**
 * Focoman Firebase Authentication & Authorization Helpers
 */

export type UserRole = 'STUDIO_OWNER' | 'STUDIO_MEMBER' | 'CUSTOMER_GUEST';

export interface AuthSession {
  uid: string;
  email?: string;
  role: UserRole;
  studioId: string;
  memberId?: string;
}

export function canAccessStudioBusinessData(session: AuthSession, targetStudioId: string): boolean {
  if (session.studioId !== targetStudioId) return false;
  return session.role === 'STUDIO_OWNER';
}

export function canAccessAssignedOrder(session: AuthSession, targetStudioId: string, assignedMemberId?: string): boolean {
  if (session.studioId !== targetStudioId) return false;
  if (session.role === 'STUDIO_OWNER') return true;
  if (session.role === 'STUDIO_MEMBER' && session.memberId === assignedMemberId) return true;
  return false;
}
