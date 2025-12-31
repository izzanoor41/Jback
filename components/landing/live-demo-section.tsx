"use client";

import { motion } from "framer-motion";
import { Globe, Zap, Brain } from "lucide-react";

export function LiveDemoSection() {
  const feedbackItems = [
    {
      flag: "🇯🇵",
      country: "Japan",
      original: "とても良い製品です！サポートも親切でした。",
      translation: "This is a great product! The support was also kind.",
      sentiment: "positive",
      culturalNote: "Japanese customers often understate satisfaction. This is actually very high praise.",
      confidence: 95,
    },
    {
      flag: "🇩🇪",
      country: "Germany",
      original: "Funktioniert wie erwartet. Könnte schneller sein.",
      translation: "Works as expected. Could be faster.",
      sentiment: "neutral",
      culturalNote: "German feedback is typically direct and factual. This indicates satisfaction with room for improvement.",
      confidence: 88,
    },
    {
      flag: "🇧🇷",
      country: "Brazil",
      original: "Adorei! Super rápido e fácil de usar! 💚",
      translation: "Loved it! Super fast and easy to use! 💚",
      sentiment: "positive",
      culturalNote: "Brazilian customers express emotions openly. The emoji and exclamation marks indicate genuine enthusiasm.",
      confidence: 97,
    },
  ];

  return (
    <section className="relative z-10 py-12 sm:py-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          {/* Glow behind */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-green-500/10 to-teal-500/10 rounded-2xl sm:rounded-3xl blur-3xl transform scale-95" />

          {/* Main Card */}
          <div className="relative feature-card-border rounded-2xl sm:rounded-3xl">
            <div className="bg-background/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-border/50">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                    <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base">Live Cultural Analysis</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">Real-time feedback processing</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 text-xs sm:text-sm font-medium w-fit">
                  <span className="streaming-dot" />
                  Streaming
                </div>
              </div>

              {/* Feedback Items */}
              <div className="space-y-3 sm:space-y-4">
                {feedbackItems.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.15 }}
                    className="group p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-muted/30 hover:bg-muted/50 transition-all border border-transparent hover:border-emerald-500/20"
                  >
                    {/* Mobile: Stack layout */}
                    <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                      {/* Flag & Country + Sentiment (mobile row) */}
                      <div className="flex items-center justify-between sm:block sm:text-center">
                        <div className="flex items-center gap-2 sm:block">
                          <div className="text-2xl sm:text-3xl sm:mb-1">{item.flag}</div>
                          <div className="text-xs text-muted-foreground">{item.country}</div>
                        </div>
                        {/* Sentiment - mobile only */}
                        <div className="sm:hidden">
                          <div
                            className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                              item.sentiment === "positive"
                                ? "bg-emerald-500/10 text-emerald-600"
                                : item.sentiment === "neutral"
                                ? "bg-amber-500/10 text-amber-600"
                                : "bg-red-500/10 text-red-600"
                            }`}
                          >
                            {item.sentiment}
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm text-muted-foreground mb-1 break-words">{item.original}</p>
                        <p className="font-medium text-sm sm:text-base mb-2 break-words">{item.translation}</p>
                        
                        {/* Cultural Note */}
                        <div className="flex items-start gap-2 p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                          <Brain className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-500 mt-0.5 shrink-0" />
                          <p className="text-xs text-muted-foreground">{item.culturalNote}</p>
                        </div>
                      </div>

                      {/* Sentiment & Confidence - desktop only */}
                      <div className="hidden sm:block text-right shrink-0">
                        <div
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 ${
                            item.sentiment === "positive"
                              ? "bg-emerald-500/10 text-emerald-600"
                              : item.sentiment === "neutral"
                              ? "bg-amber-500/10 text-amber-600"
                              : "bg-red-500/10 text-red-600"
                          }`}
                        >
                          {item.sentiment}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {item.confidence}% confidence
                        </div>
                      </div>
                    </div>
                    
                    {/* Confidence - mobile only */}
                    <div className="sm:hidden mt-2 text-right">
                      <span className="text-xs text-muted-foreground">{item.confidence}% confidence</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* AI Processing Indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
                className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2 sm:gap-3 text-muted-foreground text-xs sm:text-sm">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                  <span>AI analyzing cultural context...</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Zap className="w-3 h-3 text-emerald-500" />
                  Powered by Confluent Kafka
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
