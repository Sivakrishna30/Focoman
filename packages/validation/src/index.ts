import { z } from 'zod';

/**
 * Focoman Zod Validation Schemas
 * Source of Truth: Focoman Product Discovery Document
 */

export const CreateOrderSchema = z.object({
  studioId: z.string().min(1, 'Studio ID is required'),
  customerName: z.string().min(1, 'Customer name is required'),
  customerPhone: z.string().optional(),
  customerEmail: z.string().email().optional().or(z.literal('')),
  eventType: z.string().min(1, 'Event type is required'),
  eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Event date must be YYYY-MM-DD'),
  eventLocation: z.string().optional(),
  services: z.array(z.string()).min(1, 'At least one service must be selected'),
  packages: z.array(z.string()).optional(),
  estimatedPrice: z.number().nonnegative(),
  finalConfirmedPrice: z.number().nonnegative(),
  advanceAmount: z.number().nonnegative()
});

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;

export const AssignResourceSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  memberId: z.string().min(1, 'Member ID is required'),
  memberName: z.string().min(1, 'Member name is required'),
  skill: z.string().min(1, 'Skill is required')
});

export type AssignResourceInput = z.infer<typeof AssignResourceSchema>;

export const UpdateTaskStatusSchema = z.object({
  taskId: z.string().min(1, 'Task ID is required'),
  orderId: z.string().min(1, 'Order ID is required'),
  status: z.enum(['ASSIGNED', 'IN_PROGRESS', 'REVIEW', 'REWORK', 'COMPLETED']),
  reworkNotes: z.string().optional()
});

export type UpdateTaskStatusInput = z.infer<typeof UpdateTaskStatusSchema>;

export const UpdatePaymentSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  advanceAmount: z.number().nonnegative().optional(),
  paymentStatus: z.enum(['PAYMENT_PENDING', 'PAYMENT_CONFIRMATION_REQUIRED', 'PAYMENT_COMPLETED'])
});

export type UpdatePaymentInput = z.infer<typeof UpdatePaymentSchema>;
