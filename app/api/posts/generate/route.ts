import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateContent, generateImage } from '@/lib/services/ai-content';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { trendId, platform, tone, language } = body;

    // Get trend details
    const trend = await prisma.trend.findUnique({
      where: { id: trendId },
    });

    if (!trend) {
      return NextResponse.json({ error: 'Trend not found' }, { status: 404 });
    }

    // Define platforms to post to
    const platforms = platform
      ? [platform]
      : ['facebook', 'instagram', 'twitter', 'linkedin'];

    const generatedPosts = [];

    for (const targetPlatform of platforms) {
      // Generate content
      const content = await generateContent({
        trend: trend.title,
        platform: targetPlatform,
        tone: tone || 'professional',
        language: language || 'en',
      });

      // Generate image if needed
      let imageUrl = null;
      if (content.imagePrompt) {
        imageUrl = await generateImage(content.imagePrompt);
      }

      // Create post in database
      const post = await prisma.post.create({
        data: {
          trendId: trend.id,
          platform: targetPlatform,
          content: content.content,
          caption: content.caption,
          imageUrl: imageUrl || undefined,
          imagePrompt: content.imagePrompt,
          tone: tone || 'professional',
          hashtags: JSON.stringify(content.hashtags),
          status: 'draft',
        },
      });

      generatedPosts.push(post);
    }

    return NextResponse.json({
      success: true,
      posts: generatedPosts,
    });
  } catch (error) {
    console.error('Generate post error:', error);
    return NextResponse.json(
      { error: 'Failed to generate post' },
      { status: 500 }
    );
  }
}
