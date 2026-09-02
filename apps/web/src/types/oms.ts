export type MockRole = "STUDIO_OWNER" | "EMPLOYEE" | "CUSTOMER";

export type MockUser = {
  id: string;
  name: string;
  role: MockRole;
  label: string;
};

export type Order = {
  orderId: string;
  customerName: string;
  eventType: string;
  eventDate: string;
  status: string;
  assignedEmployee: string;
  amount: number;
  createdDate: string;
  lastUpdated: string;
  studioId: string;
  customerId: string;
  employeeId: string;
};
