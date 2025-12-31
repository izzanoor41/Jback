/**
 * Cultural Insights API
 * Generates aggregated cultural intelligence from feedback data
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateCulturalInsights, getLanguageName } from '@/lib/cultural-ai';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get('teamId');

    if (!teamId) {
      return NextResponse.json(
        { error: 'teamId is required' },
        { status: 400 }
      );
    }

    // Get feedback with language data
    const feedbacks = await prisma.feedback.findMany({
      where: { teamId },
      select: {
        id: true,
        originalText: true,
        translatedText: true,
        detectedLanguage: true,
        sentiment: true,
        culturalNotes: true,
        rate: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    // Language distribution
    const languageStats: Record<string, { count: number; sentiments: Record<string, number> }> = {};
    
    feedbacks.forEach(fb => {
      const lang = fb.detectedLanguage || 'unknown';
      if (!languageStats[lang]) {
        languageStats[lang] = { count: 0, sentiments: { positive: 0, neutral: 0, negative: 0 } };
      }
      languageStats[lang].count++;
      if (fb.sentiment) {
        languageStats[lang].sentiments[fb.sentiment] = 
          (languageStats[lang].sentiments[fb.sentiment] || 0) + 1;
      }
    });

    // Format for response
    const languageBreakdown = Object.entries(languageStats).map(([code, data]) => ({
      code,
      name: getLanguageName(code),
      count: data.count,
      percentage: Math.round((data.count / feedbacks.length) * 100),
      sentiments: data.sentiments,
      dominantSentiment: Object.entries(data.sentiments)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || 'neutral',
    })).sort((a, b) => b.count - a.count);

    // Get stored cultural insights
    const storedInsights = await prisma.culturalInsight.findMany({
      where: { teamId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    // Generate new insights if we have enough data
    let generatedInsights = null;
    if (feedbacks.length >= 5) {
      generatedInsights = await generateCulturalInsights(
        feedbacks.map(fb => ({
          text: fb.translatedText || fb.originalText || '',
          language: fb.detectedLanguage || 'en',
          sentiment: fb.sentiment || 'neutral',
        }))
      );
    }

    // Cultural notes summary
    const culturalNotesSummary = feedbacks
      .filter(fb => fb.culturalNotes)
      .slice(0, 5)
      .map(fb => ({
        language: getLanguageName(fb.detectedLanguage || 'en'),
        note: fb.culturalNotes,
        sentiment: fb.sentiment,
      }));

    return NextResponse.json({
      success: true,
      summary: {
        totalFeedback: feedbacks.length,
        uniqueLanguages: Object.keys(languageStats).length,
        topLanguage: languageBreakdown[0] || null,
      },
      languageBreakdown,
      culturalNotes: culturalNotesSummary,
      insights: generatedInsights || {
        insights: storedInsights.map(i => i.insight),
        recommendations: [],
      },
      storedInsights: storedInsights.map(i => ({
        id: i.id,
        language: i.language,
        type: i.insightType,
        insight: i.insight,
        confidence: i.confidence,
        createdAt: i.createdAt,
      })),
    });
  } catch (error) {
    console.error('[Cultural Insights API] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST: Generate and store new cultural insight
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { teamId, language, insightType, insight, confidence } = body;

    if (!teamId || !language || !insightType || !insight) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newInsight = await prisma.culturalInsight.create({
      data: {
        teamId,
        language,
        insightType,
        insight,
        confidence: confidence || 0.8,
      },
    });

    return NextResponse.json({
      success: true,
      insight: newInsight,
    });
  } catch (error) {
    console.error('[Cultural Insights API] POST Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
