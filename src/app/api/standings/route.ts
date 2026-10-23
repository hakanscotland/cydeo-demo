import { NextResponse } from 'next/server';
import { getStandingsSnapshot } from '@/lib/data/standings';

export async function GET() {
  const standings = await getStandingsSnapshot();
  return NextResponse.json({ standings });
}
