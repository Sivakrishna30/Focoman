import 'server-only';
import { getOrdersByStudio, getStudioBySlug, getMembersByStudio } from '@focoman/db';
import type { Order, Studio, StudioMember, ResourceAssignment } from '@focoman/types';

/**
 * WhatsApp Premium Operational Layer & Bot Operations Engine
 * 
 * Sources of truth:
 * - Focoman Product Discovery Document (WhatsApp as operational convenience layer)
 * - Pricing & Entitlements Specification (WhatsApp Operations Bot restricted to STUDIO_OWNER)
 */

export interface WhatsAppTemplateData {
  studioName: string;
  customerName?: string;
  orderNumber?: string;
  eventDate?: string;
  eventType?: string;
  venue?: string;
  balanceDue?: number;
  trackingPasskey?: string;
  passkeyPin?: string;
  trackingUrl?: string;
  crewName?: string;
  taskTitle?: string;
  customNote?: string;
}

export type WhatsAppTemplateId =
  | 'upcoming_3day_reminder'
  | 'post_event_start'
  | 'raw_photos_ready'
  | 'customer_selection_done'
  | 'album_review_ready'
  | 'ready_for_delivery'
  | 'booking_confirmation'
  | 'crew_assignment_alert'
  | 'crew_task_assigned';

export interface WhatsAppTemplateDefinition {
  id: WhatsAppTemplateId;
  title: string;
  audience: 'OWNER' | 'MEMBER' | 'CUSTOMER';
  description: string;
  generateText: (data: WhatsAppTemplateData) => string;
}

// ============================================================================
// 1. TEMPLATE REGISTRY
// ============================================================================

