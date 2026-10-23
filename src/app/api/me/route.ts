import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/session';
import { AppError } from '@/lib/rules/errors';

export async function GET() {
  const player = await getSessionUser();
  if (!player) {
    return AppError.unauthorized('Not authenticated').toResponse();
  }

  return NextResponse.json({
    player: {
      id: player.id,
      squad_number: player.squad_number,
      full_name: player.full_name,
      display_name: player.display_name,
      position: player.position,
      email: player.email,
      phone: player.phone,
      date_of_birth: player.date_of_birth,
      is_under_18: player.is_under_18,
      consents: {
        photo: player.consent_photo,
        nationality: player.consent_nationality,
        stats: player.consent_stats,
      },
    },
  });
}
