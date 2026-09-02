const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

export interface CustomerDTO {
  id: string;
  studioId: string;
  name: string;
  mobile: string;
  email: string;
  city: string;
  leadSource: string;
  totalOrders: number;
  totalRevenue: number;
  lastEventDate: string;
  eventTypes: string;
  tags: string;
  status: string;
}

export interface LeadDTO {
  id: string;
  studioId: string;
  customerId: string | null;
  customerName: string;
  customerMobile: string;
  customerEmail: string | null;
  source: string;
  eventType: string;
  eventDate: string | null;
  status: string;
  notes: string | null;
  assignedTo: string | null;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BACKEND_URL}${path}`, init);
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.json() as Promise<T>;
}

export const crmApi = {
  getCustomers: (studioId: string) => request<CustomerDTO[]>(`/api/crm/customers?studioId=${encodeURIComponent(studioId)}`),
  getLeads: (studioId: string) => request<LeadDTO[]>(`/api/crm/leads?studioId=${encodeURIComponent(studioId)}`),
  createCustomer: (studioId: string, name: string, mobile: string, email?: string, city?: string, leadSource?: string) =>
    request<CustomerDTO>(`/api/crm/customers?studioId=${encodeURIComponent(studioId)}&name=${encodeURIComponent(name)}&mobile=${encodeURIComponent(mobile)}${email ? `&email=${encodeURIComponent(email)}` : ""}${city ? `&city=${encodeURIComponent(city)}` : ""}${leadSource ? `&leadSource=${encodeURIComponent(leadSource)}` : ""}`, { method: "POST" }),
  createLead: (studioId: string, customerName: string, customerMobile: string, source: string, eventType: string, eventDate?: string) =>
    request<LeadDTO>(`/api/crm/leads?studioId=${encodeURIComponent(studioId)}&customerName=${encodeURIComponent(customerName)}&customerMobile=${encodeURIComponent(customerMobile)}&source=${encodeURIComponent(source)}&eventType=${encodeURIComponent(eventType)}${eventDate ? `&eventDate=${encodeURIComponent(eventDate)}` : ""}`, { method: "POST" }),
};