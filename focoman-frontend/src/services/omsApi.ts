import type { MockUser, Order } from "@/types/oms";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export async function fetchOrdersForUser(user: MockUser): Promise<Order[]> {
  const url = new URL("/api/oms/orders", API_BASE_URL);

  if (user.role === "EMPLOYEE") {
    url.searchParams.set("employeeId", user.id);
  }

  if (user.role === "CUSTOMER") {
    url.searchParams.set("customerId", user.id);
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to load orders");
  }

  return response.json();
}
