import { NextRequest, NextResponse } from 'next/server';
import { FAKE_SEED_MATCHES } from '@/lib/db/seed-data';
import { getSessionUser } from '@/lib/auth/session';
import { upsertUserRsvp } from '@/lib/data/rsvps';
import { isCutoffPassed } from '@/lib/rules/time';
import { AppError } from '@/lib/rules/errors';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // 1. Authenticated user required
  const user = await getSessionUser();
  if (!user) {
    return AppError.unauthorized('You must be signed in to submit an RSVP.').toResponse();
  }

  // 2. Fixture existence
  const fixture = FAKE_SEED_MATCHES.find(m => m.id === id && m.published);
  if (!fixture) {
    return AppError.notFound('Fixture not found.').toResponse();
  }

  // 3. Cutoff enforcement (AC-3.3.4)
  if (isCutoffPassed(fixture.rsvp_cutoff_at)) {
    return AppError.cutoffPassed(fixture.rsvp_cutoff_at).toResponse();
  }

  // 4. Payload validation
  try {
    const body = await request.json();
    const status = body.status;
    const note = body.note ? String(body.note).trim() : null;

    if (!['going', 'maybe', 'not_going'].includes(status)) {
      return AppError.badRequest('Invalid RSVP status. Must be "going", "maybe", or "not_going".').toResponse();
    }

    const rsvp = await upsertUserRsvp(id, user.id, status, note);

    return NextResponse.json({
      success: true,
      rsvp: {
        match_id: rsvp.match_id,
        status: rsvp.status,
        note: rsvp.note,
        updated_at: rsvp.updated_at,
      },
    });
  } catch {
    return AppError.badRequest('Malformed JSON body.').toResponse();
  }
}
