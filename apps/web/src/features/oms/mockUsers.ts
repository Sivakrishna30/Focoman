import type { MockUser } from "@/types/oms";

export const mockUsers: MockUser[] = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    name: "Studio Owner",
    role: "STUDIO_OWNER",
    label: "Login as Studio Owner",
  },
  {
    id: "22222222-2222-2222-2222-222222222201",
    name: "Arjun Nair",
    role: "EMPLOYEE",
    label: "Login as Employee",
  },
  {
    id: "44444444-4444-4444-4444-444444444401",
    name: "Ananya Sharma",
    role: "CUSTOMER",
    label: "Login as Customer",
  },
];
