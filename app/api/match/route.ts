// app/api/match/route.ts
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { person1, person2, reason, matchmakerInstagram } = await req.json();

    // Create or get users first
    const [dbPerson1, dbPerson2] = await Promise.all([
      prisma.user.upsert({
        where: { instagram: person1.instagram },
        create: {
          outsideId: `temp_${person1.instagram}`, // 临时 ID
          instagram: person1.instagram,
          name: person1.name || person1.instagram,
        },
        update: {} // 如果存在就不更新
      }),
      prisma.user.upsert({
        where: { instagram: person2.instagram },
        create: {
          outsideId: `temp_${person2.instagram}`,
          instagram: person2.instagram,
          name: person2.name || person2.instagram,
        },
        update: {}
      })
    ]);

    // Create the match
    const match = await prisma.match.create({
      data: {
        person1Id: dbPerson1.id,
        person2Id: dbPerson2.id,
        matchmakerId: dbPerson1.id, // 临时用第一个人作为 matchmaker
        reason,
      }
    });

    return new Response(
      JSON.stringify({
        success: true,
        match,
        shareLinks: {
          person1: `/match/${match.id}?token=${match.person1Token}`,
          person2: `/match/${match.id}?token=${match.person2Token}`
        }
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Failed to create match:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
