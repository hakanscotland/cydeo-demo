import { NextRequest, NextResponse } from 'next/server';
import { getPublicPlayerById } from '@/lib/data/players';
import { AppError } from '@/lib/rules/errors';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const player = await getPublicPlayerById(id);

  if (!player) {
    const error = AppError.notFound('Player not found or profile unavailable.');
    return error.toResponse();
  }

  return NextResponse.json({ player });
}
