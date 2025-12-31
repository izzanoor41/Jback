import { NextResponse } from "next/server";
import { analyzeFeedback } from "@/lib/ai-analysis";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text, rating } = body;

    if (!text) {
      return NextResponse.json({ 
        success: false, 
        message: "Text is required" 
      }, { status: 400 });
    }

    console.log(`[Test AI] Analyzing: "${text}"`);
    
    const startTime = Date.now();
    const analysis = await analyzeFeedback(text, rating);
    const duration = Date.now() - startTime;

    if (analysis) {
      return NextResponse.json({ 
        success: true, 
        message: "AI analysis successful",
        duration: `${duration}ms`,
        data: analysis,
      }, { status: 200 });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: "AI analysis returned null",
        duration: `${duration}ms`,
      }, { status: 500 });
    }
  } catch (error) {
    console.error('[Test AI] Error:', error);
    return NextResponse.json({ 
      success: false, 
      message: (error as Error).message 
    }, { status: 500 });
  }
}

export async function GET() {
  // Quick test with sample texts
  const testCases = [
    { text: "This product is amazing! Best purchase ever!", rating: 5 },
    { text: "Produk ini sangat bagus, saya sangat puas!", rating: 5 },
    { text: "この製品は素晴らしいです！とても満足しています。", rating: 4 },
    { text: "Das Produkt ist schrecklich, funktioniert nicht.", rating: 1 },
    { text: "C'est correct, rien de spécial.", rating: 3 },
  ];

  const results = [];
  
  for (const test of testCases) {
    try {
      const analysis = await analyzeFeedback(test.text, test.rating);
      results.push({
        input: test.text.slice(0, 30) + '...',
        rating: test.rating,
        result: analysis ? {
          language: analysis.detected_language,
          sentiment: analysis.sentiment,
          translated: analysis.translated_text.slice(0, 50) + '...',
        } : null,
        success: !!analysis,
      });
    } catch (error) {
      results.push({
        input: test.text.slice(0, 30) + '...',
        error: (error as Error).message,
        success: false,
      });
    }
    
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  const successCount = results.filter(r => r.success).length;
  
  return NextResponse.json({
    success: successCount === results.length,
    message: `${successCount}/${results.length} tests passed`,
    results,
  });
}
