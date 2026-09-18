import type {
  OrderStatus,
  Task,
  SoftDeletable,
  Order,
  StudioMember,
  PreflightConflictReport,
  ResourceSuggestion,
  CustomerOrderView,
  PaymentVerificationStatus
} from '@focoman/types';
import { RECOVERY_WINDOW_DAYS } from '@focoman/config';

/**
 * Pure Business Logic & Domain State Engines
 * Source of Truth: Focoman Product Discovery Document & Major Product Design Amendment
 */

/**
 * Calculates whether an order can be marked COMPLETED.
 * An order is COMPLETED only when:
 * 1. Required production/delivery work tasks are COMPLETED.
 * 2. Payment status is marked PAYMENT_COMPLETED or PAID.
 */
export function canCompleteOrder(
  paymentStatus: string,
  tasks: Task[]
): boolean {
  if (paymentStatus !== 'PAYMENT_COMPLETED' && paymentStatus !== 'PAID') {
    return false;
  }
  return tasks.every(task => task.status === 'COMPLETED');
}

/**
 * Validates if booking confirmation requirements are satisfied.
 * Requires verified payment status or explicit owner verification.
 */
export function canConfirmBooking(
  paymentStatus: string,
  verificationStatus?: PaymentVerificationStatus
): { canConfirm: boolean; reason?: string } {
  if (verificationStatus === 'REJECTED') {
    return { canConfirm: false, reason: 'Payment was rejected.' };
  }
  if (
    paymentStatus === 'PAID' ||
    paymentStatus === 'PARTIAL' ||
    paymentStatus === 'PAYMENT_COMPLETED' ||
    verificationStatus === 'VERIFIED'
  ) {
    return { canConfirm: true };
  }
  return {
    canConfirm: false,
    reason: 'Advance payment must be submitted and verified before booking confirmation.'
  };
}

/**
 * Evaluates operational pre-flight conflicts before confirming a booking or order.
 * Checks event date overlaps, location, and crew member skill/availability.
 */
export function performPreflightCheck(
  eventDateISO: string,
  locationAddress: string,
  requiredServices: string[],
  existingStudioOrders: Order[],
  studioMembers: StudioMember[]
): PreflightConflictReport {
  const warnings: string[] = [];
  const suggestions: string[] = [];

  // 1. Event Date Conflict Check
  const eventDateConflicts = existingStudioOrders
    .filter(o => !o.isDeleted && o.orderStatus !== 'CANCELLED' && o.eventDate === eventDateISO)
    .map(o => ({
      orderId: o.id,
      orderNumber: o.orderNumber,
      eventType: o.eventType,
    }));

  if (eventDateConflicts.length > 0) {
    warnings.push(
      `Studio already has ${eventDateConflicts.length} active event(s) booked on ${eventDateISO}.`
    );
  }

  // 2. Resource/Skill match check
  const requiredSkills: string[] = [];
  for (const svc of requiredServices) {
    const sLower = svc.toLowerCase();
    if (sLower.includes('photo')) requiredSkills.push('PHOTOGRAPHY');
    if (sLower.includes('video')) requiredSkills.push('VIDEOGRAPHY');
    if (sLower.includes('album')) requiredSkills.push('ALBUM_DESIGN');
  }

  const matchingMembers = studioMembers.filter(m =>
    !m.isDeleted &&
    (m.status === 'ACTIVE' || !m.status) &&
    requiredSkills.some(reqSkill => m.skills.includes(reqSkill))
  );

  if (matchingMembers.length === 0 && requiredSkills.length > 0) {
    warnings.push('No active studio crew members match the required skills for this booking.');
  } else if (matchingMembers.length > 0) {
    suggestions.push(
      `Found ${matchingMembers.length} available member(s) with matching skills (${matchingMembers.map(m => m.name).join(', ')}).`
    );
  }

  if (!locationAddress || locationAddress.trim().length === 0) {
    warnings.push('Event location address is incomplete.');
  }

  return {
    hasConflicts: eventDateConflicts.length > 0 || warnings.length > 0,
    eventDateConflicts,
    resourceConflicts: [],
    warnings,
    suggestions,
    evaluatedAt: new Date().toISOString(),
  };
}

/**
 * Generates automated resource suggestions for studio owner review & confirmation.
 * Follows principle: SYSTEM SUGGESTS -> STUDIO OWNER REVIEWS -> STUDIO OWNER CONFIRMS -> SAVED.
 */
