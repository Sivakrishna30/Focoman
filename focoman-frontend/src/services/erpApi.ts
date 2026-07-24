const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

export interface EmployeeDTO {
  id: string;
  studioId: string;
  employeeCode: string;
  name: string;
  mobile: string;
  email: string;
  role: string;
  username: string;
  status: string;
  primaryExpertise: string;
  skills: string;
  activeOrders: number;
  joinedDate: string;
  crewHandle: string;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BACKEND_URL}${path}`, init);
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.json() as Promise<T>;
}

export const erpApi = {
  getEmployees: (studioId: string) => request<EmployeeDTO[]>(`/api/erp/employees?studioId=${encodeURIComponent(studioId)}`),
  createEmployee: (studioId: string, name: string, mobile: string, role: string, username: string) =>
    request<EmployeeDTO>(`/api/erp/employees?studioId=${encodeURIComponent(studioId)}&name=${encodeURIComponent(name)}&mobile=${encodeURIComponent(mobile)}&role=${encodeURIComponent(role)}&username=${encodeURIComponent(username)}`, { method: "POST" }),
};