import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get('limit');
    const platform = searchParams.get('platform');
    const status = searchParams.get('status');

    const where: any = {};
    if (platform && platform !== 'all') where.platform = platform;
    if (status && status !== 'all') where.status = status;

    const posts = await prisma.post.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit ? parseInt(limit) : undefined,
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Posts fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}
