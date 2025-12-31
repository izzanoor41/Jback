/**
 * AI Service - Gemini Primary with OpenAI Fallback
 * 
 * This module provides AI capabilities using Google Gemini as primary
 * and OpenAI as fallback for reliability.
 */

import OpenAI from "openai";

// Initialize OpenAI client (fallback)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Gemini API configuration
const GEMINI_API_KEY = process.env.GOOGLE_CLOUD_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

interface AIResponse {
  content: string;
  provider: "gemini" | "openai";
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
 * Generate content using OpenAI API (fallback)
 */
async function generateWithOpenAI(prompt: string, systemPrompt?: string): Promise<string> {
  const messages: any[] = [];
  
  if (systemPrompt) {
    messages.push({ role: "system", content: systemPrompt });
  }
  messages.push({ role: "user", content: prompt });

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages,
    temperature: 0.7,
    max_tokens: 2048,
  });

  return response.choices[0]?.message?.content || "";
}


/**
 * Main AI generation function with automatic fallback
 * Tries Gemini first, falls back to OpenAI if Gemini fails
 */
export async function generateAIContent(
  prompt: string,
  systemPrompt?: string
): Promise<AIResponse> {
  // Try Gemini first
  if (GEMINI_API_KEY) {
    try {
      const content = await generateWithGemini(prompt, systemPrompt);
      return { content, provider: "gemini" };
    } catch (error) {
      console.warn("Gemini failed, falling back to OpenAI:", error);
    }
  }

  // Fallback to OpenAI
  if (process.env.OPENAI_API_KEY) {
    try {
      const content = await generateWithOpenAI(prompt, systemPrompt);
      return { content, provider: "openai" };
    } catch (error) {
      console.error("OpenAI also failed:", error);
      return {
        content: "",
        provider: "openai",
        error: "Both AI providers failed",
      };
    }
  }

  return {
    content: "",
    provider: "gemini",
    error: "No AI API keys configured",
  };
}

/**
 * Chat completion with conversation history
 * Supports both Gemini and OpenAI with automatic fallback
 */
export async function chatCompletion(
  messages: ChatMessage[],
  systemPrompt?: string
): Promise<AIResponse> {
  // Convert messages to prompt format for Gemini
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
    // Try to parse JSON response
    const jsonMatch = response.content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return { ...parsed, provider: response.provider };
    }
  } catch (e) {
    console.error("Failed to parse AI response as JSON:", e);
  }

  // Fallback response
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
  // For streaming, we use OpenAI as it has better streaming support
  // Gemini streaming requires different implementation
  
  if (process.env.OPENAI_API_KEY) {
    try {
      const openaiMessages: any[] = [{ role: "system", content: systemPrompt }];
      messages.forEach((m) => {
        openaiMessages.push({ role: m.role, content: m.content });
      });

      const stream = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: openaiMessages,
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
          onChunk(content);
        }
      }

      return { provider: "openai" };
    } catch (error) {
      console.error("OpenAI streaming failed:", error);
    }
  }

  // Fallback to non-streaming Gemini
  const response = await chatCompletion(messages, systemPrompt);
  onChunk(response.content);
  return { provider: response.provider };
}

export { openai };
