import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { fetchAllTrends } from '@/lib/services/trending';

export async function POST() {
  try {
    // Fetch trends from all sources
    const trendingTopics = await fetchAllTrends();

    // Save to database
    const savedTrends = [];
    for (const topic of trendingTopics) {
      try {
        const trend = await prisma.trend.create({
          data: {
            title: topic.title,
            description: topic.description,
            source: topic.source,
            category: topic.category,
            language: topic.language,
            region: topic.region,
            popularityScore: topic.popularityScore,
            url: topic.url,
            keywords: JSON.stringify(topic.keywords),
            status: 'pending',
          },
        });
        savedTrends.push(trend);
      } catch (error) {
        // Skip duplicates or errors
        console.error('Error saving trend:', error);
      }
    }

    return NextResponse.json({
      success: true,
      count: savedTrends.length,
      trends: savedTrends,
    });
  } catch (error) {
    console.error('Fetch trends error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trends' },
      { status: 500 }
    );
  }
}
