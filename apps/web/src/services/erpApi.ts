import { StudioMember } from '@focoman/types';

/**
 * Focoman Enterprise Resource Planning (ERP) Data Service
 * Primary Source of Truth: Focoman Product Discovery Document
 * ERP focuses on Studio Members, Skills, Resource Assignments, and Availability Confirmation.
 * Payroll, Attendance, and General HR are intentionally outside Phase 1 scope.
 */

export type { StudioMember };

export const erpApi = {
  validateMemberSkills(skills: string[]): boolean {
    return Array.isArray(skills) && skills.length > 0;
  }
};