export const WHATSAPP_TEMPLATES: Record<WhatsAppTemplateId, WhatsAppTemplateDefinition> = {
  booking_confirmation: {
    id: 'booking_confirmation',
    title: 'Booking Confirmation & Private Tracking Passkey',
    audience: 'CUSTOMER',
    description: 'Sent to the customer when an order is confirmed, with their private tracking portal link.',
    generateText: (d) =>
      `📸 *${d.studioName}* — Booking Confirmed!\n\n` +
      `Hello ${d.customerName || 'Valued Client'},\n` +
      `Your booking for *${d.eventType || 'Event'}* on *${d.eventDate || 'Scheduled Date'}* has been confirmed.\n\n` +
      `📌 *Order #:* ${d.orderNumber || 'Pending'}\n` +
      `🔑 *Tracking PIN:* ${d.passkeyPin || 'Available in portal'}\n` +
      `🔗 *Live Order Tracking:* ${d.trackingUrl || `https://focoman.web.app/track/${d.trackingPasskey}`}\n\n` +
      `Track shoot milestones, photo proofing, and album progress live anytime. Thank you!`,
  },

  upcoming_3day_reminder: {
    id: 'upcoming_3day_reminder',
    title: 'Upcoming Shoot 3-Day Call Reminder',
    audience: 'OWNER',
    description: 'Alert sent 3 days before event date for equipment pre-flight and crew check.',
    generateText: (d) =>
      `⏰ *${d.studioName} Operational Alert*\n\n` +
      `Upcoming shoot in 3 days: *${d.eventType || 'Event'}* for *${d.customerName || 'Client'}*.\n` +
      `📅 *Date:* ${d.eventDate || 'TBD'}\n` +
      `📍 *Venue:* ${d.venue || 'Confirmed Venue'}\n` +
      `📌 *Order #:* ${d.orderNumber || 'N/A'}\n\n` +
      `Please ensure battery packs, memory cards, and assigned crew call-times are verified.`,
  },

  post_event_start: {
    id: 'post_event_start',
    title: 'Post-Event Workflow Started',
    audience: 'OWNER',
    description: 'Fired when event date passes and the order enters post-production.',
    generateText: (d) =>
      `🎬 *${d.studioName} Production Update*\n\n` +
      `Event shoot for *${d.customerName || 'Client'}* (*${d.orderNumber}*) is complete.\n` +
      `Order has automatically progressed to *Post-Event Production*.\n` +
      `Next milestone: Ingest memory cards and upload RAW gallery for customer selection.`,
  },

  raw_photos_ready: {
    id: 'raw_photos_ready',
    title: 'RAW Photos Ready for Customer Proofing',
    audience: 'CUSTOMER',
    description: 'Sent to customer with link to select favorites for photo editing and album design.',
    generateText: (d) =>
      `✨ *${d.studioName}* — Your Photos Are Ready for Selection!\n\n` +
      `Hello ${d.customerName || 'Client'},\n` +
      `Your event photos are now available in your private portal.\n` +
      `Please review and mark your favorite shots for final retouching & album design:\n\n` +
      `🔗 *Proofing Gallery:* ${d.trackingUrl || `https://focoman.web.app/track/${d.trackingPasskey}`}\n\n` +
      `Let us know once you complete selection so editing can begin immediately!`,
  },

  customer_selection_done: {
    id: 'customer_selection_done',
    title: 'Customer Photo Selection Completed',
    audience: 'OWNER',
    description: 'Alerts studio owner/editor that the client has finalized proofing selections.',
    generateText: (d) =>
      `✅ *${d.studioName} Milestone Alert*\n\n` +
      `*${d.customerName || 'Client'}* has completed photo selection for Order *#${d.orderNumber}*.\n` +
      `Retouching and album layout stream is now unlocked. Assigned editors have been queued.`,
  },

  album_review_ready: {
    id: 'album_review_ready',
    title: 'Album Layout Ready for Client Approval',
    audience: 'CUSTOMER',
    description: 'Sent to customer to preview the draft album layout before final print.',
    generateText: (d) =>
      `📖 *${d.studioName}* — Album Design Draft Ready!\n\n` +
      `Hello ${d.customerName || 'Client'},\n` +
      `Your photobook album layout is ready for your review.\n` +
      `Please review page spreads and submit comments or final approval:\n\n` +
      `🔗 *Album Review Portal:* ${d.trackingUrl || `https://focoman.web.app/track/${d.trackingPasskey}`}\n\n` +
      `Once approved, your album will be sent for high-grade archival printing.`,
  },

  ready_for_delivery: {
    id: 'ready_for_delivery',
    title: 'Order Ready for Delivery / Studio Pickup',
    audience: 'CUSTOMER',
    description: 'Sent when physical photobook and final cloud deliverables are complete.',
    generateText: (d) =>
      `🎉 *${d.studioName}* — Your Order is Ready for Delivery!\n\n` +
      `Hello ${d.customerName || 'Client'},\n` +
      `All photos, cinematic video, and album prints for your *${d.eventType || 'Event'}* are complete and packed!\n\n` +
      `📌 *Order #:* ${d.orderNumber}\n` +
      (d.balanceDue && d.balanceDue > 0
        ? `💰 *Pending Balance:* ₹${d.balanceDue.toLocaleString('en-IN')}\n\n`
        : `💰 *Payment Status:* Paid in Full ✅\n\n`) +
      `Please coordinate studio pickup or courier delivery details with us. Thank you for choosing us!`,
  },

  crew_assignment_alert: {
    id: 'crew_assignment_alert',
    title: 'Crew Assignment & Call-Time Alert',
    audience: 'MEMBER',
    description: 'Sent to studio team member with event date, venue, and role details.',
    generateText: (d) =>
      `📋 *${d.studioName} Crew Call-Time*\n\n` +
      `Hi ${d.crewName || 'Team Member'},\n` +
      `You have been assigned to shoot *${d.eventType || 'Event'}*.\n` +
      `📅 *Date:* ${d.eventDate || 'Scheduled Date'}\n` +
      `📍 *Venue:* ${d.venue || 'Confirmed Venue'}\n` +
      `📌 *Role/Service:* ${d.taskTitle || 'Photography & Cinematography'}\n\n` +
      `Please confirm your availability in your studio member dashboard.`,
  },

  crew_task_assigned: {
    id: 'crew_task_assigned',
    title: 'Production Task Assigned',
    audience: 'MEMBER',
    description: 'Sent when an editing, grading, or album design task is assigned to a crew member.',
    generateText: (d) =>
      `⚡ *${d.studioName} Task Assignment*\n\n` +
      `Hi ${d.crewName || 'Editor'},\n` +
      `New production task assigned: *${d.taskTitle || 'Editing'}* for Order *#${d.orderNumber}*.\n` +
      `Client: ${d.customerName || 'Studio Client'}\n\n` +
      `Please check your studio dashboard for raw source links and asset deadlines.`,
  },
};

