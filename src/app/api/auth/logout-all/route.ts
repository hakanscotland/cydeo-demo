import { NextResponse } from 'next/server';
import { getSessionUser, clearSessionCookie, revokeAllPlayerSessions } from '@/lib/auth/session';
import { AppError } from '@/lib/rules/errors';

export async function POST() {
  const user = await getSessionUser();
  if (!user) {
    return AppError.unauthorized('No active session found').toResponse();
  }

  // Revoke globally for this player
  revokeAllPlayerSessions(user.id);
  await clearSessionCookie();

  return NextResponse.json({
    success: true,
    message: 'All active sessions revoked across all devices.',
  });
}
