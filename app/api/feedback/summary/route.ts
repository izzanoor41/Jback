import { auth } from "@/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PrismaClient } from "@prisma/client";
import { PrismaTiDBCloud } from "@tidbcloud/prisma-adapter";
import { connect } from "@tidbcloud/serverless";
import { NextResponse } from "next/server";

// Initialize Google Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_CLOUD_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const connection = connect({ url: process.env.DATABASE_URL });
  const adapter = new PrismaTiDBCloud(connection);
  const prisma = new PrismaClient({ adapter });
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const teamId = searchParams.get("teamId");
  const sentiment = searchParams.get("sentiment");

  if (!teamId) {
    return NextResponse.json({ success: false, message: "Team ID required" }, { status: 400 });
  }

  let data;
  if (sentiment === "all") {
    data = await prisma.feedback.findMany({
      select: {
        originalText: true,
        translatedText: true,
        detectedLanguage: true,
        sentiment: true,
        culturalNotes: true,
      },
      where: { teamId },
      orderBy: { createdAt: "desc" },
      take: 40,
    });
  } else {
    data = await prisma.feedback.findMany({
      select: {
        originalText: true,
        translatedText: true,
        detectedLanguage: true,
        sentiment: true,
        culturalNotes: true,
      },
      where: { teamId, sentiment },
      orderBy: { createdAt: "desc" },
      take: 40,
    });
  }

  if (data.length === 0) {
    return NextResponse.json({ 
      success: true, 
      message: "No feedback found", 
      data: "No feedback data available for this filter." 
    });
  }

  const feedbacks = data.map((i) => {
    const text = i.translatedText || i.originalText || '';
    const lang = i.detectedLanguage || 'en';
    const cultural = i.culturalNotes ? ` [Cultural: ${i.culturalNotes}]` : '';
    return `- [${lang}] ${i.sentiment}: "${text}"${cultural}`;
  });

  const prompt = `You are a Cultural Intelligence AI analyzing customer feedback from multiple cultures and languages.

The following is a list of feedback from customers for a global business:
${feedbacks.join("\n")}

Please provide:
1. A concise summary (2-3 sentences) of the overall feedback themes
2. Key cultural insights observed across different languages/regions
3. Top 3 actionable recommendations for the business

Format your response in clear sections with headers.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ 
      success: true, 
      message: "Success to summarized data", 
      data: text 
    });
  } catch (error) {
    console.error('Summary generation error:', error);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to generate summary" 
    }, { status: 500 });
  }
}
