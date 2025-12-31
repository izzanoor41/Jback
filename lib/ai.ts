/**
 * AI Service - Google Gemini
 * 
 * This module provides AI capabilities using Google Gemini.
 */

// Gemini API configuration
const GEMINI_API_KEY = process.env.GOOGLE_CLOUD_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

interface AIResponse {
  content: string;
  provider: "gemini";
  error?: string;
}

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

/**
 * Generate content using Gemini API
 */
async function generateWithGemini(prompt: string, systemPrompt?: string): Promise<string> {
  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

/**
 * Main AI generation function using Gemini
 */
export async function generateAIContent(
  prompt: string,
  systemPrompt?: string
): Promise<AIResponse> {
  if (!GEMINI_API_KEY) {
    return {
      content: "",
      provider: "gemini",
      error: "No Gemini API key configured",
    };
  }

  try {
    const content = await generateWithGemini(prompt, systemPrompt);
    return { content, provider: "gemini" };
  } catch (error) {
    console.error("Gemini failed:", error);
    return {
      content: "",
      provider: "gemini",
      error: "Gemini API failed",
    };
  }
}

/**
 * Chat completion with conversation history
 */
export async function chatCompletion(
  messages: ChatMessage[],
  systemPrompt?: string
): Promise<AIResponse> {
  const conversationText = messages
    .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
    .join("\n\n");

  const fullPrompt = `Previous conversation:\n${conversationText}\n\nPlease respond to the last user message.`;

  return generateAIContent(fullPrompt, systemPrompt);
}

/**
 * Analyze feedback with cultural intelligence
 */
export async function analyzeFeedback(feedback: {
  text: string;
  language?: string;
  rating?: number;
}): Promise<{
  sentiment: string;
  summary: string;
  culturalNotes: string;
  suggestions: string;
  translatedText?: string;
  provider: string;
}> {
  const systemPrompt = `You are a cultural intelligence AI that analyzes customer feedback.
Analyze the feedback and provide:
1. Sentiment (positive, neutral, or negative)
2. Brief summary (1-2 sentences)
3. Cultural notes (communication style, regional context)
4. Actionable suggestions for the business
5. English translation if not in English

Respond in JSON format:
{
  "sentiment": "positive|neutral|negative",
  "summary": "...",
  "culturalNotes": "...",
  "suggestions": "...",
  "translatedText": "..." (only if original is not English)
}`;

  const prompt = `Analyze this customer feedback:
Rating: ${feedback.rating || "N/A"}/5
Language: ${feedback.language || "Unknown"}
Text: "${feedback.text}"`;

  const response = await generateAIContent(prompt, systemPrompt);

  try {
    const jsonMatch = response.content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return { ...parsed, provider: response.provider };
    }
  } catch (e) {
    console.error("Failed to parse AI response as JSON:", e);
  }

  return {
    sentiment: "neutral",
    summary: response.content.slice(0, 200),
    culturalNotes: "",
    suggestions: "",
    provider: response.provider,
  };
}

/**
 * Stream chat response (for real-time chat UI)
 */
export async function streamChatResponse(
  messages: ChatMessage[],
  systemPrompt: string,
  onChunk: (chunk: string) => void
): Promise<{ provider: string }> {
  const response = await chatCompletion(messages, systemPrompt);
  onChunk(response.content);
  return { provider: response.provider };
}
