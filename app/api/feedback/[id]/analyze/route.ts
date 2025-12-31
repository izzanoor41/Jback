import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { PrismaTiDBCloud } from "@tidbcloud/prisma-adapter";
import { connect } from "@tidbcloud/serverless";
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Google Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_CLOUD_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

function getPrismaClient() {
  const connection = connect({ url: process.env.DATABASE_URL });
  const adapter = new PrismaTiDBCloud(connection);
  return new PrismaClient({ adapter });
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  const prisma = getPrismaClient();
  
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get the feedback
    const feedback = await prisma.feedback.findUnique({
      where: { id },
    });

    if (!feedback) {
      return NextResponse.json({ success: false, message: "Feedback not found" }, { status: 404 });
    }

    const text = feedback.originalText || '';
    if (!text) {
      return NextResponse.json({ success: false, message: "No text to analyze" }, { status: 400 });
    }

    // Use Google Gemini for Cultural Intelligence Analysis
    const analysisPrompt = `You are a Cultural Intelligence AI. Analyze this customer feedback and provide:
1. Language detection (ISO 639-1 code, e.g., "en", "ja", "id", "de")
2. English translation (if not English, translate it accurately)
3. Sentiment classification (positive, neutral, or negative) - be accurate based on the actual content
4. Cultural notes about communication style and regional context
5. A brief summary of the main point
6. Actionable suggestions for the business

Feedback: "${text}"
${feedback.rate ? `Rating: ${feedback.rate}/5` : ''}

Respond ONLY with valid JSON (no markdown):
{
  "detected_language": "en",
  "translated_text": "...",
  "sentiment": "positive|neutral|negative",
  "cultural_notes": "...",
  "summary": "...",
  "suggestions": "..."
}`;

    let analysis = {
      detected_language: 'en',
      translated_text: text,
      sentiment: 'neutral',
      cultural_notes: null as string | null,
      summary: text.slice(0, 100),
      suggestions: 'Please review this feedback.',
    };

    try {
      const result = await model.generateContent(analysisPrompt);
      const response = await result.response;
      const content = response.text();
      
      // Clean and parse JSON
      const cleanContent = content.replace(/```json\n?|\n?```/g, "").trim();
      const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        analysis = { ...analysis, ...parsed };
      }
    } catch (aiError) {
      console.warn('[Gemini] Analysis failed:', aiError);
      return NextResponse.json({ success: false, message: "AI analysis failed" }, { status: 500 });
    }

    // Update feedback with AI analysis
    const updated = await prisma.feedback.update({
      where: { id },
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

    return NextResponse.json({ 
      success: true, 
      message: "Feedback analyzed successfully",
      data: updated,
    }, { status: 200 });

  } catch (error) {
    console.error('[Analyze] Error:', error);
    return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 });
  }
}
