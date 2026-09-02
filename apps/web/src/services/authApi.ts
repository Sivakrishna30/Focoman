import { canAccessStudioBusinessData, canAccessAssignedOrder } from '@focoman/auth';

/**
 * Focoman Authentication & Permission Service
 * Primary Source of Truth: Focoman Product Discovery Document
 */

export interface AuthUserSession {
  userId: string;
  name: string;
  email: string;
  role: 'STUDIO_OWNER' | 'STUDIO_MEMBER' | 'CUSTOMER_GUEST';
  studioId: string;
  memberId?: string;
}

export interface AuthResponseDTO {
  success: boolean;
  message: string;
  session?: AuthUserSession;
}

export const authApi = {
  checkStudioPermission(session: AuthUserSession, targetStudioId: string): boolean {
    return canAccessStudioBusinessData(
      {
        uid: session.userId,
        role: session.role,
        studioId: session.studioId,
        memberId: session.memberId
      },
      targetStudioId
    );
  },

  checkOrderPermission(session: AuthUserSession, targetStudioId: string, assignedMemberId?: string): boolean {
    return canAccessAssignedOrder(
      {
        uid: session.userId,
        role: session.role,
        studioId: session.studioId,
        memberId: session.memberId
      },
      targetStudioId,
      assignedMemberId
    );
  }
};
