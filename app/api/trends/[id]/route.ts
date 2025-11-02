import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status } = body;

    const trend = await prisma.trend.update({
      where: { id: params.id },
      data: { status },
    });

    return NextResponse.json({ trend });
  } catch (error) {
    console.error('Update trend error:', error);
    return NextResponse.json(
      { error: 'Failed to update trend' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.trend.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete trend error:', error);
    return NextResponse.json(
      { error: 'Failed to delete trend' },
      { status: 500 }
    );
  }
}
