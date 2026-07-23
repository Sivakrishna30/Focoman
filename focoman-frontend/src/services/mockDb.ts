// ─── Types ──────────────────────────────────────────────────────────────────

export type Plan = "basic" | "professional" | "complete";
export type OrderStatus =
  | "LEAD"
  | "BOOKING_CONFIRMED"
  | "SHOOT_SCHEDULED"
  | "SHOOT_COMPLETED"
  | "EDITING"
  | "ALBUM_DESIGN"
  | "DELIVERY_READY"
  | "COMPLETED"
  | "OVER_SLA";

export interface StudioMock {
  studioId: string;
  slug: string;
  studioName: string;
  brandName: string;
  ownerName: string;
  email: string;
  mobile: string;
  city: string;
  status: "ACTIVE" | "PENDING";
  plan: Plan;
  joinedDate: string;
}

export interface EmployeeMock {
  employeeId: string;
  employeeCode: string;
  studioId: string;
  crewHandle: string; // username@studioSlug
  username: string;
  name: string;
  role: "PHOTOGRAPHER" | "VIDEOGRAPHER" | "EDITOR" | "ALBUM_DESIGNER" | "RECEPTIONIST" | "MANAGER";
  email: string;
  phone: string;
  joinedDate: string;
  activeOrders: number;
  status: "ACTIVE" | "INACTIVE";
}

export interface CustomerMock {
  customerId: string;
  studioId: string;
  name: string;
  mobile: string;
  email?: string;
  city: string;
  leadSource: "INSTAGRAM" | "WEBSITE" | "REFERRAL" | "WALKIN" | "GOOGLE" | "WHATSAPP";
  totalOrders: number;
  totalRevenue: number;
  lastEventDate: string;
  eventTypes: string[];
  tags: string[];
}

export interface OrderMock {
  orderId: string;
  displayId: string;
  studioId: string;
  customerId: string;
  customerName: string;
  customerMobile: string;
  eventType: string;
  eventDate: string;
  venue?: string;
  amount: number;
  paidAmount: number;
  status: OrderStatus;
  slaDays: number; // expected days to complete post-shoot
  shootDate?: string;
  assignedTeam: string[];
  galleryLink?: string;
  notes?: string;
  createdDate: string;
  workflowTimeline: { stage: string; date: string; completed: boolean }[];
}

export interface WhatsAppSettings {
  studioId: string;
  enabled: boolean;
  notifications: {
    newLead: boolean;
    bookingConfirmed: boolean;
    advanceReceived: boolean;
    shootReminder24h: boolean;
    shootCompleted: boolean;
    editingStarted: boolean;
    clientPreviewReady: boolean;
    albumApproved: boolean;
    deliveryReady: boolean;
    paymentDue: boolean;
    birthdayWish: boolean;
    anniversaryWish: boolean;
  };
}

// ─── Mock Studios ───────────────────────────────────────────────────────────

export const MOCK_STUDIOS: StudioMock[] = [
  {
    studioId: "std-001",
    slug: "luminary",
    studioName: "Luminary Studios Pvt Ltd",
    brandName: "Luminary Photography",
    ownerName: "Siva Krishna",
    email: "siva@luminary.com",
    mobile: "+91 98765 43210",
    city: "Hyderabad",
    status: "ACTIVE",
    plan: "professional",
    joinedDate: "2026-01-15",
  },
  {
    studioId: "std-002",
    slug: "vividmoments",
    studioName: "Vivid Moments Studio",
    brandName: "Vivid Moments",
    ownerName: "Priya Sharma",
    email: "priya@vividmoments.in",
    mobile: "+91 98123 45678",
    city: "Bangalore",
    status: "ACTIVE",
    plan: "basic",
    joinedDate: "2026-03-01",
  },
];

// ─── Mock Customers ──────────────────────────────────────────────────────────

