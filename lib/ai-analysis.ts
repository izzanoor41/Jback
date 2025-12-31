import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_CLOUD_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');

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
 * Analyze feedback using Google Gemini
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

  // Try Gemini
  try {
    const result = await analyzeWithGemini(prompt);
    if (result && isValidAnalysis(result)) {
      console.log('[AI] Gemini analysis successful:', result.sentiment, result.detected_language);
      return result;
    }
  } catch (error) {
    console.error('[AI] Gemini failed:', error);
  }

  // Fallback: basic analysis
  return basicAnalysis(text, rating);
}

async function analyzeWithGemini(prompt: string): Promise<FeedbackAnalysis | null> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const content = response.text();
  
  return parseAIResponse(content);
}

function parseAIResponse(content: string): FeedbackAnalysis | null {
  try {
    let cleaned = content.replace(/```json\n?|\n?```/g, '').trim();
    
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    
    const parsed = JSON.parse(jsonMatch[0]);
    
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
  let detected_language = 'en';
  
  if (/[\u3040-\u309F\u30A0-\u30FF]/.test(text)) {
    detected_language = 'ja';
  } else if (/[\u4E00-\u9FFF]/.test(text)) {
    detected_language = 'zh';
  } else if (/[\uAC00-\uD7AF]/.test(text)) {
    detected_language = 'ko';
  } else if (/[\u0600-\u06FF]/.test(text)) {
    detected_language = 'ar';
  } else if (/[\u0900-\u097F]/.test(text)) {
    detected_language = 'hi';
  } else if (/[äöüßÄÖÜ]/.test(text)) {
    detected_language = 'de';
  } else if (/[éèêëàâùûôîïç]/.test(text)) {
    detected_language = 'fr';
  } else if (/[áéíóúñ¿¡]/.test(text)) {
    detected_language = 'es';
  } else if (/[ãõçáéíóú]/.test(text)) {
    detected_language = 'pt';
  }

  let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
  if (rating) {
    if (rating >= 4) sentiment = 'positive';
    else if (rating <= 2) sentiment = 'negative';
  }

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
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  return results;
}
