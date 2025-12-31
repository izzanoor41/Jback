/**
 * Cultural Intelligence AI Engine
 * Powered by Google Cloud Vertex AI (Gemini) + OpenAI Fallback
 * 
 * This module provides deep cultural analysis beyond simple translation
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';

// Initialize AI clients
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_CLOUD_API_KEY || '');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });

// Cultural context database
const CULTURAL_CONTEXTS: Record<string, {
  communicationStyle: string;
  feedbackPatterns: string;
  ratingInterpretation: string;
  sensitivities: string[];
}> = {
  ja: {
    communicationStyle: 'Indirect and polite. Criticism is often softened or implied rather than stated directly.',
    feedbackPatterns: 'Japanese customers tend to understate negative feedback. A "satisfactory" rating often indicates disappointment.',
    ratingInterpretation: '5-star: Exceptional, 4-star: Good/Expected, 3-star: Disappointing, 2-star: Very unhappy, 1-star: Extremely rare (severe issue)',
    sensitivities: ['Direct confrontation', 'Public criticism', 'Loss of face'],
  },
  ko: {
    communicationStyle: 'Hierarchical and relationship-focused. Context and tone matter greatly.',
    feedbackPatterns: 'Korean customers value quick responses and personal attention. Emotional expression is common.',
    ratingInterpretation: 'Similar to Western scales but with emphasis on service quality and speed.',
    sensitivities: ['Age-related respect', 'Brand reputation', 'Social proof'],
  },
  zh: {
    communicationStyle: 'Context-heavy and relationship-oriented. Face-saving is important.',
    feedbackPatterns: 'Chinese customers may be indirect about complaints but very direct about praise.',
    ratingInterpretation: 'Numbers have cultural significance. 8 is lucky, 4 is avoided.',
    sensitivities: ['Face/reputation', 'Family values', 'National pride'],
  },
  de: {
    communicationStyle: 'Direct and precise. Values efficiency and clarity.',
    feedbackPatterns: 'German customers appreciate detailed, factual feedback. They expect thorough responses.',
    ratingInterpretation: 'Ratings are taken literally. A 3/5 means average, not bad.',
    sensitivities: ['Privacy', 'Data protection', 'Quality standards'],
  },
  fr: {
    communicationStyle: 'Formal and eloquent. Values style and presentation.',
    feedbackPatterns: 'French customers may be critical but appreciate acknowledgment and elegant solutions.',
    ratingInterpretation: 'Moderate ratings are common. High praise is reserved for exceptional experiences.',
    sensitivities: ['Language quality', 'Cultural sophistication', 'Personal service'],
  },
  es: {
    communicationStyle: 'Warm and expressive. Personal relationships matter.',
    feedbackPatterns: 'Spanish-speaking customers value personal connection and emotional acknowledgment.',
    ratingInterpretation: 'Ratings tend to be more generous. Relationship quality affects perception.',
    sensitivities: ['Personal warmth', 'Family references', 'Regional differences'],
  },
  ar: {
    communicationStyle: 'Elaborate and respectful. Hospitality and honor are central.',
    feedbackPatterns: 'Arabic-speaking customers value respect and personal attention. Complaints may be indirect.',
    ratingInterpretation: 'Generosity in ratings when relationship is good. Very critical when trust is broken.',
    sensitivities: ['Religious considerations', 'Honor/respect', 'Hospitality expectations'],
  },
  id: {
    communicationStyle: 'Polite and indirect. Harmony and respect are prioritized.',
    feedbackPatterns: 'Indonesian customers often avoid direct criticism. "Maybe" often means "no".',
    ratingInterpretation: 'Tend to give higher ratings to maintain harmony. Low ratings indicate serious issues.',
    sensitivities: ['Religious diversity', 'Social harmony', 'Respect for elders'],
  },
  en: {
    communicationStyle: 'Direct but varies by region (US more direct, UK more reserved).',
    feedbackPatterns: 'English-speaking customers expect clear, actionable responses.',
    ratingInterpretation: 'Ratings are generally taken at face value.',
    sensitivities: ['Privacy', 'Transparency', 'Quick resolution'],
  },
};

export interface CulturalAnalysisResult {
  detectedLanguage: string;
  translatedText: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  sentimentScore: number; // -1 to 1
  culturalNotes: string | null;
  culturalContext: {
    communicationStyle: string;
    ratingInterpretation: string;
    adjustedSentiment?: string;
  } | null;
  summary: string;
  suggestions: string;
  keywords: string[];
  urgency: 'low' | 'medium' | 'high';
}

export async function analyzeFeedbackWithCulturalContext(
  text: string,
  rating?: number
): Promise<CulturalAnalysisResult> {
  const systemPrompt = `You are a Cultural Intelligence AI specialized in analyzing customer feedback across different cultures and languages.

Your task is to analyze the following feedback and provide:
1. Language detection (ISO 639-1 code)
2. English translation (if not already in English)
3. Sentiment analysis with cultural context
4. Cultural notes explaining any cultural nuances
5. A concise summary
6. Actionable suggestions for response
7. Key topics/keywords
8. Urgency level

IMPORTANT: Consider cultural communication styles:
- Japanese/Korean: Often indirect, understate negativity
- German: Direct and precise
- Arabic: Elaborate, honor-focused
- Indonesian: Indirect, harmony-focused
- French: Formal, values elegance

Respond ONLY with a valid JSON object in this exact format:
{
  "detected_language": "en",
  "translated_text": "...",
  "sentiment": "positive|neutral|negative",
  "sentiment_score": 0.5,
  "cultural_notes": "...",
  "summary": "...",
  "suggestions": "...",
  "keywords": ["keyword1", "keyword2"],
  "urgency": "low|medium|high"
}`;

  try {
    // Use Google Gemini for analysis
    const prompt = `${systemPrompt}\n\nFeedback text: "${text}"${rating ? `\nRating given: ${rating}/5` : ''}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const content = response.text();
    
    // Parse JSON response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in AI response');
    }
    
    const analysis = JSON.parse(jsonMatch[0]);
    const langCode = analysis.detected_language || 'en';
    const culturalContext = CULTURAL_CONTEXTS[langCode] || CULTURAL_CONTEXTS['en'];
    
    // Adjust sentiment based on cultural context
    let adjustedSentiment = analysis.sentiment;
    if (langCode === 'ja' || langCode === 'id') {
      // Japanese and Indonesian tend to understate negativity
      if (analysis.sentiment === 'neutral' && rating && rating <= 3) {
        adjustedSentiment = 'This feedback may indicate dissatisfaction despite neutral wording (cultural communication style)';
      }
    }

    return {
      detectedLanguage: langCode,
      translatedText: analysis.translated_text || text,
      sentiment: analysis.sentiment || 'neutral',
      sentimentScore: analysis.sentiment_score || 0,
      culturalNotes: analysis.cultural_notes || null,
      culturalContext: {
        communicationStyle: culturalContext.communicationStyle,
        ratingInterpretation: culturalContext.ratingInterpretation,
        adjustedSentiment: adjustedSentiment !== analysis.sentiment ? adjustedSentiment : undefined,
      },
      summary: analysis.summary || '',
      suggestions: analysis.suggestions || '',
      keywords: analysis.keywords || [],
      urgency: analysis.urgency || 'low',
    };
  } catch (error) {
    console.error('Cultural analysis error:', error);
    
    // Fallback response
    return {
      detectedLanguage: 'en',
      translatedText: text,
      sentiment: 'neutral',
      sentimentScore: 0,
      culturalNotes: null,
      culturalContext: null,
      summary: text.slice(0, 100),
      suggestions: 'Please review this feedback manually.',
      keywords: [],
      urgency: 'low',
    };
  }
}

// Generate cultural insights from aggregated feedback
export async function generateCulturalInsights(
  feedbackItems: Array<{
    text: string;
    language: string;
    sentiment: string;
  }>
): Promise<{
  insights: string[];
  recommendations: string[];
  languageBreakdown: Record<string, number>;
}> {
  const languageBreakdown: Record<string, number> = {};
  
  feedbackItems.forEach(item => {
    languageBreakdown[item.language] = (languageBreakdown[item.language] || 0) + 1;
  });

  // Count sentiments
  const sentimentCounts = { positive: 0, neutral: 0, negative: 0 };
  feedbackItems.forEach(item => {
    if (item.sentiment in sentimentCounts) {
      sentimentCounts[item.sentiment as keyof typeof sentimentCounts]++;
    }
  });

  const prompt = `You are a Cultural Intelligence AI. Analyze these ${feedbackItems.length} customer feedback items from different cultures.

Language Distribution:
${Object.entries(languageBreakdown).map(([lang, count]) => `- ${getLanguageName(lang)}: ${count} items`).join('\n')}

Sentiment Distribution:
- Positive: ${sentimentCounts.positive}
- Neutral: ${sentimentCounts.neutral}
- Negative: ${sentimentCounts.negative}

Sample Feedback:
${feedbackItems.slice(0, 8).map(f => `[${getLanguageName(f.language)}] ${f.sentiment}: "${f.text.slice(0, 80)}..."`).join('\n')}

Provide:
1. 3-4 key cultural insights about the feedback patterns
2. 3-4 actionable recommendations for improving cross-cultural communication

Respond with ONLY valid JSON (no markdown):
{
  "insights": ["insight 1", "insight 2", "insight 3"],
  "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"]
}`;

  // Try OpenAI first (more reliable)
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a Cultural Intelligence AI expert. Respond only with valid JSON.'
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.5,
    });

    const content = response.choices[0]?.message?.content || '';
    const cleaned = content.replace(/```json\n?|\n?```/g, '').trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        insights: parsed.insights || [],
        recommendations: parsed.recommendations || [],
        languageBreakdown,
      };
    }
  } catch (error) {
    console.error('[Cultural AI] OpenAI failed:', error);
  }

  // Fallback to Gemini
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const content = response.text();
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        insights: parsed.insights || [],
        recommendations: parsed.recommendations || [],
        languageBreakdown,
      };
    }
  } catch (error) {
    console.error('[Cultural AI] Gemini also failed:', error);
  }

  // Generate basic insights from data
  const topLanguages = Object.entries(languageBreakdown)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([lang]) => getLanguageName(lang));

  return {
    insights: [
      `Your feedback comes from ${Object.keys(languageBreakdown).length} different languages, showing global reach.`,
      `Top languages: ${topLanguages.join(', ')}.`,
      `${Math.round((sentimentCounts.positive / feedbackItems.length) * 100)}% of feedback is positive.`,
      sentimentCounts.negative > 0 
        ? `${sentimentCounts.negative} negative feedback items need attention.`
        : 'No negative feedback detected - great job!',
    ],
    recommendations: [
      'Continue monitoring feedback across all languages for cultural patterns.',
      'Consider localizing responses based on customer language preferences.',
      'Pay special attention to indirect feedback from Asian markets.',
    ],
    languageBreakdown,
  };
}

// Get language name from code
export function getLanguageName(code: string): string {
  const languages: Record<string, string> = {
    en: 'English',
    ja: 'Japanese',
    ko: 'Korean',
    zh: 'Chinese',
    de: 'German',
    fr: 'French',
    es: 'Spanish',
    ar: 'Arabic',
    id: 'Indonesian',
    pt: 'Portuguese',
    ru: 'Russian',
    hi: 'Hindi',
    th: 'Thai',
    vi: 'Vietnamese',
    nl: 'Dutch',
    it: 'Italian',
    tr: 'Turkish',
    pl: 'Polish',
  };
  return languages[code] || code.toUpperCase();
}
