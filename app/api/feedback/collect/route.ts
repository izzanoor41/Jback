import { PrismaClient } from "@prisma/client";
import { PrismaTiDBCloud } from "@tidbcloud/prisma-adapter";
import { connect } from "@tidbcloud/serverless";
import { NextResponse } from "next/server";
import { stopWords } from "@/lib/stop-words";
import { publishFeedback, FeedbackMessage, KAFKA_TOPICS } from "@/lib/confluent";
import { analyzeFeedback } from "@/lib/ai-analysis";
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  const connection = connect({ url: process.env.DATABASE_URL });
  const adapter = new PrismaTiDBCloud(connection);
  const prisma = new PrismaClient({ adapter });
  const body = await req.json();

  try {
    const feedbackId = uuidv4();
    const timestamp = new Date().toISOString();
    const text = body.text || body.description || '';

    if (!text || !body.teamId) {
      return NextResponse.json({ 
        success: false, 
        message: "Text and teamId are required" 
      }, { status: 400 });
    }

    console.log(`[Collect] Processing feedback ${feedbackId}: "${text.slice(0, 50)}..."`);

    // Publish to Kafka for real-time streaming (non-blocking)
    let kafkaPublished = false;
    try {
      const feedbackMessage: FeedbackMessage = {
        id: feedbackId,
        teamId: body.teamId,
        originalText: text,
        rating: body.rate,
        timestamp,
        source: 'widget',
      };
      await publishFeedback(feedbackMessage);
      kafkaPublished = true;
      console.log(`[Kafka] Published feedback ${feedbackId}`);
    } catch (kafkaError) {
      console.warn('[Kafka] Failed to publish:', kafkaError);
    }

    // AI Analysis - Cultural Intelligence
    console.log(`[AI] Starting analysis for feedback ${feedbackId}...`);
    const analysis = await analyzeFeedback(text, body.rate);
    
    if (analysis) {
      console.log(`[AI] Analysis complete:`, {
        language: analysis.detected_language,
        sentiment: analysis.sentiment,
        hasTranslation: analysis.translated_text !== text,
      });
    } else {
      console.warn(`[AI] Analysis returned null for feedback ${feedbackId}`);
    }

    // Store feedback with cultural intelligence
    const feedbackStored = await prisma.feedback.create({
      data: {
        id: feedbackId,
        teamId: body.teamId,
        rate: body.rate,
        originalText: text,
        translatedText: analysis?.translated_text || text,
        detectedLanguage: analysis?.detected_language || 'en',
        sentiment: analysis?.sentiment || null, // Don't default to neutral!
        culturalNotes: analysis?.cultural_notes || null,
        summary: analysis?.summary || null,
        suggestions: analysis?.suggestions || null,
        streamSource: kafkaPublished ? 'kafka' : 'direct',
        processedAt: analysis ? new Date() : null,
      },
    });

    console.log(`[Collect] Feedback ${feedbackId} stored with sentiment: ${feedbackStored.sentiment}`);

    // Extract keywords (excluding stop words)
    const textForKeywords = analysis?.translated_text || text;
    const textSplitted = textForKeywords
      .toLowerCase()
      .replace(/[.,?!'"]/g, "")
      .split(/\s+/);

    for (const ts of textSplitted) {
      const word = ts.trim();
      if (word.length > 2 && !stopWords.includes(word)) {
        const wordTag = await prisma.feedbackTag.findFirst({
          where: { teamId: body.teamId, name: word },
        });

        if (wordTag) {
          await prisma.feedbackTag.update({
            where: { id: wordTag.id },
            data: { total: wordTag.total + 1 },
          });
        } else {
          await prisma.feedbackTag.create({
            data: { teamId: body.teamId, name: word, total: 1 },
          });
        }
      }
    }

    // Log stream event
    await prisma.streamEvent.create({
      data: {
        eventType: 'feedback_collected',
        payload: {
          feedbackId,
          teamId: body.teamId,
          sentiment: analysis?.sentiment,
          language: analysis?.detected_language,
          kafkaPublished,
          aiProcessed: !!analysis,
        },
        kafkaTopic: kafkaPublished ? KAFKA_TOPICS.FEEDBACK_RAW : null,
        status: 'processed',
        processedAt: new Date(),
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: "Feedback received with cultural intelligence", 
      data: {
        id: feedbackStored.id,
        sentiment: feedbackStored.sentiment,
        detectedLanguage: feedbackStored.detectedLanguage,
        translatedText: feedbackStored.translatedText,
        culturalNotes: feedbackStored.culturalNotes,
        streaming: { enabled: kafkaPublished, topic: KAFKA_TOPICS.FEEDBACK_RAW },
      }
    }, { status: 200 });
  } catch (error) {
    console.error('[Collect] Error:', error);
    return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 });
  }
}