export const MOCK_CUSTOMERS: CustomerMock[] = [
  {
    customerId: "cus-001",
    studioId: "std-001",
    name: "Siddharth & Sneha",
    mobile: "+91 99887 76655",
    email: "siddharth.kumar@gmail.com",
    city: "Hyderabad",
    leadSource: "INSTAGRAM",
    totalOrders: 2,
    totalRevenue: 200000,
    lastEventDate: "2026-08-15",
    eventTypes: ["Wedding & Reception", "Pre-Wedding"],
    tags: ["VIP", "Repeat Client"],
  },
  {
    customerId: "cus-002",
    studioId: "std-001",
    name: "Anita & Rohan Mehta",
    mobile: "+91 97766 55443",
    email: "anita.mehta@gmail.com",
    city: "Secunderabad",
    leadSource: "REFERRAL",
    totalOrders: 1,
    totalRevenue: 55000,
    lastEventDate: "2026-09-02",
    eventTypes: ["Pre-Wedding Shoot"],
    tags: [],
  },
  {
    customerId: "cus-003",
    studioId: "std-001",
    name: "Karthik Reddy",
    mobile: "+91 94456 78901",
    email: "karthik.r@outlook.com",
    city: "Hyderabad",
    leadSource: "GOOGLE",
    totalOrders: 1,
    totalRevenue: 18000,
    lastEventDate: "2026-07-20",
    eventTypes: ["Baby Shower"],
    tags: ["New Client"],
  },
  {
    customerId: "cus-004",
    studioId: "std-001",
    name: "Neha & Arjun Patel",
    mobile: "+91 91234 56789",
    city: "Hyderabad",
    leadSource: "WHATSAPP",
    totalOrders: 1,
    totalRevenue: 75000,
    lastEventDate: "2026-10-05",
    eventTypes: ["Wedding"],
    tags: ["Upcoming"],
  },
  {
    customerId: "cus-005",
    studioId: "std-001",
    name: "Preethi Nair",
    mobile: "+91 99001 23456",
    email: "preethi.nair@yahoo.com",
    city: "Hyderabad",
    leadSource: "WEBSITE",
    totalOrders: 3,
    totalRevenue: 85000,
    lastEventDate: "2026-06-10",
    eventTypes: ["Maternity", "Baby Shower", "Birthday"],
    tags: ["VIP", "Repeat Client"],
  },
];

// ─── Mock Employees ──────────────────────────────────────────────────────────

export const MOCK_EMPLOYEES: EmployeeMock[] = [
  {
    employeeId: "emp-101",
    employeeCode: "EMP-LUM-01",
    studioId: "std-001",
    crewHandle: "vikram_lens@luminary",
    username: "vikram_lens",
    name: "Vikram Reddy",
    role: "PHOTOGRAPHER",
    email: "vikram@luminary.com",
    phone: "+91 98001 11223",
    joinedDate: "2026-01-20",
    activeOrders: 3,
    status: "ACTIVE",
  },
  {
    employeeId: "emp-102",
    employeeCode: "EMP-LUM-02",
    studioId: "std-001",
    crewHandle: "ananya_edit@luminary",
    username: "ananya_edit",
    name: "Ananya Verma",
    role: "EDITOR",
    email: "ananya@luminary.com",
    phone: "+91 98002 22334",
    joinedDate: "2026-02-01",
    activeOrders: 2,
    status: "ACTIVE",
  },
  {
    employeeId: "emp-103",
    employeeCode: "EMP-LUM-03",
    studioId: "std-001",
    crewHandle: "suresh_video@luminary",
    username: "suresh_video",
    name: "Suresh Babu",
    role: "VIDEOGRAPHER",
    email: "suresh@luminary.com",
    phone: "+91 98003 33445",
    joinedDate: "2026-03-10",
    activeOrders: 2,
    status: "ACTIVE",
  },
  {
    employeeId: "emp-104",
    employeeCode: "EMP-LUM-04",
    studioId: "std-001",
    crewHandle: "divya_album@luminary",
    username: "divya_album",
    name: "Divya Krishnan",
    role: "ALBUM_DESIGNER",
    email: "divya@luminary.com",
    phone: "+91 98004 44556",
    joinedDate: "2026-04-05",
    activeOrders: 1,
    status: "ACTIVE",
  },
  {
    employeeId: "emp-105",
    employeeCode: "EMP-LUM-05",
    studioId: "std-001",
    crewHandle: "meera_front@luminary",
    username: "meera_front",
    name: "Meera Iyer",
    role: "RECEPTIONIST",
    email: "meera@luminary.com",
    phone: "+91 98005 55667",
    joinedDate: "2026-05-01",
    activeOrders: 0,
    status: "ACTIVE",
  },
];

// ─── Mock Orders ─────────────────────────────────────────────────────────────

