import { NextResponse } from 'next/server';
import { getPublicResults } from '@/lib/data/matches';

export async function GET() {
  const results = await getPublicResults();
  return NextResponse.json({ results });
}
