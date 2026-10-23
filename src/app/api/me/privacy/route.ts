import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/session';
import { AppError } from '@/lib/rules/errors';
import { updatePlayerConsents } from '@/lib/rules/privacy';

export async function GET() {
  const user = await getSessionUser();

  if (!user) {
    const error = AppError.unauthorized('You must be signed in to view privacy settings.');
    return error.toResponse();
  }

  return NextResponse.json({
    consents: {
      photo: user.consent_photo,
      nationality: user.consent_nationality,
      stats: user.consent_stats,
    },
  });
}

export async function PATCH(request: NextRequest) {
  const user = await getSessionUser();

  if (!user) {
    const error = AppError.unauthorized('You must be signed in to modify privacy settings.');
    return error.toResponse();
  }

  try {
    const body = await request.json();
    const updated = updatePlayerConsents(user.id, {
      consent_photo: body.consent_photo,
      consent_nationality: body.consent_nationality,
      consent_stats: body.consent_stats,
    });

    return NextResponse.json({
      success: true,
      player: updated,
    });
  } catch {
    const error = AppError.badRequest('Invalid request body for privacy update.');
    return error.toResponse();
  }
}
