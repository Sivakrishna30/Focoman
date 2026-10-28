'use server';

import { requireVerifiedUser, requireStudioMember } from '@/lib/serverAuth';
import {
  processWhatsAppBotMessage,
  WHATSAPP_TEMPLATES,
  WhatsAppTemplateId,
  generateWhatsAppClickToChatUrl,
} from '@/services/whatsappService';
import { getStudioBySlug, getOrderById } from '@focoman/db';

/**
 * Server Actions for WhatsApp Operations Hub & Bot Simulator
 */

export async function simulateWhatsappBotQueryAction(
  studioSlug: string,
  query: string,
  idToken: string
): Promise<{ success: boolean; reply?: string; command?: string; error?: string }> {
  try {
    const decoded = await requireVerifiedUser(idToken);
    // WhatsApp Operations Bot is strictly accessible to STUDIO_OWNER
    await requireStudioMember(decoded.uid, studioSlug, 'STUDIO_OWNER');

    const response = await processWhatsAppBotMessage(studioSlug, query);
    return {
      success: response.success,
      reply: response.message,
      command: response.commandRecognized,
    };
  } catch (err: unknown) {
    console.error('[simulateWhatsappBotQueryAction] Error:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Bot query execution failed.',
    };
  }
}

export async function getWhatsappTemplatePreviewAction(
  studioSlug: string,
  templateId: WhatsAppTemplateId,
  orderId?: string
): Promise<{
  success: boolean;
  text?: string;
  clickToChatUrl?: string;
  error?: string;
}> {
  try {
    const templateDef = WHATSAPP_TEMPLATES[templateId];
    if (!templateDef) {
      return { success: false, error: `Template [${templateId}] does not exist.` };
    }

    const studio = await getStudioBySlug(studioSlug);
    if (!studio) {
      return { success: false, error: 'Studio not found.' };
    }

    let order = null;
    if (orderId) {
      order = await getOrderById(orderId);
    }

    const text = templateDef.generateText({
      studioName: studio.name,
      customerName: order?.customer?.name || 'Karthik & Ananya',
      orderNumber: order?.orderNumber || 'ORD-DEMO-261028',
      eventType: order?.eventType || 'Wedding & Reception',
      eventDate: order?.eventDate || '2026-11-15',
      venue: order?.eventLocation || 'Grand Palace Hall, Chennai',
      balanceDue: order?.pricing?.remainingAmount ?? 35000,
      trackingPasskey: order?.trackingPasskey || 'FOC-DEMO-PASS',
      passkeyPin: order?.passkeyPin || '839201',
      trackingUrl: order ? `https://focoman.web.app/track/${order.trackingPasskey}` : 'https://focoman.web.app/track/FOC-DEMO-PASS',
      crewName: 'Suresh Kumar',
      taskTitle: 'Traditional Photography & 4K Cinematography',
    });

    const targetPhone = order?.customer?.phone || studio.ownerPhone || '9876543210';
    const clickToChatUrl = generateWhatsAppClickToChatUrl(targetPhone, text);

    return {
      success: true,
      text,
      clickToChatUrl,
    };
  } catch (err: unknown) {
    console.error('[getWhatsappTemplatePreviewAction] Error:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to generate preview.',
    };
  }
}
