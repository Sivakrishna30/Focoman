import { Order, OrderStatus, Task } from '@focoman/types';
import { generateWorkflowTasks, canCompleteOrder, evaluateOrderStatus } from '@focoman/domain';

/**
 * Focoman Order Management System (OMS) Data Service
 * Primary Source of Truth: Focoman Product Discovery Document
 */

export type { OrderStatus, Order, Task };

export interface StudioProfile {
  studioId: string;
  prefix: string;
  studioName: string;
  brandName: string;
  ownerName: string;
  city: string;
}

export const omsApi = {
  /**
   * Evaluates and updates order status according to product discovery business rules
   */
  evaluateOrderCompletion(order: Order, tasks: Task[]): OrderStatus {
    const tasksCompleted = tasks.length > 0 && tasks.every(t => t.status === 'COMPLETED');
    const paymentCompleted = order.paymentStatus === 'PAYMENT_COMPLETED';

    return evaluateOrderStatus(
      order.orderStatus,
      order.eventDate,
      tasksCompleted,
      paymentCompleted
    );
  },

  /**
   * Helper to generate dynamic task pipelines for an order
   */
  createOrderTasks(orderId: string, studioId: string, services: string[]) {
    return generateWorkflowTasks(orderId, studioId, services);
  }
};
