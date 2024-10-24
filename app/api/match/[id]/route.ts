import { prisma } from '@/lib/prisma';


// app/api/match/[id]/route.ts
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  try {
    const match = await prisma.match.findUnique({
      where: { id: params.id },
      include: {
        person1: true,
        person2: true
      }
    });

    if (!match) {
      return new Response(
        JSON.stringify({ error: 'Match not found' }),
        { status: 404 }
      );
    }

    // 简单的 token 验证
    const isFirstPerson = token === match.person1Token;
    const isSecondPerson = token === match.person2Token;

    if (!isFirstPerson && !isSecondPerson) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 403 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        match,
        viewerRole: isFirstPerson ? 'person1' : 'person2'
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Failed to fetch match:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    );
  }
}