export const MOCK_ORDERS: OrderMock[] = [
  {
    orderId: "ord-8821",
    displayId: "FOC-2026-8821",
    studioId: "std-001",
    customerId: "cus-001",
    customerName: "Siddharth & Sneha",
    customerMobile: "+91 99887 76655",
    eventType: "Wedding & Reception",
    eventDate: "2026-08-15",
    venue: "The Grand Kakatiya, Hyderabad",
    amount: 145000,
    paidAmount: 75000,
    status: "EDITING",
    slaDays: 30,
    shootDate: "2026-08-15",
    assignedTeam: ["Vikram Reddy", "Suresh Babu", "Ananya Verma"],
    galleryLink: "https://drive.google.com/drive/folders/sample-luminary-8821",
    createdDate: "2026-06-10",
    workflowTimeline: [
      { stage: "Lead Enquiry & Booking", date: "2026-06-10", completed: true },
      { stage: "Quotation & Advance Payment", date: "2026-06-12", completed: true },
      { stage: "Shoot Execution", date: "2026-08-15", completed: true },
      { stage: "RAW Backup & Culling", date: "2026-08-17", completed: true },
      { stage: "Photo & Video Editing", date: "Pending", completed: false },
      { stage: "Album Design & Client Approval", date: "Pending", completed: false },
      { stage: "Printing & Packaging", date: "Pending", completed: false },
      { stage: "Final Delivery & Settlement", date: "Pending", completed: false },
    ],
  },
  {
    orderId: "ord-9042",
    displayId: "FOC-2026-9042",
    studioId: "std-001",
    customerId: "cus-002",
    customerName: "Anita & Rohan Mehta",
    customerMobile: "+91 97766 55443",
    eventType: "Pre-Wedding Shoot",
    eventDate: "2026-09-02",
    venue: "Charminar Area, Hyderabad",
    amount: 55000,
    paidAmount: 55000,
    status: "DELIVERY_READY",
    slaDays: 14,
    shootDate: "2026-09-02",
    assignedTeam: ["Vikram Reddy"],
    galleryLink: "https://drive.google.com/drive/folders/sample-luminary-9042",
    createdDate: "2026-06-20",
    workflowTimeline: [
      { stage: "Lead Enquiry & Booking", date: "2026-06-20", completed: true },
      { stage: "Quotation & Advance Payment", date: "2026-06-22", completed: true },
      { stage: "Shoot Execution", date: "2026-09-02", completed: true },
      { stage: "RAW Backup & Selection", date: "2026-09-04", completed: true },
      { stage: "Editing & Color Grading", date: "2026-09-12", completed: true },
      { stage: "Final Delivery Ready", date: "2026-09-18", completed: true },
    ],
  },
  {
    orderId: "ord-9105",
    displayId: "FOC-2026-9105",
    studioId: "std-001",
    customerId: "cus-003",
    customerName: "Karthik Reddy",
    customerMobile: "+91 94456 78901",
    eventType: "Baby Shower",
    eventDate: "2026-07-20",
    amount: 18000,
    paidAmount: 18000,
    status: "COMPLETED",
    slaDays: 7,
    shootDate: "2026-07-20",
    assignedTeam: ["Vikram Reddy"],
    galleryLink: "https://drive.google.com/drive/folders/sample-luminary-9105",
    createdDate: "2026-07-05",
    workflowTimeline: [
      { stage: "Lead Enquiry & Booking", date: "2026-07-05", completed: true },
      { stage: "Advance Payment", date: "2026-07-06", completed: true },
      { stage: "Shoot Execution", date: "2026-07-20", completed: true },
      { stage: "Editing", date: "2026-07-24", completed: true },
      { stage: "Gallery Delivered", date: "2026-07-27", completed: true },
    ],
  },
  {
    orderId: "ord-9201",
    displayId: "FOC-2026-9201",
    studioId: "std-001",
    customerId: "cus-004",
    customerName: "Neha & Arjun Patel",
    customerMobile: "+91 91234 56789",
    eventType: "Wedding",
    eventDate: "2026-10-05",
    venue: "Hotel Taj Deccan, Hyderabad",
    amount: 175000,
    paidAmount: 50000,
    status: "BOOKING_CONFIRMED",
    slaDays: 45,
    assignedTeam: ["Vikram Reddy", "Suresh Babu"],
    createdDate: "2026-07-18",
    workflowTimeline: [
      { stage: "Lead Enquiry & Booking", date: "2026-07-18", completed: true },
      { stage: "Quotation & Advance Payment", date: "2026-07-20", completed: true },
      { stage: "Shoot Execution", date: "Upcoming – Oct 5", completed: false },
      { stage: "RAW Backup & Culling", date: "Pending", completed: false },
      { stage: "Photo & Video Editing", date: "Pending", completed: false },
      { stage: "Album Design & Client Approval", date: "Pending", completed: false },
      { stage: "Final Delivery & Settlement", date: "Pending", completed: false },
    ],
  },
  {
    orderId: "ord-8954",
    displayId: "FOC-2026-8954",
    studioId: "std-001",
    customerId: "cus-005",
    customerName: "Preethi Nair",
    customerMobile: "+91 99001 23456",
    eventType: "Maternity Shoot",
    eventDate: "2026-06-10",
    amount: 22000,
    paidAmount: 22000,
    status: "OVER_SLA",
    slaDays: 10,
    shootDate: "2026-06-10",
    assignedTeam: ["Ananya Verma"],
    createdDate: "2026-05-28",
    notes: "Client has been waiting 45 days. Escalate immediately.",
    workflowTimeline: [
      { stage: "Lead Enquiry & Booking", date: "2026-05-28", completed: true },
      { stage: "Advance Payment", date: "2026-05-30", completed: true },
      { stage: "Shoot Execution", date: "2026-06-10", completed: true },
      { stage: "Editing", date: "2026-06-24", completed: true },
      { stage: "Gallery Delivery", date: "Delayed — Overdue", completed: false },
    ],
  },
  {
    orderId: "ord-9310",
    displayId: "FOC-2026-9310",
    studioId: "std-001",
    customerId: "cus-001",
    customerName: "Siddharth & Sneha",
    customerMobile: "+91 99887 76655",
    eventType: "Pre-Wedding Shoot",
    eventDate: "2026-05-12",
    amount: 55000,
    paidAmount: 55000,
    status: "COMPLETED",
    slaDays: 14,
    shootDate: "2026-05-12",
    assignedTeam: ["Vikram Reddy"],
    createdDate: "2026-04-20",
    workflowTimeline: [
      { stage: "Lead Enquiry & Booking", date: "2026-04-20", completed: true },
      { stage: "Advance Payment", date: "2026-04-22", completed: true },
      { stage: "Shoot Execution", date: "2026-05-12", completed: true },
      { stage: "Editing", date: "2026-05-20", completed: true },
      { stage: "Gallery Delivered", date: "2026-05-26", completed: true },
    ],
  },
];

