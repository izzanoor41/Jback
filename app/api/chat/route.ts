import { PrismaClient } from "@prisma/client";
import { PrismaTiDBCloud } from "@tidbcloud/prisma-adapter";
import { connect } from "@tidbcloud/serverless";
import { google } from "@ai-sdk/google";
import { streamText } from "ai";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { messages, team, session } = await req.json();

    // Fetch database feedback using team ID
    const { feedback, stats, byLanguage } = await fetchDatabaseFeedback(team?.id);

    console.log('Chat API - Team ID:', team?.id, '- Feedback count:', feedback.length);

    // Build feedback context
    const feedbackList = feedback.slice(0, 25).map((f: any, i: number) => {
      const lang = (f.detectedLanguage || '??').toUpperCase();
      const sent = (f.sentiment || 'neutral').toUpperCase();
      const rating = f.rate ? ` ⭐${f.rate}` : '';
      const text = (f.originalText || f.description || '').substring(0, 150);
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

    const systemPrompt = buildSystemPrompt(session, team, stats, langStats, feedbackList);

    // Use Vercel AI SDK with Google Gemini
    const result = await streamText({
      model: google('gemini-2.0-flash'),
      system: systemPrompt,
      messages,
      temperature: 0.7,
      maxTokens: 2048,
    });

    // Return streaming response compatible with useChat
    return result.toDataStreamResponse();

  } catch (error: any) {
    console.error('Chat error:', error);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

function buildSystemPrompt(session: any, team: any, stats: any, langStats: string, feedbackList: string) {
  return `You are Jback AI - Cross-Cultural Business Intelligence Agent powered by Google Gemini and Confluent Cloud real-time streaming.

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

    const feedback = await prisma.feedback.findMany({
      where: teamId ? { teamId } : {},
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: { customer: true },
    });

    console.log('DB Query - TeamId:', teamId, '- Results:', feedback.length);

    const withRating = feedback.filter(f => f.rate && f.rate > 0);
    const languages = Array.from(new Set(feedback.map(f => f.detectedLanguage).filter(Boolean))) as string[];
    
    const stats = {
      total: feedback.length,
      positive: feedback.filter(f => f.sentiment === 'positive').length,
      negative: feedback.filter(f => f.sentiment === 'negative').length,
      neutral: feedback.filter(f => f.sentiment === 'neutral').length,
      avgRating: withRating.length > 0 
        ? (withRating.reduce((a, f) => a + (f.rate || 0), 0) / withRating.length).toFixed(1)
        : '0.0',
      languages,
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
