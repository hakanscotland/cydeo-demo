import { NextRequest, NextResponse } from 'next/server';
import { FAKE_SEED_MATCHES } from '@/lib/db/seed-data';
import { getMatchRsvpCounts } from '@/lib/data/rsvps';
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

  const counts = await getMatchRsvpCounts(id);
  const isClosed = isCutoffPassed(fixture.rsvp_cutoff_at);

  return NextResponse.json(
    {
      ...counts,
      is_rsvp_closed: isClosed,
    },
    {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    }
  );
}
