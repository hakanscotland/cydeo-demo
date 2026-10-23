import { NextResponse } from 'next/server';
import { getSeasonRecord } from '@/lib/data/matches';

export async function GET() {
  const record = await getSeasonRecord();
  return NextResponse.json({ record });
}
