import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

// Initialize AI clients
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_CLOUD_API_KEY || '');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });

export interface FeedbackAnalysis {
  detected_language: string;
  translated_text: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  cultural_notes: string | null;
  summary: string;
  suggestions: string;
}

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

/**
 * Analyze feedback using Google Gemini (primary) with OpenAI fallback
 */
export async function analyzeFeedback(
  text: string, 
  rating?: number | null
): Promise<FeedbackAnalysis | null> {
  if (!text || text.trim().length === 0) {
    return null;
  }

  const prompt = ANALYSIS_PROMPT
    .replace('{TEXT}', text)
    .replace('{RATING}', rating ? `Rating given: ${rating}/5 stars` : '');

  // Try Gemini first
  try {
    const result = await analyzeWithGemini(prompt);
    if (result && isValidAnalysis(result)) {
      console.log('[AI] Gemini analysis successful:', result.sentiment, result.detected_language);
      return result;
    }
  } catch (error) {
    console.warn('[AI] Gemini failed, trying OpenAI:', error);
  }

  // Fallback to OpenAI
  try {
    const result = await analyzeWithOpenAI(prompt);
    if (result && isValidAnalysis(result)) {
      console.log('[AI] OpenAI analysis successful:', result.sentiment, result.detected_language);
      return result;
    }
  } catch (error) {
    console.error('[AI] OpenAI also failed:', error);
  }

  // Last resort: basic analysis
  return basicAnalysis(text, rating);
}

async function analyzeWithGemini(prompt: string): Promise<FeedbackAnalysis | null> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const content = response.text();
  
  return parseAIResponse(content);
}

async function analyzeWithOpenAI(prompt: string): Promise<FeedbackAnalysis | null> {
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
  return parseAIResponse(content);
}

function parseAIResponse(content: string): FeedbackAnalysis | null {
  try {
    // Clean markdown code blocks
    let cleaned = content.replace(/```json\n?|\n?```/g, '').trim();
    
    // Find JSON object
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    
    const parsed = JSON.parse(jsonMatch[0]);
    
    // Normalize sentiment
    if (parsed.sentiment) {
      parsed.sentiment = parsed.sentiment.toLowerCase().trim();
      if (!['positive', 'neutral', 'negative'].includes(parsed.sentiment)) {
        parsed.sentiment = 'neutral';
      }
    }
    
    return parsed as FeedbackAnalysis;
  } catch (error) {
    console.error('[AI] Failed to parse response:', error, content);
    return null;
  }
}

function isValidAnalysis(analysis: FeedbackAnalysis): boolean {
  return !!(
    analysis.detected_language &&
    analysis.translated_text &&
    analysis.sentiment &&
    ['positive', 'neutral', 'negative'].includes(analysis.sentiment)
  );
}

/**
 * Basic analysis fallback when AI fails
 */
function basicAnalysis(text: string, rating?: number | null): FeedbackAnalysis {
  // Simple language detection based on character sets
  let detected_language = 'en';
  
  if (/[\u3040-\u309F\u30A0-\u30FF]/.test(text)) {
    detected_language = 'ja'; // Japanese
  } else if (/[\u4E00-\u9FFF]/.test(text)) {
    detected_language = 'zh'; // Chinese
  } else if (/[\uAC00-\uD7AF]/.test(text)) {
    detected_language = 'ko'; // Korean
  } else if (/[\u0600-\u06FF]/.test(text)) {
    detected_language = 'ar'; // Arabic
  } else if (/[\u0900-\u097F]/.test(text)) {
    detected_language = 'hi'; // Hindi
  } else if (/[äöüßÄÖÜ]/.test(text)) {
    detected_language = 'de'; // German
  } else if (/[éèêëàâùûôîïç]/.test(text)) {
    detected_language = 'fr'; // French
  } else if (/[áéíóúñ¿¡]/.test(text)) {
    detected_language = 'es'; // Spanish
  } else if (/[ãõçáéíóú]/.test(text)) {
    detected_language = 'pt'; // Portuguese
  }

  // Simple sentiment based on rating
  let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
  if (rating) {
    if (rating >= 4) sentiment = 'positive';
    else if (rating <= 2) sentiment = 'negative';
  }

  // Check for obvious sentiment words
  const lowerText = text.toLowerCase();
  const positiveWords = ['great', 'excellent', 'amazing', 'love', 'best', 'awesome', 'fantastic', 'good', 'happy', 'thank', 'bagus', 'mantap', 'keren'];
  const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'worst', 'horrible', 'poor', 'angry', 'disappointed', 'jelek', 'buruk', 'kecewa'];
  
  if (positiveWords.some(w => lowerText.includes(w))) {
    sentiment = 'positive';
  } else if (negativeWords.some(w => lowerText.includes(w))) {
    sentiment = 'negative';
  }

  return {
    detected_language,
    translated_text: text,
    sentiment,
    cultural_notes: null,
    summary: text.slice(0, 100) + (text.length > 100 ? '...' : ''),
    suggestions: 'Please review this feedback manually.',
  };
}

/**
 * Batch analyze multiple feedbacks
 */
export async function analyzeFeedbackBatch(
  feedbacks: Array<{ id: string; text: string; rating?: number | null }>
): Promise<Map<string, FeedbackAnalysis>> {
  const results = new Map<string, FeedbackAnalysis>();
  
  for (const feedback of feedbacks) {
    const analysis = await analyzeFeedback(feedback.text, feedback.rating);
    if (analysis) {
      results.set(feedback.id, analysis);
    }
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  return results;
}
