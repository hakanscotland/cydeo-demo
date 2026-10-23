import { NextResponse } from 'next/server';
import { getNextFixture } from '@/lib/data/matches';
import { isCutoffPassed } from '@/lib/rules/time';

export async function GET() {
  const fixture = await getNextFixture();

  if (!fixture) {
    return NextResponse.json({ fixture: null });
  }

  const isRsvpClosed = isCutoffPassed(fixture.rsvp_cutoff_at);

  return NextResponse.json({
    fixture: {
      ...fixture,
      is_rsvp_closed: isRsvpClosed,
    },
  });
}
