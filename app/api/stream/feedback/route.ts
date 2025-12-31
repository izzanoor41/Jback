/**
 * Real-time Feedback Streaming API
 * Publishes feedback to Confluent Kafka for real-time processing
 * Integrated with Confluent Intelligence Streaming Agents
 */

import { NextRequest, NextResponse } from 'next/server';
import { publishFeedback, FeedbackMessage, KAFKA_TOPICS } from '@/lib/confluent';
import { analyzeFeedbackWithCulturalContext } from '@/lib/cultural-ai';
import { culturalIntelligenceAgent } from '@/lib/streaming-agents';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { teamId, text, rating, customerEmail, source = 'api' } = body;

    if (!teamId || !text) {
      return NextResponse.json(
        { error: 'teamId and text are required' },
        { status: 400 }
      );
    }

    const feedbackId = uuidv4();
    const timestamp = new Date().toISOString();

    // Create feedback message for Kafka
    const feedbackMessage: FeedbackMessage = {
      id: feedbackId,
      teamId,
      originalText: text,
      customerEmail,
      rating,
      timestamp,
      source: source as 'widget' | 'api' | 'import',
    };

    // Try to publish to Kafka (non-blocking)
    let kafkaPublished = false;
    try {
      await publishFeedback(feedbackMessage);
      kafkaPublished = true;
      console.log(`[Kafka] Published feedback ${feedbackId} to ${KAFKA_TOPICS.FEEDBACK_RAW}`);
    } catch (kafkaError) {
      console.warn('[Kafka] Failed to publish, falling back to direct processing:', kafkaError);
    }

    // Process with Cultural AI
    const analysis = await analyzeFeedbackWithCulturalContext(text, rating);

    // Save to database
    const feedback = await prisma.feedback.create({
      data: {
        id: feedbackId,
        teamId,
        originalText: text,
        translatedText: analysis.translatedText,
        detectedLanguage: analysis.detectedLanguage,
        sentiment: analysis.sentiment,
        culturalNotes: analysis.culturalNotes,
        summary: analysis.summary,
        suggestions: analysis.suggestions,
        rate: rating,
        streamSource: kafkaPublished ? 'kafka' : 'direct',
        processedAt: new Date(),
      },
    });

    // Trigger Confluent Intelligence Streaming Agents
    try {
      const agentContext = {
        feedbackId,
        teamId,
        originalText: text,
        detectedLanguage: analysis.detectedLanguage,
        sentiment: analysis.sentiment,
        timestamp,
      };
      
      // Process with Cultural Intelligence Agent (non-blocking)
      culturalIntelligenceAgent.processStreamingFeedback(agentContext)
        .then(actions => {
          console.log(`[Streaming Agents] Processed feedback with ${actions.length} actions`);
        })
        .catch(error => {
          console.warn('[Streaming Agents] Processing failed:', error);
        });
    } catch (agentError) {
      console.warn('[Streaming Agents] Failed to trigger:', agentError);
    }

    // Log stream event
    await prisma.streamEvent.create({
      data: {
        eventType: 'feedback_processed',
        payload: {
          feedbackId,
          teamId,
          sentiment: analysis.sentiment,
          language: analysis.detectedLanguage,
          kafkaPublished,
          streamingAgentsTriggered: true,
        },
        kafkaTopic: kafkaPublished ? KAFKA_TOPICS.FEEDBACK_RAW : null,
        status: 'processed',
        processedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      feedback: {
        id: feedback.id,
        sentiment: analysis.sentiment,
        detectedLanguage: analysis.detectedLanguage,
        culturalNotes: analysis.culturalNotes,
        summary: analysis.summary,
        suggestions: analysis.suggestions,
        urgency: analysis.urgency,
        streamSource: feedback.streamSource,
      },
      streaming: {
        enabled: kafkaPublished,
        topic: kafkaPublished ? KAFKA_TOPICS.FEEDBACK_RAW : null,
        intelligenceEnabled: true,
      },
    });
  } catch (error) {
    console.error('[Stream API] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET: Stream status and recent events
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

    // Get recent stream events
    const recentEvents = await prisma.streamEvent.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    // Filter events by teamId in payload
    const filteredEvents = recentEvents.filter((event) => {
      const payload = event.payload as Record<string, unknown>;
      return payload?.teamId === teamId;
    });

    // Get streaming stats
    const stats = await prisma.feedback.groupBy({
      by: ['streamSource'],
      where: { teamId },
      _count: true,
    });

    return NextResponse.json({
      success: true,
      events: filteredEvents,
      stats: {
        bySource: stats.reduce((acc, s) => {
          acc[s.streamSource || 'unknown'] = s._count;
          return acc;
        }, {} as Record<string, number>),
      },
    });
  } catch (error) {
    console.error('[Stream API] GET Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
