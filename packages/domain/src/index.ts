import { OrderStatus, Task } from '@focoman/types';

/**
 * Pure Business Logic & Domain State Engines
 * Source of Truth: Focoman Product Discovery Document
 */

/**
 * Calculates whether an order can be marked COMPLETED.
 * An order is COMPLETED only when:
 * 1. Required production/delivery work tasks are COMPLETED.
 * 2. Payment status is marked PAYMENT_COMPLETED.
 */
export function canCompleteOrder(
  paymentStatus: string,
  tasks: Task[]
): boolean {
  if (paymentStatus !== 'PAYMENT_COMPLETED') {
    return false;
  }
  return tasks.every(task => task.status === 'COMPLETED');
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
