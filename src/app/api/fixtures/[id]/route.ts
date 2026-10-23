import { NextRequest, NextResponse } from 'next/server';
import { FAKE_SEED_MATCHES } from '@/lib/db/seed-data';
import { getMatchRsvpCounts, getMatchAttendeeRoster, getUserRsvp } from '@/lib/data/rsvps';
import { getSessionUser } from '@/lib/auth/session';
import { isCutoffPassed } from '@/lib/rules/time';
import { AppError } from '@/lib/rules/errors';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const fixture = FAKE_SEED_MATCHES.find(m => m.id === id && m.published);

  if (!fixture) {
    return AppError.notFound('Fixture not found.').toResponse();
  }

  const isClosed = isCutoffPassed(fixture.rsvp_cutoff_at);
  const counts = await getMatchRsvpCounts(id);
  const attendees = await getMatchAttendeeRoster(id);

  let userRsvp = null;
  const currentUser = await getSessionUser();
  if (currentUser) {
    const rawUserRsvp = await getUserRsvp(id, currentUser.id);
    if (rawUserRsvp) {
      userRsvp = {
        status: rawUserRsvp.status,
        note: rawUserRsvp.note,
      };
    }
  }

  return NextResponse.json({
    fixture: {
      ...fixture,
      is_rsvp_closed: isClosed,
    },
    counts,
    attendees,
    user_rsvp: userRsvp,
  });
}
