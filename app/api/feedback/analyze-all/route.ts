import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { PrismaTiDBCloud } from "@tidbcloud/prisma-adapter";
import { connect } from "@tidbcloud/serverless";
import { NextResponse } from "next/server";
import { analyzeFeedback } from "@/lib/ai-analysis";

function getPrismaClient() {
  const connection = connect({ url: process.env.DATABASE_URL });
  const adapter = new PrismaTiDBCloud(connection);
  return new PrismaClient({ adapter });
}

export async function POST(req: Request) {
  const prisma = getPrismaClient();
  
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { teamId } = body;

    if (!teamId) {
      return NextResponse.json({ success: false, message: "Team ID required" }, { status: 400 });
    }

    // Get all feedback that needs analysis
    // - No sentiment (null)
    // - Or has sentiment but no cultural notes (might be from basic analysis)
    const feedbacks = await prisma.feedback.findMany({
      where: {
        teamId,
        OR: [
          { sentiment: null },
          { sentiment: 'neutral', culturalNotes: null, processedAt: null },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: 30, // Process up to 30 at a time
    });

    console.log(`[Analyze All] Found ${feedbacks.length} feedbacks to analyze for team ${teamId}`);

    if (feedbacks.length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: "All feedback already analyzed",
        analyzed: 0,
      }, { status: 200 });
    }

    let analyzed = 0;
    let failed = 0;
    const results: Array<{ id: string; sentiment: string; language: string }> = [];

    for (const feedback of feedbacks) {
      const text = feedback.originalText;
      if (!text) {
        console.log(`[Analyze All] Skipping ${feedback.id} - no text`);
        continue;
      }

      console.log(`[Analyze All] Processing ${feedback.id}: "${text.slice(0, 30)}..."`);
      
      try {
        const analysis = await analyzeFeedback(text, feedback.rate);
        
        if (analysis) {
          await prisma.feedback.update({
            where: { id: feedback.id },
            data: {
              translatedText: analysis.translated_text,
              detectedLanguage: analysis.detected_language,
              sentiment: analysis.sentiment,
              culturalNotes: analysis.cultural_notes,
              summary: analysis.summary,
              suggestions: analysis.suggestions,
              processedAt: new Date(),
            },
          });
          
          analyzed++;
          results.push({ 
            id: feedback.id, 
            sentiment: analysis.sentiment, 
            language: analysis.detected_language 
          });
          
          console.log(`[Analyze All] ✓ ${feedback.id}: ${analysis.sentiment} (${analysis.detected_language})`);
        } else {
          failed++;
          console.log(`[Analyze All] ✗ ${feedback.id}: analysis returned null`);
        }
      } catch (error) {
        failed++;
        console.error(`[Analyze All] ✗ ${feedback.id}:`, error);
      }

      // Delay between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log(`[Analyze All] Complete: ${analyzed} analyzed, ${failed} failed`);

    return NextResponse.json({ 
      success: true, 
      message: `Analyzed ${analyzed} feedback items${failed > 0 ? `, ${failed} failed` : ''}`,
      analyzed,
      failed,
      total: feedbacks.length,
      results,
    }, { status: 200 });

  } catch (error) {
    console.error('[Analyze All] Error:', error);
    return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 });
  }
}
