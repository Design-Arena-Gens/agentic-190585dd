import OpenAI from 'openai';

export interface ContentGenerationOptions {
  trend: string;
  platform: string;
  tone: 'funny' | 'professional' | 'informative';
  language: string;
  maxLength?: number;
}

export interface GeneratedContent {
  content: string;
  caption?: string;
  hashtags: string[];
  imagePrompt?: string;
}

// Initialize OpenAI (will use demo mode if no API key)
function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === 'demo-mode') {
    return null;
  }
  return new OpenAI({ apiKey });
}

// Generate content using OpenAI
export async function generateContent(
  options: ContentGenerationOptions
): Promise<GeneratedContent> {
  const client = getOpenAIClient();

  if (!client) {
    // Demo mode - generate mock content
    return generateMockContent(options);
  }

  try {
    const platformGuidelines = getPlatformGuidelines(options.platform);
    const toneStyle = getToneStyle(options.tone);

    const prompt = `Create a ${options.tone} social media post for ${options.platform} about: "${options.trend}"

Platform: ${options.platform}
Tone: ${options.tone}
Language: ${options.language}
Max length: ${platformGuidelines.maxLength} characters

${toneStyle}

Please provide:
1. Main post content (${platformGuidelines.maxLength} chars max)
2. A caption/description if needed
3. 5-10 relevant hashtags
4. A creative image generation prompt that would work well with this post

Format the response as JSON:
{
  "content": "main post text",
  "caption": "caption or description",
  "hashtags": ["tag1", "tag2", ...],
  "imagePrompt": "detailed image generation prompt"
}`;

    const response = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a social media content expert who creates engaging posts.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
    });

    const result = response.choices[0].message.content;
    if (!result) {
      throw new Error('No content generated');
    }

    // Parse JSON response
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    // Fallback if JSON parsing fails
    return {
      content: result.substring(0, platformGuidelines.maxLength),
      hashtags: extractHashtags(result),
      imagePrompt: `${options.trend} - social media post visual`,
    };
  } catch (error) {
    console.error('Error generating content:', error);
    return generateMockContent(options);
  }
}

// Generate image using DALL-E
export async function generateImage(prompt: string): Promise<string | null> {
  const client = getOpenAIClient();

  if (!client) {
    // Return placeholder image URL
    return `https://via.placeholder.com/1024x1024.png?text=${encodeURIComponent(
      prompt.substring(0, 50)
    )}`;
  }

  try {
    const response = await client.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1024x1024',
    });

    return response.data?.[0]?.url || null;
  } catch (error) {
    console.error('Error generating image:', error);
    return null;
  }
}

// Platform-specific guidelines
function getPlatformGuidelines(platform: string) {
  const guidelines: Record<string, { maxLength: number; format: string }> = {
    twitter: { maxLength: 280, format: 'short' },
    facebook: { maxLength: 500, format: 'medium' },
    instagram: { maxLength: 2200, format: 'medium' },
    linkedin: { maxLength: 3000, format: 'long' },
    threads: { maxLength: 500, format: 'short' },
    youtube: { maxLength: 5000, format: 'long' },
    pinterest: { maxLength: 500, format: 'medium' },
  };

  return guidelines[platform] || { maxLength: 500, format: 'medium' };
}

// Tone style descriptions
function getToneStyle(tone: string): string {
  const styles: Record<string, string> = {
    funny: 'Use humor, wit, and playful language. Include emojis and make it entertaining.',
    professional:
      'Use formal, clear, and authoritative language. Be informative and credible.',
    informative:
      'Focus on facts, insights, and educational content. Be clear and helpful.',
  };

  return styles[tone] || styles.professional;
}

// Extract hashtags from text
function extractHashtags(text: string): string[] {
  const hashtagRegex = /#\w+/g;
  const matches = text.match(hashtagRegex);
  return matches ? matches.slice(0, 10) : [];
}

// Generate mock content (fallback when no API key)
function generateMockContent(options: ContentGenerationOptions): GeneratedContent {
  const platformGuidelines = getPlatformGuidelines(options.platform);

  const templates: Record<string, string[]> = {
    funny: [
      `Just discovered ${options.trend} and my mind is blown! 🤯`,
      `${options.trend} is trending and I'm here for it! 😄`,
      `Breaking: ${options.trend} is taking over the internet! 🚀`,
    ],
    professional: [
      `Exploring the latest insights on ${options.trend}. Key takeaways for professionals.`,
      `${options.trend}: What this means for businesses and industry leaders.`,
      `Deep dive into ${options.trend} - trends and implications.`,
    ],
    informative: [
      `Everything you need to know about ${options.trend} 📚`,
      `${options.trend} explained: A comprehensive overview.`,
      `Understanding ${options.trend}: Facts and insights.`,
    ],
  };

  const contentTemplates = templates[options.tone] || templates.professional;
  const content =
    contentTemplates[Math.floor(Math.random() * contentTemplates.length)];

  const hashtags = [
    `#${options.trend.replace(/\s+/g, '')}`,
    '#SocialMedia',
    '#Trending',
    '#Content',
    '#Digital',
  ];

  return {
    content: content.substring(0, platformGuidelines.maxLength),
    caption: `Join the conversation about ${options.trend}`,
    hashtags: hashtags.slice(0, 5),
    imagePrompt: `Professional social media graphic about ${options.trend}, modern design, vibrant colors`,
  };
}

// Translate content (basic implementation)
export async function translateContent(
  content: string,
  targetLanguage: string
): Promise<string> {
  const client = getOpenAIClient();

  if (!client || targetLanguage === 'en') {
    return content;
  }

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a translator. Translate the following text to ${targetLanguage}.`,
        },
        {
          role: 'user',
          content: content,
        },
      ],
      temperature: 0.3,
    });

    return response.choices[0].message.content || content;
  } catch (error) {
    console.error('Error translating content:', error);
    return content;
  }
}