export function generateResourceSuggestions(
  eventDateISO: string,
  requiredSkills: string[],
  studioMembers: StudioMember[],
  activeTasks: Task[]
): ResourceSuggestion[] {
  const activeMembers = studioMembers.filter(m => !m.isDeleted && (m.status === 'ACTIVE' || !m.status));

  return activeMembers.map(member => {
    const matchingSkills = requiredSkills.filter(skill => member.skills.includes(skill));
    const memberTasks = activeTasks.filter(t => !t.isDeleted && t.assignedMemberId === member.id && t.status !== 'COMPLETED');
    const matchScore = matchingSkills.length > 0 ? Math.min(100, matchingSkills.length * 40 - memberTasks.length * 10) : 10;

    let reason = 'General availability';
    if (matchingSkills.length > 0) {
      reason = `Matches skills: ${matchingSkills.join(', ')}. Current active workload: ${memberTasks.length} task(s).`;
    }

    return {
      memberId: member.id,
      memberName: member.name,
      skill: matchingSkills[0] || member.skills[0] || 'GENERAL',
      matchScore: Math.max(0, matchScore),
      matchReason: reason,
      availableOnDate: true,
      currentWorkload: memberTasks.length,
      status: 'SUGGESTED' as const,
    };
  }).sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * Transforms full Order into safe CustomerOrderView DTO (hiding private internal notes, internal tasks, crew info, internal financials).
 */
export function toCustomerOrderView(order: Order, studioName: string): CustomerOrderView {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    studioName,
    studioId: order.studioId,
    eventType: order.eventType,
    eventDate: order.eventDate,
    eventLocation: order.eventLocation || order.locationInfo?.address,
    services: order.services,
    totalAmount: order.pricing.finalConfirmedPrice || order.pricing.estimatedPrice,
    advanceAmount: order.pricing.advanceAmount,
    amountPaid: order.pricing.advanceAmount, // or calculated from payments
    remainingAmount: order.pricing.remainingAmount,
    paymentStatus: order.paymentStatus,
    orderStatus: order.orderStatus,
    bookingStatus: order.bookingStatus,
    trackingPasskey: order.trackingPasskey,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
}

/**
 * Evaluates automatic order status transition based on event date and task progress.
 */
export function evaluateOrderStatus(
  currentStatus: OrderStatus,
  eventDateISO: string,
  tasksCompleted: boolean,
  paymentCompleted: boolean
): OrderStatus {
  if (currentStatus === 'CANCELLED') return 'CANCELLED';

  if (tasksCompleted && paymentCompleted) {
    return 'COMPLETED';
  }

  const today = new Date().toISOString().split('T')[0];
  if (currentStatus === 'AWAITING_EVENT' && eventDateISO < today) {
    return 'POST_EVENT_IN_PROGRESS';
  }

  return currentStatus;
}

/**
 * Generates dynamic post-event task pipeline based on selected services.
 */
export function generateWorkflowTasks(
  orderId: string,
  studioId: string,
  services: string[]
): Array<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>> {
  const tasks: Array<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>> = [];
  let seq = 1;

  const hasPhotography = services.some(s => s.toLowerCase().includes('photo'));
  const hasVideography = services.some(s => s.toLowerCase().includes('video'));
  const hasAlbum = services.some(s => s.toLowerCase().includes('album'));

  if (hasPhotography) {
    tasks.push({
      orderId,
      studioId,
      title: 'RAW Photos Review & Selection',
      serviceCategory: 'PHOTOGRAPHY',
      assignedMemberId: '',
      assignedMemberName: 'Unassigned',
      status: 'ASSIGNED',
      sequenceOrder: seq++
    });
    tasks.push({
      orderId,
      studioId,
      title: 'Photo Editing',
      serviceCategory: 'PHOTOGRAPHY',
      assignedMemberId: '',
      assignedMemberName: 'Unassigned',
      status: 'ASSIGNED',
      sequenceOrder: seq++
    });
  }

  if (hasAlbum) {
    tasks.push({
      orderId,
      studioId,
      title: 'Album Preparation & Design',
      serviceCategory: 'ALBUM',
      assignedMemberId: '',
      assignedMemberName: 'Unassigned',
      status: 'ASSIGNED',
      sequenceOrder: seq++
    });
    tasks.push({
      orderId,
      studioId,
      title: 'Album Printing & Delivery Prep',
      serviceCategory: 'ALBUM',
      assignedMemberId: '',
      assignedMemberName: 'Unassigned',
      status: 'ASSIGNED',
      sequenceOrder: seq++
    });
  }

  if (hasVideography) {
    tasks.push({
      orderId,
      studioId,
      title: 'Video Editing',
      serviceCategory: 'VIDEOGRAPHY',
      assignedMemberId: '',
      assignedMemberName: 'Unassigned',
      status: 'ASSIGNED',
      sequenceOrder: seq++
    });
  }

  return tasks;
}

/**
 * Validates whether a soft-deleted record is within the allowed recovery window.
 * Default recovery window is 14 days per Focoman configuration.
 */
export function isWithinRecoveryWindow(
  deletedAtISO: string | null | undefined,
  windowDays = RECOVERY_WINDOW_DAYS
): boolean {
  if (!deletedAtISO) return false;
  const deletedTime = new Date(deletedAtISO).getTime();
  if (isNaN(deletedTime)) return false;

  const now = Date.now();
  const maxRetentionMs = windowDays * 24 * 60 * 60 * 1000;
  return now - deletedTime <= maxRetentionMs;
}

/**
 * Pure domain check if a record can be restored.
 */
export function canRestoreRecord(
  record: SoftDeletable,
  windowDays = RECOVERY_WINDOW_DAYS
): { allowed: boolean; reason?: string } {
  if (!record.isDeleted) {
    return { allowed: false, reason: 'Record is not deleted.' };
  }

  if (!isWithinRecoveryWindow(record.deletedAt, windowDays)) {
    return {
      allowed: false,
      reason: `Recovery window of ${windowDays} days has expired. Record cannot be restored.`,
    };
  }

  return { allowed: true };
}

/**
 * Pure transformation applying soft delete attributes to an entity.
 */
export function applySoftDelete<T extends SoftDeletable>(
  entity: T,
  deletedByUid: string
): T {
  return {
    ...entity,
    isDeleted: true,
    deletedAt: new Date().toISOString(),
    deletedBy: deletedByUid,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Pure transformation applying restore attributes to an entity.
 */
export function applyRestore<T extends SoftDeletable>(entity: T): T {
  return {
    ...entity,
    isDeleted: false,
    deletedAt: null,
    deletedBy: null,
    updatedAt: new Date().toISOString(),
  };
}

