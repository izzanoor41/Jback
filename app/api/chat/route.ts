import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { PrismaClient } from "@prisma/client";
import { PrismaTiDBCloud } from "@tidbcloud/prisma-adapter";
import { connect } from "@tidbcloud/serverless";

export const maxDuration = 60;

const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages, team, session } = await req.json();

    // Fetch database feedback using team ID (same as feedback page)
    const { feedback, stats, byLanguage } = await fetchDatabaseFeedback(team?.id);

    console.log('Chat API - Team ID:', team?.id, '- Feedback count:', feedback.length);

    // Build feedback context
    const feedbackList = feedback.slice(0, 25).map((f: any, i: number) => {
      const lang = (f.detectedLanguage || '??').toUpperCase();
      const sent = (f.sentiment || 'neutral').toUpperCase();
      const rating = f.rate ? ` ⭐${f.rate}` : '';
      const text = (f.originalText || '').substring(0, 150);
      const trans = f.translatedText && f.translatedText !== f.originalText 
        ? `\n   → EN: "${f.translatedText.substring(0, 150)}"` : '';
      const cultural = f.culturalNotes ? `\n   💡 ${f.culturalNotes.substring(0, 100)}` : '';
      return `${i+1}. [${lang}] ${sent}${rating}: "${text}"${trans}${cultural}`;
    }).join('\n\n');

    const langStats = Object.entries(byLanguage).map(([lang, items]: [string, any]) => {
      const pos = items.filter((f: any) => f.sentiment === 'positive').length;
      const neg = items.filter((f: any) => f.sentiment === 'negative').length;
      return `${lang.toUpperCase()}: ${items.length} (+${pos} -${neg})`;
    }).join(' | ');

    const systemPrompt = `You are Jback AI - Cross-Cultural Business Intelligence Agent powered by Confluent Cloud real-time streaming.

## User: ${session?.user?.name || 'User'} | Team: ${team?.name || 'Default'}

## 📊 Real-Time Feedback Statistics
- **Total**: ${stats.total} feedback items
- **Positive**: ${stats.positive} (${stats.total > 0 ? Math.round(stats.positive/stats.total*100) : 0}%)
- **Neutral**: ${stats.neutral} (${stats.total > 0 ? Math.round(stats.neutral/stats.total*100) : 0}%)
- **Negative**: ${stats.negative} (${stats.total > 0 ? Math.round(stats.negative/stats.total*100) : 0}%)
- **Avg Rating**: ${stats.avgRating}/5
- **Languages**: ${stats.languages.join(', ') || 'None detected'}

## 🌍 Feedback by Language
${langStats || 'No language data'}

## 📝 Recent Feedback (from Confluent Stream)
${feedbackList || 'No feedback collected yet.'}

## 🎯 Instructions
- Chat naturally and be helpful
- When asked about feedback/data/analysis, use the real statistics above
- Explain cultural differences and communication styles when relevant
- Use markdown formatting (bold, tables, bullets)
- Be concise but informative
- Reference specific feedback examples when analyzing`;

    const response = await openaiClient.chat.completions.create({
      model: "gpt-4o-mini",
      stream: true,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);

  } catch (error: any) {
    console.error('Chat error:', error);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function fetchDatabaseFeedback(teamId?: string) {
  try {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      console.error('DATABASE_URL not set');
      return emptyResult();
    }

    const connection = connect({ url: dbUrl });
    const adapter = new PrismaTiDBCloud(connection);
    const prisma = new PrismaClient({ adapter });

    // Fetch feedback for the specific team (same query as feedback page)
    const feedback = await prisma.feedback.findMany({
      where: teamId ? { teamId } : {},
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        customer: true,
      },
    });

    console.log('DB Query - TeamId:', teamId, '- Results:', feedback.length);

    // Use 'rate' field (not 'rating') based on the feedback page code
    const withRating = feedback.filter(f => f.rate && f.rate > 0);
    const stats = {
      total: feedback.length,
      positive: feedback.filter(f => f.sentiment === 'positive').length,
      negative: feedback.filter(f => f.sentiment === 'negative').length,
      neutral: feedback.filter(f => f.sentiment === 'neutral').length,
      avgRating: withRating.length > 0 
        ? (withRating.reduce((a, f) => a + (f.rate || 0), 0) / withRating.length).toFixed(1)
        : '0.0',
      languages: [...new Set(feedback.map(f => f.detectedLanguage).filter(Boolean))] as string[],
    };

    const byLanguage: Record<string, any[]> = {};
    feedback.forEach(f => {
      const lang = f.detectedLanguage || 'unknown';
      if (!byLanguage[lang]) byLanguage[lang] = [];
      byLanguage[lang].push(f);
    });

    return { feedback, stats, byLanguage };
  } catch (error) {
    console.error('DB error:', error);
    return emptyResult();
  }
}

function emptyResult() {
  return {
    feedback: [],
    stats: { total: 0, positive: 0, negative: 0, neutral: 0, avgRating: '0.0', languages: [] },
    byLanguage: {},
  };
}
