import { NextResponse } from 'next/server';
import { validateCredentials, setSessionCookie } from '@/lib/auth/session';
import { AppError } from '@/lib/rules/errors';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return AppError.badRequest('Email and password are required.').toResponse();
    }

    const player = validateCredentials(email, password);
    if (!player) {
      return new NextResponse(
        JSON.stringify({
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid credentials.',
            status: 401,
          },
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await setSessionCookie(player);

    return NextResponse.json({
      player: {
        id: player.id,
        email: player.email,
        display_name: player.display_name,
        squad_number: player.squad_number,
        position: player.position,
      },
    });
  } catch {
    return AppError.badRequest('Malformed JSON body').toResponse();
  }
}
