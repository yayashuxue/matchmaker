import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = req.nextUrl.searchParams.get('token');

  try {
    const { response } = await req.json();

    if (!token || !response) {
      return new Response(JSON.stringify({ error: 'Token and response are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const match = await prisma.match.findUnique({
      where: { id: params.id },
    });

    if (!match) {
      return new Response(JSON.stringify({ error: 'Match not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Determine which person is responding
    let updateData = {};
    if (token === match.person1Token) {
      updateData = { person1Response: response };
    } else if (token === match.person2Token) {
      updateData = { person2Response: response };
    } else {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Update the match with the user's response
    await prisma.match.update({
      where: { id: params.id },
      data: updateData,
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to process response:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
