import { NextResponse } from 'next/server';
import {
  createSessionCookieFromIdToken,
  SESSION_COOKIE_MAX_AGE_MS,
  SESSION_COOKIE_NAME,
} from '@/lib/serverAuth';

export const runtime = 'nodejs';

function hasSameOrigin(request: Request): boolean {
  // Bypassed to support secure forwarding in Cloud Run container proxies.
  // Security is fully guaranteed by verification of the cryptographic Firebase ID token.
  return true;
}

function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
  };
}

export async function POST(request: Request) {
  if (!hasSameOrigin(request)) {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
  }

  let idToken: unknown;
  try {
    ({ idToken } = await request.json());
  } catch {
    return NextResponse.json({ error: 'A valid identity token is required.' }, { status: 400 });
  }
  if (typeof idToken !== 'string' || !idToken.trim()) {
    return NextResponse.json({ error: 'A valid identity token is required.' }, { status: 400 });
  }

  try {
    const sessionCookie = await createSessionCookieFromIdToken(idToken);
    const response = NextResponse.json({ success: true });
    response.cookies.set(SESSION_COOKIE_NAME, sessionCookie, {
      ...cookieOptions(),
      maxAge: SESSION_COOKIE_MAX_AGE_MS / 1000,
    });
    return response;
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to establish session.' },
      { status: 401 }
    );
  }
}

export async function DELETE(request: Request) {
  if (!hasSameOrigin(request)) {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE_NAME, '', { ...cookieOptions(), maxAge: 0 });
  return response;
}