// ─── WhatsApp Settings (default) ─────────────────────────────────────────────

export const DEFAULT_WHATSAPP_SETTINGS: WhatsAppSettings = {
  studioId: "std-001",
  enabled: true,
  notifications: {
    newLead: true,
    bookingConfirmed: true,
    advanceReceived: true,
    shootReminder24h: true,
    shootCompleted: false,
    editingStarted: false,
    clientPreviewReady: true,
    albumApproved: true,
    deliveryReady: true,
    paymentDue: true,
    birthdayWish: false,
    anniversaryWish: false,
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function getStudioBySlug(slug: string): StudioMock | undefined {
  return MOCK_STUDIOS.find((s) => s.slug === slug);
}

export function getOrdersByStudio(studioId: string): OrderMock[] {
  return MOCK_ORDERS.filter((o) => o.studioId === studioId);
}

export function getCustomersByStudio(studioId: string): CustomerMock[] {
  return MOCK_CUSTOMERS.filter((c) => c.studioId === studioId);
}

export function getEmployeesByStudio(studioId: string): EmployeeMock[] {
  return MOCK_EMPLOYEES.filter((e) => e.studioId === studioId);
}

export function getDashboardStats(studioId: string) {
  const orders = getOrdersByStudio(studioId);
  const completed = orders.filter((o) => o.status === "COMPLETED").length;
  const pending = orders.filter(
    (o) => !["COMPLETED", "OVER_SLA"].includes(o.status)
  ).length;
  const overSla = orders.filter((o) => o.status === "OVER_SLA").length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.paidAmount, 0);
  const pendingRevenue = orders.reduce(
    (sum, o) => sum + (o.amount - o.paidAmount),
    0
  );

  const customers = getCustomersByStudio(studioId);
  const topCustomers = [...customers]
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 5);

  return {
    totalOrders: orders.length,
    completed,
    pending,
    overSla,
    totalRevenue,
    pendingRevenue,
    topCustomers,
  };
}

export function canAccessModule(plan: Plan, module: "oms" | "crm" | "erp" | "whatsapp"): boolean {
  if (module === "oms") return true;
  if (module === "crm") return plan === "professional" || plan === "complete";
  if (module === "erp") return plan === "professional" || plan === "complete";
  if (module === "whatsapp") return plan === "complete";
  return false;
}
