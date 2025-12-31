#!/usr/bin/env node

/**
 * RE-ANALYZE ALL FEEDBACK WITH AI
 * Script untuk menganalisis ulang semua feedback yang belum punya AI analysis
 */

const { PrismaClient } = require('@prisma/client');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const OpenAI = require('openai');

// Load env
require('dotenv').config();

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_CLOUD_API_KEY || '');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });

const ANALYSIS_PROMPT = `You are a Cultural Intelligence AI expert. Analyze this customer feedback carefully.

IMPORTANT RULES:
1. Detect the ACTUAL language (use ISO 639-1 codes: en, ja, id, de, fr, es, pt, zh, ko, ar, hi, etc.)
2. If NOT English, translate it accurately to English
3. Analyze sentiment based on the ACTUAL content and tone:
   - "positive" = happy, satisfied, praising, grateful, recommending
   - "negative" = angry, frustrated, complaining, disappointed, criticizing  
   - "neutral" = factual, asking questions, neither positive nor negative
4. Provide cultural context about communication style
5. Summarize the main point
6. Give actionable business suggestions

Feedback Text: "{TEXT}"
{RATING}

Respond with ONLY valid JSON (no markdown, no explanation):
{
  "detected_language": "xx",
  "translated_text": "English translation or original if already English",
  "sentiment": "positive|neutral|negative",
  "cultural_notes": "Cultural context about this feedback style",
  "summary": "One sentence summary",
  "suggestions": "What the business should do"
}`;

async function analyzeWithOpenAI(text, rating) {
  const prompt = ANALYSIS_PROMPT
    .replace('{TEXT}', text)
    .replace('{RATING}', rating ? `Rating given: ${rating}/5 stars` : '');

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a Cultural Intelligence AI. Respond only with valid JSON, no markdown.'
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
    });

    const content = response.choices[0]?.message?.content || '';
    
    // Clean and parse
    let cleaned = content.replace(/```json\n?|\n?```/g, '').trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (error) {
    console.error('OpenAI error:', error.message);
  }
  return null;
}

async function reanalyzeAllFeedback() {
  console.log('🚀 Starting re-analysis of all feedback...\n');

  try {
    // Get ALL feedback (not just unanalyzed)
    const feedbacks = await prisma.feedback.findMany({
      orderBy: { createdAt: 'desc' },
    });

    console.log(`📊 Found ${feedbacks.length} total feedback entries\n`);

    let analyzed = 0;
    let failed = 0;

    for (const feedback of feedbacks) {
      const text = feedback.originalText;
      if (!text) {
        console.log(`⏭️  Skipping ${feedback.id} - no text`);
        continue;
      }

      console.log(`\n🔍 Analyzing: "${text.slice(0, 50)}..."`);
      
      const analysis = await analyzeWithOpenAI(text, feedback.rate);
      
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
        console.log(`   ✅ ${analysis.detected_language.toUpperCase()} | ${analysis.sentiment.toUpperCase()}`);
        console.log(`   📝 "${analysis.translated_text.slice(0, 60)}..."`);
      } else {
        failed++;
        console.log(`   ❌ Analysis failed`);
      }

      // Delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('\n' + '='.repeat(50));
    console.log('🎉 RE-ANALYSIS COMPLETE!');
    console.log(`   ✅ Analyzed: ${analyzed}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log(`   📊 Total: ${feedbacks.length}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

reanalyzeAllFeedback();
