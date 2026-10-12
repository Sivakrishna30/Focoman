"use client";

import { useMemo, useState, useEffect, useCallback, use, Fragment } from "react";
import { useSearchParams } from "next/navigation";
import { OrderStatus, TaskStatus, Order, Task, PaymentStatus, ResourceSuggestion, Customer, OrderInstallment, StudioMember } from "@focoman/types";
import {
  getStudioOrdersAction,
  getOrderTasksAction,
  createOrderAction,
  updateTaskStatusAction,
  updatePaymentStatusAction,
  assignResourceAction,
  assignTaskCrewAction,
  cancelOrderAction,
  deleteOrderAction,
} from "@/actions/orderActions";
import { getStudioMembersAction, createMemberAction } from "@/actions/memberActions";
import { getStudioCustomersAction } from "@/actions/customerActions";
import { useStudioWorkspace } from "@/components/StudioWorkspaceProvider";
import { getEventDaysRemaining, calculateOrderAging, calculateTaskAgeBadge } from "@/utils/dateUtils";
import { getStudioTimestampIST, getStudioCalendarDate } from "@focoman/domain";

const STATUS_LABELS: Record<OrderStatus, string> = {
  AWAITING_EVENT: "Awaiting Event",
  POST_EVENT_IN_PROGRESS: "Post-Event In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  AWAITING_EVENT: "badge-brand-blue",
  POST_EVENT_IN_PROGRESS: "badge-brand-orange",
  COMPLETED: "badge-status-success",
  CANCELLED: "badge-status-error",
};

const TASK_STATUS_COLORS: Record<TaskStatus, string> = {
  AWAITING_EVENT: "bg-blue-50 text-blue-700 border border-blue-200",
  ASSIGNED: "badge-status-neutral",
  IN_PROGRESS: "badge-brand-blue",
  REVIEW: "badge-brand-purple",
  REWORK: "badge-status-error",
  COMPLETED: "badge-status-success",
};

const PRESET_EVENT_TYPES = [
  "Wedding",
  "Reception",
  "Engagement",
  "Housewarming Ceremony",
  "Ear Piercing Ceremony",
  "Baby Shower",
  "Birthday Celebration",
  "Traditional Occasion",
  "Corporate Event",
  "Pre-Wedding / Outdoor Shoot",
  "Other",
] as const;

const PRESET_STUDIO_SERVICES = [
  "Traditional Photography",
  "Candid Photography",
  "Traditional Videography",
  "Cinematic Video / Teaser",
  "Drone Aerial Shoots",
  "Pre-Wedding Photoshoot",
  "Post-Wedding Photoshoot",
  "Premium Photobook Album",
] as const;

const DEFAULT_ORDER_FORM = {
  customerName: "",
  countryCode: "+91",
  customerPhone: "",
  customerEmail: "",
  passkeyPin: "",
  notifyWhatsApp: true,
  notifyEmail: true,
  eventType: "Wedding",
  customEventType: "",
  eventDate: "",
  eventLocation: "",
  services: [
    "Traditional Photography",
    "Candid Photography",
    "Traditional Videography",
    "Premium Photobook Album",
  ] as string[],
  customServiceInput: "",
  finalConfirmedPrice: "" as unknown as number,
  advanceAmount: "" as unknown as number,
};