// ============================================================================
// 2. HELPER: ONE-CLICK WHATSAPP CLICK-TO-CHAT URL
// ============================================================================

/**
 * Creates a standard universal WhatsApp web/app redirect URL
 * Works out-of-the-box on desktop and mobile without paid API tokens.
 */
export function generateWhatsAppClickToChatUrl(phone: string, text: string): string {
  // Strip all non-numeric characters
  const cleanPhone = phone.replace(/\D/g, '');
  const encodedText = encodeURIComponent(text);
  
  // Ensure country code (defaults to 91 for India if 10 digits provided)
  const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  
  return `https://wa.me/${formattedPhone}?text=${encodedText}`;
}

// ============================================================================
// 3. WHATSAPP OPERATIONS BOT COMMAND ENGINE
// ============================================================================

export interface BotCommandResponse {
  success: boolean;
  message: string;
  commandRecognized: string;
}

/**
 * Parses and executes text commands sent by Studio Owners to the Operations Bot.
 * Restricted strictly to Studio Owners per pricing & entitlements specification.
 */
export async function processWhatsAppBotMessage(
  studioSlug: string,
  incomingText: string,
  _senderPhone?: string
): Promise<BotCommandResponse> {
  const studio = await getStudioBySlug(studioSlug);
  if (!studio) {
    return {
      success: false,
      commandRecognized: 'UNKNOWN',
      message: `Studio [${studioSlug}] was not found in Focoman.`,
    };
  }

  const raw = incomingText.trim();
  const parts = raw.split(/\s+/);
  const command = (parts[0] || '').toUpperCase();
  const arg = parts.slice(1).join(' ').trim();

  // Helper date formatter in Indian Standard Time (Asia/Kolkata)
  const getTodayIst = () => {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date());
  };

  const todayStr = getTodayIst();

  switch (command) {
    case 'HELP':
    case 'MENU':
    case '?':
      return {
        success: true,
        commandRecognized: 'HELP',
        message:
          `🤖 *${studio.name} — WhatsApp Operations Bot*\n\n` +
          `Available Commands for Studio Owner:\n` +
          `• *TODAY* — View shoots & tasks scheduled for today\n` +
          `• *SHOOTS* — Upcoming events in the next 14 days\n` +
          `• *ORDERS* — Active in-progress orders summary\n` +
          `• *STATUS <Order#>* — Quick lookup by order number or PIN (e.g. \`STATUS 1002\`)\n` +
          `• *CREW* — Active team roster & assigned roles\n` +
          `• *HELP* — Show this command menu`,
      };

    case 'TODAY': {
      const orders = await getOrdersByStudio(studio.id);
      const todaysOrders = orders.filter((o: Order) => o.eventDate === todayStr);

      if (todaysOrders.length === 0) {
        return {
          success: true,
          commandRecognized: 'TODAY',
          message:
            `📅 *Today's Schedule (${todayStr})*\n\n` +
            `No event shoots scheduled for today for *${studio.name}*.\n` +
            `Check *SHOOTS* for upcoming events this week.`,
        };
      }

      const listText = todaysOrders
        .map(
          (o: Order, idx: number) =>
            `${idx + 1}. *${o.customer?.name || 'Client'}* (${o.orderNumber})\n` +
            `   • Type: ${o.eventType || 'Event'}\n` +
            `   • Venue: ${o.eventLocation || 'Confirmed Venue'}\n` +
            `   • Crew: ${o.assignedResources?.map((c: ResourceAssignment) => c.memberName).join(', ') || 'Unassigned'}\n` +
            `   • Status: ${o.orderStatus}`
        )
        .join('\n\n');

      return {
        success: true,
        commandRecognized: 'TODAY',
        message: `📅 *Today's Events (${todayStr}) — ${todaysOrders.length} Order(s)*:\n\n${listText}`,
      };
    }

    case 'SHOOTS':
    case 'UPCOMING': {
      const orders = await getOrdersByStudio(studio.id);
      const upcoming = orders
        .filter((o: Order) => o.eventDate && o.eventDate >= todayStr && o.orderStatus !== 'CANCELLED' && o.orderStatus !== 'COMPLETED')
        .sort((a: Order, b: Order) => (a.eventDate! > b.eventDate! ? 1 : -1))
        .slice(0, 5);

      if (upcoming.length === 0) {
        return {
          success: true,
          commandRecognized: 'SHOOTS',
          message: `📅 *Upcoming Shoots:*\nNo upcoming confirmed events scheduled in the calendar.`,
        };
      }

      const listText = upcoming
        .map(
          (o: Order, idx: number) =>
            `${idx + 1}. *${o.eventDate}* — ${o.eventType || 'Shoot'}\n` +
            `   • Client: ${o.customer?.name || 'Client'} (${o.orderNumber})\n` +
            `   • Venue: ${o.eventLocation || 'TBD'}\n` +
            `   • Crew: ${o.assignedResources?.map((c: ResourceAssignment) => c.memberName).join(', ') || 'Not assigned yet'}`
        )
        .join('\n\n');

      return {
        success: true,
        commandRecognized: 'SHOOTS',
        message: `📅 *Upcoming Shoots for ${studio.name} (Next 5):*\n\n${listText}`,
      };
    }

    case 'ORDERS':
    case 'ACTIVE': {
      const orders = await getOrdersByStudio(studio.id);
      const active = orders.filter((o: Order) => o.orderStatus !== 'COMPLETED' && o.orderStatus !== 'CANCELLED');

      const awaitingEvent = active.filter((o: Order) => o.orderStatus === 'AWAITING_EVENT').length;
      const inProgress = active.filter((o: Order) => o.orderStatus === 'POST_EVENT_IN_PROGRESS').length;
      const totalBalanceDue = active.reduce((acc: number, o: Order) => acc + (o.pricing?.remainingAmount || 0), 0);

      return {
        success: true,
        commandRecognized: 'ORDERS',
        message:
          `📊 *${studio.name} — Active OMS Summary*\n\n` +
          `• Total Active Orders: *${active.length}*\n` +
          `• Awaiting Event Date: *${awaitingEvent}*\n` +
          `• In Post-Production: *${inProgress}*\n` +
          `• Outstanding Balance Due: *₹${totalBalanceDue.toLocaleString('en-IN')}*\n\n` +
          `Reply with \`STATUS <Order#>\` to look up specific details.`,
      };
    }

    case 'STATUS': {
      if (!arg) {
        return {
          success: false,
          commandRecognized: 'STATUS',
          message: `⚠️ Please provide an order number or passkey PIN. Example: \`STATUS 1002\` or \`STATUS ORD-TES-260928\`.`,
        };
      }

      const orders = await getOrdersByStudio(studio.id);
      const cleanQuery = arg.toUpperCase().replace(/^#/, '');

      // Match against orderNumber, trackingPasskey, passkeyPin, or id
      const matched = orders.find(
        (o: Order) =>
          o.orderNumber?.toUpperCase().includes(cleanQuery) ||
          o.passkeyPin === cleanQuery ||
          o.trackingPasskey?.toUpperCase() === cleanQuery ||
          o.id === arg
      );

      if (!matched) {
        return {
          success: false,
          commandRecognized: 'STATUS',
          message: `🔍 Order [${arg}] not found in ${studio.name}. Please check the order number.`,
        };
      }

      return {
        success: true,
        commandRecognized: 'STATUS',
        message:
          `📋 *Order Status: #${matched.orderNumber}*\n\n` +
          `• Client: *${matched.customer?.name || 'N/A'}*\n` +
          `• Event: *${matched.eventType || 'Event'}* on *${matched.eventDate || 'N/A'}*\n` +
          `• Venue: ${matched.eventLocation || 'N/A'}\n` +
          `• Lifecycle Status: *${matched.orderStatus}*\n` +
          `• Total Price: ₹${matched.pricing?.finalConfirmedPrice?.toLocaleString('en-IN') || 0}\n` +
          `• Balance Due: ₹${matched.pricing?.remainingAmount?.toLocaleString('en-IN') || 0}\n` +
          `• Assigned Crew: ${matched.assignedResources?.map((c: ResourceAssignment) => c.memberName).join(', ') || 'None'}\n` +
          `• Tracking PIN: *${matched.passkeyPin || 'N/A'}*`,
      };
    }

    case 'CREW':
    case 'TEAM': {
      const members = await getMembersByStudio(studio.id);
      if (members.length === 0) {
        return {
          success: true,
          commandRecognized: 'CREW',
          message: `👥 No team members registered under ${studio.name} yet.`,
        };
      }

      const listText = members
        .map(
          (m: StudioMember, idx: number) =>
            `${idx + 1}. *${m.name}* (${m.role || 'Member'})\n` +
            `   • Skills: ${m.skills?.join(', ') || 'General'}\n` +
            `   • Contact: ${m.phone || m.email}`
        )
        .join('\n\n');

      return {
        success: true,
        commandRecognized: 'CREW',
        message: `👥 *${studio.name} Team Roster (${members.length} members):*\n\n${listText}`,
      };
    }

    default:
      return {
        success: false,
        commandRecognized: 'UNKNOWN',
        message:
          `❓ Unknown command: "${raw}".\n\n` +
          `Reply with *HELP* to see available commands (TODAY, SHOOTS, ORDERS, STATUS, CREW).`,
      };
  }
}

