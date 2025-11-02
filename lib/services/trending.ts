import axios from 'axios';

export interface TrendingTopic {
  title: string;
  description?: string;
  source: string;
  category?: string;
  popularityScore: number;
  url?: string;
  keywords?: string[];
  language: string;
  region: string;
}

// Google Trends (using RSS feed - free)
export async function fetchGoogleTrends(region = 'US'): Promise<TrendingTopic[]> {
  try {
    const url = `https://trends.google.com/trending/rss?geo=${region}`;
    const response = await axios.get(url);
    const data = response.data;

    // Parse RSS feed (simplified)
    const trends: TrendingTopic[] = [];
    const items = data.match(/<item>[\s\S]*?<\/item>/g) || [];

    items.slice(0, 10).forEach((item: string, index: number) => {
      const titleMatch = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/);
      const linkMatch = item.match(/<link>(.*?)<\/link>/);
      const descMatch = item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/);

      if (titleMatch) {
        trends.push({
          title: titleMatch[1],
          description: descMatch ? descMatch[1].replace(/<[^>]*>/g, '').substring(0, 200) : '',
          source: 'google',
          category: 'trending',
          popularityScore: 100 - index * 5,
          url: linkMatch ? linkMatch[1] : '',
          keywords: [titleMatch[1]],
          language: 'en',
          region: region,
        });
      }
    });

    return trends;
  } catch (error) {
    console.error('Error fetching Google Trends:', error);
    return [];
  }
}

// Reddit Hot Topics (free - no API key needed for public data)
export async function fetchRedditHot(subreddit = 'all', limit = 10): Promise<TrendingTopic[]> {
  try {
    const url = `https://www.reddit.com/r/${subreddit}/hot.json?limit=${limit}`;
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'SocialMediaAIAgent/1.0',
      },
    });

    const trends: TrendingTopic[] = [];
    const posts = response.data.data.children;

    posts.forEach((post: any) => {
      const data = post.data;
      trends.push({
        title: data.title,
        description: data.selftext ? data.selftext.substring(0, 200) : '',
        source: 'reddit',
        category: data.subreddit,
        popularityScore: Math.floor(data.ups / 100),
        url: `https://reddit.com${data.permalink}`,
        keywords: [data.title],
        language: 'en',
        region: 'US',
      });
    });

    return trends;
  } catch (error) {
    console.error('Error fetching Reddit:', error);
    return [];
  }
}

// Hacker News (free)
export async function fetchHackerNews(): Promise<TrendingTopic[]> {
  try {
    const topStoriesUrl = 'https://hacker-news.firebaseio.com/v0/topstories.json';
    const topStoriesResponse = await axios.get(topStoriesUrl);
    const topStoryIds = topStoriesResponse.data.slice(0, 10);

    const trends: TrendingTopic[] = [];

    for (const id of topStoryIds) {
      try {
        const storyUrl = `https://hacker-news.firebaseio.com/v0/item/${id}.json`;
        const storyResponse = await axios.get(storyUrl);
        const story = storyResponse.data;

        if (story && story.title) {
          trends.push({
            title: story.title,
            description: story.text ? story.text.substring(0, 200) : '',
            source: 'hackernews',
            category: 'tech',
            popularityScore: story.score || 0,
            url: story.url || `https://news.ycombinator.com/item?id=${id}`,
            keywords: [story.title],
            language: 'en',
            region: 'US',
          });
        }
      } catch (err) {
        continue;
      }
    }

    return trends;
  } catch (error) {
    console.error('Error fetching Hacker News:', error);
    return [];
  }
}

// Twitter/X Trends (would need API key - mock implementation)
export async function fetchTwitterTrends(apiKey?: string): Promise<TrendingTopic[]> {
  if (!apiKey) {
    return generateMockTwitterTrends();
  }

  // Real implementation would use Twitter API v2
  // For now, return mock data
  return generateMockTwitterTrends();
}

function generateMockTwitterTrends(): TrendingTopic[] {
  const mockTrends = [
    { title: '#TechNews', description: 'Latest technology updates and innovations' },
    { title: '#AI', description: 'Artificial Intelligence discussions' },
    { title: '#Marketing', description: 'Digital marketing strategies' },
    { title: '#Crypto', description: 'Cryptocurrency market trends' },
    { title: '#Business', description: 'Business and entrepreneurship topics' },
  ];

  return mockTrends.map((trend, index) => ({
    title: trend.title,
    description: trend.description,
    source: 'twitter',
    category: 'trending',
    popularityScore: 95 - index * 5,
    url: `https://twitter.com/search?q=${encodeURIComponent(trend.title)}`,
    keywords: [trend.title],
    language: 'en',
    region: 'US',
  }));
}

// YouTube Trending (would need API key - mock implementation)
export async function fetchYouTubeTrending(apiKey?: string): Promise<TrendingTopic[]> {
  if (!apiKey) {
    return generateMockYouTubeTrends();
  }

  // Real implementation would use YouTube Data API v3
  return generateMockYouTubeTrends();
}

function generateMockYouTubeTrends(): TrendingTopic[] {
  const mockTrends = [
    { title: 'AI Revolution in 2024', description: 'How AI is changing the world' },
    { title: 'Social Media Growth Hacks', description: 'Proven strategies for growth' },
    { title: 'Content Creation Tips', description: 'Best practices for creators' },
    { title: 'Digital Marketing in 2024', description: 'Latest marketing trends' },
    { title: 'Tech Product Reviews', description: 'Latest gadget reviews' },
  ];

  return mockTrends.map((trend, index) => ({
    title: trend.title,
    description: trend.description,
    source: 'youtube',
    category: 'video',
    popularityScore: 90 - index * 5,
    url: `https://youtube.com/results?search_query=${encodeURIComponent(trend.title)}`,
    keywords: [trend.title],
    language: 'en',
    region: 'US',
  }));
}

// Master function to fetch from all sources
export async function fetchAllTrends(
  sources: string[] = ['google', 'reddit', 'hackernews', 'twitter', 'youtube'],
  region = 'US'
): Promise<TrendingTopic[]> {
  const allTrends: TrendingTopic[] = [];

  if (sources.includes('google')) {
    const googleTrends = await fetchGoogleTrends(region);
    allTrends.push(...googleTrends);
  }

  if (sources.includes('reddit')) {
    const redditTrends = await fetchRedditHot();
    allTrends.push(...redditTrends);
  }

  if (sources.includes('hackernews')) {
    const hnTrends = await fetchHackerNews();
    allTrends.push(...hnTrends);
  }

  if (sources.includes('twitter')) {
    const twitterTrends = await fetchTwitterTrends();
    allTrends.push(...twitterTrends);
  }

  if (sources.includes('youtube')) {
    const youtubeTrends = await fetchYouTubeTrending();
    allTrends.push(...youtubeTrends);
  }

  // Sort by popularity score
  return allTrends.sort((a, b) => b.popularityScore - a.popularityScore);
}
