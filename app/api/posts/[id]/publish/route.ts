import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { postToSocialMedia } from '@/lib/services/social-media';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: params.id },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Get social media credentials (in production, these would be stored securely)
    const credentials = {
      facebook: { accessToken: process.env.FACEBOOK_ACCESS_TOKEN },
      instagram: { accessToken: process.env.INSTAGRAM_ACCESS_TOKEN },
      twitter: {
        apiKey: process.env.TWITTER_API_KEY,
        apiSecret: process.env.TWITTER_API_SECRET,
        accessToken: process.env.TWITTER_ACCESS_TOKEN,
        accessSecret: process.env.TWITTER_ACCESS_SECRET,
      },
      threads: { accessToken: process.env.THREADS_ACCESS_TOKEN },
      youtube: { apiKey: process.env.YOUTUBE_API_KEY },
      pinterest: { accessToken: process.env.PINTEREST_ACCESS_TOKEN },
    };

    // Post to social media
    const result = await postToSocialMedia(
      {
        platform: post.platform,
        content: post.content,
        imageUrl: post.imageUrl || undefined,
      },
      credentials
    );

    // Update post status
    const updatedPost = await prisma.post.update({
      where: { id: params.id },
      data: {
        status: result.success ? 'published' : 'failed',
        publishedAt: result.success ? new Date() : undefined,
        platformPostId: result.platformPostId,
        errorMessage: result.error,
      },
    });

    return NextResponse.json({
      success: result.success,
      post: updatedPost,
      error: result.error,
    });
  } catch (error) {
    console.error('Publish post error:', error);
    return NextResponse.json(
      { error: 'Failed to publish post' },
      { status: 500 }
    );
  }
}
