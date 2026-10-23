import { NextResponse } from 'next/server';
import { getPublicPlayers } from '@/lib/data/players';

export async function GET() {
  const players = await getPublicPlayers();
  return NextResponse.json({ players });
}
