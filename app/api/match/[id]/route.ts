import { prisma } from '@/lib/prisma';
import {match} from 'assert';
import { NextRequest } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = req.nextUrl.searchParams.get('token');

  try {
    console.log('searchParams:', req.nextUrl.searchParams);
    const match = await prisma.match.findUnique({
      where: { id: params.id },
      include: {
        person1: true,
        person2: true,
        matchmaker: true,
      },
    });

    if (!match) {
      return new Response(JSON.stringify({ error: 'Match not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Token validation
    const isFirstPerson = token === match.person1Token;
    const isSecondPerson = token === match.person2Token;

    if (!isFirstPerson && !isSecondPerson) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        match,
        viewerRole: isFirstPerson ? 'person1' : 'person2',
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Failed to fetch match:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
