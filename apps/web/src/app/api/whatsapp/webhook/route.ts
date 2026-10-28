import { NextRequest, NextResponse } from 'next/server';
import { processWhatsAppBotMessage, sendWhatsAppMessageOrFallback } from '@/services/whatsappService';
import { getFirestoreServerInstance } from '@focoman/db';

/**
 * Meta WhatsApp Business Cloud API Webhook
 * 
 * GET: Webhook verification handshake
 * POST: Inbound message processor for Studio Owner Operations Bot
 */

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const configuredVerifyToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || 'focoman_whatsapp_verify_token_2026';

  if (mode === 'subscribe' && token === configuredVerifyToken) {
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ error: 'Forbidden. Verification token mismatch.' }, { status: 403 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Verify WhatsApp message payload structure
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const message = value?.messages?.[0];

    if (!message || message.type !== 'text') {
      return NextResponse.json({ status: 'ignored_non_text' }, { status: 200 });
    }

    const fromPhone = message.from; // e.g. "919876543210"
    const textBody = message.text?.body?.trim() || '';

    // Match sender phone number against registered Studio Owners in Firestore
    const db = getFirestoreServerInstance();
    const cleanPhoneSuffix = fromPhone.slice(-10); // last 10 digits

    const studiosSnap = await db.collection('studios').get();
    let matchedStudioSlug: string | null = null;
    let isOwner = false;

    for (const doc of studiosSnap.docs) {
      const data = doc.data();
      const studioPhone = (data.contactPhone || data.phone || '').replace(/\D/g, '');
      const ownerPhone = (data.ownerPhone || '').replace(/\D/g, '');

      if (
        (studioPhone && studioPhone.endsWith(cleanPhoneSuffix)) ||
        (ownerPhone && ownerPhone.endsWith(cleanPhoneSuffix))
      ) {
        matchedStudioSlug = data.slug || data.id;
        isOwner = true;
        break;
      }
    }

    // Per documentation: WhatsApp Operations Bot is strictly restricted to Studio Owners
    if (!matchedStudioSlug || !isOwner) {
      // Respond with access boundary notification
      const unauthorizedMsg =
        `🔒 *Focoman Operations Bot*\n\n` +
        `This automated bot is restricted strictly to verified Studio Owners.\n` +
        `Your phone (+${fromPhone}) is not registered as an active studio owner on Focoman.\n` +
        `For studio bookings or order tracking, please visit: https://focoman.web.app`;

      await sendWhatsAppMessageOrFallback(fromPhone, unauthorizedMsg);
      return NextResponse.json({ status: 'unauthorized_sender' }, { status: 200 });
    }

    // Process bot command
    const botResponse = await processWhatsAppBotMessage(matchedStudioSlug, textBody, fromPhone);

    // Reply via WhatsApp Cloud API
    await sendWhatsAppMessageOrFallback(fromPhone, botResponse.message);

    return NextResponse.json({
      status: 'success',
      studio: matchedStudioSlug,
      command: botResponse.commandRecognized,
    }, { status: 200 });
  } catch (err: any) {
    console.error('[WhatsApp Webhook Error]:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
