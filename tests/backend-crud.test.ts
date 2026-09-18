import { test, describe } from "node:test";
import assert from "node:assert";
import {
  isWithinRecoveryWindow,
  canRestoreRecord,
  applySoftDelete,
  applyRestore,
  canCompleteOrder,
  generateWorkflowTasks,
  canConfirmBooking,
  performPreflightCheck,
  generateResourceSuggestions,
  toCustomerOrderView,
} from "../packages/domain/src/index.ts";
import {
  CreateOrderSchema,
  UpdateOrderSchema,
  CreateTaskSchema,
  UpdateTaskSchema,
  CreateCustomerSchema,
  UpdateCustomerSchema,
  CreateMemberSchema,
  UpdateMemberSchema,
  UpdateStudioSchema,
  AssignResourceSchema,
  UpdateTaskStatusSchema,
  UpdatePaymentSchema,
  CreatePackageSchema,
  BookingRequestSchema,
  RecordPaymentSchema,
  CancelOrderSchema,
} from "../packages/validation/src/index.ts";
import { RECOVERY_WINDOW_DAYS } from "../packages/config/src/index.ts";

describe("1. Recovery System & Soft-Delete Domain Logic", () => {
  test("RECOVERY_WINDOW_DAYS is strictly configured to 14 days", () => {
    assert.strictEqual(RECOVERY_WINDOW_DAYS, 14);
  });

  test("isWithinRecoveryWindow returns true for recently deleted record", () => {
    const recentDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(); // 2 days ago
    assert.strictEqual(isWithinRecoveryWindow(recentDate), true);
  });

  test("isWithinRecoveryWindow returns false for non-deleted or null dates", () => {
    assert.strictEqual(isWithinRecoveryWindow(undefined), false);
    assert.strictEqual(isWithinRecoveryWindow(null), false);
  });

  test("isWithinRecoveryWindow returns false for records deleted > 14 days ago", () => {
    const expiredDate = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(); // 15 days ago
    assert.strictEqual(isWithinRecoveryWindow(expiredDate), false);
  });

  test("canRestoreRecord correctly validates recovery eligibility", () => {
    const validRecord = {
      isDeleted: true,
      deletedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    };
    const nonDeletedRecord = {
      isDeleted: false,
    };
    const expiredRecord = {
      isDeleted: true,
      deletedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    };

    assert.strictEqual(canRestoreRecord(validRecord).allowed, true);
    assert.strictEqual(canRestoreRecord(nonDeletedRecord).allowed, false);
    assert.strictEqual(canRestoreRecord(expiredRecord).allowed, false);
  });

  test("applySoftDelete adds deletion metadata", () => {
    const entity = { id: "ORD-123", name: "Wedding Shoot", isDeleted: false };
    const softDeleted = applySoftDelete(entity, "user_owner_456");

    assert.strictEqual(softDeleted.isDeleted, true);
    assert.strictEqual(softDeleted.deletedBy, "user_owner_456");
    assert.ok(softDeleted.deletedAt);
    assert.ok(Date.parse(softDeleted.deletedAt));
  });

  test("applyRestore resets soft deletion metadata", () => {
    const entity = {
      id: "ORD-123",
      isDeleted: true,
      deletedAt: new Date().toISOString(),
      deletedBy: "user_owner_456",
    };
    const restored = applyRestore(entity);

    assert.strictEqual(restored.isDeleted, false);
    assert.strictEqual(restored.deletedAt, null);
    assert.strictEqual(restored.deletedBy, null);
  });
});

describe("2. OMS Domain Pipeline Logic", () => {
  test("generateWorkflowTasks generates sequential, studio-isolated tasks", () => {
    const tasks = generateWorkflowTasks("ORD-001", "studio-alpha", ["Candid Photography", "Cinematic Video"]);
    assert.ok(tasks.length > 0);
    assert.strictEqual(tasks[0].orderId, "ORD-001");
    assert.strictEqual(tasks[0].studioId, "studio-alpha");
    assert.strictEqual(tasks[0].status, "ASSIGNED");
    assert.strictEqual(tasks[0].sequenceOrder, 1);
  });

  test("canCompleteOrder requires full payment and completed tasks", () => {
    const pendingPaymentTasks = [{ status: "COMPLETED" as const }, { status: "COMPLETED" as const }];
    assert.strictEqual(canCompleteOrder("PAYMENT_PENDING", pendingPaymentTasks as any), false);

    const completedTasksWithFullPayment = [{ status: "COMPLETED" as const }, { status: "COMPLETED" as const }];
    assert.strictEqual(canCompleteOrder("PAYMENT_COMPLETED", completedTasksWithFullPayment as any), true);

    const incompleteTasksWithFullPayment = [{ status: "COMPLETED" as const }, { status: "IN_PROGRESS" as const }];
    assert.strictEqual(canCompleteOrder("PAYMENT_COMPLETED", incompleteTasksWithFullPayment as any), false);
  });
});