export default function OmsPage({
  params,
}: {
  params: Promise<{ studioSlug: string }>;
}) {
  const { studioSlug } = use(params);
  const searchParams = useSearchParams();
  const { studio, user: workspaceUser, idToken: workspaceToken, authLoading, getIdToken } = useStudioWorkspace();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = useMemo(
    () => orders.find((o) => o.id === selectedId) || null,
    [orders, selectedId]
  );
  const [selectedTasks, setSelectedTasks] = useState<Task[]>([]);
  const [statusFilter, setStatusFilter] = useState<"ALL" | OrderStatus>("ALL");
  const [sortBy, setSortBy] = useState<"DATE_ASC" | "DATE_DESC" | "PRICE_ASC" | "PRICE_DESC">("DATE_ASC");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [copiedField, setCopiedField] = useState<"code" | "link" | null>(null);

  const handleCopyText = (text: string, field: "code" | "link") => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const handleShareText = async (url: string, title?: string) => {
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: title || "Focoman Order Tracking Link",
          url,
        });
        return;
      } catch (err: any) {
        if (err?.name === "AbortError") return;
      }
    }
    handleCopyText(url, "link");
  };

  const hasWhatsappPlan = Boolean(
    studio?.features?.whatsapp ||
    studio?.planInfo?.selectedCapabilities?.some((c) => c.startsWith("WHATSAPP")) ||
    (studio as any)?.capabilities?.some((c: string) => c.startsWith("WHATSAPP"))
  );


  // New Order Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const orderIdParam = searchParams.get("orderId");
    if (orderIdParam) {
      setSelectedId(orderIdParam);
    }
    const actionParam = searchParams.get("action");
    if (actionParam === "new-order") {
      setShowCreateModal(true);
    }
  }, [searchParams]);
  const [formError, setFormError] = useState<string | null>(null);
  const [newOrderForm, setNewOrderForm] = useState(DEFAULT_ORDER_FORM);
  const [showServicesDropdown, setShowServicesDropdown] = useState(false);
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);
  const [isEditingPricing, setIsEditingPricing] = useState(false);
  const [editConfirmedPrice, setEditConfirmedPrice] = useState("");
  const [editAdvanceAmount, setEditAdvanceAmount] = useState("");
  const [editAdvanceDate, setEditAdvanceDate] = useState("");
  const [editInstallments, setEditInstallments] = useState<OrderInstallment[]>([]);
  const [showAddInstallment, setShowAddInstallment] = useState(false);
  const [newInstallmentAmount, setNewInstallmentAmount] = useState("");
  const [newInstallmentDate, setNewInstallmentDate] = useState("");
  const [newInstallmentNotes, setNewInstallmentNotes] = useState("");
  const [pricingError, setPricingError] = useState<string | null>(null);
  const [installmentError, setInstallmentError] = useState<string | null>(null);
  const [showAuditHistory, setShowAuditHistory] = useState(false);

  useEffect(() => {
    setIsEditingPricing(false);
    setEditConfirmedPrice("");
    setEditAdvanceAmount("");
    setEditAdvanceDate("");
    setEditInstallments([]);
    setShowAddInstallment(false);
    setNewInstallmentAmount("");
    setNewInstallmentDate("");
    setNewInstallmentNotes("");
    setPricingError(null);
    setInstallmentError(null);
    setShowAuditHistory(false);
  }, [selectedId]);

  // In-App Cancellation Dialog State
  const [cancelTargetOrder, setCancelTargetOrder] = useState<Order | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  // In-App Soft-Delete Dialog State
  const [deleteTargetOrder, setDeleteTargetOrder] = useState<Order | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [studioCustomers, setStudioCustomers] = useState<Customer[]>([]);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);

  const [studioMembers, setStudioMembers] = useState<StudioMember[]>([]);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMemberForm, setNewMemberForm] = useState({
    name: "",
    email: "",
    phone: "",
    claimCode: "",
    skills: ["PHOTOGRAPHY"] as string[],
  });
  const [tempCrewInput, setTempCrewInput] = useState<Record<string, string>>({});
  const [newMemberError, setNewMemberError] = useState<string | null>(null);
  const [isCreatingMember, setIsCreatingMember] = useState(false);
  const [targetAssignContext, setTargetAssignContext] = useState<{
    serviceName?: string;
    taskId?: string;
  } | null>(null);

  const allSelectableCrew = useMemo(() => {
    const list: Array<{ id: string; name: string; skills: string[]; role: string }> = [];
    if (studio?.ownerName) {
      list.push({
        id: `owner-${studio.id || studioSlug}`,
        name: `${studio.ownerName} (Owner)`,
        skills: ["PHOTOGRAPHY", "VIDEOGRAPHY"],
        role: "Owner",
      });
    }
    studioMembers.forEach((m) => {
      if (!list.some((existing) => existing.id === m.id || existing.name === m.name)) {
        list.push({
          id: m.id,
          name: m.name,
          skills: m.skills || [],
          role: "Crew",
        });
      }
    });
    return list;
  }, [studio, studioSlug, studioMembers]);

  const handleOpenCreateModal = useCallback(() => {
    setNewOrderForm({
      ...DEFAULT_ORDER_FORM,
      passkeyPin: Math.floor(100000 + Math.random() * 900000).toString(),
    });
    setFormError(null);
    setShowServicesDropdown(false);
    setShowCustomerDropdown(false);
    setShowCreateModal(true);
  }, []);

  const matchingCustomers = useMemo(() => {
    const q = newOrderForm.customerName.trim().toLowerCase();
    if (!q) return studioCustomers.slice(0, 5);
    return studioCustomers
      .filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.phone && c.phone.includes(q)) ||
          (c.email && c.email.toLowerCase().includes(q))
      )
      .slice(0, 8);
  }, [studioCustomers, newOrderForm.customerName]);

  const duplicateCustomerWarning = useMemo(() => {
    const name = newOrderForm.customerName.trim().toLowerCase();
    const phone = newOrderForm.customerPhone.trim().replace(/\D/g, "");
    if (!name && !phone) return null;
    return (
      studioCustomers.find((c) => {
        const cName = c.name.trim().toLowerCase();
        const cPhone = (c.phone || "").replace(/\D/g, "");
        return (
          (name && cName === name) ||
          (phone && cPhone && (cPhone === phone || cPhone.endsWith(phone) || phone.endsWith(cPhone)))
        );
      }) || null
    );
  }, [studioCustomers, newOrderForm.customerName, newOrderForm.customerPhone]);

  const selectExistingCustomer = (c: Customer) => {
    let code = "+91";
    let phoneNum = c.phone || "";
    if (phoneNum.startsWith("+")) {
      const parts = phoneNum.split(" ");
      if (parts.length > 1) {
        code = parts[0];
        phoneNum = parts.slice(1).join(" ");
      }
    }
    setNewOrderForm((prev) => ({
      ...prev,
      customerName: c.name,
      countryCode: code,
      customerPhone: phoneNum,
      customerEmail: c.email || prev.customerEmail,
      eventLocation: c.address || prev.eventLocation,
    }));
    setShowCustomerDropdown(false);
  };

  const toggleService = (svc: string) => {
    setNewOrderForm((prev) => {
      const exists = prev.services.includes(svc);
      const next = exists
        ? prev.services.filter((s) => s !== svc)
        : [...prev.services, svc];
      return { ...prev, services: next };
    });
  };

  const handleAddCustomService = (e: React.FormEvent) => {
    e.preventDefault();
    const custom = newOrderForm.customServiceInput.trim();
    if (custom && !newOrderForm.services.includes(custom)) {
      setNewOrderForm((prev) => ({
        ...prev,
        services: [...prev.services, custom],
        customServiceInput: "",
      }));
    }
  };

  const loadOrders = useCallback(async (tokenOverride?: string | null) => {
    try {
      const token = tokenOverride ?? (await getIdToken(false)) ?? workspaceToken;
      if (!token) {
        setLoading(false);
        return;
      }
      const [data, customersData, membersData] = await Promise.all([
        getStudioOrdersAction(studioSlug, token),
        getStudioCustomersAction(studioSlug, token),
        getStudioMembersAction(studioSlug, token).catch(() => []),
      ]);
      setOrders(data);
      setStudioCustomers(customersData);
      setStudioMembers(membersData || []);
    } catch (err) {
      console.error("[OmsPage] Failed to load orders:", err);
    } finally {
      setLoading(false);
    }
  }, [studioSlug, workspaceToken, getIdToken]);

  useEffect(() => {
    if (!authLoading) {
      void loadOrders(workspaceToken);
    }
  }, [studioSlug, authLoading, workspaceToken, loadOrders]);

  // Load tasks when an order is selected
  useEffect(() => {
    if (selectedId) {
      if (workspaceToken) {
        void getOrderTasksAction(selectedId, studioSlug, workspaceToken).then(setSelectedTasks);
      }
    } else {
      setSelectedTasks([]);
    }
  }, [selectedId, studioSlug, workspaceToken]);

  // Check URL query parameters (e.g. ?orderId=... or ?action=new-order)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const urlOrderId = params.get("orderId");
    if (urlOrderId) {
      setSelectedId(urlOrderId);
    }
    const action = params.get("action");
    const newOrder = params.get("newOrder");
    if (action === "new-order" || newOrder === "true" || newOrder === "1") {
      handleOpenCreateModal();
    }
  }, [handleOpenCreateModal]);

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    const parsedFinalPrice = Number(newOrderForm.finalConfirmedPrice) || 0;
    const parsedAdvance = Number(newOrderForm.advanceAmount) || 0;

    if (!newOrderForm.customerName.trim()) {
      setFormError("Customer full name is required.");
      setIsSubmitting(false);
      return;
    }

    if (!newOrderForm.eventDate) {
      setFormError("Event date is required.");
      setIsSubmitting(false);
      return;
    }

    if (newOrderForm.services.length === 0) {
      setFormError("Please select at least one service.");
      setIsSubmitting(false);
      return;
    }

    if (parsedAdvance > parsedFinalPrice) {
      setFormError("Advance amount cannot exceed the confirmed total price.");
      setIsSubmitting(false);
      return;
    }

    const resolvedEventType =
      newOrderForm.eventType === "Other"
        ? (newOrderForm.customEventType.trim() || "Special Occasion")
        : newOrderForm.eventType;

    const trimmedPhone = newOrderForm.customerPhone.trim();
    const resolvedPhone = trimmedPhone
      ? (trimmedPhone.startsWith("+") ? trimmedPhone : `${newOrderForm.countryCode.trim() || "+91"} ${trimmedPhone}`)
      : undefined;

    if ((newOrderForm.customerName.match(/[a-zA-Z]/g) || []).length < 3) {
      setFormError("Name must have at least 3 letters.");
      setIsSubmitting(false);
      return;
    }

    if (!/^\d{6}$/.test(newOrderForm.passkeyPin.trim())) {
      setFormError("PIN must be 6 digits.");
      setIsSubmitting(false);
      return;
    }

    // Refresh token before mutation
    const token = await getIdToken(true);
    if (!token) {
      setFormError("Authentication error. Please sign in again.");
      setIsSubmitting(false);
      return;
    }

    const res = await createOrderAction({
      idToken: token,
      studioId: studioSlug,
      customerName: newOrderForm.customerName,
      customerPhone: resolvedPhone,
      customerEmail: newOrderForm.customerEmail || undefined,
      passkeyPin: newOrderForm.passkeyPin,
      notifyWhatsApp: Boolean(newOrderForm.notifyWhatsApp && resolvedPhone),
      notifyEmail: Boolean(newOrderForm.notifyEmail && newOrderForm.customerEmail.trim()),
      eventType: resolvedEventType,
      eventDate: newOrderForm.eventDate,
      eventLocation: newOrderForm.eventLocation.trim() || undefined,
      services: newOrderForm.services,
      estimatedPrice: parsedFinalPrice,
      finalConfirmedPrice: parsedFinalPrice,
      advanceAmount: parsedAdvance,
    });

    setIsSubmitting(false);

    if (res.success && res.order) {
      setShowCreateModal(false);
      setNewOrderForm({
        ...DEFAULT_ORDER_FORM,
        passkeyPin: Math.floor(100000 + Math.random() * 900000).toString(),
      });
      await loadOrders();
      setSelectedId(res.order.id);
      if (res.tasks) setSelectedTasks(res.tasks);
    } else {
      setFormError(res.error || "Failed to create order");
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, newStatus: TaskStatus) => {
    const token = (await getIdToken(false)) ?? workspaceToken;
    if (!selected || !token) return;
    const res = await updateTaskStatusAction({
      idToken: token,
      studioId: studioSlug,
      taskId,
      orderId: selected.id,
      status: newStatus,
    });
    if (res.success && res.task) {
      setSelectedTasks((prev) => prev.map((t) => (t.id === taskId ? res.task! : t)));
      await loadOrders();
    } else if (!res.success) {
      alert(res.error || "Failed to update task status");
    }
  };

  const handleUpdatePayment = async (
    newPaymentStatus?: PaymentStatus,
    advanceAmount?: number,
    finalConfirmedPrice?: number,
    installments?: OrderInstallment[],
    advanceDate?: string
  ) => {
    if (!selected || isUpdatingPayment) return;
    setIsUpdatingPayment(true);

    const previousOrders = [...orders];
    const confirmedVal = finalConfirmedPrice !== undefined ? finalConfirmedPrice : selected.pricing.finalConfirmedPrice;
    const currentInstallments = installments !== undefined ? installments : (selected.pricing.installments || []);
    const installmentsTotal = currentInstallments.reduce((sum, inst) => sum + (inst.amount || 0), 0);

    let nextInstallments = [...currentInstallments];
    const nextAdvance = advanceAmount !== undefined ? advanceAmount : selected.pricing.advanceAmount;

    // Optimistic UI update so owner sees immediate feedback
    if (newPaymentStatus === "PAID") {
      const currentPaid = selected.pricing.advanceAmount + installmentsTotal;
      const remainingToPay = Math.max(0, confirmedVal - currentPaid);
      if (remainingToPay > 0 && installments === undefined) {
        const autoPayment: OrderInstallment = {
          id: `inst_${Date.now()}_auto`,
          amount: remainingToPay,
          date: new Date().toISOString().split("T")[0],
          notes: "Final Payment (Marked Paid)",
          createdAt: new Date().toISOString(),
          recordedBy: workspaceUser?.displayName || studio?.ownerName || "Studio Owner",
          recordedByRole: "Owner",
        };
        nextInstallments = [...nextInstallments, autoPayment];
      }
      setOrders((prev) =>
        prev.map((o) =>
          o.id === selected.id
            ? {
                ...o,
                paymentStatus: "PAID",
                pricing: {
                  ...o.pricing,
                  finalConfirmedPrice: confirmedVal,
                  advanceAmount: nextAdvance,
                  installments: nextInstallments,
                  remainingAmount: 0,
                },
              }
            : o
        )
      );
    } else if (newPaymentStatus === "PENDING" && advanceAmount === undefined) {
      nextInstallments = nextInstallments.filter((inst) => !inst.notes?.includes("Marked Paid"));
      const newInstTotal = nextInstallments.reduce((sum, inst) => sum + (inst.amount || 0), 0);
      const totalPaid = nextAdvance + newInstTotal;
      const calculatedStatus: PaymentStatus =
        totalPaid > 0 && totalPaid < confirmedVal
          ? (nextInstallments.length > 0 ? "PARTIAL" : "ADVANCE_RECEIVED")
          : (totalPaid >= confirmedVal && confirmedVal > 0 ? "PAID" : "PENDING");
      setOrders((prev) =>
        prev.map((o) =>
          o.id === selected.id
            ? {
                ...o,
                paymentStatus: calculatedStatus,
                pricing: {
                  ...o.pricing,
                  finalConfirmedPrice: confirmedVal,
                  advanceAmount: nextAdvance,
                  installments: nextInstallments,
                  remainingAmount: Math.max(0, confirmedVal - totalPaid),
                },
              }
            : o
        )
      );
    } else {
      const advVal = advanceAmount !== undefined ? advanceAmount : selected.pricing.advanceAmount;
      const totalPaid = advVal + installmentsTotal;
      const statusVal =
        newPaymentStatus ||
        (totalPaid >= confirmedVal && confirmedVal > 0
          ? "PAID"
          : currentInstallments.length > 0 && totalPaid > 0
          ? "PARTIAL"
          : advVal > 0
          ? "ADVANCE_RECEIVED"
          : "PENDING");
      setOrders((prev) =>
        prev.map((o) =>
          o.id === selected.id
            ? {
                ...o,
                paymentStatus: statusVal,
                pricing: {
                  ...o.pricing,
                  finalConfirmedPrice: confirmedVal,
                  advanceAmount: advVal,
                  advanceDate: advanceDate || o.pricing.advanceDate,
                  installments: currentInstallments,
                  remainingAmount: Math.max(0, confirmedVal - totalPaid),
                  previousAdvanceAmount:
                    advVal < confirmedVal ? advVal : o.pricing.previousAdvanceAmount,
                },
              }
            : o
        )
      );
    }

    try {
      const token = (await getIdToken(true)) ?? (await getIdToken(false)) ?? workspaceToken;
      if (!token) {
        setIsUpdatingPayment(false);
        setOrders(previousOrders);
        return;
      }
      const res = await updatePaymentStatusAction({
        idToken: token,
        studioId: studioSlug,
        orderId: selected.id,
        ...(newPaymentStatus ? { paymentStatus: newPaymentStatus } : {}),
        ...(advanceAmount !== undefined ? { advanceAmount } : {}),
        ...(finalConfirmedPrice !== undefined ? { finalConfirmedPrice } : {}),
        installments: nextInstallments,
        ...(advanceDate !== undefined ? { advanceDate } : {}),
      });
      setIsUpdatingPayment(false);
      if (res.success && res.order) {
        setOrders((prev) => prev.map((o) => (o.id === res.order!.id ? res.order! : o)));
        await loadOrders();
      } else {
        setOrders(previousOrders);
        alert(res.error || "Failed to update payment status");
      }
    } catch (err: unknown) {
      setIsUpdatingPayment(false);
      setOrders(previousOrders);
      alert(err instanceof Error ? err.message : "Failed to update payment status");
    }
  };

  const handleStartEditingPricing = () => {
    if (!selected) return;
    setEditConfirmedPrice(String(selected.pricing.finalConfirmedPrice));
    setEditAdvanceAmount(String(selected.pricing.advanceAmount));
    setEditAdvanceDate(selected.pricing.advanceDate || (selected.createdAt ? selected.createdAt.split("T")[0] : new Date().toISOString().split("T")[0]));
    setEditInstallments(selected.pricing.installments ? [...selected.pricing.installments] : []);
    setShowAddInstallment(false);
    setNewInstallmentAmount("");
    setNewInstallmentDate(new Date().toISOString().split("T")[0]);
    setNewInstallmentNotes("");
    setPricingError(null);
    setInstallmentError(null);
    setIsEditingPricing(true);
  };

  const handleAddInstallment = () => {
    const amt = Number(newInstallmentAmount);
    if (!amt || amt <= 0) {
      setInstallmentError("Please enter a valid payment amount greater than ₹0.");
      return;
    }
    const confirmedNum = Math.max(0, Number(editConfirmedPrice) || 0);
    const advanceNum = Math.max(0, Number(editAdvanceAmount) || 0);
    const existingInstTotal = editInstallments.reduce((sum, inst) => sum + (inst.amount || 0), 0);
    const maxAllowed = Math.max(0, confirmedNum - (advanceNum + existingInstTotal));

    if (amt > maxAllowed) {
      setInstallmentError(`Payment amount (₹${amt.toLocaleString()}) exceeds the remaining balance of ₹${maxAllowed.toLocaleString()}.`);
      return;
    }

    setInstallmentError(null);
    setPricingError(null);
    const newInst: OrderInstallment = {
      id: `inst_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      amount: amt,
      date: newInstallmentDate.trim() || new Date().toISOString().split("T")[0],
      notes: newInstallmentNotes.trim() || undefined,
      createdAt: new Date().toISOString(),
      recordedBy: workspaceUser?.displayName || studio?.ownerName || "Studio Owner",
      recordedByRole: "Owner",
    };
    setEditInstallments((prev) => [...prev, newInst]);
    setNewInstallmentAmount("");
    setNewInstallmentNotes("");
    setShowAddInstallment(false);
  };

  const handleRemoveInstallment = (index: number) => {
    setEditInstallments((prev) => prev.filter((_, i) => i !== index));
    setPricingError(null);
  };

  const handleSavePricing = async () => {
    if (!selected) return;
    const confirmedNum = Math.max(0, Number(editConfirmedPrice) || 0);
    const advanceNum = Math.max(0, Number(editAdvanceAmount) || 0);
    const installmentsTotal = editInstallments.reduce((sum, inst) => sum + (inst.amount || 0), 0);
    const totalPaid = advanceNum + installmentsTotal;

    if (totalPaid > confirmedNum) {
      setPricingError(`Total payments (Advance ₹${advanceNum.toLocaleString()} + Installments ₹${installmentsTotal.toLocaleString()}) cannot exceed confirmed price (₹${confirmedNum.toLocaleString()}).`);
      return;
    }

    setPricingError(null);
    const calculatedStatus: PaymentStatus =
      totalPaid >= confirmedNum && confirmedNum > 0
        ? "PAID"
        : editInstallments.length > 0 && totalPaid > 0
        ? "PARTIAL"
        : advanceNum > 0
        ? "ADVANCE_RECEIVED"
        : "PENDING";

    await handleUpdatePayment(calculatedStatus, advanceNum, confirmedNum, editInstallments, editAdvanceDate);
    setIsEditingPricing(false);
  };

  const handleConfirmSuggestion = async (sug: ResourceSuggestion) => {
    if (!selected) return;
    const token = (await getIdToken(false)) ?? workspaceToken;
    if (!token) return;

    const res = await assignResourceAction({
      orderId: selected.id,
      memberId: sug.memberId,
      memberName: sug.memberName,
      skill: sug.skill,
      studioId: studioSlug,
      idToken: token,
    });

    if (res.success && res.order) {
      setOrders((prev) => prev.map((o) => (o.id === res.order!.id ? res.order! : o)));
    } else {
      alert(res.error || "Failed to assign resource");
    }
  };

  const openErpWizardForService = (serviceName?: string) => {
    let initialSkills = ["PHOTOGRAPHY"];
    if (serviceName) {
      const s = serviceName.toLowerCase();
      if (s.includes("video") || s.includes("cinemat")) initialSkills = ["VIDEOGRAPHY"];
      else if (s.includes("album")) initialSkills = ["ALBUM_DESIGN"];
      else if (s.includes("photo")) initialSkills = ["PHOTOGRAPHY"];
    }
    setNewMemberForm({
      name: "",
      email: "",
      phone: "",
      claimCode: Math.floor(100000 + Math.random() * 900000).toString(),
      skills: initialSkills,
    });
    setNewMemberError(null);
    setTargetAssignContext(serviceName ? { serviceName } : null);
    setShowAddMemberModal(true);
  };

  const handleCommitCrewAssignment = async (serviceName: string, enteredName: string) => {
    if (!selected || !enteredName.trim()) return;
    const token = (await getIdToken(false)) ?? workspaceToken;
    if (!token) return;

    const trimmed = enteredName.trim();
    // Check if entered name matches an existing member or owner in allSelectableCrew
    const matchedMember = allSelectableCrew.find(
      (m) => m.name.toLowerCase() === trimmed.toLowerCase() || m.id === trimmed
    );

    const memberId = matchedMember ? matchedMember.id : `temp_${Date.now()}`;
    const memberName = matchedMember ? matchedMember.name : trimmed;

    const res = await assignResourceAction({
      orderId: selected.id,
      memberId,
      memberName,
      skill: serviceName,
      studioId: studioSlug,
      idToken: token,
    });

    if (res.success && res.order) {
      setOrders((prev) => prev.map((o) => (o.id === res.order!.id ? res.order! : o)));
      setTempCrewInput((prev) => ({ ...prev, [serviceName]: "" }));
      const updatedTasks = await getOrderTasksAction(selected.id, studioSlug, token);
      setSelectedTasks(updatedTasks);
    } else {
      alert(res.error || "Failed to assign crew member");
    }
  };

  const handleUnassignService = async (serviceName: string) => {
    if (!selected) return;
    const token = (await getIdToken(false)) ?? workspaceToken;
    if (!token) return;

    const res = await assignResourceAction({
      orderId: selected.id,
      memberId: "unassigned",
      memberName: "Unassigned",
      skill: serviceName,
      studioId: studioSlug,
      idToken: token,
    });

    if (res.success && res.order) {
      setOrders((prev) => prev.map((o) => (o.id === res.order!.id ? res.order! : o)));
      setTempCrewInput((prev) => ({ ...prev, [serviceName]: "" }));
      const updatedTasks = await getOrderTasksAction(selected.id, studioSlug, token);
      setSelectedTasks(updatedTasks);
    } else {
      alert(res.error || "Failed to unassign crew member");
    }
  };

  const handleAssignServiceCrew = async (serviceName: string, memberId: string) => {
    if (!selected) return;
    const token = (await getIdToken(false)) ?? workspaceToken;
    if (!token) return;

    const member = allSelectableCrew.find((m) => m.id === memberId) || studioMembers.find((m) => m.id === memberId);
    if (!member) return;

    const res = await assignResourceAction({
      orderId: selected.id,
      memberId: member.id,
      memberName: member.name,
      skill: serviceName,
      studioId: studioSlug,
      idToken: token,
    });

    if (res.success && res.order) {
      setOrders((prev) => prev.map((o) => (o.id === res.order!.id ? res.order! : o)));
      const updatedTasks = await getOrderTasksAction(selected.id, studioSlug, token);
      setSelectedTasks(updatedTasks);
    } else {
      alert(res.error || "Failed to assign crew member");
    }
  };

  const handleAssignTaskCrew = async (taskId: string, memberId: string) => {
    if (!selected) return;
    const token = (await getIdToken(false)) ?? workspaceToken;
    if (!token) return;

    const member = allSelectableCrew.find((m) => m.id === memberId) || studioMembers.find((m) => m.id === memberId);
    if (!member) return;

    const res = await assignTaskCrewAction({
      orderId: selected.id,
      studioId: studioSlug,
      taskId,
      memberId: member.id,
      memberName: member.name,
      idToken: token,
    });

    if (res.success && res.task) {
      setSelectedTasks((prev) => prev.map((t) => (t.id === taskId ? res.task! : t)));
      await loadOrders();
    } else {
      alert(res.error || "Failed to assign crew to task");
    }
  };

  const handleCreateAndAssignMember = async () => {
    if (!newMemberForm.name.trim()) {
      setNewMemberError("Member name is required.");
      return;
    }
    const email = newMemberForm.email.trim();
    const claimCode = newMemberForm.claimCode.trim();
    if (!email && !/^\d{6}$/.test(claimCode)) {
      setNewMemberError("A 6-digit passcode is required when no email is provided.");
      return;
    }
    if (newMemberForm.skills.length === 0) {
      setNewMemberError("Please select at least one certified skill.");
      return;
    }

    setIsCreatingMember(true);
    setNewMemberError(null);
    const token = (await getIdToken(true)) ?? workspaceToken;
    if (!token) {
      setIsCreatingMember(false);
      setNewMemberError("Authentication error. Please re-sign in.");
      return;
    }

    const res = await createMemberAction({
      studioId: studioSlug,
      name: newMemberForm.name.trim(),
      email: email || undefined,
      phone: newMemberForm.phone.trim() || undefined,
      claimCode: claimCode || undefined,
      skills: newMemberForm.skills,
      idToken: token,
    });

    setIsCreatingMember(false);
    if (res.success) {
      await loadOrders();
      if (targetAssignContext?.serviceName && res.invitation) {
        await assignResourceAction({
          orderId: selected!.id,
          memberId: res.invitation.id,
          memberName: newMemberForm.name.trim(),
          skill: targetAssignContext.serviceName,
          studioId: studioSlug,
          idToken: token,
        });
        await loadOrders();
        const updatedTasks = await getOrderTasksAction(selected!.id, studioSlug, token);
        setSelectedTasks(updatedTasks);
      } else if (targetAssignContext?.taskId && res.invitation) {
        await assignTaskCrewAction({
          orderId: selected!.id,
          studioId: studioSlug,
          taskId: targetAssignContext.taskId,
          memberId: res.invitation.id,
          memberName: newMemberForm.name.trim(),
          idToken: token,
        });
        await loadOrders();
      }

      setShowAddMemberModal(false);
      setNewMemberForm({
        name: "",
        email: "",
        phone: "",
        claimCode: "",
        skills: ["PHOTOGRAPHY"],
      });
      setTargetAssignContext(null);
    } else {
      setNewMemberError(res.error || "Failed to create studio member.");
    }
  };

  const handleConfirmCancelOrder = async () => {
    if (!cancelTargetOrder) return;
    setIsCancelling(true);

    const token = (await getIdToken(false)) ?? workspaceToken;
    if (!token) {
      setIsCancelling(false);
      return;
    }

    const res = await cancelOrderAction({
      orderId: cancelTargetOrder.id,
      studioId: studioSlug,
      cancellationReason: cancelReason.trim() || "Cancelled by studio owner",
      idToken: token,
    });

    setIsCancelling(false);
    if (res.success && res.order) {
      setOrders((prev) => prev.map((o) => (o.id === res.order!.id ? res.order! : o)));
      setCancelTargetOrder(null);
      setCancelReason("");
    } else {
      alert(res.error || "Failed to cancel order");
    }
  };

  const handleConfirmDeleteOrder = async () => {
    if (!deleteTargetOrder) return;
    setIsDeleting(true);

    const token = (await getIdToken(false)) ?? workspaceToken;
    if (!token) {
      setIsDeleting(false);
      return;
    }

    const res = await deleteOrderAction({
      orderId: deleteTargetOrder.id,
      studioId: studioSlug,
      idToken: token,
    });

    setIsDeleting(false);
    if (res.success) {
      setOrders((prev) => prev.filter((o) => o.id !== deleteTargetOrder.id));
      if (selectedId === deleteTargetOrder.id) {
        setSelectedId(null);
      }
      setDeleteTargetOrder(null);
    } else {
      alert(res.error || "Failed to delete order");
    }
  };

  const filtered = useMemo(() => {
    const list = orders.filter(
      (order) =>
        (statusFilter === "ALL" || order.orderStatus === statusFilter) &&
        (!query ||
          `${order.customer.name} ${order.orderNumber} ${order.eventType}`
            .toLowerCase()
            .includes(query.toLowerCase()))
    );

    const getEventTimestamp = (dateStr?: string | null, isDesc = false): number => {
      if (!dateStr) return isDesc ? -1 : Number.MAX_SAFE_INTEGER;
      const clean = dateStr.trim();
      const parts = clean.split("T")[0].split("-");
      if (parts.length === 3) {
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10) - 1;
        const d = parseInt(parts[2], 10);
        if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
          return new Date(y, m, d).getTime();
        }
      }
      const parsed = new Date(clean).getTime();
      return isNaN(parsed) ? (isDesc ? -1 : Number.MAX_SAFE_INTEGER) : parsed;
    };

    return list.sort((a, b) => {
      if (sortBy === "DATE_ASC") {
        const timeA = getEventTimestamp(a.eventDate, false);
        const timeB = getEventTimestamp(b.eventDate, false);
        if (timeA !== timeB) return timeA - timeB;
        const createdA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const createdB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return createdA - createdB;
      }
      if (sortBy === "DATE_DESC") {
        const timeA = getEventTimestamp(a.eventDate, true);
        const timeB = getEventTimestamp(b.eventDate, true);
        if (timeA !== timeB) return timeB - timeA;
        const createdA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const createdB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return createdB - createdA;
      }
      if (sortBy === "PRICE_ASC") {
        const priceA = a.pricing?.finalConfirmedPrice ?? 0;
        const priceB = b.pricing?.finalConfirmedPrice ?? 0;
        return priceA - priceB;
      }
      if (sortBy === "PRICE_DESC") {
        const priceA = a.pricing?.finalConfirmedPrice ?? 0;
        const priceB = b.pricing?.finalConfirmedPrice ?? 0;
        return priceB - priceA;
      }
      return 0;
    });
  }, [orders, statusFilter, query, sortBy]);

  return (
    <div className="flex h-full bg-surface-app">
      <div
        className={`flex h-full flex-col ${
          selected ? "hidden lg:flex lg:w-1/2 border-r border-border-default" : "w-full"
        }`}
      >
        <header className="header-brand-blue">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="badge-brand-blue">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-blue-primary" />
                  OMS · Order Management
                </span>
                <span className="badge-status-neutral">
                  Studio: <strong className="font-semibold text-text-primary">{studioSlug}</strong>
                </span>
              </div>
              <h1 className="text-xl font-extrabold text-text-primary tracking-tight">
                Order Management System
              </h1>
              <p className="text-xs text-text-secondary mt-0.5">
                Production lifecycle workflows, delivery milestones, and client accounts · {orders.length} Confirmed Orders
              </p>
            </div>
            <button
              onClick={handleOpenCreateModal}
              className="btn-brand-blue"
            >
              + Register Confirmed Order
            </button>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row gap-2.5">
            <input
              suppressHydrationWarning
              autoComplete="off"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by customer, order number, event..."
              className="flex-1 rounded-xl border border-border-default bg-surface-app px-3.5 py-2 text-xs text-text-primary placeholder:text-text-tertiary focus:bg-white focus:outline-none focus:border-brand-blue-primary focus:ring-2 focus:ring-brand-blue-soft"
            />
            <div className="flex gap-2">
              <select
                suppressHydrationWarning
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as "ALL" | OrderStatus)
                }
                className="rounded-xl border border-border-default bg-surface-app px-3 py-2 text-xs font-semibold text-text-primary focus:bg-white focus:outline-none focus:border-brand-blue-primary focus:ring-2 focus:ring-brand-blue-soft"
              >
                <option value="ALL">All States</option>
                {(Object.keys(STATUS_LABELS) as OrderStatus[]).map((key) => (
                  <option key={key} value={key}>
                    {STATUS_LABELS[key]}
                  </option>
                ))}
              </select>
              <select
                suppressHydrationWarning
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value as "DATE_ASC" | "DATE_DESC" | "PRICE_ASC" | "PRICE_DESC"
                  )
                }
                aria-label="Sort orders"
                className="rounded-xl border border-border-default bg-surface-app px-3 py-2 text-xs font-semibold text-text-primary focus:bg-white focus:outline-none focus:border-brand-blue-primary focus:ring-2 focus:ring-brand-blue-soft"
              >
                <option value="DATE_ASC">Earliest Date First</option>
                <option value="DATE_DESC">Latest Date First</option>
                <option value="PRICE_DESC">Price: High to Low</option>
                <option value="PRICE_ASC">Price: Low to High</option>
              </select>
            </div>
          </div>
        </header>

        <div className="flex-1 space-y-3 overflow-y-auto p-5">
          {loading && orders.length === 0 ? (
            <div className="py-16 text-center text-xs text-text-tertiary">Loading orders from server...</div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border-default bg-white p-12 text-center">
              <p className="text-sm font-bold text-text-secondary">No active confirmed orders found</p>
              <p className="text-xs text-text-tertiary mt-1">
                Register a new confirmed order to start automated production workflow tracking.
              </p>
            </div>
          ) : (
            filtered.map((order) => (
              <button
                key={order.id}
                onClick={() => setSelectedId(order.id)}
                className={`w-full rounded-2xl border p-5 text-left transition ${
                  selectedId === order.id
                    ? "card-brand-blue"
                    : "border-border-default bg-white hover:border-brand-blue-light hover:shadow-xs"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-text-primary">
                        {order.customer.name}
                      </span>
                      <span className="font-mono text-xs font-bold text-brand-blue-primary">
                        {order.orderNumber}
                      </span>
                      {order.paymentStatus === "PAID" && (
                        <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-status-success border border-emerald-200">
                          PAID
                        </span>
                      )}
                      {(order.paymentStatus === "ADVANCE_RECEIVED" || (order.paymentStatus === "PARTIAL" && (!order.pricing.installments || order.pricing.installments.length === 0))) && (
                        <span className="rounded-md bg-sky-50 px-1.5 py-0.5 text-[10px] font-bold text-sky-700 border border-sky-200">
                          ADVANCE RECEIVED
                        </span>
                      )}
                      {order.paymentStatus === "PARTIAL" && !!order.pricing.installments?.length && (
                        <span className="rounded-md bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">
                          PARTIAL
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-text-secondary mt-1">
                      {order.eventType} · Event Date: {order.eventDate}
                      {order.orderStatus === "AWAITING_EVENT" && (() => {
                        const d = getEventDaysRemaining(order.eventDate);
                        return d && d.diffDays > 0 ? ` (${d.label})` : "";
                      })()}
                    </p>
                    <p className="mt-2 text-xs text-text-tertiary">
                      Services: {order.services.join(", ")}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={STATUS_COLORS[order.orderStatus]}>
                      {STATUS_LABELS[order.orderStatus]}
                    </span>
                    <p className="mt-2 text-sm font-extrabold text-text-primary">
                      ₹{order.pricing.finalConfirmedPrice.toLocaleString()}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Selected Order Detail Drawer */}
      {selected && (
        <aside className="h-full w-full lg:w-1/2 overflow-y-auto bg-white p-6 border-l border-border-default space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-border-default">
            <div className="flex items-center gap-2 min-w-0">
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="lg:hidden rounded-lg p-1.5 text-text-tertiary hover:bg-surface-app hover:text-text-primary mr-1 shrink-0"
                aria-label="Back to order list"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="min-w-0">
                <span className="font-mono text-xs font-bold text-brand-blue-primary block">{selected.orderNumber}</span>
                <h2 className="text-lg font-extrabold text-text-primary truncate">{selected.customer.name}</h2>
              </div>
            </div>
            <button
              onClick={() => setSelectedId(null)}
              className="rounded-full p-2 text-text-tertiary hover:bg-surface-app hover:text-text-primary transition shrink-0"
              aria-label="Close details"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Pre-Event Shoot Planning (Placed Above Order Lifecycle State) */}
          {selected.services && selected.services.length > 0 && (
            <div className="rounded-2xl border border-border-default bg-[#FAF8F5] p-3.5 space-y-2.5">
              <div className="flex items-center justify-between pb-1 border-b border-border-default/60">
                <h3 className="text-xs font-bold uppercase tracking-wider text-text-tertiary">
                  Pre-Event Shoot Planning
                </h3>
                <button
                  type="button"
                  onClick={() => openErpWizardForService()}
                  className="text-xs font-bold text-brand-blue-primary hover:underline hover:text-sky-700 transition cursor-pointer"
                >
                  + Add Member in ERP
                </button>
              </div>

              <div className="rounded-xl border border-border-default bg-white overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border-default bg-slate-50/70 text-[10px] font-bold uppercase tracking-wider text-text-tertiary">
                      <th className="py-2 px-3 w-1/3">Booked Service</th>
                      <th className="py-2 px-3">Assign Shoot Crew</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-default/60">
                    {selected.services.map((svcName) => {
                      const svcLower = svcName.toLowerCase();
                      const assignedRes = (selected.assignedResources || []).find((r) => {
                        const rSkill = (r.skill || "").toLowerCase();
                        return (
                          rSkill === svcLower ||
                          (svcLower.includes("photo") && rSkill.includes("photo")) ||
                          (svcLower.includes("video") && (rSkill.includes("video") || rSkill.includes("cinemat"))) ||
                          (svcLower.includes("drone") && rSkill.includes("drone")) ||
                          (svcLower.includes("album") && rSkill.includes("album"))
                        );
                      });

                      const currentInputVal = tempCrewInput[svcName] ?? "";

                      return (
                        <tr key={svcName} className="hover:bg-slate-50/50 transition">
                          <td className="py-2.5 px-3 font-bold text-text-primary text-xs align-middle">
                            {svcName}
                          </td>
                          <td className="py-2.5 px-3 align-middle">
                            <div className="flex items-center gap-2 flex-wrap">
                              {assignedRes ? (
                                <div className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-200 px-2 py-1 text-emerald-800 font-bold text-xs">
                                  <span>{assignedRes.memberName}</span>
                                  <button
                                    type="button"
                                    onClick={() => void handleUnassignService(svcName)}
                                    className="text-emerald-600 hover:text-red-600 transition ml-1 text-xs leading-none cursor-pointer"
                                    title="Unassign crew"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ) : (
                                <span className="text-slate-400 italic text-[11px]">Unassigned</span>
                              )}

                              <div className="relative flex-1 min-w-[170px] max-w-[260px]">
                                <input
                                  type="text"
                                  list={`crew-options-${svcName.replace(/\s+/g, "-")}`}
                                  placeholder={assignedRes ? "Change crew..." : "Select crew or type temporary name..."}
                                  value={currentInputVal}
                                  onChange={(e) =>
                                    setTempCrewInput((prev) => ({ ...prev, [svcName]: e.target.value }))
                                  }
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      void handleCommitCrewAssignment(svcName, currentInputVal);
                                    }
                                  }}
                                  className="w-full text-xs bg-white border border-border-default rounded-lg px-2.5 py-1.5 outline-none focus:border-brand-blue-primary focus:ring-1 focus:ring-brand-blue-primary"
                                />
                                <datalist id={`crew-options-${svcName.replace(/\s+/g, "-")}`}>
                                  {allSelectableCrew.map((m) => (
                                    <option key={m.id} value={m.name}>
                                      {m.name} ({m.role})
                                    </option>
                                  ))}
                                </datalist>
                              </div>

                              <button
                                type="button"
                                onClick={() => void handleCommitCrewAssignment(svcName, currentInputVal)}
                                className="rounded-lg bg-slate-100 hover:bg-slate-200 text-text-primary text-[11px] font-bold px-2.5 py-1.5 border border-border-default transition cursor-pointer"
                              >
                                Assign
                              </button>

                              <button
                                type="button"
                                onClick={() => openErpWizardForService(svcName)}
                                className="text-[11px] font-bold text-brand-blue-primary hover:underline transition cursor-pointer whitespace-nowrap"
                                title="Open ERP wizard to create certified member profile"
                              >
                                + Add Member in ERP
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 1. Order Lifecycle State — Horizontal Pipeline */}
          <div className="rounded-2xl border border-border-default bg-surface-app/40 p-4 space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-text-tertiary">
                  Order Lifecycle State
                </h3>
              </div>
              <span className={`rounded-lg px-2.5 py-0.5 text-[10px] font-bold border ${STATUS_COLORS[selected.orderStatus]}`}>
                {STATUS_LABELS[selected.orderStatus]}
              </span>
            </div>

            {/* Horizontal Stepper */}
            <div className="relative flex items-center justify-between w-full pt-1 px-1 sm:px-2">
              {/* Node 1: Awaiting Event */}
              <div className="flex flex-col items-center text-center w-24 sm:w-28 shrink-0">
                <div
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all ${
                    selected.orderStatus === "AWAITING_EVENT"
                      ? "border-brand-blue-primary bg-brand-blue-primary text-white shadow-md shadow-blue-500/20 ring-4 ring-blue-100"
                      : selected.orderStatus === "POST_EVENT_IN_PROGRESS" || selected.orderStatus === "COMPLETED"
                      ? "border-emerald-500 bg-emerald-500 text-white shadow-2xs"
                      : "border-slate-300 bg-slate-100 text-slate-400"
                  }`}
                >
                  {selected.orderStatus === "POST_EVENT_IN_PROGRESS" || selected.orderStatus === "COMPLETED" ? "✓" : "1"}
                </div>
                <span
                  className={`mt-1.5 text-[11px] font-bold leading-tight ${
                    selected.orderStatus === "AWAITING_EVENT"
                      ? "text-brand-blue-primary"
                      : selected.orderStatus === "POST_EVENT_IN_PROGRESS" || selected.orderStatus === "COMPLETED"
                      ? "text-emerald-700"
                      : "text-text-tertiary"
                  }`}
                >
                  Awaiting Event
                </span>
                <span className="text-[9px] text-text-tertiary mt-0.5 truncate max-w-full">
                  {selected.eventDate}
                </span>
                {selected.orderStatus === "AWAITING_EVENT" && (() => {
                  const d = getEventDaysRemaining(selected.eventDate);
                  return d ? (
                    <span className="text-[9px] font-semibold text-brand-blue-primary mt-0.5">
                      {d.display}
                    </span>
                  ) : null;
                })()}
              </div>

              {/* Connecting Line 1-2 */}
              <div className="flex-1 flex items-center mx-1 sm:mx-2 mb-5">
                <div
                  className={`h-1 w-full rounded-full transition-colors ${
                    selected.orderStatus === "POST_EVENT_IN_PROGRESS" || selected.orderStatus === "COMPLETED"
                      ? "bg-emerald-500"
                      : selected.orderStatus === "AWAITING_EVENT"
                      ? "bg-blue-200"
                      : "bg-slate-200"
                  }`}
                />
              </div>

              {/* Node 2: Post-Event In Progress */}
              <div className="flex flex-col items-center text-center w-28 sm:w-32 shrink-0">
                <div
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all ${
                    selected.orderStatus === "POST_EVENT_IN_PROGRESS"
                      ? "border-brand-blue-primary bg-brand-blue-primary text-white shadow-md shadow-blue-500/20 ring-4 ring-blue-100 animate-pulse"
                      : selected.orderStatus === "COMPLETED"
                      ? "border-emerald-500 bg-emerald-500 text-white shadow-2xs"
                      : "border-slate-300 bg-slate-100 text-slate-400"
                  }`}
                >
                  {selected.orderStatus === "COMPLETED" ? "✓" : "2"}
                </div>
                <span
                  className={`mt-1.5 text-[11px] font-bold leading-tight ${
                    selected.orderStatus === "POST_EVENT_IN_PROGRESS"
                      ? "text-brand-blue-primary"
                      : selected.orderStatus === "COMPLETED"
                      ? "text-emerald-700"
                      : "text-text-tertiary"
                  }`}
                >
                  Post-Event
                </span>
                <span className="text-[9px] text-text-tertiary mt-0.5">
                  {selected.orderStatus === "AWAITING_EVENT"
                    ? (() => {
                        const d = getEventDaysRemaining(selected.eventDate);
                        if (!d) return "Upcoming";
                        return d.postEventDays > 0 ? d.postEventLabel : "In Progress";
                      })()
                    : selected.orderStatus === "COMPLETED"
                    ? "Done"
                    : "In Progress"}
                </span>
              </div>

              {/* Connecting Line 2-3 */}
              <div className="flex-1 flex items-center mx-1 sm:mx-2 mb-5">
                <div
                  className={`h-1 w-full rounded-full transition-colors ${
                    selected.orderStatus === "COMPLETED"
                      ? "bg-emerald-500"
                      : selected.orderStatus === "POST_EVENT_IN_PROGRESS"
                      ? "bg-blue-200"
                      : "bg-slate-200"
                  }`}
                />
              </div>

              {/* Node 3: Completed or Cancelled */}
              <div className="flex flex-col items-center text-center w-24 sm:w-28 shrink-0">
                <div
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all ${
                    selected.orderStatus === "COMPLETED"
                      ? "border-emerald-500 bg-emerald-500 text-white shadow-md shadow-emerald-500/20 ring-4 ring-emerald-100"
                      : selected.orderStatus === "CANCELLED"
                      ? "border-rose-500 bg-rose-500 text-white shadow-md shadow-rose-500/20 ring-4 ring-rose-100"
                      : "border-slate-300 bg-slate-100 text-slate-400"
                  }`}
                >
                  {selected.orderStatus === "COMPLETED" ? "✓" : selected.orderStatus === "CANCELLED" ? "✕" : "3"}
                </div>
                <span
                  className={`mt-1.5 text-[11px] font-bold leading-tight ${
                    selected.orderStatus === "COMPLETED"
                      ? "text-emerald-700"
                      : selected.orderStatus === "CANCELLED"
                      ? "text-rose-600"
                      : "text-text-tertiary"
                  }`}
                >
                  {selected.orderStatus === "CANCELLED" ? "Cancelled" : "Completed"}
                </span>
                <span className="text-[9px] text-text-tertiary mt-0.5">
                  {selected.orderStatus === "CANCELLED" ? "Terminated" : "Delivered"}
                </span>
              </div>
            </div>

            {/* Post-Event Stage Quick Progress */}
            {selectedTasks.length > 0 && (
              <div className="pt-2 border-t border-border-default/60">
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-semibold text-text-secondary">
                    Production Workflow Tasks
                  </span>
                  <span className="font-bold text-text-primary">
                    {Math.round(
                      (selectedTasks.filter((t) => t.status === "COMPLETED").length / selectedTasks.length) * 100
                    )}% ({selectedTasks.filter((t) => t.status === "COMPLETED").length}/{selectedTasks.length} completed)
                  </span>
                </div>
                <div className="w-full bg-slate-200/80 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      selected.orderStatus === "COMPLETED" ? "bg-emerald-500" : "bg-brand-blue-primary"
                    }`}
                    style={{
                      width: `${Math.round(
                        (selectedTasks.filter((t) => t.status === "COMPLETED").length / selectedTasks.length) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* 2. Post-Event Production Workflow Pipelines */}
          {(() => {
            const eventRem = getEventDaysRemaining(selected.eventDate);
            const isEventLocked = Boolean(
              eventRem && (eventRem.diffDays > 0 || (eventRem.diffDays === 0 && selected.orderStatus === "AWAITING_EVENT"))
            );

            // Categorize tasks into pipeline streams
            const photoTasks = selectedTasks
              .filter((t) => {
                const title = t.title.toLowerCase();
                return (
                  t.serviceCategory === "PHOTOGRAPHY" ||
                  t.serviceCategory === "ALBUM" ||
                  title.includes("photo") ||
                  title.includes("raw") ||
                  title.includes("album") ||
                  title.includes("cull")
                );
              })
              .sort((a, b) => {
                const score = (t: string) => {
                  const s = t.toLowerCase();
                  if (s.includes("raw")) return 1;
                  if (s.includes("photo edit") || s.includes("editing")) return 2;
                  if (s.includes("album")) return 3;
                  return 4;
                };
                return score(a.title) - score(b.title) || a.sequenceOrder - b.sequenceOrder;
              });

            const videoTasks = selectedTasks
              .filter((t) => {
                const title = t.title.toLowerCase();
                return (
                  t.serviceCategory === "VIDEOGRAPHY" ||
                  title.includes("video") ||
                  title.includes("cinematic") ||
                  title.includes("teaser") ||
                  title.includes("reel")
                );
              })
              .sort((a, b) => a.sequenceOrder - b.sequenceOrder);

            const deliveryTasks = selectedTasks.filter((t) => {
              const title = t.title.toLowerCase();
              return (
                t.serviceCategory === "GENERAL" ||
                title.includes("delivery") ||
                title.includes("handover")
              );
            });

            const otherTasks = selectedTasks.filter(
              (t) => !photoTasks.includes(t) && !videoTasks.includes(t) && !deliveryTasks.includes(t)
            );

            // Prerequisite dependency resolver
            const getPrerequisite = (task: Task): { isLocked: boolean; reason?: string } => {
              if (isEventLocked) {
                return {
                  isLocked: true,
                  reason: `Scheduled for post-event (${selected.eventDate})`,
                };
              }

              const titleLower = task.title.toLowerCase();

              // Photo editing requires raw photo selection completed
              if (
                titleLower.includes("photo edit") ||
                (titleLower.includes("edit") && task.serviceCategory === "PHOTOGRAPHY")
              ) {
                const rawTask = selectedTasks.find((t) => t.title.toLowerCase().includes("raw"));
                if (rawTask && rawTask.status !== "COMPLETED") {
                  return {
                    isLocked: true,
                    reason: "Waiting for Raw Photo Selection completion",
                  };
                }
              }

              // Album edit requires photo editing completed
              if (task.serviceCategory === "ALBUM" || titleLower.includes("album")) {
                const photoEdit = selectedTasks.find(
                  (t) =>
                    t.title.toLowerCase().includes("photo edit") ||
                    (t.title.toLowerCase().includes("edit") && t.serviceCategory === "PHOTOGRAPHY")
                );
                if (photoEdit && photoEdit.status !== "COMPLETED") {
                  return {
                    isLocked: true,
                    reason: "Waiting for Photo Editing completion",
                  };
                }
              }

              // Final delivery requires all production tasks completed
              if (task.serviceCategory === "GENERAL" || titleLower.includes("delivery")) {
                const pending = selectedTasks.filter((t) => t.id !== task.id && t.status !== "COMPLETED");
                if (pending.length > 0) {
                  return {
                    isLocked: true,
                    reason: `Waiting for ${pending.length} preceding task(s) to complete`,
                  };
                }
              }

              return { isLocked: false };
            };

            const renderTaskCard = (task: Task) => {
              const prereq = getPrerequisite(task);
              const taskAge = calculateTaskAgeBadge(task);
              const displayTitle = task.title.includes("Raw")
                ? "Raw Photo Selection (with customer)"
                : task.title.replace("&", "and");

              const hasAssignedCrew = Boolean(task.assignedMemberName && !task.assignedMemberName.toLowerCase().includes("unassigned"));
              const effectiveStatus: TaskStatus = isEventLocked ? "AWAITING_EVENT" : (task.status === "AWAITING_EVENT" ? "ASSIGNED" : task.status);

              const cardBg = isEventLocked || effectiveStatus === "AWAITING_EVENT"
                ? "border-slate-200 bg-slate-50"
                : effectiveStatus === "COMPLETED"
                ? "border-emerald-200 bg-emerald-50/50"
                : effectiveStatus === "IN_PROGRESS"
                ? "border-blue-200 bg-blue-50/50"
                : effectiveStatus === "REVIEW"
                ? "border-purple-200 bg-purple-50/50"
                : effectiveStatus === "REWORK"
                ? "border-amber-200 bg-amber-50/50"
                : "border-slate-200 bg-slate-50/40";

              const statusBadgeStyle = isEventLocked || effectiveStatus === "AWAITING_EVENT"
                ? "bg-slate-100 text-slate-600 border-slate-200"
                : effectiveStatus === "COMPLETED"
                ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                : effectiveStatus === "IN_PROGRESS"
                ? "bg-blue-100 text-blue-800 border-blue-200"
                : effectiveStatus === "REVIEW"
                ? "bg-purple-100 text-purple-800 border-purple-200"
                : effectiveStatus === "REWORK"
                ? "bg-amber-100 text-amber-800 border-amber-200"
                : "bg-slate-100 text-slate-700 border-slate-200";

              const statusLabel = isEventLocked || effectiveStatus === "AWAITING_EVENT"
                ? "Awaiting Event"
                : effectiveStatus === "COMPLETED"
                ? "Completed"
                : effectiveStatus === "IN_PROGRESS"
                ? "In Progress"
                : effectiveStatus === "REVIEW"
                ? "Client Review"
                : effectiveStatus === "REWORK"
                ? "Revisions Requested"
                : "Assigned";

              return (
                <div
                  key={task.id}
                  className={`rounded-xl border p-2.5 transition space-y-2 ${cardBg}`}
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap min-w-0">
                      <p className="font-bold text-text-primary text-xs truncate">
                        {displayTitle}
                      </p>
                      <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold border ${statusBadgeStyle}`}>
                        {statusLabel}
                      </span>
                      <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold border ${taskAge.colorClass}`}>
                        {taskAge.label}
                      </span>
                    </div>

                    {/* Minimal action buttons */}
                    <div className="flex items-center gap-1.5">
                      {isEventLocked ? (
                        <span className="text-[10px] text-slate-400 font-medium">Locked</span>
                      ) : prereq.isLocked ? (
                        <span className="text-[10px] text-slate-400 font-medium" title={prereq.reason}>
                          Waiting
                        </span>
                      ) : (
                        <>
                          {effectiveStatus === "ASSIGNED" && (
                            <button
                              type="button"
                              onClick={() => handleUpdateTaskStatus(task.id, "IN_PROGRESS")}
                              className="rounded bg-brand-blue-primary text-white font-bold text-[10px] px-2 py-0.5 hover:bg-sky-600 transition cursor-pointer"
                            >
                              Start
                            </button>
                          )}

                          {effectiveStatus === "IN_PROGRESS" && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleUpdateTaskStatus(task.id, "REVIEW")}
                                className="rounded bg-purple-600 text-white font-bold text-[10px] px-2 py-0.5 hover:bg-purple-700 transition cursor-pointer"
                              >
                                Send for Review
                              </button>
                              <button
                                type="button"
                                onClick={() => handleUpdateTaskStatus(task.id, "COMPLETED")}
                                className="rounded bg-emerald-600 text-white font-bold text-[10px] px-2 py-0.5 hover:bg-emerald-700 transition cursor-pointer"
                              >
                                Complete
                              </button>
                            </>
                          )}

                          {effectiveStatus === "REVIEW" && (
                            <>
                              <span className="text-[10px] font-semibold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                                In Client Review
                              </span>
                              <button
                                type="button"
                                onClick={() => handleUpdateTaskStatus(task.id, "COMPLETED")}
                                className="rounded bg-emerald-600 text-white font-bold text-[10px] px-2 py-0.5 hover:bg-emerald-700 transition cursor-pointer"
                              >
                                Complete
                              </button>
                            </>
                          )}

                          {effectiveStatus === "REWORK" && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleUpdateTaskStatus(task.id, "IN_PROGRESS")}
                                className="rounded bg-brand-blue-primary text-white font-bold text-[10px] px-2 py-0.5 hover:bg-sky-600 transition cursor-pointer"
                              >
                                Resume Editing
                              </button>
                              <button
                                type="button"
                                onClick={() => handleUpdateTaskStatus(task.id, "COMPLETED")}
                                className="rounded bg-emerald-600 text-white font-bold text-[10px] px-2 py-0.5 hover:bg-emerald-700 transition cursor-pointer"
                              >
                                Complete
                              </button>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Crew Assignment Bar */}
                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-border-default/40 text-[11px]">
                    <div className="flex items-center gap-1.5 text-text-secondary truncate">
                      <span className="text-text-tertiary">Crew:</span>
                      <span className="font-semibold text-text-primary truncate">
                        {hasAssignedCrew ? task.assignedMemberName : "Unassigned"}
                      </span>
                    </div>

                    <select
                      value={hasAssignedCrew ? (allSelectableCrew.find((m) => m.name === task.assignedMemberName)?.id || "") : ""}
                      onChange={(e) => {
                        if (e.target.value === "__add_new__") {
                          setTargetAssignContext({ taskId: task.id });
                          setShowAddMemberModal(true);
                        } else if (e.target.value) {
                          handleAssignTaskCrew(task.id, e.target.value);
                        }
                      }}
                      className="text-[10px] font-medium bg-white border border-border-default rounded px-1.5 py-0.5 outline-none cursor-pointer"
                    >
                      <option value="">{hasAssignedCrew ? "Change..." : "Assign..."}</option>
                      {allSelectableCrew.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                      <option value="__add_new__">+ Add in ERP</option>
                    </select>
                  </div>
                </div>
              );
            };

            return (
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-text-tertiary">
                    Post-Event Production Pipelines ({selectedTasks.length})
                  </h3>
                  <span className="text-[10px] text-text-tertiary font-medium">
                    {isEventLocked ? `Event date: ${selected.eventDate} · Tasks unlock post-event` : "Active Production Workflows"}
                  </span>
                </div>

                {selectedTasks.length === 0 ? (
                  <p className="text-xs text-text-tertiary">No tasks generated for this order.</p>
                ) : (
                  <div className="space-y-3.5">
                    {/* 2-Column Model Grid: Photography on Left, Videography on Right */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {/* Left Column: Photography Pipeline */}
                      <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-2.5">
                        <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                          <div>
                            <span className="text-xs font-bold text-text-primary block">
                              Photography Pipeline
                            </span>
                            <span className="text-[10px] text-text-tertiary font-medium">
                              (Raw Selection - Photo Editing - Album)
                            </span>
                          </div>
                          <span className="text-[10px] font-bold text-text-secondary bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            {photoTasks.filter((t) => t.status === "COMPLETED").length}/{photoTasks.length} done
                          </span>
                        </div>

                        <div className="space-y-2">
                          {photoTasks.length > 0 ? (
                            photoTasks.map((t) => renderTaskCard(t))
                          ) : (
                            <p className="text-[11px] text-text-tertiary italic">No photography tasks</p>
                          )}
                        </div>
                      </div>

                      {/* Right Column: Videography Pipeline */}
                      <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-2.5">
                        <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                          <div>
                            <span className="text-xs font-bold text-text-primary block">
                              Videography Pipeline
                            </span>
                            <span className="text-[10px] text-text-tertiary font-medium">
                              (Video Editing)
                            </span>
                          </div>
                          <span className="text-[10px] font-bold text-text-secondary bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            {videoTasks.filter((t) => t.status === "COMPLETED").length}/{videoTasks.length} done
                          </span>
                        </div>

                        <div className="space-y-2">
                          {videoTasks.length > 0 ? (
                            videoTasks.map((t) => renderTaskCard(t))
                          ) : (
                            <p className="text-[11px] text-text-tertiary italic">No videography tasks</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Milestone Row: Final Delivery & Handover */}
                    {deliveryTasks.length > 0 && (
                      <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-2.5">
                        <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                          <div>
                            <span className="text-xs font-bold text-text-primary block">
                              Final Delivery and Handover
                            </span>
                            <span className="text-[10px] text-text-tertiary font-medium">
                              (Client Delivery and Payment)
                            </span>
                          </div>
                          <span className="text-[10px] font-bold text-text-secondary bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            {deliveryTasks.filter((t) => t.status === "COMPLETED").length}/{deliveryTasks.length} done
                          </span>
                        </div>
                        <div className="space-y-2">
                          {deliveryTasks.map((t) => renderTaskCard(t))}
                        </div>
                      </div>
                    )}

                    {/* Other tasks if any */}
                    {otherTasks.length > 0 && (
                      <div className="rounded-xl border border-border-default bg-white p-3 space-y-2.5">
                        <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                          <span className="text-xs font-bold text-text-primary">
                            Additional Deliverables ({otherTasks.length})
                          </span>
                        </div>
                        <div className="space-y-2">
                          {otherTasks.map((t) => renderTaskCard(t))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })()}

          {/* Production Aging and Turnaround SLA Banner (Placed below Post-Event Production Tasks) */}
          {(() => {
            const aging = calculateOrderAging(
              selected.eventDate,
              selectedTasks,
              selected.orderStatus === "COMPLETED",
              selected.updatedAt
            );
            return (
              <div className="rounded-2xl border border-border-default bg-surface-app/40 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">
                      Production Turnaround and SLA Breakdown
                    </span>
                    {selected.orderStatus === "COMPLETED" ? (
                      <span className="rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-extrabold px-2 py-0.5 border border-emerald-200">
                        Delivered
                      </span>
                    ) : aging.isUpcoming ? (
                      <span className="rounded-full bg-blue-100 text-brand-blue-primary text-[9px] font-extrabold px-2 py-0.5 border border-blue-200">
                        Event Scheduled
                      </span>
                    ) : (
                      <span className="rounded-full bg-amber-100 text-amber-800 text-[9px] font-extrabold px-2 py-0.5 border border-amber-200">
                        Active Production
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-bold text-text-secondary">
                    {aging.statusLabel}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  {/* Card 1: Total Overall Age */}
                  <div className="rounded-xl border border-border-default bg-white p-3 shadow-2xs">
                    <span className="text-[10px] font-semibold text-text-tertiary block">
                      {selected.orderStatus === "COMPLETED" ? "Overall Turnaround" : "Overall Order Age"}
                    </span>
                    <span className="text-base font-extrabold text-text-primary mt-0.5 block">
                      {aging.isUpcoming ? "0 d" : `${aging.totalAgeDays} Days`}
                    </span>
                    <span className="text-[9px] text-text-tertiary block mt-0.5 truncate">
                      {aging.isUpcoming ? "Starts after event" : `From ${selected.eventDate}`}
                    </span>
                  </div>

                  {/* Card 2: Studio Working Days */}
                  <div className="rounded-xl border border-blue-200/80 bg-blue-50/50 p-3 shadow-2xs">
                    <span className="text-[10px] font-semibold text-blue-900 block">
                      Pending at Studio
                    </span>
                    <span className="text-base font-extrabold text-brand-blue-primary mt-0.5 block">
                      {aging.isUpcoming ? "0 d" : `${aging.studioDays} Days`}
                    </span>
                    <span className="text-[9px] text-blue-700/80 block mt-0.5 truncate">
                      Editing, culling and design
                    </span>
                  </div>

                  {/* Card 3: Pending at Customer */}
                  <div className={`rounded-xl border p-3 shadow-2xs ${
                    aging.customerDays > 0
                      ? "border-amber-300 bg-amber-50/70"
                      : "border-border-default bg-white"
                  }`}>
                    <span className={`text-[10px] font-semibold block ${
                      aging.customerDays > 0 ? "text-amber-900" : "text-text-tertiary"
                    }`}>
                      Pending at Customer
                    </span>
                    <span className={`text-base font-extrabold mt-0.5 block ${
                      aging.customerDays > 0 ? "text-amber-700" : "text-text-primary"
                    }`}>
                      {aging.isUpcoming ? "0 d" : `${aging.customerDays} Days`}
                    </span>
                    <span className={`text-[9px] block mt-0.5 truncate ${
                      aging.customerDays > 0 ? "text-amber-700 font-semibold" : "text-text-tertiary"
                    }`}>
                      {aging.customerDays > 0 ? "Awaiting client review" : "No pending reviews"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* 3. Payment and Pricing Summary */}
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-tertiary">
                Payment and Pricing Summary
              </h3>
              <div className="flex items-center gap-1.5">
                {isEditingPricing ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-blue-primary bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                    <span>✎</span> Editing
                  </span>
                ) : (
                  <>
                    {selected.paymentStatus === "PAID" ? (
                      <button
                        type="button"
                        disabled={isUpdatingPayment}
                        onClick={() => {
                          void handleUpdatePayment("PENDING");
                        }}
                        className="rounded-lg border border-border-default bg-white px-2.5 py-1 text-[11px] font-semibold text-text-secondary hover:text-amber-700 hover:border-amber-300 hover:bg-amber-50/50 shadow-2xs transition disabled:opacity-50 flex items-center gap-1"
                        title="Mark order as Unpaid"
                      >
                        <span>✕</span>
                        <span>{isUpdatingPayment ? "Updating..." : "Mark Unpaid"}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={isUpdatingPayment}
                        onClick={() => void handleUpdatePayment("PAID")}
                        className="btn-brand-blue py-1 px-2.5 text-[11px] disabled:opacity-50 flex items-center gap-1"
                        title="Mark order as Paid"
                      >
                        <span>✓</span>
                        <span>{isUpdatingPayment ? "Updating..." : "Mark Paid"}</span>
                      </button>
                    )}
                    <button
                      type="button"
                      disabled={isUpdatingPayment}
                      onClick={handleStartEditingPricing}
                      className="rounded-lg border border-border-default bg-white px-2.5 py-1 text-[11px] font-semibold text-text-secondary hover:text-brand-blue-primary hover:border-brand-blue-primary hover:bg-blue-50/50 shadow-2xs transition disabled:opacity-50 flex items-center gap-1"
                      title="Edit pricing and payment amounts"
                    >
                      <span>✎</span>
                      <span>Edit</span>
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="mt-2 space-y-2.5 rounded-2xl bg-surface-app p-4 border border-border-default text-xs">
              {isEditingPricing ? (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary font-medium">Confirmed Price:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-text-secondary font-bold">₹</span>
                      <input
                        type="number"
                        min={0}
                        value={editConfirmedPrice}
                        onChange={(e) => {
                          setEditConfirmedPrice(e.target.value);
                          setPricingError(null);
                        }}
                        className="w-28 rounded-lg border border-border-default bg-white px-2.5 py-1 text-xs font-bold text-text-primary focus:outline-none focus:border-brand-blue-primary focus:ring-1 focus:ring-brand-blue-primary"
                        placeholder="0"
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-text-secondary font-medium">Advance Received:</span>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="text-[10px] text-text-tertiary">Recorded on:</span>
                          <input
                            type="date"
                            value={editAdvanceDate}
                            onChange={(e) => setEditAdvanceDate(e.target.value)}
                            className="rounded border border-border-default bg-white px-1 py-0.5 text-[10px] text-text-secondary focus:outline-none focus:border-brand-blue-primary"
                            title="Date advance payment was recorded"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-text-secondary font-bold">₹</span>
                        <input
                          type="number"
                          min={0}
                          value={editAdvanceAmount}
                          onChange={(e) => {
                            setEditAdvanceAmount(e.target.value);
                            setPricingError(null);
                          }}
                          className="w-28 rounded-lg border border-border-default bg-white px-2.5 py-1 text-xs font-bold text-brand-blue-primary focus:outline-none focus:border-brand-blue-primary focus:ring-1 focus:ring-brand-blue-primary"
                          placeholder="0"
                        />
                      </div>
                    </div>
                    {(Number(editAdvanceAmount) || 0) > (Number(editConfirmedPrice) || 0) && (
                      <p className="text-[11px] font-semibold text-status-danger text-right">
                        Advance exceeds confirmed price of ₹{(Number(editConfirmedPrice) || 0).toLocaleString()}
                      </p>
                    )}
                  </div>

                  {/* Installments in edit mode */}
                  <div className="pt-2 border-t border-border-default space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-text-secondary">
                        Installments / Payments:
                      </span>
                    </div>

                    {editInstallments.length > 0 && (
                      <div className="space-y-1.5">
                        {editInstallments.map((inst, idx) => (
                          <div
                            key={inst.id || idx}
                            className="flex items-center justify-between bg-white rounded-lg px-2.5 py-1.5 border border-border-default"
                          >
                            <div className="text-xs">
                              <span className="font-bold text-text-primary">
                                ₹{inst.amount.toLocaleString()}
                              </span>
                              <span className="text-[10px] text-text-tertiary ml-2">
                                Recorded on {inst.date}{inst.notes ? ` · ${inst.notes}` : ""}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveInstallment(idx)}
                              className="text-text-tertiary hover:text-status-danger p-0.5 text-xs font-bold transition"
                              title="Remove payment"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Prominent, easy-to-find + Add Payment button in solid blue color */}
                    {!showAddInstallment && (
                      <button
                        type="button"
                        onClick={() => {
                          setInstallmentError(null);
                          setNewInstallmentAmount("");
                          setNewInstallmentNotes("");
                          setNewInstallmentDate(new Date().toISOString().split("T")[0]);
                          setShowAddInstallment(true);
                        }}
                        className="w-full py-2.5 px-3 rounded-xl bg-brand-blue-primary hover:bg-sky-600 active:bg-sky-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-sm cursor-pointer"
                      >
                        <span className="text-sm font-extrabold">+</span>
                        <span>Add Payment</span>
                      </button>
                    )}

                    {showAddInstallment && (() => {
                      const confirmedNum = Math.max(0, Number(editConfirmedPrice) || 0);
                      const advanceNum = Math.max(0, Number(editAdvanceAmount) || 0);
                      const instTotal = editInstallments.reduce((sum, i) => sum + (i.amount || 0), 0);
                      const remainingForNew = Math.max(0, confirmedNum - (advanceNum + instTotal));
                      const inputAmt = Number(newInstallmentAmount) || 0;
                      const isExceeding = inputAmt > remainingForNew;

                      return (
                        <div className="rounded-xl border border-brand-blue-light bg-blue-50/50 p-3 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-text-primary">Add Payment Entry</span>
                            <span className="text-[10px] text-text-tertiary font-medium">
                              Remaining balance: <span className="font-bold text-brand-orange-primary">₹{remainingForNew.toLocaleString()}</span>
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="flex-1">
                              <label className="text-[10px] font-bold text-text-secondary block mb-0.5">
                                Payment Amount (₹)
                              </label>
                              <input
                                type="number"
                                min={1}
                                max={remainingForNew}
                                value={newInstallmentAmount}
                                onChange={(e) => {
                                  setNewInstallmentAmount(e.target.value);
                                  setInstallmentError(null);
                                }}
                                placeholder={`Up to ₹${remainingForNew.toLocaleString()}`}
                                className={`w-full rounded-lg border bg-white px-2.5 py-1 text-xs font-bold text-text-primary focus:outline-none focus:ring-1 ${
                                  isExceeding
                                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                    : "border-border-default focus:border-brand-blue-primary focus:ring-brand-blue-primary"
                                }`}
                                autoFocus
                              />
                            </div>
                            <div className="w-36">
                              <label className="text-[10px] font-bold text-text-secondary block mb-0.5">
                                Recorded on Date
                              </label>
                              <input
                                type="date"
                                value={newInstallmentDate}
                                onChange={(e) => setNewInstallmentDate(e.target.value)}
                                className="w-full rounded-lg border border-border-default bg-white px-2 py-1 text-xs text-text-primary focus:outline-none focus:border-brand-blue-primary focus:ring-1 focus:ring-brand-blue-primary"
                              />
                            </div>
                          </div>

                          {/* Real-time inline validation error in clear vivid red */}
                          {isExceeding && (
                            <p className="text-xs font-bold text-red-600 bg-red-50 p-2 rounded-lg border border-red-200 flex items-center gap-1.5">
                              <span>⚠️</span>
                              <span>Payment amount cannot exceed remaining balance of ₹{remainingForNew.toLocaleString()}.</span>
                            </p>
                          )}

                          {installmentError && (
                            <p className="text-xs font-bold text-red-600 bg-red-50 p-2 rounded-lg border border-red-200 flex items-center gap-1.5">
                              <span>⚠️</span>
                              <span>{installmentError}</span>
                            </p>
                          )}

                          <div>
                            <input
                              type="text"
                              value={newInstallmentNotes}
                              onChange={(e) => setNewInstallmentNotes(e.target.value)}
                              placeholder="Optional note (e.g. Cash, UPI, 2nd installment)"
                              maxLength={50}
                              className="w-full rounded-lg border border-border-default bg-white px-2.5 py-1 text-xs text-text-secondary focus:outline-none focus:border-brand-blue-primary focus:ring-1 focus:ring-brand-blue-primary"
                            />
                          </div>

                          <div className="flex justify-end gap-1.5 pt-1">
                            <button
                              type="button"
                              onClick={() => {
                                setShowAddInstallment(false);
                                setInstallmentError(null);
                              }}
                              className="rounded-md border border-border-default bg-white px-2.5 py-1 text-[11px] font-medium text-text-secondary hover:text-text-primary transition"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              disabled={isExceeding || inputAmt <= 0}
                              onClick={handleAddInstallment}
                              className="btn-brand-blue py-1 px-3 text-[11px] disabled:opacity-40"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-border-default">
                    <span className="text-text-secondary font-medium">Remaining Balance:</span>
                    <span className="font-bold text-brand-orange-primary">
                      {(() => {
                        const c = Math.max(0, Number(editConfirmedPrice) || 0);
                        const a = Math.max(0, Number(editAdvanceAmount) || 0);
                        const instTotal = editInstallments.reduce((sum, i) => sum + (i.amount || 0), 0);
                        return `₹${Math.max(0, c - (a + instTotal)).toLocaleString()}`;
                      })()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-border-default">
                    <span className="text-text-secondary font-medium">Payment Status:</span>
                    {(() => {
                      const c = Math.max(0, Number(editConfirmedPrice) || 0);
                      const a = Math.max(0, Number(editAdvanceAmount) || 0);
                      const instTotal = editInstallments.reduce((sum, i) => sum + (i.amount || 0), 0);
                      const totalPaid = a + instTotal;
                      const isPaid = totalPaid >= c && c > 0;
                      const hasInst = editInstallments.length > 0;
                      const isAdvance = !isPaid && !hasInst && a > 0;
                      const isPartial = !isPaid && hasInst && totalPaid > 0;

                      if (isPaid) {
                        return <span className="font-bold text-status-success">Payment Completed</span>;
                      }
                      if (isAdvance) {
                        return <span className="font-bold text-sky-700">ADVANCE RECEIVED</span>;
                      }
                      if (isPartial) {
                        return <span className="font-bold text-brand-orange-primary">PARTIAL</span>;
                      }
                      return <span className="font-bold text-text-secondary">PENDING</span>;
                    })()}
                  </div>

                  {/* Inline overall validation banner */}
                  {pricingError && (
                    <div className="rounded-xl bg-red-50 border border-red-200 p-2.5 text-xs text-status-danger font-medium flex items-center gap-2">
                      <span>⚠️</span>
                      <span>{pricingError}</span>
                    </div>
                  )}

                  {/* Bottom Save and Cancel Buttons */}
                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-border-default">
                    <button
                      type="button"
                      disabled={isUpdatingPayment}
                      onClick={() => {
                        setIsEditingPricing(false);
                        setPricingError(null);
                        setInstallmentError(null);
                      }}
                      className="rounded-xl border border-border-default bg-white px-3.5 py-1.5 text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-surface-subtle shadow-2xs transition disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={
                        isUpdatingPayment ||
                        (Number(editAdvanceAmount) || 0) + editInstallments.reduce((sum, i) => sum + (i.amount || 0), 0) > (Number(editConfirmedPrice) || 0)
                      }
                      onClick={() => void handleSavePricing()}
                      className="btn-brand-blue py-1.5 px-4 text-xs font-bold disabled:opacity-50 flex items-center gap-1.5 shadow-2xs"
                    >
                      <span>✓</span>
                      <span>{isUpdatingPayment ? "Saving Changes..." : "Save Changes"}</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary">Confirmed Price:</span>
                    <span className="font-bold text-text-primary">
                      ₹{selected.pricing.finalConfirmedPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-text-secondary">Advance Received:</span>
                      <div className="text-[10px] text-text-tertiary">
                        Recorded on {selected.pricing.advanceDate || (selected.createdAt ? selected.createdAt.split("T")[0] : "-")}
                      </div>
                    </div>
                    <span className="font-bold text-brand-blue-primary">
                      ₹{selected.pricing.advanceAmount.toLocaleString()}
                    </span>
                  </div>

                  {selected.pricing.installments && selected.pricing.installments.length > 0 && (
                    <div className="pt-2 border-t border-border-default/60 space-y-1.5">
                      {selected.pricing.installments.map((inst, idx) => (
                        <div key={inst.id || idx} className="flex justify-between items-center">
                          <div>
                            <span className="text-text-secondary font-medium">Payment:</span>
                            <span className="text-[10px] text-text-tertiary ml-1.5">
                              Recorded on {inst.date}{inst.notes ? ` · ${inst.notes}` : ""}
                            </span>
                          </div>
                          <span className="font-bold text-text-primary">
                            ₹{inst.amount.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2 border-t border-border-default">
                    <span className="text-text-secondary">Remaining Balance:</span>
                    <span className="font-bold text-brand-orange-primary">
                      ₹{selected.pricing.remainingAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-border-default">
                    <span className="text-text-secondary">Payment Status:</span>
                    {(() => {
                      const isPaid = selected.paymentStatus === "PAID";
                      const hasInstallments = Boolean(selected.pricing.installments && selected.pricing.installments.length > 0);
                      const isAdvance = selected.paymentStatus === "ADVANCE_RECEIVED" || (!hasInstallments && selected.pricing.advanceAmount > 0 && selected.pricing.remainingAmount > 0);
                      const isPartial = !isPaid && hasInstallments && (selected.pricing.remainingAmount > 0 || selected.paymentStatus === "PARTIAL");

                      if (isPaid) {
                        return <span className="font-bold text-status-success">Payment Completed</span>;
                      }
                      if (isAdvance) {
                        return <span className="font-bold text-sky-700">ADVANCE RECEIVED</span>;
                      }
                      if (isPartial) {
                        return <span className="font-bold text-brand-orange-primary">PARTIAL</span>;
                      }
                      return <span className="font-bold text-text-secondary">PENDING</span>;
                    })()}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 4. Pre-flight Operational Check Report */}
          {selected.preflightReport && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                  Pre-flight Operational Check
                </h4>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    selected.preflightReport.hasConflicts
                      ? "bg-red-100 text-status-error"
                      : "bg-green-100 text-status-success"
                  }`}
                >
                  {selected.preflightReport.hasConflicts ? "Review Needed" : "Passed Clear"}
                </span>
              </div>

              {selected.preflightReport.eventDateConflicts.length > 0 && (
                <div className="text-xs text-red-700 bg-red-50 p-2.5 rounded-xl border border-red-200">
                  <p className="font-bold">Overlapping Event Conflict:</p>
                  <p className="text-[11px] mt-0.5">
                    {selected.preflightReport.eventDateConflicts.join(", ")}
                  </p>
                </div>
              )}

              {selected.preflightReport.warnings.length > 0 && (
                <div className="space-y-1">
                  {selected.preflightReport.warnings.map((w, idx) => (
                    <p key={idx} className="text-[11px] text-amber-900 flex items-center gap-1.5">
                      <span>•</span> {w}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 5. Automated Resource Suggestions (Owner Reviews and Confirms) */}
          {selected.resourceSuggestions && selected.resourceSuggestions.length > 0 && (
            <div className="rounded-2xl border border-blue-200 bg-blue-50/40 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wider">
                    Suggested Resources
                  </h4>
                  <p className="text-[10px] text-blue-700">System suggests · Owner reviews and confirms</p>
                </div>
                <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                  {selected.resourceSuggestions.length} Available
                </span>
              </div>

              <div className="space-y-2">
                {selected.resourceSuggestions.map((sug) => {
                  const isAssigned = (selected.assignedResources || []).some(
                    (r) => r.memberId === sug.memberId
                  );

                  return (
                    <div
                      key={sug.memberId}
                      className="flex items-center justify-between rounded-xl border border-blue-200 bg-white p-2.5 text-xs"
                    >
                      <div>
                        <span className="font-bold text-text-primary">{sug.memberName}</span>
                        <span className="ml-2 rounded bg-surface-app px-1.5 py-0.5 text-[10px] font-medium text-text-secondary border border-border-default">
                          {sug.skill}
                        </span>
                        <p className="text-[10px] text-text-tertiary mt-0.5">{sug.matchReason}</p>
                      </div>

                      {isAssigned ? (
                        <span className="text-[10px] font-bold text-status-success bg-green-50 px-2 py-1 rounded-lg border border-green-200">
                          Assigned
                        </span>
                      ) : (
                        <button
                          onClick={() => handleConfirmSuggestion(sug)}
                          className="rounded-lg bg-brand-blue-primary px-2.5 py-1 text-[11px] font-bold text-white hover:bg-sky-600 transition"
                        >
                          Confirm Assignment
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 6. Customer Order Access and Tracking Link (Sharing Option Info) */}
          <div className="rounded-2xl border border-brand-blue-soft bg-brand-blue-background/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-blue-primary">
                Customer Order Access and Tracking Link
              </span>
              <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${
                selected.customer?.email
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-blue-100 text-brand-blue-primary"
              }`}>
                {selected.customer?.email ? "Email Auth Active" : "6-Digit PIN Protected"}
              </span>
            </div>

            {selected.customer?.email ? (
              /* EMAIL AUTH MODE */
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2 bg-white rounded-xl p-2.5 border border-border-default">
                  <div>
                    <span className="text-[10px] font-semibold text-text-tertiary block">Registered Customer Email</span>
                    <span className="font-mono text-xs font-extrabold text-text-primary tracking-wide">
                      {selected.customer.email}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyText(selected.customer.email!, "code")}
                    className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200 transition shrink-0"
                  >
                    {copiedField === "code" ? "Copied Email!" : "Copy Email"}
                  </button>
                </div>

                <div className="flex items-center justify-between gap-2 bg-white rounded-xl p-2.5 border border-border-default">
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-semibold text-text-tertiary block">Direct Tracking Link</span>
                    <span className="font-mono text-xs font-semibold text-brand-blue-primary truncate block">
                      {typeof window !== "undefined" ? `${window.location.origin}/track/${selected.orderNumber}` : `/track/${selected.orderNumber}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        const link = typeof window !== "undefined" ? `${window.location.origin}/track/${selected.orderNumber}` : `/track/${selected.orderNumber}`;
                        handleCopyText(link, "link");
                      }}
                      className="rounded-lg bg-brand-blue-primary px-3 py-1.5 text-xs font-bold text-white hover:bg-sky-600 transition"
                    >
                      {copiedField === "link" ? "Copied Link!" : "Copy Link"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const link = typeof window !== "undefined" ? `${window.location.origin}/track/${selected.orderNumber}` : `/track/${selected.orderNumber}`;
                        void handleShareText(link, `Order #${selected.orderNumber} Tracking Link`);
                      }}
                      className="rounded-lg border border-border-default bg-white px-2.5 py-1.5 text-xs font-bold text-text-primary hover:bg-surface-app hover:border-brand-blue-primary transition flex items-center gap-1.5"
                      title="Share tracking link"
                    >
                      <svg className="w-3.5 h-3.5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      Share
                    </button>
                    <a
                      href={`/track/${selected.orderNumber}`}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg border border-brand-blue-primary bg-white px-2.5 py-1.5 text-xs font-bold text-brand-blue-primary hover:bg-blue-50 transition"
                      title="Open tracking page in new tab"
                    >
                      Open Link
                    </a>
                  </div>
                </div>

                <p className="text-[11px] text-text-secondary leading-relaxed">
                  Customer email on file (<strong className="text-text-primary">{selected.customer.email}</strong>). Customer authenticates directly with this email. No PIN required.
                </p>
              </div>
            ) : (
              /* 6-DIGIT PIN GUEST PASSKEY MODE */
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2 bg-white rounded-xl p-2.5 border border-border-default">
                  <div>
                    <span className="text-[10px] font-semibold text-text-tertiary block">6-Digit Guest Access PIN</span>
                    <span className="font-mono text-sm font-extrabold text-brand-blue-primary tracking-widest">
                      {selected.passkeyPin || selected.trackingPasskey.match(/\d{6}/)?.[0] || selected.orderNumber.match(/\d{6}/)?.[0] || "492015"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const pin = selected.passkeyPin || selected.trackingPasskey.match(/\d{6}/)?.[0] || selected.orderNumber.match(/\d{6}/)?.[0] || "492015";
                      handleCopyText(pin, "code");
                    }}
                    className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200 transition shrink-0"
                  >
                    {copiedField === "code" ? "Copied PIN!" : "Copy 6-Digit PIN"}
                  </button>
                </div>

                <div className="flex items-center justify-between gap-2 bg-white rounded-xl p-2.5 border border-border-default">
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-semibold text-text-tertiary block">Direct Tracking Link</span>
                    <span className="font-mono text-xs font-semibold text-brand-blue-primary truncate block">
                      {typeof window !== "undefined" ? `${window.location.origin}/track/${selected.orderNumber}` : `/track/${selected.orderNumber}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        const link = typeof window !== "undefined" ? `${window.location.origin}/track/${selected.orderNumber}` : `/track/${selected.orderNumber}`;
                        handleCopyText(link, "link");
                      }}
                      className="rounded-lg bg-brand-blue-primary px-3 py-1.5 text-xs font-bold text-white hover:bg-sky-600 transition"
                    >
                      {copiedField === "link" ? "Copied Link!" : "Copy Link"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const link = typeof window !== "undefined" ? `${window.location.origin}/track/${selected.orderNumber}` : `/track/${selected.orderNumber}`;
                        void handleShareText(link, `Order #${selected.orderNumber} Tracking Link`);
                      }}
                      className="rounded-lg border border-border-default bg-white px-2.5 py-1.5 text-xs font-bold text-text-primary hover:bg-surface-app hover:border-brand-blue-primary transition flex items-center gap-1.5"
                      title="Share tracking link"
                    >
                      <svg className="w-3.5 h-3.5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      Share
                    </button>
                    <a
                      href={`/track/${selected.orderNumber}`}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg border border-brand-blue-primary bg-white px-2.5 py-1.5 text-xs font-bold text-brand-blue-primary hover:bg-blue-50 transition"
                      title="Open tracking page in new tab"
                    >
                      Open Link
                    </a>
                  </div>
                </div>

                <p className="text-[11px] text-text-secondary leading-relaxed">
                  No customer email provided. Share this 6-digit PIN and tracking link with your customer for guest access.
                </p>
              </div>
            )}
          </div>

          {/* Cancellation, Audit History and Soft-Deletion Operations */}
          <div className="border-t border-border-divider pt-4 flex items-center justify-between gap-2 flex-wrap">
            {selected.orderStatus !== "CANCELLED" && (
              <button
                type="button"
                onClick={() => {
                  setCancelTargetOrder(selected);
                  setCancelReason("");
                }}
                className="rounded-xl border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-800 hover:bg-amber-100 transition cursor-pointer"
              >
                Cancel Order
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowAuditHistory((prev) => !prev)}
              className="text-xs font-semibold text-brand-blue-primary hover:underline hover:text-sky-700 transition flex items-center gap-1 cursor-pointer mx-auto"
              title="Toggle Order Audit and Activity History"
            >
              <span>{showAuditHistory ? "Hide Audit History" : "Audit History"}</span>
              <span className="text-[10px]">{showAuditHistory ? "▴" : "▾"}</span>
            </button>

            <button
              type="button"
              onClick={() => setDeleteTargetOrder(selected)}
              className="rounded-xl border border-red-200 bg-white hover:bg-red-50 text-red-600 font-bold px-3.5 py-1.5 text-xs transition shadow-2xs cursor-pointer inline-flex items-center gap-1.5"
              title="Delete order with 14-day recovery window"
            >
              <svg className="w-3.5 h-3.5 text-red-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Delete Order</span>
            </button>
          </div>

          {/* Audit History Activity Log */}
          {showAuditHistory && (() => {
            const formatAuditStamp = (val?: string | null): string => {
              if (!val) return "-";
              return getStudioTimestampIST(val);
            };

            const logEntries: Array<{
              id: string;
              timestamp: string;
              actorName: string;
              actorRole: "Owner" | "Member" | "Customer" | "System";
              action: string;
              details: string;
            }> = [];

            // 1. Explicitly recorded audit logs in the order
            if (selected.auditLog && selected.auditLog.length > 0) {
              selected.auditLog.forEach((entry) => {
                logEntries.push({
                  id: entry.id,
                  timestamp: formatAuditStamp(entry.timestamp),
                  actorName: entry.actorName,
                  actorRole: entry.actorRole,
                  action: entry.action,
                  details: entry.details,
                });
              });
            }

            // 2. Synthesize Order Registration if not already logged
            if (!logEntries.some((e) => e.action.includes("Order Registered"))) {
              logEntries.push({
                id: "synth_reg",
                timestamp: formatAuditStamp(selected.createdAt),
                actorName: selected.bookingRequestId
                  ? selected.customer.name
                  : (selected.createdBy || studio?.ownerName || "Studio Owner"),
                actorRole: selected.bookingRequestId ? "Customer" : "Owner",
                action: "Order Registered",
                details: `Registered confirmed order for ${selected.eventType} · Confirmed Price: ₹${selected.pricing.finalConfirmedPrice.toLocaleString()}`,
              });
            }

            // 3. Synthesize Advance Payment Recorded
            if (
              selected.pricing.advanceAmount > 0 &&
              !logEntries.some((e) => e.action.includes("Advance Payment"))
            ) {
              const regStamp = formatAuditStamp(selected.createdAt);
              const isSameDay = selected.pricing.advanceDate === selected.createdAt.split("T")[0];
              const advStamp = isSameDay
                ? getStudioTimestampIST(new Date(new Date(selected.createdAt).getTime() + 1000))
                : (selected.pricing.advanceDate ? `${selected.pricing.advanceDate} 12:00` : regStamp);

              logEntries.push({
                id: "synth_adv",
                timestamp: advStamp,
                actorName: selected.createdBy || studio?.ownerName || "Studio Owner",
                actorRole: "Owner",
                action: "Advance Payment Recorded",
                details: `Recorded advance payment of ₹${selected.pricing.advanceAmount.toLocaleString()}`,
              });
            }

            // 4. Synthesize Pre-Flight Operational Check
            if (
              selected.preflightReport &&
              !logEntries.some((e) => e.action.includes("Pre-Flight"))
            ) {
              logEntries.push({
                id: "synth_preflight",
                timestamp: formatAuditStamp(selected.preflightReport.evaluatedAt || selected.createdAt),
                actorName: "Automated System",
                actorRole: "System",
                action: "Pre-Flight Check Evaluated",
                details: selected.preflightReport.hasConflicts
                  ? "Schedule conflict warning detected during pre-flight check"
                  : "All operational pre-flight checks clear (0 schedule conflicts)",
              });
            }

            // 5. Synthesize Event Date Passed (System Action)
            const todayCalendar = getStudioCalendarDate();
            if (
              (selected.eventDate < todayCalendar || selected.orderStatus !== "AWAITING_EVENT") &&
              !logEntries.some((e) => e.action.includes("Event Date Passed"))
            ) {
              logEntries.push({
                id: "synth_event_passed",
                timestamp: `${selected.eventDate} 00:00`,
                actorName: "Automated System",
                actorRole: "System",
                action: "Event Date Passed",
                details: `Event date (${selected.eventDate}) reached — Post-event production workflow started automatically`,
              });
            }

            // 6. Synthesize Installments and Payments
            if (selected.pricing.installments && selected.pricing.installments.length > 0) {
              selected.pricing.installments.forEach((inst, i) => {
                const isPaidAuto = inst.notes?.includes("Marked Paid");
                const instDetail = isPaidAuto
                  ? `Recorded final balance payment of ₹${inst.amount.toLocaleString()}. Order marked as Paid.`
                  : `Recorded payment of ₹${inst.amount.toLocaleString()}${inst.notes ? ` · Note: ${inst.notes}` : ""}`;
                if (!logEntries.some((e) => e.id === inst.id || e.details.includes(`₹${inst.amount.toLocaleString()}`))) {
                  logEntries.push({
                    id: inst.id || `synth_inst_${i}`,
                    timestamp: inst.createdAt ? formatAuditStamp(inst.createdAt) : (inst.date ? `${inst.date} 00:00` : "-"),
                    actorName: inst.recordedBy || studio?.ownerName || "Studio Owner",
                    actorRole: (inst.recordedByRole as "Owner" | "Member" | "Customer" | "System") || "Owner",
                    action: isPaidAuto ? "Order Marked Paid" : "Payment Recorded",
                    details: instDetail,
                  });
                }
              });
            }

            // 7. Synthesize Assigned Resources (Staff assignments)
            if (selected.assignedResources && selected.assignedResources.length > 0) {
              selected.assignedResources.forEach((res) => {
                if (!logEntries.some((e) => e.details.includes(res.memberName) && e.details.includes(res.skill))) {
                  logEntries.push({
                    id: `synth_assign_${res.memberId}_${res.skill}`,
                    timestamp: formatAuditStamp(selected.createdAt),
                    actorName: studio?.ownerName || "Studio Owner",
                    actorRole: "Owner",
                    action: "Crew Assigned",
                    details: `Assigned ${res.memberName} for ${res.skill}`,
                  });
                }
              });
            }

            // 8. Synthesize Meaningful Task Progress (Only tasks that have actual assignments or progress)
            if (selectedTasks && selectedTasks.length > 0) {
              selectedTasks.forEach((t) => {
                const hasAssignee =
                  Boolean(t.assignedMemberName) &&
                  !t.assignedMemberName.toLowerCase().includes("unassigned");
                if (hasAssignee && !logEntries.some((e) => e.details.includes(`Assigned task "${t.title}" to ${t.assignedMemberName}`))) {
                  logEntries.push({
                    id: `synth_task_assign_${t.id}`,
                    timestamp: formatAuditStamp(t.createdAt || selected.createdAt),
                    actorName: studio?.ownerName || "Studio Owner",
                    actorRole: "Owner",
                    action: "Task Assigned",
                    details: `Assigned task "${t.title}" (${t.serviceCategory}) to ${t.assignedMemberName}`,
                  });
                }

                if (t.status !== "ASSIGNED" && t.status !== "AWAITING_EVENT" && !logEntries.some((e) => e.details.includes(t.title) && e.details.includes(t.status))) {
                  logEntries.push({
                    id: `synth_task_status_${t.id}`,
                    timestamp: formatAuditStamp(t.updatedAt || selected.createdAt),
                    actorName: hasAssignee ? t.assignedMemberName : (studio?.ownerName || "Studio Owner"),
                    actorRole: hasAssignee ? "Member" : "Owner",
                    action: "Task Status Updated",
                    details: `Updated task "${t.title}" status to ${t.status}${t.reworkNotes ? ` · Notes: ${t.reworkNotes}` : ""}`,
                  });
                }
              });
            }

            // 9. Synthesize Order Cancellation if cancelled
            if (
              selected.orderStatus === "CANCELLED" &&
              !logEntries.some((e) => e.action.includes("Order Cancelled"))
            ) {
              logEntries.push({
                id: "synth_cancelled",
                timestamp: formatAuditStamp(selected.cancellationInfo?.cancelledAt || selected.updatedAt),
                actorName: selected.cancellationInfo?.cancelledBy || studio?.ownerName || "Studio Owner",
                actorRole: "Owner",
                action: "Order Cancelled",
                details: `Order cancelled — Reason: "${selected.cancellationInfo?.cancellationReason || "Cancelled by studio owner"}"`,
              });
            }

            // Sort chronologically from earliest to latest so the timeline unfolds cleanly
            const sortedLogs = [...logEntries].sort((a, b) => {
              const cmp = a.timestamp.localeCompare(b.timestamp);
              if (cmp !== 0) return cmp;
              if (a.action === "Order Registered") return -1;
              if (b.action === "Order Registered") return 1;
              if (a.action === "Advance Payment Recorded") return -1;
              if (b.action === "Advance Payment Recorded") return 1;
              return 0;
            });

            return (
              <div className="mt-3 rounded-2xl border border-border-default bg-[#F8FAFC] p-3.5 space-y-3 shadow-xs animate-in fade-in duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-border-default">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-text-primary">Order Audit Trail and Activity Logs</span>
                    <span className="text-[10px] text-text-tertiary">#{selected.orderNumber}</span>
                  </div>
                  <span className="text-[10px] text-text-secondary bg-white px-2 py-0.5 rounded-lg border border-border-default font-semibold shadow-2xs">
                    {sortedLogs.length} events logged
                  </span>
                </div>

                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {sortedLogs.length > 0 ? (
                    sortedLogs.map((log, index) => (
                      <div
                        key={log.id || index}
                        className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white border border-border-default/80 hover:border-slate-300 transition shadow-2xs"
                      >
                        {/* Timestamp */}
                        <div className="w-24 shrink-0 pt-0.5">
                          <span className="font-mono text-[10px] font-bold text-slate-700 block">
                            {log.timestamp.split(" ")[0]}
                          </span>
                          <span className="font-mono text-[10px] text-slate-400 block">
                            {log.timestamp.split(" ")[1] || "00:00"}
                          </span>
                        </div>

                        {/* Action, Actor and Details (No emoji/character icons for clean retro aesthetic) */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-xs font-bold text-slate-900">
                              {log.action}
                            </span>
                            <span className="text-[10px] text-slate-400">·</span>
                            <span className="text-[11px] font-medium text-slate-600">
                              {log.actorName}
                            </span>
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase tracking-wider shrink-0 ${
                                log.actorRole === "Owner"
                                  ? "bg-amber-400/10 text-amber-700 border border-amber-400/30"
                                  : log.actorRole === "System"
                                  ? "bg-purple-400/10 text-purple-700 border border-purple-400/30"
                                  : log.actorRole === "Member"
                                  ? "bg-blue-400/10 text-blue-700 border border-blue-400/30"
                                  : "bg-emerald-400/10 text-emerald-700 border border-emerald-400/30"
                              }`}
                            >
                              {log.actorRole}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 leading-snug mt-0.5">
                            {log.details}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-xs text-text-tertiary">
                      No audit history entries recorded for this order yet.
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </aside>
      )}

      {/* New Order Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-lg max-h-[90vh] flex flex-col rounded-3xl bg-white shadow-2xl border border-border-default animate-in fade-in zoom-in duration-150 my-auto">
            {/* Modal Header (Pinned at Top) */}
            <div className="flex items-center justify-between p-6 pb-4 border-b border-border-default shrink-0">
              <div>
                <div className="badge-brand-blue mb-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-blue-primary" />
                  New Confirmed Order
                </div>
                <h3 className="text-lg font-bold text-text-primary">Register Confirmed Order</h3>
                <p className="text-xs text-text-secondary">Begins automated 3-state production workflow</p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-text-tertiary hover:text-text-primary p-1.5 rounded-lg hover:bg-surface-app transition"
                aria-label="Close dialog"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleCreateOrder} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="overflow-y-auto p-6 space-y-4 flex-1">
                {formError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-600 font-medium">
                    {formError}
                  </div>
                )}

                {/* Customer Full Name with Autocomplete */}
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-text-primary">Customer Full Name *</label>
                    {studioCustomers.length > 0 && (
                      <span className="text-[10px] text-text-tertiary">
                        {studioCustomers.length} registered in CRM
                      </span>
                    )}
                  </div>
                  <div className="relative mt-1">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh and Ananya (Search existing or type new)"
                      value={newOrderForm.customerName}
                      onFocus={() => setShowCustomerDropdown(true)}
                      onChange={(e) => {
                        setNewOrderForm({ ...newOrderForm, customerName: e.target.value });
                        setShowCustomerDropdown(true);
                      }}
                      className="w-full rounded-xl border border-border-default px-3.5 py-2 pr-10 text-xs outline-none focus:border-brand-blue-primary focus:ring-1 focus:ring-brand-blue-primary"
                    />
                    {studioCustomers.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowCustomerDropdown((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-brand-blue-primary p-0.5"
                        tabIndex={-1}
                        title="Toggle customer list"
                      >
                        <svg className={`w-3.5 h-3.5 transition-transform ${showCustomerDropdown ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {newOrderForm.customerName.trim().length > 0 &&
                    (newOrderForm.customerName.match(/[a-zA-Z]/g) || []).length < 3 && (
                      <p className="mt-1 text-[11px] font-medium text-rose-600">
                        Name must have at least 3 letters.
                      </p>
                    )}

                  {/* Customer Autocomplete Dropdown */}
                  {showCustomerDropdown && matchingCustomers.length > 0 && (
                    <div className="absolute top-full left-0 right-0 z-30 mt-1 rounded-2xl border border-border-default bg-white p-2 shadow-xl animate-in fade-in zoom-in-95 duration-100 max-h-48 overflow-y-auto">
                      <div className="flex items-center justify-between px-2 pb-1 border-b border-border-default text-[10px] font-bold text-text-tertiary uppercase tracking-wider">
                        <span>Select Existing Client or Type New</span>
                        <button
                          type="button"
                          onClick={() => setShowCustomerDropdown(false)}
                          className="text-brand-blue-primary hover:underline lowercase font-semibold"
                        >
                          close
                        </button>
                      </div>
                      <div className="space-y-0.5 pt-1">
                        {matchingCustomers.map((c) => (
                          <div
                            key={c.id}
                            onClick={() => selectExistingCustomer(c)}
                            className="flex items-center justify-between px-2.5 py-2 rounded-xl text-xs hover:bg-brand-blue-50/80 cursor-pointer transition text-left"
                          >
                            <div className="min-w-0">
                              <p className="font-bold text-text-primary truncate">{c.name}</p>
                              <p className="text-[10px] text-text-secondary truncate">
                                {c.phone || "No phone"} {c.email ? `· ${c.email}` : ""}
                              </p>
                            </div>
                            <span className="text-[10px] font-bold text-brand-blue-primary bg-brand-blue-100/60 px-2 py-0.5 rounded-full shrink-0 ml-2">
                              CRM Link
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-text-primary">
                      Phone Number <span className="font-normal text-text-tertiary">(Optional)</span>
                    </label>
                    <div className="mt-1 flex gap-1.5">
                      <input
                        type="text"
                        placeholder="+91"
                        value={newOrderForm.countryCode}
                        onChange={(e) => setNewOrderForm({ ...newOrderForm, countryCode: e.target.value })}
                        className="w-20 rounded-xl border border-border-default bg-surface-app px-2 py-2 text-xs font-semibold text-text-primary text-center outline-none focus:border-brand-blue-primary"
                        title="Country Code (e.g. +91, +1, +44)"
                      />
                      <input
                        type="tel"
                        placeholder="98765 43210"
                        value={newOrderForm.customerPhone}
                        onChange={(e) => setNewOrderForm({ ...newOrderForm, customerPhone: e.target.value })}
                        className="flex-1 min-w-0 rounded-xl border border-border-default px-3.5 py-2 text-xs outline-none focus:border-brand-blue-primary focus:ring-1 focus:ring-brand-blue-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-text-primary">
                      Customer Email <span className="font-normal text-text-tertiary">(Optional)</span>
                    </label>
                    <input
                      type="email"
                      placeholder="client@gmail.com"
                      value={newOrderForm.customerEmail}
                      onChange={(e) => setNewOrderForm({ ...newOrderForm, customerEmail: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-border-default px-3.5 py-2 text-xs outline-none focus:border-brand-blue-primary focus:ring-1 focus:ring-brand-blue-primary"
                    />
                  </div>
                </div>

                {/* Non-Blocking Duplicate Match Notice */}
                {duplicateCustomerWarning && (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50/90 p-3 text-xs text-amber-950 flex items-start gap-2.5 animate-in fade-in duration-150">
                    <span className="text-base leading-none shrink-0 mt-0.5">ℹ️</span>
                    <div className="space-y-0.5 min-w-0">
                      <p className="font-bold">
                        Existing CRM Customer Match: <span className="underline">{duplicateCustomerWarning.name}</span>
                        {duplicateCustomerWarning.phone ? ` (${duplicateCustomerWarning.phone})` : ""}
                      </p>
                      <p className="text-[11px] text-amber-800 leading-relaxed">
                        This order will be automatically linked to their existing customer profile and lifetime bookings in CRM. You can continue without changing the name.
                      </p>
                    </div>
                  </div>
                )}

                {/* Dynamic Automated Customer Notifications (displayed only when phone or email is provided) */}
                {(Boolean(newOrderForm.customerPhone.trim()) || Boolean(newOrderForm.customerEmail.trim())) && (
                  <div className="rounded-2xl border border-blue-200/80 bg-blue-50/50 p-3.5 space-y-2.5 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-950">
                        Automated Client Notifications
                      </span>
                    </div>

                    <div className="space-y-2 pt-0.5">
                      {Boolean(newOrderForm.customerPhone.trim()) && (
                        <label className="flex items-center gap-2.5 select-none cursor-pointer">
                          <input
                            type="checkbox"
                            checked={newOrderForm.notifyWhatsApp}
                            onChange={(e) =>
                              setNewOrderForm({ ...newOrderForm, notifyWhatsApp: e.target.checked })
                            }
                            className="h-3.5 w-3.5 rounded border-border-default text-brand-blue-primary focus:ring-brand-blue-primary"
                          />
                          <span className="text-xs font-medium text-text-primary">
                            Send automated order updates via <strong>WhatsApp</strong>
                          </span>
                        </label>
                      )}

                      {Boolean(newOrderForm.customerEmail.trim()) && (
                        <label className="flex items-center gap-2.5 select-none cursor-pointer">
                          <input
                            type="checkbox"
                            checked={newOrderForm.notifyEmail}
                            onChange={(e) =>
                              setNewOrderForm({ ...newOrderForm, notifyEmail: e.target.checked })
                            }
                            className="h-3.5 w-3.5 rounded border-border-default text-brand-blue-primary focus:ring-brand-blue-primary"
                          />
                          <span className="text-xs font-medium text-text-primary">
                            Send automated order updates via <strong>Email</strong>
                          </span>
                        </label>
                      )}
                    </div>
                  </div>
                )}

                {/* Event Type Dropdown and Custom Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-text-primary">Event Type *</label>
                    <select
                      value={newOrderForm.eventType}
                      onChange={(e) => setNewOrderForm({ ...newOrderForm, eventType: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-border-default bg-white px-3.5 py-2 text-xs font-medium text-text-primary outline-none focus:border-brand-blue-primary focus:ring-1 focus:ring-brand-blue-primary"
                    >
                      {PRESET_EVENT_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    {newOrderForm.eventType === "Other" && (
                      <input
                        type="text"
                        placeholder="Specify event type (Optional)"
                        value={newOrderForm.customEventType}
                        onChange={(e) => setNewOrderForm({ ...newOrderForm, customEventType: e.target.value })}
                        className="mt-2 w-full rounded-xl border border-border-default px-3 py-1.5 text-xs outline-none focus:border-brand-blue-primary"
                      />
                    )}
                  </div>

                  <div>
                    <label htmlFor="register-order-event-date" className="block text-xs font-bold text-text-primary cursor-pointer">
                      Event Date *
                    </label>
                    <input
                      id="register-order-event-date"
                      type="date"
                      required
                      value={newOrderForm.eventDate}
                      onChange={(e) => setNewOrderForm({ ...newOrderForm, eventDate: e.target.value })}
                      onClick={(e) => {
                        try {
                          e.currentTarget.showPicker?.();
                        } catch {}
                      }}
                      className="mt-1 w-full rounded-xl border border-border-default px-3.5 py-2 text-xs outline-none focus:border-brand-blue-primary focus:ring-1 focus:ring-brand-blue-primary cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-primary">
                    Event Location <span className="font-normal text-text-tertiary">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Chennai, Bangalore"
                    value={newOrderForm.eventLocation}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, eventLocation: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-border-default px-3.5 py-2 text-xs outline-none focus:border-brand-blue-primary focus:ring-1 focus:ring-brand-blue-primary"
                  />
                </div>

                {/* Studio Services and Deliverables Dropdown with Multi-Select */}
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-text-primary">
                      Studio Services and Deliverables *
                    </label>
                    <span className="text-[10px] font-semibold text-text-tertiary">
                      {newOrderForm.services.length} Selected
                    </span>
                  </div>

                  {/* Combobox Input Field Trigger */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Select or type custom service and press Enter..."
                      value={newOrderForm.customServiceInput}
                      onChange={(e) => {
                        setNewOrderForm({ ...newOrderForm, customServiceInput: e.target.value });
                        if (!showServicesDropdown) setShowServicesDropdown(true);
                      }}
                      onFocus={() => setShowServicesDropdown(true)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const custom = newOrderForm.customServiceInput.trim();
                          if (custom && !newOrderForm.services.includes(custom)) {
                            setNewOrderForm({
                              ...newOrderForm,
                              services: [...newOrderForm.services, custom],
                              customServiceInput: "",
                            });
                          }
                        }
                      }}
                      className="w-full rounded-xl border border-border-default px-3.5 py-2 pr-10 text-xs outline-none focus:border-brand-blue-primary focus:ring-1 focus:ring-brand-blue-primary"
                    />
                    <div 
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-text-tertiary hover:text-brand-blue-primary"
                      onClick={() => setShowServicesDropdown((prev) => !prev)}
                    >
                      <svg
                        className={`w-4 h-4 transition-transform ${showServicesDropdown ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>

                    {/* Dropdown Options Popup */}
                    {showServicesDropdown && (
                      <div className="absolute top-full z-20 left-0 right-0 mt-1.5 rounded-2xl border border-border-default bg-white shadow-xl p-2.5 space-y-1.5 animate-in fade-in zoom-in-95 duration-100">
                        <div className="flex items-center justify-between px-2 pb-1 border-b border-border-default text-[10px] font-bold text-text-tertiary uppercase tracking-wider">
                          <span>Select Services ({newOrderForm.services.length} selected)</span>
                          <button
                            type="button"
                            onClick={() => setShowServicesDropdown(false)}
                            className="text-brand-blue-primary hover:underline lowercase font-semibold"
                          >
                            done
                          </button>
                        </div>

                        <div className="max-h-52 overflow-y-auto space-y-0.5 pr-1">
                          {PRESET_STUDIO_SERVICES
                            .filter((svc) => svc.toLowerCase().includes(newOrderForm.customServiceInput.toLowerCase()))
                            .map((svc) => {
                            const isSvcSelected = newOrderForm.services.includes(svc);
                            return (
                              <label
                                key={svc}
                                className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition select-none ${
                                  isSvcSelected
                                    ? "bg-brand-blue-50/80 text-brand-blue-primary"
                                    : "text-text-primary hover:bg-surface-app"
                                }`}
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <input
                                    type="checkbox"
                                    checked={isSvcSelected}
                                    onChange={() => toggleService(svc)}
                                    className="h-3.5 w-3.5 rounded border-border-default text-brand-blue-primary focus:ring-brand-blue-primary shrink-0"
                                  />
                                  <span className="truncate">{svc}</span>
                                </div>
                                {isSvcSelected && (
                                  <span className="text-[10px] font-bold text-brand-blue-primary shrink-0 ml-2">Selected</span>
                                )}
                              </label>
                            );
                          })}

                          {/* Custom Services Added by User */}
                          {newOrderForm.services
                            .filter((s) => !PRESET_STUDIO_SERVICES.includes(s as any))
                            .map((customSvc) => (
                              <label
                                key={customSvc}
                                className="flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-brand-blue-50/80 text-brand-blue-primary cursor-pointer transition select-none"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <input
                                    type="checkbox"
                                    checked={true}
                                    onChange={() => toggleService(customSvc)}
                                    className="h-3.5 w-3.5 rounded border-border-default text-brand-blue-primary focus:ring-brand-blue-primary shrink-0"
                                  />
                                  <span className="truncate">{customSvc}</span>
                                </div>
                                <span className="text-[10px] font-bold text-brand-blue-primary shrink-0 ml-2">Custom</span>
                              </label>
                            ))}
                            
                          {/* Prompt to press enter if typing custom that doesn't match presets */}
                          {newOrderForm.customServiceInput.trim() && 
                           !PRESET_STUDIO_SERVICES.some(s => s.toLowerCase() === newOrderForm.customServiceInput.trim().toLowerCase()) &&
                           !newOrderForm.services.includes(newOrderForm.customServiceInput.trim()) && (
                            <div className="px-2.5 py-1.5 text-[10px] font-medium text-text-tertiary italic">
                              Press Enter to add &quot;{newOrderForm.customServiceInput.trim()}&quot;
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Selected Options Displayed Below the Input Field */}
                  {newOrderForm.services.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {newOrderForm.services.map((svc) => (
                        <span
                          key={svc}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-blue-50 px-2.5 py-1 text-xs font-semibold text-brand-blue-primary border border-brand-blue-soft"
                        >
                          <span>{svc}</span>
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleService(svc);
                            }}
                            className="text-xs font-bold text-brand-blue-primary hover:text-red-500 cursor-pointer ml-0.5 leading-none"
                            title={`Remove ${svc}`}
                          >
                            ×
                          </span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {/* Pricing and Advance with Validation */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-text-primary">Confirmed Total Price (₹) *</label>
                    <input
                      type="number"
                      min="0"
                      required
                      placeholder="e.g. 75,000"
                      value={newOrderForm.finalConfirmedPrice ?? ""}
                      onChange={(e) =>
                        setNewOrderForm({
                          ...newOrderForm,
                          finalConfirmedPrice: e.target.value === "" ? ("" as unknown as number) : Number(e.target.value),
                        })
                      }
                      className="mt-1 w-full rounded-xl border border-border-default px-3.5 py-2 text-xs outline-none focus:border-brand-blue-primary focus:ring-1 focus:ring-brand-blue-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-primary">Advance Received (₹) *</label>
                    <input
                      type="number"
                      min="0"
                      required
                      placeholder="e.g. 25,000"
                      value={newOrderForm.advanceAmount ?? ""}
                      onChange={(e) =>
                        setNewOrderForm({
                          ...newOrderForm,
                          advanceAmount: e.target.value === "" ? ("" as unknown as number) : Number(e.target.value),
                        })
                      }
                      className={`mt-1 w-full rounded-xl border px-3.5 py-2 text-xs outline-none focus:ring-1 ${
                        Number(newOrderForm.advanceAmount) > Number(newOrderForm.finalConfirmedPrice) && Number(newOrderForm.finalConfirmedPrice) > 0
                          ? "border-status-error bg-red-50/50 text-status-error focus:ring-red-400"
                          : "border-border-default focus:border-brand-blue-primary focus:ring-brand-blue-primary"
                      }`}
                    />
                  </div>
                  {Number(newOrderForm.advanceAmount) > Number(newOrderForm.finalConfirmedPrice) && Number(newOrderForm.finalConfirmedPrice) > 0 && (
                    <div className="col-span-2 rounded-xl border border-red-200 bg-red-50 p-2.5 text-[11px] font-semibold text-status-error">
                      Advance amount cannot exceed the confirmed total price.
                    </div>
                  )}
                </div>

                {/* Payment Summary Breakdown */}
                <div className="rounded-2xl border border-border-default bg-surface-app/70 p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text-primary uppercase tracking-wider">
                      Payment Summary
                    </span>
                    <span className="text-[10px] text-text-tertiary">
                      Auto-calculated breakdown
                    </span>
                  </div>

                  <div className="space-y-1.5 pt-1 border-t border-border-divider text-xs">
                    <div className="flex items-center justify-between text-text-secondary">
                      <span>Confirmed Total Price</span>
                      <span className="font-bold text-text-primary">
                        ₹{(Math.max(0, Number(newOrderForm.finalConfirmedPrice) || 0)).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-text-secondary">
                      <span>Advance Received</span>
                      <span className="font-bold text-brand-blue-primary">
                        ₹{(Math.max(0, Number(newOrderForm.advanceAmount) || 0)).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-border-divider font-bold">
                      <span className="text-text-primary">Remaining Amount</span>
                      <span
                        className={
                          Math.max(0, (Number(newOrderForm.finalConfirmedPrice) || 0) - (Number(newOrderForm.advanceAmount) || 0)) > 0
                            ? "text-brand-orange-primary font-extrabold text-sm"
                            : "text-emerald-600 font-extrabold text-sm"
                        }
                      >
                        ₹{(Math.max(0, (Number(newOrderForm.finalConfirmedPrice) || 0) - (Number(newOrderForm.advanceAmount) || 0))).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 6-Digit Guest Access PIN and Tracking Passkey */}
                <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-950">
                      6-Digit Guest Access PIN
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setNewOrderForm({
                          ...newOrderForm,
                          passkeyPin: Math.floor(100000 + Math.random() * 900000).toString(),
                        })
                      }
                      className="text-[11px] font-bold text-brand-blue-primary hover:underline"
                    >
                      Regenerate PIN
                    </button>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    {newOrderForm.customerEmail.trim() ? (
                      <>
                        Order tracking link will be sent to <strong className="font-semibold text-amber-950">{newOrderForm.customerEmail.trim()}</strong>. Your customer can track with their email or access instantly as a guest using this 6-digit PIN.
                      </>
                    ) : (
                      <>
                        No customer email provided. Share this 6-digit PIN with your customer for guest order tracking.
                      </>
                    )}
                  </p>
                  <div className="pt-1">
                    <input
                      type="text"
                      maxLength={6}
                      value={newOrderForm.passkeyPin}
                      onChange={(e) =>
                        setNewOrderForm({ ...newOrderForm, passkeyPin: e.target.value.replace(/\D/g, "").slice(0, 6) })
                      }
                      className={`w-32 rounded-xl bg-white px-3.5 py-1.5 font-mono text-sm font-extrabold tracking-widest text-text-primary text-center outline-none transition ${
                        newOrderForm.passkeyPin.length !== 6
                          ? "border border-rose-400 focus:border-rose-500"
                          : "border border-amber-300 focus:border-brand-blue-primary focus:ring-1 focus:ring-brand-blue-primary"
                      }`}
                    />
                    {newOrderForm.passkeyPin.length !== 6 && (
                      <p className="mt-1 text-[11px] font-medium text-rose-600">PIN must be 6 digits.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Footer (Pinned at Bottom) */}
              <div className="p-4 sm:px-6 border-t border-border-default bg-surface-app/40 shrink-0 flex gap-3 justify-end rounded-b-3xl">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn-brand-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    (newOrderForm.customerName.match(/[a-zA-Z]/g) || []).length < 3 ||
                    newOrderForm.passkeyPin.length !== 6 ||
                    (Number(newOrderForm.advanceAmount) > Number(newOrderForm.finalConfirmedPrice) &&
                      Number(newOrderForm.finalConfirmedPrice) > 0)
                  }
                  className="btn-brand-blue disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Creating..." : "Confirm and Save Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* In-App Cancellation Dialog */}
      {cancelTargetOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-border-default animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-border-default">
              <div>
                <h3 className="text-base font-bold text-text-primary">Cancel Order</h3>
                <p className="text-xs text-text-secondary mt-0.5">
                  Order #{cancelTargetOrder.orderNumber} · {cancelTargetOrder.customer.name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCancelTargetOrder(null)}
                className="text-text-tertiary hover:text-text-primary p-1.5 rounded-lg hover:bg-surface-app transition"
                aria-label="Close dialog"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="py-4 space-y-3">
              <p className="text-xs text-text-secondary leading-relaxed">
                Cancelling this order will mark it as Cancelled in the production pipeline and stop automated notifications.
              </p>

              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">
                  Cancellation Reason <span className="font-normal text-text-tertiary">(Optional)</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Client postponed indefinitely or requested cancellation"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full rounded-xl border border-border-default p-3 text-xs outline-none focus:border-brand-blue-primary focus:ring-1 focus:ring-brand-blue-primary"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-default">
              <button
                type="button"
                onClick={() => setCancelTargetOrder(null)}
                className="btn-brand-outline"
                disabled={isCancelling}
              >
                Keep Order
              </button>
              <button
                type="button"
                onClick={handleConfirmCancelOrder}
                disabled={isCancelling}
                className="rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white hover:bg-amber-700 disabled:opacity-50 transition"
              >
                {isCancelling ? "Cancelling..." : "Confirm Cancellation"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* In-App Soft-Delete Dialog */}
      {deleteTargetOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-border-default animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-border-default">
              <div>
                <h3 className="text-base font-bold text-status-error">Delete Order</h3>
                <p className="text-xs text-text-secondary mt-0.5">
                  Order #{deleteTargetOrder.orderNumber} · {deleteTargetOrder.customer.name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDeleteTargetOrder(null)}
                className="text-text-tertiary hover:text-text-primary p-1.5 rounded-lg hover:bg-surface-app transition"
                aria-label="Close dialog"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="py-4 space-y-2">
              <p className="text-xs text-text-primary font-semibold">
                Are you sure you want to soft-delete this order?
              </p>
              <p className="text-xs text-text-secondary leading-relaxed">
                This order will be removed from your active dashboard. It can be fully recovered from the studio archives within 14 days before permanent purge.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-default">
              <button
                type="button"
                onClick={() => setDeleteTargetOrder(null)}
                className="btn-brand-outline"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteOrder}
                disabled={isDeleting}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-50 transition"
              >
                {isDeleting ? "Deleting..." : "Delete Order"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Studio ERP Member Wizard Dialog */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-border-default animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-border-default">
              <div>
                <h3 className="text-base font-bold text-text-primary">Add Studio Member (ERP)</h3>
                <p className="text-xs text-text-secondary mt-0.5">
                  Register member in studio ERP and assign to task
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowAddMemberModal(false);
                  setNewMemberError(null);
                  setTargetAssignContext(null);
                }}
                className="text-text-tertiary hover:text-text-primary p-1.5 rounded-lg hover:bg-surface-app transition cursor-pointer"
                aria-label="Close dialog"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {newMemberError && (
              <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                {newMemberError}
              </div>
            )}

            <div className="py-4 space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-text-secondary mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={newMemberForm.name}
                  onChange={(e) => setNewMemberForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-xl border border-border-default px-3 py-2 text-xs outline-none focus:border-brand-blue-primary focus:ring-1 focus:ring-brand-blue-primary"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-text-secondary mb-1">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  placeholder="rahul@example.com"
                  value={newMemberForm.email}
                  onChange={(e) =>
                    setNewMemberForm((prev) => ({
                      ...prev,
                      email: e.target.value,
                      claimCode: e.target.value
                        ? ""
                        : prev.claimCode || Math.floor(100000 + Math.random() * 900000).toString(),
                    }))
                  }
                  className="w-full rounded-xl border border-border-default px-3 py-2 text-xs outline-none focus:border-brand-blue-primary focus:ring-1 focus:ring-brand-blue-primary"
                />
                <p className="mt-1 text-[10px] text-text-tertiary">
                  {newMemberForm.email.trim()
                    ? "Member will authenticate directly via Google email."
                    : "Leave blank to use 6-digit PIN below for instant login."}
                </p>
              </div>

              {!newMemberForm.email.trim() && (
                <div className="rounded-xl border border-brand-blue-soft/60 bg-blue-50/30 p-3 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-brand-blue-primary block">
                      6-Digit Guest Access PIN *
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setNewMemberForm((prev) => ({
                          ...prev,
                          claimCode: Math.floor(100000 + Math.random() * 900000).toString(),
                        }))
                      }
                      className="text-[10px] font-bold text-brand-blue-primary hover:underline cursor-pointer"
                    >
                      Regenerate PIN
                    </button>
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="e.g. 543210"
                    value={newMemberForm.claimCode}
                    onChange={(e) =>
                      setNewMemberForm((prev) => ({
                        ...prev,
                        claimCode: e.target.value.replace(/\D/g, "").slice(0, 6),
                      }))
                    }
                    className="w-full rounded-xl border border-border-default bg-white px-3 py-2 text-xs font-mono font-bold tracking-wider outline-none focus:border-brand-blue-primary focus:ring-1 focus:ring-brand-blue-primary"
                  />
                  <p className="text-[10px] text-text-tertiary">
                    Crew member uses this PIN to log in without a Google email.
                  </p>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-text-secondary mb-1">
                  Phone (Optional)
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={newMemberForm.phone}
                  onChange={(e) => setNewMemberForm((prev) => ({ ...prev, phone: e.target.value }))}
                  className="w-full rounded-xl border border-border-default px-3 py-2 text-xs outline-none focus:border-brand-blue-primary focus:ring-1 focus:ring-brand-blue-primary"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-text-secondary mb-1.5">
                  Certified Skills *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "PHOTOGRAPHY", label: "Photographer" },
                    { id: "VIDEOGRAPHY", label: "Videographer" },
                    { id: "PHOTO_EDITING", label: "Photo Editor" },
                    { id: "ALBUM_DESIGN", label: "Album Designer" },
                  ].map((skill) => (
                    <label
                      key={skill.id}
                      className={`flex cursor-pointer items-center gap-2 rounded-xl border p-2 text-[11px] font-semibold transition ${
                        newMemberForm.skills.includes(skill.id)
                          ? "border-brand-blue-primary bg-blue-50/50 text-brand-blue-primary"
                          : "border-border-default text-text-secondary hover:bg-surface-app"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={newMemberForm.skills.includes(skill.id)}
                        onChange={() =>
                          setNewMemberForm((prev) => {
                            const exists = prev.skills.includes(skill.id);
                            const next = exists
                              ? prev.skills.filter((s) => s !== skill.id)
                              : [...prev.skills, skill.id];
                            return { ...prev, skills: next };
                          })
                        }
                        className="rounded text-brand-blue-primary"
                      />
                      <span>{skill.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-default">
              <button
                type="button"
                onClick={() => {
                  setShowAddMemberModal(false);
                  setNewMemberError(null);
                  setTargetAssignContext(null);
                }}
                className="btn-brand-outline cursor-pointer"
                disabled={isCreatingMember}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateAndAssignMember}
                disabled={isCreatingMember || !newMemberForm.name.trim()}
                className="rounded-xl bg-brand-blue-primary px-4 py-2 text-xs font-bold text-white hover:bg-sky-600 disabled:opacity-50 transition cursor-pointer"
              >
                {isCreatingMember ? "Registering..." : "Register & Assign"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
