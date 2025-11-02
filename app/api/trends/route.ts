import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const source = searchParams.get('source');
    const status = searchParams.get('status');

    const where: any = {};
    if (source && source !== 'all') where.source = source;
    if (status && status !== 'all') where.status = status;

    const trends = await prisma.trend.findMany({
      where,
      orderBy: [{ popularityScore: 'desc' }, { createdAt: 'desc' }],
      take: 50,
    });

    return NextResponse.json({ trends });
  } catch (error) {
    console.error('Trends fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trends' },
      { status: 500 }
    );
  }
}