describe("3. Validation Schemas - CRUD Operations", () => {
  test("CreateOrderSchema parses valid order and rejects invalid prices", () => {
    const valid = CreateOrderSchema.safeParse({
      studioId: "studio-1",
      customerName: "Alice Walker",
      customerPhone: "+919876543210",
      eventType: "WEDDING",
      eventDate: "2026-10-15",
      eventLocation: "Grand Palace",
      services: ["Photography"],
      estimatedPrice: 50000,
      finalConfirmedPrice: 50000,
      advanceAmount: 10000,
    });
    assert.strictEqual(valid.success, true);

    const invalid = CreateOrderSchema.safeParse({
      studioId: "studio-1",
      customerName: "Alice",
      eventType: "WEDDING",
      finalConfirmedPrice: -500, // Negative price forbidden
    });
    assert.strictEqual(invalid.success, false);
  });

  test("UpdateOrderSchema validates partial fields", () => {
    const valid = UpdateOrderSchema.safeParse({
      orderId: "ORD-999",
      studioId: "studio-1",
      eventType: "PRE_WEDDING",
      eventLocation: "Beach Resort",
    });
    assert.strictEqual(valid.success, true);
  });

  test("CreateTaskSchema and UpdateTaskSchema validation", () => {
    const validTask = CreateTaskSchema.safeParse({
      orderId: "ORD-001",
      studioId: "studio-1",
      title: "Color Grading and Export",
      serviceCategory: "VIDEOGRAPHY",
    });
    assert.strictEqual(validTask.success, true);

    const validUpdate = UpdateTaskSchema.safeParse({
      taskId: "TSK-001",
      orderId: "ORD-001",
      studioId: "studio-1",
      status: "REVIEW",
      reworkNotes: "Please adjust contrast",
    });
    assert.strictEqual(validUpdate.success, true);
  });

  test("CreateCustomerSchema and UpdateCustomerSchema validation", () => {
    const validCustomer = CreateCustomerSchema.safeParse({
      studioId: "studio-1",
      name: "Jane Doe",
      phone: "+919876543210",
      email: "jane@example.com",
    });
    assert.strictEqual(validCustomer.success, true);

    const validUpdate = UpdateCustomerSchema.safeParse({
      customerId: "CUS-100",
      studioId: "studio-1",
      address: "742 Evergreen Terrace",
    });
    assert.strictEqual(validUpdate.success, true);
  });

  test("CreateMemberSchema and UpdateMemberSchema validation", () => {
    const validMember = CreateMemberSchema.safeParse({
      studioId: "studio-1",
      name: "Bob Editor",
      email: "bob@studio.com",
      skills: ["Video Editing", "Color Grading"],
    });
    assert.strictEqual(validMember.success, true);

    const emptySkills = CreateMemberSchema.safeParse({
      studioId: "studio-1",
      name: "Bob Editor",
      email: "bob@studio.com",
      skills: [],
    });
    assert.strictEqual(emptySkills.success, false);

    const validUpdate = UpdateMemberSchema.safeParse({
      memberId: "MEM-100",
      studioId: "studio-1",
      skills: ["Drone Operation"],
    });
    assert.strictEqual(validUpdate.success, true);
  });

  test("UpdateStudioSchema validation", () => {
    const validStudioUpdate = UpdateStudioSchema.safeParse({
      studioId: "studio-alpha",
      name: "Studio Alpha Pro",
      city: "Bangalore",
      features: {
        marketplace: true,
      },
    });
    assert.strictEqual(validStudioUpdate.success, true);
  });

  test("CreatePackageSchema and BookingRequestSchema validation", () => {
    const validPackage = CreatePackageSchema.safeParse({
      studioId: "studio-1",
      name: "Standard Wedding Package",
      services: ["Photography", "Videography"],
      price: 45000,
      isNegotiable: true,
    });
    assert.strictEqual(validPackage.success, true);

    const validBooking = BookingRequestSchema.safeParse({
      studioId: "studio-1",
      customerName: "Siddharth Verma",
      customerEmail: "siddharth@example.com",
      eventType: "Wedding",
      eventDate: "2026-11-25",
      address: "Hotel Leela, Bangalore",
      price: 45000,
      requestNegotiation: true,
    });
    assert.strictEqual(validBooking.success, true);

    const validPayment = RecordPaymentSchema.safeParse({
      studioId: "studio-1",
      customerId: "CUS-101",
      bookingRequestId: "BKG-101",
      amount: 15000,
      method: "UPI",
      referenceNumber: "UPI-9876543210",
    });
    assert.strictEqual(validPayment.success, true);

    const validCancellation = CancelOrderSchema.safeParse({
      orderId: "ORD-101",
      studioId: "studio-1",
      cancellationReason: "Client requested date change to unavailable slot",
    });
    assert.strictEqual(validCancellation.success, true);
  });
});