// ============================================================================
// 4. META WHATSAPP BUSINESS CLOUD API DISPATCH (OPTIONAL ADVANCED GATEWAY)
// ============================================================================

export interface MetaCloudApiResult {
  dispatched: boolean;
  messageId?: string;
  error?: string;
  mode: 'CLOUD_API' | 'CLICK_TO_CHAT_FALLBACK';
  clickToChatUrl?: string;
}

/**
 * Dispatches an automated message via Meta WhatsApp Business Cloud API.
 * If credentials are not configured, seamlessly falls back to pre-formatted Click-To-Chat URL.
 */
export async function sendWhatsAppMessageOrFallback(
  recipientPhone: string,
  messageText: string
): Promise<MetaCloudApiResult> {
  const token = process.env.WHATSAPP_BUSINESS_API_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  const clickToChatUrl = generateWhatsAppClickToChatUrl(recipientPhone, messageText);

  // If no Cloud API token, provide the click-to-chat fallback
  if (!token || !phoneId) {
    return {
      dispatched: false,
      mode: 'CLICK_TO_CHAT_FALLBACK',
      clickToChatUrl,
    };
  }

  try {
    const cleanPhone = recipientPhone.replace(/\D/g, '');
    const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

    const res = await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: formattedPhone,
        type: 'text',
        text: { body: messageText },
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return {
        dispatched: false,
        mode: 'CLICK_TO_CHAT_FALLBACK',
        error: data.error?.message || 'Meta Cloud API call failed',
        clickToChatUrl,
      };
    }

    return {
      dispatched: true,
      mode: 'CLOUD_API',
      messageId: data.messages?.[0]?.id,
      clickToChatUrl,
    };
  } catch (err: any) {
    return {
      dispatched: false,
      mode: 'CLICK_TO_CHAT_FALLBACK',
      error: err.message,
      clickToChatUrl,
    };
  }
}
