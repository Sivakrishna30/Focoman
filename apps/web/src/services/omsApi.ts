const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
export type OrderStatus = "LEAD" | "BOOKING_CONFIRMED" | "SHOOT_SCHEDULED" | "SHOOT_COMPLETED" | "EDITING" | "ALBUM_DESIGN" | "DELIVERY_READY" | "COMPLETED" | "OVER_SLA";
export interface StudioProfile { studioId: string; prefix: string; studioName: string; brandName: string; ownerName: string; city: string; }
export interface OmsOrder { orderId: string; displayId: string; studioId: string; customerName: string; customerMobile: string; eventType: string; eventDate: string; status: OrderStatus; assignedEmployee: string; assignedEmployeeId: string; amount: number; createdDate: string; lastUpdated: string; }
async function request<T>(path: string, init?: RequestInit): Promise<T> { const response = await fetch(`${BACKEND_URL}${path}`, init); if (!response.ok) throw new Error(`Request failed: ${response.status}`); return response.json() as Promise<T>; }

// TODO: Backend should provide endpoints to fetch orders by userId/role
// For now, this is a placeholder that accepts a user context
export async function fetchOrdersForUser(user: { id: string; role: string; name: string }, studioId?: string): Promise<OmsOrder[]> {
  if (!studioId) {
    console.warn("fetchOrdersForUser called without studioId - returning empty array. Backend integration needed.");
    return [];
  }
  try {
    return await omsApi.getOrders(studioId);
  } catch (error) {
    console.error("Failed to fetch orders for user:", error);
    return [];
  }
}

export const omsApi = {
  getStudio: (prefix: string) => request<StudioProfile>(`/api/studios/${encodeURIComponent(prefix)}`),
  getOrders: (studioId: string) => request<OmsOrder[]>(`/api/oms/orders?studioId=${encodeURIComponent(studioId)}`),
  updateStatus: (orderId: string, status: OrderStatus) => request<OmsOrder>(`/api/oms/orders/${orderId}/status?status=${status}`, { method: "PUT" }),
};