describe("4. Major Design Amendment - Preflight Checks & Booking Confirmation", () => {
  test("canConfirmBooking requires verified payment", () => {
    const unverified = canConfirmBooking("PENDING", "PENDING_VERIFICATION");
    assert.strictEqual(unverified.canConfirm, false);

    const verified = canConfirmBooking("PAID", "VERIFIED");
    assert.strictEqual(verified.canConfirm, true);

    const rejected = canConfirmBooking("PAID", "REJECTED");
    assert.strictEqual(rejected.canConfirm, false);
  });

  test("performPreflightCheck detects date conflicts and matching skills", () => {
    const existingOrders = [
      {
        id: "ORD-1",
        studioId: "studio-1",
        orderNumber: "ORD-101",
        eventType: "Wedding",
        eventDate: "2026-11-20",
        orderStatus: "AWAITING_EVENT" as const,
        isDeleted: false,
      },
    ];

    const studioMembers = [
      {
        id: "MEM-1",
        studioId: "studio-1",
        name: "Rahul",
        email: "rahul@studio.com",
        skills: ["PHOTOGRAPHY"],
        status: "ACTIVE" as const,
        createdAt: "2026-01-01",
        updatedAt: "2026-01-01",
      },
    ];

    const report = performPreflightCheck(
      "2026-11-20",
      "123 Main St, Chennai",
      ["Photography"],
      existingOrders as any,
      studioMembers as any
    );

    assert.strictEqual(report.hasConflicts, true);
    assert.strictEqual(report.eventDateConflicts.length, 1);
    assert.strictEqual(report.eventDateConflicts[0].orderNumber, "ORD-101");
    assert.ok(report.suggestions.length > 0);
  });

  test("generateResourceSuggestions computes match scores correctly", () => {
    const studioMembers = [
      {
        id: "MEM-1",
        studioId: "studio-1",
        name: "Priya",
        email: "priya@studio.com",
        skills: ["PHOTOGRAPHY", "ALBUM_DESIGN"],
        status: "ACTIVE" as const,
        createdAt: "2026-01-01",
        updatedAt: "2026-01-01",
      },
      {
        id: "MEM-2",
        studioId: "studio-1",
        name: "Karan",
        email: "karan@studio.com",
        skills: ["VIDEOGRAPHY"],
        status: "ACTIVE" as const,
        createdAt: "2026-01-01",
        updatedAt: "2026-01-01",
      },
    ];

    const suggestions = generateResourceSuggestions(
      "2026-11-20",
      ["PHOTOGRAPHY"],
      studioMembers as any,
      []
    );

    assert.strictEqual(suggestions.length, 2);
    assert.strictEqual(suggestions[0].memberId, "MEM-1");
    assert.strictEqual(suggestions[0].status, "SUGGESTED");
    assert.ok(suggestions[0].matchScore > suggestions[1].matchScore);
  });
});

describe("5. Major Design Amendment - Customer Order View Data Isolation", () => {
  test("toCustomerOrderView sanitizes order and strips private internal fields", () => {
    const order = {
      id: "ORD-555",
      studioId: "studio-1",
      orderNumber: "ORD-1055",
      customer: { id: "CUS-1", name: "Anand", phone: "+919876543210" },
      eventType: "Wedding",
      eventDate: "2026-12-01",
      eventLocation: "Beach Resort, Goa",
      services: ["Photography", "Cinematography"],
      packages: ["Royal Package"],
      pricing: {
        estimatedPrice: 100000,
        finalConfirmedPrice: 90000,
        advanceAmount: 25000,
        remainingAmount: 65000,
      },
      paymentStatus: "PARTIAL" as const,
      orderStatus: "AWAITING_EVENT" as const,
      bookingStatus: "BOOKING_CONFIRMED" as const,
      assignedResources: [{ memberId: "M1", memberName: "Private Crew", skill: "PHOTO", availabilityConfirmed: true }],
      trackingPasskey: "PASS-999",
      createdAt: "2026-09-01T10:00:00Z",
      updatedAt: "2026-09-01T10:00:00Z",
    };

    const customerView = toCustomerOrderView(order as any, "Studio One");

    assert.strictEqual(customerView.id, "ORD-555");
    assert.strictEqual(customerView.studioName, "Studio One");
    assert.strictEqual(customerView.totalAmount, 90000);
    assert.strictEqual(customerView.advanceAmount, 25000);
    assert.strictEqual((customerView as any).assignedResources, undefined);
    assert.strictEqual((customerView as any).internalNotes, undefined);
  });
});

