import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [totalTrends, totalPosts, scheduledPosts, allPosts] = await Promise.all([
      prisma.trend.count(),
      prisma.post.count(),
      prisma.post.count({ where: { status: 'scheduled' } }),
      prisma.post.findMany({
        select: { likes: true, comments: true, shares: true },
      }),
    ]);

    const totalEngagement = allPosts.reduce(
      (sum, post) => sum + post.likes + post.comments + post.shares,
      0
    );

    return NextResponse.json({
      totalTrends,
      totalPosts,
      scheduledPosts,
      totalEngagement,
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
